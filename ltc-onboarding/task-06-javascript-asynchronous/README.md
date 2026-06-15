# Task 06 — Async JavaScript Countdown Timer

A small **countdown timer** built with plain HTML, CSS, and JavaScript. It practices asynchronous patterns — callbacks, Promises, `async`/`await`, the event loop, error handling, and `fetch`.

This is a **browser-only** project. It does not use Node.js or a local server (except optionally Live Server to open the page).

## Project structure

```
task-06-javascript-asynchronous/
├── index.html   # Page structure and timer UI
├── style.css    # Layout and styling
├── app.js       # Async logic, countdown, demos
└── README.md
```

## How to run

1. Open `index.html` in a browser:
   - Double-click the file in Finder, or
   - Right-click in your editor → **Open with Live Server**
2. Open DevTools (**F12** or **Cmd+Option+I**) → **Console** to see extra logs if needed.
3. Set minutes and seconds, then press **Start**.

> **Note:** This app runs in the **browser**, not in the terminal. Running `node app.js` will not work — the code uses `document`, buttons, and `fetch` in a page context.

## Features

- Set a custom countdown (minutes + seconds)
- **Start**, **Pause/Resume**, and **Reset**
- Visual progress ring and `MM:SS` display
- **Async activity log** — shows sync code, callbacks, Promises, and `async` steps in real time
- **Quick demos** — event loop order, callbacks, promise chain, callback hell
- On completion, **fetches a random quote** from [Quotable API](https://github.com/lukePeavey/quotable)
- Validation errors (e.g. zero duration) with `try`/`catch`

## Topics covered

| Topic | Where in `app.js` |
|-------|-------------------|
| Synchronous vs asynchronous | `boot()`, `formatTime()`, activity log |
| Call stack & event loop | `demoEventLoop()` |
| Callbacks | `validateDurationCallback()` |
| Callback hell | `demoCallbackHell()` |
| Promises (pending, fulfilled, rejected) | `delay()`, `validateDuration()` |
| `.then()` / `.catch()` | `prepareCountdown()`, `fetchCompletionQuote()` |
| Promise chaining | `prepareCountdown()` |
| `async` / `await` | `runCountdown()`, `waitWhilePaused()` |
| Error handling | `try`/`catch` in `runCountdown()` |
| `fetch` | `fetchCompletionQuote()` on timer complete |

## How the countdown works

1. **Start** reads the duration and calls `runCountdown()` (`async`).
2. `prepareCountdown()` chains Promises: validate → short warm-up delay → ready.
3. A `while` loop ticks every second using `await delay(1000)`.
4. **Pause** sets a flag; the loop waits at `await waitWhilePaused()`.
5. **Reset** bumps a generation counter so any in-flight async work stops cleanly.
6. When the timer hits zero, `fetch()` loads a quote and displays it.


## JavaScript concepts (theory)

Short explanations of what each topic means and why it matters. See `app.js` for how they appear in practice.

### Asynchronous JavaScript

**Synchronous** code runs one line at a time, in order — each step must finish before the next begins. **Asynchronous** code starts a task (timer, network request, file read) and continues without waiting; the result is handled later via a callback or Promise. JavaScript is single-threaded, so async keeps the page responsive while slow work runs in the background.

### The event loop

The **call stack** runs synchronous code. When async work is scheduled, it waits in queues. The **event loop** watches the stack: when it is empty, it picks the next task — usually **microtasks** (Promise callbacks) before **macrotasks** (`setTimeout`, `fetch`). That ordering explains why some code runs “out of order” relative to how you wrote it.

### Callbacks

A **callback** is a function passed to another function to run when async work completes — for example the function inside `setTimeout`. Many older APIs use an error-first style: `callback(error, result)`. Deeply nested callbacks (“callback hell”) are hard to read and error-prone; Promises and `async`/`await` replace that pattern.

### Promises and their states

A **Promise** represents a value that may arrive later. It starts **pending**, then becomes **fulfilled** (success, with a result) or **rejected** (failure, with an error). Once settled, it does not change state again. `new Promise((resolve, reject) => { ... })` creates one; `resolve` and `reject` move it to fulfilled or rejected.

### `.then()` and `.catch()`

**`.then()`** runs when a Promise fulfills and can return a new value or Promise for the next step. **`.catch()`** runs when a Promise rejects or a previous `.then()` throws. Chaining `.then()` calls sequences async steps in order without nesting callbacks — as in `prepareCountdown()` in this app.

### `async` / `await`

**`async`** marks a function that always returns a Promise. **`await`** pauses that function until a Promise settles, then gives you the result. Code reads top-to-bottom like synchronous logic, but other work (UI, clicks) can still run because only the current `async` function is paused.

### Error handling in asynchronous code

Rejected Promises and errors inside `async` functions must be handled explicitly. Use **`.catch()`** on a Promise chain, or **`try` / `catch`** around `await` in an `async` function. Unhandled rejections fail silently in the console; the UI should show a clear message for expected failures (bad input, network errors).