"use strict";

export function curry(fn) {
  return function curriedA(a) {
    return function curriedB(b) {
      return function curriedC(c) {
        return fn(a, b, c);
      };
    };
  };
}

export function applyFee(rate) {
  return function chargeOn(amount) {
    return amount * rate;
  };
}

export function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}
