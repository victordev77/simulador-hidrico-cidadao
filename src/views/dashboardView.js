/**
 * Simulador Hídrico Cidadão — Rota /dashboard (Impacto do Estudo — Açude Jerimum)
 *
 * Centrado exclusivamente no cenário oficial do Açude Jerimum relatado no artigo.
 * Não sobrescreve nem é sobrescrito pela simulação interativa do usuário.
 *
 * Premissas científicas rigorosas:
 * - Preservação relatada no estudo: ~1,49 bilhão de litros/ano
 * - Equivalência social adotada: 100 L/pessoa/dia (> 40.800 pessoas)
 * - Escalas temporais: médias lineares identificadas (sem curva sazonal inventada)
 * - Sem contagens fictícias de famílias (440 L) ou caminhões-pipa sem suporte documental
 */

import { state } from "../state.js";
import { formatCompact, formatFullNumber, formatPercent } from "../mathEngine.js";

export const dashboardView = {
  title: "Dashboard do Açude Jerimum — Simulador Hídrico Cidadão",

  render() {
    const study = state.studyScenario;
    const currentScale = this.currentScale || "annual"; // 'annual' | 'monthly' | 'daily'

    let displayLiters = study.reportedPreservedLiters;
    let displayM3 = study.reportedPreservedM3;
    let scaleLabel = "por ano";
    let scaleDesc = "Total anual relatado no artigo científico";

    if (currentScale === "monthly") {
      displayLiters = study.monthlyPreservedLiters;
      displayM3 = study.monthlyPreservedM3;
      scaleLabel = "por mês (média)";
      scaleDesc = "Média equivalente derivada do total anual dividida por 12 meses";
    } else if (currentScale === "daily") {
      displayLiters = study.dailyPreservedLiters;
      displayM3 = study.dailyPreservedM3;
      scaleLabel = "por dia (média)";
      scaleDesc = "Média equivalente derivada do total anual dividida por 365 dias";
    }

    return `
      <div class="dashboard-page section">
        <div class="page-header">
          <div class="header-badges">
            <span class="badge badge-accent">Cenário Oficial do Artigo Científico</span>
            <span class="badge badge-muted">Açude Jerimum • Irauçuba-CE</span>
          </div>
          <h1 class="page-title">Impacto Hídrico e Social Relatado no Estudo</h1>
          <p class="section-subtitle">
            Resultados modelados para a mitigação evaporativa no Açude Jerimum durante um cenário de seca severa com esferas flutuantes de PEAD.
          </p>
        </div>

        <!-- Seletor de Escala Temporal -->
        <div class="time-scale-bar">
          <span class="scale-label">Escala temporal de leitura:</span>
          <div class="btn-group" role="group" aria-label="Escala temporal de exibição">
            <button type="button" class="btn-scale ${currentScale === "annual" ? "active" : ""}" data-scale="annual">
              Anual (Total do Estudo)
            </button>
            <button type="button" class="btn-scale ${currentScale === "monthly" ? "active" : ""}" data-scale="monthly">
              Mensal (Média Derivada)
            </button>
            <button type="button" class="btn-scale ${currentScale === "daily" ? "active" : ""}" data-scale="daily">
              Diária (Média Derivada)
            </button>
          </div>
        </div>

        <!-- GRID PRINCIPAL DE INDICADORES DO ESTUDO -->
        <div class="grid grid-3 study-metrics-grid">
          <!-- Card 1: Volume Preservado -->
          <article class="dashboard-kpi-card highlight-cyan">
            <div class="kpi-header">
              <span class="kpi-tag">Resultado Relatado no Artigo</span>
              <span class="kpi-period">${scaleLabel}</span>
            </div>
            <strong class="kpi-main-number">
              ${formatCompact(displayLiters, "L")}
            </strong>
            <div class="kpi-sub">
              <strong>${formatFullNumber(displayM3)} m³</strong> (${formatFullNumber(displayLiters)} Litros)
            </div>
            <p class="kpi-note">
              ${scaleDesc}. Representa o resgate volumétrico estimado que outrora seria dissipado para a atmosfera.
            </p>
          </article>

          <!-- Card 2: Equivalência Social -->
          <article class="dashboard-kpi-card highlight-green">
            <div class="kpi-header">
              <span class="kpi-tag">Equivalência Teórica de Consumo</span>
              <span class="kpi-period">100 L/pessoa/dia</span>
            </div>
            <strong class="kpi-main-number">
              +${formatFullNumber(study.socialEquivalence.equivalentPeople)}
            </strong>
            <div class="kpi-sub">
              <strong>Pessoas com consumo básico anual equivalente</strong>
            </div>
            <p class="kpi-note">
              Premissa oficial do artigo: 100 litros diários por pessoa para manutenção da dignidade individual básica no semiárido cearense.
            </p>
          </article>

          <!-- Card 3: Eficiência e Cobertura -->
          <article class="dashboard-kpi-card">
            <div class="kpi-header">
              <span class="kpi-tag">Intervenção Modelada</span>
              <span class="kpi-period">Esferas PEAD</span>
            </div>
            <strong class="kpi-main-number">
              ${formatPercent(study.evaporativeReduction)}
            </strong>
            <div class="kpi-sub">
              Oclusão planar de <strong>${formatPercent(study.geometricPacking)}</strong> | Porosidade: <strong>${formatPercent(study.porosity)}</strong>
            </div>
            <p class="kpi-note">
              A porosidade contínua de 9,31% preserva a aeração e difusão gasosa necessária para evitar a anoxia e hipóxia do reservatório.
            </p>
          </article>
        </div>

        <!-- CONTEXTO HISTÓRICO DO AÇUDE JERIMUM -->
        <section class="study-details-section">
          <div class="section-header">
            <h2 class="section-title">Parâmetros do Açude Jerimum Adotados na Pesquisa</h2>
            <p class="section-subtitle">
              Distinção explícita entre dados cadastrais oficiais, premissas de modelagem e resultados relatados.
            </p>
          </div>

          <div class="grid grid-2 context-cards-grid">
            <div class="info-block">
              <h3>Ficha Técnica Oficial (COGERH)</h3>
              <ul class="spec-list">
                <li>
                  <span>Município e Localização:</span>
                  <strong>Irauçuba - Ceará (Bacia do Rio Curu)</strong>
                </li>
                <li>
                  <span>Capacidade máxima de acumulação outorgada:</span>
                  <strong>18,75 hm³ (18.750.000 m³)</strong>
                </li>
                <li>
                  <span>Área de drenagem da bacia de contribuição:</span>
                  <strong>397,03 km²</strong>
                  <small class="text-muted">(Bacia hidrográfica coletora — não confundir com espelho d'água)</small>
                </li>
                <li>
                  <span>Vazão de suporte hídrico e dessedentação:</span>
                  <strong>~147 L/s</strong>
                </li>
              </ul>
            </div>

            <div class="info-block">
              <h3>Cenário Crítico Analisado no Artigo</h3>
              <ul class="spec-list">
                <li>
                  <span>Volume operacional no cenário de seca prolongada:</span>
                  <strong>9,0 hm³ (9.000.000 m³)</strong>
                </li>
                <li>
                  <span>Taxa de evaporação potencial histórica (FUNCEME):</span>
                  <strong>2.344,7 mm/ano</strong>
                </li>
                <li>
                  <span>Tecnologia de cobertura selecionada:</span>
                  <strong>Esferas flutuantes de PEAD em rede hexagonal</strong>
                </li>
                <li>
                  <span>Redução evaporativa adotada da literatura:</span>
                  <strong>74,86%</strong>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- INTERPRETAÇÃO CIENTÍFICA E LIMITAÇÕES -->
        <section class="scientific-interpretation-card">
          <div class="interpretation-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <h3>Interpretação Científica e Cidadania</h3>
          </div>
          <div class="interpretation-body">
            <p>
              A pesquisa demonstra como a <strong>matemática analítica e discreta</strong> permite quantificar ganhos expressivos para a convivência com o semiárido. A retenção potencial de aproximadamente 1,49 bilhão de litros/ano ilustra a magnitude das perdas invisíveis na Caatinga.
            </p>
            <div class="callout-box">
              <strong>Ressalva Metodológica de Rigor:</strong>
              A equivalência de mais de 40.000 vidas atendidas é uma <em>métrica teórica de consumo diário essencial (100 L/pessoa/dia)</em>. A modelagem matemática foca na supressão evaporativa física e não substitui a infraestrutura real de saneamento, canais adutores, estações de tratamento, potabilidade química ou os custos de implantação logística.
            </div>
          </div>
        </section>

        <!-- AÇÃO PARA TESTAR VARIÁVEIS NA CALCULADORA -->
        <div class="dashboard-footer-action">
          <p>Deseja testar outras áreas de espelho d'água, climas e coberturas?</p>
          <a href="/simular" class="btn btn-primary">Ir para a Simulação Interativa &rarr;</a>
        </div>
      </div>
    `;
  },

  mount(container) {
    this.container = container;
    this.currentScale = "annual";

    const buttons = this.container.querySelectorAll(".btn-scale");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentScale = btn.dataset.scale;
        this.container.innerHTML = this.render();
        this.mount(this.container);
      });
    });
  },

  unmount() {
    // Nada a desmontar
  }
};
