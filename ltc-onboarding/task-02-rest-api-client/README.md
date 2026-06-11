# Task 02 — REST API Client

A small **book finder** built with plain HTML, CSS, and JavaScript. It searches real books via the **Open Library API** (GET) and practices create/update/delete requests with **JSONPlaceholder** (POST, PUT, DELETE).

## Project structure

```
task-02-rest-api-client/
├── index.html   # Page structure
├── style.css    # Layout and styling
├── app.js       # fetch(), error handling, API calls
└── README.md
```

## How to run

No install or build step required.

1. Open `index.html` in a browser (double-click the file, or use Live Server in your editor).
2. Search for a book, add it to your reading list, edit a note, and remove items.
3. Watch the **Last request** panel to see the HTTP method, status code, and URL.

## APIs used

| API | Purpose | Methods |
|-----|---------|---------|
| [Open Library](https://openlibrary.org/developers/api) | Search real books | GET |
| [JSONPlaceholder](https://jsonplaceholder.typicode.com/) | Practice saving favorites | POST, PUT, DELETE |

JSONPlaceholder is a **fake** REST API — it returns success responses but does not persist data. This app stores your reading list in `localStorage` so the UI still works between page reloads.

## Features

- Search books by title or author (Open Library)
- Display cover, title, author, and year from JSON
- Add books to a reading list (POST)
- Edit notes on saved books (PUT)
- Remove books from the list (DELETE)
- Loading, empty, and error states
- Request inspector showing method, status code, and URL

## API testing with curl

**Search books (GET)**

```bash
curl "https://openlibrary.org/search.json?q=dune&limit=3"
```

**Add a post (POST)**

```bash
curl -X POST https://jsonplaceholder.typicode.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Dune","body":"Frank Herbert","userId":1}'
```

**Update a post (PUT)**

```bash
curl -X PUT https://jsonplaceholder.typicode.com/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"id":1,"title":"Dune","body":"Sci-fi classic","userId":1}'
```

**Delete a post (DELETE)**

```bash
curl -X DELETE https://jsonplaceholder.typicode.com/posts/1
```

Open **DevTools → Network** while using the app to inspect real request/response headers and JSON bodies.

## Theory

### What an API is

An **API** (Application Programming Interface) is a way for programs to talk to each other. A **web API** exposes data and actions over HTTP so clients (like your browser) can request information from a server.

### Client–server communication

1. The **client** (your browser) sends an **HTTP request** to a URL.
2. The **server** (Open Library, JSONPlaceholder) processes the request.
3. The server sends back an **HTTP response** with a status code and usually a **JSON** body.
4. Your JavaScript reads the response and updates the page.

### REST APIs

**REST** organizes APIs around **resources** (books, posts, users) and **URLs**. Each URL represents a thing or collection. You use HTTP methods to say what you want to do:

| Method | Action | Example in this app |
|--------|--------|---------------------|
| GET | Read data | Search books |
| POST | Create data | Add book to list |
| PUT | Update data | Save a note |
| DELETE | Remove data | Remove from list |

### Request and response structure

**Request:** method + URL + optional headers + optional JSON body  
**Response:** status code + headers + JSON body

Example GET request:

```
GET /search.json?q=dune&limit=10
Host: openlibrary.org
```

Example JSON response (simplified):

```json
{
  "docs": [
    {
      "title": "Dune",
      "author_name": ["Frank Herbert"],
      "first_publish_year": 1965,
      "cover_i": 9255725
    }
  ]
}
```

### HTTP status codes

| Code | Meaning | When you see it |
|------|---------|-----------------|
| 200 | OK | Request succeeded |
| 201 | Created | POST succeeded (JSONPlaceholder) |
| 204 | No Content | DELETE succeeded |
| 400 | Bad Request | Invalid data sent |
| 404 | Not Found | Resource does not exist |
| 500 | Server Error | Something failed on the server |

In `app.js`, `response.ok` is `true` for status 200–299. Other codes throw an error so the UI can show a message.

### Making API requests in JavaScript

The **`fetch()`** API sends HTTP requests and returns a Promise:

```javascript
const response = await fetch(url);
const data = await response.json();
```

For POST/PUT, send a JSON body:

```javascript
await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Dune", userId: 1 }),
});
```

### Error handling

Network failures and bad status codes should be handled so the user sees a clear message:

- Wrap `fetch` in `try/catch` for network errors
- Check `response.ok` (or the status code) before treating the response as success
- Show errors in the UI instead of failing silently

### JSON

**JSON** (JavaScript Object Notation) is the standard format for API data. Use `response.json()` to parse it. Access nested fields with dot notation: `data.docs[0].title`.

### GraphQL vs REST (preview)

This task uses **REST** — different URLs and methods for different actions. In **Task 04** you will build a **GraphQL** API where clients send queries to a single endpoint. Both patterns are common in real projects.

---

## Further reading

- [MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN: HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Open Library API docs](https://openlibrary.org/developers/api)
- [JSONPlaceholder guide](https://jsonplaceholder.typicode.com/guide/)
