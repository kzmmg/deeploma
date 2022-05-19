import * as THREE from './three.js'
import pdb_parser from './pdb_parser.js'

window.THREE = THREE

import OrbitControls from './OrbitControls.js'
import Geometry from './Geometry.js'

import * as vis_helpers from './vis_helpers.js'
import * as vis_constants from './vis_constants.js'
import * as materials from './vis_materials.js'

let camera
let scene
let renderer
let camera_controls

let options

const clock = new THREE.Clock()

function draw_atoms(atoms, geometry, sphere_geometry) {
	let prev_pos = void 0
	geometry.vertices.forEach((vector3, i) => {
		let material = atoms[i].element
		
		switch(material) {
			case 'H':
				material = materials.material_h
				break      
			case 'C':      
				material = materials.material_c
				break      
			case 'N':      
				material = materials.material_n
				break      
			case 'O':      
				material = materials.material_o
				break      
			case 'S':      
				material = materials.material_s
				break      
			default:       
				material = materials.material_d
				break
		}
		
		const sphere = new THREE.Mesh(sphere_geometry, material)
		sphere.position.set(vector3.x, vector3.y, vector3.z)
		scene.add(sphere)
		
		if(options.bonds) {
			if(prev_pos) {
				// console.log("drawing bond")
				
				let now_pos = vector3
				let distance = prev_pos.distanceTo(now_pos)
				
				let cylind_geometry = new THREE.CylinderGeometry(
														options.bond_top_radius * vis_constants.slider_factor / 2, 
														options.bond_bottom_radius * vis_constants.slider_factor / 2, 
														distance) 
				
				
				const { x:ax, y:ay, z:az } = now_pos
				const { x:bx, y:by, z:bz } = prev_pos
				const stick_axis = new THREE.Vector3(bx - ax, by - ay, bz - az).normalize()

				//console.log(distance, ax, bx, ay, by, az, bz)
				
				// use quaternion to rotate cylinder from default to target orientation
				const quaternion = new THREE.Quaternion()
				const cylinder_up_axis = new THREE.Vector3( 0, 1, 0 )
				quaternion.setFromUnitVectors(cylinder_up_axis, stick_axis)
				cylind_geometry.applyQuaternion(quaternion)

				// translate oriented stick to location between endpoints
				cylind_geometry.translate((bx+ax)/2, (by+ay)/2, (bz+az)/2)
				
				
				const cyl_mesh = new THREE.Mesh(cylind_geometry, materials.material_h)
				scene.add(cyl_mesh)
			}
			
			prev_pos = vector3
		}
	})
}

