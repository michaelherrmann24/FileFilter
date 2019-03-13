var bs = require("browser-sync");
var svr = bs.create();

svr.init({
	server: './dist',
	https:true,
	httpModule:'http2',
	port: 8081
});
