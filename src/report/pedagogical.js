import { calculateSimulation } from '../mathEngine.js';
import { ARTICLE_TITLE } from './snapshot.js';
import { number, percent, name, table, row, escapeHtml, renderChart } from './render.js';
import { normalizeDocument } from './document.js';
import { SKILLS, SOURCES, COMPETENCIES, CATALOG_VERSION, skillLabel } from './pedagogicalCatalog.js';

const section = (id, title, content) => `<section class="sr-chapter"><h2 id="ped-${id}">${typeof id === 'number' ? id+' ' : ''}${title}</h2>${content}</section>`;
const p = text => `<p>${text}</p>`;
const noArea = 'A área superficial não está documentada. Não há cálculo volumétrico reproduzível nem se deve inferir a área pelo volume relatado.';

export function doubledAreaExperiment(record) {
  if (record.mode === 'study') return { result: null, reason: noArea };
  const inputs = { ...record.inputs, areaM2: record.inputs.areaM2 * 2 };
  const result = calculateSimulation(inputs);
  return result.valid ? { result, inputs } : { result: null, inputs, reason: 'A área duplicada ultrapassa o limite operacional de 100 km². Discuta a proporcionalidade simbolicamente; não foi calculado um resultado fora dos limites do motor.' };
}

function fraction(value) {
  // Representation of the adopted decimal coefficient, not a second physical model.
  let numerator = Math.round(value * 10000), denominator = 10000;
  const gcd = (a,b) => b ? gcd(b,a%b) : a;
  const divisor = gcd(numerator,denominator);
  return `${numerator/divisor}/${denominator/divisor}`;
}

