const express = require('express')
const app = express()
const port = 3300
const parseUrl = require("parseurl");
const bodyParser = require("body-parser");
const log4js = require("log4js");

// router
const userRouter = require("./router/user.router")
const rideRouter = require("./router/ride.router")
const errorHandler = require("./utils/error-handler");

log4js.configure("./log4js.json");
const logger = log4js.getLogger("startup");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all("/*", (req, res, next) => {
  console.log("req.origin: ", req.get("origin"));
  console.log("req.host: ", req.get("host"));
  console.log("req.path: ", parseUrl(req).path);
  next();
});

app.use("/user", userRouter);
app.use("/r", rideRouter);

app.get('/', (req, res) => {
  res.send('Hello World from Express ENDEAVRide!!')
})

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})