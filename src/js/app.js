// AutoParts Pro - Main Application Orchestrator & Controller
// Product-grade modular architecture for Enterprise Auto Parts Inventory & Counter Management

import { sound } from './core/audio.js';
import { StorageManager } from './core/storage.js';
import { getBrandBadgeHtml, getCategoryBadgeHtml } from './ui/emblems.js';
import { showToast } from './ui/toast.js';
import { SUB_CATEGORIES_CONFIG } from './config/subcategories.js';

import { BarcodeEngine } from './modules/barcode.js';
import { ScannerEngine } from './modules/scanner.js';
import { SpeechEngine } from './modules/speech.js';
import { ReturnsManager } from './modules/returns.js';
import { PriceRevisionManager } from './modules/priceRevision.js';
import { TaxonomyManager } from './modules/taxonomy.js';
import { SettingsManager } from './modules/settings.js';
import { InventoryManager } from './modules/inventory.js';

class AutoPartsApp {
  constructor() {
    this.storage = StorageManager;
    this.sound = sound;

    // Core State
    this.products = this.storage.getProducts();
    this.vehicleBrands = this.storage.getVehicleBrands();
    this.categories = this.storage.getCategories();
    this.outflowLog = this.storage.getOutflows();
    this.defectiveReturns = this.storage.getDefectiveReturns();
    this.settings = this.storage.getSettings();

    // Filters State
    this.searchQuery = "";
    this.selectedBrand = "all";
    this.selectedCategory = "all";
    this.selectedSubCategory = "all";
    this.selectedStatusTab = "all";
    this.printingPart = null;

    // Batch Print Queue State (key: partId, value: { part, quantity })
    this.batchPrintQueue = new Map();

    // Helper functions on App instance for modules
    this.getBrandBadgeHtml = getBrandBadgeHtml;
    this.getCategoryBadgeHtml = getCategoryBadgeHtml;
    this.showToast = showToast;

    // Instantiate Sub-Engines & Modules
    this.barcodeEngine = new BarcodeEngine(this.settings);
    this.scannerEngine = new ScannerEngine((barcode, source) => this.handleBarcodeScanned(barcode, source), this);
    this.speechEngine = new SpeechEngine(
      (normalized, raw) => this.handleVoiceSearchResult(normalized, raw),
      (isListening, error) => this.handleVoiceSearchState(isListening, error)
    );
    this.returnsManager = new ReturnsManager(this);
    this.priceRevisionManager = new PriceRevisionManager(this);
    this.taxonomyManager = new TaxonomyManager(this);
    this.settingsManager = new SettingsManager(this);
    this.inventoryManager = new InventoryManager(this);
  }

  init() {
    this.settingsManager.applyTheme(this.settings.theme || 'midnight');
    this.sound.enabled = this.settings.soundEnabled !== false;

    // Render Initial UI
    this.renderBrandChips();
    this.renderCategoryChips();
    this.renderSubCategoryChips();
    this.renderProducts();
    this.updateHeaderStats();

    // Bind Event Listeners
    this.setupEventListeners();

    // Initialize Supabase Live Cloud Sync & Realtime Multi-Device WebSockets
    this.storage.initCloudSync(this);

    if (window.lucide) lucide.createIcons();
    console.log("🚀 AutoParts Pro Engine initialized with Live Supabase Cloud Sync.");
  }

  saveProducts() {
    this.storage.saveProducts(this.products);
  }

