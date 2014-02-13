var fs = require('fs')
	, path = require('path')
	, ini = require('ini')
	, osenv = require('osenv')
	;

var homeConfigPath = osenv.home() + '/.config/rcfmgr.ini';
var config = {};

try{
	var stat = fs.statSync(homeConfigPath);
	var inistring = fs.readFileSync(homeConfigPath)
	if(inistring.length > 0){
		var homeConfig = ini.parse(inistring.toString());
	};
} catch(err) {
	console.log(err.message);
	process.exit(1);
}

for(prop in homeConfig.rcf){
	config[prop] = homeConfig.rcf[prop];
};

var Conf = module.exports = config;

