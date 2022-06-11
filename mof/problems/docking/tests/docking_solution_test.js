const assert = require("assert")

const docking_solution = require("../docking_solution.js")

// constructor test

let sol = new docking_solution(100)

assert(sol.vector === 100)
assert(!sol.data)
assert(!sol.fitness)

// identical test, not a docking_solution

sol = new docking_solution(110)

assert.throws(() => sol.identical(1))

// identical test, dims don't match

sol = new docking_solution(120)
sol2 = new docking_solution(130)

sol2.dimension = () => 100

assert(!sol.identical(sol2))

// identical test, dims match, some elements don't

sol = new docking_solution([1,2,3])
sol2 = new docking_solution([1,3,3])

assert(!sol.identical(sol2))

// identical test, dims match, elements too

sol = new docking_solution([5,6,9])
sol2 = new docking_solution([5,6,9])

assert(sol.identical(sol2))

// dimension is 12D

sol = new docking_solution()

assert(sol.dimension() === 12)

// dimension is 12D

sol = new docking_solution()
sol.fitness = 200
sol.vector = [10, 20, 30]

assert(sol.toString() === "[10,20,30](200)")
