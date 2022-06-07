const assert = require("assert")

const generic_algorithm = require("../generic_algorithm.js")

class test_algorithm_1 extends generic_algorithm {
	
}

// algorithm should store problem and be configurable
let test_algorithm = new test_algorithm_1(1,2)

assert(test_algorithm.problem === 1)
assert(test_algorithm.config === 2)

assert(test_algorithm.plateau_move)
assert(test_algorithm.terminate_ls_steps === 1000)
assert(test_algorithm.terminate_fitness === void 0)


// plateau_move, ls_steps, terminate_fitness tests

test_algorithm = new test_algorithm_1(1, {
	plateau_move: false,
	terminate_ls_steps: 3,
	terminate_fitness: 1
})

assert(test_algorithm.plateau_move === false)
assert(test_algorithm.terminate_ls_steps === 3)
assert(test_algorithm.terminate_fitness === 1)

// no initialization should happen by itself
class test_algorithm_2 extends generic_algorithm {
	init_solution() { return 4 }
}

test_algorithm = new test_algorithm_2(1, 2)

assert(test_algorithm.init_sol === void 0)
assert(test_algorithm.current_sol ===  void 0)
assert(test_algorithm.best_sol ===  void 0)
assert(test_algorithm.current_step ===  void 0)
assert(test_algorithm.local_trap ===  void 0)

test_algorithm.init()

assert(test_algorithm.init_sol === 4)
assert(test_algorithm.current_sol === 4)
assert(test_algorithm.best_sol === 4)
assert(test_algorithm.current_step === 0)
assert(test_algorithm.local_trap === false)

// init_solution should invoke problem's random_solution
test_algorithm = new test_algorithm_1({ random_solution: () => 5 }, 2)

test_algorithm.init()

assert(test_algorithm.init_sol === 5)
assert(test_algorithm.current_sol ===  5)
assert(test_algorithm.best_sol ===  5)

// _better tests:

test_algorithm = new test_algorithm_1({ minimization: true }, 2)

assert(test_algorithm._better({fitness: 1}, {fitness: 2}) === true)
assert(test_algorithm._better({fitness: 2}, {fitness: 2}) === false)
assert(test_algorithm._better({fitness: 3}, {fitness: 2}) === false)

test_algorithm = new test_algorithm_1({ minimization: false }, 2)

assert(test_algorithm._better({fitness: 1}, {fitness: 2}) === false)
assert(test_algorithm._better({fitness: 2}, {fitness: 2}) === false)
assert(test_algorithm._better({fitness: 3}, {fitness: 2}) === true)

// _equal tests:

test_algorithm = new test_algorithm_1(1, 2)

assert(test_algorithm._equal({fitness: 2}, {fitness: 2}) === true)
assert(test_algorithm._equal({fitness: 3}, {fitness: 2}) === false)
assert(test_algorithm._equal({fitness: 1}, {fitness: 2}) === false)

class test_algorithm_3 extends generic_algorithm {
	min_difference() { return 1 }
}

test_algorithm = new test_algorithm_3(1, 2)

assert(test_algorithm._equal({fitness: 2}, {fitness: 2}) === true )
assert(test_algorithm._equal({fitness: 4}, {fitness: 2}) === false )
assert(test_algorithm._equal({fitness: 0}, {fitness: 2}) === false )
assert(test_algorithm._equal({fitness: 1}, {fitness: 2}) === true )
assert(test_algorithm._equal({fitness: 3}, {fitness: 2}) === true )

// neighbour and neighbours should be defined by subs

assert.throws(() => (new test_algorithm_1(1,2)).neighbour())
assert.throws(() => (new test_algorithm_1(1,2)).neighbours())

// run should be either supplied operator Function
class test_algorithm_4 extends generic_algorithm {
	terminate() { return true }
}
test_algorithm = new test_algorithm_4({ random_solution: ()=>0 }, 2) // random_solution is defined as run calls init!
test_algorithm.run(()=>0)

// or supplied nothing at all

test_algorithm = new test_algorithm_4({ random_solution: ()=>0 }, 2)
test_algorithm.run()

// anything else is error

test_algorithm = new test_algorithm_4({ random_solution: ()=>0 }, 2)
assert.throws(() => (new test_algorithm.run()).run(1))
assert.throws(() => (new test_algorithm.run()).run(""))
assert.throws(() => (new test_algorithm.run()).run(void 0))
assert.throws(() => (new test_algorithm.run()).run(null))
assert.throws(() => (new test_algorithm.run()).run({}))

