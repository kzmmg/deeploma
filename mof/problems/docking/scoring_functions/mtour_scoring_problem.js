const docking_problem = require("../docking_problem.js")
const mtour_scoring_function = require("./mtour_scoring_function.js")

class mtour_scoring_problem extends docking_problem {
	get_scoring_function() {
		this.scoring_function = new mtour_scoring_function(this)
	}
}

module.exports = mtour_scoring_problem
