const assert = require('assert')

const docking_problem 	= require('./docking_problem.js')
const docking_solution 	= require('./docking_solution.js')
const docking_constant 	= require('./docking_constant.js')

const giterated_improvement 	= require('../../metaheuristics/heur_giterated_improvement.js')
const simulated_annealing 		= require('../../metaheuristics/heur_simulated_annealing.js')
const tabu_search 				= require('../../metaheuristics/heur_tabu_search.js')
const harmony_search			= require('../../metaheuristics/heur_tabu_search.js')

const plus = (v1, v2) => {
	let res = []
	
	for (let i = 0; i < v1.length; i++) {
		res[i] = v1[i] + v2[i]
	}
	
	return res
}

const neighbors = (dis, candidate) => {
	assert(dis.problem.valid(candidate))
	
	let neiburrs = []
	
	// e*(e-1)/2 elements in total  
	for (let i = 0; i < docking_constant.dim; i++) {
		let trans  = Array(docking_constant.dim).fill(0)
		trans[i]  =  docking_constant.fixed_step
		let trans2 = Array(docking_constant.dim).fill(0)
		trans2[i] = -docking_constant.fixed_step
		
		let nei = new docking_solution(plus(candidate.vector, trans))
		let nei2 = new docking_solution(plus(candidate.vector, trans2))
		
		nei.fitness =dis.problem.fitness(nei)
		nei2.fitness =dis.problem.fitness(nei2)
		
		neiburrs.push(nei)
		neiburrs.push(nei2)
	}
	
	return neiburrs
}
		
const neighbor = (dis, rand, candidate) => {
	assert(dis.problem.valid(candidate))
	
	let random_element = Math.round(rand() * 11)
	let random_direction = rand() > 0.5 ? 1 : -1;
	
	let random_neighbor = Array(docking_constant.dim).fill(0)
	random_neighbor[random_element] = random_direction * docking_constant.fixed_step

	random_neighbor = new docking_solution(plus(candidate.vector, random_neighbor))
	random_neighbor.fitness = dis.problem.fitness(random_neighbor)
	
	return random_neighbor
}

module.exports.plus      = plus
module.exports.neighbors = neighbors
module.exports.neighbor  = neighbor

class docking_harmony_search extends harmony_search {
	neighbor(candidate) {
		return neighbor(this, Math.random, candidate)
	}
	
	neighbors(candidate) {
		return neighbors(this, candidate)
	}
}

class docking_tabu_search extends tabu_search {
	neighbor(candidate) {
		return neighbor(this, Math.random, candidate)
	}
	
	neighbors(candidate) {
		return neighbors(this, candidate)
	}
}

class docking_simulated_annealing extends simulated_annealing {
	neighbor(candidate) {
		return neighbor(this, Math.random, candidate)
	}
	
	neighbors(candidate) {
		return neighbors(this, candidate)
	}
}

class docking_giterative_improvement extends giterated_improvement {
	neighbor(candidate) {
		return neighbor(this, Math.random, candidate)
	}
	
	neighbors(candidate) {
		return neighbors(this, candidate)
	}
}

module.exports.docking_harmony_search = docking_harmony_search
module.exports.docking_tabu_search = docking_tabu_search
module.exports.docking_simulated_annealing = docking_simulated_annealing
module.exports.docking_giterative_improvement = docking_giterative_improvement