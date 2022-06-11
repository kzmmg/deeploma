const scoring_function = require('../scoring_function.js')

require("../libs/geometry.js")(THREE)

const to_geom(mol) {
	const geometry = new THREE.Geometry()
	
	mol.atoms.forEach((atom) => {
		const vertex = new THREE.Vector3(atom.x, atom.y, atom.z)
		geometry.vertices.push(vertex)
	})
	
	return geometry
}

const transform(mol, cand) {
	mol = to_geom(mol)
	
	mol = mol.rotateX(cand[0] * Math.PI / 180)
	mol = mol.rotateY(cand[1] * Math.PI / 180)
	mol = mol.rotateZ(cand[2] * Math.PI / 180)
	
	mol = mol.translate(cand.slice(3))
	
	return mol
}

class mtour_scoring_function extends scoring_function {
	score_inj(candidate, transform) {
		let molecule1 = this.problem.molecule1
		let molecule2 = this.problem.molecule2
		
		molecule1 = transform(molecule1, candidate.slice(0,6))
		molecule2 = transform(molecule2, candidate.slice(6))
		
		let [maxx, maxy, maxz] = [-1000,-1000,-1000]
		let [minx, miny, minz] = [ 1000, 1000, 1000]
		
		for (let i = 0; i < molecule1.atoms.length; i++) {
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
		
		for (let i = 0; i < molecule2.atoms.length; i++) {
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
		return score_inj(candidate, transform)
	}
}

module.exports = mtour_scoring_function

module.exports.transform = transform
module.exports.to_geom = to_geom