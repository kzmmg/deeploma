const assert = require("assert")

const generic_optimization_solution = require("../generic_optimization_solution.js")

// is constructor working okay

class test_solution_1 extends generic_optimization_solution {
	constructor(p1, p2) {
		super(p1, p2)
	}
}

let test_solution = new test_solution_1(1, 2)

assert(test_solution.data === 1, [test_solution.data])
assert(test_solution.fitness === 2, [test_solution.fitness])

class test_solution_2 extends generic_optimization_solution {
	constructor(p1, p2) {
		super(...arguments)
	}
}

test_solution = new test_solution_2(1, 2)

assert(test_solution.data === 1, [test_solution.data])
assert(test_solution.fitness === 2, [test_solution.fitness])

class test_solution_3 extends generic_optimization_solution {
	constructor(...args) {
		super(...args)
	}
}

test_solution = new test_solution_3(1, 2)

assert(test_solution.data === 1, [test_solution.data])
assert(test_solution.fitness === 2, [test_solution.fitness])

// is identical method working okay

class test_solution_4 extends generic_optimization_solution {
	identical(another) {
		assert(another === 3)
		
		return 4
	}
}

test_solution = new test_solution_4(1, 2)

assert(test_solution.data === 1, [test_solution.data])
assert(test_solution.fitness === 2, [test_solution.fitness])

assert(test_solution.identical(3) === 4)

// is parse_data method working okay

class test_solution_5 extends generic_optimization_solution {
	method() {
		super.parse_data()
	}
}

test_solution = new test_solution_5(1, 2)

assert(test_solution.data === 1, [test_solution.data])
assert(test_solution.fitness === 2, [test_solution.fitness])

assert.throws(() => test_solution.method())

// is parse_data method working okay

class test_solution_6 extends generic_optimization_solution {
	static parse_data(param) {
		assert(param === 3)
		return 4
	}
}

test_solution = new test_solution_6(1, 2)

assert(test_solution.data === 1, [test_solution.data])
assert(test_solution.fitness === 2, [test_solution.fitness])

assert(test_solution_6.parse_data)
assert(!test_solution.parse_data)

assert(test_solution_6.parse_data(3) === 4)

