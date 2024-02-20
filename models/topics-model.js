const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    if (!result) {
      return Promise.reject({
        status: 404,
        msg: "Sorry can't find that!",
      });
    }
    return result.rows;
  });
};
