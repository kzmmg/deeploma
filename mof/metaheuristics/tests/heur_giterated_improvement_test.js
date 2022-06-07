const assert = require("assert")
const heur_giterated_improvement = require("../heur_giterated_improvement.js")

// no steps happen if already locally trapped

let algo = new heur_giterated_improvement(1, 2)

algo.local_trap = true

assert.throws(()=>{ algo.step() })

// if .neighbors isn't defined it doesn't go

algo = new heur_giterated_improvement(1, 2)

assert.throws(()=>{ algo.step() })

// if .neighbors is defined it does go

class test_heur extends heur_giterated_improvement {
	neighbors() {
		return []
	}
}

algo = new test_heur(1, 2)

assert(!algo.local_trap)

algo.step()

assert(algo.local_trap)

// chooses best neiburr

class test_heur_2 extends heur_giterated_improvement {
	neighbors() {
		return [{fitness: 3}, {fitness: 25}, {fitness: 1}]
	}
}

algo = new test_heur_2(1, 2)

algo.current_sol = { fitness: -1 }

algo.step()

assert(algo.current_sol.fitness === 25)
assert(algo.current_sol.fitness !== 3)
assert(algo.current_sol.fitness !== 1)
assert(algo.current_sol.fitness !== -1)

// if current sol is better than best neighbor then it's a local trap

algo = new test_heur_2(1, 2)

algo.current_sol = { fitness: 26 }

algo.step()

assert(algo.current_sol.fitness === 26)
assert(algo.current_sol.fitness !== 3)
assert(algo.current_sol.fitness !== 1)
assert(algo.current_sol.fitness !== 25)
assert(algo.local_trap)

// if current sol is equal to best neighbor then it's a local trap if no plateau_move is set

algo = new test_heur_2(1, { plateau_move: false })

algo.current_sol = { fitness: 25 }

assert(!algo.local_trap)
assert(!algo.plateau_move)

algo.step()

assert(algo.current_sol.fitness === 25)
assert(algo.current_sol.fitness !== 3)
assert(algo.current_sol.fitness !== 1)
assert(algo.local_trap)


// if current sol is equal to best neighbor then it's not a local trap if plateau_move is set

algo = new test_heur_2(1, { plateau_move: true })

algo.current_sol = { fitness: 25 }

assert(!algo.local_trap)
assert(algo.plateau_move)

algo.step()

assert(algo.current_sol.fitness === 25)
assert(algo.current_sol.fitness !== 3)
assert(algo.current_sol.fitness !== 1)

assert(!algo.local_trap)
assert(algo.plateau_move)
