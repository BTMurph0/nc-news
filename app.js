const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller.js");
const { getEndpoints } = require("./controllers/endpoints-controller.js");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles-controller.js");
const {
  getCommentsByArticleId,
  postComment,
} = require("./controllers/comments-controller.js");
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.use((request, response, next) => {
  response.status(404).send("Sorry can't find that!");
});

app.use((error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else next(error);
});

app.use((error, request, response, next) => {
  if (error.code === "22P02" || error.code === "23502") {
    response.status(400).send({ msg: "Bad Request" });
  }
});

module.exports = app;
