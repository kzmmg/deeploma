const docking_problem = require("../docking_problem.js")

class mtour_docking_problem extends docking_problem {
	get_scoring_function() {
		this.scoring_function = new mtour_scoring_function(this)
	}
}

module.exports = mtour_docking_problem
