
const logger = require("log4js").getLogger("user.ctrl");

const userService = require("../dao/driver.dao");

module.exports = {
  authenticate(req, res, next) {
    console.log("logging in user...");
    userService
      .authenticate(req.body)
      .then(user => {
        logger.info(user);
        if (user) {
        //   logger.info(user.token);
          res.json({ did: user.did, email: user.email });
        } else {
          res
            .status(400)
            .json({ message: "Username or password is incorrect" });
        }
      })
      .catch(err => {
        logger.error(err);
        next(err);
      });
  },

  register(req, res, next) {
    logger.info("user register...", req.body);
    userService
      .create(req.body)
      .then(user => {
        res.json({ did: user.did, email: user.email });
      })
      .catch(err => res.status(400).json(err));
  },

  getMyInfo(req, res, next) {
    //logger.info('get my info', req.headers.id);
    userService
      .getUserbyId(req.headers.did)
      .then(user => (user ? res.json(user) : res.sendStatus(404)))
      .catch(err => next(err));
  },
}