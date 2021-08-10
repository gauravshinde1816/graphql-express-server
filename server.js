const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
const connectDB = require("./config/db");
const Schema = require("./Schema/Schema");
const Event = require("./models/Events");

let events = [];
var schema = buildSchema(`

  type Event{
    _id:ID!
    name:String!  
    description:String!
    price:Float!
    date:String!
  }
 

  type RootQuery{
    events:[Event!]!
  }

  input EventInput{
    name:String!  
    description:String!
    price:Float!
    date:String!
  }


  type RootMutations{
  createEvents(eventInput:EventInput):Event

  }


  schema{
      query:RootQuery
      mutation:RootMutations
  }

`);

//controller (Resolver function)
var root = {
  events: () => {
    return Event.find({})
      .then((result) => {
        // console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err.message);

        throw err;
      });
  },

  createEvents: (args) => {
    const body = {
      name: args.eventInput.name,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
    };

    const event = new Event(body);

    return event
      .save()
      .then((result) => {
        return result._doc;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
//middleware
app.use(express.json());
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);
app.set("view engine", "ejs");
// app.set("views", __dirname + "/views");

//connect to database
connectDB();

//listen to PORT
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