function fill_scene(first_protein, second_protein, options) {
	scene = new THREE.Scene()

	let atoms1 = pdb_parser(first_protein).atoms
	let atoms2 = pdb_parser(second_protein).atoms

	const geometry1 = new Geometry()
	const geometry2 = new Geometry()
	
	const geometry = new Geometry()
	
	atoms1.forEach((atom) => {
		const vertex = new THREE.Vector3(atom.x, atom.y, atom.z)
		geometry1.vertices.push(vertex)
		geometry.vertices.push(vertex)
	});
	
	atoms2.forEach((atom) => {
		const vertex = new THREE.Vector3(atom.x, atom.y, atom.z)
		geometry2.vertices.push(vertex)
		geometry.vertices.push(vertex)
	});

	// Calculate midpoint
	geometry.computeBoundingBox()
	let bounding_box = geometry.boundingBox
	let midpoint = vis_helpers.compute_midpoint(bounding_box)

	// calculate the bounding sphere radius
	const bounding_sphere_radius = atoms1.concat(atoms2).reduce((greatest_distance, atom) => {
		const atom_position = new THREE.Vector3(atom.x, atom.y, atom.z)
		const distance = midpoint.distanceTo(atom_position)
		if (distance > greatest_distance) {
		  return distance
		}
		return greatest_distance
	}, 0)

	// translate midpoint to origin and update midpoint and bounding_box	
	geometry.translate(
		0 - midpoint.x,
		0 - midpoint.y,
		0 - midpoint.z
	)
	
	geometry.computeBoundingBox()
	bounding_box = geometry.boundingBox
	midpoint = vis_helpers.compute_midpoint(bounding_box)
	
	geometry1.computeBoundingBox()
	let bb1 = geometry1.boundingBox
	geometry2.computeBoundingBox()
	let bb2 = geometry2.boundingBox

	
	const sphere_geometry = new THREE.SphereGeometry(options.radius * vis_constants.slider_factor, 16, 16)
	
	// drawing atoms1
	draw_atoms(atoms1, geometry1, sphere_geometry)
	
	// drawing atoms2
	draw_atoms(atoms2, geometry2, sphere_geometry)

	let cam_position = new THREE.Vector3(0, 0, bounding_sphere_radius * 1.5)
	camera.position.set(cam_position.x, cam_position.y, cam_position.z)

	const ambient_light = new THREE.AmbientLight(vis_helpers.compute_ambient_light(options))
	scene.add(ambient_light)
	
	const light = new THREE.DirectionalLight(0xFFFFFF, 0.6)
	light.position.set(cam_position.x, cam_position.y, cam_position.z)
	scene.add(light)
	
	const sun = new THREE.HemisphereLight(0xFFFFFF, 0.2)
	scene.add(sun)
	const sun2 = new THREE.DirectionalLight(0x222222, 0.3)
	light.position.set(0, 1, 0)
	scene.add(sun2)
	const sun3 = new THREE.DirectionalLight(0x333333, 0.4)
	light.position.set(0, -1, 0)
	scene.add(sun3)
	const sun4 = new THREE.DirectionalLight(0x353131, 0.2)
	light.position.set(1, 0, 0)
	scene.add(sun4)
	const sun5 = new THREE.DirectionalLight(0x454545, 0.3)
	light.position.set(-1, 0, 0)
	scene.add(sun5)
	
	if (options.bb) {
		const bb1_mesh = new THREE.Box3Helper( bb1, 0xffff00 );
		const bb2_mesh = new THREE.Box3Helper( bb2, 0xffff00 );
		//const bb2 = new THREE.Box3Helper( geometry2, 0xffff00 );
		scene.add( bb1_mesh );
		scene.add( bb2_mesh );
		//scene.add( bb2 );
	}
}

function init(options) {
	const canvas_width = window.innerWidth
	const canvas_height = window.innerHeight
	const canvas_ratio = canvas_width / canvas_height

	// renderer
	renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, preserveDrawingBuffer: true })
	
	renderer.setSize(canvas_width, canvas_height)
	renderer.setClearColor(vis_helpers.compute_background_color(options))
	
	// https://en.threejs-university.com/2021/08/06/optimizing-a-three-js-application-tips-for-achieving-a-fluid-rendering-at-60-fps/
	renderer.setPixelRatio(options.pixel_ratio * vis_constants.slider_factor / 2)
	
	// camera
	camera = new THREE.PerspectiveCamera(options.fov, canvas_ratio, 2, 8000)
	camera.position.set(10, 5, 15)
	camera.zoom = +options.zoom * vis_constants.slider_factor
	
	camera.updateProjectionMatrix()

	// controls
	camera_controls = new OrbitControls(camera, renderer.domElement)
	camera_controls.target.set(0, 0, 0)
	camera_controls.enablePan = false
}

function add_to_dom(element) {
	const canvas = element.getElementsByTagName('canvas')
	if (canvas.length > 0) {
		element.removeChild(canvas[0]);
	}
	
	element.appendChild(renderer.domElement);
}

function render() {
	const delta = clock.getDelta()
	camera_controls.update(delta)
	renderer.render(scene, camera)
}

function animate() {
	window.requestAnimationFrame(animate)
	
	if(options.stats && options.do_stats) {
		options.stats.begin()
		render()
		options.stats.end()
	} else {
		render()
	}
}

export default function visualizer(element, pdb1, pdb2 , opts) {
	try {
		console.log("redrawing with options", opts)
		
		options = opts
		
		init(options)
		
		fill_scene(pdb1, pdb2, options)
		add_to_dom(element)
		animate(options)
	} catch (e) {
		vis_helpers.error_report(element, console, e)
	}
}