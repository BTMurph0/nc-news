const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());

const apiRouter = require("./routes/api-router");
app.use("/api", apiRouter);


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
