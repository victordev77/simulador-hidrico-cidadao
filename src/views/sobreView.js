/**
 * Simulador Hídrico Cidadão — Rota /sobre (Artigo Condensado, Equipe e Referências)
 *
 * Narrativa condensada em 2 a 3 minutos:
 * A Pesquisa → O Problema e a Proposta → Linha Metodológica →
 * Números Centrais → Da Matemática ao Simulador → Limitações e Continuidade → Equipe e Bibliografia.
 */

import { BIBLIOGRAPHY, CITATION_MAPPING_NOTE } from "../constants.js";

export const sobreView = {
  title: "Sobre a Pesquisa e Equipe — Simulador Hídrico Cidadão",

  render() {
    return `
      <div class="sobre-page section">
        <div class="page-header">
          <span class="badge badge-accent">Ceará Científico 2026</span>
          <h1 class="page-title">Modelagem Matemática e Cidadania em Irauçuba</h1>
          <p class="section-subtitle">
            A história, a metodologia científica e os compromissos democráticos por trás do Simulador Hídrico Cidadão.
          </p>
        </div>

        <!-- 1. A PESQUISA -->
        <article class="sobre-card">
          <div class="sobre-card-header">
            <span class="step-tag">A Pesquisa</span>
            <h2>Título Oficial e Finalidade do Trabalho</h2>
          </div>
          <blockquote class="paper-title-quote">
            “Modelagem Matemática de Coberturas Artificiais para Mitigação da Evaporação no Açude Jerimum: Segurança Hídrica e Cidadania em Irauçuba”
          </blockquote>
          <p>
            Desenvolvido na área de <strong>Matemática e suas Tecnologias</strong> para a etapa estadual do Ceará Científico 2026, sob o tema estruturante <em>“Ciência, Cidadania e Convivência Democrática: o conhecimento a serviço da vida coletiva”</em>.
          </p>
          <p>
            O projeto propõe uma abordagem analítica e geométrica para quantificar o resgate de água no Açude Jerimum e transpõe esse equacionamento para um software educacional acessível à comunidade escolar e aos tomadores de decisão pública.
          </p>
        </article>

        <!-- 2. O PROBLEMA E A PROPOSTA -->
        <article class="sobre-card">
          <div class="sobre-card-header">
            <span class="step-tag">O Problema &amp; A Solução</span>
            <h2>A Crise da Evaporação no Núcleo de Desertificação de Irauçuba</h2>
          </div>
          <div class="grid grid-2">
            <div>
              <h3 class="sub-heading">Vulnerabilidade Territorial</h3>
              <p>
                Localizado no bioma Caatinga, o município de Irauçuba é oficialmente reconhecido como um dos núcleos mais graves de desertificação do Brasil. As secas prolongadas são agravadas por taxas de evaporação potencial anual de <strong>2.344,7 mm/ano</strong>, que esgotam silenciosamente reservatórios estratégicos.
              </p>
            </div>
            <div>
              <h3 class="sub-heading">A Intervenção com Coberturas Flutuantes</h3>
              <p>
                O uso de esferas de PEAD e placas prismáticas hexagonais atua como barreira física contra a radiação solar e anula a turbulência do vento na subcamada limite. O estudo investiga o balanço ideal entre a retenção hídrica máxima e a salvaguarda de oxigenação biológica.
              </p>
            </div>
          </div>
        </article>

        <!-- 3. COMO PESQUISAMOS (TIMELINE METODOLÓGICA) -->
        <article class="sobre-card">
          <div class="sobre-card-header">
            <span class="step-tag">Metodologia</span>
            <h2>Linha do Processo de Investigação Científica</h2>
          </div>

          <div class="methodology-timeline">
            <div class="timeline-step">
              <div class="step-circle">1</div>
              <div class="step-body">
                <h4>Levantamento Hidrometeorológico</h4>
                <p>Coleta de dados da COGERH, FUNCEME e INMET para o Açude Jerimum (capacidade de 18,75 hm³) e climatologia da bacia do Rio Curu.</p>
              </div>
            </div>

            <div class="timeline-step">
              <div class="step-circle">2</div>
              <div class="step-body">
                <h4>Modelagem Geométrica e Aerodinâmica</h4>
                <p>Dedução analítica da densidade de empacotamento em rede hexagonal rômbica (90,69%), cálculo de porosidade e análise da equação de Dalton.</p>
              </div>
            </div>

            <div class="timeline-step">
              <div class="step-circle">3</div>
              <div class="step-body">
                <h4>Desenvolvimento Computacional</h4>
                <p>Criação do motor algorítmico do Simulador Hídrico Cidadão, integrando visualização tridimensional e painéis de dados em tempo real.</p>
              </div>
            </div>

            <div class="timeline-step">
              <div class="step-circle">4</div>
              <div class="step-body">
                <h4>Análise Social e Convivência Democrática</h4>
                <p>Conversão dos volumes metros-cúbicos salvos em dias de consumo digno essencial (100 L/pessoa/dia), mensurando a segurança hídrica popular.</p>
              </div>
            </div>
          </div>
        </article>

        <!-- 4. O QUE O MODELO APRESENTA -->
        <article class="sobre-card">
          <div class="sobre-card-header">
            <span class="step-tag">Resultados Centrais</span>
            <h2>Grandezas e Resultados Modelados no Estudo</h2>
          </div>
          <div class="grid grid-3 key-facts-grid">
            <div class="fact-box">
              <span class="fact-label">Oclusão Analítica Esférica</span>
              <strong class="fact-number">90,69%</strong>
              <p>Constante matemática universal dada por π / (2√3).</p>
            </div>

            <div class="fact-box">
              <span class="fact-label">Porosidade de Salvaguarda</span>
              <strong class="fact-number">9,31%</strong>
              <p>Frestas contínuas que asseguram trocas gasosas vitais para a água.</p>
            </div>

            <div class="fact-box">
              <span class="fact-label">Redução da Evaporação</span>
              <strong class="fact-number">Até 74,86%</strong>
              <p>Eficiência com esferas balizada em ensaios experimentais da literatura.</p>
            </div>
          </div>
        </article>

        <!-- 5. DA MATEMÁTICA AO SIMULADOR -->
        <article class="sobre-card">
          <div class="sobre-card-header">
            <span class="step-tag">Educação e Tecnologia</span>
            <h2>Do Caderno de Campo ao Simulador Digital</h2>
          </div>
          <p>
            O desenvolvimento desta aplicação web cumpre um objetivo pedagógico central: <strong>desmistificar a matemática aplicada</strong>. Ao transformar equações abstratas de transferência de massa e geometria discreta em uma ferramenta visual interativa, o projeto capacita jovens do interior a participarem ativamente da gestão dos recursos hídricos do seu próprio território.
          </p>
        </article>

        <!-- 6. LIMITAÇÕES E CONTINUIDADE PLANEJADA -->
        <article class="sobre-card">
          <div class="sobre-card-header">
            <span class="step-tag">Fronteiras e Próximos Passos</span>
            <h2>Limitações da Modelagem e Continuidade Planejada</h2>
          </div>
          <p>
            O presente artigo consolidou as bases teóricas e a arquitetura algorítmica do modelo computacional. Para total fidelidade científica, destaca-se que:
          </p>
          <ul class="science-bullet-list">
            <li>
              <strong>Validação Empírica em Campo:</strong> Experimentos físicos em tanques reduzidos de evaporação (lisímetros) e o confronto com medições in situ constituem a <em>continuidade futura planejada</em> da pesquisa, não tendo sido realizados nesta etapa preliminar.
            </li>
            <li>
              <strong>Critérios de Viabilidade Econômica:</strong> O estudo modela a física da retenção de volume hídrico; o orçamento de implantação, durabilidade ultravioleta do PEAD e sistemas de ancoragem perimetral deverão ser investigados em fases de engenharia subsequentes.
            </li>
          </ul>
        </article>

        <!-- 7. EQUIPE DE PESQUISA -->
        <article class="sobre-card">
          <div class="sobre-card-header">
            <span class="step-tag">Autoria</span>
            <h2>Equipe Científica e Orientação</h2>
          </div>

          <div class="team-cards-grid">
            <div class="team-card">
              <div class="team-details">
                <h3>Ana Júlia Sousa Bastos</h3>
                <span class="team-role">Pesquisadora Estudantil</span>
                <p>Coautora da pesquisa e da modelagem de empacotamento geométrico.</p>
              </div>
            </div>

            <div class="team-card">
              <div class="team-details">
                <h3>Victor Hugo Silva Lopes</h3>
                <span class="team-role">Pesquisador Estudantil</span>
                <p>Coautor da pesquisa e do desenvolvimento da lógica computacional do simulador.</p>
              </div>
            </div>

            <div class="team-card">
              <div class="team-details">
                <h3>Prof. Fabrício Mota Gonçalves</h3>
                <span class="team-role">Professor Orientador</span>
                <p>Orientação científica e pedagógica no âmbito do Ceará Científico 2026.</p>
              </div>
            </div>
          </div>
        </article>

        <!-- 8. REFERÊNCIAS BIBLIOGRÁFICAS -->
        <article class="sobre-card">
          <div class="sobre-card-header">
            <span class="step-tag">Bibliografia</span>
            <h2>Referências Bibliográficas do Artigo</h2>
          </div>
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

  mount() {
    // Nada a montar dinamicamente
  },

  unmount() {
    // Nada a desmontar
  }
};
