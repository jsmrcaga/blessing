const fishingrod = require('fishingrod');
function Blessing(name, logger, params){
	const fs = require('fs');

	if(name instanceof Function){
		console.log('Name is function');
		logger = name;
		name = undefined;
	}

	if(name instanceof Object){
		console.log('Name is Object');
		params = name;
		name = undefined;
	}

	if(logger instanceof Object && !(logger instanceof Function)){
		console.log('Logger is Object');
		params = logger;
		logger = undefined;
	}

	if(!params || !(params instanceof Object)){
		params = {}
	}

	this.name = name;
	this.logger = logger || console.log;
	this.params = params;

	var parent = this;
	try{
		var app_id = require(__dirname + '/blessing_id.json').app_id;
	} catch(e) {
		var generateUUID = function(){
			function s4(){
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}

			return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
		};
		var app_id = generateUUID();
		parent.logger('Your application has been blessed with its id!', app_id);
		fs.writeFile(__dirname + '/blessing_id.json', JSON.stringify({app_id:app_id}), (err)=>{
			if(err){
				console.error('Could not save Blessing id :/ sorry');
			}
		});
	}
	this.app_id = app_id;

	this.count();	

	return this;
};

Blessing.prototype.fetch = function(callback){
	console.log((this.params.path || '/') + (this.name || this.app_id));
	return fishingrod.fish({
		method: 'GET',
		host: this.params.host || 'blessing.jocolina.com',
		path: (this.params.path || '/') + (this.name || this.app_id),
		port: this.params.port || 80
	}, callback);
};

Blessing.prototype.count = function(){
	var parent = this;
	fishingrod.fish({
		method: 'POST',
		host: this.params.host || 'blessing.jocolina.com',
		path: this.params.path || '/',
		data:{
			app_id: this.app_id,
			name: this.name || undefined
		},
		headers:{
			'Content-Type':'application/json'
		},
		port: parent.params.port || 80
	}).then((res)=>{
		console.log(res.status);
		if(res.status === 200){
			parent.logger('You have been blessed!\n' + res.response);
		} else {
			console.log(res.status, res.response);
			parent.logger('Your application cannot be blessed!');
		}
	}).catch((e)=>{
		// lets forget about that
		console.log(e);
	});
}

module.exports = Blessing;