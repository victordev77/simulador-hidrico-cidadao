import { renderPedagogicalTopics } from '../report/pedagogicalCatalog.js';
import { environmentalContext } from '../interpretation.js';
/**
 * Simulador Hídrico Cidadão — Rota /ciencia (Fundamentação Científica)
 *
 * Estrutura pedagógica e técnica rigorosa para estudantes e banca examinadora:
 * Explicação simples → Fórmula → Variáveis e unidades → Exemplo numérico → Origem no artigo.
 *
 * Fórmulas renderizadas em tipografia matemática vetorial nítida (HTML/CSS semântico).
 */

import { PARAMETER_PROVENANCE_TABLE, BIBLIOGRAPHY, CITATION_MAPPING_NOTE } from "../constants.js";

export const cienciaView = {
  title: "Ciência e Modelagem — Simulador Hídrico Cidadão",

  render() {
    return `
      <div class="science-page section">
        <div class="page-header">
          <p class="section-eyebrow">Rigor matemático e modelagem</p>
          <h1 class="page-title">A Ciência por Trás do Simulador Hídrico</h1>
          <p class="section-subtitle">
            Da geometria discreta de empacotamento às leis aerodinâmicas de transferência de massa: conheça os fundamentos físicos e analíticos do projeto.
          </p>
          <div class="quick-nav-links">
            <a href="#geometria" class="btn-chip">02. Geometria de Empacotamento</a>
            <a href="#dalton" class="btn-chip">04. Equação de Dalton</a>
            <a href="#volumetria" class="btn-chip">05. Equacionamento Volumétrico</a>
            <a href="#parametros" class="btn-chip">06. Parâmetros Adotados</a>
            <a href="#limitacoes" class="btn-chip">07. Hipóteses e Limitações</a>
            <a href="#pedagogia" class="btn-chip">Tópicos Pedagógicos</a>
            <a href="/ciencia/memoria" class="btn-chip">Ver Memória de Cálculo</a>
          </div>
        </div>

        <!-- 1. DA REALIDADE AO MODELO -->
        <article class="science-card">
          <div class="card-badge">Fundamento 01</div>
          <h2>1. Da Realidade ao Modelo: A Dinâmica da Evaporação</h2>
          <p>
            Em regiões de clima semiárido, a perda contínua de água por evaporação em reservatórios a céu aberto constitui um dos principais entraves à segurança hídrica. A radiação solar incide sobre a coluna de água aquecendo a camada superficial, enquanto o vento remove continuamente o vapor saturado junto à lâmina livre.
          </p>
          <p>
            A introdução de coberturas artificiais flutuantes atua simultaneamente em duas frentes físicas:
          </p>
          <ul class="science-bullet-list">
            <li><strong>Interceptação da radiação solar incidente:</strong> Reduz o aquecimento da camada superficial e diminui a pressão de vapor de saturação (<em>e<sub>s</sub></em>).</li>
            <li><strong>Criação de barreira física aerodinâmica:</strong> Anula o cisalhamento turbulento do vento rente à superfície líquida, estabilizando a subcamada laminar.</li>
          </ul>
        </article>

        <!-- 2. GEOMETRIA DAS ESFERAS E EMPACOTAMENTO -->
        <article class="science-card" id="geometria">
          <div class="card-badge">Fundamento 02</div>
          <h2>2. Geometria de Empacotamento Bidimensional (Esferas de PEAD)</h2>
          <p>
            <strong>Explicação simples:</strong> Quando esferas de mesmo diâmetro flutuam livremente em uma superfície de água, a agitação física as acomoda naturalmente na configuração mais compacta possível — o empacotamento hexagonal (rede triangular).
          </p>

          <div class="math-display-box" role="region" aria-label="Equações de densidade geométrica">
            <div class="formula-line">
              <span class="formula-label">Densidade teórica máxima de cobertura (η):</span>
              <div class="math-equation">
                <span class="math-var">η</span> = 
                <span class="math-frac">
                  <span class="math-num">π</span>
                  <span class="math-den">2√3</span>
                </span>
                ≈ <span class="math-number">0,90689968</span>... ≈ <strong>90,69%</strong>
              </div>
            </div>

            <div class="formula-line">
              <span class="formula-label">Porosidade residual de salvaguarda (φ):</span>
              <div class="math-equation">
                <span class="math-var">φ</span> = 1 − <span class="math-var">η</span> = 1 − 
                <span class="math-frac">
                  <span class="math-num">π</span>
                  <span class="math-den">2√3</span>
                </span>
                ≈ <span class="math-number">0,09310032</span>... ≈ <strong>9,31%</strong>
              </div>
            </div>
          </div>

          <div class="explanation-grid">
            <div class="expl-col">
              <h4>Dedução Analítica (Célula Unitária Rômbica)</h4>
              <p>
                Considerando uma célula unitária rômbica formada pelos centros de 4 esferas tangentes de raio <em>R</em> com ângulos de 60° e 120°:
              </p>
              <ul>
                <li>Lado do losango: <em>L = 2R</em></li>
                <li>Área da célula unitária: <em>A<sub>célula</sub> = L² · sen(60°) = (2R)² · (√3 / 2) = 2√3 R²</em></li>
                <li>Área de círculos dentro da célula: 2 setores de 60° e 2 de 120° = 360° = <em>π R²</em></li>
                <li>Densidade: <em>η = (π R²) / (2√3 R²) = π / (2√3)</em>. O raio <em>R</em> se cancela, demonstrando que o valor é uma constante universal independente do diâmetro da esfera.</li>
              </ul>
            </div>

            <div class="expl-col">
              <h4>O Papel Vital da Porosidade de 9,31%</h4>
              <p>
                Ao contrário de placas herméticas, os <strong>9,31% de vazios intersticiais</strong> mantêm parte da interface com a atmosfera. A interpretação ambiental dessa geometria é uma hipótese: a fração aberta, isoladamente, não demonstra oxigenação suficiente nem ausência de anoxia. Esses efeitos exigem validação em campo.
              </p>
              <div class="provenance-tag">Geometria: artigo da equipe, Resumo e Materiais e Métodos [2]. Ressalva ambiental: ver referências complementares abaixo.</div>
            </div>
          </div>
        </article>

        <!-- 3. COBERTURA GEOMÉTRICA VERSUS EFICIÊNCIA EVAPORATIVA -->
        <article class="science-card">
          <div class="card-badge">Fundamento 03</div>
          <h2>3. Cobertura Geométrica vs. Redução Evaporativa: Conceitos Distintos</h2>
          <p>
            Um dos cuidados científicos mais importantes desta pesquisa é <strong>não confundir a área física ocluída com a taxa de mitigação da evaporação</strong>:
          </p>

          <div class="comparison-pills-row">
            <div class="pill-detail">
              <strong>Cobertura Geométrica (η)</strong>
              <span>Área do plano horizontal efetivamente ocupada pelo sólido flutuante.</span>
              <em>Esferas: 90,69% | Placas Hexagonais: 98,00%</em>
            </div>
            <div class="pill-detail">
              <strong>Redução Evaporativa (R)</strong>
              <span>Queda percentual na massa de água perdida por evaporação em relação à água aberta.</span>
              <em>Esferas: até 74,86% | Placas Hexagonais: até 88,59%</em>
            </div>
          </div>

          <p>
            A evaporação residual em esferas ocorre porque as aberturas intersticiais de 9,31% continuam permitindo difusão gasosa e pequenos vórtices convectivos. Por isso, a redução evaporativa medida empiricamente em literatura é de até <strong>74,86%</strong> (e não 90,69%).
          </p>
        </article>

        <!-- 4. FUNDAMENTAÇÃO DE DALTON -->
        <article class="science-card" id="dalton">
          <div class="card-badge">Fundamento 04</div>
          <h2>4. Transferência de Massa: A Formulação Aerodinâmica de Dalton</h2>
          <p>
            <strong>Explicação simples:</strong> A taxa em que a água líquida evapora para o ar depende de quanta água o ar já contém em relação à sua capacidade máxima (déficit de vapor) e da velocidade com que o vento renova o ar úmido sobre a represa.
          </p>

          <div class="math-display-box" role="region" aria-label="Equação de Dalton">
            <div class="math-equation">
              <span class="math-var">E</span> = <span class="math-var">f</span>(<span class="math-var">ū</span>) · (<span class="math-var">e<sub>s</sub></span> − <span class="math-var">e<sub>a</sub></span>)
            </div>
          </div>

          <div class="variables-table-wrap">
            <table class="simple-table" aria-label="Variáveis da Equação de Dalton">
              <thead>
                <tr>
                  <th>Variável</th>
                  <th>Significado Físico</th>
                  <th>Unidade Típica</th>
                  <th>Ação da Cobertura Flutuante</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>E</strong></td>
                  <td>Taxa instantânea de evaporação</td>
                  <td>mm/dia ou kg/(m²·s)</td>
                  <td>Reduzida em até 74,86% (esferas) ou 88,59% (hexágonos).</td>
                </tr>
                <tr>
                  <td><strong>f(ū)</strong></td>
                  <td>Função aerodinâmica da velocidade do vento</td>
                  <td>Adimensional ou m/s</td>
                  <td>As coberturas amortecem a turbulência superficial, fazendo <em>ū</em> tender a zero rente à água.</td>
                </tr>
                <tr>
                  <td><strong>e<sub>s</sub></strong></td>
                  <td>Pressão de vapor de saturação na temperatura da água</td>
                  <td>kPa ou hPa</td>
                  <td>Diminui pelo sombreamento e interceptação da radiação solar direta.</td>
                </tr>
                <tr>
                  <td><strong>e<sub>a</sub></strong></td>
                  <td>Pressão real de vapor do ar circundante</td>
                  <td>kPa ou hPa</td>
                  <td>Depende da umidade relativa atmosférica da região.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="scientific-note-box">
            <strong>Relação entre Dalton e o Motor Matemático:</strong>
            O simulador didático adota como dado de base a taxa anual integrada de <strong>2.344,7 mm/ano</strong> (fornecida pela FUNCEME/INMET), a qual já sintetiza a climatologia anual do semiárido cearense. Os campos de temperatura e vento exibidos na interface contextualizam o microclima local, mas não recalculam a lâmina anual de forma artificial, garantindo fidelidade metodológica.
          </div>
        </article>

        <!-- 5. EQUACIONAMENTO VOLUMÉTRICO -->
        <article class="science-card" id="volumetria">
          <div class="card-badge">Fundamento 05</div>
          <h2>5. Cálculo dos Volumes Hidrológicos</h2>
          <p>
            A conversão da lâmina evaporada anual (mm/ano) para metros cúbicos e litros baseia-se na integração sobre a área do espelho d'água:
          </p>

          <div class="math-steps-container">
            <div class="math-step-card">
              <span class="step-num">Passo 1</span>
              <h4>Volume evaporado sem cobertura (V<sub>sem</sub>)</h4>
              <div class="math-equation">
                <span class="math-var">V<sub>sem</sub></span> = <span class="math-var">A</span> × (<span class="math-var">E</span> / 1000)
              </div>
              <p>Onde <em>A</em> é a área do espelho d'água em m² e <em>E</em> é a lâmina em mm/ano. (1 mm = 0,001 m).</p>
            </div>

            <div class="math-step-card">
              <span class="step-num">Passo 2</span>
              <h4>Volume preservado (V<sub>preservado</sub>)</h4>
              <div class="math-equation">
                <span class="math-var">V<sub>preservado</sub></span> = <span class="math-var">V<sub>sem</sub></span> × <span class="math-var">R</span>
              </div>
              <p>Onde <em>R</em> é a fração de supressão evaporativa da cobertura adotada (0 para sem cobertura, 0,7486 para esferas, 0,8859 para hexágonos).</p>
            </div>

            <div class="math-step-card">
              <span class="step-num">Passo 3</span>
              <h4>Volume evaporado residual com cobertura (V<sub>com</sub>)</h4>
              <div class="math-equation">
                <span class="math-var">V<sub>com</sub></span> = <span class="math-var">V<sub>sem</sub></span> − <span class="math-var">V<sub>preservado</sub></span>
              </div>
              <p>Garante o invariante físico fundamental: a perda real com cobertura somada ao volume preservado é estritamente igual à perda sem cobertura.</p>
            </div>

            <div class="math-step-card">
              <span class="step-num">Passo 4</span>
              <h4>Equivalência social de consumo</h4>
              <div class="math-equation">
                <span class="math-var">Pessoas</span> = 
                <span class="math-frac">
                  <span class="math-num">Litros Preservados</span>
                  <span class="math-den">100 L/pessoa/dia × 365 dias</span>
                </span>
              </div>
              <p>Premissa adotada pelo artigo para traduzir a abstração volumétrica em dignidade e cidadania democrática.</p>
            </div>
          </div>
        </article>

        <!-- 6. TABELA CENTRALIZADA DE PARÂMETROS -->
        <article class="science-card" id="parametros">
          <div class="card-badge">Fundamento 06</div>
          <h2>6. Tabela Centralizada de Parâmetros e Origem dos Dados</h2>
          <p>
            Todos os valores utilizados pela aplicação são compartilhados e rastreáveis diretamente às fontes do estudo:
          </p>

          <div class="table-container">
            <table class="data-table" aria-label="Tabela de parâmetros científicos e suas fontes">
              <thead>
                <tr>
                  <th scope="col">Elemento / Parâmetro</th>
                  <th scope="col">Valor Adotado</th>
                  <th scope="col">Natureza Científica</th>
                  <th scope="col">Identificação e Origem no Artigo</th>
                </tr>
              </thead>
              <tbody>
                ${PARAMETER_PROVENANCE_TABLE.map(
                  (p) => `
                  <tr>
                    <td><strong>${p.parameter}</strong></td>
                    <td><code>${p.value}</code></td>
                    <td>${p.nature}</td>
                    <td><small>${p.origin}</small></td>
                  </tr>
                `
                ).join("")}
              </tbody>
            </table>
          </div>
        </article>

        <!-- 7. HIPÓTESES E LIMITAÇÕES -->
        <article class="science-card" id="limitacoes">
          <div class="card-badge">Fundamento 07</div>
          <h2>7. Hipóteses de Modelagem e Limitações Identificadas</h2>
          <p>
            O rigor da ciência exige explicitar as fronteiras do modelo computacional:
          </p>
          <ul class="science-bullet-list">
            <li>
              <strong>Ausência de Curva Cota-Área-Volume:</strong> O artigo não fornece a batimetria topográfica detalhada do Açude Jerimum para converter automaticamente qualquer volume em cota e espelho d'água. Por essa razão, a área na simulação interativa permanece editável.
            </li>
            <li>
              <strong>Balanço Hídrico Estático:</strong> O simulador foca na mitigação evaporativa anual da lâmina superficial; ele não calcula infiltração no leito rochoso, precipitação pluviométrica estocástica, vazão de sangria ou retirada contínua por comportas adutoras.
            </li>
            <li>
              <strong>Qualidade e Tratabilidade da Água:</strong> A avaliação de aeração baseia-se na literatura ecológica consolidada (porosidade residual preservando a interface de oxigênio). O simulador não realiza testes laboratoriais físico-químicos automáticos de potabilidade.
            </li>
          </ul>
        </article>

        ${environmentalContext}
        ${renderPedagogicalTopics()}
        <!-- 8. REFERÊNCIAS BIBLIOGRÁFICAS OFICIAIS -->
        <article class="science-card">
          <div class="card-badge">Fundamento 08</div>
          <h2>8. Referências Bibliográficas do Estudo</h2>
          <ol class="bibliography-list">
            ${BIBLIOGRAPHY.map(
              (ref) => `
              <li>
                <span class="ref-index">[${ref.index}]</span>
                <span class="ref-text">${ref.citation}</span>
              </li>
            `
            ).join("")}
          </ol>
          <p class="citation-doc-note">
            <em>${CITATION_MAPPING_NOTE}</em>
          </p>
        </article>
      </div>
    `;
  },

  mount(container) {
    const links = [...container.querySelectorAll('.quick-nav-links a[href^="#"]')];
    const sections = links.map(link => container.querySelector(link.getAttribute('href')));
    const offset = () => (document.querySelector('.site-header')?.getBoundingClientRect().height || 80) + 16;
    this.updateChapter = () => {
      let selected = null;
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= offset() + 4 && rect.bottom > offset()) selected = section.id;
      }
      links.forEach(link => {
        const active = link.hash === '#' + selected;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    };
    links.forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      const section = container.querySelector(link.hash);
      history.replaceState(null, '', link.hash);
      window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top - offset(), behavior: 'instant' });
      this.updateChapter();
    }));
    window.addEventListener('scroll', this.updateChapter, { passive: true });
    window.addEventListener('resize', this.updateChapter);
    this.updateChapter();
    if (links.some(link => link.hash === location.hash)) links.find(link => link.hash === location.hash).click();
  },

  unmount() {
    window.removeEventListener("scroll", this.updateChapter);
    window.removeEventListener("resize", this.updateChapter);
  }
};
