// Vehicle Brands & Part Categories Taxonomy Manager Engine
// Features: Dynamic brand additions, OEM vector badge association, category creation, and safe deletion checks

export class TaxonomyManager {
  constructor(appContext) {
    this.app = appContext;
  }

  openTaxonomyModal(defaultTab = 'brands') {
    this.app.sound.playClick();
    const modal = document.getElementById('taxonomy-modal');
    if (!modal) return;

    this.switchTaxonomyTab(defaultTab);
    this.renderTaxonomyManagerLists();

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }

  closeTaxonomyModal() {
    const modal = document.getElementById('taxonomy-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  switchTaxonomyTab(tabName) {
    const btnBrands = document.getElementById('tab-btn-brands');
    const btnCats = document.getElementById('tab-btn-categories');
    const secBrands = document.getElementById('taxonomy-section-brands');
    const secCats = document.getElementById('taxonomy-section-categories');

    if (tabName === 'brands') {
      if (btnBrands) {
        btnBrands.classList.add('border-amber-400', 'text-amber-400');
        btnBrands.classList.remove('border-transparent', 'text-slate-400');
      }
      if (btnCats) {
        btnCats.classList.remove('border-blue-500', 'text-blue-400');
        btnCats.classList.add('border-transparent', 'text-slate-400');
      }
      if (secBrands) secBrands.classList.remove('hidden');
      if (secCats) secCats.classList.add('hidden');
    } else {
      if (btnCats) {
        btnCats.classList.add('border-blue-500', 'text-blue-400');
        btnCats.classList.remove('border-transparent', 'text-slate-400');
      }
      if (btnBrands) {
        btnBrands.classList.remove('border-amber-400', 'text-amber-400');
        btnBrands.classList.add('border-transparent', 'text-slate-400');
      }
      if (secCats) secCats.classList.remove('hidden');
      if (secBrands) secBrands.classList.add('hidden');
    }
    if (window.lucide) lucide.createIcons();
  }

  renderTaxonomyManagerLists() {
    const brandsList = document.getElementById('brands-manager-list');
    const catsList = document.getElementById('categories-manager-list');
    const badgeBrands = document.getElementById('badge-total-brands');
    const badgeCats = document.getElementById('badge-total-categories');

    const validBrands = this.app.vehicleBrands.filter(b => b.id !== 'all');
    const validCats = this.app.categories.filter(c => c.id !== 'all');

    if (badgeBrands) badgeBrands.textContent = validBrands.length;
    if (badgeCats) badgeCats.textContent = validCats.length;

    if (brandsList) {
      brandsList.innerHTML = validBrands.map(b => {
        const count = this.app.products.filter(p => (p.vehicleBrand || '').toLowerCase().includes(b.name.toLowerCase())).length;
        const isCore = ['universal'].includes(b.id);
        const badgeHtml = this.app.getBrandBadgeHtml(b, false);
        return `
          <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 shadow-sm">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="shrink-0">
                ${badgeHtml}
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-slate-200 truncate">${b.name}</div>
                <div class="text-[10px] text-slate-500">${count} items in stock</div>
              </div>
            </div>
            ${!isCore ? `
              <button 
                class="btn-delete-brand p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/70 text-rose-400 border border-rose-800/40 text-xs shrink-0" 
                data-brand-id="${b.id}"
                title="Remove brand"
              >
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            ` : `<span class="text-[9px] font-bold uppercase text-slate-600 px-1.5 py-0.5 bg-slate-950 rounded">Default</span>`}
          </div>
        `;
      }).join('');
    }

    if (catsList) {
      catsList.innerHTML = validCats.map(c => {
        const count = this.app.products.filter(p => (p.category || '').toLowerCase() === c.name.toLowerCase()).length;
        const iconHtml = this.app.getCategoryBadgeHtml(c, false);
        return `
          <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 shadow-sm">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                ${iconHtml}
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-slate-200 truncate">${c.name}</div>
                <div class="text-[10px] text-slate-500">${count} items in catalog</div>
              </div>
            </div>
            <button 
              class="btn-delete-category p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/70 text-rose-400 border border-rose-800/40 text-xs shrink-0" 
              data-cat-id="${c.id}"
              title="Remove category"
            >
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `;
      }).join('');
    }

    if (window.lucide) lucide.createIcons();
  }

  addNewVehicleBrand(brandName) {
    if (!brandName || !brandName.trim()) return;
    const name = brandName.trim();
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (this.app.vehicleBrands.some(b => b.id === id || b.name.toLowerCase() === name.toLowerCase())) {
      this.app.showToast(`Brand "${name}" already exists!`, "warning");
      return;
    }

    this.app.vehicleBrands.push({ id, name });
    this.app.storage.saveVehicleBrands(this.app.vehicleBrands);
    this.app.sound.playClick();
    this.app.showToast(`Vehicle Brand "${name}" added successfully!`, "success");
    this.app.renderBrandChips();
    if (this.app.inventoryManager && this.app.inventoryManager.populateAddPartDropdowns) {
      this.app.inventoryManager.populateAddPartDropdowns(name, null);
    }
    if (this.app.priceRevisionManager && this.app.priceRevisionManager.populatePriceRevisionDropdowns) {
      this.app.priceRevisionManager.populatePriceRevisionDropdowns();
    }
    this.renderTaxonomyManagerLists();
  }

  deleteVehicleBrand(brandId) {
    const brand = this.app.vehicleBrands.find(b => b.id === brandId);
    if (!brand) return;

    const count = this.app.products.filter(p => (p.vehicleBrand || '').toLowerCase().includes(brand.name.toLowerCase())).length;
    if (count > 0) {
      if (!confirm(`Warning: There are ${count} parts currently assigned to "${brand.name}". Are you sure you want to delete this brand?`)) {
        return;
      }
    }

    this.app.vehicleBrands = this.app.vehicleBrands.filter(b => b.id !== brandId);
    this.app.storage.saveVehicleBrands(this.app.vehicleBrands);
    this.app.sound.playClick();
    this.app.showToast(`Brand "${brand.name}" removed!`, "info");
    this.app.renderBrandChips();
    if (this.app.inventoryManager && this.app.inventoryManager.populateAddPartDropdowns) {
      this.app.inventoryManager.populateAddPartDropdowns();
    }
    if (this.app.priceRevisionManager && this.app.priceRevisionManager.populatePriceRevisionDropdowns) {
      this.app.priceRevisionManager.populatePriceRevisionDropdowns();
    }
    this.renderTaxonomyManagerLists();
  }

  addNewCategory(catName) {
    if (!catName || !catName.trim()) return;
    const name = catName.trim();
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (this.app.categories.some(c => c.id === id || c.name.toLowerCase() === name.toLowerCase())) {
      this.app.showToast(`Category "${name}" already exists!`, "warning");
      return;
    }

    this.app.categories.push({ id, name });
    this.app.storage.saveCategories(this.app.categories);
    this.app.sound.playClick();
    this.app.showToast(`Category "${name}" added successfully!`, "success");
    this.app.renderCategoryChips();
    if (this.app.inventoryManager && this.app.inventoryManager.populateAddPartDropdowns) {
      this.app.inventoryManager.populateAddPartDropdowns(null, name);
    }
    if (this.app.priceRevisionManager && this.app.priceRevisionManager.populatePriceRevisionDropdowns) {
      this.app.priceRevisionManager.populatePriceRevisionDropdowns();
    }
    this.renderTaxonomyManagerLists();
  }

  deleteCategory(catId) {
    const cat = this.app.categories.find(c => c.id === catId);
    if (!cat) return;

    const count = this.app.products.filter(p => (p.category || '').toLowerCase() === cat.name.toLowerCase()).length;
    if (count > 0) {
      if (!confirm(`Warning: There are ${count} parts assigned to "${cat.name}". Are you sure you want to delete this category?`)) {
        return;
      }
    }

    this.app.categories = this.app.categories.filter(c => c.id !== catId);
    this.app.storage.saveCategories(this.app.categories);
    this.app.sound.playClick();
    this.app.showToast(`Category "${cat.name}" removed!`, "info");
    this.app.renderCategoryChips();
    if (this.app.inventoryManager && this.app.inventoryManager.populateAddPartDropdowns) {
      this.app.inventoryManager.populateAddPartDropdowns();
    }
    if (this.app.priceRevisionManager && this.app.priceRevisionManager.populatePriceRevisionDropdowns) {
      this.app.priceRevisionManager.populatePriceRevisionDropdowns();
    }
    this.renderTaxonomyManagerLists();
  }
}
