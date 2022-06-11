const scoring_function = require('../scoring_function.js')

const THREE = require("../../../../libs/three.js")
require("../../../../libs/geometry.js")(THREE)

const to_geom = (mol) => {
	const geometry = new THREE.Geometry()
	
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

class mtour_scoring_function extends scoring_function {
	score_inj(candidate, transform) {
		let molecule1 = this.problem.molecule1
		let molecule2 = this.problem.molecule2
		
		console.log(arguments)
		
		molecule1 = transform(molecule1, candidate.vector.slice(0,6))
		molecule2 = transform(molecule2, candidate.vector.slice(6))
		
		let atom0 = molecule1.vertices[0]
		
		let [maxx, maxy, maxz] = [atom0.x, atom0.y, atom0.z]
		let [minx, miny, minz] = [atom0.x, atom0.y, atom0.z]
		
		
		for (let i = 0; i < molecule1.vertices.length; i++) {
			let atom = molecule1.vertices[i]
			
			let x = atom.x
			let y = atom.y
			let z = atom.z
			
			if (x > maxx) maxx = x
			if (x < minx) minx = x
			if (y > maxy) maxy = y
			if (y < miny) miny = y
			if (z > maxz) maxz = z
			if (z < minz) minz = z
		}
		
		for (let i = 0; i < molecule2.vertices.length; i++) {
			let atom = molecule2.vertices[i]
			
			let x = atom.x
			let y = atom.y
			let z = atom.z
			
			if (x > maxx) maxx = x
			if (x < minx) minx = x
			if (y > maxy) maxy = y
			if (y < miny) miny = y
			if (z > maxz) maxz = z
			if (z < minz) minz = z
		}
		
		return Math.abs(maxx - minx) + Math.abs(maxy - miny) + Math.abs(maxz - minz)
	}
	
	score(candidate) {
		return this.score_inj(candidate, transform)
	}
}

module.exports = mtour_scoring_function

module.exports.transform = transform
module.exports.to_geom = to_geom