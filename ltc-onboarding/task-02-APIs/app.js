const OPEN_LIBRARY_SEARCH = "https://openlibrary.org/search.json";
const API_BASE = "http://localhost:3000/api/books";

const searchForm = document.getElementById("search-form");
const searchQuery = document.getElementById("search-query");
const searchBtn = document.getElementById("search-btn");
const searchResults = document.getElementById("search-results");
const searchError = document.getElementById("search-error");
const searchLoading = document.getElementById("search-loading");
const searchEmpty = document.getElementById("search-empty");
const searchIdle = document.getElementById("search-idle");

const readingListEl = document.getElementById("reading-list");
const listCount = document.getElementById("list-count");
const listError = document.getElementById("list-error");
const listEmpty = document.getElementById("list-empty");

const requestMethod = document.getElementById("request-method");
const requestStatus = document.getElementById("request-status");
const requestUrl = document.getElementById("request-url");

let readingList = [];

function updateRequestPanel(method, url, status) {
  requestMethod.textContent = method;
  requestUrl.textContent = url;

  if (status === null || status === undefined) {
    requestStatus.textContent = "—";
    requestStatus.className = "";
    return;
  }

  const label = `${status} ${status >= 200 && status < 300 ? "OK" : "Error"}`;
  requestStatus.textContent = label;
  requestStatus.className = status >= 200 && status < 300 ? "status-ok" : "status-error";
}

function showError(element, message) {
  element.textContent = message;
  element.hidden = false;
}

function hideError(element) {
  element.hidden = true;
  element.textContent = "";
}

function getCoverUrl(coverId) {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}

function formatAuthors(authors) {
  if (!authors || authors.length === 0) return "Unknown author";
  return authors.join(", ");
}

function formatYear(year) {
  return year ? ` · ${year}` : "";
}

function normalizeApiBook(book) {
  const coverId = book.coverId ?? null;
  return {
    id: book.id,
    key: book.key,
    title: book.title,
    authors: book.authors || [],
    year: book.year,
    coverId,
    coverUrl: book.coverUrl || getCoverUrl(coverId),
    note: book.note || "",
  };
}

function createCoverElement(book) {
  const coverUrl = book.coverUrl || getCoverUrl(book.coverId);
  const title = book.title;

  if (coverUrl) {
    const img = document.createElement("img");
    img.className = "book-cover";
    img.src = coverUrl;
    img.alt = `Cover of ${title}`;
    img.loading = "lazy";
    img.onerror = () => {
      const placeholder = document.createElement("div");
      placeholder.className = "book-cover placeholder";
      placeholder.textContent = "No cover";
      img.replaceWith(placeholder);
    };
    return img;
  }

  const placeholder = document.createElement("div");
  placeholder.className = "book-cover placeholder";
  placeholder.textContent = "No cover";
  return placeholder;
}

async function apiRequest(url, options = {}) {
  const method = options.method || "GET";
  updateRequestPanel(method, url, null);

  const response = await fetch(url, options);
  updateRequestPanel(method, url, response.status);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function loadReadingList() {
  hideError(listError);

  try {
    const books = await apiRequest(API_BASE);
    readingList = books.map(normalizeApiBook);
  } catch (error) {
    readingList = [];
    showError(
      listError,
      `Could not load reading list. Start the Task 05 server with npm run dev. (${error.message})`
    );
  }
}

async function searchBooks(query) {
  const url = `${OPEN_LIBRARY_SEARCH}?q=${encodeURIComponent(query)}&limit=10`;
  const data = await apiRequest(url);
  return data.docs || [];
}

function normalizeBook(doc) {
  const coverId = doc.cover_i ?? null;
  return {
    key: doc.key,
    title: doc.title || "Untitled",
    authors: doc.author_name || [],
    year: doc.first_publish_year || null,
    coverId,
    coverUrl: getCoverUrl(coverId),
  };
}

function isBookSaved(key) {
  return readingList.some((book) => book.key === key);
}

function renderSearchResults(books) {
  searchResults.innerHTML = "";

  books.forEach((doc) => {
    const book = normalizeBook(doc);
    const li = document.createElement("li");
    li.className = "book-item";

    const info = document.createElement("div");
    info.className = "book-info";

    const title = document.createElement("h3");
    title.className = "book-title";
    title.textContent = book.title;

    const meta = document.createElement("p");
    meta.className = "book-meta";
    meta.textContent = `${formatAuthors(book.authors)}${formatYear(book.year)}`;

    info.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "book-actions";

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "btn btn-small btn-primary";
    saveBtn.textContent = isBookSaved(book.key) ? "Saved" : "Add to list";
    saveBtn.disabled = isBookSaved(book.key);
    saveBtn.addEventListener("click", () => addBookToList(book, saveBtn));

    actions.append(saveBtn);
    li.append(createCoverElement(book), info, actions);
    searchResults.append(li);
  });
}

function renderReadingList() {
  readingListEl.innerHTML = "";
  listCount.textContent = `${readingList.length} book${readingList.length === 1 ? "" : "s"}`;
  listEmpty.hidden = readingList.length > 0;

  readingList.forEach((book) => {
    const li = document.createElement("li");
    li.className = "book-item";
    li.dataset.id = book.id;

    const info = document.createElement("div");
    info.className = "book-info";

    const title = document.createElement("h3");
    title.className = "book-title";
    title.textContent = book.title;

    const meta = document.createElement("p");
    meta.className = "book-meta";
    meta.textContent = `${formatAuthors(book.authors)}${formatYear(book.year)}`;

    const noteField = document.createElement("div");
    noteField.className = "note-field";

    const noteInput = document.createElement("input");
    noteInput.type = "text";
    noteInput.placeholder = "Add a note — press Enter or click away to save";
    noteInput.value = book.note || "";

    const noteStatus = document.createElement("span");
    noteStatus.className = "note-status";
    noteStatus.hidden = true;

    let savedNote = book.note || "";

    function saveNote() {
      const value = noteInput.value;
      if (value === savedNote) return;
      updateBookNote(book.id, value, noteStatus).then((ok) => {
        if (ok) savedNote = value;
      });
    }

    noteInput.addEventListener("blur", saveNote);
    noteInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        saveNote();
        noteInput.blur();
      }
    });

    noteField.append(noteInput, noteStatus);
    info.append(title, meta, noteField);

    const actions = document.createElement("div");
    actions.className = "book-actions";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-small btn-danger";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeBookFromList(book.id));

    actions.append(removeBtn);
    li.append(createCoverElement(book), info, actions);
    readingListEl.append(li);
  });
}

