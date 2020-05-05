'use strict';

const proxyPath = '/mv';

module.exports = function(app) {
  // For options, see:
  // https://github.com/nodejitsu/node-http-proxy
  let proxy = require('http-proxy').createProxyServer({});

  proxy.on('error', function(err, req) {
    console.error(err, req.url);
  });

  app.use(proxyPath, function(req, res){
    proxy.web(req, res, {changeOrigin: true, target: 'http://www.keyforgegame.com' });
  });
};
