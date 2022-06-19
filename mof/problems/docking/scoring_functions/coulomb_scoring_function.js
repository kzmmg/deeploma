const scoring_function = require('../scoring_function.js')

const coulomb_k = 8.987551792314 / 10

const transform = require("../scoring_function_transform.js")

class coulomb_scoring_function extends scoring_function {
	score(candidate) {
		let molecule1 = this.problem.molecule1
		let molecule2 = this.problem.molecule2
		
		molecule1 = transform(molecule1, candidate.vector.slice(0,6))
		molecule2 = transform(molecule2, candidate.vector.slice(6))
		
		let force = 0
		
		for (let i = 0; i < molecule1.vertices.length; i++) {
			for (let j = 0; j < molecule2.vertices.length; j++) {
				let atom1 = molecule1.vertices[i]
				let atom2 = molecule2.vertices[j]
				
				force += this._coulomb_calc(atom1, atom2)
			}
		}
		
		for (let i = 0; i < molecule1.vertices.length; i++) {
			for (let j = i + 1; j < molecule1.vertices.length; j++) {
				let atom1 = molecule1.vertices[i]
				let atom2 = molecule1.vertices[j]
				
				force += this._coulomb_calc(atom1, atom2)
			}
		}
		
		for (let i = 0; i < molecule2.vertices.length; i++) {
			for (let j = i + 1; j < molecule2.vertices.length; j++) {
				let atom1 = molecule2.vertices[i]
				let atom2 = molecule2.vertices[j]
				
				force += this._coulomb_calc(atom1, atom2)
			}
		}
		
		console.log(force)
		
		return force
	}
	
	_coulomb_calc(atom1, atom2) {
		let dist = Math.sqrt(Math.pow(atom1.x - atom2.x, 2) + 
								Math.pow(atom1.y - atom2.y, 2) + 
								Math.pow(atom1.z - atom2.z, 2))
				
		let charge_prod = (atom1.charge || 0) * (atom2.charge || 0)
		
		return coulomb_k * charge_prod / dist
	}
}

module.exports = coulomb_scoring_function