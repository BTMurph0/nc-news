const { selectUsers, selectUser } = require("../models/users-model");
const { checkExists } = require("../utils");

exports.getUsers = (request, response, next) => {
  selectUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch(next);
};

exports.getUser = (request, response, next) => {
  const { username } = request.params;
  return Promise.all([
    checkExists("users", "username", username),
    selectUser(username),
  ])
    .then((user) => {
      response.status(200).send({ user: user[1] });
    })
    .catch(next);
};
