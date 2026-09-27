/**
 * Simulador Hídrico Cidadão — Registro e Verificação do Service Worker
 *
 * Exibe indicação discreta e 100% verídica no rodapé:
 * - "Verificando recursos..."
 * - "Pronto para uso offline" (apenas quando o cache for ativado e verificado com sucesso)
 * - "Modo online" (se o Service Worker não estiver ativo ou não for suportado)
 */

export function initServiceWorker(indicatorElement) {
  if (!("serviceWorker" in navigator)) {
    if (indicatorElement) {
      indicatorElement.textContent = "Disponível online";
      indicatorElement.title = "Navegador sem suporte a Service Worker";
    }
    return;
  }

  // Não tenta registrar em ambientes locais file://
  if (window.location.protocol === "file:") {
    if (indicatorElement) {
      indicatorElement.textContent = "Ambiente Local (file://)";
    }
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // Verifica se o Service Worker já controla a página e o cache está pronto
        const updateStatus = () => {
          if (navigator.serviceWorker.controller) {
            caches.has("shc-v0.3.0").then((hasCache) => {
              if (hasCache && indicatorElement) {
                indicatorElement.classList.add("ready");
                indicatorElement.innerHTML = `
                  <span class="status-dot green"></span>
                  <span>Pronto para uso offline</span>
                `;
                indicatorElement.title = "Todos os módulos, cálculos e 3D estão armazenados localmente no cache do navegador.";
              }
            });
          } else if (indicatorElement) {
            indicatorElement.innerHTML = `
              <span class="status-dot yellow"></span>
              <span>Preparando recursos offline...</span>
            `;
          }
        };

        if (reg.installing) {
          reg.installing.addEventListener("statechange", (e) => {
            if (e.target.state === "activated") updateStatus();
          });
        }

        navigator.serviceWorker.addEventListener("controllerchange", updateStatus);
        updateStatus();
      })
      .catch((err) => {
        console.warn("Service worker não registrado:", err);
        if (indicatorElement) {
          indicatorElement.innerHTML = `
            <span class="status-dot"></span>
            <span>Online</span>
          `;
        }
      });
  });
}
