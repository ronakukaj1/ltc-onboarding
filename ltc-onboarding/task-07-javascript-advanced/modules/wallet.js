"use strict";

import { applyFee } from "./pricing.js";

export function createWallet(initialBalance, account) {
  let balance = initialBalance;
  const transactions = [];

  function record(type, amount, fee) {
    const entry = {
      type,
      amount,
      fee,
      balanceAfter: balance,
      at: new Date(),
    };
    transactions.push(entry);
    return entry;
  }

  return {
    deposit(amount) {
      const fee = applyFee(account.getFeeRate())(amount);
      const credited = amount - fee;
      balance += credited;
      return record("deposit", amount, fee);
    },

    withdraw(amount) {
      const fee = applyFee(account.getWithdrawFeeRate())(amount);
      const total = amount + fee;

      if (total > balance) {
        throw new Error("Insufficient funds");
      }

      balance -= total;
      return record("withdraw", amount, fee);
    },

    getBalance() {
      return balance;
    },

    getTransactions() {
      return [...transactions];
    },

    getAccount() {
      return account;
    },

    setAccount(nextAccount) {
      account = nextAccount;
    },
  };
}
