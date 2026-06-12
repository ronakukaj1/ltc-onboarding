import express from "express";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookById,
  getBookByKey,
  updateBook,
} from "./data.js";

const app = express();
const PORT = 3000;

const VALID_STATUSES = ["want-to-read", "reading", "finished"];

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Reading List API",
    endpoints: {
      health: "GET /health",
      listBooks: "GET /api/books",
      getBook: "GET /api/books/:id",
      addBook: "POST /api/books",
      updateBook: "PUT /api/books/:id",
      deleteBook: "DELETE /api/books/:id",
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/books", (req, res) => {
  const { status } = req.query;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Use one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  res.json(getAllBooks(status));
});

app.get("/api/books/:id", (req, res) => {
  const book = getBookById(req.params.id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.json(book);
});

app.post("/api/books", (req, res) => {
  const { title, authors, author, year, coverId, key, note, notes, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  if (key) {
    const existing = getBookByKey(key);
    if (existing) {
      return res.status(409).json({ error: "Book already in list", book: existing });
    }
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Use one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  const authorList = authors || (author ? [author] : []);

  const book = addBook({
    title,
    authors: authorList,
    year: year ?? null,
    coverId: coverId ?? null,
    key: key ?? null,
    note: note ?? notes ?? "",
    status,
  });
  res.status(201).json(book);
});

app.put("/api/books/:id", (req, res) => {
  const { status } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Use one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  const book = updateBook(req.params.id, req.body);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.json(book);
});

app.delete("/api/books/:id", (req, res) => {
  const book = deleteBook(req.params.id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.json(book);
});

app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
