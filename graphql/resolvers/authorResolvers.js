const { Book } = require("../../models");

const authorResolvers = {
  Query: {
    authors: async (_, { filter = "", page = 1, limit = 10 }, { models }) => {
      const offset = (page - 1) * limit;

      return models.Author.findAll({
        where: {
          name: {
            [require("sequelize").Op.iLike]: `%${filter}%`,
          },
        },
        include: [Book],
        limit,
        offset,
        order: [["born_date", "ASC"]],
      });
    },
  },

  Mutation: {
    createAuthor: async (
      _,
      { name, biography, born_date, avatar },
      { models }
    ) => {
      return models.Author.create({ name, biography, born_date, avatar });
    },

    updateAuthor: async (
      _,
      { id, name, biography, born_date, avatar },
      { models }
    ) => {
      const author = await models.Author.findByPk(id);
      if (!author) throw new Error("Author not found");

      await author.update({ name, biography, born_date, avatar });
      return author;
    },

    deleteAuthor: async (_, { id }, { models }) => {
      await models.Book.destroy({ where: { author_id: id } });

      const deleted = await models.Author.destroy({ where: { id } });

      return deleted > 0;
    },
  },

  Author: {
    books: async (author) => {
      return Book.findAll({ where: { author_id: author.id } });
    },
  },
};

module.exports = authorResolvers;
