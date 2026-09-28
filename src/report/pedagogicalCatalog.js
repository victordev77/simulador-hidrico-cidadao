// Catálogo local conferido em 28/09/2026. Redação oficial e proposta autoral são campos distintos.
export const CATALOG_VERSION = '2026-09-28';
export const SOURCES = {
  spaece: { title: 'Matriz de Referência: Matemática | 3ª série do Ensino Médio', author: 'SPAECE / CAEd', url: 'https://avaliacaoemonitoramentoceara.caeddigital.net/resources/arquivos/matrizes/MT/EM_3.pdf', locator: 'p. 1', date: 'data editorial não indicada' },
  enem: { title: 'Matriz de Referência de Matemática e suas Tecnologias', author: 'Inep', url: 'https://www.gov.br/mme/pt-br/arquivos/do-23-09-2013-s3.pdf', locator: 'Diário Oficial da União, seção 3, 23 set. 2013, p. 81', date: '2013', portal: 'https://www.gov.br/inep/pt-br/centrais-de-conteudo/acervo-linha-editorial/publicacoes-institucionais/avaliacoes-e-exames-da-educacao-basica/matrizes-de-referencia-enem' },
};
export const COMPETENCIES = {
  1: 'Construir significados para os números naturais, inteiros, racionais e reais.',
  3: 'Construir noções de grandezas e medidas para a compreensão da realidade e a solução de problemas do cotidiano.',
  4: 'Construir noções de variação de grandezas para a compreensão da realidade e a solução de problemas do cotidiano.',
  6: 'Interpretar informações de natureza científica e social obtidas da leitura de gráficos e tabelas, realizando previsão de tendência, extrapolação, interpolação e interpretação.',
};
export const SKILLS = [
  { system: 'spaece', code: 'D16', official: 'Estabelecer relações entre representações fracionárias e decimais dos números racionais.', activities: [1], proposal: 'Relacionar a fração e o decimal do coeficiente de redução, interpretando também sua porcentagem.', production: 'Registro das três representações e explicação do coeficiente.' },
  { system: 'spaece', code: 'D64', official: 'Resolver problema utilizando as relações entre diferentes unidades de medidas de capacidade e de volume.', activities: [2], proposal: 'Converter o volume preservado de metros cúbicos para litros.', production: 'Conversão justificada com unidades.' },
  { system: 'spaece', code: 'D76', official: 'Associar informações apresentadas em listas e/ou tabelas aos gráficos que as representam, e vice-versa.', activities: [3], proposal: 'Associar cada linha da comparação à barra correspondente.', production: 'Correspondência tabela-gráfico e comparação quantitativa.' },
  { system: 'enem', code: 'H3', competency: 1, official: 'Resolver situação-problema envolvendo conhecimentos numéricos.', activities: [1,6], proposal: 'Resolver problemas com o coeficiente e a equivalência de consumo.', production: 'Procedimento numérico explicado.' },
  { system: 'enem', code: 'H4', competency: 1, official: 'Avaliar a razoabilidade de um resultado numérico na construção de argumentos sobre afirmações quantitativas.', activities: [5], proposal: 'Conferir se a conclusão respeita a magnitude e os limites dos resultados.', production: 'Conclusão quantitativa justificada.' },
  { system: 'enem', code: 'H10', competency: 3, official: 'Identificar relações entre grandezas e unidades de medida.', activities: [2], proposal: 'Distinguir área, lâmina de evaporação, volume e capacidade.', production: 'Explicação dimensional das conversões.' },
  { system: 'enem', code: 'H12', competency: 3, official: 'Resolver situação-problema que envolva medidas de grandezas.', activities: [2,6], proposal: 'Resolver a conversão volumétrica e interpretar a equivalência anual.', production: 'Cálculos acompanhados de unidades e período.' },
  { system: 'enem', code: 'H15', competency: 4, official: 'Identificar a relação de dependência entre grandezas.', activities: [4], proposal: 'Identificar a dependência do volume em relação à área, com as demais entradas fixas.', production: 'Previsão e descrição da dependência.' },
  { system: 'enem', code: 'H16', competency: 4, official: 'Resolver situação-problema envolvendo a variação de grandezas, direta ou inversamente proporcionais.', activities: [4], proposal: 'Comparar a execução com uma cópia didática de área duplicada.', production: 'Comparação que justifique a proporcionalidade direta.' },
  { system: 'enem', code: 'H24', competency: 6, official: 'Utilizar informações expressas em gráficos ou tabelas para fazer inferências.', activities: [3], proposal: 'Inferir a ordenação das perdas residuais para as mesmas entradas.', production: 'Inferência sustentada pela tabela e pelo gráfico.' },
  { system: 'enem', code: 'H25', competency: 6, official: 'Resolver problema com dados apresentados em tabelas ou gráficos.', activities: [3], proposal: 'Calcular a diferença entre dois resultados comparativos.', production: 'Diferença numérica com unidade.' },
  { system: 'enem', code: 'H26', competency: 6, official: 'Analisar informações expressas em gráficos ou tabelas como recurso para a construção de argumentos.', activities: [5,6], proposal: 'Usar a comparação e a equivalência de consumo para argumentar com ressalvas.', production: 'Argumento com evidências e pelo menos uma limitação.' },
];
export const skillLabel = s => s.system === 'spaece'
  ? `SPAECE · Matemática · 3ª série do Ensino Médio · ${s.code}`
  : `ENEM · Matemática e suas Tecnologias · Competência de área ${s.competency} · ${s.code}`;

export function renderPedagogicalTopics() {
  return `<article class="science-card" id="pedagogia"><h2>Tópicos Pedagógicos</h2>
    <p>O simulador permite explorar matematicamente um problema contextualizado. A proposta mobiliza números racionais, porcentagem, conversão de unidades, área, volume, proporcionalidade, relações entre grandezas, tabelas, gráficos, modelagem e argumentação baseada em dados.</p>
    <p><strong>Possibilidade de mobilização da habilidade:</strong> as relações abaixo são propostas pelos autores do projeto; não constituem avaliação de aprendizagem, parceria ou aprovação institucional.</p>
    ${['spaece','enem'].map(system=>`<details><summary>${system==='spaece'?'SPAECE — Matemática, 3ª série do Ensino Médio':'ENEM — Matemática e suas Tecnologias'}</summary>${SKILLS.filter(s=>s.system===system).map(s=>`<h3>${skillLabel(s)}</h3><p><strong>Redação oficial:</strong> <q>${s.official}</q> (${SOURCES[system].author}, ${SOURCES[system].locator}).</p><p><strong>Articulação pedagógica proposta:</strong> ${s.proposal}</p>`).join('')}<p><a href="${SOURCES[system].url}" target="_blank" rel="noopener">Consultar o documento oficial utilizado</a></p></details>`).join('')}
    <p>O relatório reúne seis atividades autorais, dados da execução e orientações ao professor. A aprendizagem deve ser acompanhada pelas respostas, explicações e produções dos estudantes.</p>
    <a class="btn btn-secondary" href="/ciencia/pedagogico">Gerar Relatório Pedagógico</a>
  </article>`;
}
