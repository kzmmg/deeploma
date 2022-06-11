const assert = require("assert")

const docking_problem = require("../docking_problem.js")
const docking_solution = require("../docking_solution.js")

// constructor test

let problem = new docking_problem([1,2])

assert(problem.molecule1 === 1)
assert(problem.molecule2 === 2)
assert(problem.data.length === 2)
assert(problem.data[0] === 1)
assert(problem.data[1] === 2)
assert(problem.minimization === true)

// constructor test 2

problem = new docking_problem(100)

assert(!problem.molecule1)
assert(!problem.molecule2)
assert(problem.data === 100)
assert(problem.minimization === true)

// valid test

// not an instance is not valid

problem = new docking_problem(200)

assert.throws(() => problem.valid(10))

// malformed (no vector) instance is not valid

problem = new docking_problem(201)
let sol = new docking_solution()
sol.vector = false

assert(!problem.valid(sol))

// dim is not 12 is not valid

problem = new docking_problem(202)
sol = new docking_solution()
sol.vector = []

assert(!problem.valid(sol))

// dim is 12 is valid

problem = new docking_problem(203)
sol = new docking_solution()

sol.vector = [1,2,3,4,5,6,7,8,9,10,11,12]

assert(problem.valid(sol))

// fitness test

// not an instance throws

problem = new docking_problem(204)
assert(() => problem.fitness(1))

// instance hits .score

problem = new docking_problem(205)
problem.score = () => 500

sol = new docking_solution()
assert(problem.fitness(sol) === 500)

// score tests
// score pulls get_scoring_function to ensure it is in place to pull it

let acc = []
problem = new docking_problem(206)
problem.get_scoring_function = () => acc.push(122)

problem.scoring_function = { score: _ => _ }

problem.score()

assert(acc.length === 1)
assert(acc[0] === 122)

// scoring_function.score should be function

problem = new docking_problem(207)
problem.get_scoring_function = _ => _

problem.scoring_function = { score: void 0 }

assert.throws(_ => problem.score())

// scoring_function.score gets pulled upon pulling problem's score

problem = new docking_problem(208)
problem.get_scoring_function = _ => _

problem.scoring_function = { score: _=> 569 }

assert(problem.score() === 569)

// random_solution test

problem = new docking_problem(209)
problem.fitness = _ => 210

sol = problem.random_solution()

assert(sol.vector.length === 12)
assert(Math.abs(sol.vector[0]) === 5)
assert(Math.abs(sol.vector[1]) === 5)
assert(Math.abs(sol.vector[2]) === 5)
assert(Math.abs(sol.vector[3]) === 5)
assert(Math.abs(sol.vector[4]) === 5)
assert(Math.abs(sol.vector[5]) === 5)
assert(Math.abs(sol.vector[6]) === 5)
assert(Math.abs(sol.vector[7]) === 5)
assert(Math.abs(sol.vector[8]) === 5)
assert(Math.abs(sol.vector[9]) === 5)
assert(Math.abs(sol.vector[10]) === 5)
assert(Math.abs(sol.vector[11]) === 5)
assert(sol.fitness === 210)

// dimension test
problem = new docking_problem(211)
assert(problem.dimension() === 12)

// static parse_data test

assert(docking_problem.parse_data(212) === 212)
// static valid_data test

assert(docking_problem.valid_data(213) === true)
assert(docking_problem.valid_data(false) === true)
assert(docking_problem.valid_data(true) === true)
assert(docking_problem.valid_data() === true)
