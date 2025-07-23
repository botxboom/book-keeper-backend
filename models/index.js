const Sequelize = require("sequelize");
const sequelize = require("../db/postgres");

const AuthorModel = require("./Author");
const BookModel = require("./Book");
const ReviewModel = require("./Review");

const Author = AuthorModel(sequelize, Sequelize.DataTypes);
const Book = BookModel(sequelize, Sequelize.DataTypes);

Author.associate?.({ Book });
Book.associate?.({ Author });

module.exports = {
  sequelize,
  Author,
  Book,
  Review: ReviewModel
};
