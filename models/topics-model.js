const db = require("../db/connection");

exports.selectTopics = () => {
  let sqlString = `
    SELECT * FROM topics
    `;

  return db.query(sqlString).then((result) => {
    if (!result.rows[0]) {
      return Promise.reject({
        status: 404,
        msg: "Not Found"
      })
    }
    return result.rows;
  });
};
