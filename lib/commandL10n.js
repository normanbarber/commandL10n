var path = require('path');
var fs = require('fs');
var Q = require('q');
var _ = require('lodash-node');

var fsmodule = {
	readLocaleFile: function(viewstrings,localestrings){

		var all = [];
		var viewlocale = viewstrings.match(/'(.*?)'/g)

		var viewfilekeys = _.map(viewlocale, function(view){
			return  view.replace(/'|"/g,'');
		});

		var promise = Q.nfcall(fs.readFile, localestrings, 'utf-8')
			.then(function(localefile) {
				var localecode = localefile.replace(/\r|\n|\t|^\s+|\s+$|"|'|\{|\}/g,"");

				var locales = localecode.split(',');
				var localefilekeys = _.map(locales, function(str){
					return str.match(/(.*)[\:]/)[0].replace(':','').replace(/^\s+|\s+$/g,"")
				})
				var usedkeys = _.intersection(localefilekeys, viewfilekeys);
				return Q(usedkeys);
			})
			.fail(function(error){
				return Q.reject(error);
			});

		all.push(promise);
		return Q.allSettled(all)
			.then(function(promises){
				return Q(_.map(promises, Q.nearer));
			})

	},
	getViewLocales: function(viewcode){
		viewcode = viewcode.replace(/"/g,"'");
		var localevar = viewcode.match(/{__\(\'(.*?)\'\)}|{__\(\"(.*?)\"\)}|localize\[\]/g);
		return localevar;
	},
	readViewFiles: function(viewfiles){
		var all = [];
		var promise = null;
		var self = this;
		_.each(viewfiles,function(filepath){
			promise = Q.nfcall(fs.readFile, filepath, 'utf-8')
				.then(function(view) {
					return Q(self.getViewLocales(view));
				})
				.fail(function(error){
					return Q.reject(error);
				})
			all.push(promise);
		})

		return Q.allSettled(all)
			.then(function(promises) {
				return Q(_.map(promises, Q.nearer));
			})
	},
	handleResultsWriteToFile: function(filepath,updatedjson){
		fs.writeFile(filepath, updatedjson, function(error){
			if(error)
				return Q.reject(error)

			return Q(updatedjson);
		})
	},
	handleResultsLogToConsole: function(updatedjson){
		console.log('****************** updated localization ************************');
		console.log(updatedjson);
	},
	handleResults: function(usedlocales,localefile){

		var all = [];
		var localearray = [];
		var promise = Q.nfcall(fs.readFile, localefile, 'utf-8')
			.then(function(locales){

				var localecode = locales.replace(/\r|\n|\t|\{|\}/g,"").replace(/,\s+/g,',');
				localearray = localecode.split(',');

				var updatedjson = _.filter(localearray, function(str){
					var key = str.match(/(.*)[\:]/)[0].replace(':','').replace(/^\s+|\s+$|"/g,"");
					return  _.contains(usedlocales,key) ? str : null
				});

				updatedjson = '{\r\n\t' + updatedjson + '\n}';
				updatedjson = updatedjson.replace(/\,/g, ',\r\n\t');

				return Q(updatedjson);
			})
			.fail(function(error){
				return Q.reject(error);
			});

		all.push(promise);
		return Q.allSettled(all)
			.then(function(promises){
				return Q(_.map(promises, Q.nearer))
			});
	}
};

module.exports = function(viewfiles, localefile, writeResults) {

	return function() {
		console.log('\nstep 2 0f 3: reading file for viewstrings. pleast wait...\n')
		return fsmodule.readViewFiles(viewfiles)
			.fail(function(error) {
				return Q.reject(error);
			})
			.then(function(data) {
			   var values =  _.merge(data);
				return fsmodule.readLocaleFile(JSON.stringify(values),localefile)
			})
			.then(function(data){
				return fsmodule.handleResults(data[0].value,localefile);
			})
			.then(function(data){
				console.log('\nstep 3 0f 3: handling results.\n');
				if(writeResults)
					fsmodule.handleResultsWriteToFile(localefile,data[0].value);

				fsmodule.handleResultsLogToConsole(data[0].value);
			})
	}
};