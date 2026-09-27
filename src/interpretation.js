import { SCIENTIFIC_PARAMS } from './constants.js';

// Contexto externo: estimativa populacional IBGE, referência 1º de julho de 2024.
export const IRAUCUBA = Object.freeze({ population: 24751, year: 2024,
  source: 'https://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2024/estimativa_dou_2024.pdf' });

export function interpretVolume(annualLiters, scale = 'annual', population = IRAUCUBA.population) {
  if (!Number.isFinite(annualLiters) || annualLiters < 0 || !Number.isFinite(population) || population <= 0)
    throw new RangeError('Volume e população inválidos');
  const divisor = { annual: 1, monthly: 12, daily: 365 }[scale];
  if (!divisor) throw new RangeError('Período inválido');
  const liters = annualLiters / divisor;
  const personDays = liters / SCIENTIFIC_PARAMS.DAILY_WATER_PER_PERSON_LITERS;
  return { liters, tanks: liters / 1000, personDays, peopleFor365Days: personDays / 365,
    populationDays: personDays / population };
}

export const environmentalContext = `
  <section class="research-section" aria-labelledby="environment-title">
    <p class="section-eyebrow">Contexto externo à modelagem original</p>
    <h2 id="environment-title">Por que não simplesmente cobrir 100% da água?</h2>
    <h3>Limite geométrico</h3>
    <p>Esferas em empacotamento ideal ocupam 90,69% da superfície, deixando 9,31% de interstícios. Para os hexágonos, o artigo adota oclusão teórica de 98%. Ocupação superficial e redução evaporativa são grandezas diferentes.</p>
    <h3>Considerações ambientais para uma aplicação real</h3>
    <p>Luz, trocas gasosas, temperatura, fotossíntese, organismos e qualidade da água precisam ser avaliados em campo. A existência de frestas não comprova, por si só, segurança ecológica. Experimentos com coberturas identificaram alterações na qualidade da água; esses resultados não são medições do Açude Jerimum.</p>
    <p>Vento, ondas, estabilidade, manutenção e operação também exigem avaliação específica. O simulador não calcula esses efeitos.</p>
    <p class="card-meta">Referências complementares: <a href="https://doi.org/10.1002/eco.2470" target="_blank" rel="noopener">Bakhtiar et al. — experimento sobre qualidade da água</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/34029812/" target="_blank" rel="noopener">Revisão sobre barreiras à evaporação (2021)</a>.</p>
  </section>`;
