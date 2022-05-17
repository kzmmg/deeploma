const fs = require("fs")
const assert = require("assert")

const { pdb_parser } = require("../parsers").pdb_parser
const { serialize_to_simplified_pdb } = require("../parsers").serializer

class guess_generic {
	constructor(pdb1, pdb2) {
		this.pdb1 = pdb1
		this.pdb2 = pdb2
	}
	
	_load_pdb(pdb) {
		let data = fs.readFileSync(pdb, 'utf-8')
		let atom = pdb_parser(data)
		
		return atom
	}
	
	guess(molecule1, molecule2) {
		assert(false) // subs should implement it
	}
	
	_get_filename_prefix(pdb) {
		return pdb.split("/").pop().split(".")[0] + ".guessed-by." + this.constructor.name
	}
	
	do_guess() {
		this.molecule1 = this._load_pdb(this.pdb1)
		this.molecule2 = this._load_pdb(this.pdb2)
		
		this.guess(this.molecule1, this.molecule2)
		
		serialize_to_simplified_pdb(this._get_filename_prefix(this.pdb1), this.molecule1)
		serialize_to_simplified_pdb(this._get_filename_prefix(this.pdb2), this.molecule2)
	}
}

module.exports = guess_generic