// Barcode Generation & Thermal Sticker Printing Engine
// Features: Code39 1D Laser Barcodes, Secret Cost Code Cipher ('SANYO DELHI'), Batch Printing, and Custom mm Thermal Label Printer output

export class BarcodeEngine {
  constructor(settings = {}) {
    this.settings = settings;
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Encodes Cost / Sell Price into secret 10-letter keyword (Default: SANYO DELHI -> 1234567890)
  // + Appends 1 random decoy/salt letter from non-cipher letters (e.g. B, R, P, Z, M, etc.) at the end
  encodeCostToCipher(price, customCipher = null, addDecoy = true) {
    const rawKey = (customCipher || this.settings.cipherKeyword || "SANYODELHI").toUpperCase().replace(/[^A-Z]/g, '');
    const cipher = (rawKey + "SANYODELHI").slice(0, 10);
    const numStr = String(Math.round(price || 0));
    const letters = [];
    for (let char of numStr) {
      const digit = parseInt(char, 10);
      if (digit >= 1 && digit <= 9) {
        letters.push(cipher[digit - 1]);
      } else if (digit === 0) {
        letters.push(cipher[9]); // 0 maps to 10th letter (I in SANYODELHI)
      }
    }

    if (addDecoy) {
      // Pick a random letter that is NOT part of the cipher keyword (e.g. B, C, F, G, J, K, M, P, Q, R, T, U, V, W, X, Z)
      const cipherLetters = new Set(cipher.split(''));
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
      const nonCipherLetters = alphabet.filter(l => !cipherLetters.has(l));
      const pool = nonCipherLetters.length > 0 ? nonCipherLetters : alphabet;
      const randomDecoy = pool[Math.floor(Math.random() * pool.length)];
      letters.push(randomDecoy);
    }

    return letters.join(' - ');
  }

  // Helper: Computes auto-scaling typography for Car Fitment so every vehicle name appears
  getFitmentStyle(modelsStr, isPrint = false) {
    const len = (modelsStr || '').trim().length;
    if (isPrint) {
      if (len <= 26) {
        return { fontSize: '9.5pt', lineHeight: '1.15', maxLines: 2 };
      } else if (len <= 52) {
        return { fontSize: '8pt', lineHeight: '1.12', maxLines: 2 };
      } else if (len <= 85) {
        return { fontSize: '6.8pt', lineHeight: '1.08', maxLines: 3 };
      } else if (len <= 130) {
        return { fontSize: '5.8pt', lineHeight: '1.05', maxLines: 3 };
      } else {
        return { fontSize: '5.2pt', lineHeight: '1.03', maxLines: 4 };
      }
    } else {
      // Screen UI preview (px)
      if (len <= 26) {
        return { fontSize: '12px', lineHeight: '1.15', maxLines: 2 };
      } else if (len <= 52) {
        return { fontSize: '10.5px', lineHeight: '1.12', maxLines: 2 };
      } else if (len <= 85) {
        return { fontSize: '9px', lineHeight: '1.08', maxLines: 3 };
      } else if (len <= 130) {
        return { fontSize: '7.8px', lineHeight: '1.05', maxLines: 3 };
      } else {
        return { fontSize: '7px', lineHeight: '1.03', maxLines: 4 };
      }
    }
  }

  // Code 39 Vector Barcode Generator
  generateBarcodeSVG(text) {
    const code39Patterns = {
      '0': '000110100', '1': '100100001', '2': '001100001', '3': '101100000',
      '4': '000110001', '5': '100110000', '6': '001110000', '7': '000100101',
      '8': '100100100', '9': '001100100', 'A': '100001001', 'B': '001001001',
      'C': '101001000', 'D': '000011001', 'E': '100011000', 'F': '001011000',
      'G': '000001101', 'H': '100001100', 'I': '001001100', 'J': '000011100',
      'K': '100000011', 'L': '001000011', 'M': '101000010', 'N': '000010011',
      'O': '100010010', 'P': '001010010', 'Q': '000000111', 'R': '100000110',
      'S': '001000110', 'T': '000010110', 'U': '110000001', 'V': '011000001',
      'W': '111000000', 'X': '010010001', 'Y': '110010000', 'Z': '011010000',
      '-': '010000101', '.': '110000100', ' ': '011000100', '*': '010010100',
      '$': '010101000', '/': '010100010', '+': '010001010', '%': '000101010'
    };

    const cleanText = '*' + text.toUpperCase().replace(/[^0-9A-Z\-\.\ \$\/\+\%]/g, '') + '*';
    let currentX = 6;
    const barHeight = 28;
    let rects = '';

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const pattern = code39Patterns[char] || code39Patterns['*'];

      for (let j = 0; j < 9; j++) {
        const isBar = (j % 2 === 0);
        const isWide = pattern[j] === '1';
        const width = isWide ? 3.2 : 1.2;

        if (isBar) {
          rects += `<rect x="${currentX.toFixed(1)}" y="0" width="${width.toFixed(1)}" height="${barHeight}" fill="#000000" />`;
        }
        currentX += width;
      }
      currentX += 1.8; // Inter-character gap
    }

    const totalWidth = currentX + 6;

    return `
      <svg viewBox="0 0 ${totalWidth} ${barHeight}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" class="sticker-barcode-svg" style="width:100%; height:24px; display:block; shape-rendering:crispEdges;">
        <rect width="${totalWidth}" height="${barHeight}" fill="#ffffff" />
        ${rects}
      </svg>
    `;
  }

