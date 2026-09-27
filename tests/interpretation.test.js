import assert from 'node:assert/strict';
import { interpretVolume, IRAUCUBA } from '../src/interpretation.js';

const annual = interpretVolume(1.49e9);
assert.equal(annual.tanks, 1490000);
assert.equal(annual.personDays, 14900000);
assert.equal(annual.peopleFor365Days, 14900000 / 365);
assert.equal(annual.populationDays, 14900000 / IRAUCUBA.population);
for (const [period, divisor] of [['monthly',12],['daily',365]]) {
  const result = interpretVolume(1.49e9, period);
  for (const key of Object.keys(annual))
    assert.ok(Math.abs(result[key] - annual[key] / divisor) <= 1e-7, `${period}: ${key}`);
}
assert.equal(interpretVolume(0).tanks, 0);
for (const value of [-1, NaN, Infinity]) assert.throws(() => interpretVolume(value), RangeError);
assert.throws(() => interpretVolume(100, 'invalid'), RangeError);
assert.throws(() => interpretVolume(100, 'annual', 0), RangeError);
console.log('Equivalências: períodos, população, caixas, consumo e limites passaram.');
