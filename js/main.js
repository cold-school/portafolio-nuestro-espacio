
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // PANTALLA DE CARGA
  // ==========================================
  const loader = document.querySelector("#page-loader, #loader, .loader");
  const progress = document.getElementById("loader-progress");
  let loaderClosed = false;
  let loaderInterval;

  function hideLoader() {
    if (loaderClosed) return;
    loaderClosed = true;

    if (loaderInterval) {
      window.clearInterval(loaderInterval);
    }

    if (progress) progress.style.width = "100%";

    if (loader) {
      loader.classList.add("is-done", "is-hidden");
      loader.setAttribute("aria-hidden", "true");
    }
  }

  if (loader) {
    let amount = 0;

    loaderInterval = window.setInterval(() => {
      amount = Math.min(amount + Math.random() * 22 + 8, 100);

      if (progress) progress.style.width = `${amount}%`;

      if (amount >= 100) {
        window.clearInterval(loaderInterval);
        window.setTimeout(hideLoader, 180);
      }
    }, 110);

    window.setTimeout(hideLoader, 1800);
    window.addEventListener("load", hideLoader, { once: true });
  }

  // ==========================================
  // MENÚ DE NAVEGACIÓN
  // ==========================================
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.querySelector(".main-nav, #nav-menu");

  if (menuToggle && nav) {
    function closeMenu() {
      nav.classList.remove("open", "is-open");
      menuToggle.classList.remove("is-active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
    }

    menuToggle.addEventListener("click", () => {
      const open =
        !nav.classList.contains("open") &&
        !nav.classList.contains("is-open");

      nav.classList.toggle("open", open);
      nav.classList.toggle("is-open", open);
      menuToggle.classList.toggle("is-active", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute(
        "aria-label",
        open ? "Cerrar menú" : "Abrir menú"
      );
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
      if (
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // ==========================================
  // ANIMACIONES AL DESPLAZARSE
  // ==========================================
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible", "is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => {
      item.classList.add("visible", "is-visible");
    });
  }

  // ==========================================
  // MODAL DE COLORES FAVORITOS
  // ==========================================
  const modal = document.getElementById("color-modal");
  const title = document.getElementById("color-title");
  const hex = document.getElementById("modal-hex");
  const closeButton = document.getElementById("modal-close");

  // Busca la bolita por ID o por clase.
  const swatch = modal?.querySelector(
    "#modal-swatch, .color-swatch, .modal-swatch"
  );

  // Busca el botón que copia el código dentro del modal.
  const copyButton = modal?.querySelector("[data-copy-color]");

  const colors = {
    "#b9a0ff": {
      name: "Lila",
      hex: "#B9A0FF"
    },
    "#f3a6c8": {
      name: "Rosa",
      hex: "#F3A6C8"
    },
    "#8bbcff": {
      name: "Azul",
      hex: "#8BBCFF"
    },
    "#76a9fa": {
      name: "Azul",
      hex: "#76A9FA"
    }
  };

  function getProfileColor(button) {
    // Si el botón indica un color explícitamente, lo utiliza.
    const explicitColor =
      button.dataset.color ||
      button.dataset.copyColor;

    if (explicitColor) {
      return explicitColor.toLowerCase();
    }

    // Identifica el color mediante la ilustración del perfil.
    const profile = button.closest(".profile-section, .bio-page");
    const portrait = profile?.querySelector(
      ".profile-portrait, .portrait-purple, .portrait-pink, .portrait-blue"
    );

    if (
      portrait?.classList.contains("portrait-pink") ||
      profile?.classList.contains("accent-pink")
    ) {
      return "#f3a6c8";
    }

    if (
      portrait?.classList.contains("portrait-blue") ||
      profile?.classList.contains("accent-blue")
    ) {
      return "#8bbcff";
    }

    if (
      portrait?.classList.contains("portrait-purple") ||
      profile?.classList.contains("accent-purple")
    ) {
      return "#b9a0ff";
    }

    return "#c9cbd0";
  }

  function openColorModal(button) {
    if (!modal) return;

    const color = getProfileColor(button);
    const colorInfo = colors[color] || {
      name: "Color favorito",
      hex: color.toUpperCase()
    };

    // Actualiza el color real de la bolita.
    if (swatch) {
      swatch.style.setProperty("background-color", colorInfo.hex, "important");
      swatch.style.setProperty("background", colorInfo.hex, "important");
    }

    // Actualiza el nombre.
    if (title) {
      title.textContent = colorInfo.name;
    }

    // Actualiza el código, si existe un elemento para mostrarlo.
    if (hex) {
      hex.textContent = colorInfo.hex;
    }

    // El botón copia el mismo color que aparece en la bolita.
    if (copyButton) {
      copyButton.dataset.copyColor = colorInfo.hex;
      copyButton.textContent = `Copiar código ${colorInfo.hex}`;
    }

    modal.classList.add("open", "is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    closeButton?.focus();
  }

  function closeColorModal() {
    if (!modal) return;

    modal.classList.remove("open", "is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  document.querySelectorAll(
    ".color-detail, [data-open-color]"
  ).forEach(button => {
    button.addEventListener("click", () => {
      openColorModal(button);
    });
  });

  closeButton?.addEventListener("click", closeColorModal);

  document.querySelectorAll("[data-close-color]").forEach(button => {
    button.addEventListener("click", closeColorModal);
  });

  if (modal) {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeColorModal();
      }
    });
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeColorModal();
  });

  // ==========================================
  // COPIAR CÓDIGO DE COLOR
  // ==========================================
  document.querySelectorAll("[data-copy-color]").forEach(button => {
    button.addEventListener("click", async () => {
      const color = button.dataset.copyColor;
      if (!color) return;

      try {
        await navigator.clipboard.writeText(color);

        const previousText = button.textContent;
        button.textContent = "¡Código copiado!";

        window.setTimeout(() => {
          button.textContent = previousText;
        }, 1500);
      } catch (error) {
        // Alternativa si el navegador no permite usar el portapapeles.
        const input = document.createElement("textarea");
        input.value = color;
        input.style.position = "fixed";
        input.style.opacity = "0";

        document.body.appendChild(input);
        input.select();

        const copied = document.execCommand("copy");
        input.remove();

        if (copied) {
          const previousText = button.textContent;
          button.textContent = "¡Código copiado!";

          window.setTimeout(() => {
            button.textContent = previousText;
          }, 1500);
        } else {
          console.error("No se pudo copiar el color:", error);
        }
      }
    });
  });
});
