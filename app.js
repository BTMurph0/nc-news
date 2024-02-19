const express = require("express");
const app = express();
const {getTopics} = require("./controllers/topics-controller.js");


app.get("/api/topics", getTopics);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})


module.exports = app;
