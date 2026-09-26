/**
 * Testes Matemáticos Obrigatórios — Simulador Hídrico Cidadão
 * Baseado na Seção 19 das instruções do projeto.
 */

import assert from "node:assert/strict";
import { calculateSimulation, compareScenarios, validateInputs } from "../src/mathEngine.js";
import { COVER_TYPES, SCIENTIFIC_PARAMS, DEFAULT_SIMULATION_INPUTS } from "../src/constants.js";

console.log("=== INICIANDO SUÍTE DE TESTES MATEMÁTICOS (SEÇÃO 19) ===");

// 1. CASO DE TESTE OBRIGATÓRIO (Seção 19)
console.log("\n[TESTE 1] Caso de teste normativo: Área = 10.000 m², Evaporação = 1.000 mm/ano");

const baseTestInputs = {
  areaM2: 10000,
  annualEvapMm: 1000,
  temperatureC: 30,
  windMS: 3,
  coverType: "none"
};

// Cenário 1: Sem cobertura
const resNone = calculateSimulation({ ...baseTestInputs, coverType: "none" });
assert.equal(resNone.valid, true, "Cenário sem cobertura deve ser válido");
assert.equal(resNone.metrics.evaporationWithoutCoverM3, 10000, "V_sem deve ser exatamente 10.000 m³/ano");
assert.equal(resNone.metrics.evaporationWithCoverM3, 10000, "V_com deve ser exatamente 10.000 m³/ano");
assert.equal(resNone.metrics.preservedM3, 0, "V_preservado deve ser exatamente 0 m³/ano");
assert.equal(resNone.metrics.reductionFraction, 0, "Redução deve ser exatamente 0");
console.log("  ✔ Sem cobertura: Sem=10.000 m³/ano | Com=10.000 m³/ano | Preservado=0 m³/ano (Exato)");

// Cenário 2: Esferas de PEAD (74,86%)
const resSphere = calculateSimulation({ ...baseTestInputs, coverType: "sphere" });
assert.equal(resSphere.valid, true, "Cenário esferas deve ser válido");
assert.equal(resSphere.metrics.evaporationWithoutCoverM3, 10000, "V_sem deve ser 10.000 m³/ano");
// 10000 * 0.7486 = 7486; 10000 - 7486 = 2514
assert.equal(Math.round(resSphere.metrics.evaporationWithCoverM3), 2514, "V_com deve ser 2.514 m³/ano");
assert.equal(Math.round(resSphere.metrics.preservedM3), 7486, "V_preservado deve ser 7.486 m³/ano");
assert.equal(resSphere.metrics.reductionFraction, 0.7486, "Fração de redução deve ser 0.7486");
console.log("  ✔ Esferas PEAD: Sem=10.000 m³/ano | Com=2.514 m³/ano | Preservado=7.486 m³/ano (Exato)");

// Cenário 3: Hexagonal contínua (88,59%)
const resHex = calculateSimulation({ ...baseTestInputs, coverType: "hex" });
assert.equal(resHex.valid, true, "Cenário hexagonal deve ser válido");
assert.equal(resHex.metrics.evaporationWithoutCoverM3, 10000, "V_sem deve ser 10.000 m³/ano");
// 10000 * 0.8859 = 8859; 10000 - 8859 = 1141
assert.equal(Math.round(resHex.metrics.evaporationWithCoverM3), 1141, "V_com deve ser 1.141 m³/ano");
assert.equal(Math.round(resHex.metrics.preservedM3), 8859, "V_preservado deve ser 8.859 m³/ano");
assert.equal(resHex.metrics.reductionFraction, 0.8859, "Fração de redução deve ser 0.8859");
console.log("  ✔ Hexagonal: Sem=10.000 m³/ano | Com=1.141 m³/ano | Preservado=8.859 m³/ano (Exato)");

// 2. INVARIANTES FÍSICOS E MATEMÁTICOS
console.log("\n[TESTE 2] Verificação de invariantes matemáticos");

const testCases = [
  { areaM2: 750000, annualEvapMm: 2344.7, temperatureC: 30, windMS: 3 },
  { areaM2: 125000, annualEvapMm: 1850.5, temperatureC: 22, windMS: 1.5 },
  { areaM2: 3500000, annualEvapMm: 3100.2, temperatureC: 38, windMS: 8.2 },
  { areaM2: 1, annualEvapMm: 0.1, temperatureC: -5, windMS: 0 },
  { areaM2: 50000000, annualEvapMm: 5000, temperatureC: 45, windMS: 25 }
];

const TOLERANCE = 1e-9;

