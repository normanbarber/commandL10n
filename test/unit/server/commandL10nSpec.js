var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module'),
	Q = require('q');

chai.use(require('sinon-chai'));

describe('Walking and read folder and subfolders', function() {
	process.setMaxListeners(0);	// avoid Q promise library warning

	var env = {};

	beforeEach(function() {
		env.viewstrings = [
			'somekey1',
			'somekey2',
			'somekey3',
			'somekey4',
			'somekey5',
		]

		env.fs = {
			readFile: sinon.stub()
		};
		env.fs.readFile.returns(env.viewstrings);

		env.commandL10n = sandbox.require('../../../lib/commandL10n', {
			requires: {
				'fs': env.fs
			}
		});
	});

	describe('Testing Main Module', function() {
		beforeEach(function() {
			var viewfolder = ['path/to/viewfile.jade','path/to/another/viewfile.jade','path/to/viewfile.jade'];
			var localefile = 'path/to/write/folder';
			env.commandL10n(viewfolder, localefile)();
		});
		describe('testing main and fs modules', function() {

			it('should expect fs.readFile to be called 3 times', function() {
				expect(env.fs.readFile).to.have.been.calledThrice;
			});
			it('should return expected behavior', function() {
				expect(env.fs.readFile.defaultBehavior.returnValue).to.equal(env.viewstrings);
			});
		});
	});
});

