var Sequelize = require("sequelize");
var seqConnection = require("../config/connection.js");

var Table = seqConnection.define("table", {
  customerName: {
    type: Sequelize.STRING
  },
  customerEmail: {
    type: Sequelize.STRING
  },
  phoneNumber: {
    type: Sequelize.STRING
  },
  waitlisted: {
    type: Sequelize.BOOLEAN
  }
}, {
  timestamps: false
});

Table.sync();

module.exports = Table;