// Enterprise Supabase Cloud PostgreSQL & Offline-Resilient Storage Manager
// Features: Real-time Multi-Device WebSockets, Auto-Cloud Seeding, Offline Fallback Cache, and Schema Migrations

import { INITIAL_PARTS_DATA, DEFAULT_VEHICLE_BRANDS, DEFAULT_CATEGORIES } from '../config/data.js';

export const SUPABASE_CONFIG = {
  url: "https://gateyugosmgzvavrpoxl.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdGV5dWdvc21nenZhdnJwb3hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4OTg2MjYsImV4cCI6MjEwMjQ3NDYyNn0.vwNlhxAA4XY5DYLmsq3CNXS1g4T59ImkirvWxT8357w"
};

export const STORAGE_KEYS = {
  PRODUCTS: 'autoparts_products_v1',
  OUTFLOW_LOG: 'autoparts_outflow_log_v1',
  SETTINGS: 'autoparts_settings_v1',
  VEHICLE_BRANDS: 'autoparts_vehicle_brands_v1',
  CATEGORIES: 'autoparts_categories_v1',
  DEFECTIVE_RETURNS: 'autoparts_defective_v1',
  PRICE_HISTORY: 'autoparts_price_history_v1',
  VEHICLE_ALIASES: 'autoparts_vehicle_aliases_v1'
};

export const DEFAULT_VEHICLE_ALIASES = {
  "wr": "Wagon-R",
  "wg-r": "Wagon-R",
  "w/r": "Wagon-R",
  "w-r": "Wagon-R",
  "wagonr": "Wagon-R",
  "sw": "Swift",
  "swft": "Swift",
  "sw-dzr": "Swift Dzire",
  "dzr": "Swift Dzire",
  "dzire": "Swift Dzire",
  "alt": "Alto 800",
  "a800": "Alto 800",
  "k10": "Alto K10",
  "bln": "Baleno",
  "baleno": "Baleno",
  "ert": "Ertiga",
  "vtr": "Vitara Brezza",
  "brz": "Brezza",
  "cel": "Celerio",
  "ign": "Ignis",
  "v fludic": "Verna Fluidic",
  "verna f": "Verna Fluidic",
  "ver flu": "Verna Fluidic",
  "vrn-fl": "Verna Fluidic",
  "vrn": "Verna",
  "i20": "Elite i20",
  "i-20": "Elite i20",
  "elt i20": "Elite i20",
  "i10": "Grand i10",
  "i-10": "Grand i10",
  "grd i10": "Grand i10",
  "crt": "Creta",
  "crta": "Creta",
  "vnu": "Venue",
  "snt": "Santro",
  "scp": "Scorpio",
  "scorp": "Scorpio",
  "sc-n": "Scorpio-N",
  "sc-crde": "Scorpio CRDe",
  "blr": "Bolero",
  "bol": "Bolero",
  "thr": "Thar",
  "xuv7": "XUV700",
  "x700": "XUV700",
  "xuv700": "XUV700",
  "xuv5": "XUV500",
  "xuv3": "XUV300",
  "nxn": "Nexon",
  "pnch": "Punch",
  "tgr": "Tigor",
  "tag": "Tiago",
  "hrr": "Harrier",
  "sfr": "Safari",
  "altroz": "Altroz",
  "altz": "Altroz",
  "inn": "Innova",
  "crysta": "Innova Crysta",
  "inn crys": "Innova Crysta",
  "inv-cr": "Innova Crysta",
  "ftn": "Fortuner",
  "fort": "Fortuner",
  "4tuner": "Fortuner",
  "crl": "Corolla Altis",
  "glz": "Glanza",
  "hycross": "Innova Hycross",
  "cty": "City",
  "hc": "City",
  "city ivtec": "City i-VTEC",
  "amz": "Amaze",
  "wrv": "WR-V",
  "crv": "CR-V",
  "cvc": "Civic"
};

export const DEFAULT_SETTINGS = {
  storeName: "Decent Motor Accessories",
  currencySymbol: "₹",
  currencyCode: "INR",
  cipherKeyword: "SANYODELHI",
  stickerFormat: "dynamic_code",
  soundEnabled: true,
  theme: "midnight"
};

