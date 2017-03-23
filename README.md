# Blessing

Blessing is a CaaS (counter as a service). Its sole function is to increment a counter online.

### Usage

```javascript
var Blessing = require('blessing');

// increments the counter
var bless = new Blessing("Blessing's Name", console.log, {
	host: 'host.com',
	path: '/path',
	port: 80
});
bless.count();

// gets the counter
bless.fetch(callback).then(res => {
	// res.response will be of the type
	// {
	//		counter: 56,
	//		name: 'given name'
	// }
}
}).catch(e => {});

```

**IMPORTANT:** Even though Blessing is an object, it stores its ID, which means you can only have one blessing per application.

### Parameters

```javascript
new Blessing(name);
new Blessing(logger);
new Blessing(params);

new Blessing(name, logger, params);
new Blessing(name, params);
new Blessing(logger, params);
```


### Self Host
Blessing stores the counters at `blessing.jocolina.com`, however you can host your own server [here](https://github.com/jsmrcaga/blessing-server)

