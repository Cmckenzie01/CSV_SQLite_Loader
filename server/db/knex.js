const knex = require("knex");

// CONNECTION VARIABLES
const connectedKnex = knex({
    client: "sqlite3",
    connection: {
        filename: "db.sqlite3"
    }
});

module.exports = connectedKnex;