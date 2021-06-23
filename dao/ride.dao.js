const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const db = require("./index");
const logger = require("log4js").getLogger("ride.dao");

const saltRounds = 10;
const finish_state = 5;
dotenv.config();

module.exports = {
  async create(userParam) {
    //record new user to user table, status: 0 = unassigned, 1 = assigning, 2 = picking up, 3 = arrived user location, 4 = ride start, 5 = finished, 6 = canceled
    const text = `insert into rides(rid, status, uid, user_location, destination, create_time) values($1, $2, $3, $4, $5, $6) returning *`;
    const values = [
      uuidv4(),
      0,
      userParam.uid,
      userParam.user_location,
      userParam.destination,
      new Date(),
    ];
    return new Promise(async (resolve, reject) => {
      try {
        logger.info("inserting new ride...", values);
        const { rows } = await db.query(text, values);

        resolve(rows[0]);
      } catch (error) {
        logger.info("insert new ride error", error);
        reject(error);
      }
    });
  },

  async getRidebyId(rid) {
    return new Promise(async (resolve, reject) => {
      logger.info("get ride by rid", rid);
      const text = `select * from rides where rid = $1`;
      try {
        const { rows } = await db.query(text, [rid]);
        if (!rows[0]) {
          throw "no ride found!";
        }
        // logger.info(rows[0])
        resolve(rows[0]);
      } catch (error) {
        logger.error(error);
        reject(error);
      }
    });
  },

  async getRidesbyUid(uid) {
    return new Promise(async (resolve, reject) => {
      logger.info("get ride by userid", uid);
      const text = `select * from rides where uid = $1`;
      try {
        const { rows } = await db.query(text, [uid]);
        if (!rows[0]) {
          throw "no ride found!";
        }
        // logger.info(rows[0])
        resolve(rows);
      } catch (error) {
        logger.error(error);
        reject(error);
      }
    });
  },

  async getCurrentRidebyUid(uid) {
    return new Promise(async (resolve, reject) => {
      logger.info("get ride by userid", uid);
      const text = `select * from rides where uid = $1 and status != $2`;
      try {
        const { rows } = await db.query(text, [uid, finish_state]);
        if (!rows[0]) {
          throw "no ride found!";
        }
        // logger.info(rows[0])
        resolve(rows[0]);
      } catch (error) {
        logger.error(error);
        reject(error);
      }
    });
  },

  async getCurrentRidebyDid(did) {
    return new Promise(async (resolve, reject) => {
      logger.info("get ride by userid", did);
      const text = `select * from rides where did = $1 and status != $2`;
      try {
        const { rows } = await db.query(text, [did, finish_state]);
        if (!rows[0]) {
          throw "no ride found!";
        }
        // logger.info(rows[0])
        resolve(rows[0]);
      } catch (error) {
        logger.error(error);
        reject(error);
      }
    });
  },

  async getRidebyDid(uid) {
    return new Promise(async (resolve, reject) => {
      logger.info("get ride by driver id", uid);
      const text = `select * from rides where did = $1`;
      try {
        const { rows } = await db.query(text, [uid]);
        if (!rows[0]) {
          throw "no ride found!";
        }
        // logger.info(rows[0])
        resolve(rows[0]);
      } catch (error) {
        logger.error(error);
        reject(error);
      }
    });
  },

  async getNextAssignRide(offset) {
    return new Promise(async (resolve, reject) => {
      console.log("get ride by status");
      const select = `SELECT * FROM rides WHERE status = '0' ORDER BY create_time DESC OFFSET $1 LIMIT 1`;
      const update = `UPDATE rides SET status = 1 WHERE rid = $1 RETURNING *`;
      try {
        const { rows } = await db.query(select, [offset]);
        if (!rows[0]) {
          throw "no ride found!";
        }
        console.log(rows[0])
        const response = await db.query(update, [rows[0].rid]);
        console.log(response.rows[0])
        resolve(response.rows[0]);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  async updateStatusWithDidById(rid, status, did) {
    logger.info("update ride by id", rid, status, did);
    const updateOneQuery = `update rides set status = $1, did = $2 WHERE rid = $3 returning *`;
    try {
      const values = [status, did, rid];
      const response = await db.query(updateOneQuery, values);
      return response.rows[0];
    } catch (err) {
      throw err;
    }
  },

  async updateStatusById(rid, status) {
    logger.info("update ride by id", rid, status);
    const updateOneQuery = `update rides set status = $1 WHERE rid = $2 returning *`;
    try {
      const values = [status, rid];
      const response = await db.query(updateOneQuery, values);
      return response.rows[0];
    } catch (err) {
      throw err;
    }
  },

  async startRide(rid, status) {
    const updateOneQuery = `update rides set status = $1, start_time = $2 WHERE rid = $3 returning *`;
    try {
      const values = [status, new Date(), rid];
      const response = await db.query(updateOneQuery, values);
      return response.rows[0];
    } catch (err) {
      throw err;
    }
  },

  async finishRide(rid, status) {
    const updateOneQuery = `update rides set status = $1, finish_time = $2 WHERE rid = $3 returning *`;
    try {
      const values = [status, new Date(), rid];
      const response = await db.query(updateOneQuery, values);
      return response.rows[0];
    } catch (err) {
      throw err;
    }
  },
};
