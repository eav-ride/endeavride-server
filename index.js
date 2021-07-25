const express = require('express')
const app = express()
const fs = require("fs");
const https = require("https");
const port = 3300
const parseUrl = require("parseurl");
const bodyParser = require("body-parser");
const log4js = require("log4js");

// router
const userRouter = require("./router/user.router")
const driverRouter = require("./router/driver.router")
const rideRouter = require("./router/ride.router")
const recordRouter = require("./router/driveRecord.router")
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
app.use("/driver", driverRouter);
app.use("/r", rideRouter);
app.use("/dr", recordRouter);

app.get('/', (req, res) => {
  res.send('Hello World from Express ENDEAVRide!!')
})

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// below is using https, when private key and certification are ready, replace the file path below and uncomment below code to replace app.listen(port, block) function
// server = https
//   .createServer(
//     {
//       key: fs.readFileSync("./private/localdomain.insecure.key"),
//       cert: fs.readFileSync("./private/localdomain.crt"),
//     },
//     app
//   )
//   .listen(8443, () => {
//     console.log("HTTPS Listening on port 8443!");
//     logger.info("HTTPS Listening on port 8443!");
//   });
