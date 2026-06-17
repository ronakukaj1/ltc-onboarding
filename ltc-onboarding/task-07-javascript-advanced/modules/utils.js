"use strict";

export function summarizeTransactions(transactions) {
  return transactions.reduce(
    (totals, { type, amount }) => {
      if (type === "deposit") {
        totals.deposits += amount;
      } else {
        totals.withdrawals += amount;
      }
      return totals;
    },
    { deposits: 0, withdrawals: 0 }
  );
}

export function formatTransactionTime(date) {
  return formatClockTime(date);
}

function formatClockTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
