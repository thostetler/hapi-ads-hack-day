const fs = require('fs');
const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Ejs = require('ejs');
const http2 = require('http2');
const api = require('./lib/api');

const options = {
  key: fs.readFileSync('./localhost-privkey.pem'),
  cert: fs.readFileSync('./localhost-cert.pem'),
};

const init = async () => {

  const server = Hapi.server({
    listener: http2.createSecureServer(options),
    host: 'localhost',
    port: 8000,
    tls: true
  });

  await server.register(Vision);

  server.views({
    engines: { ejs: Ejs },
    relativeTo: __dirname,
    path: 'views',
    layout: 'layout'
  });

  server.route({
    method: 'GET',
    path:'/',
    handler: (request, h) => {
      return h.view('index', {
        title: 'Hapi ' + request.server.version
      });
    }
  });

  server.route({
    method: 'GET',
    path:'/search',
    handler: (request, h) => {
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
