const { Pool } = require('pg');
const dotenv = require('dotenv');
const db = require('../db')
const logger = require("log4js").getLogger("index.dao");

dotenv.config();

const pool = new Pool({
    connectionString: process.env.PG_DB,
});

module.exports = {
  /**
   * DB Query
   * @param {object} req
   * @param {object} res
   * @returns {object} object 
   */
  query(text, params){
    const start = Date.now()
    return new Promise((resolve, reject) => {
      pool.query(text, params)
      .then((res) => {
        const duration = Date.now() - start;
        logger.info('executed query', { text, params, duration, rows: res.rowCount });
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      })
    })
  },

  recreateFile(){
    db.dropTables();
    db.createTables();
  }
}