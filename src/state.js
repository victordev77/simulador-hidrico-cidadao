/**
 * Simulador Hídrico Cidadão — Gerenciamento de Estado Centralizado
 *
 * Garante a separação estrita entre:
 * 1. Simulação interativa do visitante (editável)
 * 2. Cenário específico do Açude Jerimum relatado no artigo (imutável)
 * 3. Preferência de tema visual (Dark / Light)
 * 4. Preferência de qualidade gráfica 3D (Auto / Eco / Equilibrada / Alta)
 */

import { DEFAULT_SIMULATION_INPUTS, SCIENTIFIC_PARAMS } from "./constants.js";
import { calculateSimulation, compareScenarios } from "./mathEngine.js";

function defaultOrigins() {
  return Object.fromEntries(['areaM2', 'annualEvapMm', 'temperatureC', 'windMS'].map(key => [key, {
    value: DEFAULT_SIMULATION_INPUTS[key],
    description: key === 'annualEvapMm'
      ? 'Referência inicial adotada no artigo do projeto (2.344,7 mm/ano); fonte primária não conferida neste relatório.'
      : 'Valor demonstrativo inicial da aplicação; não constitui medição do Açude Jerimum.'
  }]));
}

class AppState {
  constructor() {
    // 1. Estado da simulação interativa do usuário
    this.simulation = {
      inputs: { ...DEFAULT_SIMULATION_INPUTS },
      result: calculateSimulation(DEFAULT_SIMULATION_INPUTS),
      comparisons: compareScenarios(DEFAULT_SIMULATION_INPUTS),
      draftInputs: { ...DEFAULT_SIMULATION_INPUTS },
      origins: defaultOrigins(),
      validationErrors: [],
      isDefault: true
    };

    // 2. Cenário oficial relatado no artigo científico para o Açude Jerimum
    // Isolado e protegido contra alterações do usuário
    const jerimumPreservedLiters = SCIENTIFIC_PARAMS.JERIMUM_REPORTED_PRESERVATION_LITERS;
    const jerimumPreservedM3 = jerimumPreservedLiters / 1000;
    const jerimumDays = SCIENTIFIC_PARAMS.DAYS_IN_YEAR;
    const jerimumPerPerson = SCIENTIFIC_PARAMS.DAILY_WATER_PER_PERSON_LITERS;
    const jerimumEquivalentPeople = jerimumPreservedLiters / (jerimumPerPerson * jerimumDays);

    this.studyScenario = {
      reservoirName: "Açude Jerimum",
      municipality: "Irauçuba - CE",
      basin: "Bacia Hidrográfica do Rio Curu",
      maxCapacityHm3: SCIENTIFIC_PARAMS.JERIMUM_MAX_CAPACITY_HM3,
      drainageAreaKm2: SCIENTIFIC_PARAMS.JERIMUM_DRAINAGE_AREA_KM2,
      operationalVolumeHm3: SCIENTIFIC_PARAMS.JERIMUM_REPORTED_OPERATIONAL_VOLUME_HM3,
      annualEvaporationMm: SCIENTIFIC_PARAMS.ANNUAL_EVAPORATION_BASELINE_MM,
      reportedPreservedLiters: jerimumPreservedLiters,
      reportedPreservedM3: jerimumPreservedM3,
      dailyPreservedLiters: jerimumPreservedLiters / jerimumDays,
      monthlyPreservedLiters: jerimumPreservedLiters / 12,
      dailyPreservedM3: jerimumPreservedM3 / jerimumDays,
      monthlyPreservedM3: jerimumPreservedM3 / 12,
      socialEquivalence: {
        dailyLitresPerPerson: jerimumPerPerson,
        equivalentPeople: jerimumEquivalentPeople // > 40.800 pessoas (artigo cita "mais de 40.000 vidas")
      },
      coverageTypeAdopted: "Esferas de PEAD (arranjo hexagonal)",
      geometricPacking: SCIENTIFIC_PARAMS.SPHERE_GEOMETRIC_COVERAGE,
      porosity: SCIENTIFIC_PARAMS.SPHERE_POROSITY,
      evaporativeReduction: SCIENTIFIC_PARAMS.SPHERE_EVAP_REDUCTION
    };

    // 3. Tema visual (Padrão: dark)
    const storedTheme = typeof window !== "undefined" ? localStorage.getItem("shc_theme") : null;
    this.theme = storedTheme === "light" ? "light" : "dark";

    // 4. Qualidade gráfica (Padrão: auto)
    const storedQuality = typeof window !== "undefined" ? localStorage.getItem("shc_graphics_quality") : null;
    this.graphicsQuality = ["auto", "eco", "balanced", "high"].includes(storedQuality) ? storedQuality : "auto";

    // 5. Modo de visualização 3D ('clean' = científica limpa; 'context' = contextualizada)
    this.sceneMode = "clean";
    this.reportMode = "free";

    // 6. Subscrições de eventos
    this.subscribers = new Map();
  }

