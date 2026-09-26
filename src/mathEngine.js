/**
 * Simulador Hídrico Cidadão — Motor Matemático Unificado
 *
 * Responsável exclusivo por todas as operações volumétricas, geométricas
 * e de equivalência social da aplicação.
 *
 * Fórmulas volumétricas baseadas no balanço de lâmina anual:
 *   A = área do espelho d'água (m²)
 *   E = evaporação anual de referência (mm/ano)
 *   R = fração de redução evaporativa da cobertura adotada (adimensional)
 *
 *   V_sem = A × (E / 1000)                [m³/ano]
 *   V_preservado = V_sem × R             [m³/ano]
 *   V_com = V_sem − V_preservado         [m³/ano]
 *   Litros_preservados = V_preservado × 1000 [L/ano]
 *
 * Equivalência de consumo social adotada pelo estudo:
 *   Pessoas_equivalentes = Litros_preservados / (100 L/pessoa/dia × 365 dias)
 */

import { COVER_TYPES, SCIENTIFIC_PARAMS } from "./constants.js";

/**
 * Validação rigorosa das entradas do usuário
 * @param {Object} inputs
 * @returns {string[]} Lista de mensagens de erro amigáveis
 */
export function validateInputs({ areaM2, annualEvapMm, temperatureC, windMS, coverType }) {
  const errors = [];

  if (typeof areaM2 !== "number" || !Number.isFinite(areaM2) || areaM2 <= 0) {
    errors.push("A área do espelho d'água deve ser um número positivo maior que zero.");
  } else if (areaM2 > 100000000) {
    errors.push("A área informada excede o limite operacional do simulador (100 km²).");
  }

  if (typeof annualEvapMm !== "number" || !Number.isFinite(annualEvapMm) || annualEvapMm <= 0) {
    errors.push("A taxa de evaporação anual deve ser maior que zero.");
  } else if (annualEvapMm > 10000) {
    errors.push("A taxa de evaporação anual informada é fisicamente desproporcional (> 10.000 mm).");
  }

  if (typeof temperatureC !== "number" || !Number.isFinite(temperatureC) || temperatureC < -10 || temperatureC > 60) {
    errors.push("Temperatura média fora da faixa física plausível (-10 °C a 60 °C).");
  }

  if (typeof windMS !== "number" || !Number.isFinite(windMS) || windMS < 0 || windMS > 60) {
    errors.push("Velocidade do vento fora da faixa meteorológica plausível (0 a 60 m/s).");
  }

  if (!coverType || !COVER_TYPES[coverType]) {
    errors.push("Tipo de cobertura selecionado é inválido.");
  }

  return errors;
}

/**
 * Executa o cálculo da simulação volumétrica para um único cenário
 * @param {Object} rawInputs
 * @returns {Object} Resultado detalhado do cálculo ou falha com erros
 */
