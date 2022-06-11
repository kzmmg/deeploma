const assert = require("assert")

const sf = require("../mtour_scoring_function.js")

const id = _ => _

let problem = { 
	molecule1: { 
		vertices: [
			{
				x:1,
				y:2,
				z:3
			}, 
			{
				x:4,
				y:5,
				z:6
			}
		] 
	},  
	molecule2: { 
		vertices: [
			{
				x:-10,
				y:-20,
				z:-30
			},
			{
				x:-11,
				y:-21,
				z:-31
			},{
				x:-5,
				y:-6,
				z:-7
			}
		] 
	} 
}

let sfi = new sf(problem)

let res = sfi.score_inj({ vector: [] }, id)

assert(res === 4 + 11 + 5 + 21 + 6 + 31)

// integrity test without testing library

problem = { 
	molecule1: { 
		atoms: [
			{
				x:1,
				y:2,
				z:3
			}, 
			{
				x:4,
				y:5,
				z:6
			}
		] 
	},  
	molecule2: { 
		atoms: [
			{
				x:-10,
				y:-20,
				z:-30
			},
			{
				x:-11,
				y:-21,
				z:-31
			},
			{
				x:-5,
				y:-6,
				z:-7
			}
		] 
	} 
}

sfi = new sf(problem)
sfi.score({ vector: [1,2,3,4,5,6,7,8,9,10,11,12] })