  // Get current dimensions from form controls or default options
  getLabelDimensions(prefix = 'print-label') {
    const sizeSelect = document.getElementById(`${prefix}-size`) || document.getElementById('print-label-size');
    const customWidthInput = document.getElementById(`custom-${prefix}-width`) || document.getElementById('custom-sticker-width') || document.getElementById('custom-batch-sticker-width');
    const customHeightInput = document.getElementById(`custom-${prefix}-height`) || document.getElementById('custom-sticker-height') || document.getElementById('custom-batch-sticker-height');
    const customBox = document.getElementById('custom-label-dimensions-box') || document.getElementById('custom-batch-label-dimensions-box');
    const marginSelect = document.getElementById(`${prefix}-margin`) || document.getElementById('print-label-margin') || document.getElementById('batch-label-margin');

    const sizeFormat = sizeSelect ? sizeSelect.value : '75x50';

    if (customBox) {
      if (sizeFormat === 'custom') {
        customBox.classList.remove('hidden');
        customBox.classList.add('flex');
      } else {
        customBox.classList.add('hidden');
        customBox.classList.remove('flex');
      }
    }

    // Standard 3" x 2" thermal roll labels are exactly 76.2mm x 50.8mm
    let widthMm = 76.2;
    let heightMm = 50.8;
    if (sizeFormat === '75x50' || sizeFormat === '76x51' || sizeFormat === '3x2' || sizeFormat === '3x2in') { 
      widthMm = 76.2; 
      heightMm = 50.8; 
    }
    else if (sizeFormat === '50x35') { widthMm = 50; heightMm = 35; }
    else if (sizeFormat === '50x25') { widthMm = 50; heightMm = 25.4; }
    else if (sizeFormat === '38x25') { widthMm = 38.1; heightMm = 25.4; }
    else if (sizeFormat === '100x50' || sizeFormat === '4x2') { widthMm = 101.6; heightMm = 50.8; }
    else if (sizeFormat === 'custom') {
      widthMm = parseFloat(customWidthInput?.value || 76.2) || 76.2;
      heightMm = parseFloat(customHeightInput?.value || 50.8) || 50.8;
    }

    const marginVal = marginSelect ? parseFloat(marginSelect.value) : 1.0;
    const marginMm = !isNaN(marginVal) && marginVal >= 0 ? marginVal : 1.0;

    return { sizeFormat, widthMm, heightMm, marginMm };
  }

