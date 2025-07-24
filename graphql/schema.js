const { gql } = require("apollo-server");

const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    biography: String
    born_date: String
    books: [Book]
    avatar: String
  }

  type Book {
    id: ID!
    title: String!
    description: String
    published_date: String
    author: Author
    reviews: [Review]
    cover_image: String
  }

  type Review {
    id: ID!
    bookId: String!
    user: String!
    rating: Int!
    comment: String
    createdAt: String
  }

  type Query {
    books(filter: String, page: Int, limit: Int): [Book]
    book(id: ID!): Book
    authors(filter: String, page: Int, limit: Int): [Author]
    reviewsByBook(bookId: String!): [Review]
  }

  type Mutation {
    createBook(
      title: String!
      description: String
      published_date: String
      author_id: ID!
      cover_image: String
    ): Book

    updateBook(
      id: ID!
      title: String
      description: String
      published_date: String
      cover_image: String
    ): Book

    deleteBook(id: ID!): Boolean

    createAuthor(
      name: String!
      biography: String
      born_date: String
      avatar: String
    ): Author

    updateAuthor(
      id: ID!
      name: String
      biography: String
      born_date: String
      avatar: String
    ): Author

    deleteAuthor(id: ID!): Boolean
    addReview(
      bookId: String!
      user: String!
      rating: Int!
      comment: String
    ): Review
    deleteReview(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
