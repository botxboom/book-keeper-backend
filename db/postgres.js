const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("gulshankumar", "gulshan", "password", {
  host: "localhost",
  dialect: "postgres",
});
module.exports = sequelize;
