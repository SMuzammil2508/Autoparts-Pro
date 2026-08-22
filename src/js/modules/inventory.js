// Auto Parts Catalog & Inventory Management Engine
// Features: Multi-floor stock management (Ground/Floor1/Floor2), Quick Sell with Outflow logging, Add/Edit Parts, and Drill-down filtering

import { SUB_CATEGORIES_CONFIG } from '../config/subcategories.js';

export class InventoryManager {
  constructor(appContext) {
    this.app = appContext;
  }

  // Stock Calculation Helper
  getTotalStock(part) {
    return (Number(part.stockGroundFloor) || 0) + (Number(part.stockFloor1) || 0) + (Number(part.stockFloor2) || 0);
  }

  // Filter and Search with Smart Hyphen / Space / Special Character Agnostic Matching
  getFilteredProducts() {
    const query = this.app.searchQuery.trim().toLowerCase();
    
    return this.app.products.filter(p => {
      // Search match: barcode, name, part number, vehicle brand, category, compatible models, rack location
      if (query) {
        // Strip hyphens, spaces, slashes, dots, and asterisks for ultra-flexible search
        const cleanQuery = query.replace(/[^a-z0-9]/g, '');
        const queryWords = query.split(/\s+/).filter(Boolean);

        const rawPartNum = (p.partNumber || "").toLowerCase();
        const cleanPartNum = rawPartNum.replace(/[^a-z0-9]/g, '');

        const rawBarcode = (p.barcode || "").toLowerCase();
        const cleanBarcode = rawBarcode.replace(/[^a-z0-9]/g, '');

        const rawName = (p.name || "").toLowerCase();
        const cleanName = rawName.replace(/[^a-z0-9]/g, '');

        const rawBrand = (p.brand || "").toLowerCase();
        const cleanBrand = rawBrand.replace(/[^a-z0-9]/g, '');

        const rawVehBrand = (p.vehicleBrand || "").toLowerCase();
        const cleanVehBrand = rawVehBrand.replace(/[^a-z0-9]/g, '');

        const rawCategory = (p.category || "").toLowerCase();
        const cleanCategory = rawCategory.replace(/[^a-z0-9]/g, '');

        const rawModels = (p.compatibleModels || []).map(m => m.toLowerCase());
        const cleanModels = rawModels.map(m => m.replace(/[^a-z0-9]/g, ''));

        const rawRack = (p.rackLocation || "").toLowerCase();
        const cleanRack = rawRack.replace(/[^a-z0-9]/g, '');

        // 1. Direct Substring Match (e.g. "ty-bp-002")
        const matchesDirect = 
          rawPartNum.includes(query) ||
          rawBarcode.includes(query) ||
          rawName.includes(query) ||
          rawBrand.includes(query) ||
          rawVehBrand.includes(query) ||
          rawCategory.includes(query) ||
          rawModels.some(m => m.includes(query)) ||
          rawRack.includes(query);

        // 2. Normalized Alphanumeric Match (e.g. "tybp002" or "003by29xy" finding "TY-BP-002" or "003-BY-29-XY")
        const matchesClean = cleanQuery.length > 0 && (
          cleanPartNum.includes(cleanQuery) ||
          cleanBarcode.includes(cleanQuery) ||
          cleanName.includes(cleanQuery) ||
          cleanBrand.includes(cleanQuery) ||
          cleanVehBrand.includes(cleanQuery) ||
          cleanCategory.includes(cleanQuery) ||
          cleanModels.some(m => m.includes(cleanQuery)) ||
          cleanRack.includes(cleanQuery)
        );

        // 3. Multi-word search (e.g. "ty 002" or "brake corolla")
        const matchesAllWords = queryWords.length > 1 && queryWords.every(w => {
          const cw = w.replace(/[^a-z0-9]/g, '');
          return (
            rawName.includes(w) || cleanName.includes(cw) ||
            rawPartNum.includes(w) || cleanPartNum.includes(cw) ||
            rawVehBrand.includes(w) || cleanVehBrand.includes(cw) ||
            rawCategory.includes(w) || cleanCategory.includes(cw) ||
            rawModels.some(m => m.includes(w) || m.replace(/[^a-z0-9]/g, '').includes(cw))
          );
        });

        if (!matchesDirect && !matchesClean && !matchesAllWords) {
          return false;
        }
      }

      // Brand match (dynamic)
      if (this.app.selectedBrand !== "all") {
        const brandObj = this.app.vehicleBrands.find(b => b.id.toLowerCase() === this.app.selectedBrand.toLowerCase());
        const brandName = brandObj ? brandObj.name.toLowerCase() : this.app.selectedBrand.toLowerCase();
        const partVehBrand = (p.vehicleBrand || "").toLowerCase();
        if (partVehBrand !== brandName && !partVehBrand.includes(brandName) && !brandName.includes(partVehBrand) && partVehBrand !== "universal") {
          return false;
        }
      }

      // Category match (dynamic)
      if (this.app.selectedCategory !== "all") {
        const catObj = this.app.categories.find(c => c.id.toLowerCase() === this.app.selectedCategory.toLowerCase());
        const catName = catObj ? catObj.name.toLowerCase() : this.app.selectedCategory.toLowerCase();
        const partCat = (p.category || "").toLowerCase();
        if (partCat !== catName && !partCat.includes(catName) && !catName.includes(partCat)) {
          return false;
        }
      }

      // Sub-Category match (high precision for Filters, Brakes, Suspension, etc.)
      if (this.app.selectedCategory !== "all" && this.app.selectedSubCategory !== "all") {
        const subCatConfigList = SUB_CATEGORIES_CONFIG[this.app.selectedCategory.toLowerCase()] || [];
        const subCatObj = subCatConfigList.find(s => s.id === this.app.selectedSubCategory);
        if (subCatObj) {
          const matchesSubId = (p.subCategory || '').toLowerCase() === subCatObj.id.toLowerCase();
          const targetText = `${p.name} ${p.partNumber} ${p.category} ${(p.compatibleModels || []).join(' ')}`.toLowerCase();
          const matchesKeywords = (subCatObj.keywords || []).some(kw => targetText.includes(kw.toLowerCase()));
          if (!matchesSubId && !matchesKeywords) {
            return false;
          }
        }
      }

      // Status Tab match
      const totalStock = this.getTotalStock(p);
      if (this.app.selectedStatusTab === "ground-stash") {
        if ((Number(p.stockGroundFloor) || 0) <= 0) return false;
      } else if (this.app.selectedStatusTab === "defective") {
        const hasPendingDefective = (this.app.defectiveReturns || []).some(d => d.partId === p.id && d.status === 'pending_wholesaler');
        if (!hasPendingDefective) return false;
      } else if (this.app.selectedStatusTab === "in-stock") {
        if (totalStock === 0) return false;
      } else if (this.app.selectedStatusTab === "low-stock") {
        if (totalStock > (p.minStockAlert || 2) || totalStock === 0) return false;
      } else if (this.app.selectedStatusTab === "out-of-stock") {
        if (totalStock > 0) return false;
      }

      return true;
    });
  }

