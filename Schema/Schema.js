const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: GraphQLString,
    name: GraphQLString,
    genre: GraphQLString,
  }),
});

const books = [
  { name: "Wings of Fire", id: "1", genre: "Biography" },

  { name: "Book2", id: "2", genre: "genre2" },
];

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: {
        id: {
          type: GraphQLString,
        },
      },
      resolve(parent, args) {
        console.log(args.id);
        return books.map((book) => book.id === args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