export function buildActivities(r) {
  const study = r.mode === 'study';
  const m = r.result?.metrics;
  const reduction = r.coefficients[r.selectedCover].evaporativeReduction;
  const liters = study ? r.study.reportedPreservedLiters : m.litersSaved;
  const doubled = doubledAreaExperiment(r);
  const sphere = r.comparisons.find(c=>c.cover.id==='sphere')?.metrics;
  const hex = r.comparisons.find(c=>c.cover.id==='hex')?.metrics;
  return [
    { id: 1, title: 'Representações numéricas', objective: 'Relacionar porcentagem, decimal e fração e interpretar o coeficiente.',
      question: 'Escreva o coeficiente de redução nas três representações. Explique o significado da fração e por que ela não é a cobertura geométrica.',
      data: `${name(r.selectedCover)}: redução adotada de ${percent(reduction)}.`,
      production: 'Três representações equivalentes e uma explicação escrita.',
      answer: `${percent(reduction)} = ${number(reduction,4)} = ${fraction(reduction)}. É a fração adotada de redução da perda evaporativa de referência, não a fração da superfície ocupada. ${reduction===0?'Sem cobertura, as três representações correspondem a zero.':''}` },
    { id: 2, title: 'Grandezas e unidades', objective: 'Converter medidas e justificar a compatibilidade dimensional.',
      question: 'Converta a lâmina anual de milímetros para metros; explique a unidade obtida ao combiná-la com uma área em m². Converta o volume preservado de m³ para litros e justifique cada passo.',
      data: study ? `Lâmina relatada: ${number(r.study.annualEvaporationMm)} mm/ano. Volume preservado relatado: aproximadamente ${number(r.study.reportedPreservedM3)} m³/ano. ${noArea}` : `Área: ${number(r.inputs.areaM2)} m²; lâmina: ${number(r.inputs.annualEvapMm)} mm/ano; preservado: ${number(m.preservedM3)} m³/ano.`,
      production: 'Conversões anotadas e explicação de m² × m = m³.',
      answer: `1 mm = 0,001 m; 1 m³ = 1.000 L. A lâmina corresponde a ${number((study?r.study.annualEvaporationMm:r.inputs.annualEvapMm)/1000,4)} m/ano. O volume preservado ${study?'relatado':'calculado'} equivale a aproximadamente ${number(liters)} L/ano. ${study?noArea:'A área informada é superficial; não é a área total de um sólido.'}` },
    { id: 3, title: 'Tabela e gráfico', objective: 'Associar representações, comparar resultados e calcular diferenças.',
      question: study ? 'Associe os coeficientes da Tabela 1 às barras da Figura 1. Compare as reduções adotadas e calcule a diferença em pontos percentuais entre hexágonos e esferas. Explique por que não é possível comparar volumes calculados neste estudo.' : 'Associe cada cenário da Tabela 1 à barra da Figura 1. Identifique a menor perda residual. Calcule a diferença entre os volumes preservados pelos hexágonos e pelas esferas e interprete-a.',
      data: study ? 'Tabela 1 e Figura 1: somente coeficientes adotados; não são resultados volumétricos.' : 'Tabela 1 e Figura 1: resultados anuais com as mesmas entradas da execução.',
      production: 'Correspondência entre três linhas e três barras, diferença com unidade e interpretação.',
      answer: study ? `Sem cobertura: ${percent(r.coefficients.none.evaporativeReduction)}; esferas: ${percent(r.coefficients.sphere.evaporativeReduction)}; hexágonos: ${percent(r.coefficients.hex.evaporativeReduction)}. Diferença: ${number((r.coefficients.hex.evaporativeReduction-r.coefficients.sphere.evaporativeReduction)*100)} pontos percentuais. ${noArea}` : `Os hexágonos apresentam a menor perda residual estimada. A diferença de preservação entre hexágonos e esferas é aproximadamente ${number(hex.preservedM3-sphere.preservedM3)} m³/ano. A diferença resulta dos coeficientes adotados, não de medição experimental.` },
    { id: 4, title: 'Relação entre variáveis', objective: 'Prever e justificar a proporcionalidade entre área e volume.',
      question: 'Mantendo a evaporação e o coeficiente constantes, o que acontece com o volume calculado quando a área é duplicada? Registre sua previsão antes de consultar a comparação didática.',
      data: study ? noArea : `Área original: ${number(r.inputs.areaM2)} m²; área duplicada para exploração: ${number(r.inputs.areaM2*2)} m². A execução original permanece intacta.`,
      production: 'Previsão e justificativa com as grandezas mantidas constantes.',
      answer: doubled.result ? `Na cópia didática, o motor retorna referência de ${number(doubled.result.metrics.evaporationWithoutCoverM3)} m³/ano, preservação de ${number(doubled.result.metrics.preservedM3)} m³/ano e residual de ${number(doubled.result.metrics.evaporationWithCoverM3)} m³/ano. Os volumes duplicam. ${reduction===0?'A preservação continua zero: duplicar zero não cria economia.':''}` : `${doubled.reason} No modelo, duplicar a área duplica os volumes quando a lâmina e o coeficiente permanecem fixos; preservação nula permanece nula.` },
    { id: 5, title: 'Argumentação com dados', objective: 'Comparar alternativas e avaliar a razoabilidade de uma conclusão.',
      question: 'Escreva uma conclusão com pelo menos dois valores da Tabela 1 ou da Figura 1. Explique se é razoável afirmar que a alternativa de menor evaporação é necessariamente a melhor solução. Reconheça pelo menos uma limitação.',
      data: study ? 'Comparação dos coeficientes adotados, sem volumes calculados.' : 'Resultados comparativos da execução atual.',
      production: 'Parágrafo com dados, justificativa e ressalva.',
      answer: `Uma conclusão pode comparar ${percent(r.coefficients.sphere.evaporativeReduction)} e ${percent(r.coefficients.hex.evaporativeReduction)} de redução adotada${study?'':`, com preservações estimadas de ${number(sphere.preservedM3)} e ${number(hex.preservedM3)} m³/ano`}. Esses números não determinam custos, viabilidade ambiental, manutenção ou segurança ecológica. Uma conclusão que promete implantação adequada apenas com esses valores não é sustentada.` },
    { id: 6, title: 'Interpretação social', objective: 'Interpretar uma equivalência de consumo, seu período e seus limites.',
      question: 'Usando o volume preservado e a premissa diária, calcule a população equivalente no período indicado. Utilize também a comparação da Tabela 1 para justificar por que essa equivalência não garante abastecimento real.',
      data: `${number(liters)} L/ano ${study?'relatados no artigo':'calculados'}; ${r.dailyConsumption} L por habitante por dia; ${r.days} dias.`,
      production: 'Cálculo, indicação do período e argumento sobre a limitação.',
      answer: `${number(liters)} ÷ (${r.dailyConsumption} × ${r.days}) ≈ ${number(r.equivalences.peopleFor365Days,0)} pessoas durante ${r.days} dias. Equivalência populacional ≠ abastecimento efetivamente garantido. Tratamento, distribuição, perdas e outros usos não são calculados. ${liters===0?'Nesta execução, a equivalência de preservação é zero.':''}` },
  ];
}

