const docking_problem = require("../docking_problem.js")
const wvol_scoring_function = require("./wvol_scoring_function.js")

class wvol_scoring_problem extends docking_problem {
	get_scoring_function() {
		this.scoring_function = new wvol_scoring_function(this)
	}
}

module.exports = wvol_scoring_problem
