const assert = require('assert')

const docking_constant 		= require('./docking_constant.js')
const generic_solution 		= require('../../generic/generic_solution.js')


// docking solution is a 12D vector of:
// [translate_x1, translate_y1, translate_z1, translate_alpha1, translate_beta1, translate_gamma1,
// 	translate_x2, translate_y2, translate_z2, translate_alpha2, translate_beta2, translate_gamma2]
class docking_solution extends generic_solution {
	constructor(vector){
		this.vector = vector
		
		super.apply(this,arguments)
	}
	
	identical(sol) { 
		assert.ok(sol instanceof docking_solution)
		
		if(sol.dimension() != this.dimension()) 
			return false
		
		for(let i = 0; i < this.dimension(); i++)
			if(sol.vector[i] != this.vector[i]) 
				return false
			
		return true
	}
			
	dimension() {
		return docking_constant.dim
	}
	
	toString (){
		return "[" + this.data.elements + "](" + this.fitness + ")"
	}
}
module.exports = docking_solution