const assert = require("assert")

const wvol_scoring_problem = require("../wvol_scoring_problem.js")

const docking_solution = require('../../docking_solution.js')

let problem = new wvol_scoring_problem([
	{
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
	{	
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
])

let sol = new docking_solution([1,2,3,4,5,6,7,8,9,10,11,12])

let fit = problem.fitness(sol)

console.log(fit)