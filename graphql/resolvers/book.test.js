const { createTestClient } = require("apollo-server-testing");
const { ApolloServer } = require("apollo-server");
const typeDefs = require("../schema");
const { Sequelize, DataTypes } = require("sequelize");
const bookResolvers = require("./bookResolvers");
const authorResolvers = require("./authorResolvers");

// In-memory Sequelize setup
const sequelize = new Sequelize("sqlite::memory:");

jest.mock("../../db/postgres", () => {
  const SequelizeMock = require("sequelize-mock");
  return new SequelizeMock(); // returns a mocked sequelize instance
});

const Author = sequelize.define("Author", {
  name: DataTypes.STRING,
  biography: DataTypes.STRING,
  born_date: DataTypes.STRING,
  avatar: DataTypes.STRING,
});
const Book = sequelize.define("Book", {
  title: DataTypes.STRING,
  author_id: DataTypes.INTEGER,
});

Author.hasMany(Book, { foreignKey: "author_id" });
Book.belongsTo(Author, { foreignKey: "author_id" });

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: { ...bookResolvers.Query, ...authorResolvers.Query },
    Mutation: { ...bookResolvers.Mutation, ...authorResolvers.Mutation },
  },
  context: () => ({ models: { Author, Book } }),
});

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Book Resolvers", () => {
  it("creates a book", async () => {
    const { mutate } = createTestClient(server);
    const CREATE_BOOK = `
      mutation {
        createBook(title: "My Name is Khan", description: "Famous author", published_date: "1965-07-31", cover_image: "url", author_id: "1") {
          id
          title
          description
          published_date
          cover_image
          author{
            id
            name
          }
        }
      }
    `;
    const res = await mutate({ mutation: CREATE_BOOK });
    expect(res.data.createBook.title).toBe("My Name is Khan");
  });
});
