const { v4: uuidv4 } = require('uuid');
const dotenv = require("dotenv");
const db = require("./index");
const logger = require("log4js").getLogger("user.dao");

const saltRounds = 10;
dotenv.config();


module.exports = {
    async create(userParam) {
        //record new user to user table, status: 0 = unassigned, 1 = assigning, 2 = picking up, 3 = ride start, 4 = finished, 5 = canceled
        const text = `insert into rides(rid, status, uid, direction, create_time) values($1, $2, $3, $4, $5) returning *`;
        const values = [
          uuidv4(),
          0,
          userParam.uid,
          userParam.direction,
          new Date()
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
        })
      },

      async getRidebyId(rid) {
        return new Promise(async (resolve, reject) => {
          logger.info('get ride by rid', rid)
          const text = `select * from rides where rid = $1`;
          try {
            const { rows } = await db.query(text, [rid]);
            if (!rows[0]) {
              throw "no ride found!"
            }
            // logger.info(rows[0])
            resolve(rows[0])
          } catch (error) {
            logger.error(error)
            reject(error)
          }
        })
      },

      async getRidesbyUid(uid) {
        return new Promise(async (resolve, reject) => {
            logger.info('get ride by userid', uid)
            const text = `select * from rides where uid = $1`;
          try {
            const { rows } = await db.query(text, [uid]);
            if (!rows[0]) {
              throw "no ride found!"
            }
            // logger.info(rows[0])
            resolve(rows)
          } catch (error) {
            logger.error(error)
            reject(error)
          }
        })
      },

      async getCurrentRidebyUid(uid) {
        return new Promise(async (resolve, reject) => {
            logger.info('get ride by userid', uid)
            const text = `select * from rides where uid = $1 and status != $2`;
          try {
            const { rows } = await db.query(text, [uid, 4]);
            if (!rows[0]) {
              throw "no ride found!"
            }
            // logger.info(rows[0])
            resolve(rows[0])
          } catch (error) {
            logger.error(error)
            reject(error)
          }
        })
      },

      async getRidebyDid(uid) {
        return new Promise(async (resolve, reject) => {
            logger.info('get ride by driver id', uid)
            const text = `select * from rides where did = $1`;
          try {
            const { rows } = await db.query(text, [uid]);
            if (!rows[0]) {
              throw "no ride found!"
            }
            // logger.info(rows[0])
            resolve(rows[0])
          } catch (error) {
            logger.error(error)
            reject(error)
          }
        })
      },

      async getNextAssignRide(uid) {
        return new Promise(async (resolve, reject) => {
            logger.info('get ride by status', uid)
            const text = `select * from rides where did = $1`;
          try {
            const { rows } = await db.query(text, [uid]);
            if (!rows[0]) {
              throw "no ride found!"
            }
            // logger.info(rows[0])
            resolve(rows[0])
          } catch (error) {
            logger.error(error)
            reject(error)
          }
        })
      },

      async updateStatusById(rid, status) {
        const updateOneQuery = `update rides set status = $1 WHERE rid = $2 returning *`;
        try {
          const values = [
            status,
            rid
          ];
          const response = await db.query(updateOneQuery, values);
          return response.rows[0];
        } catch (err) {
          throw err;
        }
      },

      async startRide(rid) {
        const updateOneQuery = `update rides set status = $1, start_time = $2 WHERE rid = $3 returning *`;
        try {
          const values = [
            3,
            new Date(),
            rid
          ];
          const response = await db.query(updateOneQuery, values);
          return response.rows[0];
        } catch (err) {
          throw err;
        }
      },

      async finishRide(rid) {
        const updateOneQuery = `update rides set status = $1, finish_time = $2 WHERE rid = $3 returning *`;
        try {
          const values = [
            4,
            new Date(),
            rid
          ];
          const response = await db.query(updateOneQuery, values);
          return response.rows[0];
        } catch (err) {
          throw err;
        }
      },
}