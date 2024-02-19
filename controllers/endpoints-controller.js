const fs = require("fs/promises");

exports.getEndpoints = (request, response, next) => {
  return fs
    .readFile(`./endpoints.json`)
    .then((endPoints) => {
      const parsedEndpoints = JSON.parse(endPoints);
      return parsedEndpoints;
    }).then((parsedEndpoints) => {
      response.status(200).send({ parsedEndpoints });
    })
    .catch(next);
};
