const guess_bounding_box_generic = require("./guess_bounding_box_generic.js")

const THREE = require("../libs/three.js")

class guess_bounding_box_backbone_generic extends guess_bounding_box_generic {
	guess(molecule1, molecule2) {
		let atoms1 = molecule1.atoms
		let atoms2 = molecule2.atoms
		
		let backbone1 = []
		let backbone2 = []
		
		for (let i = 0; i < atoms1.length; i++) {
			let atom = atoms1[i]
			
			if (atom.name === "CA") {
				backbone1.push(atom)
			}
		}
		
		for (let i = 0; i < atoms2.length; i++) {
			let atom = atoms2[i]
			
			if (atom.name === "CA") {
				backbone2.push(atom)
			}
		}
				
		const geometry1 = new THREE.Geometry()
		const geometry2 = new THREE.Geometry()
		
		const backbone_geometry1 = new THREE.Geometry()
		const backbone_geometry2 = new THREE.Geometry()
		
		atoms1.forEach((atom) => {
			const vertex = new THREE.Vector3(atom.x, atom.y, atom.z)
			geometry1.vertices.push(vertex)
		});

		geometry1.computeBoundingBox()
		let bounding_box1 = geometry1.boundingBox
		
		atoms2.forEach((atom) => {
			const vertex = new THREE.Vector3(atom.x, atom.y, atom.z)
			geometry2.vertices.push(vertex)
		});

		geometry2.computeBoundingBox()
		let bounding_box2 = geometry2.boundingBox
		
		backbone1.forEach((atom) => {
			const vertex = new THREE.Vector3(atom.x, atom.y, atom.z)
			backbone_geometry1.vertices.push(vertex)
		});

		backbone_geometry1.computeBoundingBox()
		let backbone_bounding_box1 = backbone_geometry1.boundingBox
		
		backbone2.forEach((atom) => {
			const vertex = new THREE.Vector3(atom.x, atom.y, atom.z)
			backbone_geometry2.vertices.push(vertex)
		});

		backbone_geometry2.computeBoundingBox()
		let backbone_bounding_box2 = backbone_geometry2.boundingBox
		
		let molecules = 				[ molecule1, molecule2 ]
		let backbones = 				[ backbone1, backbone2 ]
		
		let backbone_bounding_boxes = 	[ backbone_bounding_box1, backbone_bounding_box2 ]
		let bounding_boxes = 			[ bounding_box1, bounding_box2 ]
		
		let backbone_geometries = 		[ backbone_geometry1, backbone_geometry2 ]
		let geometries = 				[ geometry1, geometry2 ]
		
		this.guess_backbone_bb(
						molecules, 
						backbones, 
						
						backbone_bounding_boxes, 
						bounding_boxes, 
						
						backbone_geometries, 
						geometries)
	}
	
	guess_backbone_bb(molecules, backbones, b_boxes, boxes, b_geoms, geoms) {
		throw 0 // implement in subs
	}
}

module.exports = guess_bounding_box_backbone_generic