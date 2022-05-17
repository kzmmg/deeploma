import visualizer from './visualizer.js'

const INITIAL_PDB_ID = '6a5j'

function fetch_pdb(pdb_id1, pdb_id2) {
	
	window.fetch('./doobie.pdb')
		.then(response => response.text())
		.then((pdb1) => {
			
			window.fetch('./doobie2.pdb')
				.then(response => response.text())
				.then((pdb2) => {
					window.document.body.innerHtml = ''
					
					visualizer(window.document.body, pdb1, pdb2, {
						radius: slider.value,
						bonds: Boolean(check.checked),
						light: light_slider.value,
						zoom: zoom_slider.value,
						ambient: ambient_slider.value,
						bond_top_radius: bond_top_slider.value,
						bond_bottom_radius: bond_bottom_slider.value,
						fov: fov_slider.value,
						bb: Boolean(bb_check.checked),
					})
				})
				.catch(console.error.bind(console))
		})
		.catch(console.error.bind(console))
}

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
style_group(file_group, "File Group")

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


input.addEventListener('change', (event) => {
	fetch_pdb(input.value, input2.value)
})


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

input2.addEventListener('change', (event) => {
    fetch_pdb(input.value, input2.value)
})

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

check.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

check_group.append(check)

// create bounding boxes checkbox
const bb_check = window.document.createElement('input')

bb_check.type = 'checkbox'
bb_check.title = "draw bounding boxes"

bb_check.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

check_group.append(bb_check)

const slider_group = window.document.createElement("div")
control_group.append(slider_group)


// create radius slider
const slider = window.document.createElement('input')

slider.type = 'range'
slider.title = "atom radius"

slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

slider_group.append(slider)

// create light slider
const light_slider = window.document.createElement('input')

light_slider.type = 'range'
light_slider.value = 0
light_slider.title = "background"

light_slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

slider_group.append(light_slider)

// create ambient slider
const ambient_slider = window.document.createElement('input')

ambient_slider.type = 'range'
ambient_slider.value = 0
ambient_slider.title = "ambient"

ambient_slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

slider_group.append(ambient_slider)

// create zoom slider
const zoom_slider = window.document.createElement('input')

zoom_slider.type = 'range'
zoom_slider.value = 10
zoom_slider.title = "zoom"

zoom_slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

slider_group.append(zoom_slider)


// create bond top radius slider
const bond_top_slider = window.document.createElement('input')

bond_top_slider.type = 'range'
bond_top_slider.value = 10
bond_top_slider.title = "bond top radius"

bond_top_slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

slider_group.append(bond_top_slider)

// create bond bottom radius slider
const bond_bottom_slider = window.document.createElement('input')

bond_bottom_slider.type = 'range'
bond_bottom_slider.value = 10
bond_bottom_slider.title = "bond top radius"

bond_bottom_slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

slider_group.append(bond_bottom_slider)

// create fov slider
const fov_slider = window.document.createElement('input')

fov_slider.type = 'range'
fov_slider.value = 55
fov_slider.title = "field of view grad"
fov_slider.min = 0
fov_slider.max = 180

fov_slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

slider_group.append(fov_slider)

fetch_pdb(INITIAL_PDB_ID, INITIAL_PDB_ID)