/**
 * Simulador Hídrico Cidadão — Rota /ciencia/memoria (Memória de Cálculo e Relatório A4)
 *
 * Gera dinamicamente o relatório técnico auditável da simulação corrente do usuário:
 * Identificação → Data/Hora → Entradas e Parâmetros → Fórmulas com Substituição Numérica
 * → Resultados Intermediários e Finais → Tabela Comparativa → Assinatura Científica.
 *
 * Integra botão "Imprimir / Salvar em PDF" com estilos CSS dedicados para folha A4 encadernável.
 */

import { state } from "../state.js";
import { formatFullNumber, formatPercent, formatCompact } from "../mathEngine.js";
import { BIBLIOGRAPHY } from "../constants.js";

export const memoriaView = {
  title: "Memória de Cálculo — Simulador Hídrico Cidadão",

  render() {
    const sim = state.simulation;
    const res = sim.result;

    if (!res || !res.valid) {
      return `
        <div class="section memoria-empty-state">
          <div class="empty-card">
            <span class="badge badge-accent">Memória Não Inicializada</span>
            <h2>Nenhuma Simulação Válida Encontrada</h2>
            <p>
              Para gerar a memória de cálculo e o relatório técnico auditável, é necessário configurar e validar as entradas no simulador.
            </p>
            <div class="action-row">
              <a href="/simular" class="btn btn-primary">Abrir o Simulador Agora</a>
            </div>
          </div>
        </div>
      `;
    }

    const m = res.metrics;
    const inp = res.inputs;
    const comparisons = sim.comparisons;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    const formattedTime = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const isDemonstrative = sim.isDefault;

    return `
      <div class="memoria-page section">
        <!-- Barra de Ações (Oculta na Impressão) -->
        <div class="no-print memoria-action-bar">
          <div class="action-info">
            <a href="/simular" class="btn-link">&larr; Voltar para a Simulação</a>
            <span class="divider">•</span>
            <span>Relatório auditável pronto para A4</span>
          </div>
          <button type="button" class="btn btn-primary" id="btnPrintReport">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Imprimir / Salvar em PDF
          </button>
        </div>

        <!-- DOCUMENTO DO RELATÓRIO TÉCNICO (FOLHA A4 ENCADERNÁVEL) -->
        <div class="report-document" id="reportDocument">
          <!-- CABEÇALHO OFICIAL DO RELATÓRIO -->
          <header class="report-header">
            <div class="report-header-top">
              <div class="report-brand">
                <img src="/assets/logo-simulador-hidrico.svg" alt="Logo Simulador Hídrico Cidadão" class="report-logo" />
                <div>
                  <h1 class="report-title">Simulador Hídrico Cidadão</h1>
                  <p class="report-subtitle">Relatório Técnico e Memória de Cálculo Volumétrico</p>
                </div>
              </div>
              <div class="report-meta">
                <span><strong>Data:</strong> ${formattedDate}</span>
                <span><strong>Horário:</strong> ${formattedTime}</span>
                <span><strong>Regulamento:</strong> Ceará Científico 2026</span>
              </div>
            </div>

            <div class="report-authorship-bar">
              <div><strong>Pesquisadores:</strong> Ana Júlia Sousa Bastos &amp; Victor Hugo Silva Lopes</div>
              <div><strong>Orientador:</strong> Prof. Fabrício Mota Gonçalves</div>
              <div><strong>Área:</strong> Matemática e suas Tecnologias</div>
            </div>

            ${
              isDemonstrative
                ? `
                <div class="report-alert-box">
                  <strong>Aviso de Transparência Metodológica:</strong>
                  Este relatório foi gerado com as <em>entradas demonstrativas padrão</em> do sistema (Área: ${formatFullNumber(inp.areaM2)} m²). As variáveis são configuráveis na tela de simulação.
                </div>
              `
                : `
                <div class="report-alert-box info">
                  <strong>Simulação Personalizada do Usuário:</strong>
                  Cálculos processados a partir das variáveis customizadas inseridas pelo operador no simulador.
                </div>
              `
            }
          </header>

          <!-- 1. VARIÁVEIS DE ENTRADA -->
          <section class="report-section">
            <h2 class="report-sec-title">1. Parâmetros e Variáveis de Entrada</h2>
            <div class="table-container" tabindex="0" aria-label="Tabela de cálculo; deslize para ver mais colunas"><table class="report-table">
              <thead>
                <tr>
                  <th>Variável</th>
                  <th>Símbolo</th>
                  <th>Valor Informado</th>
                  <th>Unidade</th>
                  <th>Origem / Racional Científico</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Área do espelho d'água</td>
                  <td><strong>A</strong></td>
                  <td><strong>${formatFullNumber(inp.areaM2)}</strong></td>
                  <td>m²</td>
                  <td>${isDemonstrative ? "Valor demonstrativo inicial editável" : "Valor configurado pelo usuário"}</td>
                </tr>
                <tr>
                  <td>Evaporação potencial anual</td>
                  <td><strong>E</strong></td>
                  <td><strong>${formatFullNumber(inp.annualEvapMm, 1)}</strong></td>
                  <td>mm/ano</td>
                  <td>Referência média histórica da FUNCEME/INMET citada no estudo</td>
                </tr>
                <tr>
                  <td>Temperatura média do ar</td>
                  <td><strong>T</strong></td>
                  <td>${formatFullNumber(inp.temperatureC, 1)}</td>
                  <td>°C</td>
                  <td>Variável climática de contextualização ambiental</td>
                </tr>
                <tr>
                  <td>Velocidade do vento</td>
                  <td><strong>u</strong></td>
                  <td>${formatFullNumber(inp.windMS, 1)}</td>
                  <td>m/s</td>
                  <td>Variável aerodinâmica de contextualização ambiental</td>
                </tr>
                <tr>
                  <td>Cobertura sob análise</td>
                  <td>—</td>
                  <td><strong>${res.cover.name}</strong></td>
                  <td>—</td>
                  <td>Tecnologia avaliada pelo modelo</td>
                </tr>
              </tbody>
            </table></div>
          </section>

          <!-- 2. COEFICIENTES ADOTADOS -->
          <section class="report-section">
            <h2 class="report-sec-title">2. Coeficientes Adotados para a Cobertura (${res.cover.name})</h2>
            <div class="table-container" tabindex="0" aria-label="Tabela de cálculo; deslize para ver mais colunas"><table class="report-table">
              <thead>
                <tr>
                  <th>Coeficiente</th>
                  <th>Símbolo</th>
                  <th>Valor Teórico</th>
                  <th>Fórmula / Origem Documental</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cobertura de área geométrica</td>
                  <td><strong>η</strong></td>
                  <td><strong>${formatPercent(res.cover.surfaceCoverage)}</strong></td>
                  <td>${res.cover.id === "sphere" ? "η = π / (2√3) (empacotamento hexagonal plano)" : res.cover.id === "hex" ? "98,00% (oclusão teórica de placas prismáticas)" : "0,00% (superfície aberta exposta)"}</td>
                </tr>
                <tr>
                  <td>Porosidade residual livre</td>
                  <td><strong>φ</strong></td>
                  <td><strong>${formatPercent(res.cover.porosity)}</strong></td>
                  <td>φ = 1 − η (${res.cover.aerationQuality})</td>
                </tr>
                <tr>
                  <td>Redução evaporativa adotada</td>
                  <td><strong>R</strong></td>
                  <td><strong>${formatPercent(res.cover.evaporativeReduction)}</strong></td>
                  <td>Parâmetro adotado de literatura experimental citada no estudo</td>
                </tr>
              </tbody>
            </table></div>
          </section>

          <!-- 3. PASSO A PASSO DA MEMÓRIA DE CÁLCULO -->
          <section class="report-section">
            <h2 class="report-sec-title">3. Passo a Passo do Desenvolvimento Matemático</h2>

            <!-- Etapa 1 -->
            <div class="calc-step-block">
              <h3>Etapa 3.1: Volume Evaporado Sem Cobertura (V<sub>sem</sub>)</h3>
              <p class="step-meaning">
                <strong>Significado:</strong> Converte a lâmina de evaporação anual (mm) em altura líquida equivalente (metros) e calcula o volume anual que evaporaria caso o espelho ficasse totalmente exposto.
              </p>
              <div class="step-formula-box">
                <div class="box-row"><strong>Fórmula:</strong> <code>V_sem = A × (E / 1000)</code></div>
                <div class="box-row"><strong>Substituição:</strong> <code>V_sem = ${formatFullNumber(inp.areaM2)} m² × (${formatFullNumber(inp.annualEvapMm, 1)} mm / 1000)</code></div>
                <div class="box-row"><strong>Operação intermediária:</strong> <code>V_sem = ${formatFullNumber(inp.areaM2)} × ${formatFullNumber(inp.annualEvapMm / 1000, 4)} m</code></div>
                <div class="box-row highlight"><strong>Resultado:</strong> <code>V_sem = ${formatFullNumber(m.evaporationWithoutCoverM3)} m³/ano</code> (${formatFullNumber(m.litersEvaporatedWithoutCover)} Litros/ano)</div>
              </div>
            </div>

            <!-- Etapa 2 -->
            <div class="calc-step-block">
              <h3>Etapa 3.2: Volume Preservado pela Cobertura (V<sub>preservado</sub>)</h3>
              <p class="step-meaning">
                <strong>Significado:</strong> Aplica a eficiência de retenção evaporativa (R) adotada para mitigar as perdas na lâmina d'água.
              </p>
              <div class="step-formula-box">
                <div class="box-row"><strong>Fórmula:</strong> <code>V_preservado = V_sem × R</code></div>
                <div class="box-row"><strong>Substituição:</strong> <code>V_preservado = ${formatFullNumber(m.evaporationWithoutCoverM3)} m³ × ${formatPercent(m.reductionFraction)}</code></div>
                <div class="box-row highlight"><strong>Resultado:</strong> <code>V_preservado = ${formatFullNumber(m.preservedM3)} m³/ano</code></div>
                <div class="box-row"><strong>Conversão para Litros:</strong> <code>Litros = V_preservado × 1000 = ${formatFullNumber(m.litersSaved)} L/ano</code></div>
              </div>
            </div>

            <!-- Etapa 3 -->
            <div class="calc-step-block">
              <h3>Etapa 3.3: Volume Evaporado Residual com Cobertura (V<sub>com</sub>)</h3>
              <p class="step-meaning">
                <strong>Significado:</strong> Balanço do volume que ainda escapa para a atmosfera através da porosidade ou do limite físico da cobertura.
              </p>
              <div class="step-formula-box">
                <div class="box-row"><strong>Fórmula:</strong> <code>V_com = V_sem − V_preservado</code></div>
                <div class="box-row"><strong>Substituição:</strong> <code>V_com = ${formatFullNumber(m.evaporationWithoutCoverM3)} m³ − ${formatFullNumber(m.preservedM3)} m³</code></div>
                <div class="box-row highlight"><strong>Resultado:</strong> <code>V_com = ${formatFullNumber(m.evaporationWithCoverM3)} m³/ano</code> (${formatFullNumber(m.litersEvaporatedWithCover)} Litros/ano)</div>
              </div>
            </div>

            <!-- Etapa 4 -->
            <div class="calc-step-block">
              <h3>Etapa 3.4: Equivalência Social Básica de Consumo</h3>
              <p class="step-meaning">
                <strong>Significado:</strong> Tradução do volume salvo em contingente populacional atendido com o consumo mínimo estipulado pelo estudo (100 L/pessoa/dia ao longo de 365 dias).
              </p>
              <div class="step-formula-box">
                <div class="box-row"><strong>Fórmula:</strong> <code>Pessoas = Litros_preservados / (100 L/dia × 365 dias)</code></div>
                <div class="box-row"><strong>Substituição:</strong> <code>Pessoas = ${formatFullNumber(m.litersSaved)} / 36.500 L/pessoa·ano</code></div>
                <div class="box-row highlight"><strong>Resultado:</strong> <code>${formatFullNumber(m.socialImpact.equivalentPeopleSupportedYear)} pessoas equivalentes / ano</code></div>
              </div>
            </div>
          </section>

          <!-- 4. COMPARAÇÃO SIMULTÂNEA DOS TRÊS CENÁRIOS -->
          <section class="report-section page-break-before">
            <h2 class="report-sec-title">4. Matriz Comparativa dos 3 Cenários (Mesmas Entradas Físicas)</h2>
            <div class="table-container" tabindex="0" aria-label="Tabela de cálculo; deslize para ver mais colunas"><table class="report-table">
              <thead>
                <tr>
                  <th>Cenário</th>
                  <th>Redução (R)</th>
                  <th>Cobertura (η)</th>
                  <th>Evaporação Residual (m³/ano)</th>
                  <th>Volume Salvo (m³/ano)</th>
                  <th>Litros Salvos (L/ano)</th>
                  <th>Pessoas Equivalentes</th>
                </tr>
              </thead>
              <tbody>
                ${comparisons
                  .map((c) => {
                    const cm = c.metrics;
                    return `
                    <tr>
                      <td><strong>${c.cover.name}</strong></td>
                      <td><strong>${formatPercent(cm.reductionFraction)}</strong></td>
                      <td>${formatPercent(cm.surfaceCoverageFraction)}</td>
                      <td>${formatFullNumber(cm.evaporationWithCoverM3)}</td>
                      <td><strong>${formatFullNumber(cm.preservedM3)}</strong></td>
                      <td>${formatFullNumber(cm.litersSaved)}</td>
                      <td>${formatFullNumber(cm.socialImpact.equivalentPeopleSupportedYear)}</td>
                    </tr>
                  `;
                  })
                  .join("")}
              </tbody>
            </table></div>
          </section>

          <!-- 5. CONSIDERAÇÕES TÉCNICAS E LIMITAÇÕES -->
          <section class="report-section">
            <h2 class="report-sec-title">5. Notas de Rigor e Limitações Metodológicas</h2>
            <ul class="report-notes-list">
              <li>
                <strong>Verificação de Invariantes Físicos:</strong> O cálculo satisfaz estritamente <code>V_sem = V_com + V_preservado</code> sem deriva numérica.
              </li>
              <li>
                <strong>Premissa de Consumo:</strong> A equivalência social baseia-se em 100 L/pessoa/dia para sobrevivência digna no semiárido, representando capacidade volumétrica potencial, não rede de distribuição encanada instalada.
              </li>
              <li>
                <strong>Equilíbrio Ecológico:</strong> O empacotamento de esferas (90,69% de cobertura) preserva os 9,31% de porosidade necessários à difusão de oxigênio gasoso na água, evitando a asfixia letal da ictiofauna do açude.
              </li>
            </ul>
          </section>

          <!-- 6. ASSINATURA E IDENTIFICAÇÃO -->
          <footer class="report-footer">
            <div class="report-signature-grid">
              <div class="sig-block">
                <div class="sig-line"></div>
                <strong>Ana Júlia Sousa Bastos</strong>
                <span>Pesquisadora Estudantil</span>
              </div>
              <div class="sig-block">
                <div class="sig-line"></div>
                <strong>Victor Hugo Silva Lopes</strong>
                <span>Pesquisador Estudantil</span>
              </div>
              <div class="sig-block">
                <div class="sig-line"></div>
                <strong>Prof. Fabrício Mota Gonçalves</strong>
                <span>Professor Orientador</span>
              </div>
            </div>

            <p class="report-event-tag">
              Ceará Científico 2026 • Mais Solidário, Mais Cooperativo • Área de Matemática e suas Tecnologias
            </p>
          </footer>
        </div>
      </div>
    `;
  },

  mount(container) {
    this.container = container;
    const printBtn = this.container.querySelector("#btnPrintReport");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }
  },

  unmount() {
    // Nada a desmontar
  }
};