export function calculateSimulation(rawInputs) {
  const areaM2 = Number(rawInputs.areaM2);
  const annualEvapMm = Number(rawInputs.annualEvapMm);
  const temperatureC = Number(rawInputs.temperatureC);
  const windMS = Number(rawInputs.windMS);
  const coverType = rawInputs.coverType;

  const errors = validateInputs({ areaM2, annualEvapMm, temperatureC, windMS, coverType });

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      rawInputs
    };
  }

  const cover = COVER_TYPES[coverType];

  // 1. Evaporação volumétrica anual sem cobertura (V_sem)
  // Conversão de lâmina: 1 mm = 0,001 m de altura sobre a área A
  const evaporationWithoutCoverM3 = areaM2 * (annualEvapMm / 1000);

  // 2. Volume preservado (V_preservado) e volume evaporado residual (V_com)
  const reductionFraction = cover.evaporativeReduction;
  const preservedM3 = evaporationWithoutCoverM3 * reductionFraction;
  const evaporationWithCoverM3 = evaporationWithoutCoverM3 - preservedM3;

  // 3. Conversão para litros
  const litersSaved = preservedM3 * 1000;
  const litersEvaporatedWithoutCover = evaporationWithoutCoverM3 * 1000;
  const litersEvaporatedWithCover = evaporationWithCoverM3 * 1000;

  // 4. Equivalência social teórica estritamente baseada no artigo (100 L/pessoa/dia)
  const daysInYear = SCIENTIFIC_PARAMS.DAYS_IN_YEAR;
  const litersPerPersonPerDay = SCIENTIFIC_PARAMS.DAILY_WATER_PER_PERSON_LITERS;
  const equivalentPeopleSupportedYear = litersSaved / (litersPerPersonPerDay * daysInYear);

  // Médias diárias e mensais equivalentes derivadas do total anual
  const preservedM3PerDay = preservedM3 / daysInYear;
  const preservedM3PerMonth = preservedM3 / 12;
  const litersSavedPerDay = litersSaved / daysInYear;
  const litersSavedPerMonth = litersSaved / 12;

  return {
    valid: true,
    errors: [],
    inputs: {
      areaM2,
      annualEvapMm,
      temperatureC,
      windMS,
      coverType
    },
    cover: {
      id: cover.id,
      name: cover.name,
      shortName: cover.shortName,
      surfaceCoverage: cover.surfaceCoverage,
      porosity: cover.porosity,
      evaporativeReduction: cover.evaporativeReduction,
      description: cover.description,
      aerationQuality: cover.aerationQuality,
      biologicalRisk: cover.biologicalRisk,
      color: cover.color
    },
    metrics: {
      // Volumes anuais em m³
      evaporationWithoutCoverM3,
      evaporationWithCoverM3,
      preservedM3,

      // Volumes anuais em litros
      litersEvaporatedWithoutCover,
      litersEvaporatedWithCover,
      litersSaved,

      // Percentuais
      reductionFraction,
      surfaceCoverageFraction: cover.surfaceCoverage,
      porosityFraction: cover.porosity,

      // Derivações temporais lineares identificadas como médias anuais
      temporalAverages: {
        daily: {
          preservedM3: preservedM3PerDay,
          litersSaved: litersSavedPerDay
        },
        monthly: {
          preservedM3: preservedM3PerMonth,
          litersSaved: litersSavedPerMonth
        },
        annual: {
          preservedM3,
          litersSaved
        }
      },

      // Impacto social teórico baseado na premissa do estudo
      socialImpact: {
        equivalentPeopleSupportedYear,
        dailyLitersPerPersonPremise: litersPerPersonPerDay,
        annualLitersPerPerson: litersPerPersonPerDay * daysInYear
      }
    },
    meta: {
      noteClimate: "Neste modelo, o cálculo volumétrico utiliza a evaporação anual informada. Temperatura e vento contextualizam o cenário, mas não recalculam essa taxa automaticamente.",
      provenance: "Parâmetros adotados conforme artigo do Ceará Científico 2026."
    }
  };
}

/**
 * Realiza a comparação simultânea dos 3 cenários a partir das mesmas entradas
 * @param {Object} inputs
 * @returns {Object[]} Array de resultados para 'none', 'sphere' e 'hex'
 */
export function compareScenarios(inputs) {
  const scenarioIds = ["none", "sphere", "hex"];
  return scenarioIds.map((coverType) => calculateSimulation({ ...inputs, coverType }));
}

/**
 * Formatação numérica padronizada em pt-BR com notação compacta inteligente
 */
export function formatCompact(value, unit = "") {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const formatter = new Intl.NumberFormat("pt-BR", {
    notation: abs >= 1000000 ? "compact" : "standard",
    maximumFractionDigits: abs >= 1000000 ? 2 : abs >= 100 ? 0 : 1
  });
  const formatted = formatter.format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Formata um valor numérico por extenso / padrão pt-BR completo
 */
export function formatFullNumber(value, maxFractionDigits = 0) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: maxFractionDigits > 0 ? maxFractionDigits : 0
  }).format(value);
}

/**
 * Formata percentual com padrão pt-BR
 */
export function formatPercent(value, maxDigits = 2) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "0%";
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: maxDigits
  }).format(value);
}
