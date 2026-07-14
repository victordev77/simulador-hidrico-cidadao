export const COVER_TYPES = {
  none: {
    label: "Sem cobertura",
    surfaceCoverage: 0,
    porosity: 1,
    evaporativeEfficiency: 0
  },
  sphere: {
    label: "Esferas PEAD",
    surfaceCoverage: Math.PI / (2 * Math.sqrt(3)),
    porosity: 1 - Math.PI / (2 * Math.sqrt(3)),
    evaporativeEfficiency: 0.7486
  },
  hex: {
    label: "Cobertura hexagonal contínua",
    surfaceCoverage: 1,
    porosity: 0,
    evaporativeEfficiency: 0.8859
  }
};

const LITERS_PER_FAMILY_PER_DAY = 440;
const WATER_TRUCK_LITERS = 8000;
const DAYS_PER_YEAR = 365;

export function clampNumber(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.min(Math.max(numeric, min), max);
}

export function validateInputs({ areaM2, annualEvapMm, temperatureC, windMS, coverType }) {
  const errors = [];

  if (!Number.isFinite(areaM2) || areaM2 <= 0) errors.push("A área precisa ser maior que zero.");
  if (!Number.isFinite(annualEvapMm) || annualEvapMm <= 0) errors.push("A evaporação anual precisa ser maior que zero.");
  if (!Number.isFinite(temperatureC) || temperatureC < -10 || temperatureC > 60) errors.push("Temperatura fora de uma faixa física plausível.");
  if (!Number.isFinite(windMS) || windMS < 0 || windMS > 60) errors.push("Velocidade do vento fora de uma faixa física plausível.");
  if (!COVER_TYPES[coverType]) errors.push("Tipo de cobertura inválido.");

  return errors;
}

export function calculateSimulation(inputs) {
  const areaM2 = Number(inputs.areaM2);
  const annualEvapMm = Number(inputs.annualEvapMm);
  const temperatureC = Number(inputs.temperatureC);
  const windMS = Number(inputs.windMS);
  const coverType = inputs.coverType;
  const errors = validateInputs({ areaM2, annualEvapMm, temperatureC, windMS, coverType });

  if (errors.length) {
    return { valid: false, errors };
  }

  const cover = COVER_TYPES[coverType];

  /*
   * Conversão hidrológica direta:
   * 1 mm de lâmina evaporada em 1 m² equivale a 0,001 m³.
   * V_sem = área do espelho d'água · lâmina anual de evaporação.
   */
  const evaporationWithoutCoverM3 = areaM2 * (annualEvapMm / 1000);

  /*
   * Eficiências adotadas do artigo:
   * - esferas em empacotamento hexagonal: até 74,86% de redução evaporativa;
   * - cobertura hexagonal contínua: até 88,59% de redução evaporativa.
   * A taxa anual informada já representa o regime climático integrado do reservatório.
   */
  const reductionFraction = cover.evaporativeEfficiency;
  const preservedM3 = evaporationWithoutCoverM3 * reductionFraction;
  const evaporationWithCoverM3 = evaporationWithoutCoverM3 - preservedM3;

  /*
   * Índice qualitativo de potencial convectivo baseado na relação de Dalton:
   * E é proporcional ao déficit de vapor e a uma função crescente do vento.
   * O simulador não recalibra a evaporação anual sem umidade relativa medida;
   * ele expõe o fator como leitura ambiental normalizada para fins educativos.
   */
  const thermalIndex = clampNumber((temperatureC - 18) / (45 - 18), 0, 1);
  const windIndex = clampNumber(windMS / 12, 0, 1);
  const daltonPotential = clampNumber((thermalIndex * 0.48) + (windIndex * 0.52), 0, 1);

  const litersSaved = preservedM3 * 1000;
  const familiesHelped = litersSaved / (LITERS_PER_FAMILY_PER_DAY * DAYS_PER_YEAR);
  const trucksReduced = litersSaved / WATER_TRUCK_LITERS;
  const securityIndex = clampNumber(reductionFraction * 100, 0, 100);

  return {
    valid: true,
    errors: [],
    cover,
    areaM2,
    annualEvapMm,
    temperatureC,
    windMS,
    evaporationWithoutCoverM3,
    evaporationWithCoverM3,
    preservedM3,
    reductionFraction,
    surfaceCoverage: cover.surfaceCoverage,
    porosity: cover.porosity,
    daltonPotential,
    litersSaved,
    familiesHelped,
    trucksReduced,
    securityIndex
  };
}

export function scenarioComparison(inputs) {
  return ["none", "sphere", "hex"].map((coverType) => calculateSimulation({ ...inputs, coverType }));
}

export function formatCompact(value, unit = "") {
  const formatter = new Intl.NumberFormat("pt-BR", {
    notation: Math.abs(value) >= 1000000 ? "compact" : "standard",
    maximumFractionDigits: Math.abs(value) >= 1000000 ? 2 : 0
  });
  return `${formatter.format(value)}${unit ? ` ${unit}` : ""}`;
}

export function formatPercent(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 2
  }).format(value);
}