  // Helper: Generates UI Preview Card HTML for a single sticker
  generatePreviewCardHtml(part, options = {}) {
    const {
      previewWidthPx = 350,
      previewHeightPx = 233,
      headerStyle = 'full',
      isDynamic = true
    } = options;

    const storeName = this.settings.storeName || "DECENT MOTOR ACCESSORIES";
    const barcodeNumber = part.barcode || part.partNumber || "PART";
    const barcodeSvg = this.generateBarcodeSVG(barcodeNumber);
    const modelsStr = (part.compatibleModels && part.compatibleModels.length > 0)
      ? part.compatibleModels.filter(Boolean).join(', ')
      : (part.vehicleBrand || 'UNIVERSAL FIT');
    const priceStr = `₹ ${(part.sellingPrice || 0).toLocaleString('en-IN')}`;
    const cipherCost = this.encodeCostToCipher(part.costPrice);
    const cipherSell = this.encodeCostToCipher(part.sellingPrice);
    const fitStyle = this.getFitmentStyle(modelsStr, false);

    return `
      <div class="product-box-sticker" style="background:#ffffff; color:#000000; border:2px solid #000000; padding:10px 14px; border-radius:6px; width:${previewWidthPx}px; height:${previewHeightPx}px; display:flex; flex-direction:column; justify-content:space-between; margin:4px; box-shadow:0 4px 14px rgba(0,0,0,0.35); box-sizing:border-box; overflow:hidden;">
        
        ${
          headerStyle === 'none' ? '' :
          headerStyle === 'minimal' ? `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #000000; padding-bottom:3px; margin-bottom:3px;">
              <div style="font-size:10px; font-weight:900; text-transform:uppercase; color:#000000; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${part.brand || 'OEM'} &bull; ${part.partNumber || barcodeNumber}
              </div>
              <div style="font-size:9px; font-weight:900; background:#000000; color:#ffffff; padding:2px 8px; border-radius:4px; white-space:nowrap;">
                📍 ${part.rackLocation || 'RACK'}
              </div>
            </div>
          ` : `
            <div style="border-bottom:1.5px solid #000000; padding-bottom:3px; margin-bottom:3px; display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:10.5px; font-weight:900; text-transform:uppercase; letter-spacing:0.3px; color:#000000; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${storeName}</div>
              <div style="font-size:9px; font-weight:900; background:#000000; color:#ffffff; padding:2px 8px; border-radius:4px; white-space:nowrap;">
                📍 ${part.rackLocation || 'RACK'}
              </div>
            </div>
          `
        }

        <!-- 1ST: PART NAME (LARGE, BOLD & HIGH-VISIBILITY FROM A DISTANCE) -->
        <div style="font-size:14px; font-weight:900; color:#000000; line-height:1.15; text-transform:uppercase; margin:2px 0 3px 0; max-height:2.4em; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; letter-spacing:0.2px;">
          ${part.name || 'Auto Spare Part'}
        </div>

        <!-- 2ND: CAR FITMENT / APPLICATION (BELOW PART NAME • AUTO-SCALING FONT) -->
        <div style="background:#f8fafc; border:1.5px solid #000000; border-radius:4px; padding:3px 6px; margin-bottom:2px;">
          <div style="font-size:7.5px; font-weight:900; text-transform:uppercase; color:#475569; letter-spacing:0.4px;">🚗 CAR FITMENT / APPLICATION:</div>
          <div style="font-size:${fitStyle.fontSize}; font-weight:900; color:#000000; line-height:${fitStyle.lineHeight}; text-transform:uppercase; max-height:${(fitStyle.maxLines * 1.3).toFixed(1)}em; overflow:hidden; display:-webkit-box; -webkit-line-clamp:${fitStyle.maxLines}; -webkit-box-orient:vertical; word-break:break-word;">
            ${modelsStr}
          </div>
        </div>

        <!-- FULL-WIDTH 1D LASER BARCODE -->
        <div style="background:#ffffff; padding:1px 0; border-radius:4px; margin:1px 0; text-align:center;">
          ${barcodeSvg}
          <div style="font-family:monospace; font-size:9.5px; font-weight:900; letter-spacing:1.5px; color:#000000; margin-top:1px;">
            * ${barcodeNumber} *
          </div>
        </div>

        <!-- 3RD: DUAL PRICING 2-ROW CARD (FULL-WIDTH, SPACIOUS, ZERO OVERFLOW) -->
        <div style="background:#ffffff; border:1.8px solid #000000; border-radius:5px; width:100%; box-sizing:border-box; overflow:hidden; margin-top:3px;">
          <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 9px;">
            <span style="font-size:9px; font-weight:900; color:#334155; text-transform:uppercase; letter-spacing:0.5px; white-space:nowrap;">${isDynamic ? 'SELL PRICE' : 'RETAIL MRP'}</span>
            <span style="font-family:monospace; font-size:13.5px; font-weight:900; letter-spacing:2px; color:#000000; line-height:1; white-space:nowrap;">${isDynamic ? `[ ${cipherSell} ]` : priceStr}</span>
          </div>
          <div style="height:1.2px; background:#000000; width:100%;"></div>
          <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 9px;">
            <span style="font-size:9px; font-weight:900; color:#334155; text-transform:uppercase; letter-spacing:0.5px; white-space:nowrap;">COST PRICE</span>
            <span style="font-family:monospace; font-size:13.5px; font-weight:900; letter-spacing:2px; color:#000000; line-height:1; white-space:nowrap;">[ ${cipherCost} ]</span>
          </div>
        </div>

      </div>
    `;
  }

