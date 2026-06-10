import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import db from './_db.js';

const games = db.games
const reviews = db.reviews
const authors = db.authors  

const resolvers = {
    Query: {
      games (){
        return db.games
      },
      game: (_, args) => {
        return db.games.find(g => g.id === Number(args.id))
      },
      reviews (){
        return db.reviews
      },
      review: (_, args) => {
        return db.reviews.find(r => r.id === Number(args.id))
      },
      authors (){
        return db.authors
      },
      author: (_, args) => {
        return db.authors.find(a => a.id === Number(args.id))
      }
    },
    Game: {
      reviews: (game) => {
        return db.reviews.filter(r => r.game.id === game.id)
      }
    },
    Review: {
      game: (review) => {
        return db.games.find(g => g.id === review.game.id)
      }
    },
    Author: {
      reviews: (author) => {
        return db.reviews.filter(r => r.author.id === author.id)
      }
    },
    Mutation: {
      deleteGame: (_, args) => {
        db.games = db.games.filter(g => g.id !== Number(args.id))
        return db.games
      },
      addGame(_, args) {
        const game = {
            ...args.game,
            id: Math.floor(Math.random() * 10000),
        }
        db.games.push(game)
        return game
      },
      updateGame(_, args) {
        const id = Number(args.id)
        db.games = db.games.map((g) => {
            if (g.id === id) {
                return { ...g, ...args.edits }
            }
            return g
        })
        return db.games.find((g) => g.id === id)
      }
    }
  }

//server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log('Server ready at port', 4000);