var express = require('express');
var walker = require('./lib/walker.js');
var commandL10n = require('./lib/commandL10n.js');
var app = express();

app.set('port', process.env.PORT || 8000);

/*
*
* requires a path to a folder of files to read
* requires a path to the localization file with the key/value pairs
*
*/
var viewfolder = __dirname + '/test/mocks/content';
var localefolder = __dirname + '/test/mocks/localization/'
var localefile = localefolder + 'en.json';

var startTime;
var endTime;
var writeResults = true;

app.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	startTime = new Date();
	walker(viewfolder,function(files){
		commandL10n(files, localefile, writeResults)()
			.fin(function(){
				console.log('\nresults returned and written successfully');
				endTime =  new Date();
				var totalTime = endTime - startTime;
				var ms = totalTime;
				var minutes = (ms/1000/60) << 0;
				var seconds = ((ms/1000) % 60) * 100;
				seconds = ~~seconds / 100;
				console.log(minutes + ' minutes : ' + seconds + ' seconds');
			})
			.fail(function(error){
				console.log(error);
			})
	})

});

