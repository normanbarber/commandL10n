#!/usr/bin/env node
var walker = require('../lib/walker.js');
var commandL10n = require('../lib/commandL10n.js');
var commander = require('commander');

commander
	.version('0.0.1')
	.option('-v, --viewfolder [string]', '[string] - folder you want to read recursively')
	.option('-l, --localefile [string]', '[string] - file name and path to locale file')
	.option('-w, --write [boolean]', '[boolean] - default value = false -  returns results overwriting code in xy.json file')
	.parse(process.argv);

commander.parse(process.argv);

if (!commander.viewfolder) {
	throw new Error('you must enter a path to your view files to read ie --viewfolder "path/to/your/folder"');
}

function main(){
	var viewfolder = commander.viewfolder
	var localefile = commander.localefile ? commander.localefile : commander.viewfolder;

	if(typeof commander.write == 'string')
		commander.write = commander.write.replace(/'|"/g,"")
	var writeResults = (commander.write && commander.write != 'false') ? commander.write : false;

	walker(viewfolder,function(files){
		commandL10n(files, localefile, writeResults)()
			.fin(function(){
				if(writeResults)
					console.log('\nresults returned and written successfully');
				else
					console.log('\nresults returned successfully');
			})
			.fail(function(error){
				console.log(error);
			})
	})
}
main();