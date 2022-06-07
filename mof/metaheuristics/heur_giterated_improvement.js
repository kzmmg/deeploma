const assert = require('assert')

const generic_algorithm = require('../generic/generic_algorithm.js')

// generic iterated improvement algorithm

class heur_giterated_improvement extends generic_algorithm {
	// general iterative improvement 
	// takes the best neighborhood solution and move into it 
	// runtime: O(K) - K is total of neighborhood count
	//
	step(step_num){
		assert(!this.local_trap, "local optima trapped, no steps")
						
		let neiburrs = this.neighbors(this.current_sol)
		let best_neiburr = neiburrs[0]
		
		if (!best_neiburr) {
			this.local_trap = true // weird but if it is not surrounded by any neiburrs then why go further
			return
		}
		
		for (let i = 1; i < neiburrs.length; i++) {
			let neiburr = neiburrs[i]
			
			if(this._better(neiburr, best_neiburr))
				best_neiburr = neiburr
		}
		
		// if previous found solution is better than best neighbor, 
		// we reached local optima
		if (this._better(this.current_sol, best_neiburr)) {
			this.local_trap = true
			// console.log(this.current_sol)
		// if best neighbor is same as previous found, and plateau move not allowed
		// consider as trapped as well
		} else if(this._equal(this.current_sol, best_neiburr) 
					&& !this.plateau_move) {
			this.local_trap = true
			console.log(this.current_sol)
		} else { 
			this.current_sol = best_neiburr
		}
	}
}

module.exports = heur_giterated_improvement