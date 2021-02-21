import express from "express";
import mongoose from "mongoose";
import { TemplateRoutes, TaskRoutes, UserRoutes } from "../routes";

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
    this.database();
  }

  private middlewares(): void {
    this.express.disable("x-powered-by");
    this.express.use(express.json());
    this.express.use((req, res, next) => {
      res.set("access-control-allow-origin", "*");
      res.set("access-control-allow-methods", "*");
      res.set("access-control-allow-headers", "*");
      next();
    });
    this.express.use((req, res, next) => {
      res.type("json");
      next();
    });
  }

  private database(): void {
    mongoose.connect("mongodb://localhost:27017/tsnode", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  }

  private routes(): void {
    this.express.use("/api", TemplateRoutes);
    this.express.use("/api", TaskRoutes);
    this.express.use("/api", UserRoutes);
  }
}

export default App;
