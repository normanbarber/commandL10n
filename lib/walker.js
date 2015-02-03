var walk= require('walkdir');
var path = require('path');
var _ = require('lodash-node');
var fs = require('fs');
var Q = require('q');
module.exports = function(viewfolder,callback) {
	console.log('\nstep 1 of 3: walking folder and sub-folders. pleast wait...\n');
	var files=[];
	walk(viewfolder, function(file){
        files.push(file);
	})
	.on('error',function(error){
		console.log('The folder you are trying to read from is either misspelled or does not exist');
		console.log('This is the path causing the error = ' + error);
	})
	.on('end', function(){
		return callback(files);
	});
};