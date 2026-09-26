/**
 * Simulador Hídrico Cidadão — Parâmetros Científicos e Constantes do Estudo
 *
 * Fonte primária: Artigo científico
 * "Modelagem Matemática de Coberturas Artificiais para Mitigação da Evaporação
 * no Açude Jerimum: Segurança Hídrica e Cidadania em Irauçuba"
 * Autores: Ana Júlia Sousa Bastos, Victor Hugo Silva Lopes
 * Professor Orientador: Fabrício Mota Gonçalves
 * Área: Matemática e suas Tecnologias — Ceará Científico 2026
 */

/**
 * Parâmetros adotados pelo artigo científico
 */
export const SCIENTIFIC_PARAMS = {
  // Empacotamento esférico hexagonal ideal (Kepler / Gauss)
  SPHERE_GEOMETRIC_COVERAGE: Math.PI / (2 * Math.sqrt(3)), // ≈ 0.90689968 (90,69%)
  SPHERE_POROSITY: 1 - Math.PI / (2 * Math.sqrt(3)),       // ≈ 0.09310032 (9,31%)
  SPHERE_EVAP_REDUCTION: 0.7486,                           // Até 74,86% (redução evaporativa adotada)

  // Cobertura por placas prismáticas hexagonais (HDFCs)
  HEX_GEOMETRIC_COVERAGE: 0.98,                            // 98% (coeficiente teórico de oclusão)
  HEX_POROSITY: 0.02,                                      // 2% (fração descoberta residual de tolerância)
  HEX_EVAP_REDUCTION: 0.8859,                              // Até 88,59% (redução evaporativa adotada)

  // Linha de base meteorológica citada no estudo (FUNCEME/INMET)
  ANNUAL_EVAPORATION_BASELINE_MM: 2344.7,                  // 2.344,7 mm/ano

  // Dados do Açude Jerimum (COGERH) apresentados no artigo
  JERIMUM_MAX_CAPACITY_HM3: 18.75,                         // 18,75 hm³ (capacidade máxima de acumulação)
  JERIMUM_DRAINAGE_AREA_KM2: 397.03,                       // 397,03 km² (área de drenagem da bacia — NÃO é espelho d'água!)
  JERIMUM_REPORTED_OPERATIONAL_VOLUME_HM3: 9.0,             // 9,0 hm³ (volume no cenário crítico analisado)
  JERIMUM_REPORTED_PRESERVATION_LITERS: 1.49e9,            // ~1,49 bilhão de litros/ano (resultado relatado)

  // Premissa social adotada no artigo
  DAILY_WATER_PER_PERSON_LITERS: 100,                      // 100 L/pessoa/dia (referencial básico de dignidade)
  DAYS_IN_YEAR: 365
};

/**
 * Definição dos tipos de cobertura suportados pelo simulador
 */
export const COVER_TYPES = {
  none: {
    id: "none",
    name: "Sem cobertura",
    shortName: "Sem cobertura",
    surfaceCoverage: 0,
    porosity: 1.0,
    evaporativeReduction: 0,
    description: "Espelho d'água livre, exposto diretamente à radiação solar e à turbulência do vento.",
    aerationQuality: "Alta",
    biologicalRisk: "Nenhum (aeração natural plena, porém vulnerável a perda hídrica severa)",
    color: "#f59e0b"
  },
  sphere: {
    id: "sphere",
    name: "Esferas de PEAD",
    shortName: "Esferas PEAD",
    surfaceCoverage: SCIENTIFIC_PARAMS.SPHERE_GEOMETRIC_COVERAGE,
    porosity: SCIENTIFIC_PARAMS.SPHERE_POROSITY,
    evaporativeReduction: SCIENTIFIC_PARAMS.SPHERE_EVAP_REDUCTION,
    description: "Esferas de polietileno de alta densidade em empacotamento hexagonal bidimensional.",
    aerationQuality: "Parcial / Contínua",
    biologicalRisk: "Baixo (a porosidade residual de 9,31% preserva a difusão gasosa e evita anoxia)",
    color: "#06b6d4"
  },
  hex: {
    id: "hex",
    name: "Cobertura hexagonal contínua",
    shortName: "Placas hexagonais",
    surfaceCoverage: SCIENTIFIC_PARAMS.HEX_GEOMETRIC_COVERAGE,
    porosity: SCIENTIFIC_PARAMS.HEX_POROSITY,
    evaporativeReduction: SCIENTIFIC_PARAMS.HEX_EVAP_REDUCTION,
    description: "Placas prismáticas hexagonais flutuantes com oclusão teórica de 98% e 2% de tolerância.",
    aerationQuality: "Baixa / Crítica",
    biologicalRisk: "Alto a médio/longo prazo (bloqueio severo da troca gasosa com risco de hipóxia e eutrofização)",
    color: "#10b981"
  }
};

/**
 * Valores padrão demonstrativos para a simulação interativa
 * Transparência: A área de 750.000 m² é um valor demonstrativo inicial configurável.
 * O artigo não especifica a curva cota-área-volume para derivar o espelho d'água
 * exato do cenário de 9,0 hm³.
 */
export const DEFAULT_SIMULATION_INPUTS = {
  areaM2: 750000,
  annualEvapMm: SCIENTIFIC_PARAMS.ANNUAL_EVAPORATION_BASELINE_MM,
  temperatureC: 30.0,
  windMS: 3.0,
  coverType: "sphere"
};

