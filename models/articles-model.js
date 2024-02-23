const db = require("../db/connection");

exports.selectArticle = (article_id) => {
  let sqlString = `SELECT articles.*, COUNT(comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`;

  const queryVals = [article_id];

  return db.query(sqlString, queryVals).then((result) => {
    if (!result.rows[0]) {
      return Promise.reject({
        status: 404,
        msg: `article does not exist`,
      });
    }
    return result.rows[0];
  });
};

exports.selectArticles = (topic, sortBy = "created_at", order = "desc") => {
  const validSortBys = ["title", "topic", "author", "created_at", "votes"];

  const validOrders = ['asc', 'desc']

  if (!validSortBys.includes(sortBy) || !validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let sqlString = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments 
  ON comments.article_id = articles.article_id
  `;
  const queryVals = [];
  if (topic) {
    sqlString += `WHERE articles.topic = $1`;
    queryVals.push(topic);
  }

  sqlString += `
  GROUP BY articles.article_id
  ORDER BY articles.${sortBy} ${order}
  `;

  return db.query(sqlString, queryVals).then((result) => {
    return result.rows;
  });
};

exports.updateVotes = (article_id, newVote) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [newVote, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
