const { mergeResolvers } = require("@graphql-tools/merge");
const bookResolvers = require("./resolvers/bookResolvers");
const authorResolvers = require("./resolvers/authorResolvers");
const reviewResolvers = require("./resolvers/reviewResolvers"); 

module.exports = mergeResolvers([bookResolvers, authorResolvers, reviewResolvers]);