for (const tc of testCases) {
  for (const coverType of ["none", "sphere", "hex"]) {
    const res = calculateSimulation({ ...tc, coverType });
    assert.equal(res.valid, true);

    const {
      evaporationWithoutCoverM3,
      evaporationWithCoverM3,
      preservedM3,
      litersSaved,
      reductionFraction
    } = res.metrics;

    // Invariante 1: V_sem = V_com + V_preservado
    const sum = evaporationWithCoverM3 + preservedM3;
    assert.ok(
      Math.abs(sum - evaporationWithoutCoverM3) < TOLERANCE * Math.max(1, evaporationWithoutCoverM3),
      `Invariante V_sem = V_com + V_preservado falhou para ${coverType}: ${sum} vs ${evaporationWithoutCoverM3}`
    );

    // Invariante 2: 0 <= V_preservado <= V_sem
    assert.ok(preservedM3 >= -TOLERANCE, `V_preservado negativo: ${preservedM3}`);
    assert.ok(preservedM3 <= evaporationWithoutCoverM3 + TOLERANCE, `V_preservado > V_sem: ${preservedM3} > ${evaporationWithoutCoverM3}`);

    // Invariante 3: 0 <= reducao <= 1
    assert.ok(reductionFraction >= 0 && reductionFraction <= 1, `Redução fora do intervalo [0, 1]: ${reductionFraction}`);

    // Invariante 4: litros = m³ × 1000
    assert.ok(
      Math.abs(litersSaved - preservedM3 * 1000) < TOLERANCE,
      `Conversão m³ para litros falhou: ${litersSaved} vs ${preservedM3 * 1000}`
    );
  }
}
console.log("  ✔ Invariantes físicos verificados com tolerância numérica de precisão dupla em todos os cenários.");

// 3. INVARIANTE GEOMÉTRICO: Cobertura + Fração Descoberta = 1
console.log("\n[TESTE 3] Invariante geométrico: Cobertura + Porosidade (Fração Descoberta) = 1");

for (const [key, cover] of Object.entries(COVER_TYPES)) {
  const sumCoverage = cover.surfaceCoverage + cover.porosity;
  assert.ok(
    Math.abs(sumCoverage - 1.0) < TOLERANCE,
    `Soma cobertura + porosidade para ${key} deve ser 1.0, obteve ${sumCoverage}`
  );
  console.log(`  ✔ ${cover.name}: Cobertura (${(cover.surfaceCoverage * 100).toFixed(4)}%) + Porosidade (${(cover.porosity * 100).toFixed(4)}%) = 100%`);
}

// 4. COMPARAÇÃO SIMULTÂNEA CONSISTENTE
console.log("\n[TESTE 4] Comparação automática dos 3 cenários a partir das mesmas entradas");
const comparison = compareScenarios(DEFAULT_SIMULATION_INPUTS ? { areaM2: 750000, annualEvapMm: 2344.7, temperatureC: 30, windMS: 3 } : baseTestInputs);
assert.equal(comparison.length, 3, "Deve retornar exatamente 3 cenários");
assert.equal(comparison[0].cover.id, "none");
assert.equal(comparison[1].cover.id, "sphere");
assert.equal(comparison[2].cover.id, "hex");

// Verifica que V_sem é estritamente idêntico entre os 3 cenários
const expectedVsem = comparison[0].metrics.evaporationWithoutCoverM3;
assert.equal(comparison[1].metrics.evaporationWithoutCoverM3, expectedVsem);
assert.equal(comparison[2].metrics.evaporationWithoutCoverM3, expectedVsem);
console.log(`  ✔ V_sem idêntico em todas as comparações simultâneas: ${expectedVsem.toLocaleString("pt-BR")} m³/ano`);

// 5. TRATAMENTO DE ENTRADAS INVÁLIDAS OU DE FRONTEIRA
console.log("\n[TESTE 5] Tratamento robusto de entradas inválidas");

const invalidCases = [
  { areaM2: 0, annualEvapMm: 1000, temperatureC: 25, windMS: 2, coverType: "sphere" },
  { areaM2: -500, annualEvapMm: 1000, temperatureC: 25, windMS: 2, coverType: "sphere" },
  { areaM2: NaN, annualEvapMm: 1000, temperatureC: 25, windMS: 2, coverType: "sphere" },
  { areaM2: 10000, annualEvapMm: -10, temperatureC: 25, windMS: 2, coverType: "sphere" },
  { areaM2: 10000, annualEvapMm: 0, temperatureC: 25, windMS: 2, coverType: "sphere" },
  { areaM2: 10000, annualEvapMm: 1000, temperatureC: 85, windMS: 2, coverType: "sphere" },
  { areaM2: 10000, annualEvapMm: 1000, temperatureC: 25, windMS: -5, coverType: "sphere" },
  { areaM2: 10000, annualEvapMm: 1000, temperatureC: 25, windMS: 2, coverType: "invalido" }
];

for (const inv of invalidCases) {
  const res = calculateSimulation(inv);
  assert.equal(res.valid, false, "Entrada inválida não deve ser válida");
  assert.ok(res.errors.length > 0, "Deve fornecer lista explicativa de erros");
  assert.equal(res.metrics, undefined, "Não deve produzir métricas numéricas fraudulentas em erro");
}
console.log("  ✔ Entradas com zero, negativas, NaN ou fora da física rejeitadas com mensagens claras.");

// 6. PRESERVAÇÃO E EQUIVALÊNCIA SOCIAL
console.log("\n[TESTE 6] Equivalência social (100 L/pessoa/dia)");
const resSocial = calculateSimulation({
  areaM2: 750000,
  annualEvapMm: 2344.7,
  temperatureC: 30,
  windMS: 3,
  coverType: "sphere"
});
// Litros preservados / (100 * 365)
const expectedPeople = resSocial.metrics.litersSaved / 36500;
assert.ok(Math.abs(resSocial.metrics.socialImpact.equivalentPeopleSupportedYear - expectedPeople) < 1e-6);
console.log(`  ✔ Equivalência social calculada corretamente: ${resSocial.metrics.socialImpact.equivalentPeopleSupportedYear.toFixed(0)} pessoas`);

console.log("\n=== TODOS OS TESTES MATEMÁTICOS PASSARAM COM SUCESSO! ===");