/**
 * Tabela de referências e origem de dados para exibição nas telas
 */
export const PARAMETER_PROVENANCE_TABLE = [
  {
    parameter: "Empacotamento hexagonal de esferas (cobertura)",
    value: "π / (2√3) ≈ 90,69%",
    nature: "Densidade geométrica analítica",
    origin: "Artigo da equipe (Resumo e Seção Materiais e Métodos) [2]"
  },
  {
    parameter: "Porosidade residual entre esferas",
    value: "1 − π / (2√3) ≈ 9,31%",
    nature: "Complemento geométrico analítico",
    origin: "Artigo da equipe (Resumo e Resultados) [2]"
  },
  {
    parameter: "Redução evaporativa das esferas de PEAD",
    value: "Até 74,86%",
    nature: "Parâmetro adotado de literatura empírica",
    origin: "Artigo da equipe (Materiais e métodos / Resultados) [3]"
  },
  {
    parameter: "Oclusão de placas prismáticas hexagonais",
    value: "98,00%",
    nature: "Coeficiente geométrico adotado",
    origin: "Artigo da equipe (Materiais e métodos / Resultados) [3]"
  },
  {
    parameter: "Fração descoberta de placas hexagonais",
    value: "2,00%",
    nature: "Complemento da oclusão adotada",
    origin: "Artigo da equipe (Materiais e métodos) [3]"
  },
  {
    parameter: "Redução evaporativa das placas hexagonais",
    value: "Até 88,59%",
    nature: "Parâmetro adotado de literatura empírica",
    origin: "Artigo da equipe (Resultados e Discussão) [3]"
  },
  {
    parameter: "Taxa média anual de evaporação potencial",
    value: "2.344,7 mm/ano",
    nature: "Referência histórica regional (FUNCEME/INMET)",
    origin: "Artigo da equipe (Materiais e métodos) [11]"
  },
  {
    parameter: "Capacidade máxima de acumulação do Jerimum",
    value: "18,75 hm³",
    nature: "Dado cadastral oficial outorgado (COGERH)",
    origin: "Artigo da equipe (Introdução / Materiais e Métodos) [5, 9]"
  },
  {
    parameter: "Área de drenagem da bacia de contribuição",
    value: "397,03 km²",
    nature: "Dado hidrográfico da bacia (não confundir com espelho d'água)",
    origin: "Artigo da equipe (Materiais e métodos) [9]"
  },
  {
    parameter: "Volume operacional no cenário crítico analisado",
    value: "9,0 hm³",
    nature: "Volume armazenado na seca (não é área)",
    origin: "Artigo da equipe (Resultados e Discussão)"
  },
  {
    parameter: "Preservação volumétrica anual relatada",
    value: "Aprox. 1,49 bilhão de litros/ano",
    nature: "Resultado modelado relatado no estudo",
    origin: "Artigo da equipe (Resultados e Discussão)"
  },
  {
    parameter: "Consumo humano para equivalência social",
    value: "100 L/pessoa/dia",
    nature: "Premissa adotada para dignidade básica",
    origin: "Artigo da equipe (Resultados e Discussão) [1]"
  }
];

/**
 * Referências bibliográficas oficiais transcritas estritamente do artigo científico
 */
export const BIBLIOGRAPHY = [
  {
    index: 1,
    citation: "CEARÁ. Secretaria da Educação do Estado do Ceará (SEDUC). Regulamento Ceará Científico 2026: Mais Solidário, Mais Cooperativo. Fortaleza: SEDUC, 2026."
  },
  {
    index: 2,
    citation: "COGERH. Ficha Técnica do Açude Jerimum e Diagnóstico da Região Hidrográfica do Curu. Fortaleza: Companhia de Gestão dos Recursos Hídricos, 2021."
  },
  {
    index: 3,
    citation: "FUNCEME. Evaporação e precipitação no Estado do Ceará: Dados e Série Histórica. Fortaleza: Fundação Cearense de Meteorologia e Recursos Hídricos, 2026."
  },
  {
    index: 4,
    citation: "HOUSTON-EDWARDS, K. To pack spheres tightly, mathematicians throw them at random. Quanta Magazine, Nova York, abr. 2024."
  },
  {
    index: 5,
    citation: "LI, C. et al. Evaporation suppression from open water surface using various floating covers with consideration of water ecology. Sustainability, v. 13, n. 20, p. 11234, 2021."
  },
  {
    index: 6,
    citation: "SHALABY, M. M. et al. Evaporation suppression and water conservation effects of hexagonal diamond-shaped floating covers. Water, v. 15, n. 6, p. 1047, 2023."
  },
  {
    index: 7,
    citation: "SILVA, F. G. C.; PACHECO, J. S. Processo de desertificação: estudo de caso em Irauçuba-CE. Revista Eletrônica Teccen, v. 9, n. 1, p. 47-51, 2016."
  }
];

/**
 * Nota técnica sobre o mapeamento de citações no texto do artigo
 */
export const CITATION_MAPPING_NOTE =
  "Nota de rigor documental: O corpo do artigo científico utiliza chamadas numéricas até [12], " +
  "enquanto a seção final de referências registra 7 obras formais. Para total integridade científica, " +
  "nenhuma referência foi inventada ou extrapolada além do documento oficial.";
