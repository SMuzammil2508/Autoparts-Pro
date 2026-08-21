# AutoParts Pro 🚗⚡
> Modern Multi-Floor Auto Spares & Inventory Management System with Quick Quote, Barcode POS, Daily Outflow Register, and Wholesaler Claims.

---

## ✨ Key Features

- 🏢 **Multi-Floor Stock Routing**: Real-time inventory tracking across Ground Floor (Counter Stash), Floor 1, and Floor 2 with 1-click upstairs restock transfer.
- ⚡ **Instant Search & Normalization**: Smart search by Part Name, Part # / SKU, or Vehicle Brand (Honda, Suzuki / Maruti, Hyundai, Toyota, etc.) with space/hyphen agnostic matching.
- 📷 **Live Camera & Laser Barcode Scanner**: Built-in `Html5Qrcode` camera scanner + support for physical USB/Bluetooth laser barcode guns with continuous buffer listener.
- 🏷️ **Vector Barcodes & Secret Cost Cipher**: Generates Code 39 vector SVG barcodes with customizable 10-letter secret cost code cipher (`SANYO DELHI` / `1234567890`).
- 📖 **Digital Daily Outflow Register**: Replaces paper sales notebooks with automatic logging, instant profit/revenue calculation, date filters, print ledger, and CSV export.
- 🛡️ **Customer Returns & Wholesaler Claims**: Quarantines broken returns into a Defective Bin and prints professional Wholesaler Debit Note Sheets with delivery driver signature blocks.
- 📈 **Bulk Price Revision & Excel Sync**: 1-click brand-wide price revision (+/- %, flat adjustment, or cost margin) plus Excel (.xlsx, .xls) / CSV wholesaler sheet parser with column mapping.
- 🌙 **Dark & Light Mode Themes**: Built with Tailwind CSS, Lucide Icons, and customizable theme palettes (*Midnight, Titanium, Sapphire, Light Modern*).
- 💾 **Local Offline Storage & Backup**: Full JSON backup and restore capabilities for zero data loss.

---

## 🚀 Getting Started

### Run Locally
Simply run the included launcher:
```powershell
.\launch.bat
```
Or start the static server in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 8080
```
Open **[http://localhost:8080](http://localhost:8080)** in any browser.

---

## 🌐 Free 1-Click Deployment (GitHub Pages)

This project is a 100% static web application with ES modules:
1. Push this repository to GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Branch**, select `main` and folder `/ (root)`.
4. Click **Save** — your app is live in seconds at `https://<username>.github.io/<repo-name>/`!
