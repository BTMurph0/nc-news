const express = require("express");
const articlesRouter = express.Router();
const {
  getArticleById,
  getArticles,
  patchVote,
} = require("../controllers/articles-controller.js");

articlesRouter.use(express.json());
const {
  getCommentsByArticleId,
  postComment,
} = require("../controllers/comments-controller.js");

articlesRouter.route("/").get(getArticles);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchVote);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);


module.exports = articlesRouter;