  // Helper: Generates Direct Print Card HTML for thermal roll & printer
  generatePrintCardHtml(part, options = {}) {
    const {
      headerStyle = 'full',
      isDynamic = true,
      sizeFormat = '75x50',
      widthMm = 76.2,
      heightMm = 50.8
    } = options;

    const storeName = this.settings.storeName || "DECENT MOTOR ACCESSORIES";
    const barcodeNumber = part.barcode || part.partNumber || "PART";
    const barcodeSvg = this.generateBarcodeSVG(barcodeNumber);
    const modelsStr = (part.compatibleModels && part.compatibleModels.length > 0)
      ? part.compatibleModels.filter(Boolean).join(', ')
      : (part.vehicleBrand || 'UNIVERSAL FIT');
    const priceStr = `₹ ${(part.sellingPrice || 0).toLocaleString('en-IN')}`;
    const cipherCost = this.encodeCostToCipher(part.costPrice);
    const cipherSell = this.encodeCostToCipher(part.sellingPrice);
    const fitStyle = this.getFitmentStyle(modelsStr, true);

    return `
      <div class="sticker-card">
        ${
          headerStyle === 'none' ? '' :
          headerStyle === 'minimal' ? `
            <div class="sticker-header">
              <span class="store-name">${part.brand || 'OEM'} &bull; ${part.partNumber || barcodeNumber}</span>
              <span class="rack-badge">📍 ${part.rackLocation || 'RACK'}</span>
            </div>
          ` : `
            <div class="sticker-header">
              <span class="store-name">${storeName}</span>
              <span class="rack-badge">📍 ${part.rackLocation || 'RACK'}</span>
            </div>
          `
        }

        <!-- 1ST: PART NAME (PROMINENT & LARGE FOR DISTANCE VISIBILITY) -->
        <div class="part-title">${part.name || 'Auto Spare Part'}</div>

        <!-- 2ND: CAR FITMENT / APPLICATION (BELOW PART NAME • AUTO-SCALING FONT) -->
        <div class="vehicle-fitment-box">
          <div class="fitment-label">🚗 CAR FITMENT / APPLICATION:</div>
          <div class="fitment-cars" style="font-size:${fitStyle.fontSize} !important; line-height:${fitStyle.lineHeight} !important; -webkit-line-clamp:${fitStyle.maxLines} !important; max-height:${(fitStyle.maxLines * 1.3).toFixed(1)}em !important;">${modelsStr}</div>
        </div>

        <!-- 3RD: 1D BARCODE -->
        <div class="barcode-container">
          ${barcodeSvg}
          <div class="barcode-text">* ${barcodeNumber} *</div>
        </div>

        <!-- 4TH: DUAL PRICING 2-ROW CARD (FULL-WIDTH, SPACIOUS, ZERO OVERFLOW) -->
        <div class="sticker-pricing-card">
          <div class="pricing-row">
            <span class="pricing-label">${isDynamic ? 'SELL PRICE' : 'RETAIL MRP'}</span>
            <span class="pricing-code">${isDynamic ? `[ ${cipherSell} ]` : priceStr}</span>
          </div>
          <div class="pricing-row-divider"></div>
          <div class="pricing-row">
            <span class="pricing-label">COST PRICE</span>
            <span class="pricing-code">[ ${cipherCost} ]</span>
          </div>
        </div>
      </div>
    `;
  }

  // Live Single Thermal Sticker Preview Renderer
  renderStickersPreview(part, containerId = 'barcode-stickers-render-area') {
    const container = document.getElementById(containerId);
    if (!container || !part) return;

    const qtyInput = document.getElementById('print-label-qty');
    const styleSelect = document.getElementById('print-label-style');
    const headerStyleSelect = document.getElementById('print-header-style');

    const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
    const stickerStyle = styleSelect ? styleSelect.value : (this.settings.stickerFormat || 'dynamic_code');
    const headerStyle = headerStyleSelect ? headerStyleSelect.value : 'minimal';
    const isDynamic = stickerStyle === 'dynamic_code';

    const { sizeFormat, widthMm, heightMm, marginMm } = this.getLabelDimensions('print-label');
    const previewWidthPx = Math.max(260, Math.min(460, Math.round(widthMm * 4.6)));
    const previewHeightPx = Math.round(previewWidthPx * (heightMm / widthMm));

    const options = {
      previewWidthPx,
      previewHeightPx,
      headerStyle,
      isDynamic,
      marginMm
    };

    let stickersHtml = '';
    for (let i = 0; i < qty; i++) {
      stickersHtml += this.generatePreviewCardHtml(part, options);
    }

    container.innerHTML = stickersHtml;
  }

