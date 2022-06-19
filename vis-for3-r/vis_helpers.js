import * as THREE from './three.js'

import * as vis_constants from './vis_constants.js'

import * as s from './sylvester.js'

export const compute_midpoint = (bounding_box) => {
	return new THREE.Vector3(
		bounding_box.min.x + ((bounding_box.max.x - bounding_box.min.x) / 2),
		bounding_box.min.y + ((bounding_box.max.y - bounding_box.min.y) / 2),
		bounding_box.min.z + ((bounding_box.max.z - bounding_box.min.z) / 2),
	)
}

export const compute_color = (val) => {
	let percents = vis_constants.slider_factor * val / 2
	
	// console.log(percents, "percents")
	
	// OxFF = 255
	let decimal_background_r = Math.round(255 * percents)
	let decimal_background_g = Math.round(255 * percents)// * (1 + Math.random()) % 255
	let decimal_background_b = Math.round(255 * percents)// * (1 + Math.random()) % 255
	
	let octal_background_r = Number(decimal_background_r).toString(16)
	let octal_background_g = Number(decimal_background_g).toString(16)
	let octal_background_b = Number(decimal_background_b).toString(16)
	
	if(octal_background_r.length === 1) octal_background_r = "0" + octal_background_r
	if(octal_background_r.length > 2) octal_background_r = octal_background_r.substr(0, 2)
	if(octal_background_g.length === 1) octal_background_g = "0" + octal_background_g
	if(octal_background_g.length > 2) octal_background_g = octal_background_g.substr(0, 2)
	if(octal_background_b.length === 1) octal_background_b = "0" + octal_background_b
	if(octal_background_b.length > 2) octal_background_b = octal_background_b.substr(0, 2)
	
	return Number("0x" + [octal_background_r, octal_background_g, octal_background_b].join(""))
}

export const compute_background_color = (options) => {
	return compute_color(options.light)
}

export const compute_ambient_light = (options) => {
	return compute_color(options.ambient)
}

export const compute_reg_plane_color = (options) => {
	return compute_color(options.reg_color)
}

export const error_report = (element, console, e) => {
	let report = 'err!'
	element.append(`${report}${e.stack}`)
	console.error(e)
}

const to_arr = (atoms) => {
	let arr = []
	let z = []
	
	for(let i = 0; i < atoms.length; i++) {
		let atom = atoms[i]
		
		arr.push([1, atom.x, atom.y])
		z.push([atom.z])
	}
	
	return [ arr, z ]
}
	
export const compute_normal = (atoms) => {
	let [ arr1, z1 ] = to_arr(atoms)
	
	let mx1 = s.$M(arr1)
	let my1 = s.$M(z1)
	
	let b1 = mx1.transpose().multiply(mx1).inverse().multiply(mx1.transpose()).multiply(my1)
	
	let A1 = b1.elements[1][0]
	let B1 = b1.elements[2][0]
	let C1 = -1            
	let D1 = b1.elements[0][0]
	
	let normal = s.$V([A1, B1, C1])
	
	let unit_normal = normal.x(1 / normal.modulus())
	
	console.log(unit_normal)
	
	return [ unit_normal.e(1),unit_normal.e(2),unit_normal.e(3) ]
}

export const make_plane = (normal, bb, options, midpoint) => {
	let minx = bb.min.x
	let maxx = bb.max.x
	let x_dist = maxx - minx
	
	let miny = bb.min.y
	let maxy = bb.max.y
	let y_dist = maxy - miny
	
	let minz = bb.min.z
	let maxz = bb.max.z
	let z_dist = maxz - minz
	
	let max_dist = Math.max(x_dist, y_dist, z_dist)
	
	const geometry = new THREE.PlaneGeometry( max_dist, max_dist )
		
	const material = new THREE.MeshBasicMaterial({
		color: compute_reg_plane_color(options) || vis_constants.reg_plane_default_color, 
		side: THREE.DoubleSide
	})
	const plane = new THREE.Mesh( geometry, material )
	
	//plane.lookAt(new THREE.Vector3(normal[0], normal[1], normal[2]))
	
	console.log(normal)
	
	let quaternion=new THREE.Quaternion()
		.setFromUnitVectors(new THREE.Vector3(0,0,1), new THREE.Vector3(normal[0], normal[1], normal[2]))
	let position
	if(midpoint) {
		let bbox = new THREE.Box3().setFromObject(plane)
		let pmp = bbox.getCenter(new THREE.Vector3(0, 0, 0))
		position=new THREE.Vector3(pmp.x+midpoint.x,pmp.y+midpoint.y, pmp.z+midpoint.z)
	} else {
		position=new THREE.Vector3(0, 0, 0)
	}
	
	let matrix=new THREE.Matrix4().compose(position, quaternion,new THREE.Vector3(1,1,1))
		 
	plane.applyMatrix4(matrix)
	
	return plane
}