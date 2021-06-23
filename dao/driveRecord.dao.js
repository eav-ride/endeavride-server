const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const db = require("./index");
const logger = require("log4js").getLogger("driveRecord.dao");

const saltRounds = 10;
dotenv.config();

module.exports = {
  async create(userParam) {
    //record drive record table, status: 0 = picking user, 1 = arrived user location, 2 = driving to dest, 3 = arrived dest
    const text = `insert into drive_record(rid, uid, did, status, driver_location, create_time) values($1, $2, $3, $4, $5, $6) returning *`;
    const values = [
      userParam.rid,
      userParam.uid,
      userParam.did,
      userParam.status,
      userParam.driver_location,
      new Date(),
    ];
    return new Promise(async (resolve, reject) => {
      try {
        logger.info("inserting new drive record...", values);
        const { rows } = await db.query(text, values);

        resolve(rows[0]);
      } catch (error) {
        logger.info("insert new drive record error", error);
        reject(error);
      }
    });
  },

  async getLatestDriveRecordbyRid(rid) {
    return new Promise(async (resolve, reject) => {
      logger.info("get drive record by rid", rid);
      const text = `select * from drive_record where rid = $1 order by create_time desc limit 1`;
      try {
        const { rows } = await db.query(text, [rid]);
        if (!rows[0]) {
          throw "no drive record found!";
        }
        // logger.info(rows[0])
        resolve(rows[0]);
      } catch (error) {
        logger.error(error);
        reject(error);
      }
    });
  },

  async getDriveRecordsbyRid(rid) {
    return new Promise(async (resolve, reject) => {
      logger.info("get drive record by rid", rid);
      const text = `select * from drive_record where rid = $1 order by create_time desc`;
      try {
        const { rows } = await db.query(text, [rid]);
        if (!rows[0]) {
          throw "no drive record found!";
        }
        // logger.info(rows[0])
        resolve(rows);
      } catch (error) {
        logger.error(error);
        reject(error);
      }
    });
  },
};
