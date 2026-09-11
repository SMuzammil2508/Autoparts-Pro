// Enterprise Automotive Brand & Component Symbol Library
// Features authentic OEM Car Brand vector logos & High-Precision Auto Parts Component SVGs

export function getBrandBadgeHtml(brand, isSelected = false, size = 'sm') {
  const id = ((brand && brand.id) || '').toLowerCase();
  const name = ((brand && brand.name) || '').toLowerCase();
  const sizeClass = size === 'xs' ? 'w-4 h-4' : (size === 'lg' ? 'w-8 h-8' : 'w-5 h-5');

  if (id === 'all' || !brand) {
    return `
      <span class="${sizeClass} rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-slate-950 text-amber-400' : ''}">
        🚗
      </span>
    `;
  }

  // TOYOTA - Triple Oval Genuine Logo SVG
  if (id === 'toyota' || name.includes('toyota')) {
    return `
      <span class="${sizeClass} rounded-md bg-red-600 text-white flex items-center justify-center p-0.5 shadow-sm" title="Toyota">
        <svg viewBox="0 0 100 70" class="w-full h-full" fill="none" stroke="#ffffff" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round">
          <ellipse cx="50" cy="35" rx="46" ry="31" />
          <ellipse cx="50" cy="23" rx="27" ry="12" />
          <ellipse cx="50" cy="35" rx="14.5" ry="30" />
        </svg>
      </span>
    `;
  }

  // HONDA - Official Trapeze Boxed 'H' Logo SVG
  if (id === 'honda' || name.includes('honda')) {
    return `
      <span class="${sizeClass} rounded-md bg-slate-900 border border-slate-700 text-slate-100 flex items-center justify-center p-0.5 shadow-sm" title="Honda">
        <svg viewBox="0 0 100 90" class="w-full h-full" fill="#ffffff">
          <path d="M12 10 L88 10 C92 10 95 13 94 17 L84 78 C83 83 79 86 74 86 L26 86 C21 86 17 83 16 78 L6 17 C5 13 8 10 12 10 Z" fill="none" stroke="#ffffff" stroke-width="7" />
          <path d="M25 24 L35 24 L38 48 L62 48 L65 24 L75 24 L69 74 L59 74 L61 56 L39 56 L41 74 L31 74 Z" />
        </svg>
      </span>
    `;
  }

  // HYUNDAI - Authentic Official Slanted Oval Emblem & HYUNDAI Wordmark Logo SVG
  if (id === 'hyundai' || name.includes('hyundai')) {
    return `
      <span class="${sizeClass} rounded-md bg-white border border-slate-300 text-[#003984] flex items-center justify-center p-0.5 shadow-sm" title="Hyundai">
        <svg viewBox="0 0 95 68" class="w-full h-full" fill="currentColor">
          <!-- Official Slanted Oval Emblem -->
          <path d="m 56.707,29.416 c 0.714,3.69 -1.22,6.755 -2.827,9.73 -1.785,2.768 -4.731,5.147 -8.272,4.791 -7.946,-0.119 -15.712,-1.339 -22.914,-3.512 -0.327,-0.089 -0.654,-0.298 -0.833,-0.595 -0.149,-0.417 0.06,-0.804 0.357,-1.071 6.577,-5.327 14.403,-7.796 22.14,-10.386 2.886,-0.833 5.952,-1.726 9.195,-1.309 1.338,0.179 2.677,1.102 3.154,2.352 z M 83.816,13.645 c 3.69,3.035 7.023,7.172 5.892,12.171 -1.845,7.38 -9.879,11.308 -16.277,13.807 -3.482,1.161 -6.993,2.352 -10.802,2.709 -0.238,-0.03 -0.625,0.029 -0.685,-0.328 l 0.089,-0.416 c 5.416,-6.101 9.522,-12.944 13.124,-19.878 1.666,-3.125 3.214,-6.338 4.642,-9.493 0.208,-0.238 0.417,-0.357 0.655,-0.446 1.338,0.118 2.291,1.16 3.362,1.874 z M 31.888,5.789 31.769,6.235 C 23.943,15.132 18.795,25.458 13.915,35.724 12.963,36.617 12.04,35.426 11.177,35.039 6.832,32.183 2.904,27.57 4.035,22.095 5.85,14.954 13.2,11.145 19.331,8.557 c 3.63,-1.369 7.41,-2.47 11.397,-3.095 0.417,-10e-4 0.952,-0.06 1.16,0.327 z m 38.835,1.428 c 0.446,0.238 0.982,0.327 1.25,0.773 0.238,0.506 -0.238,0.833 -0.506,1.161 -6.16,4.82 -13.212,7.499 -20.414,9.85 -3.661,0.893 -7.351,2.5 -11.427,1.607 -0.953,-0.238 -1.815,-0.863 -2.351,-1.786 -1.012,-2.797 0.357,-5.713 1.547,-8.153 1.577,-3.065 4.375,-6.666 8.243,-6.725 8.332,-0.06 16.188,1.19 23.658,3.273 z M 81.019,7.455 C 87.328,10.907 94.47,16.977 93.726,25.071 92.863,32.57 85.87,37.807 79.621,40.962 61.379,49.681 35.758,49.948 16.921,42.331 10.552,39.683 3.41,35.13 0.731,28.285 -1.322,22.661 1.177,16.799 5.374,12.901 14.152,4.926 25.341,2.189 36.858,0.611 c 12.499,-1.518 25.651,-0.179 36.84,3.66 2.5,0.923 4.97,1.935 7.321,3.184 z" fill-rule="evenodd" clip-rule="evenodd" />
          <!-- Official HYUNDAI Wordmark below -->
          <g transform="translate(0.5, 49) scale(0.379)">
            <g transform="translate(-113.868, -5.264)">
              <path d="m 347.254,12.112 h -15.209 c -2.553,0.151 -3.266,0.784 -3.266,3.883 v 8.543 h 18.475 z m 8.098,-6.841 v 37.252 h -8.098 V 31.815 h -18.475 v 10.708 h -8.098 V 13.319 c 0,-5.16 2.09,-8.048 8.098,-8.048 z m -42.768,8.041 v 20.16 c 0,6.418 -3.605,9.044 -8.099,9.044 H 278.942 V 5.264 h 25.543 c 6.898,0 8.099,4.386 8.099,8.048 z m -8.195,2.242 c 0,-2.041 -1.244,-3.449 -3.422,-3.449 h -13.926 v 23.276 l 13.926,-10e-4 c 3.172,-0.161 3.422,-2.063 3.422,-3.572 z M 113.868,5.264 h 8.098 v 14.683 h 18.118 V 5.264 h 8.098 v 37.251 h -8.098 V 27.313 h -18.118 v 15.202 h -8.098 V 5.264 Z m 48.193,0 10.152,15.229 10.03,-15.229 h 9.833 L 176.258,29.08 v 13.436 h -8.099 V 29.078 L 152.231,5.264 Z m 75.472,0 h 26.096 c 3.719,0 7.32,0.522 7.215,8.048 v 29.204 h -8.098 V 15.988 c 0,-3.208 -0.385,-3.883 -2.902,-3.883 h -14.211 v 30.411 h -8.1 z m 134.016,0.007 v 37.252 h -8.1 V 5.271 Z M 196.126,42.516 h 26.094 c 5.188,0 7.321,-1.501 7.216,-8.981 V 5.264 h -8.098 v 26.593 c 0,3.188 -0.385,3.575 -2.902,3.575 H 204.225 L 204.224,5.264 h -8.098 z" fill-rule="evenodd" clip-rule="evenodd" />
            </g>
          </g>
        </svg>
      </span>
    `;
  }

  // SUZUKI / MARUTI SUZUKI - Official Dual Boxed Wings & Geometric 'S' Corporate Logo SVG
  if (id === 'suzuki' || name.includes('suzuki') || name.includes('maruti')) {
    const suzukiSizeClass = size === 'xs' ? 'w-7 h-4' : (size === 'lg' ? 'w-16 h-8' : 'w-9 h-5');
    return `
      <span class="${suzukiSizeClass} rounded-md bg-white border border-slate-300 flex items-center justify-center p-0.5 shadow-sm" title="Maruti Suzuki">
        <svg viewBox="0 0 310 100" class="w-full h-full">
          <!-- Left Box: Official Blue Maruti Wings -->
          <rect x="2" y="4" width="92" height="92" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="2.5" />
          <g transform="translate(11.5, 11.5) scale(0.67)">
            <g transform="translate(-122.58, -126.42)">
              <path d="M178.49447,206.78972v-14.88099c0,-11.49518 3.79101,-17.58412 8.42016,-22.21883l16.47955,-16.47401l26.7869,-26.79249v17.86165c0,10.57934 -3.78545,15.69139 -8.42016,20.31498l-12.41656,12.42213l-3.84652,3.85206c-1.39992,1.31138 -2.16825,3.16145 -2.1092,5.07874v2.97511l26.79244,-26.78137v17.8561c0,10.57934 -3.78545,15.69138 -8.42016,20.31498l-3.48575,3.49685l-3.8465,3.84652c-1.16561,1.15452 -2.10922,2.63651 -2.10922,5.07874v2.98064l17.86163,-17.8561v17.8561c0,13.85415 -8.03717,17.8561 -17.86163,17.8561h-33.82499zM174.26496,206.78972v-14.88099c0,-11.49518 -3.78546,-17.58412 -8.42017,-22.21883l-16.48511,-16.47401l-26.78135,-26.79249v17.86165c0,10.57934 3.79104,15.69139 8.42019,20.31498l12.41655,12.42213l3.84653,3.85206c1.16006,1.16006 2.10364,2.63651 2.10364,5.07874v2.97511l-26.78691,-26.78137v17.8561c0,10.57934 3.79104,15.69138 8.42019,20.31498l3.48573,3.49685l3.85208,3.84652c1.15452,1.15452 2.10364,2.63651 2.10364,5.07874v2.98064l-17.86164,-17.8561v17.8561c0,13.85415 8.03718,17.8561 17.86164,17.8561h33.82499z" fill="#1e3a8a" />
            </g>
          </g>
          <!-- Right Box: Official Red Suzuki 'S' -->
          <rect x="98" y="4" width="92" height="92" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="2.5" />
          <g transform="translate(100, 4) scale(0.88)">
            <path d="M18 16 L82 16 L54 43 L80 43 L48 84 L18 84 L46 57 L20 57 Z" fill="#e11d48" />
            <polygon points="18,16 52,16 26,43 18,43" fill="#be123c" />
            <polygon points="82,84 48,84 74,57 82,57" fill="#be123c" />
          </g>
          <!-- Wordmark: MARUTI SUZUKI -->
          <text x="202" y="46" font-family="-apple-system, BlinkMacSystemFont, Arial, Helvetica, sans-serif" font-size="44" font-weight="900" fill="#0f172a" letter-spacing="-1">MARUTI</text>
          <text x="202" y="90" font-family="-apple-system, BlinkMacSystemFont, Arial, Helvetica, sans-serif" font-size="44" font-weight="900" fill="#0f172a" letter-spacing="-1">SUZUKI</text>
        </svg>
      </span>
    `;
  }

  // MAHINDRA - Official Red Oval Emblem with 3 Converging Rays SVG (Emblem Only)
  if (id === 'mahindra' || name.includes('mahindra')) {
    const mahindraSizeClass = size === 'xs' ? 'w-5 h-4' : (size === 'lg' ? 'w-10 h-7' : 'w-7 h-5');
    return `
      <span class="${mahindraSizeClass} rounded-md bg-[#0a0e17] border border-red-600/40 flex items-center justify-center p-0.5 shadow-sm" title="Mahindra">
        <svg viewBox="0 0 100 56" class="w-full h-full">
          <g fill="#ed1c24">
            <!-- Top & Left Loop + Outer Rim -->
            <path d="M 50 3 C 76 3, 97 14, 97 28 C 97 42, 76 53, 50 53 C 24 53, 3 42, 3 28 C 3 14, 24 3, 50 3 Z M 50 8.5 C 26 8.5, 9 17, 9 28 C 9 35, 14 39.5, 22 39 C 32 38, 50 24, 68 11 C 62 9.5, 56 8.5, 50 8.5 Z" fill-rule="evenodd" />

            <!-- Left Ray (curves out of bottom-left) -->
            <path d="M 9.2 29 C 9.2 40, 20 48, 33 50.5 L 69 11.5 C 67.5 11, 46 22.5, 23 33.5 C 14.5 37.5, 9.8 34.5, 9.2 29 Z" />

            <!-- Middle Ray -->
            <path d="M 26.5 50.8 L 36.5 52.8 L 73 12.5 L 69.8 11.3 Z" />

            <!-- Right Ray & Lower Right Rim -->
            <path d="M 43.5 53.6 C 52 54.8, 76 52.5, 92 38 C 96.5 33.5, 95.5 24, 88 18 C 82.5 13.5, 77 12.8, 74.5 12.8 L 43.5 53.6 Z M 56 46 L 75.8 15.8 C 80.5 18.8, 87.5 23.5, 87.5 29.5 C 87.5 36.5, 75 43.5, 56 46 Z" fill-rule="evenodd" />
          </g>
        </svg>
      </span>
    `;
  }

  // TATA MOTORS - Official Royal Blue Oval with Twin Fluid Highway Arcs 'T'
  if (id === 'tata' || name.includes('tata')) {
    return `
      <span class="${sizeClass} rounded-full bg-blue-800 border border-blue-400 text-white flex items-center justify-center p-0.5 shadow-sm" title="Tata Motors">
        <svg viewBox="0 0 100 75" class="w-full h-full" fill="none">
          <!-- Outer Blue Oval Ring -->
          <ellipse cx="50" cy="37.5" rx="46" ry="33" stroke="#ffffff" stroke-width="5.5" />
          <!-- Dual Fluid Wing Arcs forming 'T' & curving horizon -->
          <path d="M 50 63 C 48 46, 38 25, 18 20 C 34 23, 44 38, 47 63 Z" fill="#ffffff" />
          <path d="M 50 63 C 52 46, 62 25, 82 20 C 66 23, 56 38, 53 63 Z" fill="#ffffff" />
          <!-- Top Horizontal Wing Bar -->
          <path d="M 18 20 C 35 17, 65 17, 82 20 C 70 23, 30 23, 18 20 Z" fill="#ffffff" />
        </svg>
      </span>
    `;
  }

  // FORD - Official Classic Royal Blue Oval with Spencerian Script SVG
  if (id === 'ford' || name.includes('ford')) {
    return `
      <span class="${sizeClass} rounded-full bg-blue-900 border border-blue-300 text-white flex items-center justify-center p-0.5 shadow-sm" title="Ford">
        <svg viewBox="0 0 100 60" class="w-full h-full">
          <!-- Blue Oval & Chrome Halo -->
          <ellipse cx="50" cy="30" rx="48" ry="27" fill="#1d4ed8" stroke="#ffffff" stroke-width="3.5" />
          <ellipse cx="50" cy="30" rx="44" ry="23" fill="#1e40af" />
          <!-- Ford Wordmark in Authentic Flowing Script -->
          <text x="50" y="38" font-family="'Brush Script MT', 'Segoe Script', 'Lucida Handwriting', cursive, sans-serif" font-size="27" font-weight="bold" font-style="italic" fill="#ffffff" text-anchor="middle" letter-spacing="-0.5">Ford</text>
        </svg>
      </span>
    `;
  }

  // VOLKSWAGEN - Classic Circular V over W Emblem SVG
  if (id === 'volkswagen' || name.includes('volkswagen') || id === 'vw') {
    return `
      <span class="${sizeClass} rounded-full bg-blue-900 border border-slate-300 text-white flex items-center justify-center p-0.5 shadow-sm" title="Volkswagen">
        <svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="50" cy="50" r="44" />
          <path d="M27 24 L50 64 L73 24" />
          <path d="M18 42 L38 82 L50 64 L62 82 L82 42" />
        </svg>
      </span>
    `;
  }

  // NISSAN - Official Modern Minimalist Chrome Halo Ring & Nameplate SVG
  if (id === 'nissan' || name.includes('nissan')) {
    return `
      <span class="${sizeClass} rounded-full bg-slate-950 border border-slate-700 text-slate-100 flex items-center justify-center p-0.5 shadow-sm" title="Nissan">
        <svg viewBox="0 0 100 100" class="w-full h-full" fill="none">
          <!-- Top Arc -->
          <path d="M 12 42 A 42 42 0 0 1 88 42" stroke="#ffffff" stroke-width="6.5" stroke-linecap="round" />
          <!-- Bottom Arc -->
          <path d="M 12 58 A 42 42 0 0 0 88 58" stroke="#ffffff" stroke-width="6.5" stroke-linecap="round" />
          <!-- Center Wordmark NISSAN -->
          <text x="50" y="54" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">NISSAN</text>
        </svg>
      </span>
    `;
  }

  // KIA - New Modern Connected Wordmark Logo SVG
  if (id === 'kia' || name.includes('kia')) {
    return `
      <span class="${sizeClass} rounded-md bg-red-600 text-white flex items-center justify-center p-0.5 shadow-sm" title="Kia">
        <svg viewBox="0 0 100 45" class="w-full h-full" fill="#ffffff">
          <path d="M10 38 L22 8 L32 8 L24 23 L36 38 L25 38 L18 28 L18 38 Z M40 8 L49 8 L49 38 L40 38 Z M58 38 L68 8 L79 8 L89 38 L78 38 L76 30 L69 30 L66 38 Z" fill-rule="evenodd" />
        </svg>
      </span>
    `;
  }

  // MG (MORRIS GARAGES) - Iconic Octagon Logo SVG
  if (id === 'mg' || name.includes('mg')) {
    return `
      <span class="${sizeClass} rounded-md bg-slate-900 border border-red-600 text-red-500 flex items-center justify-center p-0.5 shadow-sm" title="MG Motors">
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="none" stroke="#ef4444" stroke-width="7" stroke-linejoin="round" />
          <polygon points="32,12 68,12 88,32 88,68 68,88 32,88 12,68 12,32" fill="#991b1b" />
          <text x="50" y="62" font-size="34" font-weight="900" font-family="'Arial Black', sans-serif" fill="#ffffff" text-anchor="middle" letter-spacing="-1">MG</text>
        </svg>
      </span>
    `;
  }

  // SKODA - Winged Arrow Emblem Logo SVG
  if (id === 'skoda' || name.includes('skoda')) {
    return `
      <span class="${sizeClass} rounded-full bg-emerald-800 border border-emerald-400 text-white flex items-center justify-center p-0.5 shadow-sm" title="Skoda">
        <svg viewBox="0 0 100 100" class="w-full h-full" fill="#ffffff">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" stroke-width="6" />
          <path d="M50 20 C54 28 62 34 76 34 C64 42 56 46 52 64 C48 46 40 42 28 34 C42 34 48 28 50 20 Z" />
          <circle cx="50" cy="38" r="4" fill="#ffffff" />
        </svg>
      </span>
    `;
  }

  // RENAULT - Iconic Geometric Diamond Rhombus Logo SVG
  if (id === 'renault' || name.includes('renault')) {
    return `
      <span class="${sizeClass} rounded-md bg-amber-500 text-slate-950 flex items-center justify-center p-0.5 shadow-sm" title="Renault">
        <svg viewBox="0 0 80 100" class="w-full h-full" fill="none" stroke="#000000" stroke-linejoin="round">
          <polygon points="40,5 75,50 40,95 5,50" stroke-width="10" />
          <polygon points="40,24 60,50 40,76 20,50" stroke-width="6" />
        </svg>
      </span>
    `;
  }

  // BMW - Bavarian Roundel Emblem SVG
  if (id === 'bmw' || name.includes('bmw')) {
    return `
      <span class="${sizeClass} rounded-full bg-black border border-slate-400 text-white flex items-center justify-center p-0.5 shadow-sm" title="BMW">
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="#000000" stroke="#cbd5e1" stroke-width="4" />
          <circle cx="50" cy="50" r="30" fill="#ffffff" />
          <path d="M50 20 A30 30 0 0 1 80 50 L50 50 Z" fill="#3b82f6" />
          <path d="M50 50 L20 50 A30 30 0 0 1 50 20 Z" fill="#ffffff" />
          <path d="M50 50 L50 80 A30 30 0 0 1 20 50 Z" fill="#3b82f6" />
          <path d="M50 50 L80 50 A30 30 0 0 1 50 80 Z" fill="#ffffff" />
          <text x="50" y="16" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">BMW</text>
        </svg>
      </span>
    `;
  }

  // MERCEDES-BENZ - Three-Pointed Star SVG
  if (id === 'mercedes' || name.includes('mercedes') || name.includes('benz')) {
    return `
      <span class="${sizeClass} rounded-full bg-slate-900 border border-slate-300 text-white flex items-center justify-center p-0.5 shadow-sm" title="Mercedes-Benz">
        <svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="#ffffff" stroke-linecap="round">
          <circle cx="50" cy="50" r="45" stroke-width="6" />
          <path d="M50 50 L50 8 M50 50 L14 71 M50 50 L86 71" stroke-width="6" />
        </svg>
      </span>
    `;
  }

  // AUDI - Four Interlocking Rings SVG
  if (id === 'audi' || name.includes('audi')) {
    return `
      <span class="${sizeClass} rounded-md bg-slate-900 border border-slate-600 text-white flex items-center justify-center p-0.5 shadow-sm" title="Audi">
        <svg viewBox="0 0 140 60" class="w-full h-full" fill="none" stroke="#ffffff" stroke-width="6">
          <circle cx="25" cy="30" r="20" />
          <circle cx="55" cy="30" r="20" />
          <circle cx="85" cy="30" r="20" />
          <circle cx="115" cy="30" r="20" />
        </svg>
      </span>
    `;
  }

  // JEEP - 7-Slot Grille & Round Headlights SVG
  if (id === 'jeep' || name.includes('jeep')) {
    return `
      <span class="${sizeClass} rounded-md bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center p-0.5 shadow-sm" title="Jeep">
        <svg viewBox="0 0 100 40" class="w-full h-full" fill="currentColor">
          <circle cx="12" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="3" />
          <circle cx="88" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="3" />
          <rect x="26" y="8" width="5" height="24" rx="2.5" />
          <rect x="36" y="8" width="5" height="24" rx="2.5" />
          <rect x="46" y="8" width="5" height="24" rx="2.5" />
          <rect x="56" y="8" width="5" height="24" rx="2.5" />
          <rect x="66" y="8" width="5" height="24" rx="2.5" />
        </svg>
      </span>
    `;
  }

  // ISUZU - Bold Twin Red Trapeze Blocks SVG
  if (id === 'isuzu' || name.includes('isuzu')) {
    return `
      <span class="${sizeClass} rounded-md bg-red-600 text-white flex items-center justify-center p-0.5 shadow-sm" title="Isuzu">
        <svg viewBox="0 0 100 80" class="w-full h-full" fill="#ffffff">
          <polygon points="12,15 42,15 32,70 2,70" />
          <polygon points="58,15 88,15 98,70 68,70" />
        </svg>
      </span>
    `;
  }

  // CHEVROLET - Iconic Golden Bowtie Cross SVG
  if (id === 'chevrolet' || name.includes('chevrolet') || name.includes('chevy')) {
    return `
      <span class="${sizeClass} rounded-md bg-slate-900 border border-amber-400 text-amber-400 flex items-center justify-center p-0.5 shadow-sm" title="Chevrolet">
        <svg viewBox="0 0 100 40" class="w-full h-full" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5">
          <polygon points="5,14 36,14 36,4 64,4 64,14 95,14 95,26 64,26 64,36 36,36 36,26 5,26" />
        </svg>
      </span>
    `;
  }

  // UNIVERSAL FIT
  if (id === 'universal') {
    return `
      <span class="${sizeClass} rounded-md bg-slate-700 text-amber-300 flex items-center justify-center font-bold text-xs shadow-sm" title="Universal Fit">
        ★
      </span>
    `;
  }

  // Default monogram badge for any other custom brand
  const initials = name.slice(0, 2).toUpperCase() || "??";
  return `
    <span class="${sizeClass} rounded-md bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 text-amber-400 flex items-center justify-center font-black text-[9px] shadow-sm">
      ${initials}
    </span>
  `;
}

