# Task 07 - Advanced JavaScript Mini Wallet

A small wallet app: deposit, withdraw, and see your balance. Each file focuses on one advanced JavaScript idea.

## Project structure

```
task-07-javascript-advanced/
├── index.html
├── style.css
├── main.js
├── modules/
│   ├── wallet.js
│   ├── account.js
│   ├── pricing.js
│   └── utils.js
└── README.md
```

## How to run

ES modules need a local server (not `file://`).

1. Open the folder in your editor.
2. Start **Live Server** on `index.html`, or run `npx serve .` in this folder.
3. Try depositing and withdrawing. Switch between **Standard** and **Savings** to see different fees.

## What the app does

- Starts with **$100**
- Deposit and withdraw with validation
- Two account types with different fee rates
- Transaction history and totals

## How it works

1. `main.js` creates a wallet with `createWallet(100, account)`.
2. **Deposit** calls `wallet.deposit()` - fee is calculated, balance updates, history saves.
3. **Withdraw** calls `wallet.withdraw()` - throws an error if funds are too low.
4. `render()` updates the page after every action.

## Where to look in the code

| Topic | File |
|-------|------|
| Closures | `modules/wallet.js` |
| Prototypes & inheritance | `modules/account.js` |
| `this` keyword | `modules/account.js`, `main.js` (`getAccountLabel`) |
| Higher-order functions | `modules/pricing.js`, `main.js` (`.map`, `.reduce`) |
| Hoisting | `modules/utils.js` |
| ES modules, spread, destructuring | all `.js` files |

---

## JavaScript concepts (theory)

One-line summaries. See the table above for where each topic appears in code.

### Scope

Where a variable can be used: global, function, block (`let`/`const`), or module (each file). `balance` in `wallet.js` is function-scoped and hidden from outside.

### Hoisting

Function declarations are loaded before the code runs, so `formatClockTime` can be called above its line. `let` and `const` cannot be used before declaration.

### Closures

An inner function remembers variables from its outer function. `createWallet` keeps `balance` private - only `deposit` and `getBalance` can access it.

### The `this` keyword

`this` depends on how you call the function: `account.describe()` sets `this` to `account`; a plain `fn()` sets `this` to `undefined` in strict mode; `fn.call(account)` sets it explicitly.

### Prototypes and inheritance

Objects share methods through a prototype chain. `SavingsAccount` inherits from `Account` and overrides fee rates.

### Higher-order functions & functional basics

A function that takes or returns another function. Examples: `applyFee(rate)(amount)`, `.map`, `.reduce`. Pure functions like `formatMoney` always return the same output for the same input.

### ES6+

`import`/`export`, destructuring (`{ deposits }`), spread (`[...transactions]`), and `'use strict'` in every file.

### Call stack & memory

Each function call adds a frame to the **call stack** (trace it in DevTools when you click Deposit). Closure data stays in memory while the wallet methods still reference it.
