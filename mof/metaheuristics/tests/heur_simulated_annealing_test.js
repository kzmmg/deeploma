const assert = require("assert")
const simulated_annealing = require("../heur_simulated_annealing.js")

// _check_localoptima test, no neighbors => empty circle, nowhere to go, stop

let algo = new simulated_annealing(1, 2)

algo.neighbors = () => []
assert(algo._check_localoptima())

// _check_localoptima test, all neighbors worse => nowhere to go, stop

algo = new simulated_annealing(1, 2)

algo.neighbors = () => [{fitness:10}, {fitness:11}, {fitness:12}, {fitness:13}]
algo.current_sol = {fitness: 100}

assert(algo._check_localoptima())

// _check_localoptima test, at least one neighbor better => no localoptima, continue

algo = new simulated_annealing(1, 2)

algo.neighbors = () => [{fitness:10}, {fitness:11}, {fitness:120}, {fitness:13}]
algo.current_sol = {fitness: 100}

assert(!algo._check_localoptima())

// _update_temperature test, unknown cooling scheme

algo = new simulated_annealing(1, {cooling_scheme: 3})

assert.throws(() => algo._update_temperature())

// _update_temperature test, arithmetic cooling scheme

algo = new simulated_annealing(1, {terminate_ls_steps: 2, temperature_scope: [1,101]})
algo.temperature = 135

algo._update_temperature()
assert(algo.temperature === 85)

// _update_temperature test, arithmetic cooling scheme [2]

algo = new simulated_annealing(1, {terminate_ls_steps: 4, temperature_scope: [1,201]})
algo.temperature = 135

algo._update_temperature()
assert(algo.temperature === 85)

// _update_temperature test, geometric cooling scheme

algo = new simulated_annealing(1, {cooling_scheme: 1, terminate_ls_steps: 0.5, temperature_scope: [10,1]})
algo.temperature = 135

algo._update_temperature()
assert(algo.temperature === 13500)

// _update_temperature test, geometric cooling scheme [3]

algo = new simulated_annealing(1, {cooling_scheme: 1, terminate_ls_steps: 2, temperature_scope: [81,1]})
algo.temperature = 10

algo._update_temperature()
assert(algo.temperature === 90)

// _update_temperature test, geometric cooling scheme [2]

algo = new simulated_annealing(1, {cooling_scheme: 1, terminate_ls_steps: 0.25, temperature_scope: [9, 3]})
algo.temperature = 1

algo._update_temperature()
assert(algo.temperature === 81)
