/**
 * Testes de Integração e Verificação Estrutural — Simulador Hídrico Cidadão
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { SCIENTIFIC_PARAMS, COVER_TYPES, PARAMETER_PROVENANCE_TABLE, BIBLIOGRAPHY } from "../src/constants.js";
import { calculateSimulation, compareScenarios, validateInputs, formatCompact, formatPercent } from "../src/mathEngine.js";
import { homeView } from "../src/views/homeView.js";
import { simularView } from "../src/views/simularView.js";
import { dashboardView } from "../src/views/dashboardView.js";
import { cienciaView } from "../src/views/cienciaView.js";
import { pedagogicoView } from "../src/views/pedagogicoView.js";
import { memoriaView } from "../src/views/memoriaView.js";
import { sobreView } from "../src/views/sobreView.js";

console.log("=== INICIANDO TESTES DE INTEGRAÇÃO DO SISTEMA ===");

// 1. Verificação das constantes científicas
console.log("\n[1] Verificando constantes científicas:");
assert.equal(SCIENTIFIC_PARAMS.SPHERE_EVAP_REDUCTION, 0.7486);
assert.equal(SCIENTIFIC_PARAMS.HEX_EVAP_REDUCTION, 0.8859);
assert.equal(SCIENTIFIC_PARAMS.HEX_GEOMETRIC_COVERAGE, 0.98);
assert.equal(SCIENTIFIC_PARAMS.ANNUAL_EVAPORATION_BASELINE_MM, 2344.7);
assert.equal(SCIENTIFIC_PARAMS.DAILY_WATER_PER_PERSON_LITERS, 100);
console.log("  ✔ Constantes do artigo rigorosamente conferidas.");

// 2. Verificação de renderização de todas as 7 rotas
console.log("\n[2] Verificando renderização sem erros de todas as 7 rotas:");
const views = [
  { name: "/", view: homeView },
  { name: "/simular", view: simularView },
  { name: "/dashboard", view: dashboardView },
  { name: "/ciencia", view: cienciaView },
  { name: "/ciencia/memoria", view: memoriaView },
  { name: "/ciencia/pedagogico", view: pedagogicoView },
  { name: "/sobre", view: sobreView }
];

for (const { name, view } of views) {
  assert.ok(view.title, `Rota ${name} deve possuir título definido`);
  assert.ok(typeof view.render === "function", `Rota ${name} deve ter método render`);
  const html = view.render();
  assert.ok(typeof html === "string" && html.length > 50, `Render da rota ${name} produziu HTML válido`);
  console.log(`  ✔ Rota ${name} renderizada com sucesso (${html.length} caracteres HTML).`);
}

// 3. Verificação de que assets locais existem
console.log("\n[3] Verificando arquivos de assets e módulos locais:");
const filesToCheck = [
  "assets/logo-simulador-hidrico.jpg",
  "assets/logo-simulador-hidrico.svg",
  "assets/vendor/three.module.js",
  "sw.js",
  "vercel.json",
  "index.html",
  "style.css",
  "script.js",
  "calculos.js"
];

for (const relPath of filesToCheck) {
  const fullPath = path.resolve(relPath);
  assert.ok(fs.existsSync(fullPath), `Arquivo obrigatório ausente: ${relPath}`);
  const stats = fs.statSync(fullPath);
  assert.ok(stats.size > 0, `Arquivo vazio: ${relPath}`);
  console.log(`  ✔ ${relPath} presente (${(stats.size / 1024).toFixed(1)} KB).`);
}

// 4. Verificação de ausência de dependências CDN remotas nos scripts
console.log("\n[4] Auditando dependências remotas nos arquivos locais:");
const scriptsToCheck = [
  "src/scene3d.js",
  "src/mathEngine.js",
  "src/router.js",
  "src/state.js",
  "script.js",
  "sw.js"
];

for (const file of scriptsToCheck) {
  const content = fs.readFileSync(file, "utf-8");
  assert.ok(!content.includes("https://unpkg.com"), `${file} não deve conter unpkg.com remoto`);
  assert.ok(!content.includes("https://cdn.jsdelivr.net"), `${file} não deve conter cdn.jsdelivr.net remoto`);
  assert.ok(!content.includes("https://cdnjs.cloudflare.com"), `${file} não deve conter cdnjs remoto`);
}
console.log("  ✔ Nenhuma dependência remota externa encontrada nos scripts críticos. Totalmente offline.");

// 5. Verificação da integridade das 7 referências bibliográficas
console.log("\n[5] Verificando integridade das referências bibliográficas:");
assert.equal(BIBLIOGRAPHY.length, 7, "A lista oficial deve conter exatamente as 7 obras documentadas");
console.log("  ✔ Exatamente 7 referências transcritas sem invenções.");

// 6. Regressão visual: a água não pode intersectar o leito.
console.log("\n[6] Verificando separação física das superfícies originais:");
const THREE = await import("../assets/vendor/three.module.js");
const { Reservoir3DScene } = await import("../src/scene3d.js");
assert.equal((await import("../threeScene.js")).WaterScene, Reservoir3DScene);
const model = Object.create(Reservoir3DScene.prototype);
model.root = new THREE.Group();
model.createReservoir();
const basin = model.root.children.find(o => o.geometry?.type === "CylinderGeometry");
assert.ok(basin.position.y + basin.geometry.parameters.height / 2 < model.water.position.y - .05);
assert.ok(model.rippleLines.children.every(r => r.position.y > model.water.position.y + .02));
assert.equal(model.water.material.depthTest, true);
assert.equal(model.water.material.depthWrite, false);
console.log("  ✔ Água, bacia e anéis separados; teste de profundidade preservado.");
console.log("\n=== TODOS OS TESTES DE INTEGRAÇÃO PASSARAM! ===");
