import assert from 'node:assert/strict';
import { state } from '../src/state.js';
import { captureReport, checkBalance } from '../src/report/snapshot.js';
import { renderReport, renderChart, number } from '../src/report/render.js';

state.resetSimulationDefaults();
state.reportMode = 'free';
state.updateSimulationInputs({ areaM2: 750000, annualEvapMm: 3230.8, temperatureC: 30, windMS: 3, coverType: 'sphere' });
const record = captureReport(state, new Date('2026-09-27T12:00:00Z'));
const expected = [[0,2423100],[1813932.66,609167.34],[2146624.29,276475.71]];
record.comparisons.forEach((result,index) => {
  assert.ok(Math.abs(result.metrics.evaporationWithoutCoverM3 - 2423100) < 1e-6);
  assert.ok(Math.abs(result.metrics.preservedM3 - expected[index][0]) < 1e-6);
  assert.ok(Math.abs(result.metrics.evaporationWithCoverM3 - expected[index][1]) < 1e-6);
  assert.ok(renderChart(record).includes(`data-value="${result.metrics.evaporationWithCoverM3}"`));
});
assert.ok(Math.abs(record.result.metrics.litersSaved - 1813932660) < .001);
assert.equal(Math.round(record.equivalences.peopleFor365Days),49697);
assert.match(record.origins.annualEvapMm,/informado na simulação/);
assert.match(renderReport(record),/1\.813\.932,66/);
assert.match(renderReport(record),/1\.813\.932\.660,00/);
assert.equal(record.generatedAt,'2026-09-27T12:00:00.000Z');
assert.ok(Object.isFrozen(record.result.metrics));
state.updateSimulationInputs({coverType:'hex',areaM2:10000});
assert.equal(record.selectedCover,'sphere');
assert.equal(record.inputs.areaM2,750000);
assert.equal(captureReport(state).inputs.areaM2,10000);
for (const coverType of ['none','sphere','hex']) {
  for (const [areaM2, annualEvapMm] of [[.01,.01],[1e8,10000],[12345.67,765.43]]) {
    state.updateSimulationInputs({areaM2,annualEvapMm,coverType});
    const r=captureReport(state);
    assert.deepEqual(r.result,state.simulation.result);
    assert.deepEqual(r.comparisons,state.simulation.comparisons);
    assert.ok(!renderReport(r).includes('NaN'));
    if (coverType==='none') assert.equal(r.equivalences.tanks,0);
  }
}
assert.notEqual(number(.000001),'0,00');
state.updateSimulationInputs({areaM2:NaN});
assert.throws(()=>captureReport(state),/área/);
state.updateSimulationInputs({annualEvapMm:-1});
state.updateSimulationInputs({areaM2:10000});
assert.throws(()=>captureReport(state),/evaporação/);
state.resetSimulationDefaults();
assert.match(captureReport(state).origins.annualEvapMm,/Referência inicial/);
state.updateSimulationInputs({annualEvapMm:2344.7});
assert.match(captureReport(state).origins.annualEvapMm,/informado na simulação/);
delete state.simulation.origins.annualEvapMm;
assert.match(captureReport(state).origins.annualEvapMm,/não registrada/);
const broken=structuredClone(record.comparisons);
broken[0].metrics.preservedM3=5;
assert.throws(()=>checkBalance(broken),/Inconsistência/);
state.reportMode='study';
const study=captureReport(state);
assert.equal(study.inputs,null);
assert.equal(study.result,null);
assert.deepEqual(study.comparisons,[]);
assert.match(renderReport(study),/Memória numérica não reproduzível/);
assert.match(renderChart(study),/não são resultados volumétricos/);
state.reportMode='free';
state.resetSimulationDefaults();
console.log('Relatório: regressão 3.230,8 mm, cenários, extremos, origem, imutabilidade, validação e estudo de caso aprovados.');