  // Live Batch Thermal Stickers Preview Renderer
  renderBatchStickersPreview(batchItems = [], containerId = 'batch-stickers-render-area') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!batchItems || batchItems.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400">
          <i data-lucide="layers" class="w-10 h-10 mx-auto mb-2 text-slate-600"></i>
          <div class="text-sm font-bold text-slate-300">No parts in batch queue</div>
          <div class="text-xs text-slate-500 mt-0.5">Select parts or use search above to add products.</div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const styleSelect = document.getElementById('batch-print-style') || document.getElementById('print-label-style');
    const headerStyleSelect = document.getElementById('batch-print-header-style') || document.getElementById('print-header-style');

    const stickerStyle = styleSelect ? styleSelect.value : (this.settings.stickerFormat || 'dynamic_code');
    const headerStyle = headerStyleSelect ? headerStyleSelect.value : 'minimal';
    const isDynamic = stickerStyle === 'dynamic_code';

    const { sizeFormat, widthMm, heightMm, marginMm } = this.getLabelDimensions('batch-label');
    const previewWidthPx = Math.max(260, Math.min(460, Math.round(widthMm * 4.6)));
    const previewHeightPx = Math.round(previewWidthPx * (heightMm / widthMm));

    const options = {
      previewWidthPx,
      previewHeightPx,
      headerStyle,
      isDynamic,
      marginMm
    };

    let stickersHtml = '';
    let totalStickerCount = 0;

    batchItems.forEach(item => {
      const part = item.part;
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      totalStickerCount += qty;

      for (let i = 0; i < qty; i++) {
        stickersHtml += this.generatePreviewCardHtml(part, options);
      }
    });

    container.innerHTML = stickersHtml;

