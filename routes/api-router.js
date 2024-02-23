const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/endpoints-controller.js");
const topicsRouter = require("./topics-router.js");
const articlesRouter = require("./articles-router.js");
const commentsRouter = require("./comments-router.js");
const usersRouter = require("./users-router.js");

apiRouter
  .use("/topics", topicsRouter)
  .use("/articles", articlesRouter)
  .use("/comments", commentsRouter)
  .use("/users", usersRouter);

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
