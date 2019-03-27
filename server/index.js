const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const {
  lang,
  allLang,
  addLang,
  deleteLang,
  updateLang
} = require("./resolver");

const typeDefs = gql`
  type Lang {
    name: String
    ext: String
  }

  input UpdateLang {
      name: String
      ext: String
  }

  type Query {
    lang(name: String): Lang
    allLang: [Lang]
  }

  type Mutation {
    addLang(name: String, ext: String): Lang
    deleteLang(name: String): Lang
    updateLang(name: String, newContent: UpdateLang): Lang
  }
`;

const resolvers = {
  Query: {
    lang,
    allLang
  },
  Mutation: {
    addLang,
    deleteLang,
    updateLang
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

mongoose.connect(
  "mongodb+srv://node:password111@workshop-graphql-mongodb-nodejs-aqlyd.mongodb.net/workshop?retryWrites=true",
  { useNewUrlParser: true }
);

mongoose.connection
  .once("open", () => {
    console.log("Connected to MongoLab");
    server.listen().then(({ url }) => console.log(`Listening on ${url}`));
  })
  .on("error", error => console.log("Error connecting to MongoLab:", error));
