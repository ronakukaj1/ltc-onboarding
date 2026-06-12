function buildCoverUrl(coverId) {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;
}

let books = [
  {
    id: "1",
    title: "Dune",
    authors: ["Frank Herbert"],
    year: 1965,
    coverId: 11481354,
    coverUrl: buildCoverUrl(11481354),
    key: "/works/OL893415W",
    note: "Started part one",
    status: "reading",
  },
  {
    id: "2",
    title: "The Hobbit",
    authors: ["J.R.R. Tolkien"],
    year: 1937,
    coverId: 14627509,
    coverUrl: buildCoverUrl(14627509),
    key: "/works/OL27482W",
    note: "Re-read for the third time",
    status: "finished",
  },
  {
    id: "3",
    title: "Neuromancer",
    authors: ["William Gibson"],
    year: 1984,
    coverId: 283860,
    coverUrl: buildCoverUrl(283860),
    key: "/works/OL27258W",
    note: "",
    status: "want-to-read",
  },
];

let nextId = 4;

export function getAllBooks(status) {
  if (!status) {
    return books;
  }
  return books.filter((book) => book.status === status);
}

export function getBookById(id) {
  return books.find((book) => book.id === String(id));
}

export function getBookByKey(key) {
  if (!key) {
    return null;
  }
  return books.find((book) => book.key === key);
}

export function addBook({
  title,
  authors = [],
  year = null,
  coverId = null,
  key = null,
  note = "",
  status = "want-to-read",
}) {
  const book = {
    id: String(nextId++),
    title,
    authors,
    year,
    coverId,
    coverUrl: buildCoverUrl(coverId),
    key,
    note,
    status,
  };
  books.push(book);
  return book;
}

export function updateBook(id, updates) {
  const bookId = String(id);
  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    return null;
  }

  books[index] = { ...books[index], ...updates, id: bookId };

  if (updates.coverId !== undefined) {
    books[index].coverUrl = buildCoverUrl(books[index].coverId);
  }

  return books[index];
}

export function deleteBook(id) {
  const index = books.findIndex((book) => book.id === String(id));
  if (index === -1) {
    return null;
  }

  const [removed] = books.splice(index, 1);
  return removed;
}
