const assert = require("assert")

const generic_problem = require("../generic_problem.js")

// is constructor working okay

class test_problem_1 extends generic_problem {
	constructor(p1, p2) {
		super(p1, p2)
	}
}

let test_problem = new test_problem_1(1, 2)

assert(test_problem.data === 1, [test_problem.data])
assert(test_problem.minimization === 2, [test_problem.minimization])

class test_problem_2 extends generic_problem {
	constructor(p1, p2) {
		super(...arguments)
	}
}

test_problem = new test_problem_2(1, 2)

assert(test_problem.data === 1, [test_problem.data])
assert(test_problem.minimization === 2, [test_problem.minimization])

class test_problem_3 extends generic_problem {
	constructor(...args) {
		super(...args)
	}
}

test_problem = new test_problem_3(1, 2)

assert(test_problem.data === 1, [test_problem.data])
assert(test_problem.minimization === 2, [test_problem.minimization])


// is valid method working okay

class test_problem_4 extends generic_problem {
	valid(another) {
		assert(another === 3)
		
		return 4
	}
}

test_problem = new test_problem_4(1, 2)

assert(test_problem.data === 1, [test_problem.data])
assert(test_problem.minimization === 2, [test_problem.minimization])

assert(test_problem.valid(3) === 4)

// is fitness method working okay

class test_problem_4a extends generic_problem {
	fitness(another) {
		assert(another === 3)
		
		return 4
	}
}

test_problem = new test_problem_4a(1, 2)

assert(test_problem.data === 1, [test_problem.data])
assert(test_problem.minimization === 2, [test_problem.minimization])

assert(test_problem.fitness(3) === 4)

// is fitness method working okay

class test_problem_4b extends generic_problem {
	random_solution(...args) {
		assert(args.length === 0)
		assert(true)
		
		return 4
	}
}

test_problem = new test_problem_4b(1, 2)

assert(test_problem.data === 1, [test_problem.data])
assert(test_problem.minimization === 2, [test_problem.minimization])

assert(test_problem.random_solution() === 4)

// is parse_data method working okay

class test_problem_5 extends generic_problem {
	method() {
		super.parse_data()
	}
}

test_problem = new test_problem_5(1, 2)

assert(test_problem.data === 1, [test_problem.data])
assert(test_problem.minimization === 2, [test_problem.minimization])

assert.throws(() => test_problem.method())

// is parse_data method working okay

class test_problem_6 extends generic_problem {
	static parse_data(param) {
		assert(param === 3)
		return 4
	}
}

test_problem = new test_problem_6(1, 2)

assert(test_problem.data === 1, [test_problem.data])
assert(test_problem.minimization === 2, [test_problem.minimization])

assert(test_problem_6.parse_data)
assert(!test_problem.parse_data)

assert(test_problem_6.parse_data(3) === 4)

// is valid_data method working okay

class test_problem_5a extends generic_problem {
	method() {
		super.valid_data()
	}
}

test_problem = new test_problem_5a(1, 2)

assert(test_problem.data === 1, [test_problem.data])
assert(test_problem.minimization === 2, [test_problem.minimization])

assert.throws(() => test_problem.method())

// is valid_data method working okay

class test_problem_6a extends generic_problem {
	static valid_data(param) {
		assert(param === 3)
		return 4
	}
}

test_problem = new test_problem_6a(1, 2)

assert(test_problem.data === 1, [test_problem.data])
assert(test_problem.minimization === 2, [test_problem.minimization])

assert(test_problem_6a.valid_data)
assert(!test_problem.valid_data)

assert(test_problem_6.parse_data(3) === 4)

// assert(false)