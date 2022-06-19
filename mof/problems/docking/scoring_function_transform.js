const THREE = require("../../../libs/three.js")
require("../../../libs/geometry.js")(THREE)

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

module.exports = transform