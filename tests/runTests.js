/**
 * Simulador Hídrico Cidadão — Executor Unificado de Testes
 */

import { execSync } from "node:child_process";

console.log("=================================================");
console.log("   SIMULADOR HÍDRICO CIDADÃO — SUÍTE DE TESTES   ");
console.log("=================================================\n");

try {
  execSync("node tests/pedagogical.test.js", { stdio: "inherit" });
  execSync("node tests/report.test.js", { stdio: "inherit" });
  execSync("node tests/interpretation.test.js", { stdio: "inherit" });
  execSync("node tests/mathEngine.test.js", { stdio: "inherit" });
  console.log("\n-------------------------------------------------\n");
  execSync("node tests/integration.test.js", { stdio: "inherit" });
  console.log("\n=================================================");
  console.log("   TODAS AS VERIFICAÇÕES CONCLUÍDAS COM SUCESSO!  ");
  console.log("=================================================");
} catch (error) {
  console.error("Falha na execução dos testes:", error);
  process.exit(1);
}
