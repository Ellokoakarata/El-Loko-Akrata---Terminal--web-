const menuOverlay = document.getElementById("menu-overlay");
let menuVisible = false;

// Exponer funciones globales
window.closeMenu = function () {
  menuOverlay.classList.add("menu-hidden");
  menuVisible = false;
  if (typeof state !== "undefined") state.mode = "auto";
};

window.navigateTo = function (path) {
  window.location.href = path;
};

// Mostrar "Cargando... menú" desde el inicio
menuOverlay.innerHTML = `<h3 style="color:#00ff88;">Cargando... menú</h3>`;
menuOverlay.classList.remove("menu-hidden");

// Mostrar menú funcional tras delay
setTimeout(() => {
  if (typeof state !== "undefined" && state.mode === "menu") renderMenu();
}, 15000);

// Mostrar el menú principal
function renderMenu() {
  menuOverlay.innerHTML = `
    <h3>Menú EsquizoAI</h3>
    <div class="menu-option" data-path="/ritual">[1] Ritual de Desfragmentación</div>
    <div class="menu-option" data-path="/glitch-core">[2] Núcleo Glitcheado</div>
    <div class="menu-option" data-path="/espejo">[3] Espejo de Prompts</div>
    <div class="menu-close">[X] Cerrar Menú</div>
  `;
  menuOverlay.classList.remove("menu-hidden");
  menuVisible = true;

  // Asignar listeners de navegación
  document.querySelectorAll(".menu-option").forEach(opt => {
    opt.addEventListener("click", (e) => {
      const path = e.target.getAttribute("data-path");
      window.navigateTo(path);
    });
  });

  // Asignar listener para cerrar
  const closeBtn = document.querySelector(".menu-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", window.closeMenu);
  }
}
