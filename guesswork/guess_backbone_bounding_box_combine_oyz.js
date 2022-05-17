const guess_backbone_bounding_box_generic = require("./guess_backbone_bounding_box_generic.js")

const THREE = require("../libs/three.js")

const HACK = 1000

// strategy goes as following:
//  1. reduce protein to its Calpha backbone
//  2. compute bounding box for backbone
//  3. combine their bounding boxes along the OYZ plane

// WARNING: "magic" strategy

class guess_bounding_box_backbone_combine_oyz extends guess_backbone_bounding_box_generic {
	guess_backbone_bb(molecules, backbones, b_boxes, boxes, b_geoms, geoms) {
		let b_geom1 = b_geoms[0]
		let b_geom2 = b_geoms[1]
		
		// dirty trick everyone hates
		b_geom1.translate(-HACK, 0, 0)
		b_geom2.translate(HACK, 0, 0)
		
		geoms[0].translate(-HACK, 0, 0)
		geoms[1].translate(HACK, 0, 0)
		
		//console.log(geometry2.vertices)
		b_geom1.computeBoundingBox()
		b_geom2.computeBoundingBox()
		
		let min_x1 = b_geom1.boundingBox.max.x
		let max_x2 = b_geom2.boundingBox.min.x
		
		let diff = Math.abs(min_x1 - max_x2)
		
		geoms[0].translate(diff, 0, 0)
		
		geoms[0].translate(-HACK, 0, 0)
		geoms[1].translate(-HACK, 0, 0)
		
		geoms[0].vertices.forEach((vertex, i) => {
			molecules[0].atoms[i].x = vertex.x
			molecules[0].atoms[i].y = vertex.y
			molecules[0].atoms[i].z = vertex.z
		})
		
		geoms[1].vertices.forEach((vertex, i) => {
			molecules[1].atoms[i].x = vertex.x
			molecules[1].atoms[i].y = vertex.y
			molecules[1].atoms[i].z = vertex.z
		})
	}
}

module.exports = guess_bounding_box_backbone_combine_oyz