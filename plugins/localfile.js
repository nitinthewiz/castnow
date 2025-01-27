var http = require('http');
var getPort = require('get-port');
var internalIp = require('internal-ip');
var fs = require('fs');
var path = require('path');

var isFile = function(path) {
  return fs.existsSync(path) && fs.statSync(path).isFile();
};

var localfile = function(ctx, next) {
  if (ctx.mode !== 'launch') return next();
  if (!isFile(ctx.options.path)) return next();
  var filePath = ctx.options.path;

  getPort(function(err, port) {
    ctx.options.path = 'http://' + internalIp() + ':' + port;
    ctx.options.type = 'video/mp4';
    ctx.options.media = {
      metadata: {
        title: path.basename(filePath)
      }
    };
    http.createServer(function(req, res) {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    }).listen(port);
    next();
  });
};

module.exports = localfile;
