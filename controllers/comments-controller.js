const {
  selectCommentsByArticleId,
  addComment,
} = require("../models/comments-model");
const { checkExists } = require("../utils");

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  return Promise.all([
    checkExists("articles", "article_id", article_id),
    selectCommentsByArticleId(article_id),
  ])
    .then((comments) => {
      if (comments[1].length === 0) {
        response
          .status(200)
          .send({ comments: comments[1], msg: "no comments for this article" });
      }
      response.status(200).send({ comments: comments[1] });
    })
    .catch(next);
};

exports.postComment = (request, response, next) => {
  const newComment = request.body;
  const { article_id } = request.params;
  return Promise.all([
    checkExists("articles", "article_id", article_id),
    addComment(article_id, newComment),
  ])
    .then((comment) => {
      response.status(201).send({ comment: comment[1] });
    })
    .catch(next);
};
