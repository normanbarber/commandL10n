var path = require('path');
var fs = require('fs');
var Q = require('q');
var _ = require('lodash-node');

var fsmodule = {
	readLocaleFile: function(viewstrings,localestrings){

		var all = [];
		var viewVar = viewstrings.match(/'(.*?)'/g)

		viewVar = _.map(viewVar, function(view){
			return  view.replace(/'|"/g,'');
		})

        // todo allow for looping an array of files in the locales folder
		var promise = Q.nfcall(fs.readFile, localestrings, 'utf-8')
			.then(function(localefile) {
				localefile = localefile.replace(/\n\t|"|'|\{|\}/g,"");

				var locales = localefile.split(',');
				var newloc = _.map(locales, function(loc){
					return loc.match(/(.*)[\:]/)[0].replace(':','')
				})
				var unused = _.filter(newloc, function(local){
					// filter out the unused keys from the locale file
					// viewVar = array of all localized string vars pulled from view files
					// local = this is a single key from the key/value pairs in the locale file. looping thru each key one at a time

					// only returns and filters localized key if it is not contained in any of the view files the were read
					return _.contains(viewVar,local) ? null : local;

				})

				console.log('\n\nfilename = ' + localestrings);
				console.log('\n ================ unused keys found in this file ================ ');
				console.log(unused);

			})
			.fail(function(error){
				return Q.reject(error);
			})

		return Q.allSettled(all)
			.then(function(promises){
				return Q(_.map(promises, Q.nearer));
			})

	},
	matchViewVars: function(view){
		view = view.replace(/"/g,"'");
		var localevar = view.match(/{__\(\'(.*?)\'\)}|{__\(\"(.*?)\"\)}/g);
		return localevar;
	},
	getViewVars: function(viewfiles){
		var all = [];
		var promise = null;
		var self = this;
		_.each(viewfiles,function(filepath){
			promise = Q.nfcall(fs.readFile, filepath, 'utf-8')
				.then(function(view) {
					return Q(self.matchViewVars(view));
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
	}
}

module.exports = function(viewfiles, localefile) {

	return function() {
		console.log('\nstep 2 0f 3: reading file for viewstrings. pleast wait...\n')
		return fsmodule.getViewVars(viewfiles)
			.fail(function(error) {
				return Q.reject(error);
			})
			.then(function(data) {
			   var values =  _.merge(data);
				return fsmodule.readLocaleFile(JSON.stringify(values),localefile)
			})
			.then(function(){
				return;
			})
	}
};