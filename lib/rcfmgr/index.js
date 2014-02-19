var pkgcloud = require('pkgcloud')
	, util = require('util')
	;

var RcfMgr = function(conf){
	this.client = pkgcloud.storage.createClient(conf);
};

RcfMgr.prototype.createContainers = function(containers, cb){
	var self = this;
	var procedContainers = 0;

  containers.forEach(function(element, index){
    self.client.getContainer(element, function(err, container){
      if(err){
        if(err.statusCode == 404){
          if(global.FORCE_YES){
            console.info('Creating container: ' + element);
						debugger;
            self.client.createContainer({
              name: element,
              metadata: {
                project: 'teamup'
              }
            }, function(err, newContainer){
              if(err) throw err;
              //console.dir(newContainer);
							debugger;
							//self.client.getContainer(newContainer.name, function(err, nc){
							//	debugger;
							//	nc.enableCdn(function(poo, doodoo){
							//		debugger;
							//	});
							//});
							//newContainer.enableCdn(function(poo, doodoo){
							//	debugger;
							//});
							//self.makeContainerCDNEnabled(newContainer, function(result){
							//	debugger;
							//	procedContainers++;
							//	if(procedContainers === containers.length){
							//		cb();
							//	};
							//});
            });
          } else {
						// TODO: prompt user for input, confirm container creation
            console.log('Containers not created without the force-yes option set: ' + element); 
          };
        } else {
          console.error('Unknown error');
          throw err;
        };
      } else {
				console.log('Container already exists: ' + element);
        //console.dir(container);
      };
    });
  });
};

RcfMgr.prototype.listContainers = function(){
	var self = this;
	this.client.getContainers({loadCDNAttributes: true}, function(err, containers){
		debugger;
		containers.forEach(function(el, index){
			console.log(el.name);
		});
	});
};

RcfMgr.prototype.listFilesInContainer = function(container_name, cb){
	var self = this;
	console.log('listing files in container "' + container_name + '"...\n');
	this.client.getContainer(container_name, function(err, container){
		debugger;
		if(!err){
			self.client.getFiles(container, function(err, files){
				debugger;
				if(err) throw err;
				if(files.length > 0){
					files.forEach(function(el, index){
						console.log('\t' + el.name + '\t' + el.container.cdnUri + '/' + el.name);
					});
					console.log('\n');
					cb();
				} else {
					console.log('No files in container ' + container_name);
				}
			});
		} else {
			// TODO: handle error better. it's possible the container doesn't exist.
			console.error(err.message);
			throw err;
		};
	});
};

RcfMgr.prototype.downloadFileFromContainer = function(opts){
	if(!opts || Object.keys(opts).length < 2 || Object.keys(opts).length > 4) throw 'invalid call to downloadFileFromContainer'
	if(!opts.file_name || opts.file_name.length < 1) throw 'invalid call to downloadFileFromContainer. Specify a proper file_name'
	if(!opts.container_name || opts.container_name.length < 1) throw 'invalid call to downloadFileFromContainer. Specify a proper container_name'

	var download_dir = opts.download_dir || '.';

	var options = {
		container: opts.container_name,
		remote: opts.file_name,
		local: download_dir + '/' + opts.file_name
	};

	this.client.download(options, function(err, result){
		if(err) throw err
		console.dir(result);
	});
};

RcfMgr.prototype.uploadFileToContainer = function(opts, cb){
	if(!opts || Object.keys(opts).length != 3) throw 'invalid call to uploadFileToContainer';
	if(!opts.file_name || opts.file_name.length < 1) throw 'invalid call to uploadFileToContainer';
	if(!opts.container_name || opts.container_name.length < 1) throw 'invalid call to uploadFileToContainer';
	if(!opts.file || opts.file.length < 1) throw 'invalid call to uploadFileToContainer';

	var options = {
		container: opts.container_name,
		remote: opts.file_name,
		local: opts.file
	};

	this.client.upload(options, function(err, result){
		if(err) throw err;
		cb();
		//console.dir(result);
	});
};

RcfMgr.prototype.deleteFileFromContainer = function(container, file){
	if(!container || container.length <= 0) throw 'invalid call to deleteFileFromContainer';
	if(!file || file.length <= 0) throw 'invalid call to deleteFileFromContainer';

	this.client.removeFile(container, file, function(err, result){
		if(err) throw err
		console.log(result);
		console.log('Successfully removed file ' + file + ' from container ' + container);
	});
};

RcfMgr.prototype.makeContainerCDNEnabled = function(container, cb){
	var self = this;
	this.client.setCdnEnabled(container, function(err, result){
		debugger;
		if(err) throw err;
		cb(result);
	});
};

exports = module.exports = RcfMgr;
