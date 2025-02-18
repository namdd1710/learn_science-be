import express, { json, urlencoded } from "express";
import "module-alias/register.js";
import morgan from "morgan";

import dotenv from "dotenv";
import mongoose from "./v1/databases/init.mongodb.js";
import accountRoute from "./v1/routes/account.route.js";
import authRoute from "./v1/routes/auth.route.js";
import lessonRoute from "./v1/routes/lesson.route.js";
import questionRoute from "./v1/routes/question.route.js";
import unitRoute from "./v1/routes/unit.route.js";
import gradeRoute from "./v1/routes/grade.route.js";
import categoriesRoute from "./v1/routes/categories.router.js";
import cors from "cors";


const app = express();
dotenv.config();

//init dbs
// require('./v1/databases/init.mongodb');
// require('./v1/databases/init.redis')

//user middleware
app.use(morgan("combined"));
// compress responses
// app.use(compression());

// add body-parser
app.use(express.json());
app.use(cors());

app.use(
  urlencoded({
    extended: true,
  })
);
var BASE_PATH = "/api"
//router
// app.use(BASE_PATH, routes);
app.use(BASE_PATH, authRoute);
app.use(BASE_PATH, accountRoute);
app.use(BASE_PATH, lessonRoute);
app.use(BASE_PATH, questionRoute);
app.use(BASE_PATH, unitRoute);
app.use(BASE_PATH, gradeRoute);
app.use(BASE_PATH, categoriesRoute);


mongoose


// Error Handling Middleware called

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || _apiCode.ERR_DEFAULT).send({
    error: {
      status: error.status || _apiCode.ERR_DEFAULT,
      message: error.message || "Internal Server Error",
    },
  });
});

export default app;

