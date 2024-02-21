const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
    SELECT * 
    FROM comments 
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};
exports.addComment = (article_id, { author, body} ) => {
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [author, body, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
