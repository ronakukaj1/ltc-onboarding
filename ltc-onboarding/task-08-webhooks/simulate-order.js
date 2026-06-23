import { createSignature } from "./webhook-utils.js";

const BASE_URL = "http://localhost:3000/webhooks/orders";
const eventType = process.argv[2] ?? "order.created";
const orderId = process.argv[3];

const payloads = {
  "order.created": {
    type: "order.created",
    id: `evt_${Date.now()}`,
    data: {
      customer: "Lira Gashi",
      email: "lira@example.com",
      items: [{ name: "Sneakers", qty: 1, price: 89.99 }],
      total: 89.99,
    },
  },
  "payment.succeeded": {
    type: "payment.succeeded",
    id: `evt_${Date.now()}`,
    data: { orderId: orderId ?? "ord_001" },
  },
  "order.shipped": {
    type: "order.shipped",
    id: `evt_${Date.now()}`,
    data: {
      orderId: orderId ?? "ord_001",
      trackingNumber: "TRK-12345",
    },
  },
  "order.cancelled": {
    type: "order.cancelled",
    id: `evt_${Date.now()}`,
    data: {
      orderId: orderId ?? "ord_001",
      reason: "Customer request",
    },
  },
};

const payload = payloads[eventType];

if (!payload) {
  console.error(`Unknown event: ${eventType}`);
  console.error("Usage: node simulate-order.js <event> [orderId]");
  console.error("Events: order.created | payment.succeeded | order.shipped | order.cancelled");
  process.exit(1);
}

const signature = createSignature(payload);

const res = await fetch(BASE_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Webhook-Signature": signature,
  },
  body: JSON.stringify(payload),
});

const body = await res.json();
console.log(`[${eventType}] ${res.status}`, body);

if (eventType === "order.created" && res.ok && body.result?.order?.id) {
  console.log(`\nNext steps for order ${body.result.order.id}:`);
  console.log(`  npm run simulate -- payment.succeeded ${body.result.order.id}`);
  console.log(`  npm run simulate -- order.shipped ${body.result.order.id}`);
}
