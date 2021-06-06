// const jwt = require("jsonwebtoken");
// const dcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const dotenv = require("dotenv");
const db = require("./index");
const logger = require("log4js").getLogger("driver.dao");

const saltRounds = 10;
dotenv.config();


module.exports = {
    async authenticate({ email, hash }) {
        const text = `select did, email, username from drivers where LOWER(email) = $1 and hash = $2`;
        return new Promise(async (resolve, reject) => {
            try {
              const { rows } = await db.query(text, [email, hash]);
              if (!rows[0]) {
                throw "Username or password is incorrect"
              }
              logger.info('login driver finished: ', rows)
              resolve(rows[0]);
            } catch (error) {
              logger.info("login driver error:" + error);
              reject(error);
            }
        })
    //   logger.info(driver);
    //   if (driver && dcrypt.compareSync(password, driver.hash)) {
    //     const { hash, ...driverWithoutHash } = driver;
    //     const token = jwt.sign({ sub: driver.did }, process.env.secret);
    //     return {
    //       ...driverWithoutHash,
    //       token
    //     };
    //   }
    },
    async create(driverParam) {
        //record new driver to driver table
        const text = `insert into drivers(did, email, hash, username, create_date) values($1, $2, $3, $4, $5) returning *`;
        const values = [
          uuidv4(),
          driverParam.email,
          driverParam.hash,
          driverParam.email.split("@")[0],
          new Date()
        ];
        return new Promise(async (resolve, reject) => {
            try {
              logger.info("inserting new driver...", values);
              const { rows } = await db.query(text, values);
        
              resolve(rows[0]);
            } catch (error) {
              logger.info("insert new driver error", error);
              reject(error);
            }
        })
      },

      async getUserbyId(did) {
        return new Promise(async (resolve, reject) => {
          logger.info('get driver by id', did)
          const text = `select * from drivers where did = $1`;
          try {
            const { rows } = await db.query(text, [did]);
            if (!rows[0]) {
              throw "no driver found!"
            }
            // logger.info(rows[0])
            resolve(rows[0])
          } catch (error) {
            logger.error(error)
            reject(error)
          }
        })
      },
      
        async getUserbyEmail(email) {
          logger.info("getting driver by email...");
          const text = `select did, email, username from drivers where LOWER(email) = $1`;
          try {
            const { rows } = await db.query(text, [email]);
            if (!rows[0]) {
              throw "no driver found!"
            }
            logger.info('get driver by email finished: ', rows)
            return rows
          } catch (error) {
            logger.info("get driver by email error:" + error);
            throw error;
          }
        },
}