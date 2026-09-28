import { calculateSimulation, compareScenarios, validateInputs } from '../mathEngine.js';
import { SCIENTIFIC_PARAMS, COVER_TYPES } from '../constants.js';
import { interpretVolume } from '../interpretation.js';

export const APP_VERSION = '0.3.2';
export const ARTICLE_TITLE = 'Modelagem Matemática de Coberturas Artificiais para Mitigação da Evaporação no Açude Jerimum: Segurança Hídrica e Cidadania em Irauçuba';
export const COEFFICIENT_SOURCE = 'Parâmetro adotado no artigo do projeto; correspondência com a fonte primária não documentada neste relatório.';

export function freezeRecord(object) {
  Object.values(object).forEach(value => {
    if (value && typeof value === 'object') freezeRecord(value);
  });
  return Object.freeze(object);
}

export function checkBalance(results) {
  return results.map(result => {
    const m = result.metrics;
    const difference = Math.abs(m.evaporationWithoutCoverM3 - m.evaporationWithCoverM3 - m.preservedM3);
    const tolerance = Math.max(1e-9, Math.abs(m.evaporationWithoutCoverM3) * 1e-12);
    if (![m.evaporationWithoutCoverM3, m.evaporationWithCoverM3, m.preservedM3, m.litersSaved].every(Number.isFinite) || difference > tolerance)
      throw new Error('Inconsistência numérica nos resultados. A emissão foi impedida; revise o motor antes de gerar o relatório.');
    return { scenario: result.cover.id, difference, tolerance };
  });
}

export function captureReport(appState, now = new Date()) {
  const mode = appState.reportMode === 'study' ? 'study' : 'free';
  const common = {
    mode, version: APP_VERSION, generatedAt: now.toISOString(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    days: SCIENTIFIC_PARAMS.DAYS_IN_YEAR,
    dailyConsumption: SCIENTIFIC_PARAMS.DAILY_WATER_PER_PERSON_LITERS,
    coefficients: structuredClone(COVER_TYPES), coefficientSource: COEFFICIENT_SOURCE,
  };
  if (mode === 'study') {
    // The article does not specify the water-surface area. Never invert the model.
    const study = structuredClone(appState.studyScenario);
    return freezeRecord({ ...common, selectedCover: 'sphere', study, inputs: null,
      result: null, comparisons: [], checks: [], origins: {},
      equivalences: interpretVolume(study.reportedPreservedLiters) });
  }
  const inputs = structuredClone(appState.simulation.draftInputs || appState.simulation.inputs);
  const errors = validateInputs(inputs);
  if (errors.length) throw new Error(errors.join(' '));
  const result = calculateSimulation(inputs);
  const comparisons = compareScenarios(inputs);
  const checks = checkBalance(comparisons);
  const origins = {};
  for (const key of ['areaM2', 'annualEvapMm', 'temperatureC', 'windMS']) {
    const source = appState.simulation.origins?.[key];
    origins[key] = source && Object.is(source.value, inputs[key]) ? source.description : 'Origem documental não registrada nesta execução.';
  }
  return freezeRecord({ ...common, inputs, selectedCover: inputs.coverType,
    result: structuredClone(result), comparisons: structuredClone(comparisons), checks,
    origins, equivalences: interpretVolume(result.metrics.litersSaved) });
}
