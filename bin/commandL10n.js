#!/usr/bin/env node
var walker = require('../lib/walker.js');
var commandL10n = require('../lib/commandL10n.js');
var commander = require('commander');

commander
	.version('0.0.1')
	.option('-v, --viewfolder [string]', '[string] - folder you want to read recursively')
	.option('-l, --localefile [string]', '[string] - file name and path to locale file')
	.parse(process.argv);

commander.parse(process.argv);

if (!commander.viewfolder) {
	throw new Error('you must enter a path to your view files to read ie --viewfolder "path/to/your/folder"');
}

function main(){
	var viewfolder = commander.viewfolder
	var localefile = commander.localefile ? commander.localefile : commander.viewfolder;

	walker(viewfolder,function(files){
		commandL10n(files, localefile)()
			.fin(function(){
				console.log('\nresults returned and written successfully');
			})
			.fail(function(error){
				console.log(error);
			})
	})
}
main();