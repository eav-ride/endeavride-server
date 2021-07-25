# endeavride-server

## pre-request

Install node.js, postgresql

## installation

1. Clone this repository
2. Navigate to this repository, run `npm install` to install all required dependencies
3. Create .env file at the root path of this project, put the postgresql connection like:
```
PG_DB = "postgresql://(postgresql username):(password)@localhost:5432/pg_endeavride"
```
Replace content inside ()
4. Open terminal at project's root path, run 
```
node db.js createUserTable
node db.js createDriverTable
node db.js createRideTable
node db.js createDriveRecordTable
```
to create all database tables
5. Run `node index.js` from project's root path to start server, current server path is running on localhost:3300