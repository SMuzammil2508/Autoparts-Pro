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

  // TOYOTA - Authentic Official Red Triple-Oval Emblem SVG
  if (id === 'toyota' || name.includes('toyota')) {
    const toyotaSizeClass = size === 'xs' ? 'w-5 h-4' : (size === 'lg' ? 'w-10 h-7' : 'w-7 h-5');
    return `
      <span class="${toyotaSizeClass} rounded-md bg-white border border-slate-300 flex items-center justify-center p-0.5 shadow-sm" title="Toyota">
        <svg viewBox="32.75 0 185.85 114" class="w-full h-full" fill="#eb0a1e">
          <path d="M166.976 5.883C155.451 2.16 141.164 0 125.677 0 110.19 0 95.903 2.161 84.378 5.883c-30.614 9.844-51.624 30.254-51.624 53.784 0 33.136 41.54 60.148 92.923 60.148 51.264 0 92.923-26.892 92.923-60.148 0-23.53-21.01-43.94-51.624-53.784zm-41.299 88.12c-7.683 0-13.926-15.007-14.286-33.975 4.562.48 9.364.6 14.286.6 4.922 0 9.725-.24 14.287-.6-.36 18.968-6.603 33.975-14.287 33.975Zm-13.326-48.742c2.04-13.326 7.203-22.69 13.326-22.69 6.003 0 11.165 9.364 13.326 22.69-4.202.36-8.764.6-13.326.6-4.562 0-9.004-.24-13.326-.6zm34.816-1.08c-3.121-20.77-11.525-35.777-21.49-35.777-9.964 0-18.368 14.887-21.49 35.776-18.848-3.001-32.055-9.604-32.055-17.408 0-10.565 24.012-19.088 53.545-19.088 29.534 0 53.545 8.523 53.545 19.088 0 7.804-13.206 14.527-32.055 17.408zM46.321 57.505c0-10.204 3.961-19.689 10.805-27.972-.12.6-.12 1.2-.12 1.68 0 12.846 19.208 23.651 45.98 27.733v2.881c0 23.771 6.604 43.94 15.728 50.904C78.135 110.33 46.32 86.56 46.32 57.506zm86.32 55.346c9.123-6.963 15.727-27.133 15.727-50.904v-2.88c26.772-3.963 45.98-14.888 45.98-27.734 0-.6 0-1.2-.12-1.68 6.844 8.163 10.806 17.768 10.806 27.973 0 28.933-31.815 52.704-72.394 55.225z" />
        </svg>
      </span>
    `;
  }

  // HONDA - Official Red Type-R 'H' Trapeze Boxed Emblem SVG
  if (id === 'honda' || name.includes('honda')) {
    const hondaSizeClass = size === 'xs' ? 'w-5 h-4' : (size === 'lg' ? 'w-10 h-8' : 'w-6 h-5');
    return `
      <span class="${hondaSizeClass} rounded-md bg-white border border-slate-300 flex items-center justify-center p-0.5 shadow-sm" title="Honda">
        <svg viewBox="13 15 293 239" class="w-full h-full" fill="#e40521">
          <path fill-rule="evenodd" d="M 138.0 15.5 L 138.5 15.0 L 180.5 15.0 L 181.5 16.0 L 205.5 16.0 L 206.5 17.0 L 222.5 17.0 L 223.5 18.0 L 233.5 18.0 L 234.5 19.0 L 243.5 19.0 L 244.5 20.0 L 250.5 20.0 L 251.5 21.0 L 255.5 21.0 L 256.5 22.0 L 260.5 22.0 L 261.5 23.0 L 264.5 23.0 L 265.5 24.0 L 270.5 25.0 L 273.5 27.0 L 275.5 27.0 L 279.5 29.0 L 281.5 31.0 L 285.5 33.0 L 294.0 41.5 L 294.0 42.5 L 298.0 47.5 L 299.0 49.5 L 299.0 51.5 L 301.0 54.5 L 301.0 56.5 L 303.0 60.5 L 303.0 64.5 L 304.0 65.5 L 304.0 71.5 L 305.0 72.5 L 305.0 88.5 L 306.0 89.5 L 306.0 126.5 L 305.0 127.5 L 305.0 142.5 L 304.0 143.5 L 304.0 152.5 L 303.0 153.5 L 303.0 162.5 L 302.0 163.5 L 302.0 171.5 L 301.0 172.5 L 301.0 178.5 L 300.0 179.5 L 300.0 184.5 L 299.0 185.5 L 299.0 189.5 L 298.0 190.5 L 297.0 199.5 L 296.0 200.5 L 296.0 203.5 L 295.0 204.5 L 295.0 206.5 L 294.0 207.5 L 294.0 209.5 L 293.0 210.5 L 292.0 215.5 L 287.0 225.5 L 284.0 228.5 L 284.0 229.5 L 273.5 239.0 L 263.5 244.0 L 261.5 244.0 L 260.5 245.0 L 258.5 245.0 L 254.5 247.0 L 251.5 247.0 L 250.5 248.0 L 246.5 248.0 L 245.5 249.0 L 241.5 249.0 L 240.5 250.0 L 234.5 250.0 L 233.5 251.0 L 224.5 251.0 L 223.5 252.0 L 209.5 252.0 L 208.5 253.0 L 181.5 253.0 L 180.5 254.0 L 139.5 254.0 L 138.5 253.0 L 111.5 253.0 L 110.5 252.0 L 96.5 252.0 L 95.5 251.0 L 86.5 251.0 L 85.5 250.0 L 78.5 250.0 L 77.5 249.0 L 68.5 248.0 L 67.5 247.0 L 64.5 247.0 L 63.5 246.0 L 61.5 246.0 L 60.5 245.0 L 55.5 244.0 L 47.5 240.0 L 41.5 235.0 L 40.5 235.0 L 32.0 225.5 L 27.0 215.5 L 27.0 213.5 L 26.0 212.5 L 26.0 210.5 L 25.0 209.5 L 25.0 207.5 L 23.0 203.5 L 23.0 200.5 L 22.0 199.5 L 22.0 195.5 L 21.0 194.5 L 21.0 190.5 L 20.0 189.5 L 20.0 185.5 L 19.0 184.5 L 19.0 179.5 L 18.0 178.5 L 18.0 172.5 L 17.0 171.5 L 17.0 163.5 L 16.0 162.5 L 16.0 153.5 L 15.0 152.5 L 15.0 142.5 L 14.0 141.5 L 14.0 127.5 L 13.0 126.5 L 13.0 80.5 L 14.0 79.5 L 14.0 69.5 L 15.0 68.5 L 15.0 63.5 L 16.0 62.5 L 16.0 59.5 L 17.0 58.5 L 18.0 53.5 L 22.0 45.5 L 27.0 39.5 L 27.0 38.5 L 34.5 32.0 L 35.5 32.0 L 37.5 30.0 L 45.5 26.0 L 47.5 26.0 L 48.5 25.0 L 50.5 25.0 L 54.5 23.0 L 57.5 23.0 L 58.5 22.0 L 61.5 22.0 L 62.5 21.0 L 67.5 21.0 L 68.5 20.0 L 74.5 20.0 L 75.5 19.0 L 83.5 19.0 L 84.5 18.0 L 95.5 18.0 L 96.5 17.0 L 112.5 17.0 L 113.5 16.0 L 137.5 16.0 L 138.0 15.5 Z M 140.0 24.5 L 140.5 24.0 L 181.5 24.0 L 182.5 25.0 L 204.5 25.0 L 205.5 26.0 L 219.5 26.0 L 220.5 27.0 L 229.5 27.0 L 230.5 28.0 L 237.5 28.0 L 238.5 29.0 L 244.5 29.0 L 245.5 30.0 L 250.5 30.0 L 251.5 31.0 L 254.5 31.0 L 255.5 32.0 L 257.5 32.0 L 258.5 33.0 L 263.5 34.0 L 269.5 37.0 L 271.5 39.0 L 272.5 39.0 L 281.0 47.5 L 281.0 48.5 L 283.0 50.5 L 286.0 56.5 L 286.0 58.5 L 288.0 62.5 L 288.0 65.5 L 289.0 66.5 L 289.0 71.5 L 290.0 72.5 L 290.0 82.5 L 291.0 83.5 L 291.0 136.5 L 290.0 137.5 L 290.0 148.5 L 289.0 149.5 L 289.0 159.5 L 288.0 160.5 L 288.0 168.5 L 287.0 169.5 L 287.0 176.5 L 286.0 177.5 L 286.0 182.5 L 285.0 183.5 L 285.0 188.5 L 284.0 189.5 L 284.0 192.5 L 283.0 193.5 L 283.0 197.5 L 282.0 198.5 L 282.0 200.5 L 281.0 201.5 L 281.0 204.5 L 278.0 210.5 L 278.0 212.5 L 276.0 216.5 L 272.0 221.5 L 272.0 222.5 L 264.5 230.0 L 263.5 230.0 L 261.5 232.0 L 253.5 236.0 L 251.5 236.0 L 247.5 238.0 L 244.5 238.0 L 243.5 239.0 L 239.5 239.0 L 238.5 240.0 L 233.5 240.0 L 232.5 241.0 L 225.5 241.0 L 224.5 242.0 L 214.5 242.0 L 213.5 243.0 L 196.5 243.0 L 195.5 244.0 L 123.5 244.0 L 122.5 243.0 L 105.5 243.0 L 104.5 242.0 L 94.5 242.0 L 93.5 241.0 L 86.5 241.0 L 85.5 240.0 L 79.5 240.0 L 78.5 239.0 L 74.5 239.0 L 70.5 237.0 L 67.5 237.0 L 55.5 231.0 L 51.5 227.0 L 50.5 227.0 L 49.0 225.5 L 49.0 224.5 L 45.0 220.5 L 39.0 208.5 L 39.0 206.5 L 37.0 202.5 L 37.0 199.5 L 36.0 198.5 L 36.0 195.5 L 35.0 194.5 L 35.0 191.5 L 34.0 190.5 L 34.0 186.5 L 33.0 185.5 L 33.0 180.5 L 32.0 179.5 L 32.0 173.5 L 31.0 172.5 L 31.0 164.5 L 30.0 163.5 L 30.0 154.5 L 29.0 153.5 L 29.0 142.5 L 28.0 141.5 L 28.0 124.5 L 27.0 123.5 L 27.0 96.5 L 28.0 95.5 L 28.0 78.5 L 29.0 77.5 L 29.0 69.5 L 30.0 68.5 L 30.0 64.5 L 31.0 63.5 L 31.0 60.5 L 32.0 59.5 L 32.0 57.5 L 36.0 49.5 L 38.0 47.5 L 38.0 46.5 L 44.5 40.0 L 45.5 40.0 L 47.5 38.0 L 48.5 38.0 L 50.5 36.0 L 54.5 34.0 L 56.5 34.0 L 57.5 33.0 L 59.5 33.0 L 63.5 31.0 L 67.5 31.0 L 68.5 30.0 L 72.5 30.0 L 73.5 29.0 L 79.5 29.0 L 80.5 28.0 L 87.5 28.0 L 88.5 27.0 L 98.5 27.0 L 99.5 26.0 L 112.5 26.0 L 113.5 25.0 L 139.5 25.0 L 140.0 24.5 Z M 75.0 36.5 L 75.5 36.0 L 91.5 36.0 L 92.0 36.5 L 92.0 39.5 L 93.0 40.5 L 93.0 44.5 L 94.0 45.5 L 94.0 49.5 L 95.0 50.5 L 95.0 53.5 L 96.0 54.5 L 96.0 58.5 L 97.0 59.5 L 97.0 62.5 L 98.0 63.5 L 98.0 67.5 L 99.0 68.5 L 99.0 71.5 L 100.0 72.5 L 100.0 76.5 L 101.0 77.5 L 101.0 80.5 L 102.0 81.5 L 102.0 84.5 L 103.0 85.5 L 103.0 89.5 L 104.0 90.5 L 104.0 93.5 L 105.0 94.5 L 105.0 97.5 L 106.0 98.5 L 106.0 101.5 L 107.0 102.5 L 107.0 105.5 L 108.0 106.5 L 108.0 109.5 L 109.0 110.5 L 109.0 113.5 L 110.0 114.5 L 110.0 117.5 L 111.0 118.5 L 112.0 125.5 L 113.0 126.5 L 113.0 128.5 L 114.0 129.5 L 114.0 132.5 L 115.0 133.5 L 115.0 135.5 L 116.0 136.5 L 116.0 138.5 L 118.0 141.5 L 118.0 143.5 L 119.0 145.5 L 121.0 147.5 L 122.0 150.5 L 129.5 158.0 L 135.5 161.0 L 140.5 162.0 L 141.5 163.0 L 147.5 163.0 L 148.5 164.0 L 169.5 164.0 L 170.5 163.0 L 176.5 163.0 L 177.5 162.0 L 180.5 162.0 L 188.5 158.0 L 196.0 150.5 L 196.0 149.5 L 198.0 147.5 L 201.0 141.5 L 201.0 139.5 L 203.0 136.5 L 203.0 134.5 L 204.0 133.5 L 204.0 130.5 L 206.0 126.5 L 206.0 123.5 L 207.0 122.5 L 207.0 119.5 L 208.0 118.5 L 208.0 115.5 L 209.0 114.5 L 209.0 111.5 L 210.0 110.5 L 210.0 107.5 L 211.0 106.5 L 211.0 103.5 L 213.0 99.5 L 213.0 96.5 L 214.0 95.5 L 214.0 91.5 L 215.0 90.5 L 215.0 87.5 L 216.0 86.5 L 216.0 83.5 L 217.0 82.5 L 217.0 79.5 L 218.0 78.5 L 218.0 74.5 L 219.0 73.5 L 219.0 70.5 L 220.0 69.5 L 220.0 65.5 L 221.0 64.5 L 221.0 61.5 L 222.0 60.5 L 222.0 56.5 L 223.0 55.5 L 223.0 51.5 L 224.0 50.5 L 224.0 47.5 L 225.0 46.5 L 225.0 42.5 L 226.0 41.5 L 226.0 38.5 L 227.5 36.0 L 242.5 36.0 L 243.5 37.0 L 247.0 37.5 L 247.0 40.5 L 246.0 41.5 L 246.0 56.5 L 245.0 57.5 L 245.0 71.5 L 244.0 72.5 L 244.0 87.5 L 243.0 88.5 L 243.0 102.5 L 242.0 103.5 L 242.0 117.5 L 241.0 118.5 L 241.0 133.5 L 240.0 134.5 L 240.0 147.5 L 239.0 148.5 L 239.0 162.5 L 238.0 163.5 L 238.0 176.5 L 237.0 177.5 L 237.0 189.5 L 236.0 190.5 L 236.0 202.5 L 235.0 203.5 L 235.0 215.5 L 234.0 216.5 L 234.0 227.5 L 233.0 228.5 L 233.0 233.5 L 232.5 234.0 L 228.5 234.0 L 227.5 235.0 L 214.5 235.0 L 213.5 236.0 L 204.5 236.0 L 204.0 233.5 L 203.0 232.5 L 203.0 229.5 L 202.0 228.5 L 202.0 225.5 L 201.0 224.5 L 201.0 221.5 L 200.0 220.5 L 200.0 217.5 L 198.0 213.5 L 198.0 210.5 L 197.0 209.5 L 197.0 207.5 L 196.0 206.5 L 196.0 204.5 L 195.0 203.5 L 194.0 198.5 L 189.0 188.5 L 184.5 184.0 L 180.5 182.0 L 177.5 182.0 L 176.5 181.0 L 171.5 181.0 L 170.5 180.0 L 148.5 180.0 L 147.5 181.0 L 141.5 181.0 L 140.5 182.0 L 138.5 182.0 L 134.5 184.0 L 129.0 189.5 L 125.0 197.5 L 125.0 199.5 L 124.0 200.5 L 124.0 202.5 L 123.0 203.5 L 123.0 205.5 L 121.0 209.5 L 121.0 212.5 L 119.0 216.5 L 119.0 219.5 L 118.0 220.5 L 118.0 223.5 L 117.0 224.5 L 116.0 231.5 L 115.0 232.5 L 115.0 234.5 L 113.5 236.0 L 105.5 236.0 L 104.5 235.0 L 90.5 235.0 L 89.5 234.0 L 85.0 233.5 L 85.0 223.5 L 84.0 222.5 L 84.0 211.5 L 83.0 210.5 L 83.0 198.5 L 82.0 197.5 L 82.0 184.5 L 81.0 183.5 L 81.0 171.5 L 80.0 170.5 L 80.0 157.5 L 79.0 156.5 L 79.0 142.5 L 78.0 141.5 L 78.0 127.5 L 77.0 126.5 L 77.0 112.5 L 76.0 111.5 L 76.0 97.5 L 75.0 96.5 L 75.0 81.5 L 74.0 80.5 L 74.0 65.5 L 73.0 64.5 L 73.0 50.5 L 72.0 49.5 L 72.0 37.5 L 75.0 36.5 Z" />
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
      <span class="${mahindraSizeClass} rounded-md bg-white border border-slate-300 flex items-center justify-center p-0.5 shadow-sm" title="Mahindra">
        <svg viewBox="9 4 310 143" class="w-full h-full" fill="#e41936">
          <path fill-rule="evenodd" d="M 163.0 4.5 L 163.5 4.0 L 164.5 5.0 L 166.5 4.0 L 167.5 5.0 L 191.5 5.0 L 192.5 6.0 L 201.5 6.0 L 202.5 7.0 L 209.5 7.0 L 210.5 8.0 L 217.5 8.0 L 218.5 9.0 L 222.5 9.0 L 223.5 10.0 L 232.5 11.0 L 233.5 12.0 L 236.5 12.0 L 237.5 13.0 L 240.5 13.0 L 241.5 14.0 L 245.5 14.0 L 246.5 15.0 L 248.5 15.0 L 252.5 17.0 L 255.5 17.0 L 258.5 19.0 L 260.5 19.0 L 261.5 20.0 L 266.5 21.0 L 269.5 23.0 L 271.5 23.0 L 287.5 31.0 L 289.5 33.0 L 290.5 33.0 L 292.5 35.0 L 296.5 37.0 L 299.5 40.0 L 300.5 40.0 L 311.0 50.5 L 311.0 51.5 L 313.0 53.5 L 313.0 54.5 L 315.0 56.5 L 317.0 60.5 L 317.0 62.5 L 318.0 63.5 L 318.0 66.5 L 319.0 67.5 L 319.0 79.5 L 318.0 80.5 L 317.0 85.5 L 311.0 97.5 L 309.0 99.5 L 307.0 103.5 L 303.0 107.5 L 303.0 108.5 L 290.5 120.0 L 289.5 120.0 L 281.5 126.0 L 276.5 128.0 L 274.5 130.0 L 272.5 131.0 L 270.5 131.0 L 265.5 134.0 L 263.5 134.0 L 257.5 137.0 L 254.5 137.0 L 250.5 139.0 L 243.5 140.0 L 239.5 142.0 L 234.5 142.0 L 233.5 143.0 L 229.5 143.0 L 228.5 144.0 L 222.5 144.0 L 221.5 145.0 L 213.5 145.0 L 212.5 146.0 L 198.5 146.0 L 197.5 147.0 L 164.5 147.0 L 163.5 146.0 L 148.5 146.0 L 146.5 145.0 L 146.0 143.5 L 149.0 137.5 L 151.0 135.5 L 153.0 130.5 L 155.0 128.5 L 157.0 123.5 L 159.0 121.5 L 163.0 113.5 L 171.0 102.5 L 172.0 99.5 L 177.0 93.5 L 178.0 90.5 L 181.0 87.5 L 181.0 86.5 L 186.0 80.5 L 188.0 76.5 L 191.0 73.5 L 191.0 72.5 L 194.0 69.5 L 196.0 65.5 L 200.0 61.5 L 200.0 60.5 L 203.0 57.5 L 203.0 56.5 L 207.0 52.5 L 207.0 51.5 L 210.0 48.5 L 210.0 47.5 L 213.0 44.5 L 213.0 43.5 L 218.0 38.5 L 218.0 37.5 L 222.0 33.5 L 222.0 32.5 L 226.0 28.5 L 226.0 27.5 L 231.0 22.5 L 231.0 21.5 L 229.5 21.0 L 210.5 39.0 L 209.5 39.0 L 185.0 63.5 L 185.0 64.5 L 175.0 74.5 L 175.0 75.5 L 165.0 86.5 L 165.0 87.5 L 161.0 91.5 L 161.0 92.5 L 158.0 95.5 L 158.0 96.5 L 149.0 107.5 L 149.0 108.5 L 147.0 110.5 L 147.0 111.5 L 145.0 113.5 L 143.0 117.5 L 140.0 120.5 L 139.0 123.5 L 137.0 125.5 L 137.0 126.5 L 129.0 137.5 L 128.0 140.5 L 125.5 143.0 L 123.5 142.0 L 116.5 142.0 L 115.5 141.0 L 111.5 141.0 L 110.5 140.0 L 106.5 140.0 L 105.5 139.0 L 101.5 139.0 L 100.5 138.0 L 97.5 138.0 L 96.5 137.0 L 92.5 137.0 L 91.5 136.0 L 88.5 136.0 L 88.0 134.5 L 106.0 116.5 L 106.0 115.5 L 107.5 115.0 L 109.0 113.5 L 109.0 112.5 L 110.5 112.0 L 112.0 110.5 L 112.0 109.5 L 118.0 104.5 L 118.5 103.0 L 119.5 103.0 L 136.5 86.0 L 137.5 86.0 L 146.5 77.0 L 147.5 77.0 L 154.5 70.0 L 155.5 70.0 L 166.5 60.0 L 167.5 60.0 L 176.5 52.0 L 177.5 52.0 L 180.5 49.0 L 181.5 49.0 L 184.5 46.0 L 185.5 46.0 L 189.5 42.0 L 190.5 42.0 L 193.5 39.0 L 194.5 39.0 L 200.5 34.0 L 204.5 32.0 L 207.5 29.0 L 208.5 29.0 L 210.5 27.0 L 211.5 27.0 L 213.5 25.0 L 214.5 25.0 L 216.5 23.0 L 220.5 21.0 L 222.0 19.5 L 220.5 19.0 L 217.5 21.0 L 215.5 21.0 L 203.5 27.0 L 201.5 29.0 L 185.5 37.0 L 183.5 39.0 L 180.5 40.0 L 178.5 42.0 L 170.5 46.0 L 168.5 48.0 L 167.5 48.0 L 165.5 50.0 L 164.5 50.0 L 162.5 52.0 L 161.5 52.0 L 159.5 54.0 L 158.5 54.0 L 156.5 56.0 L 155.5 56.0 L 153.5 58.0 L 149.5 60.0 L 146.5 63.0 L 142.5 65.0 L 139.5 68.0 L 138.5 68.0 L 135.5 71.0 L 134.5 71.0 L 131.5 74.0 L 130.5 74.0 L 127.5 77.0 L 126.5 77.0 L 112.5 89.0 L 111.5 89.0 L 106.5 94.0 L 105.5 94.0 L 100.5 99.0 L 99.5 99.0 L 93.5 105.0 L 92.5 105.0 L 85.5 112.0 L 84.5 112.0 L 67.5 128.0 L 65.5 128.0 L 57.5 124.0 L 55.5 124.0 L 49.5 121.0 L 47.5 119.0 L 42.5 117.0 L 40.5 115.0 L 39.5 115.0 L 37.5 113.0 L 33.5 111.0 L 29.5 107.0 L 28.5 107.0 L 19.0 97.5 L 19.0 96.5 L 14.0 90.5 L 12.0 86.5 L 11.0 81.5 L 10.0 80.5 L 10.0 75.5 L 9.0 74.5 L 9.0 71.5 L 10.0 70.5 L 10.0 65.5 L 11.0 64.5 L 12.0 59.5 L 15.0 55.5 L 15.0 54.5 L 17.0 52.5 L 17.0 51.5 L 28.5 40.0 L 29.5 40.0 L 32.5 37.0 L 33.5 37.0 L 38.5 33.0 L 43.5 31.0 L 47.5 28.0 L 49.5 28.0 L 51.5 26.0 L 53.5 26.0 L 63.5 21.0 L 65.5 21.0 L 66.5 20.0 L 68.5 20.0 L 69.5 19.0 L 71.5 19.0 L 72.5 18.0 L 74.5 18.0 L 78.5 16.0 L 81.5 16.0 L 85.5 14.0 L 88.5 14.0 L 89.5 13.0 L 92.5 13.0 L 93.5 12.0 L 96.5 12.0 L 97.5 11.0 L 102.5 11.0 L 103.5 10.0 L 112.5 9.0 L 113.5 8.0 L 119.5 8.0 L 120.5 7.0 L 128.5 7.0 L 129.5 6.0 L 137.5 6.0 L 138.5 5.0 L 162.5 5.0 L 163.0 4.5 Z M 143.0 10.5 L 143.5 10.0 L 192.5 10.0 L 193.5 11.0 L 204.5 11.0 L 205.5 12.0 L 215.5 12.0 L 216.5 13.0 L 218.5 13.0 L 219.0 13.5 L 218.5 14.0 L 213.5 15.0 L 210.5 17.0 L 205.5 18.0 L 197.5 22.0 L 192.5 23.0 L 189.5 25.0 L 187.5 25.0 L 184.5 27.0 L 182.5 27.0 L 179.5 29.0 L 177.5 29.0 L 172.5 32.0 L 170.5 32.0 L 165.5 35.0 L 163.5 35.0 L 154.5 40.0 L 152.5 40.0 L 135.5 49.0 L 133.5 49.0 L 129.5 52.0 L 127.5 52.0 L 123.5 55.0 L 121.5 55.0 L 117.5 58.0 L 87.5 73.0 L 85.5 75.0 L 78.5 78.0 L 76.5 80.0 L 71.5 82.0 L 69.5 84.0 L 62.5 87.0 L 58.5 90.0 L 55.5 90.0 L 54.5 89.0 L 49.5 88.0 L 43.5 85.0 L 41.5 83.0 L 40.5 83.0 L 35.0 76.5 L 35.0 74.5 L 34.0 73.5 L 34.0 65.5 L 35.0 64.5 L 35.0 61.5 L 39.0 53.5 L 47.0 44.5 L 47.0 43.5 L 51.5 39.0 L 52.5 39.0 L 56.5 35.0 L 57.5 35.0 L 62.5 31.0 L 67.5 29.0 L 69.5 27.0 L 71.5 27.0 L 83.5 21.0 L 86.5 21.0 L 87.5 20.0 L 89.5 20.0 L 93.5 18.0 L 96.5 18.0 L 97.5 17.0 L 100.5 17.0 L 101.5 16.0 L 104.5 16.0 L 105.5 15.0 L 110.5 15.0 L 111.5 14.0 L 115.5 14.0 L 116.5 13.0 L 122.5 13.0 L 123.5 12.0 L 131.5 12.0 L 132.5 11.0 L 142.5 11.0 L 143.0 10.5 Z M 243.0 20.5 L 243.5 20.0 L 244.5 21.0 L 248.5 21.0 L 249.5 22.0 L 251.5 22.0 L 252.5 23.0 L 254.5 23.0 L 255.5 24.0 L 260.5 25.0 L 266.5 28.0 L 268.5 30.0 L 274.5 33.0 L 279.5 38.0 L 280.5 38.0 L 282.0 39.5 L 282.0 40.5 L 287.0 45.5 L 287.0 46.5 L 289.0 48.5 L 293.0 56.5 L 293.0 58.5 L 295.0 62.5 L 295.0 66.5 L 296.0 67.5 L 296.0 69.5 L 295.0 70.5 L 295.0 73.5 L 294.0 74.5 L 294.0 76.5 L 292.0 80.5 L 281.5 91.0 L 280.5 91.0 L 275.5 95.0 L 265.5 100.0 L 263.5 100.0 L 258.5 103.0 L 256.5 103.0 L 255.5 104.0 L 253.5 104.0 L 249.5 106.0 L 246.5 106.0 L 242.5 108.0 L 239.5 108.0 L 238.5 109.0 L 235.5 109.0 L 234.5 110.0 L 231.5 110.0 L 230.5 111.0 L 226.5 111.0 L 225.5 112.0 L 220.5 112.0 L 219.5 113.0 L 214.5 113.0 L 213.5 114.0 L 192.5 114.0 L 192.0 112.5 L 193.0 111.5 L 193.0 109.5 L 196.0 104.5 L 196.0 102.5 L 199.0 97.5 L 199.0 95.5 L 209.0 75.5 L 211.0 73.5 L 216.0 63.5 L 220.0 58.5 L 221.0 55.5 L 225.0 50.5 L 226.0 47.5 L 230.0 42.5 L 231.0 39.5 L 233.0 37.5 L 237.0 29.5 L 239.0 27.5 L 241.0 22.5 L 243.0 20.5 Z" />
        </svg>
      </span>
    `;
  }

  // TATA - Official Tata Blue Oval Emblem with Stylized 'T' Canopy
  if (id === 'tata' || name.includes('tata')) {
    const tataSizeClass = size === 'xs' ? 'w-5 h-4' : (size === 'lg' ? 'w-10 h-7' : 'w-6 h-5');
    return `
      <span class="${tataSizeClass} rounded-md bg-white border border-slate-300 text-[#1d70b8] flex items-center justify-center p-0.5 shadow-sm" title="Tata">
        <svg viewBox="65 18 322 220" class="w-full h-full" fill="#1d70b8">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M375.394,93.432c-3.794-7.461-8.791-14.612-15.007-21.318 c-13.969-15.077-33.678-27.623-57.002-36.276c-23.516-8.72-50.338-13.334-77.595-13.334s-54.079,4.614-77.583,13.334 c-23.336,8.654-43.046,21.2-57.015,36.276C84.98,78.819,79.967,85.98,76.174,93.445c30.365-7.343,82.306-17.038,130.534-18.063 c4.652-0.1,7.855,1.39,9.964,4.063c2.569,3.255,2.376,14.858,2.313,20.049l-1.371,134.17c2.716,0.09,5.445,0.148,8.176,0.148 c2.754,0,5.498-0.045,8.214-0.135l-1.371-134.184c-0.071-5.19-0.27-16.794,2.308-20.049c2.114-2.672,5.306-4.162,9.957-4.063 C293.106,76.398,345.035,86.095,375.394,93.432"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M381.877,110.88c-44.442-10.047-74.121-11.905-103.405-13.53 c-25.526-1.419-25.859,7.696-23.311,25.115c0.167,1.063,0.372,2.403,0.615,3.931c8.562,50.712,19.224,94.352,21.056,101.759 c62.23-14.225,107.109-53.664,107.109-99.994C383.941,122.327,383.236,116.547,381.877,110.88"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M196.443,122.465c2.551-17.418,2.224-26.534-23.299-25.115 c-29.294,1.625-58.98,3.482-103.439,13.536c-1.358,5.667-2.072,11.44-2.072,17.274c0,20.024,8.146,39.4,23.56,56.047 c13.969,15.077,33.679,27.623,57.015,36.282c8.446,3.127,17.359,5.69,26.54,7.74c1.723-6.939,12.63-51.487,21.285-103.106 C196.193,124.134,196.341,123.221,196.443,122.465"/>
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

  // MG (MORRIS GARAGES) - Official Red Octagon Monogram Logo SVG
  if (id === 'mg' || name.includes('mg')) {
    const mgSizeClass = size === 'xs' ? 'w-5 h-4' : (size === 'lg' ? 'w-8 h-8' : 'w-5 h-5');
    return `
      <span class="${mgSizeClass} rounded-md bg-white border border-slate-300 flex items-center justify-center p-0.5 shadow-sm" title="MG Motors">
        <svg viewBox="20 5 164 158" class="w-full h-full" fill="#e4001b">
          <path fill-rule="evenodd" d="M 86.0 5.5 L 86.5 5.0 L 117.5 5.0 L 118.5 6.0 L 130.5 6.0 L 131.5 7.0 L 134.5 7.0 L 138.5 10.0 L 139.5 10.0 L 152.5 22.0 L 153.5 22.0 L 174.0 42.5 L 174.0 43.5 L 180.0 49.5 L 180.0 50.5 L 182.0 52.5 L 182.0 56.5 L 183.0 57.5 L 183.0 72.5 L 184.0 73.5 L 184.0 95.5 L 183.0 96.5 L 183.0 108.5 L 182.0 109.5 L 182.0 115.5 L 181.0 117.5 L 174.0 124.5 L 174.0 125.5 L 152.5 147.0 L 151.5 147.0 L 144.5 154.0 L 143.5 154.0 L 140.5 157.0 L 139.5 157.0 L 135.5 161.0 L 131.5 161.0 L 130.5 162.0 L 117.5 162.0 L 116.5 163.0 L 87.5 163.0 L 86.5 162.0 L 73.5 162.0 L 72.5 161.0 L 68.5 161.0 L 61.5 155.0 L 60.5 155.0 L 54.5 149.0 L 53.5 149.0 L 43.5 139.0 L 42.5 139.0 L 42.0 137.5 L 40.5 137.0 L 38.0 134.5 L 38.0 133.5 L 27.0 122.5 L 27.0 121.5 L 22.0 116.5 L 22.0 113.5 L 21.0 112.5 L 21.0 103.5 L 20.0 102.5 L 20.0 66.5 L 21.0 65.5 L 21.0 54.5 L 22.0 53.5 L 22.0 51.5 L 27.0 46.5 L 27.0 45.5 L 53.5 19.0 L 54.5 19.0 L 65.5 9.0 L 66.5 9.0 L 68.5 7.0 L 72.5 7.0 L 73.5 6.0 L 85.5 6.0 L 86.0 5.5 Z M 82.0 17.5 L 82.5 17.0 L 121.5 17.0 L 122.5 18.0 L 129.5 18.0 L 136.5 24.0 L 137.5 24.0 L 142.5 29.0 L 143.5 29.0 L 165.0 50.5 L 165.0 51.5 L 170.0 56.5 L 170.0 60.5 L 171.0 61.5 L 171.0 79.5 L 172.0 80.5 L 172.0 90.5 L 171.0 91.5 L 171.0 105.5 L 170.0 106.5 L 170.0 111.5 L 165.0 116.5 L 165.0 117.5 L 143.5 139.0 L 142.5 139.0 L 137.5 144.0 L 136.5 144.0 L 129.5 150.0 L 119.5 150.0 L 118.5 151.0 L 83.5 151.0 L 82.5 150.0 L 74.5 150.0 L 70.5 147.0 L 69.5 147.0 L 56.5 135.0 L 55.5 135.0 L 42.0 121.5 L 42.0 120.5 L 34.0 112.5 L 33.0 110.5 L 33.0 102.5 L 32.0 101.5 L 32.0 67.5 L 33.0 66.5 L 33.0 57.5 L 35.0 55.5 L 35.0 54.5 L 40.0 49.5 L 40.0 48.5 L 41.5 48.0 L 42.0 46.5 L 56.5 32.0 L 57.5 32.0 L 70.5 20.0 L 74.5 18.0 L 81.5 18.0 L 82.0 17.5 Z M 85.0 25.5 L 85.5 25.0 L 97.5 25.0 L 98.0 25.5 L 98.0 142.5 L 97.5 143.0 L 89.5 143.0 L 88.5 142.0 L 83.5 142.0 L 83.0 141.5 L 83.0 99.5 L 82.0 98.5 L 83.0 97.5 L 82.0 96.5 L 82.0 93.5 L 83.0 92.5 L 83.0 62.5 L 82.5 62.0 L 81.0 63.5 L 81.0 65.5 L 79.0 68.5 L 79.0 70.5 L 77.0 73.5 L 77.0 75.5 L 75.0 78.5 L 75.0 80.5 L 72.0 85.5 L 72.0 87.5 L 70.0 90.5 L 70.0 92.5 L 68.0 95.5 L 68.0 97.5 L 66.0 100.5 L 65.5 103.0 L 64.0 102.5 L 56.0 86.5 L 56.0 84.5 L 55.0 82.5 L 53.5 81.0 L 53.0 81.5 L 53.0 96.5 L 54.0 97.5 L 54.0 112.5 L 55.0 113.5 L 55.0 121.5 L 54.5 122.0 L 51.0 118.5 L 51.0 117.5 L 42.0 108.5 L 42.0 103.5 L 41.0 102.5 L 41.0 85.5 L 40.0 84.5 L 40.0 77.5 L 41.0 76.5 L 41.0 64.5 L 42.0 63.5 L 42.0 59.5 L 50.5 50.0 L 52.0 53.5 L 54.0 55.5 L 62.0 72.5 L 63.5 74.0 L 65.0 71.5 L 65.0 69.5 L 67.0 66.5 L 67.0 64.5 L 69.0 61.5 L 69.0 59.5 L 71.0 56.5 L 71.0 54.5 L 74.0 48.5 L 75.0 43.5 L 78.0 38.5 L 79.0 33.5 L 82.0 28.5 L 82.0 26.5 L 85.0 25.5 Z M 106.0 25.5 L 106.5 25.0 L 117.5 25.0 L 118.5 26.0 L 126.5 26.0 L 128.5 28.0 L 129.5 28.0 L 132.5 31.0 L 133.5 31.0 L 140.5 38.0 L 141.5 38.0 L 154.0 50.5 L 154.0 51.5 L 161.0 58.5 L 162.0 60.5 L 162.0 64.5 L 163.0 65.5 L 163.0 71.5 L 162.5 72.0 L 151.5 72.0 L 150.0 69.5 L 150.0 64.5 L 145.0 59.5 L 145.0 58.5 L 143.5 58.0 L 143.0 56.5 L 126.5 41.0 L 125.5 41.0 L 122.5 38.0 L 121.0 38.5 L 121.0 129.5 L 122.5 130.0 L 127.5 125.0 L 128.5 125.0 L 137.5 116.0 L 138.5 116.0 L 139.0 114.5 L 140.5 114.0 L 141.0 112.5 L 142.5 112.0 L 150.0 103.5 L 150.0 96.5 L 143.0 95.5 L 143.0 84.5 L 143.5 84.0 L 162.5 84.0 L 163.0 84.5 L 163.0 100.5 L 162.0 101.5 L 162.0 108.5 L 156.0 114.5 L 156.0 115.5 L 142.5 129.0 L 141.5 129.0 L 134.5 136.0 L 133.5 136.0 L 126.5 142.0 L 118.5 142.0 L 117.5 143.0 L 106.5 143.0 L 106.0 142.5 L 106.0 25.5 Z" />
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
