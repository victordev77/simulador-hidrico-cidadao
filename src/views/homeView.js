/**
 * Simulador Hídrico Cidadão — Rota / (Início)
 *
 * Apresentação institucional, contextualização científica do problema no semiárido
 * e portas de entrada claras para simulação, dashboard e ciência.
 * NÃO inicializa Three.js para garantir carregamento instantâneo.
 */

export const homeView = {
  title: "Início — Simulador Hídrico Cidadão",

  render() {
    return `
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-copy">
            <span class="badge badge-accent">Ceará Científico 2026 • Matemática e suas Tecnologias</span>
            <h1 class="hero-title">Simulador Hídrico Cidadão</h1>
            <p class="hero-tagline">
              Modelagem matemática de Coberturas Artificiais para Mitigação da Evaporação no Açude Jerimum: Segurança Hídrica e Cidadania em Irauçuba.
            </p>
            <p class="hero-description">
              Explore cenários de redução das perdas por evaporação e compreenda o potencial de coberturas artificiais por meio da modelagem matemática.
            </p>
            <div class="hero-actions">
              <a href="/simular" class="btn btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Iniciar simulação
              </a>
              <a href="/sobre" class="btn btn-secondary">
                Conhecer a pesquisa
              </a>
            </div>
          </div>

          <div class="hero-graphic" aria-hidden="true">
            <div class="geometric-card">
              <div class="sphere-pack-visual">
                <div class="sphere-item s1"></div>
                <div class="sphere-item s2"></div>
                <div class="sphere-item s3"></div>
                <div class="sphere-item s4"></div>
                <div class="sphere-item s5"></div>
                <div class="sphere-item s6"></div>
                <div class="sphere-item s7 center"></div>
                <div class="pore-indicator">φ = 9,31%</div>
              </div>
              <div class="math-capsule">
                <code>η = π / (2√3) ≈ 90,69%</code>
                <span>Oclusão analítica ideal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section problem-context-section">
        <div class="section-header">
          <p class="section-eyebrow">Contexto territorial e hidrológico</p>
          <h2 class="section-title">O desafio da evaporação no semiárido cearense</h2>
          <p class="section-subtitle">
            No município de Irauçuba, polo de desertificação do Ceará, a perda de água por evaporação atmosférica supera criticamente os índices de chuva.
          </p>
        </div>

        <div class="grid grid-3">
          <article class="feature-card">
            <div class="card-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <h3>Pressão climática extrema</h3>
            <p>
              Com evaporação anual média de <strong>2.344,7 mm/ano</strong>, reservatórios abertos como o Açude Jerimum perdem milhares de metros cúbicos diariamente antes mesmo do uso humano.
            </p>
            <div class="card-meta">Referência FUNCEME/INMET citada no estudo</div>
          </article>

          <article class="feature-card">
            <div class="card-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path><path d="m14.83 14.83 4.24 4.24"></path><path d="m9.17 14.83-4.24 4.24"></path></svg>
            </div>
            <h3>Barreira física e aerodinâmica</h3>
            <p>
              A introdução de sólidos flutuantes (esferas de PEAD ou placas hexagonais) bloqueia a radiação incidente e atenua a tensão de varredura do vento na subcamada limite.
            </p>
            <div class="card-meta">Fundamentação na relação de Dalton</div>
          </article>

          <article class="feature-card">
            <div class="card-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3>Cidadania e segurança hídrica</h3>
            <p>
              Preservar água significa garantir o direito inalienável ao consumo básico digno de camponeses e sertanejos, reduzindo a dependência crítica de caminhões-pipa.
            </p>
            <div class="card-meta">Tema: Ciência, Cidadania e Convivência Democrática</div>
          </article>
        </div>
      </section>

      <section class="section pathways-section">
        <div class="section-header">
          <p class="section-eyebrow">Trilhas de exploração</p>
          <h2 class="section-title">Como explorar a pesquisa no simulador</h2>
        </div>

        <div class="grid grid-3">
          <div class="path-card">
            <div class="path-step">01</div>
            <h3>Simular e comparar</h3>
            <p>Ajuste área, evaporação e clima para observar o comportamento volumétrico e a visualização 3D nos três cenários de cobertura.</p>
            <a href="/simular" class="btn btn-outline">Abrir simulador interativo &rarr;</a>
          </div>

          <div class="path-card">
            <div class="path-step">02</div>
            <h3>Dashboard do Jerimum</h3>
            <p>Consulte a análise específica do Açude Jerimum apresentada no estudo, incluindo o cenário de 9,0 hm³ e a equivalência social de consumo.</p>
            <a href="/dashboard" class="btn btn-outline">Ver dados do estudo &rarr;</a>
          </div>

          <div class="path-card">
            <div class="path-step">03</div>
            <h3>Fundamentação e equações</h3>
            <p>Conheça a demonstração geométrica do empacotamento esférico, a equação de transferência de massa de Dalton e a memória de cálculo.</p>
            <a href="/ciencia" class="btn btn-outline">Explorar base matemática &rarr;</a>
          </div>
        </div>
      </section>
    `;
  },

  mount() {
    // Rota estática sem listeners que precisem de limpeza complexa
  },

  unmount() {
    // Nada a desmontar
  }
};
