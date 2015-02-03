var express = require('express');
var walker = require('./lib/walker.js');
var commandL10n = require('./lib/commandL10n.js');
var app = express();

app.set('port', process.env.PORT || 8000);

var viewfolder = 'C:/Users/nbarber/workspace/ca-workspace/github/commandL10n/test/views';
var localefile = 'C:/Users/nbarber/workspace/ca-workspace/github/commandL10n/test/locales/en.json';

var startTime;
var endTime;
app.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	startTime = new Date();
	walker(viewfolder,function(files){
		commandL10n(files, localefile)()
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

