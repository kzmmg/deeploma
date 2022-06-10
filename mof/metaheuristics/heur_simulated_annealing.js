const assert = require('assert')

const generic_algorithm = require('../generic/generic_algorithm.js')

// simulated annealing algorithm

// cooling schedule
const cooling_scheme = { ARITHMETIC : 0, GEOMETRIC : 1 }

class simulated_annealing extends generic_algorithm {
	constructor(problem, config) {
		super(problem, config)
		
		//
	   	// cooling_scheme - cooling scheme options
	   	// boltzman_const - boltzmann constant value 
	   	// temperature_scope - defines min/max value for temperature 
	   	// check_localoptima - true will check for local optima at every search step
		// temperature - runtime state
		
		this.temperature = void 0
		
		this.cooling_scheme = cooling_scheme.ARITHMETIC
		this.boltzman_const = 0.05
		this.temperature_scope = [1,100] // max value will be used as initial temperature 
		this.check_localoptima = false
		
		if(config && config.cooling_scheme != void 0) 
			this.cooling_scheme = config.cooling_scheme
		if(config && config.boltzman_const != void 0) 
			this.boltzman_const = config.boltzman_const
		if(config && config.temperature_scope != void 0) 
			this.temperature_scope = config.temperature_scope
		if(config && config.check_localoptima != void 0) 
			this.check_localoptima = config.check_localoptima
	}
	
	
	init(){
		this.temperature = this.temperature_scope[1] //init to max temperature
		super.init.apply(this, arguments)
	}
	
	_compute_probability(neiburr) {
		//relative fitness delta :   
		//	f(s')-f(s) / f(s)
		
		let delta_e = 
			Math.abs(
				(this.problem.fitness(neiburr) - this.problem.fitness(this.current_sol)
			) / this.problem.fitness(this.current_sol));
			
		let p = Math.exp(-delta_e / (this.boltzman_const * this.temperature)) // gives (0,1]
		
		return p
	}
	
	step(step_num) {
		
		let neiburr = this.neighbor(this.current_sol)
		
		console.log(neiburr)
		if (this._better(neiburr, this.current_sol)) {
			this.current_sol = neiburr
		} else {
			let p = this._compute_probability(neiburr)
		
			//accept with probablity p
			if(Math.random() <= p) 
				this.current_sol = neiburr
		}
		this._update_temperature()
	
		if (this.check_localoptima)
			this.local_trap = this._check_localoptima()
	}
	
	_update_temperature(){
		if(this.cooling_scheme == cooling_scheme.ARITHMETIC) {
			// (T_max - T_min) / N  
			let theta = (this.temperature_scope[1] - this.temperature_scope[0]) / this.terminate_ls_steps
			
			this.temperature -= theta
		} else if(this.cooling_scheme == cooling_scheme.GEOMETRIC) {
			 
			// (T_min/T_max)^(1/N)
			var alpha = Math.pow( this.temperature_scope[0]/this.temperature_scope[1], 1/this.terminate_ls_steps );
			
			this.temperature *= alpha
		}
		else assert(false, "cannot be")
	}
	
	//returns true if current solution is a local optima
	// O(K) time complexity 
	_check_localoptima () {
		let neiburrs = this.neighbors(this.current_sol)
		
		if(neiburrs.length === 0)
			return true
		
		let better_neiburr = void 0
		
		for (let i = 0; i < neiburrs.length; i++) {
			let neiburr = neiburrs[i]
			
			if(this._better(neiburr, this.current_sol)) 
				better_neiburr = neiburr
		}
		
		return (better_neiburr === void 0) 
	}
}

module.exports = simulated_annealing