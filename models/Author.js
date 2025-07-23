// models/Author.js
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define("Author", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    biography: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    born_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    avatar: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  });
  Author.associate = (models) => {
    Author.hasMany(models.Book, {
      foreignKey: "author_id",
      onDelete: "CASCADE",
      hooks: true,
    });
  };
  return Author;
};
