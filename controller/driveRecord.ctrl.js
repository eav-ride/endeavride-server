
const logger = require("log4js").getLogger("guest.ctrl");

const driveRecordService = require("../dao/driveRecord.dao");

module.exports = {
  newRecord(req, res, next) {
  logger.info("create new drive record request...");
  driveRecordService
    .create(req.body)
    .then(_ => {
      res.status(200).send();
    })
    .catch(err => res.status(400).json(err));
  },

  getRecordByRid(req, res, next) {
    logger.info("get drive record...", req.body);
    driveRecordService
      .getLatestDriveRecordbyRid(req.params.rid)
      .then(record => {
        res.json(record)
      })
      .catch(err => res.status(400).json(err));
  },

  getAllRecordsByRid(req, res, next) {
    logger.info("get all drive records...", req.body);
    driveRecordService
      .getDriveRecordsbyRid(req.params.rid)
      .then(records => {
        res.json(records)
      })
      .catch(err => res.status(400).json(err));
  }
}