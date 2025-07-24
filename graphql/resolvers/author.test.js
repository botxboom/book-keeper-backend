const { createTestClient } = require("apollo-server-testing");
const { ApolloServer } = require("apollo-server");
const typeDefs = require("../schema");
const { Sequelize, DataTypes } = require("sequelize");
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
    Query: authorResolvers.Query,
    Mutation: authorResolvers.Mutation,
  },
  context: () => ({ models: { Author, Book } }),
});

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Author Resolvers", () => {
  it("creates an author", async () => {
    const { mutate } = createTestClient(server);
    const CREATE_AUTHOR = `
      mutation {
        createAuthor(name: "J.K. Rowling", biography: "Famous author", born_date: "1965-07-31", avatar: "url") {
          id
          name
        }
      }
    `;
    const res = await mutate({ mutation: CREATE_AUTHOR });
    expect(res.data.createAuthor.name).toBe("J.K. Rowling");
  });

  it("updates an author", async () => {
    const { mutate } = createTestClient(server);
    const CREATE_AUTHOR = `
      mutation {
        createAuthor(name: "J.K. Rowling", biography: "Famous author", born_date: "1965-07-31", avatar: "url") {
          id
        }
      }
    `;
    const createRes = await mutate({ mutation: CREATE_AUTHOR });
    const authorId = createRes.data.createAuthor.id;

    const UPDATE_AUTHOR = `
      mutation {
        updateAuthor(id: ${authorId}, name: "J.K. Rowling Updated", biography: "Updated biography") {
          id
          name
          biography
        }
      }
    `;
    const updateRes = await mutate({ mutation: UPDATE_AUTHOR });
    expect(updateRes.data.updateAuthor.name).toBe("J.K. Rowling Updated");
  });

  it("deletes an author", async () => {
    const { mutate } = createTestClient(server);
    const CREATE_AUTHOR = `
      mutation {
        createAuthor(name: "J.K. Rowling", biography: "Famous author", born_date: "1965-07-31", avatar: "url") {
          id
        }
      }
    `;
    const createRes = await mutate({ mutation: CREATE_AUTHOR });
    const authorId = createRes.data.createAuthor.id;
    console.log("Author ID for deletion:", authorId);

    const DELETE_AUTHOR = `
      mutation {
        deleteAuthor(id: ${authorId.toString()})
      }
    `;
    const deleteRes = await mutate({ mutation: DELETE_AUTHOR });
    expect(deleteRes.data.deleteAuthor).toBe(true);
  });
});
