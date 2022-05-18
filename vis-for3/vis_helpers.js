import * as THREE from './three.js'

import * as vis_constants from './vis_constants.js'

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

export const error_report = (element, console, e) => {
	let report = 'err!'
	element.append(`${report}${e.stack}`)
	console.error(e)
}