  // Auto-Repair & Intelligent Automotive Sanitizer for Imported Excel Catalogs
  autoSanitizeImportedCatalog() {
    if (this.hasSanitizedCatalog) return;
    this.hasSanitizedCatalog = true;

    let modified = false;
    this.app.products.forEach(p => {
      const text = `${p.name} ${p.partNumber}`.toLowerCase();

      // Auto-detect Dickey Shocker category and clean title
      if (text.includes('dickey') || text.includes('dicky') || (p.partNumber || '').startsWith('TDS9')) {
        p.category = 'DICKEY SHOCKER';
        if (p.name.includes('Gas Spring RH')) {
          p.name = p.name.replace('Gas Spring RH', '').replace('Gas Spring', '').trim();
        }
        if ((p.partNumber || '').startsWith('TDS9001')) {
          p.name = 'Omni/Van(1St, 2Nd, & 3Rd Gen)';
          p.compatibleModels = ['Omni / Van (1st, 2nd & 3rd Gen)'];
          p.vehicleBrand = 'Suzuki / Maruti';
          modified = true;
        }
      }

      // Auto-detect Drive Shaft & Axle category
      if (text.includes('shaft') || text.includes('tdsft') || text.includes('axle') || text.includes('cv joint')) {
        if (p.category === 'Filters' || !p.category) {
          p.category = 'Drive Shaft & Axle';
          modified = true;
        }
      }

      // Auto-detect Car Brand & Compatible Models
      if (p.vehicleBrand === 'Universal' || !p.vehicleBrand || p.compatibleModels?.includes('Universal / Multi-Brand')) {
        if (text.includes('wagonr') || text.includes('wagon-r') || text.includes('swift') || text.includes('dzire') || text.includes('alto') || text.includes('baleno') || text.includes('ertiga') || text.includes('brezza') || text.includes('maruti') || text.includes('suzuki')) {
          p.vehicleBrand = 'Suzuki / Maruti';
          p.compatibleModels = text.includes('wagonr') ? ["Wagon-R K-Series (2018+)"] : ["Swift / Dzire"];
          modified = true;
        } else if (text.includes('i10') || text.includes('xcent') || text.includes('verna') || text.includes('creta') || text.includes('venue') || text.includes('i20') || text.includes('hyundai')) {
          p.vehicleBrand = 'Hyundai';
          p.compatibleModels = text.includes('i10') ? ["Grand i10 Diesel / Xcent"] : ["Elite i20"];
          modified = true;
        } else if (text.includes('fortuner') || text.includes('innova') || text.includes('crysta') || text.includes('corolla') || text.includes('toyota')) {
          p.vehicleBrand = 'Toyota';
          p.compatibleModels = text.includes('fortuner') ? ["Fortuner New Model (2015+)"] : ["Innova Crysta"];
          modified = true;
        } else if (text.includes('scorpio') || text.includes('xuv') || text.includes('bolero') || text.includes('thar') || text.includes('mahindra')) {
          p.vehicleBrand = 'Mahindra';
          p.compatibleModels = text.includes('scorpio') ? ["Scorpio Classic / CRDe"] : ["XUV700"];
          modified = true;
        } else if (text.includes('nexon') || text.includes('punch') || text.includes('altroz') || text.includes('tiago') || text.includes('tata')) {
          p.vehicleBrand = 'Tata';
          p.compatibleModels = text.includes('nexon') ? ["Nexon"] : ["Altroz / Punch"];
          modified = true;
        }
      }

      // If costPrice is missing or <= 10, calculate realistic cost from sellingPrice
      if ((!p.costPrice || p.costPrice <= 10) && p.sellingPrice > 0) {
        p.costPrice = Math.round(p.sellingPrice * 0.7);
        modified = true;
      }
    });

    if (modified) {
      this.app.saveProducts();
    }
  }