function skillMatrix(system) {
  const source = SOURCES[system];
  return `<p>${system==='spaece'?'Sistema Permanente de Avaliação da Educação Básica do Ceará (SPAECE): Matemática, 3ª série do Ensino Médio.':'Exame Nacional do Ensino Médio (ENEM): Matemática e suas Tecnologias. Não se propõe equivalência direta entre habilidades das duas matrizes.'}</p>
    ${system==='enem'?Object.entries(COMPETENCIES).map(([id,text])=>p(`<strong>Competência de área ${id} — redação oficial:</strong> <q>${text}</q> (Inep, 2013, p. 81).`)).join(''):''}
    <p>O Quadro ${system==='spaece'?1:2} separa a redação oficial da articulação proposta pelos autores.</p>
    ${table(`Quadro ${system==='spaece'?1:2} – Habilidades e articulações pedagógicas propostas`, ['Identificação e redação oficial','Atividade e articulação autoral','Produção esperada'], SKILLS.filter(s=>s.system===system).map(s=>row([`<strong>${skillLabel(s)}</strong><br><q>${s.official}</q><br>(${source.author}, ${source.locator}).`,`Atividade(s) ${s.activities.join(', ')}. ${s.proposal}`,s.production]))).replace('<table>','<table class="sr-quadro">')}
    <p class="sr-note">Fonte: Elaborado pelos autores (${CATALOG_VERSION.slice(0,4)}). Redações transcritas da matriz oficial (${source.author}, ${source.locator}); atividades, articulações e produções esperadas são autorais.</p>`;
}

