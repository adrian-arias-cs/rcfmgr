#!/usr/bin/env node

var version = '0.0.1';

var OK = 0
	, INVALID_ARGS = 1
	, NO_USERNAME = 2
	, NO_APIKEY
	, NO_REGION
	;

var Getopt = require('node-getopt')
	, path = require('path')
  ;

var RcfMgr = require('./lib/rcfmgr/');

var config = require('./lib/rcfmgr/config');
config.provider = 'rackspace';
config.authUrl = 'https://identity.api.rackspacecloud.com/';

if(!config.username || config.username.length < 1){
	console.log('No username in config');
	process.exit(NO_USERNAME);
};

if(!config.apiKey || config.apiKey.length < 1){
	console.log('No API key in config');
	process.exit(NO_APIKEY);
};

var getopt = new Getopt([
  ['q', 'quiet',              'quiet mode'],
  ['v', 'version',            'print version'],
  ['c', 'create-containers',  'create the listed containers'],
  ['',  'container=ARG+',     'deploy the the specified container'],
  ['f', 'force-yes',          'force yes to conditions which require a Y/n answer'],
  ['l', 'list-files',         'list the files in a container'],
  ['u', 'upload-file',        'upload a file to a container'],
  ['d', 'delete-file',        'delete a file to a container'],
  ['h', 'help',               'print usage']
]);

getopt.setHelp(
	"Usage: node index.js [OPTION]\n" +
	"\n" +
	"[[OPTIONS]]\n"
).bindHelp();

opt = getopt.parseSystem();
//console.dir(process.env);
//console.dir(opt);

if(opt.options['force-yes'] === true){
	global.FORCE_YES = true;
};

var rcfmgr = new RcfMgr(config);

if(Object.keys(opt.options).length < 1){
	console.log(getopt.getHelp());
	process.exit(OK);
};

if(opt.options.version){
	console.log(version);
	process.exit(OK);
};

if(opt.options['create-containers']){
	console.dir(opt);
	if(opt.argv.length < 1){
		console.log(
			'One or more containers must be specified as arguments: \n' + 
			'\tnode index.js -c <container 1> <container 2>'
		);
		process.exit(INVALID_ARGS);	
	};

	var containers = opt.argv;
	rcfmgr.createContainers(containers, function(){
		process.exit(OK);
	});
};

if(opt.options['list-files']){
	// TODO: support listing multiple containers
	if(opt.argv.length != 1){
		// error condition
	};
	var container = opt.argv[0];
	rcfmgr.listFilesInContainer(container, function(){
		process.exit(OK);
	});
};

if(opt.options['upload-file']){
	if(opt.argv.length < 1){
		console.log('no files specified');
		process.exit(INVALID_ARGS);
	};
	if(opt.options.container.length != 1){
		// TODO: handle uploads to multiple containers.
		console.log('specify only one container name');
		process.exit(INVALID_ARGS);
	};
	// get basename and full filename
	var file = opt.argv[0];
	var container = opt.options.container[0];
	var uploadOpts = {
		file: path.resolve(file),
		container_name: container,
		file_name: path.basename(file)
	};
	//console.dir(uploadOpts);
	rcfmgr.uploadFileToContainer(uploadOpts, function(){
		console.log('uploaded file ' + file + ' to container ' + container);
		process.exit(OK);
	});
};

if(opt.options['delete-file']){
	if(opt.argv.length < 1){
		console.log('no files specified');
		process.exit(INVALID_ARGS);
	};
	if(opt.options.container.length != 1){
		console.log('specify only one container name');
		process.exit(INVALID_ARGS);
	};

	var file = path.basename(opt.argv[0]);
	var container = opt.options.container[0];

	rcfmgr.deleteFileFromContainer(container, file, function(){
		console.log('deleted file ' + file + ' from container ' + container);
		process.exit(OK);
	});
};

