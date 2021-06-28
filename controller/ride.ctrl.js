
const logger = require("log4js").getLogger("guest.ctrl");

const rideService = require("../dao/ride.dao");

module.exports = {
  newRide(req, res, next) {
    console.log("newRide");
    logger.info("create new ride request...", req.headers.uid);
    rideService
      .create(req.body)
      .then((ride) => {
        res.json(ride);
      })
      .catch((err) => res.status(400).json(err));
  },

  getRide(req, res, next) {
    console.log("getRide");
    logger.info("get ride...", req.headers.uid);
    rideService
      .getRidebyId(req.params.rid)
      .then((ride) => {
        res.json(ride);
      })
      .catch((err) => res.status(400).json(err));
  },

  getCurrentRide(req, res, next) {
    console.log("getCurrentRide");
    logger.info("get current ride...", req.headers.uid, req.query.showfinish);
    rideService
      .getCurrentRidebyUid(req.headers.uid, req.query.showfinish)
      .then((ride) => {
        res.json(ride);
      })
      .catch((err) => res.status(400).json(err));
  },

  getRides(req, res, next) {
    console.log("get all rides for user");
    logger.info("get all rides for user", req.headers.uid);
    rideService
      .getRidesbyUid(req.body.uid)
      .then((ride) => {
        res.json(ride);
      })
      .catch((err) => res.status(400).json(err));
  },

  //status: 0 = unassigned, 1 = assigning, 2 = picking up,
  //3 = arrived user location, 4 = ride start, 5 = finished, 6 = canceled
  updateRideStatus(req, res, next) {
    console.log("updateRideStatus", req.body);
    logger.info("update ride status", req.headers.uid || req.headers.did);
    let status = req.body.status;
    if (status == 5 || status == 6) {
      //finish/cancel ride
      rideService
        .finishRide(req.params.rid, status)
        .then((ride) => {
          res.json(ride);
        })
        .catch((err) => res.status(400).json(err));
    } else if (status == 4) {
      //start ride
      rideService
        .startRide(req.params.rid, status)
        .then((ride) => {
          res.json(ride);
        })
        .catch((err) => res.status(400).json(err));
    } else {
      //assigning ride/picking up/canceling
      rideService
        .updateStatusById(req.params.rid, status)
        .then((ride) => {
          res.json(ride);
        })
        .catch((err) => res.status(400).json(err));
    }
  },

  //driver
  requestRideFromDriver(req, res, next) {
    console.log("requestRideFromDriver");
    logger.info("requestRideFromDriver", req.headers.did);
    let offset = req.query.offset;
    let rid = req.query.rid;
    let did = req.headers.did;
    let receiveNewTask = req.body.receive_new
    // revert status of rid to 0 (unassigned)
    if (rid) {
      console.log("have rid");
      rideService.updateStatusWithDidById(rid, 0, "")
        .then((ride) => {
          if (receiveNewTask) {
            // get new ride and update its status to 1 (assising)
            rideService.getNextAssignRide(did, offset)
              .then((ride) => {
                res.json(ride);
              })
              .catch((err) => res.status(400).json(err));
          } else {
            res.json(ride);
          }
        })
        .catch((err) => res.status(400).json(err));
    } else {
      console.log("no rid");
      rideService.getNextAssignRide(did, offset)
        .then((ride) => {
          res.json(ride);
        })
        .catch((err) => res.status(400).json(err));
    }
  },

  getCurrentRideForDriver(req, res, next) {
    console.log("request header: ", req.headers);
    logger.info("get current ride for driver...", req.headers.did);
    rideService
      .getCurrentRidebyDid(req.headers.did)
      .then((ride) => {
        res.json(ride);
      })
      .catch((err) => res.status(400).json(err));
  },

  acceptRideRequest(req, res, next) {
    console.log("acceptRideRequest", req.body);
    logger.info("acceptRideRequest", req.headers.did);
    let rid = req.body.rid;
    let did = req.headers.did;
    // set status to 2 (picking)
    rideService.getRidebyId(rid)
    .then((ride) => {
      if (ride.status < 2) {
        let status = ride.type == 0 ? 2 : 4
        rideService.updateStatusWithDidById(rid, status, did)
          .then((ride) => {
            res.json(ride);
          })
          .catch((err) => res.status(400).json(err));
      } else {
        res.json(ride)
      }
    })
    .catch((err) => res.status(400).json(err));
  },
};