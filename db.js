const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.PG_DB,
});

pool.on("connect", () => {
  console.log("connected to the db");
});

module.exports = {
  async createall() {
    console.log("start create tables");
    await this.createUserTable();
    await this.createDriverTable();
    await this.createRideTable();
    await this.createDriveRecordTable();
  },

  /**
   * Create User Table
   */
  async createUserTable() {
    const queryText = `CREATE TABLE IF NOT EXISTS
      users(
        uid UUID PRIMARY KEY,
        email VARCHAR UNIQUE NOT NULL,
        hash VARCHAR,
        username VARCHAR,
        firstname VARCHAR,
        lastname VARCHAR,
        image VARCHAR,
        phone VARCHAR,
        address VARCHAR,
        address2 VARCHAR,
        create_date TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS users_email ON users(email);
      CREATE INDEX IF NOT EXISTS users_phone ON users(phone);`;

    try {
      res = await pool.query(queryText);
      console.log(res);
    } catch (err) {
      console.error(err);
    } finally {
      pool.end();
    }
  },
  async createDriverTable() {
    const queryText = `CREATE TABLE IF NOT EXISTS
      drivers(
        did UUID PRIMARY KEY,
        email VARCHAR UNIQUE NOT NULL,
        hash VARCHAR,
        username VARCHAR,
        firstname VARCHAR,
        lastname VARCHAR,
        image VARCHAR,
        phone VARCHAR,
        address VARCHAR,
        address2 VARCHAR,
        create_date TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS drivers_email ON drivers(email);
      CREATE INDEX IF NOT EXISTS drivers_phone ON drivers(phone);`;

    try {
      res = await pool.query(queryText);
      console.log(res);
    } catch (err) {
      console.error(err);
    } finally {
      pool.end();
    }
  },

  async createRideTable() {
    const queryText = `CREATE TABLE IF NOT EXISTS
      rides(
        rid UUID PRIMARY KEY,
        status INTEGER NOT NULL,
        type SMALLINT,
        uid VARCHAR NOT NULL,
        did VARCHAR,
        user_location VARCHAR,
        destination VARCHAR,
        create_time TIMESTAMP,
        start_time TIMESTAMP,
        finish_time TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS rides_status ON rides(status);
      CREATE INDEX IF NOT EXISTS rides_uid ON rides(uid);
      CREATE INDEX IF NOT EXISTS rides_did ON rides(did);`;

    try {
      res = await pool.query(queryText);
      console.log(res);
    } catch (err) {
      console.error(err);
    } finally {
      pool.end();
    }
  },

  async createDriveRecordTable() {
    const queryText = `CREATE TABLE IF NOT EXISTS
      drive_record(
        rid VARCHAR NOT NULL,
        uid VARCHAR NOT NULL,
        did VARCHAR,
        status VARCHAR(1),
        driver_location VARCHAR,
        create_time TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS drive_record_rid ON drive_record(rid);
      CREATE INDEX IF NOT EXISTS drive_record_uid ON drive_record(uid);
      CREATE INDEX IF NOT EXISTS drive_record_did ON drive_record(did);`;

    try {
      res = await pool.query(queryText);
      console.log(res);
    } catch (err) {
      console.error(err);
    } finally {
      pool.end();
    }
  },

  /**
   * Drop User Table
   */
  dropUserTable() {
    const queryText = `DROP TABLE IF EXISTS users;
    DROP INDEX IF EXISTS users_email;
    DROP INDEX IF EXISTS users_phone;`;
    pool
      .query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.error(err);
        pool.end();
      });
  },

  clearUserTable() {
    const queryText = `DELETE FROM users;`;
    pool.query(queryText, (err, res) => {
      console.log(err, res);
      pool.end();
    });
  },

  dropDriverTable() {
    const queryText = `DROP TABLE IF EXISTS drivers;
    DROP INDEX IF EXISTS drivers_email;
    DROP INDEX IF EXISTS drivers_phone;`;
    pool
      .query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.error(err);
        pool.end();
      });
  },

  clearDriverTable() {
    const queryText = `DELETE FROM drivers;`;
    pool.query(queryText, (err, res) => {
      console.log(err, res);
      pool.end();
    });
  },

  dropRideTable() {
    const queryText = `DROP TABLE IF EXISTS rides;
    DROP INDEX IF EXISTS rides_status;
    DROP INDEX IF EXISTS rides_uid;
    DROP INDEX IF EXISTS rides_did;`;
    pool
      .query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.error(err);
        pool.end();
      });
  },

  clearRideTable() {
    const queryText = `DELETE FROM rides;`;
    pool.query(queryText, (err, res) => {
      console.log(err, res);
      pool.end();
    });
  },

  dropDriveRecordTable() {
    const queryText = `DROP TABLE IF EXISTS drive_record;
    DROP INDEX IF EXISTS drive_record_rid;
    DROP INDEX IF EXISTS drive_record_uid;
    DROP INDEX IF EXISTS drive_record_did;`;
    pool
      .query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.error(err);
        pool.end();
      });
  },

  clearDriveRecordTable() {
    const queryText = `DELETE FROM drive_record;`;
    pool.query(queryText, (err, res) => {
      console.log(err, res);
      pool.end();
    });
  },
};

// pool.end();
pool.on("remove", () => {
  console.log("client removed");
  process.exit(0);
});

// eslint-disable-next-line import/no-extraneous-dependencies
require("make-runnable");
