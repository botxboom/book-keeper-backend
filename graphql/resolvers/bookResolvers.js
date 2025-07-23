const { Book, Author, Review } = require("../../models");

const bookResolvers = {
  Query: {
    books: async (_, { filter = "", page = 1, limit = 10 }, { models }) => {
      const offset = (page - 1) * limit;

      return models.Book.findAll({
        where: {
          title: {
            [require("sequelize").Op.iLike]: `%${filter}%`,
          },
        },
        include: [Author],
        limit,
        offset,
        order: [["published_date", "DESC"]],
      });
    },
  },

  Mutation: {
    createBook: async (
      _,
      { title, description, published_date, author_id, cover_image }
    ) => {
      return Book.create({
        title,
        description,
        published_date,
        author_id,
        cover_image,
      });
    },

    updateBook: async (
      _,
      { id, title, description, published_date, cover_image },
      { models }
    ) => {
      const book = await models.Book.findByPk(id);
      if (!book) throw new Error("Book not found");

      await book.update({ title, description, published_date, cover_image });
      return book;
    },

    deleteBook: async (_, { id }, { models }) => {
      const { Book, Author } = models;

      const book = await Book.findByPk(id);
      if (!book) throw new Error("Book not found");

      await Review.deleteMany({ bookId: id.toString() });

      await book.destroy();

      return true;
    },
  },

  Book: {
    author: async (book) => {
      return Author.findByPk(book.author_id);
    },
  },
};

module.exports = bookResolvers;
