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

## Concepts demonstrated

| Topic | Where in `app.js` |
|-------|-------------------|
| **Variables (`let`, `const`, `var`)** | DOM refs use `const`; mutable state uses `let`; `demonstrateVarScope()` shows `var` function scope |
| **Data types** | Strings, numbers, booleans in `formatCurrency`; objects in expense items; `null` for empty highest |
| **Operators** | Arithmetic (`+`), comparison (`===`, `>`), logical (`&&`, `||`) in validation and `isOverBudget` |
| **Arrays & objects** | `expenses` array of `{ id, description, amount, category }` objects |
| **Functions** | Named functions and arrow functions: `addExpense`, `render`, `getTotal`, etc. |
| **Conditionals** | `if/else` in validation; `switch` in `getCategoryTagClass` |
| **Loops** | `for...of` in `renderExpenseList`; `while` in `getHighestExpense`; `forEach` on filter buttons |
| **DOM manipulation** | `createElement`, `textContent`, `classList`, `appendChild`, `hidden`, `innerHTML` |
| **Events** | `submit` on form, `click` on filters/delete/clear |
| **Array methods** | `filter`, `map` (via render), `reduce`, `forEach`, spread (`[...expenses]`) |
| **Scope & ES6** | Block scope with `let`/`const`, arrow functions, template literals, destructuring, default params, spread |

## Quick demo script

When presenting, walk through:

1. **Add an expense** — form submit, validation, array update, DOM re-render.
2. **Filter by category** — `filter()` and conditional rendering.
3. **Show summary** — `reduce()` for total, `while` loop for highest.
4. **Delete** — `filter()` to remove by id, event listener on dynamically created button.
5. **Over budget** — total turns red when over $100 (`>` operator).
