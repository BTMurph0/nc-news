const fs = require("fs/promises");

exports.getEndpoints = (request, response, next) => {
  fs.readFile(`./endpoints.json`, 'utf8')
    .then((endPoints) => {
      response.status(200).send(JSON.parse(endPoints));
    })
    .catch(next);
};
