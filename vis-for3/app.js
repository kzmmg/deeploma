import visualizer from './visualizer.js'
import visualizer_both from './visualizer_both.js'

const DEFAULT_PROTEIN_1 = "./doobie.pdb"
const DEFAULT_PROTEIN_2 = "./doobie2.pdb"

function fetch_both(container, pdb_id1, pdb_id2) {
	
	pdb_id1 = pdb_id1 || DEFAULT_PROTEIN_1
	pdb_id2 = pdb_id2 || DEFAULT_PROTEIN_2
	
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
						stats: stats_both,
						do_stats: Boolean(stats_check.checked)
					})
				})
				.catch(console.error.bind(console))
		})
		.catch(console.error.bind(console))
}

function make_fetch_one(default_pdb, stats_id) {
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
					stats: stats_id === 1 ? stats_one : stats_two,
					do_stats: Boolean(stats_check.checked)
				})
			})
			.catch(console.error.bind(console))
	}
}

const fetch_one = make_fetch_one(DEFAULT_PROTEIN_1, 1)
const fetch_two = make_fetch_one(DEFAULT_PROTEIN_2, 2)

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

// show stats checkbox
const stats_check = window.document.createElement('input')

stats_check.type = 'checkbox'
stats_check.title = "show stats"
stats_check.checked = true

check_group.append(stats_check)

// show protein filename checkbox
const label_check = window.document.createElement('input')

label_check.type = 'checkbox'
label_check.title = "show protein labels"
label_check.checked = true

check_group.append(label_check)

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

// create label color slider
const label_color_slider = window.document.createElement('input')

label_color_slider.type = 'range'
label_color_slider.value = 98
label_color_slider.title = "protein label color"
label_color_slider.min = 0
label_color_slider.max = 100


slider_group.append(label_color_slider)

// containers for 3d (flexbox)

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


// content containers
const content_container_one = window.document.createElement("div")
content_container_one.style.position = "relative"
content_container_one.style.width = "max-content"
container_one.append(content_container_one)

const canvas_container_one = window.document.createElement("div")
content_container_one.append(canvas_container_one)
const content_container_two = window.document.createElement("div")
content_container_two.style.position = "relative"
content_container_two.style.width = "max-content"
container_two.append(content_container_two)

const canvas_container_two = window.document.createElement("div")
content_container_two.append(canvas_container_two)

const content_container_both = window.document.createElement("div")
content_container_both.style.position = "relative"
content_container_both.style.width = "max-content"
container_both.append(content_container_both)

const canvas_container_both = window.document.createElement("div")
content_container_both.append(canvas_container_both)

// stats shit

import './stats.js'

// window.Stats = Stats
const stats_one = new Stats()
stats_one.showPanel(0)
const stats_two = new Stats()
stats_two.showPanel(0)
const stats_both = new Stats()
stats_both.showPanel(0)

stats_one. dom.style.position 	= "sticky"
stats_two. dom.style.position 	= "sticky"
stats_both.dom.style.position 	= "sticky"

stats_one. dom.style.left = "0"
stats_two. dom.style.left = "0"
stats_both.dom.style.left = "0"

stats_one. dom.style.top = "0"
stats_two. dom.style.top = "0"
stats_both.dom.style.top = "0"

stats_one. dom.style.width = "80px"
stats_two. dom.style.width = "80px"
stats_both.dom.style.width = "80px"

const stats_one_absolute_container 		= window.document.createElement("div")
const stats_two_absolute_container 		= window.document.createElement("div")
const stats_both_absolute_container 	= window.document.createElement("div")

stats_one_absolute_container.style.position 	= "absolute"
stats_two_absolute_container.style.position 	= "absolute"
stats_both_absolute_container.style.position 	= "absolute"

stats_one_absolute_container.style.left  = "0"
stats_one_absolute_container.style.width  = "100%"
// stats_one_absolute_container.style.height = "200%"
// ----- hack no more needed
stats_one_absolute_container.style.height = "100%"

