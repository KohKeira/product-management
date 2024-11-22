// import mysql2 library
var mysql = require("mysql2");

// create connection to database
var connection = mysql.createConnection({
  host: process.env.DB_HOST, // IP of database server
  port: process.env.DB_PORT, // port of database server
  user: process.env.DB_USERNAME, // user of database server
  password: process.env.DB_PASSWORD, // password of database server
  database: process.env.DB_DATABASE, // database connecting to
});

// test connection
connection.connect((err) => {
  // test out connection, if error console.log error
  if (err) throw err;
  console.log("Connected to DB");
});

// Export connection so that it can be used by other script
module.exports = connection;
