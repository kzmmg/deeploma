const scoring_function = require('../scoring_function.js')

const THREE = require("../../../../libs/three.js")
require("../../../../libs/geometry.js")(THREE)

const to_geom = (mol) => {
	const geometry = new THREE.Geometry()
	
	//console.log(mol)
	
	mol.atoms.forEach((atom) => {
		const vertex = new THREE.Vector3(atom.x, atom.y, atom.z)
		geometry.vertices.push(vertex)
	})
	
	return geometry
}

const transform = (mol, cand) => {
	mol = to_geom(mol)
	
	mol = mol.rotateX(cand[0] * Math.PI / 180)
	mol = mol.rotateY(cand[1] * Math.PI / 180)
	mol = mol.rotateZ(cand[2] * Math.PI / 180)
	
	mol = mol.translate.apply(mol, cand.slice(3))
	
	return mol
}

class wvol_scoring_function extends scoring_function {
	_atom_dist(a1, a2) {
		return Math.sqrt(Math.pow(a1.x - a2.x, 2) + Math.pow(a1.y - a2.y, 2) + Math.pow(a1.z - a2.z, 2))
	}
	
	_calc_lens_vol(a1, a2, r) {
		let dist = this._atom_dist(a1, a2)
		
		let lens_vol
		if (dist >= 2 * r) {
			return 0
		} else {
			// https://mathworld.wolfram.com/Sphere-SphereIntersection.html
			return Math.PI * Math.pow(2 * r - dist, 2) * (dist + 4 * r) / 12
		}
	}
	
	_atom_vol(dist) {
		return 4 / 3 * Math.PI * Math.pow(dist, 3)
	}
	
	_no_lens_vol(m1, m2, vol) {
		// console.log(m1.vertices.length, m2.vertices.length, vol, vol * (m1.vertices.length + m2.vertices.length))
		return vol * (m1.vertices.length + m2.vertices.length)
	}
	
	_compute_avg_dist(m1, m2) {
		let d = 0
		
		for (let i = 0; i < m1.vertices.length; i++) {
			let atom = m1.vertices[i]
			
			for (let j = 0; j < m2.vertices.length; j++) {
				let atom2 = m2.vertices[j]
			
				d += this._atom_dist(atom, atom2)
			}
		}
		
		
		let counter = 0
		for (let i = 0; i < m2.vertices.length; i++) {
			let atom = m2.vertices[i]
			
			for (let j = i + 1; j < m2.vertices.length; j++) {
				let atom2 = m2.vertices[j]
				
				d += this._atom_dist(atom, atom2)
				counter++
			}
			
		}
		
		for (let i = 0; i < m1.vertices.length; i++) {
			let atom = m1.vertices[i]
			
			for (let j = i + 1; j < m1.vertices.length; j++) {
				let atom2 = m1.vertices[j]
				
				d += this._atom_dist(atom, atom2)
				counter++
			}
			
		}
		// console.log(d)
		
		return d / (m1.vertices.length * m2.vertices.length + counter) 
	}
	
	score_inj(candidate, transform) {
		let molecule1 = this.problem.molecule1
		let molecule2 = this.problem.molecule2
		
		molecule1 = transform(molecule1, candidate.slice(0,6))
		molecule2 = transform(molecule2, candidate.slice(6))
		
		let avg_dist = this._compute_avg_dist(molecule1, molecule2)
		
		let vol = 0
		let atom_vol = this._atom_vol(avg_dist)
		
		
		vol += this._no_lens_vol(molecule1, molecule2, atom_vol)
		//console.log(vol)		
		for (let i = 0; i < molecule1.vertices.length; i++) {
			let atom = molecule1.vertices[i]
			
			for (let j = 0; j < molecule2.vertices.length; j++) {
				let atom2 = molecule2.vertices[j]
				
				vol -= this._calc_lens_vol(atom, atom2, avg_dist)
				//console.log(vol)
			}
		}
		
		for (let i = 0; i < molecule2.vertices.length; i++) {
			let atom = molecule2.vertices[i]
			
			for (let j = i + 1; j < molecule2.vertices.length; j++) {
				let atom2 = molecule2.vertices[j]
			
				vol -= this._calc_lens_vol(atom, atom2, avg_dist)
			}
			
		}
		
		for (let i = 0; i < molecule1.vertices.length; i++) {
			let atom = molecule1.vertices[i]
			
			for (let j = i + 1; j < molecule1.vertices.length; j++) {
				let atom2 = molecule1.vertices[j]
			
				vol -= this._calc_lens_vol(atom, atom2, avg_dist)
			}
		}
		
		return vol
	}
	
	score(candidate) {
		return this.score_inj(candidate, transform)
	}
}

module.exports = wvol_scoring_function
