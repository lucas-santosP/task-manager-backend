import express from "express";

class AppController {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    this.express.get("/", (req, res) => {
      res.send("Hello World!");
    });
  }
}

const app = new AppController();
export default app.express;
