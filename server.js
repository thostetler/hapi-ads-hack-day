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

  await server.register({
    plugin: require('@hapi/yar'),
    options: {
      storeBlank: false,
      cookieOptions: {
          password: 'the-password-must-be-at-least-32-characters-long',
          isSecure: true
      }
    },
  });

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
  });

  server.route({
    method: 'GET',
    path:'/abs/{id}',
    handler: async (request, h) => {
      await api.confirmSessionToken(request.yar);
      const response = await api.abstractSearch(request.params.id);
      if (!response.response) {
        return h.redirect('/');
      }
      let response_sources = await api.sourceSearch(request.params.id);
      if (!response_sources.links) {
        response_sources = { links: { records: [] } };
      }
      const { numFound, docs } = responseParser.parseAbstract(response.response);
      let sources = [];
      if (response_sources.links) {
        sources = response_sources.links.records;
      }
      return h.view('abstract', {
        page: 'abstract',
        title: 'abstract',
        query: request.query,
        docs,
        sources
      });
    }
  });

  server.route({ method: 'GET', path:'/search', handler: require('./lib/handlers/search') });
  server.route({
    method: 'GET',
    path: '/abs/{id}/export',
    handler: async (request, h) => {
      const response = await api.exportSearch(request.params.id);
      if (!response.export) {
        return h.redirect('/abs/{id}')
      }
      const exportcite = response.export;
      return h.view('export', {
        page: 'export',
        title: 'export',
        exportcite
      });
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