    const countLabel = document.getElementById('batch-preview-count-label');
    if (countLabel) {
      countLabel.textContent = `Showing all ${totalStickerCount} stickers in print sequence`;
    }
  }

  // Direct Thermal Printer Streaming (Single Part)
  printStickersDirectly(part) {
    if (!part) return;
    const qtyInput = document.getElementById('print-label-qty');
    const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
    this.printBatchStickersDirectly([{ part, quantity: qty }], 'print-label');
  }

  // Direct Thermal Printer Streaming (Batch of Parts in One Go)
  printBatchStickersDirectly(batchItems = [], controlPrefix = 'batch-label') {
    if (!batchItems || batchItems.length === 0) return;

    const styleSelect = document.getElementById(`${controlPrefix === 'batch-label' ? 'batch-print-style' : 'print-label-style'}`) || document.getElementById('print-label-style');
    const headerStyleSelect = document.getElementById(`${controlPrefix === 'batch-label' ? 'batch-print-header-style' : 'print-header-style'}`) || document.getElementById('print-header-style');

    const stickerStyle = styleSelect ? styleSelect.value : (this.settings.stickerFormat || 'dynamic_code');
    const headerStyle = headerStyleSelect ? headerStyleSelect.value : 'minimal';
    const isDynamic = stickerStyle === 'dynamic_code';

    const { sizeFormat, widthMm, heightMm } = this.getLabelDimensions(controlPrefix);

    const cardOptions = {
      headerStyle,
      isDynamic,
      sizeFormat,
      widthMm,
      heightMm
    };

    let stickersHtml = '';
    let totalItemsCount = 0;
    let totalStickersCount = 0;

    batchItems.forEach(item => {
      const part = item.part;
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      totalItemsCount++;
      totalStickersCount += qty;

      for (let i = 0; i < qty; i++) {
        stickersHtml += this.generatePrintCardHtml(part, cardOptions);
      }
    });

    let iframe = document.getElementById('hidden-print-iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'hidden-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Stickers (${totalItemsCount} Products • ${totalStickersCount} Stickers)</title>
        <style>
          @page {
            margin: 0;
            size: ${sizeFormat === 'a4-sheet' ? 'A4 portrait' : `${widthMm}mm ${heightMm}mm`};
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          html, body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          ${
            sizeFormat === 'a4-sheet' ? `
              body {
                padding: 6mm;
              }
              .stickers-wrapper {
                display: flex;
                flex-wrap: wrap;
                gap: 2.5mm;
                justify-content: flex-start;
              }
              .sticker-card {
                width: 65mm;
                height: 38mm;
                max-height: 38mm;
                border: 1.5px solid #000000;
                border-radius: 3px;
                padding: 1.5mm 2mm;
                background: #ffffff !important;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                overflow: hidden;
              }
            ` : `
              .stickers-wrapper {
                margin: 0 !important;
                padding: 0 !important;
                width: 100%;
              }
              .sticker-card {
                width: ${widthMm - 1.6}mm;
                height: ${heightMm - 2.6}mm;
                max-width: ${widthMm - 1.6}mm;
                max-height: ${heightMm - 2.6}mm;
                margin: 0.8mm auto 0 auto;
                border: 1.6px solid #000000;
                border-radius: 4px;
                padding: 1.2mm 2.2mm;
                background: #ffffff !important;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                overflow: hidden;
              }
              .sticker-card:not(:last-child) {
                page-break-after: always !important;
                break-after: page !important;
              }
              .sticker-card:last-child {
                page-break-after: avoid !important;
                break-after: avoid !important;
              }
            `
          }
          .sticker-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1.2px solid #000000;
            padding-bottom: 0.8mm;
            margin-bottom: 0.6mm;
          }
          .store-name {
            font-size: 7.5pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            color: #000000;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .rack-badge {
            font-size: 6.8pt;
            font-weight: 900;
            background: #000000 !important;
            color: #ffffff !important;
            padding: 1.2px 6px;
            border-radius: 3px;
            white-space: nowrap;
            display: inline-block;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .part-sku-badge {
            font-size: 7pt;
            font-weight: 900;
            background: #000000 !important;
            color: #ffffff !important;
            padding: 1px 4px;
            border-radius: 2px;
            white-space: nowrap;
          }
          .vehicle-fitment-box {
            background: #f8fafc !important;
            border: 1.3px solid #000000;
            border-radius: 3px;
            padding: 0.6mm 1.4mm;
            margin-bottom: 0.5mm;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .fitment-label {
            font-size: 5.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #475569;
            letter-spacing: 0.3px;
          }
          .fitment-cars {
            font-weight: 900;
            color: #000000;
            text-transform: uppercase;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            word-break: break-word;
          }
          .part-title {
            font-size: ${sizeFormat === '38x25' || (sizeFormat === 'custom' && widthMm <= 40) ? '8pt' : '11pt'};
            font-weight: 900;
            color: #000000;
            line-height: 1.15;
            margin: 0.6mm 0;
            text-transform: uppercase;
            letter-spacing: 0.2px;
            max-height: 2.3em;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .barcode-container {
            width: 100%;
            text-align: center;
            margin: 0.3mm 0;
          }
          .sticker-barcode-svg {
            width: 100%;
            height: ${heightMm <= 30 ? '15px' : '21px'};
            display: block;
            shape-rendering: crispEdges;
          }
          .barcode-text {
            font-family: 'Courier New', Courier, monospace;
            font-size: 7.2pt;
            font-weight: 900;
            letter-spacing: 1.2px;
            color: #000000;
            margin-top: 0.2mm;
          }
          .sticker-pricing-card {
            background: #ffffff !important;
            border: 1.4px solid #000000;
            border-radius: 3px;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .pricing-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8mm 2.2mm;
          }
          .pricing-label {
            font-size: 6.2pt;
            font-weight: 900;
            color: #334155;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            white-space: nowrap !important;
          }
          .pricing-code {
            font-family: 'Courier New', Courier, monospace;
            font-size: ${sizeFormat === '38x25' || (sizeFormat === 'custom' && widthMm <= 40) ? '8.5pt' : '11pt'};
            font-weight: 900;
            letter-spacing: 1.8px;
            color: #000000 !important;
            line-height: 1;
            white-space: nowrap !important;
          }
          .pricing-row-divider {
            height: 1.2px;
            background: #000000;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <div class="stickers-wrapper">
          ${stickersHtml}
        </div>
      </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 250);
  }
}
