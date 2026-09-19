// Price Book & On-Order Catalog Manager
// Handles non-running / procure-on-demand catalog, counter quotations, WhatsApp quotes, and shelf stock conversion

export class PriceBookManager {
  constructor(app) {
    this.app = app;
    this.catalog = [];
    this.searchQuery = "";
    this.selectedBrand = "all";
    this.selectedCategory = "all";
    this.editingItemId = null;
    this.convertingItemId = null;
  }

  init() {
    this.catalog = this.app.storage.getPriceCatalog();
    this.bindEvents();
    this.renderBrandFilterChips();
    this.renderCatalog();
    this.updateBadgeCount();
  }

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('on-order-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderCatalog();
      });
    }

    // Clear search
    const clearSearchBtn = document.getElementById('clear-on-order-search-btn');
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        this.searchQuery = '';
        this.renderCatalog();
      });
    }

    // Modal submit handler
    const form = document.getElementById('form-on-order-part');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveItemFromForm();
      });
    }

    // Live cipher preview inside modal
    const costInput = document.getElementById('on-order-cost-price');
    if (costInput) {
      costInput.addEventListener('input', (e) => {
        const cost = parseFloat(e.target.value) || 0;
        const cipherEl = document.getElementById('on-order-cipher-preview');
        if (cipherEl) {
          const cipher = this.app.barcodeEngine ? this.app.barcodeEngine.encodeCostToCipher(cost) : '';
          cipherEl.textContent = cipher ? `Cipher: [ ${cipher} ]` : '';
        }
      });
    }

    // Convert to shelf stock form
    const convertForm = document.getElementById('form-convert-to-stock');
    if (convertForm) {
      convertForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.confirmConvertToStock();
      });
    }
  }

  updateBadgeCount() {
    const badge = document.getElementById('nav-on-order-count');
    if (badge) {
      const count = this.catalog.length;
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    }
    const statTotal = document.getElementById('on-order-total-items');
    if (statTotal) statTotal.textContent = this.catalog.length;

    // Calculate unique wholesalers
    const statWholesalers = document.getElementById('on-order-unique-wholesalers');
    if (statWholesalers) {
      const unique = new Set(this.catalog.map(i => (i.wholesalerName || '').trim().toLowerCase()).filter(Boolean));
      statWholesalers.textContent = unique.size;
    }
  }

  getFilteredCatalog() {
    return this.catalog.filter(item => {
      // 1. Brand filter
      if (this.selectedBrand !== 'all') {
        const itemBrand = (item.vehicleBrand || '').toLowerCase();
        if (!itemBrand.includes(this.selectedBrand.toLowerCase())) return false;
      }

      // 2. Category filter
      if (this.selectedCategory !== 'all') {
        const itemCat = (item.category || '').toLowerCase();
        if (!itemCat.includes(this.selectedCategory.toLowerCase())) return false;
      }

      // 3. Search query match
      if (this.searchQuery) {
        const name = (item.name || '').toLowerCase();
        const sku = (item.partNumber || '').toLowerCase();
        const brand = (item.brand || '').toLowerCase();
        const vBrand = (item.vehicleBrand || '').toLowerCase();
        const wholesaler = (item.wholesalerName || '').toLowerCase();
        const models = Array.isArray(item.compatibleModels) 
          ? item.compatibleModels.join(' ').toLowerCase() 
          : (item.compatibleModels || '').toLowerCase();

        return (
          name.includes(this.searchQuery) ||
          sku.includes(this.searchQuery) ||
          brand.includes(this.searchQuery) ||
          vBrand.includes(this.searchQuery) ||
          wholesaler.includes(this.searchQuery) ||
          models.includes(this.searchQuery)
        );
      }

      return true;
    });
  }

  renderCatalog() {
    const container = document.getElementById('on-order-parts-container');
    if (!container) return;

    const filtered = this.getFilteredCatalog();
    this.updateBadgeCount();

    if (filtered.length === 0) {
      if (this.catalog.length === 0) {
        container.innerHTML = `
          <div class="col-span-full py-16 px-6 text-center max-w-xl mx-auto rounded-3xl bg-slate-900/90 border-2 border-dashed border-purple-500/40 shadow-2xl">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <i data-lucide="book-marked" class="w-8 h-8"></i>
            </div>
            <h3 class="text-xl font-black text-slate-100 tracking-tight">Your On-Order Price Book is Ready!</h3>
            <p class="text-xs text-slate-400 mt-2 leading-relaxed">
              Keep wholesale rates and customer quotes for slow-moving, non-running, or procure-on-demand parts. 
              Items here <strong class="text-purple-300">never pollute your shelf inventory</strong> or trigger false 0-stock alerts!
            </p>
            <button onclick="window.app.priceBookManager.openAddModal()" class="mt-5 btn-touch px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs md:text-sm shadow-lg shadow-purple-600/30 flex items-center gap-2 mx-auto cursor-pointer">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span>+ Add First On-Order Part</span>
            </button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="col-span-full py-16 text-center">
            <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
              <i data-lucide="search-x" class="w-7 h-7"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-200">No Matching On-Order Parts</h3>
            <p class="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              No items match "${this.searchQuery || this.selectedBrand}". Try clearing the search or filter.
            </p>
            <button onclick="window.app.priceBookManager.clearFilters()" class="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 mx-auto cursor-pointer">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
              <span>Clear Filter & Show All</span>
            </button>
          </div>
        `;
      }
      if (window.lucide) lucide.createIcons();
      return;
    }

    container.innerHTML = filtered.map(item => {
      const cost = item.costPrice || 0;
      const sell = item.sellingPrice || 0;
      const marginRs = sell - cost;
      const marginPct = cost > 0 ? Math.round((marginRs / cost) * 100) : 0;
      const cipherCost = this.app.barcodeEngine ? this.app.barcodeEngine.encodeCostToCipher(cost) : '';
      const modelsStr = Array.isArray(item.compatibleModels) 
        ? item.compatibleModels.filter(Boolean).join(', ') 
        : (item.compatibleModels || item.vehicleBrand || 'Universal');

      const dateStr = item.lastPriceUpdated 
        ? new Date(item.lastPriceUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Recent';

      return `
        <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between gap-3 shadow-lg group">
          
          <!-- TOP HEADER: BRAND & OEM SKU & LEAD TIME -->
          <div class="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase tracking-wider">
                ${item.brand || 'OEM'}
              </span>
              <span class="font-mono text-xs font-bold text-slate-200">
                ${item.partNumber || 'NO-SKU'}
              </span>
            </div>
            
            <span class="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-amber-300 flex items-center gap-1 shrink-0">
              <i data-lucide="clock" class="w-3 h-3 text-amber-400"></i>
              <span>${item.leadTime || 'On-Demand'}</span>
            </span>
          </div>

          <!-- PART NAME & CAR FITMENTS -->
          <div class="space-y-1.5 flex-1">
            <h4 class="text-sm sm:text-base font-extrabold text-slate-100 uppercase tracking-tight line-clamp-2">
              ${item.name}
            </h4>

            <div class="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div class="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <i data-lucide="car" class="w-3 h-3 text-purple-400"></i>
                <span>Fitment / Application:</span>
              </div>
              <div class="text-[11px] font-bold text-slate-200 uppercase line-clamp-2 mt-0.5">
                ${modelsStr}
              </div>
            </div>

            <!-- WHOLESALER / SOURCE INFO -->
            <div class="flex items-center justify-between gap-2 text-[11px] text-slate-400 px-0.5">
              <span class="flex items-center gap-1 truncate" title="${item.wholesalerName || 'Wholesaler Market'}">
                <i data-lucide="truck" class="w-3 h-3 text-slate-500 shrink-0"></i>
                <span class="truncate font-semibold text-slate-300">${item.wholesalerName || 'Wholesaler Market'}</span>
              </span>
              <span class="text-[10px] text-slate-500 shrink-0 font-mono">
                Updated: ${dateStr}
              </span>
            </div>
          </div>

          <!-- PRICING & MARGIN ROW -->
          <div class="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between gap-2">
            <div>
              <div class="text-[9px] uppercase font-bold text-slate-400">Cost Price</div>
              <div class="flex items-baseline gap-1.5">
                <span class="font-mono text-xs font-bold text-slate-300">₹ ${cost.toLocaleString('en-IN')}</span>
                <span class="font-mono text-[10px] font-black text-amber-400 bg-amber-950/80 px-1 rounded border border-amber-500/40" title="Cost Cipher Code">[ ${cipherCost} ]</span>
              </div>
            </div>

            <div class="text-right">
              <div class="text-[9px] uppercase font-bold text-emerald-400">Customer Quote</div>
              <div class="flex items-baseline gap-1.5 justify-end">
                <span class="font-mono text-sm sm:text-base font-black text-emerald-300">₹ ${sell.toLocaleString('en-IN')}</span>
                <span class="text-[10px] font-extrabold text-emerald-400/90 font-mono">+₹${marginRs} (${marginPct}%)</span>
              </div>
            </div>
          </div>

          <!-- ACTION BUTTONS: COPY QUOTE, CONVERT TO STOCK, EDIT, DELETE -->
          <div class="grid grid-cols-4 gap-1.5 pt-1">
            <button 
              onclick="window.app.priceBookManager.copyWhatsAppQuote('${item.id}')"
              class="col-span-2 btn-touch py-2 px-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Copy formatted customer quotation for WhatsApp"
            >
              <i data-lucide="share-2" class="w-3.5 h-3.5 text-emerald-400"></i>
              <span>Copy Quote</span>
            </button>

            <button 
              onclick="window.app.priceBookManager.openConvertToStockModal('${item.id}')"
              class="btn-touch py-2 px-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
              title="Move this item to physical shelf inventory"
            >
              <i data-lucide="box" class="w-3.5 h-3.5 text-blue-400"></i>
              <span class="hidden xl:inline">Stock</span>
            </button>

            <div class="flex items-center gap-1 justify-end">
              <button 
                onclick="window.app.priceBookManager.openEditModal('${item.id}')"
                class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-all cursor-pointer"
                title="Edit Part Details & Rates"
              >
                <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
              </button>

              <button 
                onclick="window.app.priceBookManager.deleteItem('${item.id}')"
                class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 flex items-center justify-center border border-slate-700 hover:border-rose-800 transition-all cursor-pointer"
                title="Delete Part from Price Book"
              >
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  }

  setBrandFilter(brandId) {
    this.selectedBrand = brandId;
    this.renderBrandFilterChips();
    this.renderCatalog();
  }

  clearFilters() {
    this.searchQuery = "";
    this.selectedBrand = "all";
    const searchInput = document.getElementById('on-order-search-input');
    if (searchInput) searchInput.value = "";
    this.renderBrandFilterChips();
    this.renderCatalog();
  }

  renderBrandFilterChips() {
    const container = document.getElementById('on-order-brand-chips');
    if (!container) return;

    const brands = this.app.vehicleBrands || [];
    container.innerHTML = brands.map(b => {
      const isSelected = this.selectedBrand.toLowerCase() === b.id.toLowerCase() || 
        (this.selectedBrand === 'all' && b.id === 'all');
      return `
        <button 
          onclick="window.app.priceBookManager.setBrandFilter('${b.id}')"
          class="px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            isSelected 
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
          }"
        >
          <span>${b.name}</span>
        </button>
      `;
    }).join('');
  }

  copyWhatsAppQuote(itemId) {
    const item = this.catalog.find(p => p.id === itemId);
    if (!item) return;

    const storeName = this.app.settings.storeName || "Decent Motor Accessories";
    const models = Array.isArray(item.compatibleModels) ? item.compatibleModels.join(', ') : (item.compatibleModels || item.vehicleBrand || '');
    const quoteText = `*${storeName.toUpperCase()} - PART QUOTATION*
━━━━━━━━━━━━━━━━━━━━
📦 *Item:* ${item.name}
🏷️ *Brand / SKU:* ${item.brand || 'OEM'} • ${item.partNumber || 'On-Order'}
🚗 *Vehicle Fitment:* ${models}
💰 *Price Quote:* ₹ ${(item.sellingPrice || 0).toLocaleString('en-IN')}
⏱️ *Availability:* ${item.leadTime || 'Within 2-4 Hours / Same Day'}
━━━━━━━━━━━━━━━━━━━━
_Ready for order confirmation. Call or reply to confirm order._`;

    navigator.clipboard.writeText(quoteText).then(() => {
      this.app.sound.playSaleChime();
      this.app.showToast("📋 Customer quotation copied! Ready to paste into WhatsApp.", "success");
    }).catch(err => {
      console.error("Clipboard copy error:", err);
      this.app.showToast("Could not access clipboard", "error");
    });
  }

  openAddModal() {
    this.editingItemId = null;
    const modal = document.getElementById('modal-on-order-part');
    const title = document.getElementById('on-order-modal-title');
    const form = document.getElementById('form-on-order-part');
    if (!modal || !form) return;

    form.reset();
    if (title) title.textContent = "Add On-Order Part (Price Book)";
    
    // Clear cipher preview
    const cipherEl = document.getElementById('on-order-cipher-preview');
    if (cipherEl) cipherEl.textContent = '';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }

  openEditModal(itemId) {
    const item = this.catalog.find(p => p.id === itemId);
    if (!item) return;

    this.editingItemId = itemId;
    const modal = document.getElementById('modal-on-order-part');
    const title = document.getElementById('on-order-modal-title');
    if (!modal) return;

    if (title) title.textContent = "Edit On-Order Part & Rates";

    // Populate fields
    document.getElementById('on-order-part-name').value = item.name || '';
    document.getElementById('on-order-part-number').value = item.partNumber || '';
    document.getElementById('on-order-brand').value = item.brand || '';
    document.getElementById('on-order-vehicle-brand').value = item.vehicleBrand || 'Universal';
    document.getElementById('on-order-compatible-models').value = Array.isArray(item.compatibleModels) ? item.compatibleModels.join(', ') : (item.compatibleModels || '');
    document.getElementById('on-order-category').value = item.category || 'General';
    document.getElementById('on-order-cost-price').value = item.costPrice || '';
    document.getElementById('on-order-selling-price').value = item.sellingPrice || '';
    document.getElementById('on-order-wholesaler-name').value = item.wholesalerName || '';
    document.getElementById('on-order-lead-time').value = item.leadTime || 'Same Day';
    document.getElementById('on-order-notes').value = item.notes || '';

    // Show cipher preview
    const cipherEl = document.getElementById('on-order-cipher-preview');
    if (cipherEl && item.costPrice) {
      const cipher = this.app.barcodeEngine ? this.app.barcodeEngine.encodeCostToCipher(item.costPrice) : '';
      cipherEl.textContent = cipher ? `Cipher: [ ${cipher} ]` : '';
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }

  closeModal() {
    const modal = document.getElementById('modal-on-order-part');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  saveItemFromForm() {
    const name = document.getElementById('on-order-part-name').value.trim();
    if (!name) {
      this.app.showToast("Please enter part name", "warning");
      return;
    }

    const rawModels = document.getElementById('on-order-compatible-models').value.trim();
    const compatibleModels = rawModels 
      ? rawModels.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean) 
      : [];

    const itemData = {
      name,
      partNumber: document.getElementById('on-order-part-number').value.trim().toUpperCase(),
      brand: document.getElementById('on-order-brand').value.trim() || 'OEM',
      vehicleBrand: document.getElementById('on-order-vehicle-brand').value.trim() || 'Universal',
      compatibleModels,
      category: document.getElementById('on-order-category').value.trim() || 'General',
      costPrice: parseFloat(document.getElementById('on-order-cost-price').value) || 0,
      sellingPrice: parseFloat(document.getElementById('on-order-selling-price').value) || 0,
      wholesalerName: document.getElementById('on-order-wholesaler-name').value.trim(),
      leadTime: document.getElementById('on-order-lead-time').value.trim() || 'Same Day',
      notes: document.getElementById('on-order-notes').value.trim()
    };

    if (this.editingItemId) {
      this.app.storage.updatePriceCatalogItem(this.editingItemId, itemData);
      this.catalog = this.app.storage.getPriceCatalog();
      this.app.showToast("✅ On-Order item updated successfully!", "success");
    } else {
      this.app.storage.addPriceCatalogItem(itemData);
      this.catalog = this.app.storage.getPriceCatalog();
      this.app.showToast("✅ On-Order part saved to Price Book!", "success");
    }

    this.closeModal();
    this.renderCatalog();
  }

  deleteItem(itemId) {
    const item = this.catalog.find(p => p.id === itemId);
    if (!item) return;

    if (confirm(`Remove "${item.name}" from the On-Order Price Book?`)) {
      this.app.storage.deletePriceCatalogItem(itemId);
      this.catalog = this.app.storage.getPriceCatalog();
      this.renderCatalog();
      this.app.showToast("Part removed from Price Book", "info");
    }
  }

  // --- CONVERT ON-ORDER ITEM INTO PHYSICAL SHELF INVENTORY ---
  openConvertToStockModal(itemId) {
    const item = this.catalog.find(p => p.id === itemId);
    if (!item) return;

    this.convertingItemId = itemId;
    const modal = document.getElementById('modal-convert-to-stock');
    if (!modal) return;

    document.getElementById('convert-part-name-display').textContent = item.name;
    document.getElementById('convert-part-sku-display').textContent = item.partNumber || 'NO-SKU';
    document.getElementById('convert-rack-location').value = "Floor 1 - Rack A-01";
    document.getElementById('convert-stock-floor1').value = "1";
    document.getElementById('convert-stock-floor2').value = "0";

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }

  closeConvertToStockModal() {
    const modal = document.getElementById('modal-convert-to-stock');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  confirmConvertToStock() {
    if (!this.convertingItemId) return;
    const item = this.catalog.find(p => p.id === this.convertingItemId);
    if (!item) return;

    const rackLocation = document.getElementById('convert-rack-location').value.trim() || 'Floor 1 - Rack A-01';
    const stockFloor1 = parseInt(document.getElementById('convert-stock-floor1').value) || 0;
    const stockFloor2 = parseInt(document.getElementById('convert-stock-floor2').value) || 0;

    const newProduct = this.app.storage.convertPriceCatalogItemToStock(this.convertingItemId, {
      rackLocation,
      stockFloor1,
      stockFloor2,
      stockGroundFloor: 0,
      minStockAlert: 1,
      unit: 'Piece'
    });

    if (newProduct) {
      // Refresh physical inventory list in app
      this.app.products = this.app.storage.getProducts();
      this.app.renderProducts();
      this.app.updateHeaderStats();

      this.closeConvertToStockModal();
      this.app.sound.playSaleChime();
      this.app.showToast(`🎉 "${item.name}" is now stocked on ${rackLocation}! Barcode label ready.`, "success");
    }
  }
}
