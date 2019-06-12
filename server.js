const fs = require('fs');
const path = require('path');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Pug = require('pug');
const http2 = require('http2');
const api = require('./lib/api');
const responseParser = require('./lib/responseParser');

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
  await server.register(Inert);

  server.views({
    engines: { pug: Pug },
    relativeTo: __dirname,
    path: 'views',
    compileOptions: {
      basedir: path.join(__dirname, 'views')
    }
  });

  server.route({
    method: 'GET',
    path:'/',
    handler: (request, h) => {
      return h.view('index', {
        page: 'index',
        title: 'Hapi ' + request.server.version,
        query: ''
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  })

  server.route({
    method: 'GET',
    path:'/abs/{id}',
    handler: async (request, h) => {
      const response = await api.abstractSearch(request.params.id);
      if (!response.response) {
        return
      }
      const { numFound, docs } = responseParser.parseAbstract(response.response);
      return h.view('abstract', {
        page: 'abstract',
        title: 'abstract',
        query: request.query,
        docs
      });
    }
  });

  server.route({ method: 'GET', path:'/search', handler: require('./lib/handlers/search') });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
