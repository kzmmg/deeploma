const assert = require("assert")

const sf = require("../wvol_scoring_function.js")

// _atom_dist test
let sfi = new sf()

assert(sfi._atom_dist({x:14, y: 0, z: 0}, {x:3, y: 0, z: 0}) === 11)
assert(sfi._atom_dist({x:0, y: 17, z: 0}, {x:0, y: 14, z: 0}) === 3)
assert(sfi._atom_dist({x:0, y: 0, z: 86}, {x:0, y: 0, z: 15}) === 71)
assert(Math.round(sfi._atom_dist({x:Math.sqrt(2) + 1, y: 1, z: 1}, {x:1, y: 0, z: 0})) === 2)

// _no_lens_vol test
sfi = new sf()

assert(sfi._no_lens_vol({vertices:[1,2,3,4,5]},{vertices:[10,20,30]}, 30) === 240)

// _atom_vol test
sfi = new sf()

assert(sfi._atom_vol(1) === 4/3 * Math.PI)
assert(sfi._atom_vol(2) === 32/3 * Math.PI)

// _calc_lens_vol test
// atoms are farther apart than their two radii combined => zero lens vol
sfi = new sf()

assert(sfi._calc_lens_vol({x:14, y: 0, z: 0}, {x:3, y: 0, z: 0}, 1) === 0)
assert(sfi._calc_lens_vol({x:14, y: 0, z: 0}, {x:3, y: 0, z: 0}, 2) === 0)
assert(sfi._calc_lens_vol({x:14, y: 0, z: 0}, {x:3, y: 0, z: 0}, 3) === 0)
assert(sfi._calc_lens_vol({x:14, y: 0, z: 0}, {x:3, y: 0, z: 0}, 4) === 0)
assert(sfi._calc_lens_vol({x:14, y: 0, z: 0}, {x:3, y: 0, z: 0}, 5) === 0)
assert(sfi._calc_lens_vol({x:14, y: 0, z: 0}, {x:3, y: 0, z: 0}, 6) === Math.PI * 35 / 12)

// _compute_avg_dist test
sfi = new sf()
sfi._atom_dist = (a, b) => a + b
assert(sfi._compute_avg_dist({vertices:[34,35]}, {vertices:[43,44]}) === (34 + 35 + 43 + 44 + 34 + 43 + 34 + 44 + 35 + 43 + 35 + 44) / 6)

// score_inj test
sfi = new sf({molecule1:{vertices:[3,4]}, molecule2:{vertices:[5,6]}})
//console.log(sfi)

sfi._compute_avg_dist = _ => 200
sfi._atom_vol = _ => 100
sfi._calc_lens_vol = (a, b, c) => a + b + c

assert(sfi.score_inj([0,0,0,0,0,0,0,0,0,0,0,0], _ => _) === 400 - 208 - 210 - 209 - 209 - 211 - 207)

sfi = new sf({molecule1:{atoms:[{x:1, y:2, z:3}, {x:4, y:5, z:6}]}, molecule2:{atoms:[{x:11, y:22, z:-3}, {x:6, y:16, z:26}]}})
assert(sfi.score([0,0,0,0,0,0,0,0,0,0,0,0]) !== sfi.score([1,0,0,0,0,0,0,0,0,0,0,0]))
assert(sfi.score([0,0,0,0,0,0,0,0,0,0,0,0]) !== sfi.score([1,1,0,0,0,0,0,0,0,0,0,0]))




