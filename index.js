#!/usr/bin/env node

var pkgcloud = require('pkgcloud')
  , node_getopt = require('node-getopt')
  ;

var opt = node_getopt.create([
  ['q', 'quiet',          'quiet mode'],
  ['v', 'version',        'print version'],
  ['',  'container=ARG+', 'deploy the the specified container'],
  ['y', 'yes',            'force yes to conditions which require a Y/n answer'],
  ['h', 'help',           'print usage']
])
.bindHelp()
.parseSystem();

//console.dir(process.env);
//console.dir(opt);

var client = pkgcloud.storage.createClient({
  provider: 'rackspace',
  username: 'Adrian.Arias',
  apiKey: 'acab793d007f4dbcbbd47f925822d316',
  authUrl: 'https://identity.api.rackspacecloud.com/',
  region: 'DFW'
});

var containers = opt.options.container;

containers.forEach(function(element, index){
  client.getContainer(element, function(err, container){
    if(err){
      if(err.statusCode == 404){
        if(opt.options.yes){
          console.info('Creating container: ' + element);
          client.createContainer({
            name: element,
            metadata: {
              project: 'teamup'
            }
          }, function(err, newContainer){
            if(err) throw err;
            console.dir(newContainer);
          });
        } else {
          console.error('Invalid container specified: ' + element); 
        }
      } else {
        console.error(err);
        throw err;
      }
    } else {
      console.dir(container);
    }
  });
});

