import { interpretVolume } from '../interpretation.js';
/**
 * Simulador Hídrico Cidadão — Rota /simular (Experiência Principal)
 *
 * Concentra:
 * - Entradas parametrizadas (números precisos e sliders sincronizados)
 * - Visualização 3D original (Three.js instanciado e controles)
 * - 4 Indicadores principais em tempo real
 * - Comparação automática dos 3 cenários (Tabela acessível + Gráficos em barras independentes)
 * - Links contextuais para memória de cálculo e dashboard
 */

import { state } from "../state.js";
import { formatCompact, formatFullNumber, formatPercent } from "../mathEngine.js";
import { drawVolumetricComparisonChart, drawEfficiencyComparisonChart } from "../charts.js";


export const simularView = {
  title: "Simular Cenários — Simulador Hídrico Cidadão",

  render() {
    const sim = state.simulation;
    const inputs = sim.draftInputs || sim.inputs;
    const res = sim.result;

    return `
      <div class="simulation-page section">
        <div class="page-header">
          <p class="section-eyebrow">Simulação interativa</p>
          <h1 class="page-title">Dimensionamento e Mitigação Evaporativa</h1>
          <p class="section-subtitle">
            Configure as variáveis do açude e compare instantaneamente a eficácia de diferentes coberturas artificiais na retenção da lâmina de água.
          </p>
        </div>

        <div class="mode-switch" role="group" aria-label="Modo de exploração">
          <button class="btn btn-secondary" data-mode="study" aria-pressed="false">Estudo de caso</button>
          <button class="btn btn-secondary" data-mode="free" aria-pressed="true">Simulação livre</button>
        </div>
        <section id="studyCase" class="research-section" hidden>
          <p class="section-eyebrow">Dados do artigo</p><h2>Açude Jerimum — cenário da pesquisa</h2>
          <p>Evaporação de referência: <strong>2.344,7 mm/ano</strong> · Capacidade: <strong>18,75 hm³</strong> · Volume operacional crítico: <strong>9 hm³</strong> · Demanda rural aproximada: <strong>147 L/s</strong>.</p>
          <p>Bacia de contribuição: <strong>397,03 km²</strong> — não é a área da superfície da água.</p>
          <p>Área oficial do espelho d’água: <strong>Parâmetro não especificado diretamente no artigo.</strong> Não inferimos uma área para reproduzir o resultado relatado.</p>
          <p>Resultado relatado com esferas de PEAD: aproximadamente <strong>1,49 bilhão de litros preservados por ano</strong>, equivalente a <strong>1,49 milhão de caixas de 1.000 L</strong> ou cerca de <strong>40.822 pessoas por 365 dias</strong>, a 100 L/pessoa/dia. Equivalência teórica, sem garantia de abastecimento.</p>
          <ol><li>Leia os dados e suas limitações.</li><li>Explore os três cenários qualitativos no 3D; eles não recalculam o estudo.</li><li>Consulte o <a href="/dashboard">Dashboard do artigo</a> ou escolha Simulação livre para informar uma área e comparar resultados próprios.</li></ol>
          <a href="/ciencia#parametros">Origem dos parâmetros</a> · <a href="/ciencia/memoria">Gerar Relatório Científico</a> · <a href="/ciencia/pedagogico">Gerar Relatório Pedagógico</a>
        </section>
        <!-- Alerta de validação / status da entrada -->
        <div id="simValidationAlert" class="validation-banner hidden" role="alert"></div>

        <div class="sim-workspace-grid">
          <!-- PAINEL LATERAL DE CONTROLES E ENTRADAS -->
          <div class="controls-column">
            <div class="control-panel-card">
              <div class="panel-header">
                <h2>Parâmetros de Entrada</h2>
                <button type="button" class="btn-link" id="btnResetDefaults" title="Restaura os valores demonstrativos iniciais com referência no estudo">
                  Restaurar valores iniciais
                </button>
              </div>

              <form id="simForm" class="control-form" onsubmit="event.preventDefault();">
                <!-- 1. Área do Açude -->
                <div class="form-group">
                  <div class="label-row">
                    <label for="inputArea">Área do espelho d'água</label>
                    <span class="unit-tag">m²</span>
                  </div>
                  <input
                    id="inputArea"
                    type="number"
                    min="100"
                    max="50000000"
                    step="1000"
                    value="${inputs.areaM2}"
                    class="form-control"
                    required
                  />
                  <small class="form-hint">
                    Exemplo demonstrativo inicial: 750.000 m² (~75 hectares). Editável.
                  </small>
                </div>

                <!-- 2. Evaporação Anual -->
                <div class="form-group">
                  <div class="label-row">
                    <label for="inputEvap">Evaporação potencial anual</label>
                    <span class="unit-tag">mm/ano</span>
                  </div>
                  <div class="input-with-slider">
                    <input
                      id="inputEvap"
                      type="number"
                      min="100"
                      max="6000"
                      step="0.1"
                      value="${inputs.annualEvapMm}"
                      class="form-control"
                      required
                    />
                    <input
                      id="sliderEvap"
                      type="range"
                      min="500"
                      max="3500"
                      step="0.1"
                      value="${inputs.annualEvapMm}"
                      class="form-range"
                      aria-label="Ajuste rápido da taxa de evaporação anual"
                    />
                  </div>
                  <small class="form-hint">
                    Referência histórica no interior cearense adotada pelo artigo: <strong>2.344,7 mm/ano</strong>.
                  </small>
                </div>

                <!-- 3. Temperatura e Vento (Contextuais) -->
                <div class="form-row-2">
                  <div class="form-group">
                    <div class="label-row">
                      <label for="inputTemp">Temperatura média</label>
                      <span class="unit-tag">°C</span>
                    </div>
                    <input
                      id="inputTemp"
                      type="number"
                      min="10"
                      max="50"
                      step="0.5"
                      value="${inputs.temperatureC}"
                      class="form-control"
                    />
                    <input
                      id="sliderTemp"
                      type="range"
                      min="18"
                      max="45"
                      step="0.5"
                      value="${inputs.temperatureC}"
                      class="form-range"
                      aria-label="Controle deslizante de temperatura média"
                    />
                  </div>

                  <div class="form-group">
                    <div class="label-row">
                      <label for="inputWind">Velocidade do vento</label>
                      <span class="unit-tag">m/s</span>
                    </div>
                    <input
                      id="inputWind"
                      type="number"
                      min="0"
                      max="30"
                      step="0.1"
                      value="${inputs.windMS}"
                      class="form-control"
                    />
                    <input
                      id="sliderWind"
                      type="range"
                      min="0"
                      max="15"
                      step="0.1"
                      value="${inputs.windMS}"
                      class="form-range"
                      aria-label="Controle deslizante de velocidade do vento"
                    />
                  </div>
                </div>

                <div class="climate-context-alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  <span>
                    Neste modelo, o cálculo volumétrico utiliza a evaporação anual informada. Temperatura e vento contextualizam o cenário, mas não recalculam essa taxa automaticamente.
                  </span>
                </div>

                <!-- 4. Seletor de Cobertura -->
                <div class="form-group">
                  <div class="label-row">
                    <label for="selectCover">Tipo de intervenção superficial</label>
                  </div>
                  <select id="selectCover" class="form-select">
                    <option value="none" ${inputs.coverType === "none" ? "selected" : ""}>Sem cobertura (Espelho livre)</option>
                    <option value="sphere" ${inputs.coverType === "sphere" ? "selected" : ""}>Esferas de PEAD (Arranjo hexagonal, até 74,86% de redução)</option>
                    <option value="hex" ${inputs.coverType === "hex" ? "selected" : ""}>Cobertura hexagonal contínua (Até 88,59% de redução)</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
          <!-- PAINEL 3D E CONTROLES DE CENA -->
          <div class="scene-column">
            <div class="scene-card" id="sceneContainer">
              <div class="scene-topbar">
                <span class="scene-model-label">
                  <span class="badge badge-accent">Visualização do reservatório</span>
                </span>

                
              </div>


              <div class="scenario-buttons-group" role="group" aria-label="Seleção rápida de cobertura">
                  <button type="button" class="btn-scenario ${inputs.coverType === "none" ? "active" : ""}" data-cover="none" aria-pressed="${inputs.coverType === "none"}">
                    Sem cobertura
                  </button>
                  <button type="button" class="btn-scenario ${inputs.coverType === "sphere" ? "active" : ""}" data-cover="sphere" aria-pressed="${inputs.coverType === "sphere"}">
                    Esferas de PEAD
                  </button>
                  <button type="button" class="btn-scenario ${inputs.coverType === "hex" ? "active" : ""}" data-cover="hex" aria-pressed="${inputs.coverType === "hex"}">
                    Cobertura hexagonal
                  </button>
                </div>

              <!-- Canvas 3D -->
              <div class="canvas-wrapper">
                <canvas id="reservoirCanvas" aria-label="Visualização tridimensional do espelho d'água com cobertura"></canvas>
                <div class="scene-status" id="sceneStatus" role="status" hidden>
                  <p id="sceneStatusText"></p>
                  <button type="button" class="btn btn-secondary" id="btnRetry3D" hidden>Tentar novamente</button>
                </div>
              </div>

              <!-- Barra de ferramentas e câmera sobre a cena -->
              <div class="scene-legend"><span>Linhas: vento</span> · <span>Partículas ascendentes: evaporação</span> · <span>Elementos flutuantes: coberturas</span></div>
              <p class="card-meta">Representação qualitativa, fora de escala; não é simulação fluidodinâmica. A disposição hexagonal ilustrativa não representa necessariamente uma colmeia contínua.</p>
              <div class="demo-controls"><label><input type="checkbox" id="demoEnabled"> Modo demonstração</label><button type="button" id="demoPause" class="btn btn-secondary" disabled>Pausar</button><progress id="demoProgress" max="30" value="0" aria-label="Tempo do cenário na demonstração"></progress><small>30 segundos por cenário</small></div>
              <div class="scene-bottombar">
                <div class="cam-presets-subgroup" role="group" aria-label="Vistas da câmera">
                  <button type="button" class="btn-cam-preset active" data-camera="general" aria-pressed="true" title="Visão geral do reservatório">Geral</button>
                  <button type="button" class="btn-cam-preset" data-camera="dam" aria-pressed="false" title="Vista a partir da barragem">Paredão</button>
                  <button type="button" class="btn-cam-preset" data-camera="top" aria-pressed="false" title="Vista aérea do reservatório">Aérea</button>
                </div>
<div class="scene-quality-wrapper">
                  <label for="qualitySelect" class="sr-only">Qualidade gráfica</label>
                  <select id="qualitySelect" class="select-chip" title="Ajuste de fidelidade e desempenho gráfico">
                    <option value="auto" ${state.graphicsQuality === "auto" ? "selected" : ""}>Qualidade: Automática</option>
                    <option value="eco" ${state.graphicsQuality === "eco" ? "selected" : ""}>Qualidade: Econômica</option>
                    <option value="balanced" ${state.graphicsQuality === "balanced" ? "selected" : ""}>Qualidade: Equilibrada</option>
                    <option value="high" ${state.graphicsQuality === "high" ? "selected" : ""}>Qualidade: Alta</option>
                  </select>
                </div>
                

                <div class="camera-controls-group" role="group" aria-label="Ângulos e controles da câmera 3D">
                  <div class="cam-zoom-subgroup">
                    <button type="button" class="btn-cam" id="btnCamZoomIn" title="Aproximar câmera">+</button>
                    <button type="button" class="btn-cam" id="btnCamZoomOut" title="Afastar câmera">−</button>
                    <button type="button" class="btn-cam" id="btnCamReset" title="Redefinir câmera">Redefinir câmera</button>
                    <button type="button" class="btn-cam" id="btnCamFullscreen" title="Expandir visualização" aria-label="Tela cheia">⛶</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="scene-caption-bar">
              <span class="scene-caption-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M16 12l-4-4-4 4M12 8v8"/></svg>
                Arraste na horizontal para girar • Pinça/scroll para zoom
              </span>
              <span class="scene-caption-note">
                Água e coberturas ilustrativas • Quantidade de módulos representativa
              </span>
            </div>
          </div>


        </div>

        <div class="free-results">
        <section class="research-section"><h2>Hipótese geométrica do modelo</h2><p>A solução é distribuída por toda a área informada. Nas esferas, permanecem os interstícios geométricos (9,31%); nos hexágonos, adota-se oclusão teórica de 98%. Cobertura não equivale à redução de evaporação.</p><h3>Interpretação complementar</h3><p id="volumeEquivalents"></p><p class="card-meta">100 L/pessoa/dia é a premissa social do artigo. Equivalência teórica de consumo; não garante abastecimento, qualidade ou disponibilidade real.</p></section>
        <!-- 4 INDICADORES PRINCIPAIS DE RESULTADOS -->
        <section class="metrics-grid-section" aria-label="Resultados principais da simulação">
          <div class="grid grid-4 metrics-row">
            <article class="metric-card">
              <span class="metric-label">Evaporação sem cobertura</span>
              <div class="metric-value-wrap">
                <strong class="metric-number" id="valEvapWithout">
                  ${formatCompact(res.metrics.evaporationWithoutCoverM3, "m³/ano")}
                </strong>
                <span class="metric-full" id="valEvapWithoutFull" title="Volume anual exato">
                  ${formatFullNumber(res.metrics.evaporationWithoutCoverM3)} m³/ano
                </span>
              </div>
              <p class="metric-desc">Perda hídrica atmosférica anual estimada se a água ficar exposta.</p>
            </article>

            <article class="metric-card">
              <span class="metric-label">Evaporação com cobertura</span>
              <div class="metric-value-wrap">
                <strong class="metric-number" id="valEvapWith">
                  ${formatCompact(res.metrics.evaporationWithCoverM3, "m³/ano")}
                </strong>
                <span class="metric-full" id="valEvapWithFull" title="Volume residual anual exato">
                  ${formatFullNumber(res.metrics.evaporationWithCoverM3)} m³/ano
                </span>
              </div>
              <p class="metric-desc">Perda residual que ainda escapa pelas frestas ou limites de eficiência.</p>
            </article>

            <article class="metric-card highlight-green">
              <span class="metric-label">Volume preservado</span>
              <div class="metric-value-wrap">
                <strong class="metric-number" id="valPreserved">
                  ${formatCompact(res.metrics.preservedM3, "m³/ano")}
                </strong>
                <span class="metric-full" id="valPreservedFull" title="Volume preservado em metros cúbicos e litros">
                  ${formatFullNumber(res.metrics.preservedM3)} m³/ano (${formatCompact(res.metrics.litersSaved, "L")})
                </span>
              </div>
              <p class="metric-desc">Volume de água líquida salvo anualmente da dissipação para a atmosfera.</p>
            </article>

            <article class="metric-card highlight-cyan">
              <span class="metric-label">Redução evaporativa</span>
              <div class="metric-value-wrap">
                <strong class="metric-number" id="valReduction">
                  ${formatPercent(res.metrics.reductionFraction)}
                </strong>
                <span class="metric-full" id="valCoverageInfo">
                  Cobertura: ${formatPercent(res.metrics.surfaceCoverageFraction)}
                </span>
              </div>
              <p class="metric-desc" id="valEcologicalNote">
                ${res.cover.biologicalRisk}
              </p>
            </article>
          </div>
        </section>

        <!-- COMPARAÇÃO AUTOMÁTICA DOS 3 CENÁRIOS -->
        <section class="comparison-section">
          <div class="section-header">
            <p class="section-eyebrow">Análise comparativa integral</p>
            <h2 class="section-title">Comportamento dos 3 Cenários para as Mesmas Entradas</h2>
            <p class="section-subtitle">
              Calculados em paralelo com estrita equivalência das variáveis físicas para comparação justa e objetiva.
            </p>
          </div>

          <!-- Tabela de Comparação Acessível -->
          <div class="table-container" tabindex="0" aria-label="Comparação dos cenários; deslize para ver mais colunas">
            <table class="data-table" aria-label="Tabela de comparação entre os três cenários de cobertura">
              <thead>
                <tr>
                  <th scope="col">Cenário</th>
                  <th scope="col">Redução evaporativa</th>
                  <th scope="col">Cobertura planar</th>
                  <th scope="col">Evaporação residual</th>
                  <th scope="col">Volume preservado</th>
                  <th scope="col">Aeração e Difusão Gasosa</th>
                  <th scope="col">Interpretação ecológica da literatura</th>
                </tr>
              </thead>
              <tbody id="comparisonTableBody">
                <!-- Inserido dinamicamente -->
              </tbody>
            </table>
          </div>

          <p class="card-meta">As classificações ecológicas são interpretações qualitativas da literatura adotada, não medições ou garantias de segurança ambiental do reservatório simulado.</p>
          <!-- Gráficos Acessíveis em Canvas 2D -->
          <div class="grid grid-2 charts-grid">
            <div class="chart-panel">
              <div class="chart-header">
                <h3>Balanço Volumétrico Anual (m³/ano)</h3>
                <span class="chart-tag">Perda residual vs Volume preservado</span>
              </div>
              <div class="chart-canvas-container">
                <canvas id="chartVolumetric" aria-label="Gráfico de barras comparando volume evaporado residual e volume preservado para cada cobertura"></canvas>
              </div>
            </div>

            <div class="chart-panel">
              <div class="chart-header">
                <h3>Eficiências e Cobertura Geométrica (%)</h3>
                <span class="chart-tag">Barras independentes (0% a 100%)</span>
              </div>
              <div class="chart-canvas-container">
                <canvas id="chartEfficiencies" aria-label="Gráfico de barras independentes comparando percentual de redução evaporativa e cobertura superficial"></canvas>
              </div>
            </div>
          </div>

          <!-- Links Contextuais ao final da simulação -->
          <div class="navigation-callouts-strip">
            <div class="callout-card">
              <h4>Transparência dos cálculos</h4>
              <p>Gere um registro da execução com parâmetros, memória de cálculo, comparação e interpretação em A4.</p>
              <div class="report-actions">
                <a href="/ciencia/memoria" class="btn btn-secondary">Gerar Relatório Científico &rarr;</a>
                <a href="/ciencia/pedagogico" class="btn btn-secondary">Gerar Relatório Pedagógico &rarr;</a>
              </div>
            </div>

            <div class="callout-card">
              <h4>Fundamentação teórica</h4>
              <p>Compreenda a dedução matemática da densidade de 90,69% e a transferência de massa de Dalton.</p>
              <a href="/ciencia" class="btn btn-secondary">Entender a modelagem &rarr;</a>
            </div>

            <div class="callout-card">
              <h4>Cenário oficial do estudo</h4>
              <p>Veja a interpretação dos resultados relatados pelo artigo para a seca crítica no Açude Jerimum.</p>
              <a href="/dashboard" class="btn btn-secondary">Conhecer o cenário do estudo &rarr;</a>
            </div>
          </div>
        </section>
        </div>
      </div>
    `;
  },

  mount(container) {
    this.container = container;
    this.activeScene = null;
    this.visualCover = state.simulation.inputs.coverType;
    this.debounceTimer = null;

    this.bindDomElements();
    this.init3DScene();
    this.updateOutputs();
    this.renderComparisonTable();
    this.renderCharts();
    this.bindFormEvents();
    if (state.simulation.validationErrors.length) {
      this.dom.validationAlert.classList.remove('hidden');
      this.dom.validationAlert.textContent = state.simulation.validationErrors.join(' ');
    }
    this.mode = 'free';
    state.reportMode = 'free';
    this.container.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
      this.mode = button.dataset.mode;
      state.reportMode = this.mode;
      this.container.querySelector('.simulation-page').classList.toggle('study-mode', this.mode === 'study');
      this.container.querySelector('#studyCase').hidden = this.mode !== 'study';
      this.container.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      this.setCoverScenario(this.mode === "study" ? "sphere" : state.simulation.inputs.coverType);
      this.renderCharts();
    }));
    this.demoElapsed = 0;
    const enabled = container.querySelector('#demoEnabled');
    const pause = container.querySelector('#demoPause');
    enabled.addEventListener('change', () => {
      clearInterval(this.demoTimer);
      this.demoElapsed = 0;
      this.demoPaused = false;
      pause.disabled = !enabled.checked;
      pause.textContent = 'Pausar';
      container.querySelector('#demoProgress').value = 0;
      if (enabled.checked) {
        this.setCoverScenario('none');
        this.demoTimer = setInterval(() => {
          if (this.demoPaused || document.hidden) return;
          this.demoElapsed++;
          if (this.demoElapsed >= 30) {
            const order = ['none', 'sphere', 'hex'];
            this.setCoverScenario(order[(order.indexOf(this.visualCover || state.simulation.inputs.coverType) + 1) % 3]);
          }
          container.querySelector('#demoProgress').value = this.demoElapsed;
        }, 1000);
      }
    });
    pause.addEventListener('click', () => {
      this.demoPaused = !this.demoPaused;
      pause.textContent = this.demoPaused ? 'Continuar' : 'Pausar';
    });
    this.chartResizeObserver = new ResizeObserver(() => {
      this.renderCharts();
    });
    this.container.querySelectorAll(".chart-canvas-container, .canvas-wrapper").forEach(el => this.chartResizeObserver.observe(el));

    // Reage a alterações de tema e modo de cena
    this.unsubTheme = state.subscribe("theme", (theme) => {
      if (this.activeScene) this.activeScene.setTheme(theme);
      this.renderCharts();
    });
  },

  bindDomElements() {
    this.dom = {
      canvas: this.container.querySelector("#reservoirCanvas"),
      sceneContainer: this.container.querySelector("#sceneContainer"),
      sceneStatus: this.container.querySelector("#sceneStatus"),
      sceneStatusText: this.container.querySelector("#sceneStatusText"),
      btnRetry3D: this.container.querySelector("#btnRetry3D"),
      qualitySelect: this.container.querySelector("#qualitySelect"),
      scenarioButtons: this.container.querySelectorAll(".btn-scenario"),
      cameraPresetButtons: this.container.querySelectorAll("[data-camera]"),
      btnCamZoomIn: this.container.querySelector("#btnCamZoomIn"),
      btnCamZoomOut: this.container.querySelector("#btnCamZoomOut"),
      btnCamReset: this.container.querySelector("#btnCamReset"),
      btnCamFullscreen: this.container.querySelector("#btnCamFullscreen"),
      btnResetDefaults: this.container.querySelector("#btnResetDefaults"),
      validationAlert: this.container.querySelector("#simValidationAlert"),
      inputArea: this.container.querySelector("#inputArea"),
      inputEvap: this.container.querySelector("#inputEvap"),
      sliderEvap: this.container.querySelector("#sliderEvap"),
      inputTemp: this.container.querySelector("#inputTemp"),
      sliderTemp: this.container.querySelector("#sliderTemp"),
      inputWind: this.container.querySelector("#inputWind"),
      sliderWind: this.container.querySelector("#sliderWind"),
      selectCover: this.container.querySelector("#selectCover"),
      // Métricas
      valEvapWithout: this.container.querySelector("#valEvapWithout"),
      valEvapWithoutFull: this.container.querySelector("#valEvapWithoutFull"),
      valEvapWith: this.container.querySelector("#valEvapWith"),
      valEvapWithFull: this.container.querySelector("#valEvapWithFull"),
      valPreserved: this.container.querySelector("#valPreserved"),
      valPreservedFull: this.container.querySelector("#valPreservedFull"),
      valReduction: this.container.querySelector("#valReduction"),
      valCoverageInfo: this.container.querySelector("#valCoverageInfo"),
      valEcologicalNote: this.container.querySelector("#valEcologicalNote"),
      // Tabela e Gráficos
      tableBody: this.container.querySelector("#comparisonTableBody"),
      chartVolumetric: this.container.querySelector("#chartVolumetric"),
      chartEfficiencies: this.container.querySelector("#chartEfficiencies")
    };
  },

  async init3DScene() {
    const token = this.sceneToken = {};
    this.setSceneStatus("loading", "Carregando visualização 3D…");
    try {
      const { Reservoir3DScene } = await import("../scene3d.js");
      if (this.sceneToken !== token || !this.dom.canvas?.isConnected) return;
      // Exclusively WebGL: never acquire 2D while the module import is pending.
      this.activeScene = new Reservoir3DScene(this.dom.canvas, {
        scenario: this.visualCover || state.simulation.inputs.coverType,
        quality: state.graphicsQuality,
        theme: state.theme,
        onCameraChange: preset => this.highlightCameraPreset(preset),
        onContextLost: () => {
          if (this.sceneToken === token) this.setSceneStatus("unavailable", "A conexão com o 3D foi interrompida. Aguardando recuperação do navegador…");
        },
        onContextRestored: () => {
          if (this.sceneToken === token) this.setSceneStatus("ready");
        }
      });
      this.setSceneStatus("ready");
      this.highlightCameraPreset("general");
    } catch (error) {
      if (this.sceneToken !== token || !this.dom.canvas?.isConnected) return;
      console.warn("Não foi possível iniciar a visualização 3D:", error);
      this.setSceneStatus("unavailable", "Não foi possível iniciar o 3D. Tente novamente ou verifique se a aceleração gráfica está disponível no navegador. Seus cálculos continuam funcionando.");
    }
  },

  setSceneStatus(status, message = "") {
    this.sceneStatus = status;
    this.dom.sceneStatus.hidden = status === "ready";
    this.dom.sceneStatusText.textContent = message;
    this.dom.btnRetry3D.hidden = status !== "unavailable";
    this.dom.canvas.setAttribute("aria-busy", String(status === "loading"));
  },

  highlightCameraPreset(preset) {
    this.dom.cameraPresetButtons.forEach(button => {
      const active = button.dataset.camera === preset;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  },

  bindFormEvents() {
    this.dom.cameraPresetButtons.forEach(button => {
      button.addEventListener("click", () => this.activeScene?.setCameraPreset(button.dataset.camera));
    });
    this.dom.btnRetry3D.addEventListener("click", () => {
      if (this.sceneStatus !== "unavailable") return;
      this.activeScene?.dispose();
      this.activeScene = null;
      const freshCanvas = this.dom.canvas.cloneNode(false);
      this.dom.canvas.replaceWith(freshCanvas);
      this.dom.canvas = freshCanvas;
      this.init3DScene();
    });
    const handleInputChange = (field, value, isSlider = false) => {
      const numVal = parseFloat(value);
      const updateObj = { [field]: numVal };

      // Sincroniza slider <-> input
      if (field === "annualEvapMm") {
        if (isSlider) this.dom.inputEvap.value = value;
        else this.dom.sliderEvap.value = value;
      } else if (field === "temperatureC") {
        if (isSlider) this.dom.inputTemp.value = value;
        else this.dom.sliderTemp.value = value;
      } else if (field === "windMS") {
        if (isSlider) this.dom.inputWind.value = value;
        else this.dom.sliderWind.value = value;
      }

      const res = state.updateSimulationInputs(updateObj);

      if (!res.valid) {
        this.dom.validationAlert.classList.remove("hidden");
        this.dom.validationAlert.innerHTML = `<strong>Atenção:</strong> ${res.errors.join("<br>")}`;
      } else {
        this.dom.validationAlert.classList.add("hidden");
        this.updateOutputs();
        this.renderComparisonTable();

        // Throttled chart render
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.renderCharts();
        }, 120);
      }
    };

    this.dom.inputArea.addEventListener("input", (e) => handleInputChange("areaM2", e.target.value));
    this.dom.inputEvap.addEventListener("input", (e) => handleInputChange("annualEvapMm", e.target.value));
    this.dom.sliderEvap.addEventListener("input", (e) => handleInputChange("annualEvapMm", e.target.value, true));
    this.dom.inputTemp.addEventListener("input", (e) => handleInputChange("temperatureC", e.target.value));
    this.dom.sliderTemp.addEventListener("input", (e) => handleInputChange("temperatureC", e.target.value, true));
    this.dom.inputWind.addEventListener("input", (e) => handleInputChange("windMS", e.target.value));
    this.dom.sliderWind.addEventListener("input", (e) => handleInputChange("windMS", e.target.value, true));

    // Seleção de cobertura via <select>
    this.dom.selectCover.addEventListener("change", (e) => {
      this.setCoverScenario(e.target.value);
    });

    // Botões de cenário no 3D
    this.dom.scenarioButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setCoverScenario(btn.dataset.cover);
      });
    });

    // Seletor de qualidade gráfica
    this.dom.qualitySelect.addEventListener("change", (e) => {
      state.setGraphicsQuality(e.target.value);
      if (this.activeScene) this.activeScene.setQuality(e.target.value);
    });

    // Controles da câmera original
    this.dom.btnCamZoomIn.addEventListener("click", () => this.activeScene?.zoomIn());
    this.dom.btnCamZoomOut.addEventListener("click", () => this.activeScene?.zoomOut());
    this.dom.btnCamReset.addEventListener("click", () => {
      this.activeScene?.resetCamera();
    });
    this.dom.btnCamFullscreen.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        this.dom.sceneContainer.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    });

    // Botão de restaurar valores iniciais
    this.dom.btnResetDefaults.addEventListener("click", () => {
      state.resetSimulationDefaults();
      const def = state.simulation.inputs;
      this.dom.inputArea.value = def.areaM2;
      this.dom.inputEvap.value = def.annualEvapMm;
      this.dom.sliderEvap.value = def.annualEvapMm;
      this.dom.inputTemp.value = def.temperatureC;
      this.dom.sliderTemp.value = def.temperatureC;
      this.dom.inputWind.value = def.windMS;
      this.dom.sliderWind.value = def.windMS;
      this.dom.selectCover.value = def.coverType;
      this.setCoverScenario(def.coverType);
      this.dom.validationAlert.classList.add("hidden");
      this.updateOutputs();
      this.renderComparisonTable();
      this.renderCharts();
    });
  },

  setCoverScenario(coverType) {
    this.demoElapsed = 0;
    this.container.querySelector("#demoProgress").value = 0;
    this.visualCover = coverType;
    if (this.mode !== "study") state.updateSimulationInputs({ coverType });
    this.dom.selectCover.value = coverType;

    this.dom.scenarioButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.cover === coverType);
      btn.setAttribute("aria-pressed", String(btn.dataset.cover === coverType));
    });

    if (this.activeScene) {
      this.activeScene.setScenario(coverType);
    }

    this.updateOutputs();
    this.renderComparisonTable();
    this.renderCharts();
  },

  updateOutputs() {
    const res = state.simulation.result;
    if (!res.valid) return;

    const m = res.metrics;
    const equivalent = interpretVolume(m.litersSaved);
    this.container.querySelector('#volumeEquivalents').textContent = `${formatFullNumber(equivalent.tanks)} caixas de 1.000 L por ano, ou ${formatFullNumber(equivalent.peopleFor365Days)} pessoas por 365 dias (${formatFullNumber(equivalent.personDays)} pessoas × dias).`;

    this.dom.valEvapWithout.textContent = formatCompact(m.evaporationWithoutCoverM3, "m³/ano");
    this.dom.valEvapWithoutFull.textContent = `${formatFullNumber(m.evaporationWithoutCoverM3)} m³/ano`;

    this.dom.valEvapWith.textContent = formatCompact(m.evaporationWithCoverM3, "m³/ano");
    this.dom.valEvapWithFull.textContent = `${formatFullNumber(m.evaporationWithCoverM3)} m³/ano`;

    this.dom.valPreserved.textContent = formatCompact(m.preservedM3, "m³/ano");
    this.dom.valPreservedFull.textContent = `${formatFullNumber(m.preservedM3)} m³/ano (${formatCompact(m.litersSaved, "L")})`;

    this.dom.valReduction.textContent = formatPercent(m.reductionFraction);
    this.dom.valCoverageInfo.textContent = `Cobertura: ${formatPercent(m.surfaceCoverageFraction)}`;
    this.dom.valEcologicalNote.textContent = res.cover.biologicalRisk;
  },

  renderComparisonTable() {
    const comparisons = state.simulation.comparisons;
    if (!this.dom.tableBody) return;

    this.dom.tableBody.innerHTML = comparisons
      .map((item) => {
        const isCurrent = item.cover.id === state.simulation.inputs.coverType;
        const m = item.metrics;
        return `
          <tr class="${isCurrent ? "row-highlight" : ""}">
            <td>
              <strong>${item.cover.name}</strong>
              ${isCurrent ? '<span class="pill-active">Ativo</span>' : ""}
            </td>
            <td><strong>${formatPercent(m.reductionFraction)}</strong></td>
            <td>${formatPercent(m.surfaceCoverageFraction)}</td>
            <td>${formatCompact(m.evaporationWithCoverM3, "m³/ano")}</td>
            <td><strong>${formatCompact(m.preservedM3, "m³/ano")}</strong></td>
            <td>${item.cover.aerationQuality}</td>
            <td><small>${item.cover.biologicalRisk}</small></td>
          </tr>
        `;
      })
      .join("");
  },

  renderCharts() {
    const comparisons = state.simulation.comparisons;
    if (this.dom.chartVolumetric) {
      drawVolumetricComparisonChart(this.dom.chartVolumetric, comparisons, state.theme);
    }
    if (this.dom.chartEfficiencies) {
      drawEfficiencyComparisonChart(this.dom.chartEfficiencies, comparisons, state.theme);
    }
  },

  unmount() {
    clearInterval(this.demoTimer);
    this.sceneToken = null;
    this.sceneStatus = "disposed";
    this.chartResizeObserver?.disconnect();
    clearTimeout(this.debounceTimer);
    if (this.unsubTheme) this.unsubTheme();
    if (this.activeScene) {
      this.activeScene.dispose();
      this.activeScene = null;
    }
  }
};
