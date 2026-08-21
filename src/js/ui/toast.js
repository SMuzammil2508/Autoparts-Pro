// Floating Toast Notification Engine

export function showToast(message, type = "info", duration = 3200) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type} flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-2xl text-xs md:text-sm font-bold border transition-all duration-300 pointer-events-auto`;

  let iconName = "info";
  let bgClasses = "bg-slate-900/95 text-slate-100 border-slate-700";

  if (type === "success") {
    iconName = "check-circle";
    bgClasses = "bg-emerald-950/95 text-emerald-100 border-emerald-500/80 shadow-emerald-950/50";
  } else if (type === "warning") {
    iconName = "alert-triangle";
    bgClasses = "bg-amber-950/95 text-amber-100 border-amber-500/80 shadow-amber-950/50";
  } else if (type === "error") {
    iconName = "alert-circle";
    bgClasses = "bg-rose-950/95 text-rose-100 border-rose-500/80 shadow-rose-950/50";
  }

  toast.className += ` ${bgClasses}`;
  toast.innerHTML = `
    <div class="flex items-center gap-2.5">
      <i data-lucide="${iconName}" class="w-4 h-4 shrink-0"></i>
      <span>${message}</span>
    </div>
    <button class="text-slate-400 hover:text-slate-200 text-xs shrink-0" onclick="this.parentElement.remove()">
      ✕
    </button>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px) scale(0.95)";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
