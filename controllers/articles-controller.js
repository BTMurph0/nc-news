const {
  selectArticle,
  selectArticles,
  updateVotes,
} = require("../models/articles-model");
const { checkExists } = require("../utils");

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticle(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (request, response, next) => {
  const topic = request.query.topic;
  if (topic) {
    return Promise.all([
      checkExists("topics", "slug", topic),
      selectArticles(topic),
    ])
      .then((articles) => {
        response.status(200).send({ articles: articles[1] });
      })
      .catch(next);
  }
  selectArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchVote = (request, response, next) => {
  const newVote = request.body.inc_votes;
  const { article_id } = request.params;
  return Promise.all([
    checkExists("articles", "article_id", article_id),
    updateVotes(article_id, newVote),
  ])
    .then((article) => {
      response.status(200).send({ article: article[1] });
    })
    .catch(next);
};