  formatCurrency(num) {
    const symbol = this.settings.currencySymbol || "₹";
    return `${symbol} ${(num || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  // Header Counters & Statistics
  updateHeaderStats() {
    const totalParts = this.products.length;
    const totalUnits = this.products.reduce((acc, p) => acc + this.inventoryManager.getTotalStock(p), 0);
    const totalGroundStash = this.products.reduce((acc, p) => acc + (Number(p.stockGroundFloor) || 0), 0);
    const inStockCount = this.products.filter(p => this.inventoryManager.getTotalStock(p) > 0).length;
    const lowStockCount = this.products.filter(p => {
      const s = this.inventoryManager.getTotalStock(p);
      const minAlert = (p.minStockAlert !== undefined && p.minStockAlert !== null) ? Number(p.minStockAlert) : 1;
      return s > 0 && s <= minAlert;
    }).length;
    const outOfStockCount = this.products.filter(p => this.inventoryManager.getTotalStock(p) === 0).length;

    const pendingDefectiveClaims = this.storage.getDefectiveReturns().filter(c => c.status === 'pending_wholesaler');
    const pendingClaimsCount = pendingDefectiveClaims.reduce((acc, c) => acc + (c.quantity || 1), 0);

    // Header Counter Stash & Defective badges
    const headerStashBadge = document.getElementById('ground-stash-header-badge');
    const elGroundStash = document.getElementById('ground-stash-count-num') || document.getElementById('header-ground-stash-count');
    const elClaimsBadge = document.getElementById('defective-pending-count') || document.getElementById('header-defective-claims-count');

    if (headerStashBadge) {
      if (totalGroundStash > 0) {
        headerStashBadge.classList.remove('hidden');
        headerStashBadge.classList.add('flex');
      } else {
        headerStashBadge.classList.add('hidden');
        headerStashBadge.classList.remove('flex');
      }
    }

    if (elGroundStash) elGroundStash.textContent = totalGroundStash;
    if (elClaimsBadge) elClaimsBadge.textContent = pendingClaimsCount;

    // Status Filter Tab Counters
    const tabAllCount = document.getElementById('tab-count-all');
    const tabGroundCount = document.getElementById('tab-count-stash') || document.getElementById('tab-count-ground-stash');
    const tabDefectiveCount = document.getElementById('tab-count-defective');
    const tabInStockCount = document.getElementById('tab-count-in');
    const tabLowStockCount = document.getElementById('tab-count-low') || document.getElementById('tab-count-low-stock');
    const tabOutStockCount = document.getElementById('tab-count-out') || document.getElementById('tab-count-out-stock');

    if (tabAllCount) tabAllCount.textContent = totalParts;
    if (tabGroundCount) tabGroundCount.textContent = totalGroundStash;
    if (tabDefectiveCount) tabDefectiveCount.textContent = pendingClaimsCount;
    if (tabInStockCount) tabInStockCount.textContent = inStockCount;
    if (tabLowStockCount) tabLowStockCount.textContent = lowStockCount;
    if (tabOutStockCount) tabOutStockCount.textContent = outOfStockCount;

    // Today's Sales Counter
    const todayStr = new Date().toLocaleDateString();
    const todaySales = this.outflowLog.filter(s => s.dateStr === todayStr);
    const todayTotalRevenue = todaySales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
    const todayItemCount = todaySales.reduce((acc, s) => acc + (s.quantity || 0), 0);

    const elTodaySales = document.getElementById('header-today-sales-count');
    const elTodayRev = document.getElementById('header-today-revenue');
    if (elTodaySales) elTodaySales.textContent = `${todayItemCount} pcs sold today`;
    if (elTodayRev) elTodayRev.textContent = this.formatCurrency(todayTotalRevenue);
  }

  // Brand Chips Quick Ribbon (Multi-Line Wrapping)
  renderBrandChips() {
    const container = document.getElementById('brand-chips-container');
    if (!container) return;

    const chipsHtml = this.vehicleBrands.map(brand => {
      const isSelected = this.selectedBrand.toLowerCase() === brand.id.toLowerCase();
      const badgeHtml = this.getBrandBadgeHtml(brand, isSelected);
      return `
        <button 
          data-brand-id="${brand.id}" 
          class="brand-chip btn-touch flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all border ${
            isSelected 
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20' 
              : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
          }"
        >
          ${badgeHtml}
          <span>${brand.name}</span>
        </button>
      `;
    }).join('');

    const addBtnHtml = `
      <button 
        id="btn-quick-manage-brands" 
        class="btn-touch flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-dashed border-amber-500/50 bg-amber-950/20 hover:bg-amber-950/50 text-amber-300 shadow-sm"
        title="Add new car brand / manufacturer (e.g. Mahindra, Tata, Kia)"
      >
        <i data-lucide="plus" class="w-3.5 h-3.5 text-amber-400"></i>
        <span>+ Add Brand</span>
      </button>
    `;

    container.innerHTML = chipsHtml + addBtnHtml;
    if (window.lucide) lucide.createIcons();
  }

  // Category Chips Quick Ribbon (Multi-Line Wrapping)
  renderCategoryChips() {
    const container = document.getElementById('category-chips-container');
    if (!container) return;

    const chipsHtml = this.categories.map(cat => {
      const isSelected = this.selectedCategory.toLowerCase() === cat.id.toLowerCase();
      const iconHtml = this.getCategoryBadgeHtml(cat, isSelected);
      return `
        <button 
          data-cat-id="${cat.id}" 
          class="cat-chip btn-touch flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all border ${
            isSelected 
              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20' 
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
          }"
        >
          ${iconHtml}
          <span>${cat.name}</span>
        </button>
      `;
    }).join('');

    const addBtnHtml = `
      <button 
        id="btn-quick-manage-categories" 
        class="btn-touch flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-dashed border-blue-500/50 bg-blue-950/20 hover:bg-blue-950/50 text-blue-300 shadow-sm"
        title="Add new auto part category (e.g. Engine Oils, Sensors, AC)"
      >
        <i data-lucide="plus" class="w-3.5 h-3.5 text-blue-400"></i>
        <span>+ Add Category</span>
      </button>
    `;

    container.innerHTML = chipsHtml + addBtnHtml;
    if (window.lucide) lucide.createIcons();
  }

  // Sub-Category Quick-Pills Ribbon
  renderSubCategoryChips() {
    const wrapper = document.getElementById('subcategory-wrapper');
    const container = document.getElementById('subcategory-chips-container');
    const breadcrumb = document.getElementById('active-drilldown-breadcrumb');
    if (!wrapper || !container || !breadcrumb) return;

    if (this.selectedCategory === 'all') {
      wrapper.classList.add('hidden');
      wrapper.classList.remove('flex');
      return;
    }

    const catKey = this.selectedCategory.toLowerCase();
    const subList = SUB_CATEGORIES_CONFIG[catKey];
    if (!subList || subList.length === 0) {
      wrapper.classList.add('hidden');
      wrapper.classList.remove('flex');
      return;
    }

    wrapper.classList.remove('hidden');
    wrapper.classList.add('flex');

    const brandObj = this.vehicleBrands.find(b => b.id.toLowerCase() === this.selectedBrand.toLowerCase());
    const brandName = brandObj ? brandObj.name : "All Brands";
    const catObj = this.categories.find(c => c.id.toLowerCase() === this.selectedCategory.toLowerCase());
    const catName = catObj ? catObj.name : this.selectedCategory;

    let subCatName = "All Types";
    if (this.selectedSubCategory !== 'all') {
      const subObj = subList.find(s => s.id === this.selectedSubCategory);
      if (subObj) subCatName = subObj.name;
    }

    // Breadcrumb HTML
    breadcrumb.innerHTML = `
      <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 font-bold">${brandName}</span>
      <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-500"></i>
      <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-300 font-bold">${catName}</span>
      <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-500"></i>
      <span class="px-2 py-0.5 rounded ${this.selectedSubCategory !== 'all' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black' : 'bg-slate-900 text-slate-400 font-semibold'}">
        ${subCatName}
      </span>
      ${this.selectedSubCategory !== 'all' ? `
        <button id="btn-clear-subcategory" class="ml-1 text-slate-400 hover:text-rose-400 text-xs flex items-center gap-0.5" title="Clear specific type">
          <i data-lucide="x-circle" class="w-3.5 h-3.5"></i>
          <span>Clear</span>
        </button>
      ` : ''}
    `;

    // Wrapped Multi-Line Chips
    const allIsSelected = this.selectedSubCategory === 'all';
    let chipsHtml = `
      <button 
        data-subcat-id="all" 
        class="subcat-chip btn-touch flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
          allIsSelected 
            ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm' 
            : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
        }"
      >
        <span>All ${catName}</span>
      </button>
    `;

    chipsHtml += subList.map(sub => {
      const isSelected = this.selectedSubCategory === sub.id;
      return `
        <button 
          data-subcat-id="${sub.id}" 
          class="subcat-chip btn-touch flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
            isSelected 
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20' 
              : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-amber-300'
          }"
        >
          <i data-lucide="${sub.icon || 'tag'}" class="w-3 h-3 ${isSelected ? 'text-slate-950' : 'text-amber-400'}"></i>
          <span>${sub.name}</span>
        </button>
      `;
    }).join('');

    container.innerHTML = chipsHtml;
    if (window.lucide) lucide.createIcons();
  }

  // Sub-Category Question Drilldown Modal
  openSubcategoryModal(catId = null) {
    const targetCatId = catId || this.selectedCategory;
    if (!targetCatId || targetCatId === 'all') return;

    const catKey = targetCatId.toLowerCase();
    const subList = SUB_CATEGORIES_CONFIG[catKey];
    if (!subList || subList.length === 0) return;

    const modal = document.getElementById('subcategory-modal');
    const modalTitle = document.getElementById('subcategory-modal-title');
    const brandTag = document.getElementById('subcategory-modal-brand-tag');
    const badgeEl = document.getElementById('subcategory-modal-badge');
    const gridEl = document.getElementById('subcategory-modal-options-grid');
    if (!modal || !gridEl) return;

    const brandObj = this.vehicleBrands.find(b => b.id.toLowerCase() === this.selectedBrand.toLowerCase());
    const brandName = brandObj ? brandObj.name : "All Brands";
    const catObj = this.categories.find(c => c.id.toLowerCase() === targetCatId.toLowerCase());
    const catName = catObj ? catObj.name : targetCatId;

    if (modalTitle) modalTitle.textContent = `Which ${catName}?`;
    if (brandTag) brandTag.textContent = brandName;
    if (badgeEl && catObj) {
      badgeEl.innerHTML = this.getCategoryBadgeHtml(catObj, true);
    }

    gridEl.innerHTML = subList.map(sub => {
      const matchingProducts = this.products.filter(p => {
        // 1. Filter by target Category
        const partCat = (p.category || '').toLowerCase();
        const catKey = targetCatId.toLowerCase();
        const catObj = this.categories.find(c => c.id.toLowerCase() === catKey);
        const catName = catObj ? catObj.name.toLowerCase() : catKey;
        if (partCat !== catName && !partCat.includes(catName) && !catName.includes(partCat)) {
          return false;
        }

        // 2. Filter by Vehicle Brand (if selected)
        if (this.selectedBrand !== 'all') {
          const pBrand = (p.vehicleBrand || '').toLowerCase();
          const bName = brandName.toLowerCase();
          if (pBrand !== bName && !pBrand.includes(bName) && !bName.includes(pBrand) && pBrand !== 'universal') {
            return false;
          }
        }

        // 3. Match Sub-Category
        const matchesSubId = (p.subCategory || '').toLowerCase() === sub.id.toLowerCase();
        const targetText = `${p.name} ${p.partNumber} ${p.category} ${(p.compatibleModels || []).join(' ')}`.toLowerCase();
        const matchesKeywords = (sub.keywords || []).some(kw => targetText.includes(kw.toLowerCase()));
        return matchesSubId || matchesKeywords;
      });

      const productCount = matchingProducts.length;
      const totalUnits = matchingProducts.reduce((acc, p) => acc + this.inventoryManager.getTotalStock(p), 0);

      const badgeHtml = productCount === 0
        ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 text-slate-500 border border-slate-800">0 Available</span>`
        : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">${productCount} ${productCount === 1 ? 'Product' : 'Products'} (${totalUnits} pcs)</span>`;

      return `
        <button 
          class="btn-select-subcat-option btn-touch p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 hover:border-amber-400 text-left transition-all flex items-center justify-between group shadow-md"
          data-subcat-id="${sub.id}"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i data-lucide="${sub.icon || 'tag'}" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="font-black text-slate-100 text-sm group-hover:text-amber-300">${sub.name}</div>
              <div class="text-[11px] text-slate-400 leading-tight">${sub.desc || ''}</div>
            </div>
          </div>
          <div class="text-right shrink-0">
            ${badgeHtml}
          </div>
        </button>
      `;
    }).join('');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }

  closeSubcategoryModal() {
    const modal = document.getElementById('subcategory-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  selectSubCategory(subCatId) {
    this.sound.playClick();
    this.selectedSubCategory = subCatId;
    this.closeSubcategoryModal();
    this.renderSubCategoryChips();
    this.renderProducts();

    const catKey = this.selectedCategory.toLowerCase();
    const subList = SUB_CATEGORIES_CONFIG[catKey] || [];
    const subObj = subList.find(s => s.id === subCatId);
    if (subObj) {
      this.showToast(`Filtered by: ${subObj.name}`, "success");
    }
  }

  // Clear Filters Controller
  updateClearFilterButtonsVisibility() {
    const topClearBtn = document.getElementById('clear-all-filters-top-btn');
    if (!topClearBtn) return;

    const hasActiveFilters = Boolean(
      this.searchQuery.trim().length > 0 ||
      this.selectedBrand !== "all" ||
      this.selectedCategory !== "all" ||
      this.selectedSubCategory !== "all" ||
      this.selectedStatusTab !== "all"
    );

    if (hasActiveFilters) {
      topClearBtn.classList.remove('hidden');
      topClearBtn.classList.add('flex');
    } else {
      topClearBtn.classList.add('hidden');
      topClearBtn.classList.remove('flex');
    }
  }

  clearAllFilters() {
    this.sound.playClick();
    this.searchQuery = "";
    this.selectedBrand = "all";
    this.selectedCategory = "all";
    this.selectedSubCategory = "all";
    this.selectedStatusTab = "all";

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = "";

    const statusTabs = document.querySelectorAll('.status-tab-btn');
    statusTabs.forEach(t => {
      if (t.dataset.tab === 'all') {
        t.classList.add('active', 'border-amber-400', 'text-amber-400', 'bg-amber-950/40');
        t.classList.remove('text-slate-400', 'border-transparent');
      } else {
        t.classList.remove('active', 'border-amber-400', 'text-amber-400', 'bg-amber-950/40');
        t.classList.add('text-slate-400', 'border-transparent');
      }
    });

    this.renderBrandChips();
    this.renderCategoryChips();
    this.renderSubCategoryChips();
    this.renderProducts();
    this.updateHeaderStats();
    this.updateClearFilterButtonsVisibility();
    this.showToast("All filters reset — showing full inventory", "success");
  }

  renderProducts() {
    this.inventoryManager.renderProducts();
  }

  // Barcode Scan Handler
  handleBarcodeScanned(barcode, source = 'Scanner') {
    if (!barcode) return;
    const cleanCode = barcode.trim();

    const matchedPart = this.products.find(p =>
      (p.barcode && p.barcode.toLowerCase() === cleanCode.toLowerCase()) ||
      p.partNumber.toLowerCase() === cleanCode.toLowerCase()
    );

    if (matchedPart) {
      this.inventoryManager.sellPart(matchedPart.id, 1);
      if (this.scannerEngine && this.scannerEngine.showLastScannedFeedback) {
        this.scannerEngine.showLastScannedFeedback(matchedPart, 1);
      }
      this.showToast(`[${source}] Auto-Sold 1x ${matchedPart.name}`, "success");
    } else {
      this.sound.playWarningBeep();
      this.showToast(`Unrecognized Barcode "${cleanCode}". Part not found in catalog!`, "error");
    }
  }

  // Voice Search Handler
  handleVoiceSearchResult(normalizedText, rawTranscript) {
    this.searchQuery = normalizedText;
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = normalizedText;
    this.sound.playSaleChime();
    this.showToast(`Voice Search: "${normalizedText}"`, "info");
    this.renderProducts();
  }

  handleVoiceSearchState(isListening, error) {
    const voiceBtn = document.getElementById('voice-search-btn');
    if (!voiceBtn) return;

    if (isListening) {
      voiceBtn.classList.add('bg-rose-600', 'text-white', 'animate-pulse');
      voiceBtn.classList.remove('bg-slate-800', 'text-slate-300');
    } else {
      voiceBtn.classList.remove('bg-rose-600', 'text-white', 'animate-pulse');
      voiceBtn.classList.add('bg-slate-800', 'text-slate-300');
      if (error && error !== 'no-speech') {
        this.showToast(`Voice error: ${error}`, "warning");
      }
    }
  }

  // Print Barcode Modal
  openBarcodePrintModal(partId, initialQty = 1) {
    this.sound.playClick();
    const part = this.products.find(p => p.id === partId);
    if (!part) return;

    this.printingPart = part;
    const modal = document.getElementById('print-barcode-modal');
    if (!modal) return;

    const qtyInput = document.getElementById('print-label-qty');
    if (qtyInput) qtyInput.value = initialQty || 1;

    this.barcodeEngine.renderStickersPreview(this.printingPart);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }

  closeBarcodePrintModal() {
    const modal = document.getElementById('print-barcode-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    this.printingPart = null;
  }

  // ================= BATCH PRINTING ENGINE & QUEUE CONTROLLER =================
  isPartInBatch(partId) {
    return this.batchPrintQueue.has(partId);
  }

  getBatchItemsList() {
    return Array.from(this.batchPrintQueue.values());
  }

  getBatchTotalStickersCount() {
    let total = 0;
    for (let item of this.batchPrintQueue.values()) {
      total += Math.max(1, parseInt(item.quantity, 10) || 1);
    }
    return total;
  }

  toggleBatchSelectPart(partId, initialQty = 1) {
    const part = this.products.find(p => p.id === partId);
    if (!part) return;

    if (this.batchPrintQueue.has(partId)) {
      this.batchPrintQueue.delete(partId);
      this.sound.playClick();
      this.showToast(`Removed "${part.name}" from Batch Print queue`, "info");
    } else {
      this.batchPrintQueue.set(partId, { part, quantity: initialQty || 1 });
      this.sound.playClick();
      this.showToast(`Added "${part.name}" to Batch Print queue (${this.batchPrintQueue.size} in batch)`, "success");
    }

    this.updateBatchFloatingBar();
    this.renderProducts();

    const batchModal = document.getElementById('batch-print-modal');
    if (batchModal && !batchModal.classList.contains('hidden')) {
      this.renderBatchModalList();
      this.renderBatchStickersPreview();
    }
  }

  addToBatchPrint(partId, qty = 1) {
    const part = this.products.find(p => p.id === partId);
    if (!part) return;

    const existing = this.batchPrintQueue.get(partId);
    const newQty = existing ? existing.quantity + qty : qty;
    this.batchPrintQueue.set(partId, { part, quantity: newQty });
    this.sound.playClick();
    this.showToast(`Added "${part.name}" (${newQty} stickers) to Batch Queue`, "success");

    this.updateBatchFloatingBar();
    this.renderProducts();

    const batchModal = document.getElementById('batch-print-modal');
    if (batchModal && !batchModal.classList.contains('hidden')) {
      this.renderBatchModalList();
      this.renderBatchStickersPreview();
    }
  }

  removeFromBatchPrint(partId) {
    const item = this.batchPrintQueue.get(partId);
    const name = item ? item.part.name : 'Product';
    this.batchPrintQueue.delete(partId);
    this.sound.playClick();
    this.showToast(`Removed "${name}" from Batch Queue`, "info");

    this.updateBatchFloatingBar();
    this.renderProducts();

    const batchModal = document.getElementById('batch-print-modal');
    if (batchModal && !batchModal.classList.contains('hidden')) {
      this.renderBatchModalList();
      this.renderBatchStickersPreview();
    }
  }

  updateBatchPrintQty(partId, qty) {
    const item = this.batchPrintQueue.get(partId);
    if (!item) return;

    item.quantity = Math.max(1, parseInt(qty, 10) || 1);
    this.updateBatchFloatingBar();
    this.renderBatchStickersPreview();
  }

  setAllBatchQuantities(qty) {
    const targetQty = Math.max(1, parseInt(qty, 10) || 1);
    for (let item of this.batchPrintQueue.values()) {
      item.quantity = targetQty;
    }
    this.sound.playClick();
    this.showToast(`Set all batch items to ${targetQty} sticker(s) each`, "info");
    this.updateBatchFloatingBar();
    this.renderBatchModalList();
    this.renderBatchStickersPreview();
  }

  selectAllFilteredParts() {
    const filtered = this.inventoryManager.getFilteredProducts();
    if (filtered.length === 0) {
      this.showToast("No visible parts to select!", "warning");
      return;
    }

    filtered.forEach(part => {
      if (!this.batchPrintQueue.has(part.id)) {
        this.batchPrintQueue.set(part.id, { part, quantity: 1 });
      }
    });

    this.sound.playSaleChime();
    this.showToast(`Selected ${filtered.length} parts for Batch Printing (${this.batchPrintQueue.size} in batch)!`, "success");
    this.updateBatchFloatingBar();
    this.renderProducts();

    const batchModal = document.getElementById('batch-print-modal');
    if (batchModal && !batchModal.classList.contains('hidden')) {
      this.renderBatchModalList();
      this.renderBatchStickersPreview();
    }
  }

  clearBatchPrintQueue() {
    this.batchPrintQueue.clear();
    this.sound.playClick();
    this.showToast("Batch Print Queue cleared", "info");
    this.updateBatchFloatingBar();
    this.renderProducts();

    const batchModal = document.getElementById('batch-print-modal');
    if (batchModal && !batchModal.classList.contains('hidden')) {
      this.renderBatchModalList();
      this.renderBatchStickersPreview();
    }
  }

  updateBatchFloatingBar() {
    const count = this.batchPrintQueue.size;
    const totalStickers = this.getBatchTotalStickersCount();

    const dock = document.getElementById('batch-action-bar');
    const headerCountBadge = document.getElementById('header-batch-print-count');
    const dockSelectedCount = document.getElementById('batch-dock-selected-count');
    const dockStickersCount = document.getElementById('batch-dock-stickers-count');
    const dockPrintText = document.getElementById('btn-dock-print-text');

    if (headerCountBadge) {
      headerCountBadge.textContent = count;
      if (count > 0) {
        headerCountBadge.classList.remove('bg-slate-700');
        headerCountBadge.classList.add('bg-blue-600', 'animate-pulse');
      } else {
        headerCountBadge.classList.add('bg-slate-700');
        headerCountBadge.classList.remove('bg-blue-600', 'animate-pulse');
      }
    }

    if (dock) {
      if (count > 0) {
        dock.classList.remove('hidden');
        dock.classList.add('flex');
      } else {
        dock.classList.add('hidden');
        dock.classList.remove('flex');
      }
    }

    if (dockSelectedCount) {
      dockSelectedCount.textContent = `${count} Part${count === 1 ? '' : 's'} Selected`;
    }

    if (dockStickersCount) {
      dockStickersCount.textContent = `${totalStickers} Sticker${totalStickers === 1 ? '' : 's'}`;
    }

    if (dockPrintText) {
      dockPrintText.textContent = `Review & Print Batch (${count})`;
    }
  }

  openBatchPrintModal() {
    this.sound.playClick();
    const modal = document.getElementById('batch-print-modal');
    if (!modal) return;

    this.renderBatchModalList();
    this.renderBatchStickersPreview();

    // Reset in-modal search input
    const searchInput = document.getElementById('batch-search-add-input');
    const suggestions = document.getElementById('batch-search-suggestions');
    if (searchInput) searchInput.value = '';
    if (suggestions) {
      suggestions.innerHTML = '';
      suggestions.classList.add('hidden');
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }

  closeBatchPrintModal() {
    const modal = document.getElementById('batch-print-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  renderBatchModalList() {
    const container = document.getElementById('batch-queue-items-list');
    const countLabel = document.getElementById('batch-items-count-label');
    const headerBadge = document.getElementById('batch-modal-header-badge');
    const totalCount = this.batchPrintQueue.size;
    const totalStickers = this.getBatchTotalStickersCount();

    if (countLabel) countLabel.textContent = `Queue (${totalCount} Products • ${totalStickers} Stickers)`;
    if (headerBadge) headerBadge.textContent = `${totalCount} Products (${totalStickers} Box Stickers)`;

    if (!container) return;

    if (totalCount === 0) {
      container.innerHTML = `
        <div class="p-6 text-center text-slate-400 bg-slate-900/60 rounded-xl border border-slate-800">
          <i data-lucide="layers" class="w-8 h-8 mx-auto mb-2 text-slate-500"></i>
          <div class="text-sm font-bold text-slate-200">Your Batch Print Queue is Empty</div>
          <p class="text-xs text-slate-400 mt-1">Use the search bar above or check products on cards to add items.</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const items = this.getBatchItemsList();
    container.innerHTML = items.map(item => {
      const part = item.part;
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const cipherCode = this.barcodeEngine.encodeCostToCipher(part.costPrice);
      const brandObj = this.vehicleBrands.find(b => b.name.toLowerCase() === (part.vehicleBrand || '').toLowerCase() || b.id.toLowerCase() === (part.vehicleBrand || '').toLowerCase()) || { id: part.vehicleBrand, name: part.vehicleBrand };
      const brandLogoHtml = this.getBrandBadgeHtml(brandObj, false, 'xs');

      return `
        <div class="batch-queue-row p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 flex items-center justify-between gap-3 transition-all" data-part-id="${part.id}">
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                ${brandLogoHtml}
                <span>${part.vehicleBrand}</span>
              </span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950/70 text-blue-300 border border-blue-800/40">
                ${part.partNumber}
              </span>
              <span class="text-[10px] text-slate-400 font-bold">📍 ${part.rackLocation || 'Rack A-01'}</span>
            </div>

            <div class="font-black text-slate-100 text-xs md:text-sm truncate mt-1">
              ${part.name}
            </div>

            <div class="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
              <span class="text-emerald-400 font-bold">₹ ${(part.sellingPrice || 0).toLocaleString('en-IN')}</span>
              <span>•</span>
              <span class="text-slate-500">Cipher: [ ${cipherCode} ]</span>
            </div>
          </div>

          <!-- Quantity Stepper & Remove Action -->
          <div class="flex items-center gap-2 shrink-0">
            <div class="flex items-center bg-slate-950 border border-slate-700 rounded-lg overflow-hidden">
              <button class="btn-batch-qty-minus w-7 h-7 flex items-center justify-center text-slate-300 hover:bg-slate-800 font-bold text-xs" data-part-id="${part.id}">-</button>
              <input type="number" class="batch-qty-input w-10 text-center font-bold font-mono bg-transparent text-slate-100 text-xs focus:outline-none" value="${qty}" min="1" max="100" data-part-id="${part.id}" />
              <button class="btn-batch-qty-plus w-7 h-7 flex items-center justify-center text-slate-300 hover:bg-slate-800 font-bold text-xs" data-part-id="${part.id}">+</button>
            </div>

            <button class="btn-batch-remove-item p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/80 text-rose-400 hover:text-rose-200 border border-rose-800/40 transition-all" data-part-id="${part.id}" title="Remove from batch">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>

        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  }

  renderBatchStickersPreview() {
    const items = this.getBatchItemsList();
    this.barcodeEngine.renderBatchStickersPreview(items, 'batch-stickers-render-area');

    const printBtnText = document.getElementById('btn-trigger-batch-print-text');
    const totalStickers = this.getBatchTotalStickersCount();
    if (printBtnText) {
      printBtnText.textContent = `PRINT ALL ${totalStickers} STICKER${totalStickers === 1 ? '' : 'S'} IN ONE GO`;
    }
  }

  printBatchDirectly() {
    const items = this.getBatchItemsList();
    if (items.length === 0) {
      this.sound.playWarningBeep();
      this.showToast("Cannot print empty batch! Please select parts first.", "warning");
      return;
    }

    const totalStickers = this.getBatchTotalStickersCount();
    this.barcodeEngine.printBatchStickersDirectly(items, 'batch-label');
    this.sound.playSaleChime();
    this.showToast(`🖨️ Streaming ${totalStickers} box stickers for ${items.length} products to printer!`, "success");
  }

  // Ground Floor Counter Stash Modal (Problem 2)
  openGroundStashModal() {
    this.sound.playClick();
    const modal = document.getElementById('ground-stash-modal');
    const container = document.getElementById('ground-stash-items-list') || document.getElementById('ground-stash-tbody');
    const totalEl = document.getElementById('ground-stash-modal-total');
    if (!modal) return;

    const stashParts = this.products.filter(p => (Number(p.stockGroundFloor) || 0) > 0);
    const totalUnits = stashParts.reduce((acc, p) => acc + (Number(p.stockGroundFloor) || 0), 0);

    if (totalEl) totalEl.textContent = `${totalUnits} Items Waiting on Ground Floor`;

    if (container) {
      if (stashParts.length === 0) {
        container.innerHTML = `
          <div class="p-8 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
            <i data-lucide="check-circle" class="w-10 h-10 mx-auto mb-2 text-emerald-400"></i>
            <div class="text-sm font-bold text-slate-200">Ground Floor Counter is Clean!</div>
            <div class="text-xs text-slate-500 mt-0.5">No customer-returned parts waiting on ground floor.</div>
          </div>
        `;
      } else {
        container.innerHTML = stashParts.map(p => `
          <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 flex items-center justify-between gap-3 transition-all">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-black text-slate-100 text-sm truncate">${p.name}</span>
                <span class="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shrink-0">
                  ${p.stockGroundFloor} pcs on counter
                </span>
              </div>
              <div class="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                <span>SKU: ${p.partNumber}</span>
                <span>•</span>
                <span class="text-amber-400 font-bold">Rack: ${p.rackLocation || 'Floor 1 - Rack A-01'}</span>
                <span>•</span>
                <span class="text-emerald-400 font-bold">${this.formatCurrency(p.sellingPrice)}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button 
                class="btn-stash-sell btn-touch px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1"
                data-part-id="${p.id}"
              >
                <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                <span>Sell Now</span>
              </button>
              <button 
                class="btn-stash-transfer btn-touch px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                data-part-id="${p.id}"
                title="Carry item back upstairs to its designated rack"
              >
                <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
                <span>Carry Upstairs</span>
              </button>
            </div>
          </div>
        `).join('');

        container.querySelectorAll('.btn-stash-sell').forEach(btn => {
          btn.addEventListener('click', () => {
            this.inventoryManager.sellPart(btn.dataset.partId, 1);
            this.openGroundStashModal();
          });
        });

        container.querySelectorAll('.btn-stash-transfer').forEach(btn => {
          btn.addEventListener('click', () => {
            this.returnsManager.transferToUpstairs(btn.dataset.partId);
            this.openGroundStashModal();
          });
        });
      }
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }

  closeGroundStashModal() {
    const modal = document.getElementById('ground-stash-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  transferAllStashUpstairs() {
    const stashParts = this.products.filter(p => (Number(p.stockGroundFloor) || 0) > 0);
    if (stashParts.length === 0) {
      this.showToast("No items currently waiting on ground floor counter.", "info");
      return;
    }

    let movedCount = 0;
    stashParts.forEach(p => {
      const qty = Number(p.stockGroundFloor) || 0;
      p.stockFloor1 = (Number(p.stockFloor1) || 0) + qty;
      p.stockGroundFloor = 0;
      movedCount += qty;
    });

    this.saveProducts();
    this.sound.playTransferChime();
    this.showToast(`Restocked all ${movedCount} items from ground counter to upstairs racks!`, "success");
    this.renderProducts();
    this.updateHeaderStats();
    this.openGroundStashModal();
  }

  // Daily Outflow Ledger Modal (Problem 1)
  openDailyOutflowModal(dateFilter = 'today') {
    this.sound.playClick();
    const modal = document.getElementById('daily-outflow-modal');
    if (!modal) return;

    this.renderOutflowTableWithFilter(dateFilter);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }

  closeDailyOutflowModal() {
    const modal = document.getElementById('daily-outflow-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  renderOutflowTableWithFilter(dateFilter = 'today') {
    const tbody = document.getElementById('outflow-log-tbody');
    const totalEl = document.getElementById('modal-outflow-total-rev') || document.getElementById('modal-today-revenue');
    const totalItemsEl = document.getElementById('modal-outflow-total-items') || document.getElementById('modal-today-units');
    const totalCountEl = document.getElementById('modal-outflow-total-count');

    this.outflowLog = this.storage.getOutflows();
    const todayStr = new Date().toLocaleDateString();
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString();

    let filtered = this.outflowLog;
    if (dateFilter === 'today') {
      filtered = this.outflowLog.filter(l => l.dateStr === todayStr);
    } else if (dateFilter === 'yesterday') {
      filtered = this.outflowLog.filter(l => l.dateStr === yesterdayStr);
    }

    const totalRevenue = filtered.reduce((acc, l) => acc + (Number(l.totalAmount) || 0), 0);
    const totalUnits = filtered.reduce((acc, l) => acc + (Number(l.quantity) || 1), 0);

    if (totalEl) totalEl.textContent = this.formatCurrency(totalRevenue);
    if (totalItemsEl) totalItemsEl.textContent = `${totalUnits} pcs`;
    if (totalCountEl) totalCountEl.textContent = `${filtered.length} sales`;

    // Highlight active filter button
    document.querySelectorAll('.outflow-date-filter-btn').forEach(btn => {
      if (btn.dataset.filter === dateFilter) {
        btn.className = "outflow-date-filter-btn px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs";
      } else {
        btn.className = "outflow-date-filter-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs";
      }
    });

    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="p-8 text-center text-slate-400">
              <i data-lucide="book-open" class="w-10 h-10 mx-auto mb-2 text-slate-600"></i>
              <div class="text-sm font-bold text-slate-200">No Sales Logged for ${dateFilter.toUpperCase()}</div>
              <div class="text-xs text-slate-500 mt-0.5">Sales made via Quick Sell or Barcode Scan appear here instantly.</div>
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = filtered.map(l => `
          <tr class="hover:bg-slate-800/40 font-mono text-xs border-b border-slate-800/60">
            <td class="p-2.5 text-slate-400 whitespace-nowrap">${l.timeStr || l.dateStr}</td>
            <td class="p-2.5 font-bold text-slate-100 font-sans">
              <div>${l.partName}</div>
              <div class="text-[10px] text-slate-400 font-mono">${l.partNumber || ''} • ${l.brand || ''}</div>
            </td>
            <td class="p-2.5 text-center font-bold text-amber-400">${l.quantity}x</td>
            <td class="p-2.5 text-right text-slate-300 font-mono">${this.formatCurrency(l.unitPrice || (l.totalAmount / (l.quantity || 1)))}</td>
            <td class="p-2.5 text-right font-bold text-emerald-400 font-mono">${this.formatCurrency(l.totalAmount || 0)}</td>
            <td class="p-2.5 text-[11px] text-slate-400 font-sans">${l.notes || 'Counter Sale'}</td>
            <td class="p-2.5 text-center no-print">
              <button 
                class="btn-open-return-from-log btn-touch px-2 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 rounded text-[10px] font-bold"
                data-part-id="${l.partId}"
                title="Customer returning this sold part"
              >
                Return
              </button>
            </td>
          </tr>
        `).join('');

        tbody.querySelectorAll('.btn-open-return-from-log').forEach(btn => {
          btn.addEventListener('click', () => {
            this.closeDailyOutflowModal();
            this.returnsManager.openCustomerReturnModal(btn.dataset.partId);
          });
        });
      }
    }

    if (window.lucide) lucide.createIcons();
  }

  exportOutflowCSV() {
    this.outflowLog = this.storage.getOutflows();
    if (this.outflowLog.length === 0) {
      this.showToast("No sales records to export!", "warning");
      return;
    }

    const headers = ["Transaction ID", "Date", "Time", "Part Name", "Part Number", "Brand", "Quantity", "Unit Price", "Total Amount", "Source / Rack Location"];
    const rows = this.outflowLog.map(l => [
      l.id,
      l.dateStr,
      l.timeStr,
      `"${(l.partName || '').replace(/"/g, '""')}"`,
      `"${(l.partNumber || '').replace(/"/g, '""')}"`,
      `"${(l.brand || '').replace(/"/g, '""')}"`,
      l.quantity,
      l.unitPrice,
      l.totalAmount,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `daily_sales_outflow_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    this.showToast("Daily Sales Outflow CSV downloaded!", "success");
  }

  printOutflowLedger() {
    window.print();
  }

  // Event Listeners Binding
  setupEventListeners() {
    // Search input typing
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle('hidden', this.searchQuery.length === 0);
        }
        this.renderProducts();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        this.searchQuery = '';
        if (searchInput) searchInput.value = '';
        clearSearchBtn.classList.add('hidden');
        this.renderProducts();
      });
    }

    // Clear All Filters Buttons
    const topClearAllBtn = document.getElementById('clear-all-filters-top-btn');
    if (topClearAllBtn) {
      topClearAllBtn.addEventListener('click', () => this.clearAllFilters());
    }

    // Voice Search
    const voiceBtn = document.getElementById('voice-search-btn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => this.speechEngine.toggle());
    }

    // Brand Chips
    const brandContainer = document.getElementById('brand-chips-container');
    if (brandContainer) {
      brandContainer.addEventListener('click', (e) => {
        const addBtn = e.target.closest('#btn-quick-manage-brands');
        if (addBtn) {
          this.taxonomyManager.openTaxonomyModal('brands');
          return;
        }

        const chip = e.target.closest('.brand-chip');
        if (!chip) return;
        this.sound.playClick();
        this.selectedBrand = chip.dataset.brandId;
        this.renderBrandChips();
        this.renderSubCategoryChips();
        this.renderProducts();
      });
    }

    // Category Chips
    const catContainer = document.getElementById('category-chips-container');
    if (catContainer) {
      catContainer.addEventListener('click', (e) => {
        const addBtn = e.target.closest('#btn-quick-manage-categories');
        if (addBtn) {
          this.taxonomyManager.openTaxonomyModal('categories');
          return;
        }

        const chip = e.target.closest('.cat-chip');
        if (!chip) return;
        this.sound.playClick();
        const catId = chip.dataset.catId;
        this.selectedCategory = catId;
        this.selectedSubCategory = "all";
        this.renderCategoryChips();
        this.renderSubCategoryChips();
        this.renderProducts();

        if (catId !== 'all' && SUB_CATEGORIES_CONFIG[catId.toLowerCase()]) {
          this.openSubcategoryModal(catId);
        }
      });
    }

    // Subcategory Ribbon & Modal
    const subcatWrapper = document.getElementById('subcategory-wrapper');
    if (subcatWrapper) {
      subcatWrapper.addEventListener('click', (e) => {
        const chip = e.target.closest('.subcat-chip');
        if (chip) {
          this.selectSubCategory(chip.dataset.subcatId);
          return;
        }

        const clearBtn = e.target.closest('#btn-clear-subcategory');
        if (clearBtn) {
          this.selectSubCategory('all');
          return;
        }
      });
    }

    const reopenSubcatBtn = document.getElementById('btn-reopen-subcategory-modal');
    if (reopenSubcatBtn) {
      reopenSubcatBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.openSubcategoryModal();
      });
    }

    const closeSubcatBtn = document.getElementById('close-subcategory-modal-btn');
    if (closeSubcatBtn) {
      closeSubcatBtn.addEventListener('click', () => this.closeSubcategoryModal());
    }

    const subcatOptionsGrid = document.getElementById('subcategory-modal-options-grid');
    if (subcatOptionsGrid) {
      subcatOptionsGrid.addEventListener('click', (e) => {
        const optionBtn = e.target.closest('.btn-select-subcat-option');
        if (optionBtn) {
          this.selectSubCategory(optionBtn.dataset.subcatId);
        }
      });
    }

    // Status Filter Tabs
    const statusTabs = document.querySelectorAll('.status-tab-btn');
    statusTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.sound.playClick();
        statusTabs.forEach(t => {
          t.classList.remove('active', 'border-amber-400', 'text-amber-400', 'bg-amber-950/40');
          t.classList.add('text-slate-400', 'border-transparent');
        });
        tab.classList.add('active', 'border-amber-400', 'text-amber-400', 'bg-amber-950/40');
        tab.classList.remove('text-slate-400', 'border-transparent');

        this.selectedStatusTab = tab.dataset.tab;
        this.renderProducts();
      });
    });

    // Product Cards Action Delegation
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
      productsGrid.addEventListener('click', (e) => {
        const batchToggleBtn = e.target.closest('.btn-toggle-batch-select');
        if (batchToggleBtn) {
          const partId = batchToggleBtn.dataset.partId;
          this.toggleBatchSelectPart(partId);
          return;
        }

        const quickSellBtn = e.target.closest('.btn-quick-sell');
        if (quickSellBtn) {
          const partId = quickSellBtn.dataset.partId;
          this.inventoryManager.sellPart(partId, 1);
          return;
        }

        const customerReturnBtn = e.target.closest('.btn-customer-return');
        if (customerReturnBtn) {
          const partId = customerReturnBtn.dataset.partId;
          this.returnsManager.openCustomerReturnModal(partId);
          return;
        }

        const printLabelBtn = e.target.closest('.btn-print-part-label');
        if (printLabelBtn) {
          const partId = printLabelBtn.dataset.partId;
          this.openBarcodePrintModal(partId);
          return;
        }

        const editBtn = e.target.closest('.btn-edit-part');
        if (editBtn) {
          const partId = editBtn.dataset.partId;
          this.inventoryManager.openAddPartModal(partId);
          return;
        }

        const deleteBtn = e.target.closest('.btn-delete-part');
        if (deleteBtn) {
          const partId = deleteBtn.dataset.partId;
          this.inventoryManager.confirmDeletePart(partId);
          return;
        }

        const transferUpstairsBtn = e.target.closest('.btn-transfer-upstairs');
        if (transferUpstairsBtn) {
          const partId = transferUpstairsBtn.dataset.partId;
          this.returnsManager.transferToUpstairs(partId);
          return;
        }

        const openClaimsBtn = e.target.closest('.btn-open-claims-modal');
        if (openClaimsBtn) {
          this.returnsManager.openDefectiveClaimsModal('pending');
          return;
        }

        const clearEmptyBtn = e.target.closest('#clear-all-filters-empty-btn');
        if (clearEmptyBtn) {
          this.clearAllFilters();
          return;
        }
      });
    }

    // Theme Toggle Button in Header
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => this.settingsManager.toggleThemeMode());
    }

    // Ground Stash & Daily Outflow Header Buttons
    const openStashBtn = document.getElementById('ground-stash-header-badge');
    if (openStashBtn) {
      openStashBtn.addEventListener('click', () => this.openGroundStashModal());
    }

    const closeStashBtn = document.getElementById('close-stash-modal-btn');
    if (closeStashBtn) {
      closeStashBtn.addEventListener('click', () => this.closeGroundStashModal());
    }

    const transferAllStashBtn = document.getElementById('transfer-all-stash-btn');
    if (transferAllStashBtn) {
      transferAllStashBtn.addEventListener('click', () => this.transferAllStashUpstairs());
    }

    const openOutflowBtn = document.getElementById('open-outflow-modal-btn');
    if (openOutflowBtn) {
      openOutflowBtn.addEventListener('click', () => this.openDailyOutflowModal('today'));
    }

    const closeOutflowBtn = document.getElementById('close-outflow-modal-btn');
    if (closeOutflowBtn) {
      closeOutflowBtn.addEventListener('click', () => this.closeDailyOutflowModal());
    }

    document.querySelectorAll('.outflow-date-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.sound.playClick();
        this.openDailyOutflowModal(btn.dataset.filter || 'today');
      });
    });

    const printOutflowBtn = document.getElementById('print-outflow-ledger-btn');
    if (printOutflowBtn) {
      printOutflowBtn.addEventListener('click', () => this.printOutflowLedger());
    }

    const exportOutflowCsvBtn = document.getElementById('export-outflow-csv-btn');
    if (exportOutflowCsvBtn) {
      exportOutflowCsvBtn.addEventListener('click', () => this.exportOutflowCSV());
    }

    // Add Part Modal
    const openAddPartBtn = document.getElementById('open-add-part-btn') || document.getElementById('open-add-part-modal-btn');
    if (openAddPartBtn) {
      openAddPartBtn.addEventListener('click', () => this.inventoryManager.openAddPartModal());
    }

    const closeAddPartBtn = document.getElementById('close-add-part-btn');
    if (closeAddPartBtn) {
      closeAddPartBtn.addEventListener('click', () => this.inventoryManager.closeAddPartModal());
    }

    const addPartForm = document.getElementById('add-part-form');
    if (addPartForm) {
      addPartForm.addEventListener('submit', (e) => this.inventoryManager.savePartFromForm(e));
    }

    const btnGenerateBarcode = document.getElementById('btn-generate-part-barcode');
    if (btnGenerateBarcode) {
      btnGenerateBarcode.addEventListener('click', () => {
        const uniqueBarcode = this.inventoryManager.generateUniqueBarcode();
        const barcodeInput = document.getElementById('form-part-barcode');
        if (barcodeInput) {
          barcodeInput.value = uniqueBarcode;
          barcodeInput.classList.add('border-emerald-400', 'bg-emerald-950/40');
          setTimeout(() => {
            barcodeInput.classList.remove('border-emerald-400', 'bg-emerald-950/40');
          }, 800);
        }
        this.sound.playClick();
        this.showToast(`✨ Generated unique barcode: ${uniqueBarcode}`, "success");
      });
    }

    const deleteCurrentPartBtn = document.getElementById('btn-delete-current-part');
    if (deleteCurrentPartBtn) {
      deleteCurrentPartBtn.addEventListener('click', (e) => {
        const partId = e.currentTarget.dataset.partId || document.getElementById('form-part-id').value;
        if (partId) {
          this.inventoryManager.confirmDeletePart(partId);
        }
      });
    }

    const formVehBrandSelect = document.getElementById('form-vehicle-brand');
    if (formVehBrandSelect) {
      formVehBrandSelect.addEventListener('change', (e) => {
        if (e.target.value === '__NEW_BRAND__') {
          this.taxonomyManager.openTaxonomyModal('brands');
        }
      });
    }

    const formCatSelect = document.getElementById('form-category');
    if (formCatSelect) {
      formCatSelect.addEventListener('change', (e) => {
        if (e.target.value === '__NEW_CATEGORY__') {
          this.taxonomyManager.openTaxonomyModal('categories');
        }
      });
    }

    // Barcode Sticker Print Modal Controls
    const closePrintModalBtn = document.getElementById('close-print-barcode-modal-btn');
    if (closePrintModalBtn) {
      closePrintModalBtn.addEventListener('click', () => this.closeBarcodePrintModal());
    }

    const qtyInput = document.getElementById('print-label-qty');
    const qtyPlusBtn = document.getElementById('btn-label-qty-plus');
    const qtyMinusBtn = document.getElementById('btn-label-qty-minus');
    const labelSizeSelect = document.getElementById('print-label-size');
    const labelStyleSelect = document.getElementById('print-label-style');
    const headerStyleSelect = document.getElementById('print-header-style');
    const customWidthInput = document.getElementById('custom-sticker-width');
    const customHeightInput = document.getElementById('custom-sticker-height');
    const triggerPrintBtn = document.getElementById('btn-trigger-print-labels');

    if (qtyPlusBtn && qtyInput) {
      qtyPlusBtn.addEventListener('click', () => {
        qtyInput.value = Math.min(100, (parseInt(qtyInput.value, 10) || 1) + 1);
        if (this.printingPart) this.barcodeEngine.renderStickersPreview(this.printingPart);
      });
    }

    if (qtyMinusBtn && qtyInput) {
      qtyMinusBtn.addEventListener('click', () => {
        qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
        if (this.printingPart) this.barcodeEngine.renderStickersPreview(this.printingPart);
      });
    }

    [qtyInput, labelSizeSelect, labelStyleSelect, headerStyleSelect, customWidthInput, customHeightInput].forEach(el => {
      if (el) {
        el.addEventListener('input', () => {
          if (this.printingPart) this.barcodeEngine.renderStickersPreview(this.printingPart);
        });
        el.addEventListener('change', () => {
          if (this.printingPart) this.barcodeEngine.renderStickersPreview(this.printingPart);
        });
      }
    });

    if (triggerPrintBtn) {
      triggerPrintBtn.addEventListener('click', () => {
        if (this.printingPart) this.barcodeEngine.printStickersDirectly(this.printingPart);
      });
    }

    // Single Barcode Print Modal: Add to Batch Button
    const btnAddCurrentToBatch = document.getElementById('btn-add-current-to-batch');
    if (btnAddCurrentToBatch) {
      btnAddCurrentToBatch.addEventListener('click', () => {
        if (!this.printingPart) return;
        const qty = parseInt(qtyInput?.value || 1, 10) || 1;
        this.addToBatchPrint(this.printingPart.id, qty);
        this.closeBarcodePrintModal();
      });
    }

    // Header Batch Print Button
    const headerBatchBtn = document.getElementById('open-batch-print-btn');
    if (headerBatchBtn) {
      headerBatchBtn.addEventListener('click', () => this.openBatchPrintModal());
    }

    // Search Bar: Select All Visible / Filtered Button
    const btnSelectAllFiltered = document.getElementById('btn-select-all-filtered');
    if (btnSelectAllFiltered) {
      btnSelectAllFiltered.addEventListener('click', () => this.selectAllFilteredParts());
    }

    // Floating Batch Dock Buttons
    const dockOpenBatchModalBtn = document.getElementById('btn-dock-open-batch-modal');
    if (dockOpenBatchModalBtn) {
      dockOpenBatchModalBtn.addEventListener('click', () => this.openBatchPrintModal());
    }

    const dockClearBatchBtn = document.getElementById('btn-dock-clear-batch');
    if (dockClearBatchBtn) {
      dockClearBatchBtn.addEventListener('click', () => this.clearBatchPrintQueue());
    }

    document.querySelectorAll('.btn-dock-quick-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qty = parseInt(e.currentTarget.dataset.qty, 10) || 1;
        this.setAllBatchQuantities(qty);
      });
    });

    // ================= BATCH PRINT MODAL CONTROLS & LISTENERS =================
    const closeBatchModalBtn = document.getElementById('close-batch-print-modal-btn');
    if (closeBatchModalBtn) {
      closeBatchModalBtn.addEventListener('click', () => this.closeBatchPrintModal());
    }

    const batchClearAllBtn = document.getElementById('btn-batch-modal-clear-all');
    if (batchClearAllBtn) {
      batchClearAllBtn.addEventListener('click', () => this.clearBatchPrintQueue());
    }

    const triggerBatchPrintBtn = document.getElementById('btn-trigger-batch-print-labels');
    if (triggerBatchPrintBtn) {
      triggerBatchPrintBtn.addEventListener('click', () => this.printBatchDirectly());
    }

    document.querySelectorAll('.btn-batch-bulk-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qty = parseInt(e.currentTarget.dataset.qty, 10) || 1;
        this.setAllBatchQuantities(qty);
      });
    });

    const batchSizeSelect = document.getElementById('batch-label-size');
    const batchStyleSelect = document.getElementById('batch-print-style');
    const batchHeaderStyleSelect = document.getElementById('batch-print-header-style');
    const customBatchWidthInput = document.getElementById('custom-batch-sticker-width');
    const customBatchHeightInput = document.getElementById('custom-batch-sticker-height');

    [batchSizeSelect, batchStyleSelect, batchHeaderStyleSelect, customBatchWidthInput, customBatchHeightInput].forEach(el => {
      if (el) {
        el.addEventListener('input', () => this.renderBatchStickersPreview());
        el.addEventListener('change', () => this.renderBatchStickersPreview());
      }
    });

    // Batch Queue Items List Delegation (Quantity steppers & remove)
    const batchQueueContainer = document.getElementById('batch-queue-items-list');
    if (batchQueueContainer) {
      batchQueueContainer.addEventListener('click', (e) => {
        const plusBtn = e.target.closest('.btn-batch-qty-plus');
        if (plusBtn) {
          const partId = plusBtn.dataset.partId;
          const currentItem = this.batchPrintQueue.get(partId);
          if (currentItem) {
            this.updateBatchPrintQty(partId, (currentItem.quantity || 1) + 1);
            this.renderBatchModalList();
          }
          return;
        }

        const minusBtn = e.target.closest('.btn-batch-qty-minus');
        if (minusBtn) {
          const partId = minusBtn.dataset.partId;
          const currentItem = this.batchPrintQueue.get(partId);
          if (currentItem) {
            this.updateBatchPrintQty(partId, Math.max(1, (currentItem.quantity || 1) - 1));
            this.renderBatchModalList();
          }
          return;
        }

        const removeBtn = e.target.closest('.btn-batch-remove-item');
        if (removeBtn) {
          const partId = removeBtn.dataset.partId;
          this.removeFromBatchPrint(partId);
          return;
        }
      });

      batchQueueContainer.addEventListener('change', (e) => {
        const qtyInput = e.target.closest('.batch-qty-input');
        if (qtyInput) {
          const partId = qtyInput.dataset.partId;
          const val = Math.max(1, parseInt(qtyInput.value, 10) || 1);
          qtyInput.value = val;
          this.updateBatchPrintQty(partId, val);
          this.renderBatchModalList();
        }
      });
    }

    // In-Modal Live Search & Fast Add
    const batchSearchInput = document.getElementById('batch-search-add-input');
    const batchSearchSuggestions = document.getElementById('batch-search-suggestions');
    const batchClearSearchBtn = document.getElementById('batch-clear-search-btn');

    if (batchSearchInput && batchSearchSuggestions) {
      batchSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (batchClearSearchBtn) {
          batchClearSearchBtn.classList.toggle('hidden', query.length === 0);
        }

        if (query.length < 1) {
          batchSearchSuggestions.innerHTML = '';
          batchSearchSuggestions.classList.add('hidden');
          return;
        }

        const matches = this.products.filter(p => {
          const text = `${p.name} ${p.partNumber} ${p.brand} ${p.vehicleBrand} ${(p.compatibleModels || []).join(' ')} ${p.barcode || ''}`.toLowerCase();
          return text.includes(query);
        }).slice(0, 8);

        if (matches.length === 0) {
          batchSearchSuggestions.innerHTML = `
            <div class="p-3 text-xs text-slate-400 text-center">
              No parts found matching "${e.target.value}".
            </div>
          `;
          batchSearchSuggestions.classList.remove('hidden');
          return;
        }

        batchSearchSuggestions.innerHTML = matches.map(p => {
          const inBatch = this.isPartInBatch(p.id);
          return `
            <div class="p-2.5 hover:bg-slate-800 flex items-center justify-between gap-2 cursor-pointer btn-add-suggested-part" data-part-id="${p.id}">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="font-black text-xs text-slate-200 truncate">${p.name}</span>
                  <span class="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800/40">${p.partNumber}</span>
                </div>
                <div class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <span class="text-amber-400 font-semibold">${p.vehicleBrand}</span>
                  <span>•</span>
                  <span class="text-emerald-400 font-bold">₹ ${(p.sellingPrice || 0).toLocaleString('en-IN')}</span>
                  <span>•</span>
                  <span>📍 ${p.rackLocation || 'RACK'}</span>
                </div>
              </div>
              <button class="btn-touch px-2.5 py-1 rounded-lg ${inBatch ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' : 'bg-blue-600 hover:bg-blue-500 text-white'} text-[11px] font-bold shrink-0 shadow-sm flex items-center gap-1">
                <i data-lucide="${inBatch ? 'check' : 'plus'}" class="w-3 h-3"></i>
                <span>${inBatch ? 'Added' : '+ Add'}</span>
              </button>
            </div>
          `;
        }).join('');

        batchSearchSuggestions.classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
      });

      batchSearchSuggestions.addEventListener('click', (e) => {
        const item = e.target.closest('.btn-add-suggested-part');
        if (item) {
          const partId = item.dataset.partId;
          this.addToBatchPrint(partId, 1);
          batchSearchInput.value = '';
          batchSearchSuggestions.innerHTML = '';
          batchSearchSuggestions.classList.add('hidden');
          if (batchClearSearchBtn) batchClearSearchBtn.classList.add('hidden');
        }
      });
    }

    if (batchClearSearchBtn && batchSearchInput && batchSearchSuggestions) {
      batchClearSearchBtn.addEventListener('click', () => {
        batchSearchInput.value = '';
        batchSearchSuggestions.innerHTML = '';
        batchSearchSuggestions.classList.add('hidden');
        batchClearSearchBtn.classList.add('hidden');
      });
    }

    // Customer Return Modal Choices
    const btnUnused = document.getElementById('btn-confirm-unused-return') || document.getElementById('btn-return-unused');
    const btnDefective = document.getElementById('btn-confirm-defective-return') || document.getElementById('btn-return-defective');
    const closeReturnModalBtn = document.getElementById('close-customer-return-modal-btn');
    const cancelReturnBtn = document.getElementById('btn-cancel-customer-return');

    if (btnUnused) {
      btnUnused.addEventListener('click', () => this.returnsManager.confirmUnusedReturn());
    }

    if (btnDefective) {
      btnDefective.addEventListener('click', () => this.returnsManager.confirmDefectiveReturn());
    }

    if (closeReturnModalBtn) {
      closeReturnModalBtn.addEventListener('click', () => this.returnsManager.closeCustomerReturnModal());
    }

    if (cancelReturnBtn) {
      cancelReturnBtn.addEventListener('click', () => this.returnsManager.closeCustomerReturnModal());
    }

    // Wholesaler Claims Modal
    const headerClaimsBadge = document.getElementById('open-defective-claims-btn') || document.getElementById('defective-claims-header-badge');
    if (headerClaimsBadge) {
      headerClaimsBadge.addEventListener('click', () => this.returnsManager.openDefectiveClaimsModal('pending'));
    }

    const closeClaimsBtn = document.getElementById('close-defective-claims-modal-btn');
    if (closeClaimsBtn) {
      closeClaimsBtn.addEventListener('click', () => this.returnsManager.closeDefectiveClaimsModal());
    }

    const tabClaimsPending = document.getElementById('btn-claims-tab-pending') || document.getElementById('btn-tab-claims-pending');
    const tabClaimsSettled = document.getElementById('btn-claims-tab-all') || document.getElementById('btn-tab-claims-settled');
    if (tabClaimsPending) {
      tabClaimsPending.addEventListener('click', () => this.returnsManager.setDefectiveClaimsTab('pending'));
    }
    if (tabClaimsSettled) {
      tabClaimsSettled.addEventListener('click', () => this.returnsManager.setDefectiveClaimsTab('all'));
    }

    const printClaimsSheetBtn = document.getElementById('btn-print-wholesaler-claim-sheet');
    if (printClaimsSheetBtn) {
      printClaimsSheetBtn.addEventListener('click', () => this.returnsManager.printWholesalerClaimSheet());
    }

    const claimsTbody = document.getElementById('defective-claims-tbody');
    if (claimsTbody) {
      claimsTbody.addEventListener('click', (e) => {
        const settleBtn = e.target.closest('.btn-open-settle-modal');
        if (settleBtn) {
          const claimId = settleBtn.dataset.claimId;
          this.returnsManager.openSettleWholesalerModal(claimId);
        }
      });
    }

    // Modal 12: Settle Wholesaler Claim Modal
    const closeSettleModalBtn = document.getElementById('close-settle-wholesaler-modal-btn');
    if (closeSettleModalBtn) {
      closeSettleModalBtn.addEventListener('click', () => this.returnsManager.closeSettleWholesalerModal());
    }

    const settleForm = document.getElementById('settle-wholesaler-form');
    if (settleForm) {
      settleForm.addEventListener('submit', (e) => this.returnsManager.confirmSettleWholesalerForm(e));
    }

    // Price Revision Wizard Modal
    const openPriceRevBtn = document.getElementById('open-price-revision-btn');
    if (openPriceRevBtn) {
      openPriceRevBtn.addEventListener('click', () => this.priceRevisionManager.openPriceRevisionModal('brand'));
    }

    const closePriceRevBtn = document.getElementById('close-price-revision-modal-btn');
    if (closePriceRevBtn) {
      closePriceRevBtn.addEventListener('click', () => this.priceRevisionManager.closePriceRevisionModal());
    }

    const btnTabRevBrand = document.getElementById('btn-tab-revision-brand');
    const btnTabRevCsv = document.getElementById('btn-tab-revision-csv');
    const btnTabRevHist = document.getElementById('btn-tab-revision-history');

    if (btnTabRevBrand) btnTabRevBrand.addEventListener('click', () => this.priceRevisionManager.switchPriceRevisionTab('brand'));
    if (btnTabRevCsv) btnTabRevCsv.addEventListener('click', () => this.priceRevisionManager.switchPriceRevisionTab('csv'));
    if (btnTabRevHist) btnTabRevHist.addEventListener('click', () => this.priceRevisionManager.switchPriceRevisionTab('history'));

    const revBrandSelect = document.getElementById('revision-brand-select');
    const revCatSelect = document.getElementById('revision-category-select');
    const revType = document.getElementById('revision-type-select') || document.getElementById('revision-type');
    const revValue = document.getElementById('revision-value-input') || document.getElementById('revision-value');
    const revApplyTo = document.getElementById('revision-apply-to') || document.getElementById('revision-apply-to-select');
    const revRounding = document.getElementById('revision-round-select') || document.getElementById('revision-rounding');

    [revBrandSelect, revCatSelect, revType, revValue, revApplyTo, revRounding].forEach(el => {
      if (el) {
        el.addEventListener('input', () => this.priceRevisionManager.calculateBrandPriceRevisionPreview());
        el.addEventListener('change', () => this.priceRevisionManager.calculateBrandPriceRevisionPreview());
      }
    });

    const btnApplyBrandRev = document.getElementById('btn-apply-brand-revision');
    if (btnApplyBrandRev) {
      btnApplyBrandRev.addEventListener('click', () => this.priceRevisionManager.applyBrandPriceRevision());
    }

    const csvFileInput = document.getElementById('csv-file-input');
    if (csvFileInput) {
      csvFileInput.addEventListener('change', (e) => this.priceRevisionManager.handleCSVFileUpload(e));
    }

    const csvDropZone = document.getElementById('csv-drop-zone');
    if (csvDropZone && csvFileInput) {
      csvDropZone.addEventListener('click', () => csvFileInput.click());
    }

    const btnParseCsv = document.getElementById('btn-parse-csv-preview') || document.getElementById('btn-parse-pasted-csv');
    if (btnParseCsv) {
      btnParseCsv.addEventListener('click', () => this.priceRevisionManager.parseCSVAndMatch());
    }

    const btnValidateMapped = document.getElementById('btn-validate-mapped-sheet');
    if (btnValidateMapped) {
      btnValidateMapped.addEventListener('click', () => this.priceRevisionManager.validateMappedSheetAndPreview());
    }

    const btnQuickRollback = document.getElementById('btn-quick-rollback-last-import');
    if (btnQuickRollback) {
      btnQuickRollback.addEventListener('click', () => this.priceRevisionManager.rollbackLastImport());
    }

    const btnConfirmAliases = document.getElementById('btn-confirm-vehicle-aliases');
    if (btnConfirmAliases) {
      btnConfirmAliases.addEventListener('click', () => this.priceRevisionManager.confirmVehicleAliases());
    }

    const btnApplyCsvSync = document.getElementById('btn-apply-csv-sync');
    if (btnApplyCsvSync) {
      btnApplyCsvSync.addEventListener('click', () => this.priceRevisionManager.applyCSVSync());
    }

    const btnDownloadSampleCsv = document.getElementById('btn-download-sample-csv');
    if (btnDownloadSampleCsv) {
      btnDownloadSampleCsv.addEventListener('click', () => this.priceRevisionManager.downloadSampleCSVTemplate());
    }

    const revHistTbody = document.getElementById('revision-history-tbody');
    if (revHistTbody) {
      revHistTbody.addEventListener('click', (e) => {
        const rollbackBtn = e.target.closest('.btn-rollback-snapshot');
        if (rollbackBtn) {
          const snapId = rollbackBtn.dataset.snapshotId;
          this.priceRevisionManager.rollbackPriceSnapshot(snapId);
        }
      });
    }

    // Barcode Scanner Modal
    const openScannerBtn = document.getElementById('open-barcode-scanner-btn');
    if (openScannerBtn) {
      openScannerBtn.addEventListener('click', () => this.scannerEngine.openScannerModal());
    }

    const closeScannerBtn = document.getElementById('close-barcode-scanner-btn');
    if (closeScannerBtn) {
      closeScannerBtn.addEventListener('click', () => this.scannerEngine.closeScannerModal());
    }

    const cameraSelect = document.getElementById('scanner-camera-select');
    if (cameraSelect) {
      cameraSelect.addEventListener('change', () => this.scannerEngine.restartCameraWithSelectedDevice());
    }

    const toggleCameraBtn = document.getElementById('toggle-camera-facing-btn');
    if (toggleCameraBtn) {
      toggleCameraBtn.addEventListener('click', () => this.scannerEngine.restartCameraWithSelectedDevice());
    }

    // Manual Barcode input in scanner modal
    const manualBarcodeInput = document.getElementById('manual-barcode-input');
    const submitManualBarcodeBtn = document.getElementById('btn-submit-manual-barcode');

    if (submitManualBarcodeBtn && manualBarcodeInput) {
      submitManualBarcodeBtn.addEventListener('click', () => {
        const code = manualBarcodeInput.value.trim();
        if (code) {
          this.handleBarcodeScanned(code, 'Manual Keypad');
          manualBarcodeInput.value = '';
        }
      });

      manualBarcodeInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          const code = manualBarcodeInput.value.trim();
          if (code) {
            this.handleBarcodeScanned(code, 'Manual Keypad');
            manualBarcodeInput.value = '';
          }
        }
      });
    }

    // Settings Modal
    const openSettingsBtn = document.getElementById('open-settings-btn');
    if (openSettingsBtn) {
      openSettingsBtn.addEventListener('click', () => this.settingsManager.openSettingsModal());
    }

    const closeSettingsBtn = document.getElementById('close-settings-btn');
    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener('click', () => this.settingsManager.closeSettingsModal());
    }

    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => this.settingsManager.saveSettingsFromForm(e));
    }

    const cipherKeywordInput = document.getElementById('setting-cipher-keyword');
    if (cipherKeywordInput) {
      cipherKeywordInput.addEventListener('input', (e) => {
        this.settingsManager.updateCipherLivePreview(e.target.value);
      });
    }

    const btnOpenManageTaxonomy = document.getElementById('btn-open-manage-taxonomy');
    if (btnOpenManageTaxonomy) {
      btnOpenManageTaxonomy.addEventListener('click', () => {
        this.settingsManager.closeSettingsModal();
        this.taxonomyManager.openTaxonomyModal('brands');
      });
    }

    const exportBackupBtn = document.getElementById('btn-export-backup-json');
    if (exportBackupBtn) {
      exportBackupBtn.addEventListener('click', () => this.settingsManager.exportDataBackup());
    }

    const importBackupInput = document.getElementById('import-backup-file-input');
    if (importBackupInput) {
      importBackupInput.addEventListener('change', (e) => this.settingsManager.importDataBackup(e.target.files[0]));
    }

    const resetDemoBtn = document.getElementById('btn-reset-demo-data');
    if (resetDemoBtn) {
      resetDemoBtn.addEventListener('click', () => {
        if (confirm("Restore the 30 sample demo auto parts, sample sales, and claim records?")) {
          this.settingsManager.executeReloadDemoData();
        }
      });
    }

    // Start Fresh Security Modal Controls
    const openStartFreshBtn = document.getElementById('btn-open-start-fresh-modal');
    if (openStartFreshBtn) {
      openStartFreshBtn.addEventListener('click', () => this.settingsManager.openStartFreshModal());
    }

    const closeStartFreshBtn = document.getElementById('btn-close-start-fresh-modal');
    if (closeStartFreshBtn) {
      closeStartFreshBtn.addEventListener('click', () => this.settingsManager.closeStartFreshModal());
    }

    const cancelStartFreshBtn = document.getElementById('btn-cancel-start-fresh');
    if (cancelStartFreshBtn) {
      cancelStartFreshBtn.addEventListener('click', () => this.settingsManager.closeStartFreshModal());
    }

    const securityPhraseInput = document.getElementById('input-security-wipe-phrase');
    if (securityPhraseInput) {
      securityPhraseInput.addEventListener('input', (e) => {
        this.settingsManager.handleSecurityPhraseInput(e.target.value);
      });
    }

    const confirmFactoryWipeBtn = document.getElementById('btn-confirm-factory-wipe');
    if (confirmFactoryWipeBtn) {
      confirmFactoryWipeBtn.addEventListener('click', () => {
        this.settingsManager.executeFactoryStartFresh();
      });
    }

    // Subcategory Modal "Show All" Button
    const btnSubcatShowAll = document.getElementById('btn-subcategory-show-all');
    if (btnSubcatShowAll) {
      btnSubcatShowAll.addEventListener('click', () => {
        this.selectSubCategory('all');
        this.closeSubcategoryModal();
      });
    }

    // Taxonomy Manager Modal
    const closeTaxonomyBtn = document.getElementById('close-taxonomy-modal-btn');
    if (closeTaxonomyBtn) {
      closeTaxonomyBtn.addEventListener('click', () => this.taxonomyManager.closeTaxonomyModal());
    }

    const tabBtnBrands = document.getElementById('tab-btn-brands');
    const tabBtnCats = document.getElementById('tab-btn-categories');
    if (tabBtnBrands) tabBtnBrands.addEventListener('click', () => this.taxonomyManager.switchTaxonomyTab('brands'));
    if (tabBtnCats) tabBtnCats.addEventListener('click', () => this.taxonomyManager.switchTaxonomyTab('categories'));

    const addBrandForm = document.getElementById('add-brand-form');
    if (addBrandForm) {
      addBrandForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('input-new-brand-name') || document.getElementById('new-brand-name-input');
        if (input && input.value && input.value.trim()) {
          this.taxonomyManager.addNewVehicleBrand(input.value.trim());
          input.value = '';
        }
      });
    }

    const addCatForm = document.getElementById('add-category-form');
    if (addCatForm) {
      addCatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('input-new-category-name') || document.getElementById('new-category-name-input');
        if (input && input.value && input.value.trim()) {
          this.taxonomyManager.addNewCategory(input.value.trim());
          input.value = '';
        }
      });
    }

    const brandsList = document.getElementById('brands-manager-list');
    if (brandsList) {
      brandsList.addEventListener('click', (e) => {
        const delBtn = e.target.closest('.btn-delete-brand');
        if (delBtn) {
          this.taxonomyManager.deleteVehicleBrand(delBtn.dataset.brandId);
        }
      });
    }

    const catsList = document.getElementById('categories-manager-list');
    if (catsList) {
      catsList.addEventListener('click', (e) => {
        const delBtn = e.target.closest('.btn-delete-category');
        if (delBtn) {
          this.taxonomyManager.deleteCategory(delBtn.dataset.catId);
        }
      });
    }
  }
}

// Instantiate and attach global instance
window.addEventListener('DOMContentLoaded', () => {
  window.app = new AutoPartsApp();
  window.app.init();
});

export default AutoPartsApp;
