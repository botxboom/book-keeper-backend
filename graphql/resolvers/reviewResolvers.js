const { Review } = require("../../models");

const reviewResolvers = {
  Query: {
    reviewsByBook: async (_, { bookId }) => {
      return await Review.find({ bookId });
    },
  },
  Mutation: {
    addReview: async (_, { bookId, user, rating, comment }) => {
      return await Review.create({ bookId, user, rating, comment });
    },
    deleteReview: async (_, { id }) => {
      const result = await Review.deleteOne({ _id: id });
      return result.deletedCount > 0;
    },
  },
  Book: {
    reviews: async (parent, args, context) => {
      return await Review.find({ bookId: parent.id });
    },
  },
};

module.exports = reviewResolvers;
