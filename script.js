/**
 * Simulador Hídrico Cidadão — Ponto de Entrada Principal (ES Module)
 *
 * Conecta:
 * - Roteador SPA leve e resiliente com suporte a History API e fallback hash
 * - Gerenciamento de tema (Dark padrão / Light caderno de campo)
 * - Menu hambúrguer lateral acessível com gestão de foco
 * - Registro do Service Worker e indicador de disponibilidade offline
 * - Botão de rolagem suave ao topo
 */

import { Router } from "./src/router.js";
import { state } from "./src/state.js";
import { initServiceWorker } from "./src/sw-register.js";

import { homeView } from "./src/views/homeView.js";
import { simularView } from "./src/views/simularView.js";
import { dashboardView } from "./src/views/dashboardView.js";
import { cienciaView } from "./src/views/cienciaView.js";
import { memoriaView } from "./src/views/memoriaView.js";
import { sobreView } from "./src/views/sobreView.js";

// Definição das rotas da aplicação
const routes = {
  "/": homeView,
  "/simular": simularView,
  "/dashboard": dashboardView,
  "/ciencia": cienciaView,
  "/ciencia/memoria": memoriaView,
  "/sobre": sobreView
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializa o Roteador SPA
  const router = new Router(routes, "app-root");

  // 2. Gerenciamento do Tema Visual
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      state.toggleTheme();
    });
  }

  // 3. Menu Hambúrguer Mobile Acessível (Drawer)
  const navToggle = document.getElementById("navToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const mobileBackdrop = document.getElementById("mobileBackdrop");
  const btnCloseDrawer = document.getElementById("btnCloseDrawer");

  function openDrawer() {
    mobileDrawer.inert = false;
    mobileDrawer.classList.add("open");
    mobileBackdrop.classList.add("open");
    mobileDrawer.setAttribute("aria-hidden", "false");
    navToggle.setAttribute("aria-expanded", "true");
    btnCloseDrawer.focus();
    document.querySelector("#app-root").inert = true;
    document.querySelector(".site-header").inert = true;
    document.querySelector(".site-footer").inert = true;
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    mobileDrawer.inert = true;
    document.querySelector("#app-root").inert = false;
    document.querySelector(".site-header").inert = false;
    document.querySelector(".site-footer").inert = false;
    mobileDrawer.classList.remove("open");
    mobileBackdrop.classList.remove("open");
    mobileDrawer.setAttribute("aria-hidden", "true");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    navToggle.focus();
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.contains("open");
      if (isOpen) closeDrawer();
      else openDrawer();
    });
  }

  if (btnCloseDrawer) {
    btnCloseDrawer.addEventListener("click", closeDrawer);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener("click", closeDrawer);
  }

  // Fecha com tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab" && mobileDrawer.classList.contains("open")) {
      const items = [...mobileDrawer.querySelectorAll("a, button")];
      const first = items[0], last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (e.key === "Escape" && mobileDrawer && mobileDrawer.classList.contains("open")) {
      closeDrawer();
    }
  });

  // Fecha menu móvel ao clicar em um link
  mobileDrawer?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeDrawer();
    });
  });

  window.addEventListener("resize", () => {
    if (innerWidth > 1100 && mobileDrawer.classList.contains("open")) closeDrawer();
  });

  // 4. Botão Voltar ao Topo e Header Scrolled
  const scrollUpBtn = document.getElementById("scrollUpBtn");
  const siteHeader = document.querySelector(".site-header");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (siteHeader) {
      siteHeader.classList.toggle("scrolled", scrollY > 40);
    }
    if (scrollUpBtn) {
      scrollUpBtn.classList.toggle("visible", scrollY > 400);
    }
  }, { passive: true });

  if (scrollUpBtn) {
    scrollUpBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 5. Inicialização do Service Worker com Indicador de Status
  const offlineBadge = document.getElementById("offlineStatusBadge");
  initServiceWorker(offlineBadge);
});