stats_two_absolute_container.style.left  = "0"
stats_two_absolute_container.style.width  = "100%"
// stats_two_absolute_container.style.height = "200%"
// ----- hack no more needed
stats_two_absolute_container.style.height = "100%"

stats_both_absolute_container.style.left = "0"
stats_both_absolute_container.style.width  = "100%"
// dirty hack everyone absolutely hates
// how it works: the parent is flexed to 50% of viewport height
// while canvas inside it is 100% of viewport height
// so stats_both_absolute_container (and his brothers stats_two_absolute_container and
// stats_one_absolute_container) think that height: 100% is 50% of viewport
// and when the corresponding canvas is scrolled down past canvas midpoint
// then the stickiness breaks. that's how height:200% fixes that
// stats_both_absolute_container.style.height = "200%"
// ----- hack no more needed

stats_both_absolute_container.style.height = "100%"
 
stats_one_absolute_container.style.top  = "0"
stats_two_absolute_container.style.top  = "0"
stats_both_absolute_container.style.top = "0"

stats_one_absolute_container.style.pointerEvents  = "none"
stats_two_absolute_container.style.pointerEvents  = "none"
stats_both_absolute_container.style.pointerEvents = "none"

content_container_one.append(stats_one_absolute_container)
content_container_two.append(stats_two_absolute_container)
content_container_both.append(stats_both_absolute_container)

stats_one_absolute_container.append(stats_one.dom)
stats_two_absolute_container.append(stats_two.dom)
stats_both_absolute_container.append(stats_both.dom)

stats_check.addEventListener("change", _ => {
	let val = Boolean(stats_check.checked)
	
	if(val) stats_one.showPanel(0)
	if(!val) stats_one.showPanel(100)
		
	if(val) stats_two.showPanel(0)
	if(!val) stats_two.showPanel(100)
		
	if(val) stats_both.showPanel(0)
	if(!val) stats_both.showPanel(100)
})

// labels
const label_one = window.document.createElement("p")
const label_two = window.document.createElement("p")
const label_both = window.document.createElement("p")

label_one.style.position = "sticky"
label_two.style.position = "sticky"
label_both.style.position = "sticky"

label_one.style. top = "0px"
label_two.style. top = "0px"
label_both.style.top = "0px"

label_one.style. left = "90px"
label_two.style. left = "90px"
label_both.style.left = "90px"

label_one.style. marginTop = "-48px"
label_two.style. marginTop = "-48px"
label_both.style.marginTop = "-48px"

label_one.style. paddingTop = "8px"
label_two.style. paddingTop = "8px"
label_both.style.paddingTop = "8px"

label_one.style. fontFamily = "sans-serif"
label_two.style. fontFamily = "sans-serif"
label_both.style.fontFamily = "sans-serif"

label_one.style. fontSize = "12px"
label_two.style. fontSize = "12px"
label_both.style.fontSize = "12px"

label_one.style. height = "14px"
label_two.style. height = "14px"
label_both.style.height = "14px"

label_one.style. color = "#aaaaaa"
label_two.style. color = "#aaaaaa"
label_both.style.color = "#aaaaaa"

label_one.style. whiteSpace = "nowrap"
label_two.style. whiteSpace = "nowrap"
label_both.style.whiteSpace = "nowrap"

label_one.style. overflow = "hidden"
label_two.style. overflow = "hidden"
label_both.style.overflow = "hidden"

label_one.style. textOverflow = "ellipsis"
label_two.style. textOverflow = "ellipsis"
label_both.style.textOverflow = "ellipsis"

label_one.style. width = "100px"
label_two.style. width = "100px"
label_both.style.width = "100px"

label_one.innerText = "protein 1"
label_two.innerText = "protein 2"
label_both.innerText = "protein 1 x protein 2"

label_one. title = "protein 1"
label_two. title = "protein 2"
label_both.title = "protein 1 x protein 2"

label_one. style.pointerEvents = "auto"
label_two. style.pointerEvents = "auto"
label_both.style.pointerEvents = "auto"

label_one. style.cursor = "default"
label_two. style.cursor = "default"
label_both.style.cursor = "default"

