import visualizer from './visualizer.js'
import visualizer_both from './visualizer_both.js'

function fetch_both(container, pdb_id1, pdb_id2) {
	
	pdb_id1 = pdb_id1 || "./doobie.pdb"
	pdb_id2 = pdb_id2 || "./doobie2.pdb"
	
	window.fetch(pdb_id1)
		.then(response => response.text())
		.then((pdb1) => {
			
			window.fetch(pdb_id2)
				.then(response => response.text())
				.then((pdb2) => {
					container.innerHtml = ''
					
					visualizer_both(container, pdb1, pdb2, {
						radius: slider.value,
						bonds: Boolean(check.checked),
						light: light_slider.value,
						zoom: zoom_slider.value,
						ambient: ambient_slider.value,
						bond_top_radius: bond_top_slider.value,
						bond_bottom_radius: bond_bottom_slider.value,
						fov: fov_slider.value,
						bb: Boolean(bb_check.checked),
						pixel_ratio: pixel_ratio_slider.value,
					})
				})
				.catch(console.error.bind(console))
		})
		.catch(console.error.bind(console))
}

function make_fetch_one(default_pdb) {
	return function fetch_one(container, pdb_id) {
		pdb_id = pdb_id || default_pdb
		
		window.fetch(pdb_id)
			.then(response => response.text())
			.then((pdb) => {
				container.innerHtml = ''
				
				visualizer(container, pdb, {
					radius: slider.value,
					bonds: Boolean(check.checked),
					light: light_slider.value,
					zoom: zoom_slider.value,
					ambient: ambient_slider.value,
					bond_top_radius: bond_top_slider.value,
					bond_bottom_radius: bond_bottom_slider.value,
					fov: fov_slider.value,
					bb: Boolean(bb_check.checked),
					pixel_ratio: pixel_ratio_slider.value,
				})
			})
			.catch(console.error.bind(console))
	}
}

const fetch_one = make_fetch_one("./doobie.pdb")
const fetch_two = make_fetch_one("./doobie2.pdb")

const group_margin = 3
const style_group = (el, name) => {
	const label = window.document.createElement("div")
	label.innerText = name
	//label.style.fontFamily = "sans-serif"
	
	el.style.border ="1px black dashed"
	el.style.margin = group_margin
	el.style.padding = group_margin
	el.append(label)
}

// create pdbid input

const container = window.document.createElement("div")
container.style.display = "flex"

container.style.fontFamily = "sans-serif"

window.document.body.append(container)

const file_group = window.document.createElement("div")
style_group(file_group, "Files")

container.append(file_group)

const input = window.document.createElement('input')

input.type = "file"
input.title = "pdb id"
input.accept=".pdb" 
input.id = "pdbid1"
input.style.display = "none"
let input_label = window.document.createElement("label")
input_label.htmlFor = "pdbid1"
input_label.innerText = "Choose_PDB1"
input_label.style.border = "1px solid black"
input_label.style.padding = group_margin
input_label.style.margin = group_margin
input_label.style.display = "block"
input_label.append(input)




file_group.append(
		(()=>{
				let d = window.document.createElement("div")
				d.style.margin = group_margin
				d.append(input_label)
				return d
			})()
			)

// create pdbid2 input
const input2 = window.document.createElement('input')

input2.type = "file"
input2.title = "pdb2 id"
input2.accept=".pdb" 
input2.id = "pdbid2"
input2.style.display = "none"
let input_label2 = window.document.createElement("label")
input_label2.htmlFor  = "pdbid2"
input_label2.innerText = "Choose_PDB2"
input_label2.style.border = "1px solid black"
input_label2.style.padding = group_margin
input_label2.style.margin = group_margin
input_label2.style.display = "block"
input_label2.append(input2)


file_group.append(
		(()=>{
				let d = window.document.createElement("div")
				d.style.margin = group_margin
				d.append(input_label2)
				return d
			})()
			)

const control_group = window.document.createElement("div")
style_group(control_group, "Controls")

container.append(control_group)

const check_group = window.document.createElement("div")
control_group.append(check_group)

// create bonds checkbox
const check = window.document.createElement('input')

check.type = 'checkbox'
check.title = "draw bonds"


check_group.append(check)

