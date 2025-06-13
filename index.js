const express = require("express");
const mongoClient = require("./db/mongoose");

const mainRouter = require('./api/routers');

const app = express();

const port = process.env.PORT || 8000;

async function startServer() {
  await mongoClient.connect();

  app.get("/test", (req, res) => {
    res.send(`Server is up and running at ${new Date().toString()}`);
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(mainRouter);

  app.listen(port, "0.0.0.0", () => {
    console.log("Server is up on the port " + port);
  });
}

startServer();
