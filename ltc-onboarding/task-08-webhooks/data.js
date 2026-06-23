let orders=[
    {
    id: "ord_001",
    customer: "Arta Krasniqi",
    email: "arta@example.com",
    items: [{ name: "Hoodie", qty: 1, price:29.99}],
    total: 29.99,
    status:"pending",
    createdAt: "2026-06-23T10:00:00Z",
    }
];

let events=[];
const listeners=[];
let nextOrderNum = 2;

export function createOrderId() {
  return `ord_${String(nextOrderNum++).padStart(3, "0")}`;
}

export function getAllOrders() {
  return [...orders];
}

export function getOrderById(id){
    return orders.find((o)=>o.id===id) ?? null;
}

export function addOrder(order) {
  orders.unshift(order);
  return order;
}

export function updateOrderStatus(id, status) {
  const order = getOrderById(id);
  if (!order) {
    return null;
  }
  order.status = status;
  order.updatedAt = new Date().toISOString();
  return order;
}

export function addEvent(event) {
  events.unshift(event);
  listeners.forEach((fn) => fn(event));
  return event;
}

export function onEvent(listener) {
  listeners.push(listener);
}

export function removeEventListener(listener) {
  const index = listeners.indexOf(listener);
  if (index !== -1) {
    listeners.splice(index, 1);
  }
}

export function getAllEvents() {
  return [...events];
}