// const jwt = require("jsonwebtoken");
// const dcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const dotenv = require("dotenv");
const db = require("./index");
const logger = require("log4js").getLogger("user.dao");

const saltRounds = 10;
dotenv.config();


module.exports = {
    async authenticate({ email, hash }) {
        const text = `select uid, email, username from users where LOWER(email) = $1 and hash = $2`;
        return new Promise(async (resolve, reject) => {
            try {
              const { rows } = await db.query(text, [email, hash]);
              if (!rows[0]) {
                throw "Username or password is incorrect"
              }
              logger.info('login user finished: ', rows)
              resolve(rows[0]);
            } catch (error) {
              logger.info("login user error:" + error);
              reject(error);
            }
        })
    //   logger.info(user);
    //   if (user && dcrypt.compareSync(password, user.hash)) {
    //     const { hash, ...userWithoutHash } = user;
    //     const token = jwt.sign({ sub: user.uid }, process.env.secret);
    //     return {
    //       ...userWithoutHash,
    //       token
    //     };
    //   }
    },
    async create(userParam) {
        //record new user to user table
        const text = `insert into users(uid, email, hash, username, create_date) values($1, $2, $3, $4, $5) returning *`;
        const values = [
          uuidv4(),
          userParam.email,
          userParam.hash,
          userParam.email.split("@")[0],
          new Date()
        ];
        return new Promise(async (resolve, reject) => {
            try {
              logger.info("inserting new user...", values);
              const { rows } = await db.query(text, values);
        
              resolve(rows[0]);
            } catch (error) {
              logger.info("insert new user error", error);
              reject(error);
            }
        })
      },

      async getUserbyId(uid) {
        return new Promise(async (resolve, reject) => {
          logger.info('get user by id', uid)
          const text = `select * from users where uid = $1`;
          try {
            const { rows } = await db.query(text, [uid]);
            if (!rows[0]) {
              throw "no user found!"
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
          logger.info("getting user by email...");
          const text = `select uid, email, username from users where LOWER(email) = $1`;
          try {
            const { rows } = await db.query(text, [email]);
            if (!rows[0]) {
              throw "no user found!"
            }
            logger.info('get user by email finished: ', rows)
            return rows
          } catch (error) {
            logger.info("get user by email error:" + error);
            throw error;
          }
        },
}