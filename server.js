const fs = require('fs');
const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Ejs = require('ejs');
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
        page: 'index',
        title: 'Hapi ' + request.server.version,
        query: ''
      });
    }
  });

  server.route({
    method: 'GET',
    path:'/abs',
    handler: (request, h) => {
      return h.view('abstract', {
        page: 'abstract',
        title: 'abstract',
        query: ''
      });
    }
  });

  server.route({
    method: 'GET',
    path:'/search',
    handler: async (request, h) => {
      if (Object.keys(request.query).length === 0) {
        return h.redirect('/');
      }
      const response = await api.search(request.query);
      console.log(response.response.docs[0]);

      if (!response.response) {
        return h.redirect('/');
      }

      const { numFound, docs } = responseParser.parse(response.response);
      return h.view('search', {
        query: request.query,
        title: request.query.q + ' | Search',
        page: 'search',
        numFound,
        docs
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
