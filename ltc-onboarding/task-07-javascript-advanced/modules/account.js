"use strict";

export function Account(holderName) {
  this.holderName = holderName;
}

Account.prototype.describe = function describe() {
  return `${this.holderName}'s standard account`;
};

Account.prototype.getFeeRate = function getFeeRate() {
  return 0.01;
};

Account.prototype.getWithdrawFeeRate = function getWithdrawFeeRate() {
  return 0.02;
};

export function SavingsAccount(holderName) {
  Account.call(this, holderName);
}

SavingsAccount.prototype = Object.create(Account.prototype);
SavingsAccount.prototype.constructor = SavingsAccount;

SavingsAccount.prototype.describe = function describe() {
  return `${this.holderName}'s savings account`;
};

SavingsAccount.prototype.getFeeRate = function getFeeRate() {
  return 0.005;
};

SavingsAccount.prototype.getWithdrawFeeRate = function getWithdrawFeeRate() {
  return 0.01;
};

export function createAccount(type, holderName) {
  if (type === "savings") {
    return new SavingsAccount(holderName);
  }
  return new Account(holderName);
}
