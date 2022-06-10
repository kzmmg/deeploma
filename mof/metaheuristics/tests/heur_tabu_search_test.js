const assert = require("assert")
const tabu_search = require("../heur_tabu_search.js")

// update_tabu test

algo = new tabu_search(1, 2)

algo.short_mem = [1,2,3,4]
algo.cur_expire_index = 2

algo.update_tabu(10)

assert(algo.short_mem.length === 4)
assert(algo.short_mem[0] === 1)
assert(algo.short_mem[1] === 2)
assert(algo.short_mem[2] === 10)
assert(algo.short_mem[3] === 4)

assert(algo.cur_expire_index === 3)

// update_tabu test, mod overclock

algo = new tabu_search(1, 2)

algo.short_mem = [1,2,3,4]
algo.cur_expire_index = 3
algo.tabu_tenure = 4

algo.update_tabu(10)

assert(algo.short_mem.length === 4)
assert(algo.short_mem[0] === 1)
assert(algo.short_mem[1] === 2)
assert(algo.short_mem[2] === 3)
assert(algo.short_mem[3] === 10)

assert(algo.cur_expire_index === 0)

class test_solution {
	constructor(f) {
		this.fitness = f
	}
	identical(s) {
		return this.fitness === s.fitness
	}
}

let sol1 = new test_solution(1)
let sol2 = new test_solution(2)
let sol3 = new test_solution(3)

algo = new tabu_search(1, 2)
algo.short_mem = [sol1, sol3]

assert(!algo.tabued(sol2))


algo = new tabu_search(1, 2)
algo.short_mem = [sol1, sol2]

assert(algo.tabued(sol2))

// no neiburrs => local_trap, no current_solution updated

algo = new tabu_search(1, 2)
algo.short_mem = []
algo.cur_expire_index = 0
algo.current_sol = 123
algo.neighbors = () => []

assert(!algo.local_trap)
algo.step()

assert(algo.current_sol === 123)
assert(algo.local_trap)
assert(algo.short_mem.length === 0)
assert(algo.cur_expire_index === 0)

// neiburrs but all tabued => local_trap, no current_solution updated

algo = new tabu_search(1, 2)
algo.tabu_tenure = 2
algo.short_mem = [new test_solution(2), new test_solution(4)]
algo.current_sol = 223
algo.neighbors = () => [new test_solution(2), new test_solution(4)]

assert(!algo.local_trap)
algo.step()

assert(algo.current_sol === 223)
assert(algo.local_trap)
assert(algo.short_mem.length === 2)
assert(algo.short_mem[0].fitness === 2)
assert(algo.short_mem[1].fitness === 4)
assert(algo.cur_expire_index === 0)

// neiburrs, some not tabued => no local_trap, current_solution updated

algo = new tabu_search(1, 2)
algo.tabu_tenure = 2
algo.short_mem = [new test_solution(2), new test_solution(4)]
algo.current_sol = 223
algo.neighbors = () => [new test_solution(3), new test_solution(4)]

assert(!algo.local_trap)
algo.step()

assert(algo.current_sol.fitness === 3)
assert(!algo.local_trap)
assert(algo.short_mem.length === 2)
assert(algo.short_mem[0].fitness === 3)
assert(algo.short_mem[1].fitness === 4)
assert(algo.cur_expire_index === 1)

// init tabu test
algo = new tabu_search(1, 2)
algo.tabu_tenure = 2

algo.init_tabu()

assert(!algo.current_sol)
assert(algo.short_mem.length === 2)
assert(!algo.short_mem[0])
assert(!algo.short_mem[1])
assert(algo.cur_expire_index === 0)

// init test
algo = new tabu_search(1, 2)
algo.tabu_tenure = 2
algo.problem = { random_solution : () => 5 }

algo.init()

assert(algo.init_sol === 5)
assert(algo.current_sol === 5)
assert(algo.best_sol === 5)
assert(algo.current_step === 0)
assert(!algo.local_trap)
assert(algo.short_mem.length === 2)
assert(algo.short_mem[0] === 5)
assert(!algo.short_mem[1])
assert(algo.cur_expire_index === 1)
assert(algo.tabu_tenure === 2)