// AUTOMOTIVE COMPONENT SVG SYMBOL ENGINE FOR CATEGORIES
export function getCategoryBadgeHtml(cat, isSelected = false) {
  const id = ((cat && cat.id) || '').toLowerCase();
  const name = ((cat && cat.name) || '').toLowerCase();
  const activeColor = isSelected ? '#ffffff' : '#38bdf8';

  // 1. ALL CATEGORIES
  if (id === 'all') {
    return `<i data-lucide="grid" class="w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-400'}"></i>`;
  }

  // 2. WIPER BLADES & WINDSHIELD (Real Wiper Blade Sweep Vector SVG)
  if (name.includes('wiper') || id.includes('wiper') || name.includes('blade') || name.includes('windshield')) {
    return `
      <span class="w-4 h-4 flex items-center justify-center" title="Wiper Blades & Windshield">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- Curved Windshield Arc -->
          <path d="M3 18 C 7 7, 17 7, 21 18" />
          <!-- Wiper Blade Arm & Rubber Squeegee Sweep -->
          <line x1="12" y1="18" x2="18" y2="7" stroke-width="2.5" />
          <line x1="15" y1="5" x2="21" y2="9" stroke-width="2.5" />
          <!-- Rain Droplets -->
          <circle cx="7" cy="11" r="0.8" fill="${activeColor}" />
          <circle cx="10" cy="8" r="0.8" fill="${activeColor}" />
        </svg>
      </span>
    `;
  }

  // 2.5 DRIVE SHAFT & AXLE (Rotating CV Axle Shaft & Spline Joint SVG)
  if (name.includes('shaft') || name.includes('axle') || name.includes('cv joint') || id.includes('shaft') || id.includes('axle') || id.includes('driveshaft')) {
    return `
      <span class="w-4 h-4 flex items-center justify-center" title="Drive Shaft & Axle">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- Main Solid Steel Axle Bar -->
          <line x1="4" y1="12" x2="20" y2="12" stroke-width="3" />
          <!-- Rubber Accordion CV Joint Boots -->
          <polyline points="6,7 8,12 6,17" stroke-width="1.8" />
          <polyline points="18,7 16,12 18,17" stroke-width="1.8" />
          <!-- Splined Hub Gear Endings -->
          <rect x="2" y="9" width="3" height="6" rx="1" fill="${activeColor}" stroke="none" />
          <rect x="19" y="9" width="3" height="6" rx="1" fill="${activeColor}" stroke="none" />
        </svg>
      </span>
    `;
  }

  // 3. BRAKES (Real Disc Brake Rotor + Caliper Assembly SVG)
  if (name.includes('brake') || id.includes('brake') || name.includes('disc') || name.includes('pad') || name.includes('shoe')) {
    return `
      <span class="w-4 h-4 flex items-center justify-center" title="Brakes & Rotors">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- Brake Disc Rotor with Cooling Holes -->
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3.5" />
          <!-- Brake Caliper clamping the top corner -->
          <path d="M14 3 C 18 3, 21 6, 21 10 L 17 10 C 17 7.5, 15.5 6, 13 6 Z" fill="${activeColor}" stroke="none" />
        </svg>
      </span>
    `;
  }

  // 4. SUSPENSION & SHOCK ABSORBERS (Shockup Strut & Coil Spring SVG)
  if (name.includes('suspension') || id.includes('suspension') || name.includes('shock') || name.includes('strut')) {
    return `
      <span class="w-4 h-4 flex items-center justify-center" title="Suspension & Shock Absorbers">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- Center Damper Piston Rod -->
          <line x1="12" y1="2" x2="12" y2="22" stroke-width="1.8" />
          <!-- Coil Spring Zigzag -->
          <polyline points="7,6 17,8 7,11 17,13 7,16 17,18 7,20" stroke-width="2.2" />
          <!-- Mounting Eyelets -->
          <circle cx="12" cy="3" r="1.5" fill="${activeColor}" />
          <circle cx="12" cy="21" r="1.5" fill="${activeColor}" />
        </svg>
      </span>
    `;
  }

  // 5. FILTERS (Engine Spin-On Canister Oil & Air Filter SVG)
  if (name.includes('filter') || id.includes('filter')) {
    return `
      <span class="w-4 h-4 flex items-center justify-center" title="Filters (Oil / Air / Fuel)">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- Spin-On Canister Base -->
          <path d="M6 8 L18 8 L18 19 C18 20.5 16.5 22 15 22 L9 22 C7.5 22 6 20.5 6 19 Z" />
          <!-- Threaded Flange Top -->
          <rect x="7" y="3" width="10" height="5" rx="1.5" />
          <!-- Flow Ribs -->
          <line x1="10" y1="11" x2="10" y2="18" />
          <line x1="14" y1="11" x2="14" y2="18" />
        </svg>
      </span>
    `;
  }

  // 6. IGNITION & SPARK PLUGS (Spark Plug with Ceramic Hex & Electrode Spark SVG)
  if (name.includes('ignition') || name.includes('spark') || id.includes('ignition')) {
    return `
      <span class="w-4 h-4 flex items-center justify-center" title="Ignition & Spark Plugs">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- Ceramic Insulator Ribs -->
          <rect x="10" y="2" width="4" height="6" rx="1" />
          <!-- Hexagon Nut Section -->
          <rect x="8" y="8" width="8" height="4" fill="${activeColor}" stroke="none" />
          <!-- Threaded Body -->
          <rect x="9.5" y="12" width="5" height="6" />
          <!-- Ground Electrode & Spark Arc -->
          <path d="M12 18 L12 21 L10 21" stroke-width="2" />
        </svg>
      </span>
    `;
  }

  // 7. ELECTRICAL & BATTERY (12V Car Battery with Terminals SVG)
  if (name.includes('electr') || name.includes('battery') || name.includes('alternator') || name.includes('starter')) {
    return `
      <span class="w-4 h-4 flex items-center justify-center" title="Electrical & Battery">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- Battery Case -->
          <rect x="3" y="7" width="18" height="14" rx="2" />
          <!-- Positive & Negative Terminal Posts -->
          <rect x="6" y="3" width="3" height="4" rx="0.5" fill="${activeColor}" />
          <rect x="15" y="3" width="3" height="4" rx="0.5" fill="${activeColor}" />
          <!-- Plus & Minus Icons on Battery Face -->
          <path d="M7 12 L9 12 M8 11 L8 13" stroke-width="1.8" />
          <line x1="15" y1="12" x2="17" y2="12" stroke-width="1.8" />
        </svg>
      </span>
    `;
  }

  // 8. COOLING & RADIATOR (Honeycomb Radiator Core & Cooling Fan SVG)
  if (name.includes('cool') || name.includes('radiator') || name.includes('water pump') || name.includes('fan')) {
    return `
      <span class="w-4 h-4 flex items-center justify-center" title="Cooling & Radiator">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- Radiator Frame -->
          <rect x="3" y="5" width="18" height="15" rx="2" />
          <!-- Cooling Fin Vanes -->
          <line x1="7" y1="8" x2="7" y2="17" stroke-dasharray="1.5 1.5" />
          <line x1="12" y1="8" x2="12" y2="17" stroke-dasharray="1.5 1.5" />
          <line x1="17" y1="8" x2="17" y2="17" stroke-dasharray="1.5 1.5" />
          <!-- Radiator Cap -->
          <rect x="10" y="2" width="4" height="3" rx="1" fill="${activeColor}" />
        </svg>
      </span>
    `;
  }

  // 9. CLUTCH & TRANSMISSION (Multi-Spring Clutch Plate Disc SVG)
  if (name.includes('clutch') || id.includes('clutch') || name.includes('gear') || name.includes('transmission')) {
    return `
      <span class="w-4 h-4 flex items-center justify-center" title="Clutch & Gearbox">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" fill="${activeColor}" />
          <!-- Torsion Springs around Hub -->
          <rect x="7" y="7" width="2" height="3" rx="1" />
          <rect x="15" y="7" width="2" height="3" rx="1" />
          <rect x="7" y="14" width="2" height="3" rx="1" />
          <rect x="15" y="14" width="2" height="3" rx="1" />
        </svg>
      </span>
    `;
  }

  // 10. BELTS & TIMING (Ribbed Serpentine Belt & Tensioner Pulley SVG)
  if (name.includes('belt') || id.includes('belt') || name.includes('timing') || name.includes('tensioner')) {
    return `
      <span class="w-4 h-4 flex items-center justify-center" title="Belts & Timing Kit">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- Top Pulley -->
          <circle cx="8" cy="8" r="4" />
          <circle cx="8" cy="8" r="1.5" fill="${activeColor}" />
          <!-- Bottom Right Pulley -->
          <circle cx="16" cy="15" r="5" />
          <circle cx="16" cy="15" r="2" fill="${activeColor}" />
          <!-- Looped Belt wrapping both -->
          <path d="M8 4 C 18 4, 21 10, 21 15 C 21 20, 14 20, 11 20 C 4 20, 4 12, 4 8 Z" stroke-dasharray="3 1" />
        </svg>
      </span>
    `;
  }

  // 11. ENGINE OILS & LUBRICANTS (Motor Oil Bottle & Droplet SVG)
  if (name.includes('oil') || name.includes('fluid') || name.includes('lubricant') || id.includes('oil')) {
    return `
      <span class="w-4 h-4 flex items-center justify-center" title="Engine Oils & Fluids">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2 C8 7, 6 11, 6 15 C6 18.5 8.7 21.5 12 21.5 C15.3 21.5 18 18.5 18 15 C18 11, 16 7, 12 2 Z" />
          <circle cx="10" cy="15" r="1.5" fill="${activeColor}" />
        </svg>
      </span>
    `;
  }

  // 12. SENSORS & ECU ELECTRONICS
  if (name.includes('sensor') || name.includes('ecu') || name.includes('relay')) {
    return `
      <span class="w-4 h-4 flex items-center justify-center" title="Sensors & ECU">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="2" fill="${activeColor}" />
          <path d="M4.93 4.93 A10 10 0 0 1 19.07 4.93 M7.76 7.76 A6 6 0 0 1 16.24 7.76 M4.93 19.07 A10 10 0 0 1 19.07 19.07" />
        </svg>
      </span>
    `;
  }

  // 13. HEADLIGHTS & LIGHTING
  if (name.includes('light') || name.includes('bulb') || name.includes('lamp') || name.includes('led')) {
    return `
      <span class="w-4 h-4 flex items-center justify-center" title="Headlights & Lighting">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18h6 M10 22h4 M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
        </svg>
      </span>
    `;
  }

  // 14. DEFAULT FALLBACK
  return `<i data-lucide="tag" class="w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-400'}"></i>`;
}
