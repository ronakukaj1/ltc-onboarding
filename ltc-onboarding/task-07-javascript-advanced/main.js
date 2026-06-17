"use strict";

import { createWallet } from "./modules/wallet.js";
import { createAccount } from "./modules/account.js";
import { formatMoney } from "./modules/pricing.js";
import { summarizeTransactions, formatTransactionTime } from "./modules/utils.js";

const balanceEl = document.getElementById("balance");
const accountLabelEl = document.getElementById("account-label");
const holderInput = document.getElementById("holder-name");
const accountTypeSelect = document.getElementById("account-type");
const amountInput = document.getElementById("amount");
const depositBtn = document.getElementById("deposit-btn");
const withdrawBtn = document.getElementById("withdraw-btn");
const transactionList = document.getElementById("transaction-list");
const summaryDeposits = document.getElementById("summary-deposits");
const summaryWithdrawals = document.getElementById("summary-withdrawals");
const errorEl = document.getElementById("error");

let wallet = createWallet(100, createAccount("standard", holderInput.value));

function clearError() {
  errorEl.hidden = true;
  errorEl.textContent = "";
}

function showError(message) {
  errorEl.hidden = false;
  errorEl.textContent = message;
}

function readAmount() {
  const amount = Number(amountInput.value);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter a positive amount");
  }

  return amount;
}

function getAccountLabel(account) {
  const describe = account.describe;
  return describe.call(account);
}

function renderBalance() {
  balanceEl.textContent = formatMoney(wallet.getBalance());
}

function renderAccountLabel() {
  const account = wallet.getAccount();
  accountLabelEl.textContent = getAccountLabel(account);
}

function renderTransactions() {
  const transactions = wallet.getTransactions();

  if (transactions.length === 0) {
    transactionList.innerHTML = '<li class="empty">No transactions yet</li>';
    return;
  }

  transactionList.innerHTML = transactions
    .map(({ type, amount, fee, balanceAfter, at }) => {
      const sign = type === "deposit" ? "+" : "−";
      const feeNote = fee > 0 ? ` (fee ${formatMoney(fee)})` : "";

      return `<li class="tx tx--${type}">
        <span class="tx__type">${type}</span>
        <span class="tx__amount">${sign}${formatMoney(amount)}${feeNote}</span>
        <span class="tx__meta">${formatTransactionTime(at)} · bal ${formatMoney(balanceAfter)}</span>
      </li>`;
    })
    .join("");
}

function renderSummary() {
  const { deposits, withdrawals } = summarizeTransactions(wallet.getTransactions());
  summaryDeposits.textContent = formatMoney(deposits);
  summaryWithdrawals.textContent = formatMoney(withdrawals);
}

function render() {
  renderBalance();
  renderAccountLabel();
  renderTransactions();
  renderSummary();
}

function handleDeposit() {
  clearError();

  try {
    const amount = readAmount();
    wallet.deposit(amount);
    amountInput.value = "";
    render();
  } catch (error) {
    showError(error.message);
  }
}

function handleWithdraw() {
  clearError();

  try {
    const amount = readAmount();
    wallet.withdraw(amount);
    amountInput.value = "";
    render();
  } catch (error) {
    showError(error.message);
  }
}

function handleAccountChange() {
  clearError();

  const { value: holderName } = holderInput;
  const account = createAccount(accountTypeSelect.value, holderName);
  wallet.setAccount(account);
  render();
}

depositBtn.addEventListener("click", handleDeposit);
withdrawBtn.addEventListener("click", handleWithdraw);
accountTypeSelect.addEventListener("change", handleAccountChange);
holderInput.addEventListener("change", handleAccountChange);

render();
