import assert from 'node:assert/strict';
import { state } from '../src/state.js';
import { captureReport } from '../src/report/snapshot.js';
import { renderReport } from '../src/report/render.js';
import { buildActivities, doubledAreaExperiment, renderPedagogicalReport } from '../src/report/pedagogical.js';
import { SKILLS, COMPETENCIES } from '../src/report/pedagogicalCatalog.js';

state.resetSimulationDefaults();
state.reportMode = 'free';
for (const coverType of ['none','sphere','hex']) {
  for (const [areaM2, annualEvapMm] of [[10000,1000],[23456,723.4],[.01,.01],[1e8,10000]]) {
    state.updateSimulationInputs({areaM2,annualEvapMm,coverType});
    const before = JSON.stringify(state.simulation);
    const r = captureReport(state);
    const scientific = renderReport(r);
    const html = renderPedagogicalReport(r);
    assert.equal(buildActivities(r).length,6);
    assert.ok(!/NaN|undefined|Infinity/.test(html));
    assert.equal(JSON.stringify(state.simulation),before);
    assert.equal(renderReport(r),scientific);
    assert.doesNotMatch(scientific,/SPAECE|ENEM|H26|D16/);
    const doubled = doubledAreaExperiment(r);
    if (areaM2 <= 5e7) {
      for (const key of ['preservedM3','evaporationWithoutCoverM3','evaporationWithCoverM3'])
        assert.equal(doubled.result.metrics[key],r.result.metrics[key]*2);
    } else {
      assert.equal(doubled.result,null);
      assert.match(doubled.reason,/limite operacional/);
    }
    if (areaM2===10000 && coverType==='sphere') {
      assert.equal(r.result.metrics.evaporationWithoutCoverM3,10000);
      assert.equal(r.result.metrics.preservedM3,7486);
      assert.equal(r.result.metrics.evaporationWithCoverM3,2514);
      assert.equal(r.result.metrics.litersSaved,7486000);
      assert.match(html,/3743\/5000/);
      assert.match(html,/7\.486\.000,00/);
    }
    if (coverType==='none') assert.match(buildActivities(r)[0].answer,/0\/1/);
  }
}
state.reportMode='study';
const study=captureReport(state);
assert.equal(doubledAreaExperiment(study).result,null);
assert.match(renderPedagogicalReport(study),/não são volumes calculados/);
assert.match(buildActivities(study)[3].answer,/não está documentada/);
assert.equal(study.result,null);
state.reportMode='free';
state.updateSimulationInputs({areaM2:NaN});
assert.throws(()=>captureReport(state),/área/);
assert.deepEqual(SKILLS.filter(s=>s.system==='spaece').map(s=>s.code),['D16','D64','D76']);
assert.deepEqual(SKILLS.filter(s=>s.system==='enem').map(s=>s.code),['H3','H4','H10','H12','H15','H16','H24','H25','H26']);
for (const skill of SKILLS) {
  assert.ok(skill.activities.every(id=>id>=1 && id<=6));
  assert.ok(skill.official && skill.proposal && skill.production);
  if (skill.system==='enem') assert.ok(COMPETENCIES[skill.competency]);
}
console.log('Pedagógico: regressão, três cenários, extremos, duplicação, limite, estudo, catálogo, independência.');