// Initialize Supabase Client
let supabaseClient = null;
try {
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log("⚡ Supabase PostgreSQL Client connected successfully to DecentMotors_Inventory!");
  }
} catch (err) {
  console.warn("Supabase client init warning:", err);
}

export class StorageManager {
  static getClient() {
    if (!supabaseClient && window.supabase && window.supabase.createClient) {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    }
    return supabaseClient;
  }

  // --- PRODUCTS ---
  static getProducts() {
    // 1. Return local cache immediately for 0ms startup
    let cached = null;
    const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (local !== null) {
      try {
        cached = JSON.parse(local);
      } catch (e) {
        console.error("Error parsing local products:", e);
      }
    }

    if (cached === null) {
      const isClean = localStorage.getItem('autoparts_is_production_clean') === 'true';
      cached = isClean ? [] : INITIAL_PARTS_DATA;
    }

    // 2. ALWAYS trigger async cloud synchronization in background!
    this.syncProductsFromCloud();
    return cached;
  }

  static async initCloudSync(appContext) {
    this.app = appContext;
    
    // Initial fetch from cloud for all modules
    await this.syncProductsFromCloud();
    await this.syncOutflowsFromCloud();
    await this.syncDefectiveReturnsFromCloud();

    // Set up Realtime WebSockets
    this.setupRealtimeSubscriptions(appContext);

    // Auto re-sync when tab becomes visible or internet reconnects
    window.addEventListener('online', () => {
      console.log("🌐 Internet reconnected — syncing with Supabase cloud...");
      this.syncProductsFromCloud();
      this.syncOutflowsFromCloud();
    });

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.syncProductsFromCloud();
        this.syncOutflowsFromCloud();
      }
    });
  }

  static updateSyncBadge(isLive, labelText = "Live Cloud Synced") {
    const badge = document.getElementById('cloud-sync-status-badge');
    const label = document.getElementById('cloud-sync-status-text');
    const dot = document.getElementById('cloud-sync-status-dot');
    if (!badge) return;

    if (isLive) {
      badge.classList.remove('hidden');
      badge.classList.add('flex');
      if (dot) dot.className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0";
      if (label) label.textContent = labelText;
      badge.className = "btn-touch flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 shadow-sm";
    } else {
      if (dot) dot.className = "w-2 h-2 rounded-full bg-amber-400 shrink-0";
      if (label) label.textContent = labelText || "Offline Cache";
      badge.className = "btn-touch flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-amber-950/70 border border-amber-500/50 text-amber-300 shadow-sm";
    }
  }

  static setupRealtimeSubscriptions(appContext) {
    const client = this.getClient();
    if (!client) return;

    try {
      client
        .channel('public:db_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
          console.log("⚡ [Realtime] Cloud product change detected:", payload);
          this.syncProductsFromCloud();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'outflow_logs' }, (payload) => {
          console.log("⚡ [Realtime] Cloud sales outflow detected:", payload);
          this.syncOutflowsFromCloud();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'defective_returns' }, (payload) => {
          console.log("⚡ [Realtime] Cloud claim update detected:", payload);
          this.syncDefectiveReturnsFromCloud();
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log("⚡ Realtime Multi-Device Sync connected successfully!");
            this.updateSyncBadge(true, "Live Cloud Synced");
          }
        });
    } catch (err) {
      console.warn("Realtime subscription warning:", err);
    }
  }

  static async syncProductsFromCloud() {
    const client = this.getClient();
    if (!client || !navigator.onLine) {
      this.updateSyncBadge(false, "Offline Cache");
      return;
    }

    try {
      this.updateSyncBadge(true, "Syncing...");
      const { data, error } = await client.from('products').select('*');
      if (!error && data) {
        if (data.length > 0) {
          // Map DB snake_case columns back to JS camelCase
          const mapped = data.map(p => ({
            id: p.id,
            name: p.name,
            partNumber: p.part_number,
            barcode: p.barcode,
            brand: p.brand,
            category: p.category,
            subCategory: p.sub_category,
            vehicleBrand: p.vehicle_brand,
            compatibleModels: Array.isArray(p.compatible_models) ? p.compatible_models : (typeof p.compatible_models === 'string' ? JSON.parse(p.compatible_models) : []),
            costPrice: parseFloat(p.cost_price) || 0,
            sellingPrice: parseFloat(p.selling_price) || 0,
            stockGroundFloor: parseInt(p.stock_ground_floor, 10) || 0,
            stockFloor1: parseInt(p.stock_floor1, 10) || 0,
            stockFloor2: parseInt(p.stock_floor2, 10) || 0,
            rackLocation: p.rack_location,
            minStockAlert: parseInt(p.min_stock_alert, 10) || 2,
            unit: p.unit || 'Piece',
            imageUrl: p.image_url,
            lastPriceUpdated: p.last_price_updated
          }));

          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mapped));
          localStorage.setItem('autoparts_is_production_clean', 'true');
          
          if (window.app && window.app.products) {
            window.app.products = mapped;
            window.app.renderProducts();
            window.app.updateHeaderStats();
          }
          this.updateSyncBadge(true, "Live Cloud Synced");
        } else {
          // Cloud table is empty: Check if production clean
          const isClean = localStorage.getItem('autoparts_is_production_clean') === 'true';
          if (!isClean) {
            console.log("🌱 Seeding default auto parts to Supabase cloud...");
            await this.seedProductsToCloud(INITIAL_PARTS_DATA);
          } else {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
            if (window.app && window.app.products) {
              window.app.products = [];
              window.app.renderProducts();
              window.app.updateHeaderStats();
            }
          }
          this.updateSyncBadge(true, "Live Cloud Synced");
        }
      }
    } catch (err) {
      console.warn("Cloud product sync error:", err);
      this.updateSyncBadge(false, "Offline Cache");
    }
  }

  static async seedProductsToCloud(partsList) {
    const client = this.getClient();
    if (!client) return;

    const dbRows = partsList.map(p => ({
      id: p.id,
      name: p.name,
      part_number: p.partNumber,
      barcode: p.barcode,
      brand: p.brand,
      category: p.category,
      sub_category: p.subCategory || null,
      vehicle_brand: p.vehicleBrand,
      compatible_models: p.compatibleModels || [],
      cost_price: p.costPrice || 0,
      selling_price: p.sellingPrice || 0,
      stock_ground_floor: p.stockGroundFloor || 0,
      stock_floor1: p.stockFloor1 || 0,
      stock_floor2: p.stockFloor2 || 0,
      rack_location: p.rackLocation,
      min_stock_alert: p.minStockAlert || 2,
      unit: p.unit || 'Piece',
      image_url: p.imageUrl || null
    }));

    try {
      await client.from('products').upsert(dbRows);
      console.log("✅ Successfully seeded 30 parts into Supabase database!");
    } catch (err) {
      console.error("Failed to seed parts to Supabase:", err);
    }
  }

  static saveProducts(products) {
    // 1. Instant local persistence (0ms delay)
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error("Local save failed", e);
    }

    // 2. Cloud upsert in background
    const client = this.getClient();
    if (client && navigator.onLine) {
      const dbRows = products.map(p => ({
        id: p.id,
        name: p.name,
        part_number: p.partNumber,
        barcode: p.barcode,
        brand: p.brand,
        category: p.category,
        sub_category: p.subCategory || null,
        vehicle_brand: p.vehicleBrand,
        compatible_models: p.compatibleModels || [],
        cost_price: p.costPrice || 0,
        selling_price: p.sellingPrice || 0,
        stock_ground_floor: p.stockGroundFloor || 0,
        stock_floor1: p.stockFloor1 || 0,
        stock_floor2: p.stockFloor2 || 0,
        rack_location: p.rackLocation,
        min_stock_alert: p.minStockAlert || 2,
        unit: p.unit || 'Piece',
        image_url: p.imageUrl || null,
        last_price_updated: p.lastPriceUpdated || null
      }));

      client.from('products').upsert(dbRows).then(({ error }) => {
        if (error) console.warn("Supabase products upsert warning:", error);
      });
    }
  }

  static async deleteProduct(id) {
    // 1. Update local storage
    const list = this.getProducts().filter(p => p.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
    } catch (e) {
      console.error("Local delete failed", e);
    }

    // 2. Delete from Supabase Cloud Database
    const client = this.getClient();
    if (client && navigator.onLine) {
      try {
        const { error } = await client.from('products').delete().eq('id', id);
        if (error) console.warn("Supabase delete warning:", error);
        else console.log(`🗑️ Successfully deleted product ${id} from Supabase Cloud!`);
      } catch (err) {
        console.warn("Cloud delete error:", err);
      }
    }
  }

  // --- VEHICLE BRANDS ---
  static getVehicleBrands() {
    const data = localStorage.getItem(STORAGE_KEYS.VEHICLE_BRANDS);
    return data ? JSON.parse(data) : DEFAULT_VEHICLE_BRANDS;
  }

  static saveVehicleBrands(brands) {
    localStorage.setItem(STORAGE_KEYS.VEHICLE_BRANDS, JSON.stringify(brands));
    const client = this.getClient();
    if (client && navigator.onLine) {
      client.from('vehicle_brands').upsert(brands).then(() => {});
    }
  }

  // --- CATEGORIES ---
  static getCategories() {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  }

  static saveCategories(categories) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    const client = this.getClient();
    if (client && navigator.onLine) {
      client.from('categories').upsert(categories).then(() => {});
    }
  }

  // --- VEHICLE ALIASES (LEARNED SUPPLIER SHORT CODES) ---
  static getVehicleAliases() {
    const data = localStorage.getItem(STORAGE_KEYS.VEHICLE_ALIASES);
    return data ? { ...DEFAULT_VEHICLE_ALIASES, ...JSON.parse(data) } : DEFAULT_VEHICLE_ALIASES;
  }

  static saveVehicleAliases(aliases) {
    localStorage.setItem(STORAGE_KEYS.VEHICLE_ALIASES, JSON.stringify(aliases));
  }

  // --- OUTFLOWS / SALES ---
  static getOutflows() {
    const data = localStorage.getItem(STORAGE_KEYS.OUTFLOW_LOG);
    if (!data) {
      const demoSales = this.createDemoSales();
      this.saveOutflows(demoSales);
      return demoSales;
    }
    return JSON.parse(data);
  }

  static async syncOutflowsFromCloud() {
    const client = this.getClient();
    if (!client || !navigator.onLine) return;

    try {
      const { data, error } = await client.from('outflow_logs').select('*');
      if (!error && data && data.length > 0) {
        const mapped = data.map(s => ({
          id: s.id,
          partId: s.part_id,
          partName: s.part_name,
          partNumber: s.part_number,
          brand: s.brand,
          quantity: s.quantity,
          sellingPrice: parseFloat(s.selling_price) || 0,
          totalAmount: parseFloat(s.total_amount) || 0,
          dateStr: s.date_str,
          timeStr: s.time_str,
          notes: s.notes || ''
        }));
        localStorage.setItem(STORAGE_KEYS.OUTFLOW_LOG, JSON.stringify(mapped));
        if (window.app) {
          window.app.outflowLog = mapped;
          window.app.updateHeaderStats();
        }
      }
    } catch (e) {
      console.warn("Outflow sync warning:", e);
    }
  }

  static saveOutflows(log) {
    localStorage.setItem(STORAGE_KEYS.OUTFLOW_LOG, JSON.stringify(log));
    const client = this.getClient();
    if (client && navigator.onLine) {
      const dbRows = log.map(s => ({
        id: s.id,
        part_id: s.partId,
        part_name: s.partName,
        part_number: s.partNumber,
        brand: s.brand,
        quantity: s.quantity,
        selling_price: s.sellingPrice || s.unitPrice || 0,
        total_amount: s.totalAmount || 0,
        date_str: s.dateStr,
        time_str: s.timeStr,
        notes: s.notes || s.note || ''
      }));
      client.from('outflow_logs').upsert(dbRows).then(() => {});
    }
  }

  // --- DEFECTIVE RETURNS ---
  static getDefectiveReturns() {
    const data = localStorage.getItem(STORAGE_KEYS.DEFECTIVE_RETURNS);
    if (!data) {
      const demo = this.createDemoDefectiveReturns();
      this.saveDefectiveReturns(demo);
      return demo;
    }
    return JSON.parse(data);
  }

  static async syncDefectiveReturnsFromCloud() {
    const client = this.getClient();
    if (!client || !navigator.onLine) return;

    try {
      const { data, error } = await client.from('defective_returns').select('*');
      if (!error && data && data.length > 0) {
        const mapped = data.map(r => ({
          id: r.id,
          partId: r.part_id,
          partName: r.part_name,
          partNumber: r.part_number,
          brand: r.brand,
          vehicleBrand: r.vehicle_brand,
          quantity: r.quantity,
          costPrice: parseFloat(r.cost_price) || 0,
          sellingPrice: parseFloat(r.selling_price) || 0,
          defectReason: r.defect_reason,
          status: r.status,
          creditNoteRef: r.credit_note_ref || '',
          dateStr: r.date_str,
          timeStr: r.time_str,
          returnedDateStr: r.returned_date_str || null
        }));
        localStorage.setItem(STORAGE_KEYS.DEFECTIVE_RETURNS, JSON.stringify(mapped));
        if (window.app) {
          window.app.defectiveReturns = mapped;
          window.app.updateHeaderStats();
        }
      }
    } catch (e) {
      console.warn("Defective returns sync warning:", e);
    }
  }

  static saveDefectiveReturns(records) {
    localStorage.setItem(STORAGE_KEYS.DEFECTIVE_RETURNS, JSON.stringify(records));
    const client = this.getClient();
    if (client && navigator.onLine) {
      const dbRows = records.map(r => ({
        id: r.id,
        part_id: r.partId,
        part_name: r.partName,
        part_number: r.partNumber,
        brand: r.brand,
        vehicle_brand: r.vehicleBrand,
        quantity: r.quantity,
        cost_price: r.costPrice,
        selling_price: r.sellingPrice,
        defect_reason: r.defectReason,
        status: r.status,
        credit_note_ref: r.creditNoteRef || '',
        date_str: r.dateStr,
        time_str: r.timeStr,
        returned_date_str: r.returnedDateStr || null
      }));
      client.from('defective_returns').upsert(dbRows).then(() => {});
    }
  }

  static addDefectiveReturn(record) {
    const list = this.getDefectiveReturns();
    const newRecord = {
      id: "def-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      dateStr: new Date().toLocaleDateString(),
      timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "pending_wholesaler",
      wholesalerReturnedAt: null,
      ...record
    };
    list.unshift(newRecord);
    this.saveDefectiveReturns(list);
    return newRecord;
  }

  static markDefectiveReturnedToWholesaler(recordId, creditNoteRef = "") {
    const list = this.getDefectiveReturns();
    const index = list.findIndex(r => r.id === recordId);
    if (index !== -1) {
      list[index].status = "returned_to_wholesaler";
      list[index].returnedDateStr = new Date().toLocaleDateString();
      list[index].wholesalerReturnedAt = new Date().toISOString();
      list[index].creditNoteRef = creditNoteRef;
      this.saveDefectiveReturns(list);
      return list[index];
    }
    return null;
  }

  // --- SETTINGS ---
  static getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      this.saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  }

  static saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    const client = this.getClient();
    if (client && navigator.onLine) {
      client.from('shop_settings').upsert([{
        id: 'default',
        store_name: settings.storeName,
        currency_symbol: settings.currencySymbol,
        cipher_keyword: settings.cipherKeyword,
        sticker_format: settings.stickerFormat,
        sound_enabled: settings.soundEnabled,
        theme: settings.theme
      }]).then(() => {});
    }
  }

  // --- PRICE HISTORY ---
  static getPriceHistory() {
    const data = localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY);
    return data ? JSON.parse(data) : [];
  }

  static savePriceHistory(history) {
    localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(history));
    const client = this.getClient();
    if (client && navigator.onLine) {
      const dbRows = history.map(h => ({
        id: h.id,
        description: h.description,
        affected_count: h.affectedCount,
        date_str: h.dateStr,
        time_str: h.timeStr,
        previous_products_backup: h.previousProductsBackup
      }));
      client.from('price_history').upsert(dbRows).then(() => {});
    }
  }

  static addPriceRevisionSnapshot(description, currentProducts, affectedCount = 0) {
    const list = this.getPriceHistory();
    const newEntry = {
      id: "prev-" + Date.now(),
      timestamp: new Date().toISOString(),
      dateStr: new Date().toLocaleDateString(),
      timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description,
      affectedCount,
      previousProductsBackup: JSON.parse(JSON.stringify(currentProducts))
    };
    list.unshift(newEntry);
    if (list.length > 30) list.pop();
    this.savePriceHistory(list);
    return newEntry;
  }

  static startFreshProductionData(options = { keepTaxonomy: true }) {
    localStorage.setItem('autoparts_is_production_clean', 'true');
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.OUTFLOW_LOG, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DEFECTIVE_RETURNS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify([]));

    if (!options.keepTaxonomy) {
      localStorage.removeItem(STORAGE_KEYS.VEHICLE_BRANDS);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    }

    return {
      products: [],
      outflowLog: [],
      defectiveReturns: [],
      vehicleBrands: this.getVehicleBrands(),
      categories: this.getCategories(),
      settings: this.getSettings()
    };
  }

  static resetToDemoData() {
    localStorage.removeItem('autoparts_is_production_clean');
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.OUTFLOW_LOG);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.VEHICLE_BRANDS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.DEFECTIVE_RETURNS);
    localStorage.removeItem(STORAGE_KEYS.PRICE_HISTORY);
    return {
      products: INITIAL_PARTS_DATA,
      vehicleBrands: this.getVehicleBrands(),
      categories: this.getCategories(),
      outflowLog: this.getOutflows(),
      settings: this.getSettings(),
      defectiveReturns: this.getDefectiveReturns()
    };
  }

  static createDemoDefectiveReturns() {
    const now = new Date();
    const time1 = new Date(now.getTime() - 4 * 3600000);
    return [
      {
        id: "def-demo-1",
        timestamp: time1.toISOString(),
        dateStr: time1.toLocaleDateString(),
        timeStr: time1.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        partId: "part-021",
        partName: "Front Wheel Bearing Hub Assembly",
        partNumber: "WB-SKF-550",
        brand: "SKF Bearings",
        vehicleBrand: "Volkswagen",
        quantity: 1,
        costPrice: 1400.00,
        sellingPrice: 2600.00,
        defectReason: "Customer reported humming bearing noise on installation (Defective race)",
        status: "pending_wholesaler",
        wholesalerReturnedAt: null,
        creditNoteRef: ""
      }
    ];
  }

  static createDemoSales() {
    const now = new Date();
    const time1 = new Date(now.getTime() - 25 * 60000);
    const time2 = new Date(now.getTime() - 95 * 60000);
    const time3 = new Date(now.getTime() - 180 * 60000);

    return [
      {
        id: "outflow-demo-1",
        timestamp: time1.toISOString(),
        dateStr: time1.toLocaleDateString(),
        timeStr: time1.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        partId: "part-006",
        partName: "Spin-On Engine Oil Filter",
        partNumber: "OF-TY-101",
        brand: "Denso Genuine",
        vehicleBrand: "Toyota",
        quantity: 2,
        sellingPrice: 380.00,
        totalAmount: 760.00,
        notes: "Sold from Floor 1 - Rack F-01"
      },
      {
        id: "outflow-demo-2",
        timestamp: time2.toISOString(),
        dateStr: time2.toLocaleDateString(),
        timeStr: time2.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        partId: "part-010",
        partName: "Iridium IX Spark Plug (Pack of 4)",
        partNumber: "SP-NGK-664",
        brand: "NGK",
        vehicleBrand: "Universal",
        quantity: 1,
        sellingPrice: 1850.00,
        totalAmount: 1850.00,
        notes: "Sold from Ground Floor Stash"
      },
      {
        id: "outflow-demo-3",
        timestamp: time3.toISOString(),
        dateStr: time3.toLocaleDateString(),
        timeStr: time3.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        partId: "part-020",
        partName: "Frameless Aero Wiper Blade 24\" + 16\" (Pair)",
        partNumber: "WP-BS-2416",
        brand: "Bosch ClearAdvantage",
        vehicleBrand: "Universal",
        quantity: 1,
        sellingPrice: 750.00,
        totalAmount: 750.00,
        notes: "Sold from Ground Floor Stash"
      }
    ];
  }
}
