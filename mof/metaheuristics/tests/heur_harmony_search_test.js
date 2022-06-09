const assert = require("assert")
const heur_harmony_search = require("../heur_harmony_search.js")

// initializes harmony memory
// with either default length or defined length

let algo = new heur_harmony_search()

assert(algo.harmony_memory instanceof Array)
assert(algo.harmony_memory_len === 20)

algo = new heur_harmony_search(1, { harmony_memory_len: 30 })

assert(algo.harmony_memory instanceof Array)
assert(algo.harmony_memory_len === 30)

// doesnt forget to pass to super

algo = new heur_harmony_search(1, { plateau_move: false })

assert(!algo.plateau_move)
assert(!algo.plateau_move)

algo = new heur_harmony_search(1, 2)

assert(algo.plateau_move)

// perfect harmony test
// perfect harmony is one note (perfectly harmonizes with itself)


algo = new heur_harmony_search(1, 2)
algo.harmony_memory = [{fitness: 3}, {fitness: 3}, {fitness: 3}]

assert(!algo.perfect_harmony()) // memory not filled yet

algo = new heur_harmony_search(1, 2)
algo.harmony_memory = [{fitness: 3}, {fitness: 4}, {fitness: 3}]

assert(!algo.perfect_harmony()) // memory not filled yet

algo = new heur_harmony_search(1, {harmony_memory_len: 3})
algo.harmony_memory = [{fitness: 3}, {fitness: 3}, {fitness: 3}]

assert(algo.perfect_harmony())

algo = new heur_harmony_search(1, {harmony_memory_len: 3})
algo.harmony_memory = [{fitness: 3}, {fitness: 4}, {fitness: 3}]

assert(!algo.perfect_harmony())

// find_best_neighbor test
// no neighborhood => returns void 0

algo = new heur_harmony_search(1, {harmony_memory_len: 3})
algo.neighbors = () => []

assert(algo.find_best_neighbor() === void 0)


// 

algo = new heur_harmony_search(1, {harmony_memory_len: 3})
algo.neighbors = () => [{fitness: 3}, {fitness: 14}, {fitness: 3}]

assert(algo.find_best_neighbor().fitness === 14)

// find_worst_note_index test

// not filled case

algo = new heur_harmony_search(1, 2)
algo.harmony_memory = [{fitness: 3}, {fitness: 14}, {fitness: 1}, {fitness: 5}]

assert(algo.find_worst_note_index() === 2)

// filled case

algo = new heur_harmony_search(1, {harmony_memory_len: 3})
algo.harmony_memory = [{fitness: 0}, {fitness: 14}, {fitness: 1}]

assert(algo.find_worst_note_index() === 0)

// step tests
// 1. no best neiburr => trapped, stop

algo = new heur_harmony_search(1, {harmony_memory_len: 3})
algo.neighbors = () => []
algo.current_sol = 31

// console.log(algo)

assert(!algo.local_trap)

algo.step()

assert(algo.current_sol === 31)
assert(algo.local_trap === true)

// 1a. best neiburr => set it, continue
algo = new heur_harmony_search(1, {harmony_memory_len: 3})
algo.harmony_memory = [{fitness: 0}, {fitness: 14}, {fitness: 1}]
algo.neighbors = () => [{fitness: 3}]
algo.current_sol = {fitness: 3000}


assert(!algo.local_trap)

algo.step()

assert(algo.current_sol.fitness === 3) // ?!
assert(algo.harmony_memory.length === 3)
assert(algo.harmony_memory[0].fitness === 3)
assert(algo.harmony_memory[1].fitness === 14)
assert(algo.harmony_memory[2].fitness === 1)

assert(!algo.local_trap)

// 2. perfect harmony => stop [1]

algo = new heur_harmony_search(1, {harmony_memory_len: 3})
algo.harmony_memory = [{fitness: 15}, {fitness: 15}, {fitness: 15}]
algo.neighbors = () => [{fitness: 16}]
algo.current_sol = {fitness: 3000}


assert(!algo.local_trap)

algo.step()

assert(algo.current_sol.fitness === 3000)
assert(algo.harmony_memory.length === 3)
assert(algo.harmony_memory[0].fitness === 15)
assert(algo.harmony_memory[1].fitness === 15)
assert(algo.harmony_memory[2].fitness === 15)

assert(algo.local_trap)

// 2. perfect harmony => stop [2]

algo = new heur_harmony_search(1, {harmony_memory_len: 3})
algo.harmony_memory = [{fitness: 15}, {fitness: 15}, {fitness: 15}]
algo.neighbors = () => [{fitness: 16}]
algo.current_sol = void 0


assert(!algo.local_trap)

algo.step()

assert(algo.current_sol.fitness === 15)
assert(algo.harmony_memory.length === 3)
assert(algo.harmony_memory[0].fitness === 15)
assert(algo.harmony_memory[1].fitness === 15)
assert(algo.harmony_memory[2].fitness === 15)

assert(algo.local_trap)

// 3. worst note worse than best neiburr => replace, continue

algo = new heur_harmony_search(1, {harmony_memory_len: 3})
algo.harmony_memory = [{fitness: 1}, {fitness: 15}, {fitness: 15}]
algo.neighbors = () => [{fitness: 16}, {fitness: 17}, {fitness:8}]
algo.current_sol = void 0


assert(!algo.local_trap)

algo.step()

assert(algo.current_sol.fitness === 17)
assert(algo.harmony_memory.length === 3)
assert(algo.harmony_memory[0].fitness === 17)
assert(algo.harmony_memory[1].fitness === 15)
assert(algo.harmony_memory[2].fitness === 15)

assert(!algo.local_trap)

// 3. worst note equal to  best neiburr => stop

algo = new heur_harmony_search(1, {harmony_memory_len: 3})
algo.harmony_memory = [{fitness: 1}, {fitness: 15}, {fitness: 15}]
algo.neighbors = () => [{fitness: -1}, {fitness: 1}, {fitness:0}]
algo.current_sol = 2


assert(!algo.local_trap)

algo.step()

assert(algo.current_sol === 2)
assert(algo.harmony_memory.length === 3)
assert(algo.harmony_memory[0].fitness === 1)
assert(algo.harmony_memory[1].fitness === 15)
assert(algo.harmony_memory[2].fitness === 15)

assert(algo.local_trap)

// 3. worst note better than best neiburr => stop [2]

algo = new heur_harmony_search(1, {harmony_memory_len: 3})
algo.harmony_memory = [{fitness: 1}, {fitness: 15}, {fitness: 15}]
algo.neighbors = () => [{fitness: -1}, {fitness: -2}, {fitness:0}]
algo.current_sol = 2


assert(!algo.local_trap)

algo.step()

assert(algo.current_sol === 2)
assert(algo.harmony_memory.length === 3)
assert(algo.harmony_memory[0].fitness === 1)
assert(algo.harmony_memory[1].fitness === 15)
assert(algo.harmony_memory[2].fitness === 15)

assert(algo.local_trap)