export function renderPedagogicalReport(r) {
  const study = r.mode==='study', m = r.result?.metrics;
  const issued = new Date(r.generatedAt).toLocaleString('pt-BR',{timeZone:r.timeZone,dateStyle:'long',timeStyle:'medium'});
  const activities = buildActivities(r);
  const comparison = study
    ? table('Tabela 1 – Coeficientes adotados; não são volumes calculados', ['Cenário','Redução adotada'],['none','sphere','hex'].map(id=>row([name(id),percent(r.coefficients[id].evaporativeReduction)])))
    : table('Tabela 1 – Resultados anuais comparativos da execução', ['Cenário','Redução','Referência (m³/ano)','Preservado (m³/ano)','Residual (m³/ano)'],r.comparisons.map(c=>row([name(c.cover.id),percent(c.metrics.reductionFraction),number(c.metrics.evaporationWithoutCoverM3),number(c.metrics.preservedM3),number(c.metrics.evaporationWithCoverM3)])));
  const html = `<article class="scientific-report pedagogical-report" aria-label="Relatório Pedagógico da Simulação">
    <header class="sr-cover"><img src="/assets/logo-simulador-hidrico.svg" alt="Logo do Simulador Hídrico Cidadão" width="76" height="90"><p class="sr-institution">Simulador Hídrico Cidadão</p><h1>RELATÓRIO PEDAGÓGICO<br>DA SIMULAÇÃO</h1><p class="sr-subtitle">Articulação entre modelagem matemática, interpretação de resultados e referenciais do SPAECE e do ENEM</p><div class="sr-authors"><p>Ana Julia Sousa Bastos<br>Victor Hugo Silva Lopes</p><p>Orientação: Fabrício Mota Gonçalves</p></div><p>Ceará Científico 2026<br>Matemática e suas Tecnologias<br>Irauçuba — Ceará</p><p class="sr-issued">Emissão: ${escapeHtml(issued)}<br>Fuso: ${escapeHtml(r.timeZone)} · Aplicação v${r.version}<br>${study?'Estudo de caso documental':'Simulação livre'} · ${name(r.selectedCover)}</p><p class="sr-purpose">Possibilidades de utilização pedagógica de um registro da aplicação. Não constitui avaliação de aprendizagem nem aprovação institucional das atividades.</p></header>
    ${section(1,'Caracterização da proposta',p('Este documento apresenta possibilidades de utilização pedagógica da simulação. A aprendizagem deve ser acompanhada por meio das respostas, explicações e produções dos estudantes.')+p('O professor pode explorar modelagem e interpretação quantitativa de um problema contextualizado. As seis atividades são autorais; não são questões oficiais do SPAECE ou do ENEM. O catálogo local foi conferido em 28 de setembro de 2026. Não há geração de notas, diagnósticos ou estimativas de desempenho em exames.'))}
    ${section(2,'Síntese da execução',p(study?`Estudo documental do Açude Jerimum: aproximadamente ${number(r.study.reportedPreservedLiters)} L/ano preservados, conforme resultado relatado no artigo do projeto. ${noArea}`:`Simulação livre: área ${number(r.inputs.areaM2)} m², lâmina anual ${number(r.inputs.annualEvapMm)} mm/ano, cenário ${name(r.selectedCover)} e redução adotada ${percent(m.reductionFraction)}. Preservação calculada: ${number(m.preservedM3)} m³/ano (${number(m.litersSaved)} L/ano). Estes valores não são apresentados como medições do Açude Jerimum.`)+p(study?'A Tabela 1 e a Figura 1 apresentam apenas os coeficientes do projeto; as atividades volumétricas são adaptadas à lacuna documental.':`Origem da área: ${escapeHtml(r.origins.areaM2)} Origem da lâmina: ${escapeHtml(r.origins.annualEvapMm)} A Tabela 1 e a Figura 1 utilizam as mesmas entradas.`)+comparison+p(`Fonte: Elaborado pelos autores a partir ${study?'dos coeficientes adotados no artigo':'dos resultados da simulação'} (${new Date(r.generatedAt).getFullYear()}).`)+renderChart(r)+p('Temperatura e vento não alteram automaticamente a lâmina anual nesta implementação. O relatório utiliza um registro estável e não altera a simulação.'))}
    ${section(3,'Objetivos e conteúdos matemáticos',p('Converter unidades; representar números racionais; calcular diferenças; interpretar e comparar tabelas e gráficos; relacionar grandezas; justificar procedimentos; argumentar com dados e reconhecer limitações.')+p('Conteúdos: porcentagem, decimal e fração, medidas de área e volume, capacidade, proporcionalidade direta, leitura de dados e modelagem matemática. A área é uma entrada do modelo; não se pressupõe cálculo de área total ou volume geométrico do reservatório.'))}
    ${section(4,'Articulação com SPAECE',skillMatrix('spaece'))}
    ${section(5,'Articulação com ENEM',skillMatrix('enem'))}
    ${section(6,'Sequência de exploração pedagógica',activities.map(a=>`<div class="ped-activity"><h3 id="ped-activity-${a.id}">6.${a.id} Atividade ${a.id} – ${a.title}</h3><p><strong>Objetivo:</strong> ${a.objective}</p><p><strong>Enunciado:</strong> ${a.question}</p><p><strong>Dados:</strong> ${a.data}</p><p><strong>Habilidades relacionadas:</strong> ${SKILLS.filter(s=>s.activities.includes(a.id)).map(skillLabel).join('; ')}.</p><p><strong>Produção esperada:</strong> ${a.production}</p></div>`).join(''))}
    ${section(7,'Orientações ao professor',p('<strong>Antes:</strong> solicitar previsão e justificativa. <strong>Durante:</strong> conferir unidades, procedimentos e leitura da comparação. <strong>Depois:</strong> solicitar conclusão com evidências e limitações.')+p('Observar qualitativamente coerência matemática, uso de unidades, leitura da tabela e do gráfico, explicação do procedimento e reconhecimento dos limites. Respostas numéricas isoladas não demonstram domínio de uma habilidade.')+activities.map(a=>`<div class="ped-answer"><h3 id="ped-answer-${a.id}">7.${a.id} Resposta esperada – atividade ${a.id}</h3>${p(a.answer)}</div>`).join('')+p('Números exibidos são arredondados a partir dos resultados completos. Pequenas diferenças na última casa podem ocorrer ao calcular usando somente os valores impressos. Não interpretar casas decimais como precisão experimental.'))}
    ${section(8,'Interdisciplinaridade, limitações e considerações finais',p('Ambiente, tecnologia e cidadania oferecem contexto para discutir decisões coletivas, consumo e qualidade da evidência, sem acrescentar novos vínculos curriculares ou afirmações ambientais.')+'<ul><li>Cobertura geométrica ≠ redução evaporativa.</li><li>Resultado calculado ≠ medição experimental.</li><li>Visualização 3D ≠ simulação fluidodinâmica quantitativa.</li><li>Equivalência populacional ≠ garantia de abastecimento.</li><li>Consistência algébrica ≠ validação experimental.</li></ul>'+p('O menor volume residual não determina automaticamente viabilidade ambiental, econômica ou operacional. As atividades permitem explorar os dados e seus limites; a aprendizagem requer acompanhamento das produções dos estudantes.'))}
    ${section('references','Referências e origem dos dados',`<h3>Referenciais educacionais</h3><div class="sr-references">${Object.values(SOURCES).sort((a,b)=>a.author.localeCompare(b.author)).map(s=>p(`${s.author}. <em>${s.title}</em>. ${s.date}. ${s.locator}. Disponível em: <a href="${s.url}">${s.url}</a>. Acesso em: 28 set. 2026.`)).join('')}${p(`O endereço de download indicado no <a href="${SOURCES.enem.portal}">portal do Inep</a> não respondeu durante a conferência. As redações foram conferidas na publicação oficial identificada acima, e corroboradas pelos trechos indexados dos documentos do Inep. Não se presume nova redação a partir da data do portal.`)}</div><h3>Referência científica</h3>${p(`BASTOS, Ana Julia Sousa; LOPES, Victor Hugo Silva. <em>${ARTICLE_TITLE}</em>. Pesquisa do projeto, Ceará Científico 2026. Orientação: Fabrício Mota Gonçalves. Identificação conforme materiais locais; artigo integral e paginação não incorporados à aplicação.`)}<h3>Origem computacional dos dados</h3>${p(`Simulador Hídrico Cidadão v${r.version}. Registro emitido em ${escapeHtml(issued)} (${escapeHtml(r.timeZone)}). Motor matemático existente, constantes locais e entradas da execução. Catálogo pedagógico local: ${CATALOG_VERSION}. Cálculos físicos não são definidos pelas matrizes educacionais.`)}`)}
  </article>`;
  return normalizeDocument(html,r,true);
}
