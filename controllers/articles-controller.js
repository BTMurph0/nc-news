const { selectArticle, selectArticles } = require("../models/articles-model");

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticle(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (request, response, next) => {
  selectArticles()
    .then((articles) => {
      response.status(200).send({articles});
    })
    .catch(next);
};