stats_one_absolute_container.append(label_one)
stats_two_absolute_container.append(label_two)
stats_both_absolute_container.append(label_both)

label_check.addEventListener("change", _ => {
	let val = Boolean(label_check.checked)
	
	if(val)  label_one. style.display = "visible"
	if(!val) label_one. style.display = "none"
			 
	if(val)  label_two. style.display = "visible"
	if(!val) label_two. style.display = "none"
			 
	if(val)  label_both.style.display = "visible"
	if(!val) label_both.style.display = "none"
})

// listeners

const do_fetch = () => {
	fetch_one (canvas_container_one)
	fetch_two (canvas_container_two)
	fetch_both(canvas_container_both)
	
	label_one. innerText = label_one. title = input. value || DEFAULT_PROTEIN_1
	label_two. innerText = label_two. title = input2.value || DEFAULT_PROTEIN_2
	label_both.innerText = label_both.title = (input. value || DEFAULT_PROTEIN_1) + " x " +
													(input2.value || DEFAULT_PROTEIN_2)
}

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

import * as vis_helpers from './vis_helpers.js'

const colorize_labels = () => {
	let color = vis_helpers.compute_color(label_color_slider.value)
	
	color = color.toString(16)
	
	//console.log("value", color)
	
	label_one. style.color = color
	label_two. style.color = color
	label_both.style.color = color
}

label_color_slider.addEventListener('change', colorize_labels)

// screenshot buttons
const img = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmZmZmIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMuMiIvPgogICAgPHBhdGggZD0iTTkgMkw3LjE3IDRINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNmMxLjEgMCAyLS45IDItMlY2YzAtMS4xLS45LTItMi0yaC0zLjE3TDE1IDJIOXptMyAxNWMtMi43NiAwLTUtMi4yNC01LTVzMi4yNC01IDUtNSA1IDIuMjQgNSA1LTIuMjQgNS01IDV6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo="
const screenshot_one  = window.document.createElement("img")
const screenshot_two  = window.document.createElement("img")
const screenshot_both = window.document.createElement("img")

screenshot_one. src = img
screenshot_two. src = img
screenshot_both.src = img

screenshot_one. style.width = "30px"
screenshot_two. style.width = "30px"
screenshot_both.style.width = "30px"
				
screenshot_one. style.height = "30px"
screenshot_two. style.height = "30px"
screenshot_both.style.height = "30px"
				
screenshot_one. style.position = "sticky"
screenshot_two. style.position = "sticky"
screenshot_both.style.position = "sticky"
								
screenshot_one. style.top = "48px"
screenshot_two. style.top = "48px"
screenshot_both.style.top = "48px"
				
screenshot_one. style.left = "0px"
screenshot_two. style.left = "0px"
screenshot_both.style.left = "0px"
				
screenshot_one. style.pointerEvents = "auto"
screenshot_two. style.pointerEvents = "auto"
screenshot_both.style.pointerEvents = "auto"

const name_screenshot = _ => "vis-for3-" + (new Date()).getTime() + ".jpg"

const save_screenshot = (data, filename) => {
	let download_link = window.document.createElement("a")
	
	window.document.body.appendChild(download_link)
	download_link.download = filename
	download_link.href = data
	download_link.click()
	
	window.document.body.removeChild(download_link)
}

const make_screenshoter = (container) => {
	return () => {
		let canvas = container.getElementsByTagName("canvas")[0]
		let img_data = canvas.toDataURL("image/jpeg")
		
		save_screenshot(img_data.replace("image/jpeg", "image/octet-stream"), name_screenshot())
	}
}

screenshot_one. addEventListener("click", make_screenshoter(canvas_container_one))
screenshot_two. addEventListener("click", make_screenshoter(canvas_container_two))
screenshot_both.addEventListener("click", make_screenshoter(canvas_container_both))

stats_one_absolute_container. append(screenshot_one)
stats_two_absolute_container. append(screenshot_two)
stats_both_absolute_container.append(screenshot_both)

do_fetch()
colorize_labels()