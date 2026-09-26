/**
 * Simulador Hídrico Cidadão — Roteador SPA Leve e Resiliente
 *
 * Suporta:
 * - Acesso direto a URLs limpas (/simular, /dashboard, /ciencia, /ciencia/memoria, /sobre)
 * - Compatibilidade com Hash (#/simular) para servidores estáticos sem reescrita
 * - Atualização de página (F5) em qualquer rota
 * - Botões Voltar / Avançar do histórico do navegador (popstate)
 * - Título dinâmico por página
 * - Destaque acessível do link ativo no cabeçalho (aria-current="page")
 * - Ciclo de vida estrito: desmontagem (unmount) limpa de recursos (3D, timers, eventos)
 * - Tratamento de rota 404 amigável
 */

export class Router {
  constructor(routes, containerId = "app-root") {
    this.routes = routes;
    this.container = document.getElementById(containerId);
    this.currentView = null;
    this.currentRoute = null;

    this.liveAnnouncer = document.createElement("div");
    this.liveAnnouncer.setAttribute("aria-live", "polite");
    this.liveAnnouncer.setAttribute("aria-atomic", "true");
    this.liveAnnouncer.className = "sr-only";
    document.body.appendChild(this.liveAnnouncer);

    this.init();
  }

  init() {
    window.addEventListener("popstate", () => this.handleRoute());

    // Intercepta cliques em links internos com data-link ou href relativo
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Ignora links externos, de download ou âncoras na mesma página
      if (
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.hasAttribute("download") ||
        link.target === "_blank"
      ) {
        return;
      }

      // Se for link interno
      if (href.startsWith("/") || href.startsWith("#/")) {
        e.preventDefault();
        this.navigate(href);
      }
    });

    // Rota inicial ao carregar
    this.handleRoute();
  }

  getCurrentPath() {
    // Se houver hash estruturado #/rota, prioriza para máxima compatibilidade local
    const hash = window.location.hash;
    if (hash && hash.startsWith("#/")) {
      return hash.slice(1); // remove o '#' -> '/rota'
    }

    let pathname = window.location.pathname;

    // Remove subdiretórios ou /index.html se servido em servidor estático
    if (pathname.endsWith("/index.html")) {
      pathname = pathname.slice(0, -"/index.html".length) || "/";
    }

    return pathname || "/";
  }

  navigate(path) {
    let cleanPath = path;
    if (cleanPath.startsWith("#/")) {
      cleanPath = cleanPath.slice(1);
    }
    if (!cleanPath.startsWith("/")) {
      cleanPath = `/${cleanPath}`;
    }

    if (cleanPath === this.currentRoute) return;

    // Atualiza histórico com pushState
    try {
      window.history.pushState({}, "", cleanPath);
    } catch {
      // Fallback para hash se security/CORS do file:// bloquear pushState
      window.location.hash = `#${cleanPath}`;
    }

    this.handleRoute();
  }

  handleRoute() {
    const rawPath = this.getCurrentPath();
    // Normaliza rota (remove trailing slash se não for raiz)
    let path = rawPath.length > 1 && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;

    let routeConfig = this.routes[path];

    // Se não encontrar rota exata, verifica 404
    if (!routeConfig) {
      routeConfig = this.routes["*"] || {
        title: "Página não encontrada — Simulador Hídrico Cidadão",
        render: () => `
          <div class="section not-found-section">
            <div class="empty-card">
              <p class="eyebrow">Código 404</p>
              <h2>Página não encontrada</h2>
              <p>O endereço solicitado não existe ou foi reorganizado no Simulador Hídrico Cidadão.</p>
              <div class="action-row">
                <a class="primary-button" href="/">Ir para o Início</a>
                <a class="secondary-button" href="/simular">Abrir o Simulador</a>
              </div>
            </div>
          </div>
        `,
        mount: () => {},
        unmount: () => {}
      };
    }

    // 1. Ciclo de vida: desmonta a tela anterior
    if (this.currentView && typeof this.currentView.unmount === "function") {
      try {
        this.currentView.unmount();
      } catch (err) {
        console.error("Erro ao desmontar rota anterior:", err);
      }
    }

    this.currentRoute = path;
    this.currentView = routeConfig;

    // 2. Atualiza título da página e leitor de tela
    const title = routeConfig.title || "Simulador Hídrico Cidadão";
    document.title = title;
    this.liveAnnouncer.textContent = `Página carregada: ${title}`;

    // 3. Atualiza classes de navegação ativa
    this.updateActiveNav(path);

    // 4. Renderiza conteúdo HTML
    if (this.container) {
      this.container.innerHTML = routeConfig.render();
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // 5. Ciclo de vida: monta a nova tela
    if (typeof routeConfig.mount === "function") {
      try {
        routeConfig.mount(this.container);
      } catch (err) {
        console.error(`Erro ao montar rota ${path}:`, err);
      }
    }
  }

  updateActiveNav(currentPath) {
    const navLinks = document.querySelectorAll(".main-nav a, .mobile-nav a");
    navLinks.forEach((link) => {
      let href = link.getAttribute("href");
      if (href && href.startsWith("#/")) href = href.slice(1);

      const isActive =
        href === currentPath ||
        (currentPath.startsWith("/ciencia") && href === "/ciencia" && currentPath !== "/ciencia/memoria");

      if (isActive) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }
}
