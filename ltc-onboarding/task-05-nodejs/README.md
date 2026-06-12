# Task 05 — Node.js & Express REST API

A small **reading list API** built with **Node.js** and **Express**. It exposes REST endpoints to list, create, update, and delete books. Data is stored in memory — no database required.

This is the **server-side** counterpart to **Task 02**, where you consumed REST APIs from the browser. Here you build the API yourself.

## Project structure

```
task-05-nodejs/
├── server.js      # Express app, routes, and middleware
├── data.js        # In-memory books and CRUD helpers
├── package.json
└── README.md
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
npm start
```

For development with auto-restart on file changes:

```bash
npm run dev
```

You should see:

```
Server ready at http://localhost:3000
```

## API endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Health check |
| GET | `/api/books` | List all books |
| GET | `/api/books?status=reading` | Filter by status |
| GET | `/api/books/:id` | Get one book |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Remove a book |

Valid `status` values: `want-to-read`, `reading`, `finished`.


### Use with Task 02

Start this server, then open **Task 02** (`task-02-rest-api-client/index.html`). The book finder sends POST, PUT, and DELETE requests to `http://localhost:3000/api/books` instead of a fake API.

## Testing with curl

**Health check**

```bash
curl http://localhost:3000/health
```

**List all books (GET)**

```bash
curl http://localhost:3000/api/books
```

**Filter by status (GET)**

```bash
curl "http://localhost:3000/api/books?status=reading"
```

**Get one book (GET)**

```bash
curl http://localhost:3000/api/books/1
```

**Add a book (POST)**

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Foundation","author":"Isaac Asimov","status":"want-to-read","notes":""}'
```

**Update a book (PUT)**

```bash
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"finished","notes":"Great ending"}'
```

**Delete a book (DELETE)**

```bash
curl -X DELETE http://localhost:3000/api/books/3
```

## Theory

### What Node.js is

**Node.js** runs JavaScript outside the browser — on your computer or a server. It uses the same language you learned in Tasks 01 and 02, but for backend work: APIs, file I/O, scripts, and tooling.

In this project, `node server.js` starts a process that listens for HTTP requests and responds with JSON.

### npm and package.json

**npm** (Node Package Manager) installs libraries your project depends on. **`package.json`** lists those dependencies and scripts (like `npm start`).

- `npm install` — downloads packages into `node_modules/`
- `dependencies` — packages needed to run the app (e.g. `express`)
- `devDependencies` — tools for development only (e.g. `nodemon`)

### What Express is

**Express** is a minimal web framework for Node.js. It handles routing (matching URLs and HTTP methods to handler functions), middleware, and sending responses — so you don't build everything from raw Node APIs.

```js
const app = express();
app.get("/api/books", (req, res) => { ... });
app.listen(3000);
```

### Routes and HTTP methods

A **route** pairs a URL pattern with a handler. The **method** tells the server what action to perform:

| Method | Action | Example in this app |
|--------|--------|---------------------|
| GET | Read data | List or get books |
| POST | Create data | Add a new book |
| PUT | Update data | Change status or notes |
| DELETE | Remove data | Delete a book |

### Middleware

**Middleware** runs on every request (or on matching routes) before your handler. `express.json()` parses JSON request bodies so `req.body` contains the parsed object — essential for POST and PUT.

### Request and response objects

- **`req`** (request) — URL params (`req.params.id`), query strings (`req.query.status`), body (`req.body`)
- **`res`** (response) — send data back: `res.json()`, `res.status(404).json()`

## Further reading

- [Node.js docs](https://nodejs.org/docs/latest/api/)
- [Express getting started](https://expressjs.com/en/starter/installing.html)
- [MDN: HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [MDN: HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
