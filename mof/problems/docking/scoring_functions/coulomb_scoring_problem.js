const docking_problem = require("../docking_problem.js")

const coulomb_scoring_function = require("./coulomb_scoring_function.js")

class coulomb_scoring_problem extends docking_problem {
	get_scoring_function() {
		this.scoring_function = new coulomb_scoring_function(this)
	}
}

module.exports = coulomb_scoring_problem