// Barcode Generation & Thermal Sticker Printing Engine
// Features: Code39 1D Laser Barcodes, Secret Cost Code Cipher ('SANYO DELHI'), and Custom mm Thermal Label Printer output

export class BarcodeEngine {
  constructor(settings = {}) {
    this.settings = settings;
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Encodes Cost Price into secret 10-letter keyword (Default: SANYO DELHI -> 1234567890)
  encodeCostToCipher(costPrice, customCipher = null) {
    const rawKey = (customCipher || this.settings.cipherKeyword || "SANYODELHI").toUpperCase().replace(/[^A-Z]/g, '');
    const cipher = (rawKey + "SANYODELHI").slice(0, 10);
    // cipher[0]='1', cipher[1]='2', cipher[2]='3', cipher[3]='4', cipher[4]='5', cipher[5]='6', cipher[6]='7', cipher[7]='8', cipher[8]='9', cipher[9]='0'
    const numStr = String(Math.round(costPrice || 0));
    const letters = [];
    for (let char of numStr) {
      const digit = parseInt(char, 10);
      if (digit >= 1 && digit <= 9) {
        letters.push(cipher[digit - 1]);
      } else if (digit === 0) {
        letters.push(cipher[9]); // 0 maps to 10th letter (I in SANYODELHI)
      }
    }
    return letters.join(' - ');
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

  // Live Thermal Sticker Preview Renderer
  renderStickersPreview(part, containerId = 'barcode-stickers-render-area') {
    const container = document.getElementById(containerId);
    if (!container || !part) return;

    const qtyInput = document.getElementById('print-label-qty');
    const sizeSelect = document.getElementById('print-label-size');
    const styleSelect = document.getElementById('print-label-style');
    const headerStyleSelect = document.getElementById('print-header-style');
    const customWidthInput = document.getElementById('custom-sticker-width');
    const customHeightInput = document.getElementById('custom-sticker-height');
    const customBox = document.getElementById('custom-label-dimensions-box');

    const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
    const sizeFormat = sizeSelect ? sizeSelect.value : '50x35';
    const stickerStyle = styleSelect ? styleSelect.value : (this.settings.stickerFormat || 'dynamic_code');
    const headerStyle = headerStyleSelect ? headerStyleSelect.value : 'minimal';
    const isDynamic = stickerStyle === 'dynamic_code';

    if (customBox) {
      if (sizeFormat === 'custom') {
        customBox.classList.remove('hidden');
        customBox.classList.add('flex');
      } else {
        customBox.classList.add('hidden');
        customBox.classList.remove('flex');
      }
    }

    let widthMm = 50;
    let heightMm = 35;
    if (sizeFormat === '50x35') { widthMm = 50; heightMm = 35; }
    else if (sizeFormat === '50x25') { widthMm = 50; heightMm = 25; }
    else if (sizeFormat === '38x25') { widthMm = 38; heightMm = 25; }
    else if (sizeFormat === '75x50') { widthMm = 75; heightMm = 50; }
    else if (sizeFormat === '100x50') { widthMm = 100; heightMm = 50; }
    else if (sizeFormat === 'custom') {
      widthMm = parseInt(customWidthInput?.value || 50, 10) || 50;
      heightMm = parseInt(customHeightInput?.value || 35, 10) || 35;
    }

    const previewWidthPx = Math.max(220, Math.min(500, widthMm * 5.6));
    const previewMinHeightPx = Math.max(140, Math.min(400, heightMm * 5.2));

    const storeName = this.settings.storeName || "CITY AUTO PARTS & SPARES";
    const barcodeNumber = part.barcode || part.partNumber;
    const barcodeSvg = this.generateBarcodeSVG(barcodeNumber);
    const modelsStr = (part.compatibleModels || []).join(', ') || part.vehicleBrand;
    const cipherCode = this.encodeCostToCipher(part.costPrice);

    let stickersHtml = '';

    for (let i = 0; i < qty; i++) {
      stickersHtml += `
        <div class="product-box-sticker" style="background:#ffffff; color:#000000; border:2.5px solid #000000; padding:8px 10px; border-radius:6px; width:${previewWidthPx}px; min-height:${previewMinHeightPx}px; display:flex; flex-direction:column; justify-content:space-between; margin:4px; box-shadow:0 4px 14px rgba(0,0,0,0.35);">
          
          ${
            headerStyle === 'none' ? '' :
            headerStyle === 'minimal' ? `
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #000000; padding-bottom:2px; margin-bottom:4px;">
                <div style="font-size:9.5px; font-weight:800; text-transform:uppercase; color:#000000;">
                  📍 ${part.rackLocation || 'RACK'} &bull; <b>${part.brand || 'OEM'}</b>
                </div>
                <div style="font-size:8.5px; font-weight:900; background:#000000; color:#ffffff; padding:1px 5px; border-radius:3px;">
                  ${part.partNumber}
                </div>
              </div>
            ` : `
              <div style="border-bottom:1.5px solid #000000; padding-bottom:2px; margin-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:9px; font-weight:900; text-transform:uppercase; letter-spacing:0.5px; color:#000000;">${storeName}</div>
                <div style="font-size:8.5px; font-weight:800; background:#000000; color:#ffffff; padding:1px 5px; border-radius:3px;">
                  📍 ${part.rackLocation || 'RACK'}
                </div>
              </div>
            `
          }

          <!-- 1ST VERY BIG THING: APPLICATION CARS -->
          <div style="background:#f1f5f9; border:2px solid #000000; border-radius:5px; padding:5px 7px; margin:2px 0 4px 0;">
            <div style="font-size:8.5px; font-weight:900; text-transform:uppercase; color:#475569; letter-spacing:0.5px;">🚗 CAR FITMENT / APPLICATION:</div>
            <div style="font-size:14.5px; font-weight:900; color:#000000; line-height:1.15; text-transform:uppercase;">
              ${modelsStr}
            </div>
          </div>

          <!-- PART NAME -->
          <div style="font-size:11px; font-weight:800; color:#1e293b; line-height:1.2; margin-bottom:3px;">
            ${part.name}
          </div>

          <!-- FULL-WIDTH 1D LASER BARCODE -->
          <div style="background:#ffffff; padding:3px 2px; border-radius:4px; margin:2px 0; text-align:center;">
            ${barcodeSvg}
            <div style="font-family:monospace; font-size:9px; font-weight:900; letter-spacing:1.5px; color:#000000; margin-top:1px;">
              * ${barcodeNumber} *
            </div>
          </div>

          <!-- 2ND VERY BIG THING: THE CIPHER CODE OR MRP -->
          ${
            isDynamic 
              ? `
                <div style="background:#000000; color:#ffffff; border-radius:5px; padding:5px 8px; margin-top:3px; display:flex; justify-content:space-between; align-items:center; flex-wrap:nowrap; gap:6px;">
                  <div style="font-size:clamp(12px, 3.6vw, 16px); font-weight:900; font-family:monospace; letter-spacing:1.5px; color:#ffffff; line-height:1; white-space:nowrap; flex-shrink:0; display:inline-block;">
                    [ ${cipherCode} ]
                  </div>
                  <div style="font-size:7.5px; font-weight:900; text-transform:uppercase; color:#34d399; text-align:right; line-height:1.1; white-space:nowrap; flex-shrink:0;">
                    ★ GENUINE OES ★<br>SCAN FOR LIVE PRICE
                  </div>
                </div>
              `
              : `
                <div style="background:#000000; color:#ffffff; border-radius:5px; padding:5px 8px; margin-top:3px; display:flex; justify-content:space-between; align-items:center; flex-wrap:nowrap; gap:6px;">
                  <div>
                    <div style="font-size:7.5px; font-weight:800; text-transform:uppercase; color:#94a3b8;">MRP:</div>
                    <div style="font-size:17px; font-weight:900; font-family:monospace; color:#38bdf8; line-height:1; white-space:nowrap;">
                      ₹ ${(part.sellingPrice || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style="font-size:13px; font-weight:900; font-family:monospace; color:#ffffff; letter-spacing:1px; white-space:nowrap; flex-shrink:0; display:inline-block;">
                    [ ${cipherCode} ]
                  </div>
                </div>
              `
          }

        </div>
      `;
    }

    container.innerHTML = stickersHtml;
  }

  // Direct Thermal Printer Streaming
  printStickersDirectly(part) {
    if (!part) return;
    const qtyInput = document.getElementById('print-label-qty');
    const sizeSelect = document.getElementById('print-label-size');
    const styleSelect = document.getElementById('print-label-style');
    const headerStyleSelect = document.getElementById('print-header-style');
    const customWidthInput = document.getElementById('custom-sticker-width');
    const customHeightInput = document.getElementById('custom-sticker-height');

    const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
    const sizeFormat = sizeSelect ? sizeSelect.value : '50x35';
    const stickerStyle = styleSelect ? styleSelect.value : (this.settings.stickerFormat || 'dynamic_code');
    const headerStyle = headerStyleSelect ? headerStyleSelect.value : 'minimal';
    const isDynamic = stickerStyle === 'dynamic_code';

    let widthMm = 50;
    let heightMm = 35;
    if (sizeFormat === '50x35') { widthMm = 50; heightMm = 35; }
    else if (sizeFormat === '50x25') { widthMm = 50; heightMm = 25; }
    else if (sizeFormat === '38x25') { widthMm = 38; heightMm = 25; }
    else if (sizeFormat === '75x50') { widthMm = 75; heightMm = 50; }
    else if (sizeFormat === '100x50') { widthMm = 100; heightMm = 50; }
    else if (sizeFormat === 'custom') {
      widthMm = parseInt(customWidthInput?.value || 50, 10) || 50;
      heightMm = parseInt(customHeightInput?.value || 35, 10) || 35;
    }

    const storeName = this.settings.storeName || "CITY AUTO PARTS & SPARES";
    const barcodeNumber = part.barcode || part.partNumber;
    const barcodeSvg = this.generateBarcodeSVG(barcodeNumber);
    const modelsStr = (part.compatibleModels || []).join(', ') || part.vehicleBrand;
    const priceStr = `₹ ${(part.sellingPrice || 0).toLocaleString('en-IN')}`;
    const cipherCode = this.encodeCostToCipher(part.costPrice);

    let stickersHtml = '';
    for (let i = 0; i < qty; i++) {
      stickersHtml += `
        <div class="sticker-card">
          ${
            headerStyle === 'none' ? '' :
            headerStyle === 'minimal' ? `
              <div class="sticker-header">
                <span class="rack-badge">📍 ${part.rackLocation || 'RACK'} &bull; ${part.brand || 'OEM'}</span>
                <span class="part-sku-badge">${part.partNumber}</span>
              </div>
            ` : `
              <div class="sticker-header">
                <span class="store-name">${storeName}</span>
                <span class="rack-badge">📍 ${part.rackLocation || 'RACK'}</span>
              </div>
            `
          }

          <div class="vehicle-fitment-box">
            <div class="fitment-label">🚗 CAR FITMENT / APPLICATION:</div>
            <div class="fitment-cars">${modelsStr}</div>
          </div>

          <div class="part-title">${part.name}</div>

          <div class="barcode-container">
            ${barcodeSvg}
            <div class="barcode-text">* ${barcodeNumber} *</div>
          </div>

          <div class="sticker-code-banner">
            ${
              isDynamic 
                ? `
                  <div class="code-val" style="font-size:14pt; font-weight:900; letter-spacing:2px; font-family:'Courier New', monospace;">
                    [ ${cipherCode} ]
                  </div>
                  <div class="scan-tag">★ GENUINE OES ★<br>SCAN FOR LIVE PRICE</div>
                `
                : `
                  <div>
                    <div class="code-label">MRP:</div>
                    <div class="mrp-val">${priceStr}</div>
                  </div>
                  <div class="code-val">[ ${cipherCode} ]</div>
                `
            }
          </div>
        </div>
      `;
    }

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
        <title>Print Box Stickers - ${part.partNumber}</title>
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
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 1.5mm;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .stickers-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 2mm;
            justify-content: flex-start;
          }
          .sticker-card {
            width: ${sizeFormat === 'a4-sheet' ? '65mm' : `${widthMm - 3}mm`};
            min-height: ${sizeFormat === 'a4-sheet' ? '35mm' : `${heightMm - 3}mm`};
            border: 2px solid #000000;
            border-radius: 4px;
            padding: 2mm;
            background: #ffffff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .sticker-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1.2px solid #000000;
            padding-bottom: 1mm;
            margin-bottom: 1mm;
          }
          .store-name {
            font-size: 7pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
          }
          .rack-badge {
            font-size: 7pt;
            font-weight: 800;
            color: #000000;
          }
          .part-sku-badge {
            font-size: 7pt;
            font-weight: 900;
            background: #000000 !important;
            color: #ffffff !important;
            padding: 1px 3px;
            border-radius: 2px;
          }
          .vehicle-fitment-box {
            background: #f1f5f9 !important;
            border: 1.5px solid #000000;
            border-radius: 3px;
            padding: 1mm 1.5mm;
            margin-bottom: 1mm;
          }
          .fitment-label {
            font-size: 6pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #334155;
          }
          .fitment-cars {
            font-size: 11pt;
            font-weight: 900;
            color: #000000;
            line-height: 1.1;
            text-transform: uppercase;
          }
          .part-title {
            font-size: 8pt;
            font-weight: 800;
            color: #1e293b;
            line-height: 1.1;
            margin-bottom: 1mm;
          }
          .barcode-container {
            width: 100%;
            text-align: center;
            margin: 1mm 0;
          }
          .sticker-barcode-svg {
            width: 100%;
            height: 22px;
            display: block;
          }
          .barcode-text {
            font-family: 'Courier New', Courier, monospace;
            font-size: 7pt;
            font-weight: 900;
            letter-spacing: 1px;
            color: #000000;
            margin-top: 0.5mm;
          }
          .sticker-code-banner {
            background: #000000 !important;
            color: #ffffff !important;
            border-radius: 3px;
            padding: 1.2mm 2mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap !important;
            white-space: nowrap !important;
            gap: 1.5mm;
          }
          .code-val {
            font-size: ${sizeFormat === '38x25' || (sizeFormat === 'custom' && widthMm <= 40) ? '9.5pt' : '11.5pt'};
            font-weight: 900;
            font-family: 'Courier New', Courier, monospace;
            letter-spacing: 1px;
            color: #ffffff !important;
            line-height: 1;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            display: inline-block !important;
          }
          .mrp-val {
            font-size: 11pt;
            font-weight: 900;
            font-family: monospace;
            color: #38bdf8 !important;
            white-space: nowrap !important;
          }
          .scan-tag {
            font-size: 5.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #34d399 !important;
            text-align: right;
            line-height: 1.1;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
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
