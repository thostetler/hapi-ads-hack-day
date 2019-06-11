const Hapi = require('hapi');
const fs = require('fs');
const Http2 = require('http2');
const server = new Hapi.Server();

// read certificate and private key
const serverOptions = {
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem')
};

// create http2 secure server listener
const listener = Http2.createSecureServer(serverOptions);

// create a connection object with listener and other options
server.connection({
  listener,
  port: '8000'
});``

// define routes
server.route([{
  method: 'GET',
  path: '/ping',
  handler: (request, reply) => {
    reply('pong');
  }
}]);

// start server
server.start(err => {
  if (err) console.error(err)
  console.log(`Started ${server.connections.length} connections`)
});
