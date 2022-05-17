const fs = require("fs")

const print_guess_classes = () => {
	let ls = fs.readdirSync("../")
	
	ls = ls.filter((name) => {
		return name.indexOf("generic") === -1 && name.indexOf("guess_") !== -1
	})
	
	ls.forEach((name) => {
		console.log("\t" + name.split(".")[0])
	})
}

if (process.argv.length === 2 || process.argv.length !== 5) {
	//console.log(process.argv)
	console.log("\nProtein initial alignment tool ('guess framework')")
	console.log("==========================\n")
	
	console.log("Syntax:")
	console.log("\trun <path-to-pdb1> <path-to-pdb2> <guess-class-name>")
	
	console.log("Available guess classes")
	print_guess_classes()
	
	process.exit(0)
}

let pdb1 = process.argv[2]
let pdb2 = process.argv[3]

let guess_class = process.argv[4]

let guess = require("../" + guess_class + ".js")

new guess(pdb1, pdb2).do_guess()

process.exit(0)