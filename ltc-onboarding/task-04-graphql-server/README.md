# Task 04 — GraphQL Server

A small GraphQL API for a game review app. It uses **Apollo Server** with an in-memory database and covers schemas, types, resolvers, queries, mutations, and nested data fetching.

## Project structure

```
task-04-graphql-server/
├── index.js      # Apollo Server setup and resolvers
├── schema.js     # GraphQL schema (types, queries, mutations)
├── _db.js        # In-memory seed data (games, reviews, authors)
└── package.json
```

## How to run the server

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)

### Install dependencies

From this directory:

```bash
npm install
```

### Start the server

```bash
node index.js
```

For development with auto-restart on file changes:

```bash
npx nodemon index.js
```

You should see:

```
Server ready at port 4000
```

The GraphQL endpoint is available at **http://localhost:4000**.

## How to use the server

### Apollo Sandbox (recommended)

1. Start the server.
2. Open **http://localhost:4000** in your browser.
3. Apollo Sandbox opens — a built-in UI for writing and running GraphQL operations.

### Example queries

**List all games**

```graphql
query {
  games {
    id
    title
    platform
  }
}
```

**Get one game by ID**

```graphql
query {
  game(id: "1") {
    title
    platform
  }
}
```

**Nested data — game with its reviews**

```graphql
query {
  game(id: "1") {
    title
    reviews {
      rating
      content
    }
  }
}
```

**Author with their reviews**

```graphql
query {
  author(id: "1") {
    name
    verified
    reviews {
      content
      rating
    }
  }
}
```

**Fetch only the fields you need**

```graphql
query {
  games {
    title
  }
}
```

GraphQL returns exactly the fields you request — no more, no less.

### Example mutations

**Add a game**

```graphql
mutation {
  addGame(game: { title: "Elden Ring", platform: ["PC", "PS5"] }) {
    id
    title
    platform
  }
}
```

**Update a game**

```graphql
mutation {
  updateGame(id: "1", edits: { title: "The Witcher 3: Complete Edition" }) {
    id
    title
    platform
  }
}
```

**Delete a game**

```graphql
mutation {
  deleteGame(id: "3") {
    id
    title
  }
}
```

### Using variables

Instead of hard-coding values in the operation, pass them via a **variables** panel in Sandbox:

**Query**

```graphql
query GetGame($gameId: ID!) {
  game(id: $gameId) {
    title
    platform
    reviews {
      content
    }
  }
}
```

**Variables** (JSON in the Sandbox variables panel)

```json
{
  "gameId": "1"
}
```

**Mutation with variables**

```graphql
mutation AddGame($input: AddGameInput!) {
  addGame(game: $input) {
    id
    title
    platform
  }
}
```

```json
{
  "input": {
    "title": "Hades",
    "platform": ["PC", "Switch"]
  }
}
```

---

## Learning goals

After working through this task, you should be able to:

- Explain what GraphQL is
- Understand the difference between GraphQL and REST
- Write basic GraphQL queries and mutations
- Understand schemas, types, and resolvers
- Fetch and manipulate data using GraphQL

---

## Theory

### What GraphQL is

GraphQL is a query language for APIs. Instead of many REST endpoints, clients send a single request describing the exact data they need. The server returns JSON matching that shape.

### GraphQL architecture

A GraphQL server has three main parts: a **schema** (what's available), **resolvers** (how to fetch each field), and a **data source** (database, file, etc.). The client only talks to the schema — it doesn't need to know where data comes from.

### Schemas and types

The schema defines your API using types like `String`, `Int`, `Boolean`, and custom object types. `Query` is for reading data; `Mutation` is for changing it. The `!` means a field is required; `[ ]` means a list.

### Resolvers

Resolvers are functions that return data for each field. Root resolvers handle top-level queries and mutations. Field resolvers handle nested data (e.g. a game's reviews).

### Queries

Queries are read-only operations. You request specific fields, and GraphQL returns only those fields — nothing extra.

### Mutations

Mutations create, update, or delete data. Like queries, you choose which fields to get back in the response.

### Arguments and variables

**Arguments** pass values directly to a field (e.g. an ID). **Variables** let you reuse the same operation with different values — useful for dynamic or parameterized requests.

### Nested data fetching

You can request related data in one query (e.g. a game and its reviews). Each level is resolved by the appropriate resolver. This avoids multiple round trips that REST often needs.

### GraphQL vs REST

REST uses multiple endpoints with fixed response shapes. GraphQL uses one endpoint and lets the client pick fields. GraphQL reduces over-fetching and under-fetching but has a steeper learning curve. Both are valid — use GraphQL when clients need flexible, nested data.

### Basic error handling

GraphQL responses include `data` and optionally `errors`. Invalid queries (wrong field names, bad types) fail with error messages before running. Missing records may return `null` in data without a top-level error. Check both `data` and `errors` when debugging.

---

## Quick reference — available operations

### Queries

| Field | Arguments | Returns |
|-------|-----------|---------|
| `games` | — | `[Game]` |
| `game` | `id: ID!` | `Game` |
| `reviews` | — | `[Review]` |
| `review` | `id: ID!` | `Review` |
| `authors` | — | `[Author]` |
| `author` | `id: ID!` | `Author` |

### Mutations

| Field | Arguments | Returns |
|-------|-----------|---------|
| `addGame` | `game: AddGameInput!` | `Game` |
| `updateGame` | `id: ID!`, `edits: EditGameInput!` | `Game` |
| `deleteGame` | `id: ID!` | `[Game]` |

---

## Further reading

- [GraphQL official docs](https://graphql.org/learn/)
- [Apollo Server docs](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL schema language](https://graphql.org/learn/schema/)
