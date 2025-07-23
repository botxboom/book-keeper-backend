require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const sequelize = require("./db/postgres");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql");
const models = require("./models");

const MONGODB_URI = process.env.MONGODB_URI;

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    await sequelize.sync({ alter: true });
    console.log("PostgreSQL synced");

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        models,
      }),
    });

    const { url } = await server.listen({ port: 4000 });
    console.log(`server running at ${url}`);
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();
