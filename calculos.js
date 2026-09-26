/**
 * Simulador Hídrico Cidadão — Módulo de Cálculos (Ponto de compatibilidade e integração)
 *
 * Reexporta os cálculos oficiais a partir do motor matemático unificado (src/mathEngine.js)
 * e das constantes científicas (src/constants.js).
 */

export {
  SCIENTIFIC_PARAMS,
  COVER_TYPES,
  DEFAULT_SIMULATION_INPUTS,
  PARAMETER_PROVENANCE_TABLE,
  BIBLIOGRAPHY,
  CITATION_MAPPING_NOTE
} from "./src/constants.js";

export {
  validateInputs,
  calculateSimulation,
  compareScenarios,
  formatCompact,
  formatFullNumber,
  formatPercent
} from "./src/mathEngine.js";