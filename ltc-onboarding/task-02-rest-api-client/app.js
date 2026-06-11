const OPEN_LIBRARY_SEARCH = "https://openlibrary.org/search.json";
const JSON_PLACEHOLDER = "https://jsonplaceholder.typicode.com/posts";
const STORAGE_KEY = "readingList";

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

let readingList = loadReadingList();

function loadReadingList() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveReadingList() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(readingList));
}

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

function createCoverElement(coverId, title) {
  const coverUrl = getCoverUrl(coverId);

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

async function searchBooks(query) {
  const url = `${OPEN_LIBRARY_SEARCH}?q=${encodeURIComponent(query)}&limit=10`;
  const data = await apiRequest(url);
  return data.docs || [];
}

function normalizeBook(doc) {
  return {
    key: doc.key,
    title: doc.title || "Untitled",
    authors: doc.author_name || [],
    year: doc.first_publish_year || null,
    coverId: doc.cover_i || null,
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
    li.append(createCoverElement(book.coverId, book.title), info, actions);
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
    noteInput.placeholder = "Add a note (PUT request)";
    noteInput.value = book.note || "";
    noteInput.addEventListener("change", () => updateBookNote(book.id, noteInput.value));

    noteField.append(noteInput);
    info.append(title, meta, noteField);

    const actions = document.createElement("div");
    actions.className = "book-actions";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-small btn-danger";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeBookFromList(book.id));

    actions.append(removeBtn);
    li.append(createCoverElement(book.coverId, book.title), info, actions);
    readingListEl.append(li);
  });
}

async function addBookToList(book, button) {
  hideError(listError);
  button.disabled = true;
  button.textContent = "Saving…";

  try {
    const body = {
      title: book.title,
      body: formatAuthors(book.authors),
      userId: 1,
    };

    const response = await apiRequest(JSON_PLACEHOLDER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    readingList.push({
      id: response.id,
      key: book.key,
      title: book.title,
      authors: book.authors,
      year: book.year,
      coverId: book.coverId,
      note: "",
    });

    saveReadingList();
    renderReadingList();
    button.textContent = "Saved";
  } catch (error) {
    button.disabled = false;
    button.textContent = "Add to list";
    showError(listError, `Could not save book: ${error.message}`);
  }
}

async function updateBookNote(id, note) {
  hideError(listError);

  const book = readingList.find((item) => item.id === id);
  if (!book) return;

  try {
    await apiRequest(`${JSON_PLACEHOLDER}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title: book.title,
        body: note,
        userId: 1,
      }),
    });

    book.note = note;
    saveReadingList();
  } catch (error) {
    showError(listError, `Could not update note: ${error.message}`);
  }
}

async function removeBookFromList(id) {
  hideError(listError);

  try {
    await apiRequest(`${JSON_PLACEHOLDER}/${id}`, { method: "DELETE" });

    readingList = readingList.filter((book) => book.id !== id);
    saveReadingList();
    renderReadingList();

    const saveButtons = searchResults.querySelectorAll(".btn-primary");
    saveButtons.forEach((btn) => {
      const item = btn.closest(".book-item");
      const title = item?.querySelector(".book-title")?.textContent;
      const removed = readingList.find((book) => book.title === title);
      if (!removed) {
        btn.disabled = false;
        btn.textContent = "Add to list";
      }
    });
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

renderReadingList();
