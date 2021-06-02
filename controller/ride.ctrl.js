
const logger = require("log4js").getLogger("guest.ctrl");

const rideService = require("../dao/ride.dao");

module.exports = {
  newRide(req, res, next) {
  logger.info("create new ride request...");
  rideService
    .create(req.body)
    .then(ride => {
      res.json(ride)
    })
    .catch(err => res.status(400).json(err));
  },

  getRide(req, res, next) {
    logger.info("get ride...", req.body);
    rideService
      .getRidebyId(req.params.rid)
      .then(ride => {
        res.json(ride)
      })
      .catch(err => res.status(400).json(err));
  },

  getCurrentRide(req, res, next) {
    console.log("request header: ", req.headers);
    logger.info("get current ride...", req.headers.uid);
    rideService
      .getCurrentRidebyUid(req.headers.uid)
      .then(ride => {
        res.json(ride)
      })
      .catch(err => res.status(400).json(err));
  },

  getRides(req, res, next) {
    logger.info('get all rides for user', req.body);
    rideService
      .getRidesbyUid(req.body.uid)
      .then(ride => {
        res.json(ride)
      })
      .catch(err => res.status(400).json(err));
  },

  //status: 0 = unassigned, 1 = assigning, 2 = picking up, 
  //3 = ride start, 4 = finished, 5 = canceled
  updateRideStatus(req, res, next) {
    logger.info('update ride status', req.body);
    let status = req.body.status
    if (status == 4) {  //finish ride
      rideService
        .finishRide(req.params.rid)
        .then(ride => {
          res.json(ride)
        })
        .catch(err => res.status(400).json(err));
    } else if (status == 3) { //start ride
      rideService
        .startRide(req.params.rid)
        .then(ride => {
          res.json(ride)
        })
        .catch(err => res.status(400).json(err));
    } else { //assigning ride/picking up/canceling
      rideService
        .updateStatusById(req.params.rid, status)
        .then(ride => {
          res.json(ride)
        })
        .catch(err => res.status(400).json(err));
    }
  }
}