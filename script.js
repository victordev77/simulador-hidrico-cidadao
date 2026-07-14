import { calculateSimulation, scenarioComparison, formatCompact, formatPercent } from "./calculos.js";
import { drawBarChart, drawEfficiencyChart } from "./charts.js";
import { WaterScene } from "./threeScene.js";

const controls = {
  areaInput: document.querySelector("#areaInput"),
  evapRange: document.querySelector("#evapRange"),
  tempRange: document.querySelector("#tempRange"),
  windRange: document.querySelector("#windRange"),
  coverSelect: document.querySelector("#coverSelect"),
  evapOutput: document.querySelector("#evapOutput"),
  tempOutput: document.querySelector("#tempOutput"),
  windOutput: document.querySelector("#windOutput"),
  validationMessage: document.querySelector("#validationMessage")
};

const outputs = {
  scenarioLabel: document.querySelector("#currentScenarioLabel"),
  metricNoCover: document.querySelector("#metricNoCover"),
  metricWithCover: document.querySelector("#metricWithCover"),
  metricSaved: document.querySelector("#metricSaved"),
  metricReduction: document.querySelector("#metricReduction"),
  litersSaved: document.querySelector("#litersSaved"),
  familiesHelped: document.querySelector("#familiesHelped"),
  trucksReduced: document.querySelector("#trucksReduced"),
  securityIndex: document.querySelector("#securityIndex")
};

const canvas = document.querySelector("#waterScene");
const waterScene = new WaterScene(canvas);
const scrollButton = document.querySelector(".scroll-up");
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".main-nav");
const scenarioButtons = document.querySelectorAll(".scenario-button");

function readInputs() {
  return {
    areaM2: Number(controls.areaInput.value),
    annualEvapMm: Number(controls.evapRange.value),
    temperatureC: Number(controls.tempRange.value),
    windMS: Number(controls.windRange.value),
    coverType: controls.coverSelect.value
  };
}

function setScenario(coverType) {
  controls.coverSelect.value = coverType;
  waterScene.setScenario(coverType);
  scenarioButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === coverType);
  });
  updateSimulation();
}

function updateOutputs(result) {
  outputs.scenarioLabel.textContent = result.cover.label;
  outputs.metricNoCover.textContent = formatCompact(result.evaporationWithoutCoverM3, "m³/ano");
  outputs.metricWithCover.textContent = formatCompact(result.evaporationWithCoverM3, "m³/ano");
  outputs.metricSaved.textContent = formatCompact(result.preservedM3, "m³/ano");
  outputs.metricReduction.textContent = formatPercent(result.reductionFraction);
  outputs.litersSaved.textContent = formatCompact(result.litersSaved, "L");
  outputs.familiesHelped.textContent = formatCompact(result.familiesHelped);
  outputs.trucksReduced.textContent = formatCompact(result.trucksReduced);
  outputs.securityIndex.textContent = `${result.securityIndex.toFixed(1).replace(".", ",")}%`;
}

function updateCharts(inputs) {
  const comparisons = scenarioComparison(inputs);
  const evapRows = comparisons.map((item) => ({
    label: item.cover.label.replace("Cobertura ", "").replace(" PEAD", ""),
    value: item.evaporationWithCoverM3,
    color: item.cover.label === "Sem cobertura" ? "#ffca85" : item.cover.label.includes("Esferas") ? "#69f0ff" : "#9bf8c9"
  }));

  drawBarChart(document.querySelector("#evapChart"), evapRows, {
    formatValue: (value) => formatCompact(value, "m³")
  });

  drawEfficiencyChart(document.querySelector("#efficiencyChart"), [
    { label: "Sem cobertura", value: 0.01, color: "#ffca85" },
    { label: "Esferas", value: 74.86, color: "#69f0ff" },
    { label: "Hexagonal", value: 88.59, color: "#9bf8c9" }
  ]);
}

function updateSimulation() {
  controls.evapOutput.textContent = controls.evapRange.value;
  controls.tempOutput.textContent = Number(controls.tempRange.value).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  controls.windOutput.textContent = Number(controls.windRange.value).toLocaleString("pt-BR", { maximumFractionDigits: 1 });

  const inputs = readInputs();
  const result = calculateSimulation(inputs);

  if (!result.valid) {
    controls.validationMessage.textContent = result.errors.join(" ");
    return;
  }

  controls.validationMessage.textContent = `Potencial convectivo de Dalton: ${(result.daltonPotential * 100).toFixed(1).replace(".", ",")}%.`;
  updateOutputs(result);
  updateCharts(inputs);
}

function handleScroll() {
  const scrolled = window.scrollY > 80;
  header.classList.toggle("scrolled", scrolled);
  scrollButton.classList.toggle("visible", window.scrollY > 620);
}

function closeMobileNav() {
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => setScenario(button.dataset.scenario));
});

Object.values(controls).forEach((control) => {
  if (control && ["INPUT", "SELECT"].includes(control.tagName)) {
    control.addEventListener("input", () => {
      if (control === controls.coverSelect) {
        waterScene.setScenario(control.value);
        scenarioButtons.forEach((button) => button.classList.toggle("active", button.dataset.scenario === control.value));
      }
      updateSimulation();
    });
  }
});

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

scrollButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("resize", () => updateCharts(readInputs()));

updateSimulation();
handleScroll();