async function addBookToList(book, button) {
  hideError(listError);
  button.disabled = true;
  button.textContent = "Saving…";

  try {
    const response = await apiRequest(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: book.title,
        authors: book.authors,
        year: book.year,
        coverId: book.coverId,
        key: book.key,
        note: "",
      }),
    });

    readingList.push(normalizeApiBook(response));
    renderReadingList();
    button.textContent = "Saved";
  } catch (error) {
    button.disabled = false;
    button.textContent = "Add to list";

    if (error.message.includes("409")) {
      await loadReadingList();
      renderReadingList();
      button.textContent = "Saved";
      button.disabled = true;
      return;
    }

    showError(listError, `Could not save book: ${error.message}`);
  }
}

async function updateBookNote(id, note, statusEl) {
  hideError(listError);

  const book = readingList.find((item) => String(item.id) === String(id));
  if (!book) return false;

  if (statusEl) {
    statusEl.hidden = true;
    statusEl.textContent = "";
    statusEl.className = "note-status";
  }

  try {
    const response = await apiRequest(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });

    book.note = response.note ?? note;

    if (statusEl) {
      statusEl.textContent = "Saved";
      statusEl.className = "note-status note-status--ok";
      statusEl.hidden = false;
    }

    return true;
  } catch (error) {
    if (statusEl) {
      statusEl.textContent = "Save failed";
      statusEl.className = "note-status note-status--error";
      statusEl.hidden = false;
    }
    showError(listError, `Could not update note: ${error.message}`);
    return false;
  }
}

async function removeBookFromList(id) {
  hideError(listError);

  try {
    await apiRequest(`${API_BASE}/${id}`, { method: "DELETE" });

    const removed = readingList.find((book) => book.id === id);
    readingList = readingList.filter((book) => book.id !== id);
    renderReadingList();

    if (removed?.key) {
      const saveButtons = searchResults.querySelectorAll(".btn-primary");
      saveButtons.forEach((btn) => {
        const item = btn.closest(".book-item");
        const title = item?.querySelector(".book-title")?.textContent;
        if (title === removed.title) {
          btn.disabled = false;
          btn.textContent = "Add to list";
        }
      });
    }
  } catch (error) {
    showError(listError, `Could not remove book: ${error.message}`);
  }
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideError(searchError);

  const query = searchQuery.value.trim();
  if (!query) return;

  searchIdle.hidden = true;
  searchEmpty.hidden = true;
  searchResults.innerHTML = "";
  searchLoading.hidden = false;
  searchBtn.disabled = true;

  try {
    const books = await searchBooks(query);
    searchLoading.hidden = true;

    if (books.length === 0) {
      searchEmpty.hidden = false;
      return;
    }

    renderSearchResults(books);
  } catch (error) {
    searchLoading.hidden = true;
    showError(searchError, `Search failed: ${error.message}`);
  } finally {
    searchBtn.disabled = false;
  }
});

loadReadingList().then(() => renderReadingList());
