const fs = require('fs');
const query = require('querystring');

const users = {};
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

const addUsers = (request, response) => {
  const newUser = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    newUser.push(chunk);
  });

  request.on('end', () => {
    const newUserString = Buffer.concat(newUser).toString();
    const newUserParams = query.parse(newUserString);
    if (users[newUserParams.name]) {
      users[newUserParams.name] = newUserParams;
      return respondJSONMeta(request, response, 204);
    } else if (newUserParams.name && newUserParams.age) {
      users[newUserParams.name] = newUserParams;
      const message = {
        message: 'Created Successfully',
      };
      return respondJSON(request, response, 201, message);
    }
    const message = {
      id: 'missingParams',
      message: 'Name and age are both required',
    };
    return respondJSON(request, response, 400, message);
  });
};

const notFound = (request, response) => {
  const responseJSON = {
    id: 'notFound',
    message: 'The page you were looking for was not found',
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getIndex,
  getCSS,
  getUsers,
  getUsersMeta,
  addUsers,
  notFound,
  notFoundMeta,
};