// at first operator (if defined is called with 0 (current step, 0)
let acc = []
let op = (...args) => { 
	assert(args.length === 1)
	assert(args[0] === 0)
	
	acc.push(100)
}

test_algorithm = new test_algorithm_4({ random_solution: ()=>0 }, 2)
test_algorithm.run(op)

assert(acc.length === 1)
assert(acc[0] === 100)

// run test with accumulator
acc = []

class test_algorithm_5 extends generic_algorithm {
	visit_b = false
	visit_t = false
	visit_s = false
	
	_better(s1, s2) {
		if (!this.visit_b) {
			acc.push(130)
			assert(this.current_sol === 0)
			assert(this.best_sol === 0)
			
			this.visit_b = true
			
			return false
		}
		
		acc.push(131)
		assert(this.current_sol === 2)
		assert(this.best_sol === 0)
		
		return true
	}
	
	terminate() {
		if (!this.visit_t) {
			acc.push(132)
			console.log("111")
			
			this.visit_t = true
			
			return false
		}
		
		acc.push(133)
		this.current_sol = 2
		
		return true
	}
	
	step() {
		if (!this.visit_s) {
			acc.push(134)
			
			this.visit_s = true
			return
		}
		
		acc.push(135)
	}
}


test_algorithm = new test_algorithm_5({ random_solution: ()=> 0 }, 2)

test_algorithm.run()

assert(acc.length === 4)
assert(acc[0] === 132)
assert(acc[1] === 134)
assert(acc[2] === 130)
assert(acc[3] === 133)

// run test while loop operator
acc = []

op = (s) => {
	acc.push(s)
}

class test_algorithm_6 extends generic_algorithm {
	visit_t = false
	
	terminate() {
		if (!this.visit_t) {
			acc.push(232)
			
			this.visit_t = true
			
			return false
		}
		
		acc.push(233)
		this.current_sol = 2
		
		return true
	}
	
	step() {}
}


test_algorithm = new test_algorithm_6({ random_solution: ()=> 0 }, 2)

test_algorithm.run(op)

// console.log(acc)

assert(acc.length === 4)
assert(acc[0] === 0)
assert(acc[1] === 232)
assert(acc[2] === 1)
assert(acc[3] === 233)


// terminate tests

// local trap => terminate

test_algorithm = new test_algorithm_1({ random_solution: () => 0}, 2)
test_algorithm.local_trap = true

assert(test_algorithm.terminate())

test_algorithm = new test_algorithm_1({ random_solution: () => 0}, 2)
test_algorithm.local_trap = false

assert(!test_algorithm.terminate())

// overstep => terminate

test_algorithm = new test_algorithm_1({ random_solution: () => 0}, { terminate_ls_steps: 3 })
test_algorithm.cur_step = 4

assert(test_algorithm.terminate())

test_algorithm = new test_algorithm_1({ random_solution: () => 0}, { terminate_ls_steps: 3 })
test_algorithm.cur_step = 2

assert(!test_algorithm.terminate())

// overstep over max_steps => always terminate

test_algorithm = new test_algorithm_1({ random_solution: () => 0}, { terminate_ls_steps: 10000 })
test_algorithm.cur_step = 999

assert(!test_algorithm.terminate())

test_algorithm = new test_algorithm_1({ random_solution: () => 0}, { terminate_ls_steps: 10000 })
test_algorithm.cur_step = 1000

assert(!test_algorithm.terminate())

test_algorithm = new test_algorithm_1({ random_solution: () => 0}, { terminate_ls_steps: 10000 })
test_algorithm.cur_step = 1001

assert(test_algorithm.terminate())

// terminate fitness reached or exceeded => terminate
test_algorithm = new test_algorithm_1({ random_solution: () => 0}, { terminate_fitness: 1 })
test_algorithm.best_sol = { fitness: 0 }

assert(!test_algorithm.terminate())

test_algorithm = new test_algorithm_1({ random_solution: () => 0}, { terminate_fitness: 1 })
test_algorithm.best_sol = { fitness: 1 }

assert(test_algorithm.terminate())

test_algorithm = new test_algorithm_1({ random_solution: () => 0}, { terminate_fitness: 1 })
test_algorithm.best_sol = { fitness: 2 }

assert(test_algorithm.terminate())