// create bounding boxes checkbox
const bb_check = window.document.createElement('input')

bb_check.type = 'checkbox'
bb_check.title = "draw bounding boxes"


check_group.append(bb_check)

// create bounding boxes checkbox
const stats_check = window.document.createElement('input')

stats_check.type = 'checkbox'
stats_check.title = "show stats"
stats_check.checked = "false"

check_group.append(stats_check)

const slider_group = window.document.createElement("div")
control_group.append(slider_group)


// create radius slider
const slider = window.document.createElement('input')

slider.type = 'range'
slider.title = "atom radius"


slider_group.append(slider)

// create light slider
const light_slider = window.document.createElement('input')

light_slider.type = 'range'
light_slider.value = 0
light_slider.title = "background"


slider_group.append(light_slider)

// create ambient slider
const ambient_slider = window.document.createElement('input')

ambient_slider.type = 'range'
ambient_slider.value = 0
ambient_slider.title = "ambient"


slider_group.append(ambient_slider)

// create zoom slider
const zoom_slider = window.document.createElement('input')

zoom_slider.type = 'range'
zoom_slider.value = 10
zoom_slider.title = "zoom"


slider_group.append(zoom_slider)


// create bond top radius slider
const bond_top_slider = window.document.createElement('input')

bond_top_slider.type = 'range'
bond_top_slider.value = 10
bond_top_slider.title = "bond top radius"


slider_group.append(bond_top_slider)

// create bond bottom radius slider
const bond_bottom_slider = window.document.createElement('input')

bond_bottom_slider.type = 'range'
bond_bottom_slider.value = 10
bond_bottom_slider.title = "bond top radius"

slider_group.append(bond_bottom_slider)

// create fov slider
const fov_slider = window.document.createElement('input')

fov_slider.type = 'range'
fov_slider.value = 55
fov_slider.title = "field of view grad"
fov_slider.min = 0
fov_slider.max = 180


slider_group.append(fov_slider)

// create pixel_ratio slider
const pixel_ratio_slider = window.document.createElement('input')

pixel_ratio_slider.type = 'range'
pixel_ratio_slider.value = 50
pixel_ratio_slider.title = "pixel ratio"
pixel_ratio_slider.min = 0
pixel_ratio_slider.max = 100


slider_group.append(pixel_ratio_slider)

// containers for 3d

const containers = window.document.createElement("div")
containers.style.display = "flex"
containers.style.flexWrap = "wrap"
containers.style.height = "100%"
window.document.body.append(containers)

const container_one = window.document.createElement("div")
container_one.style.overflow = "scroll"
container_one.style.flexBasis = "50%"
container_one.style.height = "50%"

containers.append(container_one)

const container_two = window.document.createElement("div")
container_two.style.overflow = "scroll"
container_two.style.flexBasis = "50%"
container_two.style.height = "50%"
containers.append(container_two)

const container_both = window.document.createElement("div")
container_both.style.overflow = "scroll"
container_both.style.flexBasis = "100%"
container_both.style.height = "50%"
containers.append(container_both)

const do_fetch = () => {
	fetch_one(container_one)
	fetch_two(container_two)
	fetch_both(container_both)
}

do_fetch()

input.addEventListener('change', 				do_fetch)
input2.addEventListener('change', 				do_fetch)
check.addEventListener('change', 				do_fetch)
bb_check.addEventListener('change', 			do_fetch)
slider.addEventListener('change', 				do_fetch)
light_slider.addEventListener('change', 		do_fetch)
ambient_slider.addEventListener('change', 		do_fetch)
zoom_slider.addEventListener('change', 			do_fetch)
bond_top_slider.addEventListener('change', 		do_fetch)
bond_bottom_slider.addEventListener('change', 	do_fetch)
fov_slider.addEventListener('change', 			do_fetch)
pixel_ratio_slider.addEventListener('change', 	do_fetch)

window.addEventListener('resize',				do_fetch)

import './stats.js'

// window.Stats = Stats
const stats = new Stats()
stats.showPanel(0)

window.document.body.append(stats.dom)

stats_check.addEventListener("change", _ => {
	let val = Boolean(stats_check.checked)
	
	if(val) stats.showPanel(0)
	if(!val) stats.showPanel(100)
})