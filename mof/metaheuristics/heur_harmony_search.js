const assert = require('assert')

const generic_algorithm = require('../generic/generic_algorithm.js')

// jazz harmony search algorithm

const default_harmony_memory_len = 20

class heur_harmony_search extends generic_algorithm {
	constructor(problem, config) {
		super(problem, config)
		
		this.harmony_memory = []
		
		if (config && config.harmony_memory_len) {
			this.harmony_memory_len = config.harmony_memory_len
		} else {
			this.harmony_memory_len = default_harmony_memory_len
		}
	}
	
	perfect_harmony() {
		if(this.harmony_memory.length !== this.harmony_memory_len)
			return false
		
		let hm = this.harmony_memory
		for(let i = 0; i < hm.length - 1; i++) {
			let dis = hm[i]
			let next = hm[i+1]
			if(!this._equal(dis, next))
				return false
		}
		
		return true
	}
	
	find_best_neighbor() {
		let neiburrs = this.neighbors(this.current_sol)
		let best_neiburr = neiburrs[0]
		
		if (!best_neiburr) return
		
		for (let i = 1; i < neiburrs.length; i++) {
			let neiburr = neiburrs[i]
			
			if(this._better(neiburr, best_neiburr))
				best_neiburr = neiburr
		}
		
		return best_neiburr
	}
	
	find_worst_note_index() {
		let hm = this.harmony_memory
		let worst_note_index = 0
		
		for (let i = 1; i < hm.length; i++) {
			let current_note = hm[i]
			let worst_note = hm[worst_note_index]
			
			if(this._better(worst_note, current_note)) {
				worst_note_index = i
			}
		}
		
		return worst_note_index
	}
	
	step(step_num){
		assert(!this.local_trap, "local optima trapped, no steps")
			
		let best_neiburr = this.find_best_neighbor()
				
		if (!best_neiburr) {
			this.local_trap = true // weird but if it is not surrounded by any neiburrs then why go further
			return
		}
		
		// if harmonic memory is not filled, put it in and call it a day
		if (this.harmony_memory.length < this.harmony_memory_len) {
			this.harmony_memory.push(best_neiburr)
			this.current_sol = best_neiburr
			return
		}
		
		// if all notes are equal this is perfect harmony and there is nothing to search for
		if (this.perfect_harmony()) {
			if (!this.current_sol) 
				this.current_sol = this.harmony_memory[0]
			this.local_trap = true
			return
		}
		
		let hm = this.harmony_memory
		let worst_note_index = this.find_worst_note_index()
		let worst_note = hm[worst_note_index]
		
		// if worst_note is better or equal than best neighbor then we've got best harmony, stop
		if (this._better(worst_note, best_neiburr) || this._equal(worst_note, best_neiburr)) {
			this.local_trap = true
			return
		}
		
		// replace worst note with best neighbor
		this.current_sol = best_neiburr
		this.harmony_memory[worst_note_index] = best_neiburr
		return
	}
}

module.exports = heur_harmony_search