  // Render Product Cards
  renderProducts() {
    this.autoSanitizeImportedCatalog();
    this.app.updateClearFilterButtonsVisibility();
    const container = document.getElementById('products-grid');
    if (!container) return;

    const filtered = this.getFilteredProducts();

    if (filtered.length === 0) {
      if (this.app.products.length === 0) {
        // Completely Fresh Store State
        container.innerHTML = `
          <div class="col-span-full py-12 px-6 text-center max-w-2xl mx-auto rounded-3xl bg-slate-900/90 border-2 border-dashed border-emerald-500/40 shadow-2xl">
            <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <i data-lucide="sparkles" class="w-10 h-10 animate-bounce"></i>
            </div>
            <h3 class="text-2xl font-black text-slate-100 tracking-tight">Your Shop Catalog is Fresh & Clean!</h3>
            <p class="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
              All demo parts and sample records have been cleared. AutoParts Pro is now ready for your shop's actual inventory.
            </p>
            
            <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
              <button 
                onclick="window.app.inventoryManager.openAddPartModal()" 
                class="btn-touch p-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-3 shadow-lg shadow-amber-500/20 group transition-all"
              >
                <div class="w-9 h-9 rounded-lg bg-slate-950/20 flex items-center justify-center">
                  <i data-lucide="plus-circle" class="w-5 h-5"></i>
                </div>
                <div>
                  <div class="text-sm font-extrabold">+ Add Auto Part</div>
                  <div class="text-[11px] text-slate-900/70 font-semibold">Enter part name & rack location</div>
                </div>
              </button>

              <button 
                onclick="window.app.priceRevisionManager.openPriceRevisionModal('csv')" 
                class="btn-touch p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-3 shadow-md group transition-all"
              >
                <div class="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <i data-lucide="file-spreadsheet" class="w-5 h-5"></i>
                </div>
                <div>
                  <div class="text-sm font-extrabold">Import Excel / CSV</div>
                  <div class="text-[11px] text-slate-400">Bulk upload distributor sheets</div>
                </div>
              </button>
            </div>

            <div class="mt-6 pt-6 border-t border-slate-800 flex items-center justify-center gap-4 text-xs text-slate-500">
              <button onclick="window.app.settingsManager.executeReloadDemoData()" class="hover:text-amber-400 transition-colors flex items-center gap-1">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                <span>Reload Demo Parts (For Testing)</span>
              </button>
              <span>•</span>
              <label class="hover:text-purple-400 transition-colors flex items-center gap-1 cursor-pointer">
                <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                <span>Restore .JSON Backup</span>
                <input type="file" onchange="window.app.settingsManager.importDataBackup(this.files[0])" accept=".json" class="hidden" />
              </label>
            </div>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="col-span-full py-16 text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
              <i data-lucide="package-x" class="w-8 h-8"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-200">No Auto Parts Found</h3>
            <p class="text-sm text-slate-400 max-w-md mx-auto mt-1">
              No parts match "${this.app.searchQuery || this.app.selectedBrand || 'current filters'}". Try speaking or searching with a shorter term like "Brake" or "Honda".
            </p>
            <button id="clear-all-filters-empty-btn" class="mt-5 btn-touch px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm hover:bg-amber-400 shadow-lg shadow-amber-500/20 flex items-center gap-2 mx-auto">
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
              <span>Clear All Filters & Show All Parts</span>
            </button>
          </div>
        `;
      }
      if (window.lucide) lucide.createIcons();
      return;
    }

    container.innerHTML = filtered.map(part => {
      const totalStock = this.getTotalStock(part);
      const groundStash = Number(part.stockGroundFloor) || 0;
      const floor1 = Number(part.stockFloor1) || 0;
      const floor2 = Number(part.stockFloor2) || 0;
      const isOutOfStock = totalStock === 0;
      const isLowStock = totalStock > 0 && totalStock <= (part.minStockAlert || 2);
      const hasGroundStash = groundStash > 0;

      const partDefectiveList = (this.app.defectiveReturns || []).filter(d => d.partId === part.id && d.status === 'pending_wholesaler');
      const hasPendingDefective = partDefectiveList.length > 0;
      const pendingDefectiveUnits = partDefectiveList.reduce((acc, d) => acc + (d.quantity || 1), 0);

      const brandObj = this.app.vehicleBrands.find(b => b.name.toLowerCase() === (part.vehicleBrand || '').toLowerCase() || b.id.toLowerCase() === (part.vehicleBrand || '').toLowerCase()) || { id: part.vehicleBrand, name: part.vehicleBrand };
      const brandLogoHtml = this.app.getBrandBadgeHtml(brandObj, false, 'xs');

      return `
        <div class="part-card rounded-2xl p-4 md:p-5 flex flex-col justify-between relative overflow-hidden ${
          hasGroundStash ? 'has-ground-stash' : ''
        }" data-part-id="${part.id}">
          
          <!-- TOP ROW: Vehicle Tag & Stock Badge -->
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-amber-400">
                  ${brandLogoHtml}
                  <span>${part.vehicleBrand}</span>
                </span>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-800">
                  ${this.app.getCategoryBadgeHtml({ name: part.category }, false)}
                  <span>${part.category}</span>
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-950/60 border border-blue-800/40 text-blue-300">
                  ${part.partNumber}
                </span>
                <!-- Barcode Tag -->
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 flex items-center gap-1" title="Product Barcode / SKU">
                  <i data-lucide="barcode" class="w-3 h-3 text-emerald-400"></i> ${part.barcode || part.partNumber}
                </span>
              </div>

              <!-- Stock Status Pill -->
              ${
                isOutOfStock
                  ? `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-950 border border-rose-700/60 text-rose-400 flex items-center gap-1">
                      <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i> OUT OF STOCK
                    </span>`
                  : isLowStock
                  ? `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-950 border border-amber-600/60 text-amber-300 flex items-center gap-1">
                      <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> ONLY ${totalStock} LEFT
                    </span>`
                  : `<span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950 border border-emerald-600/50 text-emerald-300 flex items-center gap-1">
                      <i data-lucide="check" class="w-3.5 h-3.5"></i> ${totalStock} IN STOCK
                    </span>`
              }
            </div>

            <!-- PART NAME & BRAND -->
            <h3 class="text-base md:text-lg font-bold text-slate-100 line-clamp-2 leading-snug">
              ${part.name}
            </h3>
            <div class="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>Brand: <b class="text-slate-300 font-semibold">${part.brand}</b></span>
              <span>&bull;</span>
              <span>Unit: <b class="text-slate-300 font-semibold">${part.unit || 'Piece'}</b></span>
            </div>

            <!-- COMPATIBLE CAR MODELS (Auto-Fitment Tag) -->
            <div class="mt-2.5 flex items-start gap-1.5 text-xs text-slate-300 bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
              <i data-lucide="car" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5"></i>
              <div class="flex-1">
                <span class="text-slate-400 text-[11px] block font-medium">Compatible Cars:</span>
                <span class="font-bold text-slate-200">${(part.compatibleModels || []).join(', ') || 'Universal'}</span>
              </div>
            </div>

            <!-- GROUND FLOOR UNUSED STASH BANNER -->
            ${
              hasGroundStash
                ? `
                  <div class="stash-badge-pulse mt-2.5 p-2.5 rounded-xl bg-gradient-to-r from-amber-950/80 to-amber-900/60 border border-amber-500/60 text-amber-200 flex items-center justify-between shadow-lg">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                        ${groundStash}
                      </div>
                      <div>
                        <div class="text-xs font-black text-amber-300 leading-tight">RETURNED ON COUNTER</div>
                        <div class="text-[10px] text-amber-400/80">Sell this unit first before climbing racks!</div>
                      </div>
                    </div>
                    <button 
                      class="btn-transfer-upstairs btn-touch px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-extrabold flex items-center gap-1 shadow-md"
                      data-part-id="${part.id}"
                      title="Move returned unit up to its designated rack shelf"
                    >
                      <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
                      <span>Rack Up</span>
                    </button>
                  </div>
                `
                : ''
            }

            <!-- DEFECTIVE QUARANTINE BADGE -->
            ${
              hasPendingDefective
                ? `
                  <div class="mt-2 p-2 rounded-xl bg-rose-950/70 border border-rose-600/50 text-rose-200 flex items-center justify-between text-xs">
                    <div class="flex items-center gap-1.5">
                      <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-rose-400 shrink-0"></i>
                      <span><b>${pendingDefectiveUnits} defective unit</b> quarantined (Wholesaler Claim pending)</span>
                    </div>
                    <button 
                      class="btn-open-claims-modal text-[11px] font-bold text-rose-300 underline hover:text-white"
                      data-part-id="${part.id}"
                    >
                      View Claim
                    </button>
                  </div>
                `
                : ''
            }

            <!-- MULTI-FLOOR STORAGE LOCATIONS BREAKDOWN -->
            <div class="mt-3 grid grid-cols-3 gap-1.5 text-center">
              <div class="p-2 rounded-xl ${groundStash > 0 ? 'bg-amber-950/50 border border-amber-500/50' : 'bg-slate-900/90 border border-slate-800'}">
                <div class="text-[10px] uppercase font-bold text-slate-400">Ground Floor</div>
                <div class="text-base font-black font-mono ${groundStash > 0 ? 'text-amber-400' : 'text-slate-500'}">${groundStash}</div>
                <div class="text-[9px] text-slate-500 truncate">Counter / Returns</div>
              </div>
              <div class="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <div class="text-[10px] uppercase font-bold text-slate-400">1st Floor</div>
                <div class="text-base font-black font-mono ${floor1 > 0 ? 'text-emerald-400' : 'text-slate-500'}">${floor1}</div>
                <div class="text-[9px] text-slate-400 truncate" title="${part.rackLocation || 'Rack A-01'}">${part.rackLocation || 'Rack A-01'}</div>
              </div>
              <div class="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <div class="text-[10px] uppercase font-bold text-slate-400">2nd Floor</div>
                <div class="text-base font-black font-mono ${floor2 > 0 ? 'text-blue-400' : 'text-slate-500'}">${floor2}</div>
                <div class="text-[9px] text-slate-500 truncate">Heavy Storage</div>
              </div>
            </div>

            <!-- PRICE & COST INFO -->
            <div class="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <div class="text-[10px] uppercase font-bold text-slate-400">Selling Price (MRP)</div>
                <div class="text-lg md:text-xl font-black font-mono text-emerald-400">
                  ₹ ${(part.sellingPrice || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div class="text-right">
                <div class="text-[10px] uppercase font-bold text-slate-500">Cost (Secret)</div>
                <div class="text-xs font-mono font-bold text-slate-400">
                  CODE: [ ${this.app.barcodeEngine.encodeCostToCipher(part.costPrice)} ]
                </div>
              </div>
            </div>
          </div>

          <!-- ACTION BUTTONS -->
          <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
            <!-- Quick Sell 1 Unit -->
            <button 
              class="btn-quick-sell flex-1 btn-touch py-2.5 px-3 rounded-xl font-extrabold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
              }"
              data-part-id="${part.id}"
              ${isOutOfStock ? 'disabled' : ''}
              title="Record instant sale of 1 unit"
            >
              <i data-lucide="shopping-cart" class="w-4 h-4"></i>
              <span>SELL 1</span>
            </button>

            <!-- Customer Return (Problem 2) -->
            <button 
              class="btn-customer-return btn-touch p-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
              data-part-id="${part.id}"
              title="Customer returning this part (Unused or Defective)"
            >
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
            </button>

            <!-- Print Barcode Sticker -->
            <button 
              class="btn-print-part-label btn-touch p-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-500/40 text-xs font-bold transition-all"
              data-part-id="${part.id}"
              title="Print Thermal Barcode Box Sticker"
            >
              <i data-lucide="printer" class="w-4 h-4"></i>
            </button>

            <!-- Edit Part -->
            <button 
              class="btn-edit-part btn-touch p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all"
              data-part-id="${part.id}"
              title="Edit part details, rack location & stock numbers"
            >
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>
          </div>

        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  }

  // Quick Sell Action (Smart priority: Sell ground floor returns first!)
  sellPart(partId, qty = 1) {
    const part = this.app.products.find(p => p.id === partId);
    if (!part) return;

    const totalStock = this.getTotalStock(part);
    if (totalStock < qty) {
      this.app.sound.playWarningBeep();
      this.app.showToast(`Cannot sell ${qty} units. Only ${totalStock} in stock for "${part.name}"!`, "error");
      return;
    }

    let remainingQtyToDeduct = qty;
    let deductedFrom = [];

    // Deduct from Ground Floor Stash first
    if ((part.stockGroundFloor || 0) > 0 && remainingQtyToDeduct > 0) {
      const deductGround = Math.min(part.stockGroundFloor, remainingQtyToDeduct);
      part.stockGroundFloor -= deductGround;
      remainingQtyToDeduct -= deductGround;
      deductedFrom.push(`${deductGround} from Ground Floor Stash`);
    }

    // Deduct from 1st Floor next
    if ((part.stockFloor1 || 0) > 0 && remainingQtyToDeduct > 0) {
      const deductFloor1 = Math.min(part.stockFloor1, remainingQtyToDeduct);
      part.stockFloor1 -= deductFloor1;
      remainingQtyToDeduct -= deductFloor1;
      deductedFrom.push(`${deductFloor1} from ${part.rackLocation || 'Floor 1'}`);
    }

    // Deduct from 2nd Floor heavy storage last
    if ((part.stockFloor2 || 0) > 0 && remainingQtyToDeduct > 0) {
      const deductFloor2 = Math.min(part.stockFloor2, remainingQtyToDeduct);
      part.stockFloor2 -= deductFloor2;
      remainingQtyToDeduct -= deductFloor2;
      deductedFrom.push(`${deductFloor2} from 2nd Floor`);
    }

    // Record Outflow Log
    const totalAmount = (part.sellingPrice || 0) * qty;
    const now = new Date();
    this.app.outflowLog.unshift({
      id: "outflow-" + Date.now(),
      partId: part.id,
      partName: part.name,
      partNumber: part.partNumber,
      brand: part.brand,
      quantity: qty,
      sellingPrice: part.sellingPrice,
      totalAmount: totalAmount,
      dateStr: now.toLocaleDateString(),
      timeStr: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: `Sold ${deductedFrom.join(', ')}`
    });

    this.app.saveProducts();
    this.app.storage.saveOutflows(this.app.outflowLog);
    this.app.sound.playSaleChime();

    this.app.showToast(
      `Sold ${qty}x "${part.name}" for ₹ ${totalAmount.toLocaleString('en-IN')}! (${deductedFrom.join(', ')})`,
      "success"
    );

    this.renderProducts();
    this.app.updateHeaderStats();
  }

  // Quick Add / Edit Part Modal
  openAddPartModal(editPartId = null) {
    this.app.sound.playClick();
    const modal = document.getElementById('add-part-modal');
    if (!modal) return;

    const modalTitle = document.getElementById('add-part-modal-title');
    const form = document.getElementById('add-part-form');
    form.reset();

    if (editPartId) {
      const part = this.app.products.find(p => p.id === editPartId);
      if (part) {
        modalTitle.textContent = "Edit Auto Part & Stock";
        document.getElementById('form-part-id').value = part.id;
        document.getElementById('form-part-name').value = part.name;
        document.getElementById('form-part-number').value = part.partNumber;
        const barcodeInput = document.getElementById('form-part-barcode');
        if (barcodeInput) barcodeInput.value = part.barcode || part.partNumber;
        document.getElementById('form-part-brand').value = part.brand || "";
        this.populateAddPartDropdowns(part.vehicleBrand, part.category);
        document.getElementById('form-compatible-models').value = (part.compatibleModels || []).join(', ');
        document.getElementById('form-cost-price').value = part.costPrice;
        document.getElementById('form-selling-price').value = part.sellingPrice;
        document.getElementById('form-rack-location').value = part.rackLocation;
        document.getElementById('form-stock-floor1').value = part.stockFloor1 || 0;
        document.getElementById('form-stock-floor2').value = part.stockFloor2 || 0;
        document.getElementById('form-stock-ground').value = part.stockGroundFloor || 0;
      }
    } else {
      modalTitle.textContent = "Add New Auto Part";
      document.getElementById('form-part-id').value = "";
      const barcodeInput = document.getElementById('form-part-barcode');
      if (barcodeInput) barcodeInput.value = "890" + Math.floor(100000000 + Math.random() * 900000000);
      this.populateAddPartDropdowns();
      document.getElementById('form-rack-location').value = "Floor 1 - Rack A-01";
      document.getElementById('form-stock-floor1').value = "5";
      document.getElementById('form-stock-floor2').value = "0";
      document.getElementById('form-stock-ground').value = "0";
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }

  closeAddPartModal() {
    const modal = document.getElementById('add-part-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  populateAddPartDropdowns(selectedBrand = null, selectedCategory = null) {
    const brandSelect = document.getElementById('form-vehicle-brand');
    const catSelect = document.getElementById('form-category');
    if (!brandSelect || !catSelect) return;

    brandSelect.innerHTML = this.app.vehicleBrands.filter(b => b.id !== 'all').map(b => `
      <option value="${b.name}" ${selectedBrand && (b.name.toLowerCase() === selectedBrand.toLowerCase() || b.id.toLowerCase() === selectedBrand.toLowerCase()) ? 'selected' : ''}>
        ${b.name}
      </option>
    `).join('') + `<option value="__NEW_BRAND__">+ Add New Brand...</option>`;

    catSelect.innerHTML = this.app.categories.filter(c => c.id !== 'all').map(c => `
      <option value="${c.name}" ${selectedCategory && (c.name.toLowerCase() === selectedCategory.toLowerCase() || c.id.toLowerCase() === selectedCategory.toLowerCase()) ? 'selected' : ''}>
        ${c.name}
      </option>
    `).join('') + `<option value="__NEW_CATEGORY__">+ Add New Category...</option>`;
  }

  savePartFromForm(e) {
    e.preventDefault();
    const partId = document.getElementById('form-part-id').value;
    const name = document.getElementById('form-part-name').value.trim();
    const partNumber = document.getElementById('form-part-number').value.trim();
    const barcodeInput = document.getElementById('form-part-barcode');
    const barcode = (barcodeInput && barcodeInput.value ? barcodeInput.value.trim() : '') || partNumber;
    const brand = document.getElementById('form-part-brand').value.trim();
    const vehicleBrand = document.getElementById('form-vehicle-brand').value;
    const category = document.getElementById('form-category').value;
    const modelsStr = document.getElementById('form-compatible-models').value.trim();
    const costPrice = parseFloat(document.getElementById('form-cost-price').value) || 0;
    const sellingPrice = parseFloat(document.getElementById('form-selling-price').value) || 0;
    const rackLocation = document.getElementById('form-rack-location').value.trim() || "Floor 1 - Rack A-01";
    const stockFloor1 = parseInt(document.getElementById('form-stock-floor1').value, 10) || 0;
    const stockFloor2 = parseInt(document.getElementById('form-stock-floor2').value, 10) || 0;
    const stockGroundFloor = parseInt(document.getElementById('form-stock-ground').value, 10) || 0;

    const compatibleModels = modelsStr ? modelsStr.split(',').map(m => m.trim()).filter(Boolean) : [vehicleBrand];

    if (partId) {
      // Edit existing
      const part = this.app.products.find(p => p.id === partId);
      if (part) {
        part.name = name;
        part.partNumber = partNumber;
        part.barcode = barcode;
        part.brand = brand;
        part.vehicleBrand = vehicleBrand;
        part.category = category;
        part.compatibleModels = compatibleModels;
        part.costPrice = costPrice;
        part.sellingPrice = sellingPrice;
        part.rackLocation = rackLocation;
        part.stockFloor1 = stockFloor1;
        part.stockFloor2 = stockFloor2;
        part.stockGroundFloor = stockGroundFloor;
        this.app.showToast(`Updated "${name}" successfully!`, "success");
      }
    } else {
      // Add new
      const newPart = {
        id: "part-" + Date.now(),
        name,
        partNumber,
        barcode: barcode || ("890" + Math.floor(100000000 + Math.random() * 900000000)),
        brand,
        vehicleBrand,
        category,
        compatibleModels,
        costPrice,
        sellingPrice,
        rackLocation,
        stockFloor1,
        stockFloor2,
        stockGroundFloor,
        minStockAlert: 2,
        unit: 'Piece'
      };
      this.app.products.unshift(newPart);
      this.app.showToast(`Added "${name}" to inventory!`, "success");
    }

    this.app.saveProducts();
    this.app.sound.playSaleChime();
    this.closeAddPartModal();
    this.renderProducts();
    this.app.updateHeaderStats();
  }
}
