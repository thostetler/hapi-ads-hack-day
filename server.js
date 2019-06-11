const fs = require('fs');
const Hapi = require('@hapi/hapi');
const http2 = require('http2');

const options = {
  key: fs.readFileSync('./localhost-privkey.pem'),
  cert: fs.readFileSync('./localhost-cert.pem'),
};

const init = async () => {

  const server = Hapi.server({
    listener: http2.createSecureServer(options),
    host: 'localhost',
    port: 3000,
    tls: true
  });

  server.route({
    method: 'GET',
    path:'/',
    handler: (request, h) => {
      return 'Hello World!';
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
