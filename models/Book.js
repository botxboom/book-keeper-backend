// models/Book.js
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    published_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cover_image: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  });
  Book.associate = (models) => {
    Book.belongsTo(models.Author, { foreignKey: "author_id" });
  };
  return Book;
};
