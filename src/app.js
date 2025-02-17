import express, { json, urlencoded } from "express";
import morgan from "morgan";

import routes from "./v1/routes/index.router.js";

const app = express();
//init dbs
// require('./v1/databases/init.mongodb');
// require('./v1/databases/init.redis')

//user middleware
app.use(morgan("combined"));
// compress responses
// app.use(compression());

// add body-parser
app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);

//router
app.use("/api", routes);

// Error Handling Middleware called

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

export default app;
