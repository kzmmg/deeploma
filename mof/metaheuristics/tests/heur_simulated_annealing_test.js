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

// probability test

algo = new simulated_annealing(1, 2)
algo.problem = { fitness: (a) => a.fitness }
algo.current_sol = { fitness: 2 }
algo.boltzman_const = 2
algo.temperature = 0.5

let neiburr = { fitness: 4 }

assert(algo._compute_probability(neiburr) === Math.exp(-1))

// step test:
// 1. neiburr better than current_sol, localopt disabled
// 2a. neiburr not better than current_sol, p doesn't hold, localopt disabled
// 2b. neiburr not better than current_sol, p does hold, localopt disabled
// 1b. neiburr better than current_sol, localopt enabled
// 2ba. neiburr not better than current_sol, p doesn't hold, localopt enabled
// 2bb. neiburr not better than current_sol, p does hold, localopt enabled

// 1.
let acc = []

algo = new simulated_annealing(1, 2)
algo.neighbor = () => { return { fitness: 20 } }
algo.current_sol = { fitness: 10 }
algo.check_localoptima = false
algo._check_localoptima = () => true
algo._update_temperature = () => acc.push(1)

assert(!algo.local_trap)
assert(acc.length === 0)

console.log(algo.neighbor())

algo.step()

assert(algo.current_sol.fitness === 20)
assert(!algo.local_trap)
assert(acc.length === 1)
assert(acc[0] === 1)

// 2a.
acc = []

algo = new simulated_annealing(1, 2)
algo.neighbor = () => { return { fitness: 5 } }
algo.current_sol = { fitness: 9 }
algo.check_localoptima = false
algo._check_localoptima = () => true
algo._update_temperature = () => acc.push(1)
algo._compute_probability = () => -1
assert(!algo.local_trap)
assert(acc.length === 0)

algo.step()

assert(algo.current_sol.fitness === 9)
assert(!algo.local_trap)
assert(acc.length === 1)
assert(acc[0] === 1)

// 2b.
acc = []

algo = new simulated_annealing(1, 2)
algo.neighbor = () => { return { fitness: 13 } }
algo.current_sol = { fitness: 80 }
algo.check_localoptima = false
algo._check_localoptima = () => true
algo._update_temperature = () => acc.push(1)
algo._compute_probability = () => 100
assert(!algo.local_trap)
assert(acc.length === 0)

algo.step()

assert(algo.current_sol.fitness === 13)
assert(!algo.local_trap)
assert(acc.length === 1)
assert(acc[0] === 1)


// 1b.
acc = []

algo = new simulated_annealing(1, 2)
algo.neighbor = () => { return { fitness: 20 } }
algo.current_sol = { fitness: 10 }
algo.check_localoptima = true
algo._check_localoptima = () => true
algo._update_temperature = () => acc.push(1)

assert(!algo.local_trap)
assert(acc.length === 0)

console.log(algo.neighbor())

algo.step()

assert(algo.current_sol.fitness === 20)
assert(algo.local_trap)
assert(acc.length === 1)
assert(acc[0] === 1)

// 2ba.
acc = []

algo = new simulated_annealing(1, 2)
algo.neighbor = () => { return { fitness: 5 } }
algo.current_sol = { fitness: 9 }
algo.check_localoptima = true
algo._check_localoptima = () => true
algo._update_temperature = () => acc.push(1)
algo._compute_probability = () => -1
assert(!algo.local_trap)
assert(acc.length === 0)

algo.step()

assert(algo.current_sol.fitness === 9)
assert(algo.local_trap)
assert(acc.length === 1)
assert(acc[0] === 1)

// 2bb.
acc = []

algo = new simulated_annealing(1, 2)
algo.neighbor = () => { return { fitness: 13 } }
algo.current_sol = { fitness: 80 }
algo.check_localoptima = true
algo._check_localoptima = () => true
algo._update_temperature = () => acc.push(1)
algo._compute_probability = () => 100
assert(!algo.local_trap)
assert(acc.length === 0)

algo.step()

assert(algo.current_sol.fitness === 13)
assert(algo.local_trap)
assert(acc.length === 1)
assert(acc[0] === 1)

// init test

algo = new simulated_annealing(1,2)
algo.init_solution = () => 300
algo.temperature_scope = [1, 350]

algo.init()

assert(algo.init_sol === 300)
assert(algo.current_sol === 300)
assert(algo.best_sol === 300)
assert(algo.current_step === 0)
assert(!algo.local_trap)
assert(algo.temperature === 350)

// constructor test without config

algo = new simulated_annealing(1,2)

assert(!algo.temperature)
assert(0.05 === algo.boltzman_const)
assert(2 === algo.temperature_scope.length)
assert(1 === algo.temperature_scope[0])
assert(100 === algo.temperature_scope[1])
assert(false === algo.check_localoptima)
assert(0 === algo.cooling_scheme)

// constructor test with config

algo = new simulated_annealing(1,{
	boltzman_const: 101,
	temperature_scope: [400, 800],
	check_localoptima: true,
	cooling_scheme: 1
})

assert(!algo.temperature)
assert(101 === algo.boltzman_const)
assert(2 === algo.temperature_scope.length)
assert(400 === algo.temperature_scope[0])
assert(800 === algo.temperature_scope[1])
assert(true === algo.check_localoptima)
assert(1 === algo.cooling_scheme)
