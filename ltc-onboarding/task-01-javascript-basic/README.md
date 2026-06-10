# Task 01 — JavaScript Fundamentals

A small **expense tracker** built with plain HTML, CSS, and JavaScript. It demonstrates core language concepts and basic DOM interaction.

## Project structure

```
task-01-javascript/
├── index.html   # Page structure and form
├── style.css    # Layout and styling
├── app.js       # Application logic
└── README.md
```

## How to run

No install or build step required.

1. Open `index.html` in a browser (double-click the file, or use Live Server in your editor).
2. Add expenses, filter by category, and delete items.

## Features

- Add expenses with description, amount, and category
- Filter list: All, Food, Transport, Other
- Summary: total spent, count, highest expense
- Delete individual expenses or clear all
- Budget warning when total exceeds $100


## JavaScript concepts (theory)

Short explanations of what each topic means and why it matters. See `app.js` for how they appear in practice.

### Variables (`let`, `const`, `var`)

A **variable** is a named container for a value. **`const`** declares something that should not be reassigned — ideal for DOM element references and function definitions. **`let`** declares values that change over time, such as a list of expenses or the active filter. **`var`** is the older syntax; it is function-scoped rather than block-scoped, which can cause confusing bugs. Modern code prefers `let` and `const`.

### Data types

Every value in JavaScript has a **type**. Common types include **strings** (text), **numbers**, and **booleans** (true/false). **Objects** group related data under named keys; **arrays** are ordered lists of values (arrays are a special kind of object). **`null`** means “no value on purpose”; **`undefined`** means a variable exists but has not been given a value yet. Knowing types matters because operations behave differently on strings vs numbers, and validation checks often depend on type.

### Operators

**Operators** perform actions on values. **Arithmetic operators** (+, −, ×, ÷) do math. **Comparison operators** (===, !==, >, <) test relationships and return true or false — use strict equality (`===`) to compare both value and type. **Logical operators** (&&, ||, !) combine conditions: “and” requires all parts to be true, “or” needs at least one, “not” flips a boolean. These are the building blocks of validation and business rules (e.g. “is the amount positive **and** is the description long enough?”).

### Arrays and objects

An **object** models one thing with properties (e.g. one expense with description, amount, category). An **array** holds many items in order. Together they are the main way JavaScript stores structured data in memory. You read properties with dot notation or brackets; you can add, remove, or update entries as the app runs. In this project, each expense is an object and all expenses live in one array.

### Functions

A **function** is a reusable block of code with a name, optional inputs (parameters), and optionally a return value. Functions keep logic organized: validation, calculations, and rendering are separate instead of one giant script. A function can be **called** from many places. Functions can also be **passed** to other code (callbacks), which is how event handlers and array methods work.

### Conditionals (`if` / `else`, `switch`)

**Conditionals** choose which code runs based on a condition. **`if`** runs code when a test is true; **`else`** and **`else if`** handle other cases. Use this for validation, error messages, and showing/hiding UI. **`switch`** compares one value against several fixed options (e.g. mapping a category to a CSS class). Prefer `if/else` for open-ended logic; use `switch` when matching one variable against a small set of known values.

### Loops (`for`, `while`)

A **loop** repeats code instead of writing it many times. A **`for`** loop (or `for...of` over an array) walks through each item in a list — useful when rendering every expense. A **`while`** loop keeps going until a condition becomes false — useful when scanning for the highest amount. Loops and array methods often solve the same problem; choose the style that reads clearest.

### DOM manipulation basics

The **DOM** (Document Object Model) is the browser’s live representation of your HTML as a tree of elements. JavaScript can **select** elements (by id or class), **read** their content, **change** text, classes, or visibility, and **create** new elements and attach them to the page. The page does not update itself when your in-memory data changes — you must explicitly update the DOM after changing data (the “render” step in this app).

### Events and event listeners

An **event** is a user or browser action: click, form submit, key press, etc. An **event listener** registers a function to run when that event happens on a specific element. The browser passes an **event object** with details (e.g. which key was pressed). **`preventDefault()`** stops the browser’s default behavior — important on forms so the page does not reload on submit. The app is **event-driven**: user actions trigger listeners, which update data and re-render.

### Basic array methods

Arrays include built-in methods that take a small function and apply it to each item. **`filter`** returns a new array with only matching items (e.g. expenses in one category). **`reduce`** folds a list into a single value (e.g. total spent). **`forEach`** runs a side effect for each item without building a new array. The **spread** syntax copies an array into a new one, which helps add or replace items without mutating the original. These methods replace manual loops for common patterns and keep code shorter and clearer.

### Scope and basic ES6 concepts

**Scope** defines where a variable can be used. Variables declared with `let` or `const` inside `{ }` blocks are **block-scoped**; `var` is visible across the whole function. A function defined inside another function can still “see” outer variables — that is a **closure**. **ES6** (ECMAScript 2015) added syntax that is now standard: **arrow functions** for concise callbacks, **template literals** for strings with embedded values, **default parameters**, **destructuring** to pull fields out of objects, and **spread** for copying arrays and objects. These features reduce boilerplate and make intent clearer.
