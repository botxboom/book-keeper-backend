const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server");
const { MongoMemoryServer } = require("mongodb-memory-server");
const reviewResolvers = require("../reviewResolvers");
const typeDefs = require("../../schema");

let mongod;
let server;

jest.mock("../../../db/postgres", () => {
  const SequelizeMock = require("sequelize-mock");
  return new SequelizeMock(); // returns a mocked sequelize instance
});

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query: reviewResolvers.Query,
      Mutation: reviewResolvers.Mutation,
    },
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe("Review Resolvers", () => {
  it("adds a review", async () => {
    const { mutate } = require("apollo-server-testing").createTestClient(
      server
    );
    const ADD_REVIEW = `
      mutation {
        addReview(bookId: "123", user: "test", rating: 5, comment: "Great!") {
          user
          rating
        }
      }
    `;
    const res = await mutate({ mutation: ADD_REVIEW });
    expect(res.data.addReview.user).toBe("test");
  });

  it("gets reviews by book", async () => {
    const { query } = require("apollo-server-testing").createTestClient(server);
    const GET_REVIEWS = `
      query {
        reviewsByBook(bookId: "123") {
          user
          comment
        }
      }
    `;
    const res = await query({ query: GET_REVIEWS });
    expect(res.data.reviewsByBook.length).toBeGreaterThan(0);
  });

  it("deletes a review", async () => {
    const { mutate } = require("apollo-server-testing").createTestClient(
      server
    );

    const validId = new mongoose.Types.ObjectId().toString();
    await require("../../../models").Review.create({
      _id: validId,
      bookId: "fake-book-id",
      user: "Test User",
      rating: 5,
      comment: "Great book!",
    });
    const DELETE_REVIEW = `
    mutation {
      deleteReview(id: "${validId}")
    }
  `;

    const res = await mutate({ mutation: DELETE_REVIEW });
    expect(res.data.deleteReview).toBe(true);
  });
});
