'use strict'

const sql = require('sqlite3');
const util = require('util');


// old-fashioned database creation code 

// creates a new database object, not a 
// new database. 
const profile_db = new sql.Database("profiles.db");

// check if database exists
let profile_cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='Profile' ";

profile_db.get(profile_cmd, function (err, val) {
  if (val == undefined) {
        console.log("No profile database file - creating one");
        createProfileTable();
  } else {
        console.log("Profile Database file found");
  }
});

// called to create table if needed
function createProfileTable() {
  // explicitly declaring the rowIdNum protects rowids from changing if the 
  // table is compacted; not an issue here, but good practice
  const cmd = 'CREATE TABLE Profile (rowIdNum INTEGER PRIMARY KEY, userid TEXT, firstName TEXT)';
  profile_db.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}


// wrap all database commands in promises
profile_db.run = util.promisify(profile_db.run);
profile_db.get = util.promisify(profile_db.get);
profile_db.all = util.promisify(profile_db.all);

// empty all data from db
profile_db.deleteEverything = async function() {
  await profile_db.run("delete from ActivityTable");
  profile_db.run("vacuum");
}

// allow code in index.js to use the db object
module.exports = profile_db;