  subscribe(topic, callback) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic).add(callback);
    return () => this.subscribers.get(topic).delete(callback);
  }

  notify(topic, data) {
    if (this.subscribers.has(topic)) {
      for (const callback of this.subscribers.get(topic)) {
        try {
          callback(data);
        } catch (e) {
          console.error(`Erro ao notificar subscriber de ${topic}:`, e);
        }
      }
    }
  }

  // Atualização das entradas da simulação interativa
  updateSimulationInputs(newInputs) {
    const merged = { ...(this.simulation.draftInputs || this.simulation.inputs), ...newInputs };
    this.simulation.draftInputs = merged;
    for (const key of ['areaM2', 'annualEvapMm', 'temperatureC', 'windMS']) {
      if (Object.hasOwn(newInputs, key)) this.simulation.origins[key] = {
        value: newInputs[key], description: 'Parâmetro de entrada informado na simulação.'
      };
    }
    const res = calculateSimulation(merged);
    this.simulation.validationErrors = res.errors;

    if (res.valid) {
      this.simulation.inputs = merged;
      this.simulation.result = res;
      this.simulation.comparisons = compareScenarios(merged);
      this.simulation.isDefault = false;
      this.notify("simulation", this.simulation);
    }
    return res;
  }

  // Restaura valores demonstrativos iniciais
  resetSimulationDefaults() {
    this.simulation.inputs = { ...DEFAULT_SIMULATION_INPUTS };
    this.simulation.draftInputs = { ...DEFAULT_SIMULATION_INPUTS };
    this.simulation.origins = defaultOrigins();
    this.simulation.validationErrors = [];
    this.simulation.result = calculateSimulation(this.simulation.inputs);
    this.simulation.comparisons = compareScenarios(this.simulation.inputs);
    this.simulation.isDefault = true;
    this.notify("simulation", this.simulation);
  }

  // Alterna o tema
  setTheme(theme) {
    if (theme !== "dark" && theme !== "light") return;
    this.theme = theme;
    if (typeof window !== "undefined") {
      localStorage.setItem("shc_theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
    this.notify("theme", this.theme);
  }

  toggleTheme() {
    this.setTheme(this.theme === "dark" ? "light" : "dark");
  }

  // Define a qualidade gráfica
  setGraphicsQuality(quality) {
    if (!["auto", "eco", "balanced", "high"].includes(quality)) return;
    this.graphicsQuality = quality;
    if (typeof window !== "undefined") {
      localStorage.setItem("shc_graphics_quality", quality);
    }
    this.notify("graphicsQuality", this.graphicsQuality);
  }

  // Define o modo de cena 3D ('clean' | 'context')
  setSceneMode(mode) {
    if (mode !== "clean" && mode !== "context") return;
    this.sceneMode = mode;
    this.notify("sceneMode", this.sceneMode);
  }
}

export const state = new AppState();
