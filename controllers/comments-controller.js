const {
  selectCommentsByArticleId,
  addComment,
  removeComment,
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
        response.status(200).send({ comments: comments[1] });
      }
      response.status(200).send({ comments: comments[1] });
    })
    .catch(next);
};

exports.postComment = (request, response, next) => {
  const newComment = request.body;
  const { article_id } = request.params;
  if (!newComment.author || !newComment.body) {
    response.status(400).send({ msg: "Bad Request" });
  } else {
    return Promise.all([
      checkExists("articles", "article_id", article_id),
      checkExists("users", "username", newComment.author),
      addComment(article_id, newComment),
    ])
      .then((comment) => {
        response.status(201).send({ comment: comment[2] });
      })
      .catch(next);
  }
};

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  return Promise.all([
    checkExists("comments", "comment_id", comment_id),
    removeComment(comment_id),
  ])
    .then((comment) => {
      response.status(204).send({ comment: comment[1] });
    })
    .catch(next);
};
