const http = require('http');
const url = require('url');

const responseHandler = require('./responses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': responseHandler.getIndex,
    '/style.css': responseHandler.getCSS,
    '/getUsers': responseHandler.getUsers,
    '/notReal': responseHandler.notFound,
    notFound: responseHandler.notFound,
  },
  HEAD: {
    '/getUsers': responseHandler.getUsersMeta,
    '/notReal': responseHandler.notFoundMeta,
    notFound: responseHandler.notFound,
  },
  POST: {
    '/addUsers': responseHandler.addUsers,
    notFound: responseHandler.notFound,
  },
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
