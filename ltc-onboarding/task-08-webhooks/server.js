import express from "express";
import {
  getAllOrders,
  getOrderById,
  getAllEvents,
  addOrder,
  addEvent,
  updateOrderStatus,
  createOrderId,
  onEvent,
  removeEventListener,
} from "./data.js";
import { verifySignature } from "./webhook-utils.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));


app.get("/api/orders", (_req, res)=>{
    res.json(getAllOrders());

});
app.get("/api/events", (_req, res) => {
  res.json(getAllEvents());
});

app.get("/api/events/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  onEvent(send);

  req.on("close", () => {
    removeEventListener(send);
  });
});

app.get("/api/orders/:id", (req, res) => {
    const order = getOrderById(req.params.id);
    if(!order){
        return res.status(404).json({error:"Order not found"});
    }
    return res.json(order);
    })

app.post("/webhooks/orders", (req, res)=>{
    const signature = req.headers["x-webhook-signature"];

    if(!verifySignature(req.body, signature)){
        return res.status(401).json({error:"Invalild signature"});
    }

    const event = req.body;
    const result = handleWebhookEvent(event);

    addEvent({ type: event.type, data: event.data, receivedAt: new Date().toISOString()});

    res.status(200).json({ received: true, result});
});

function handleWebhookEvent(event){
    switch(event.type){
        case "order.created":
        return { action: "created", order: addOrder({id: event.data.orderId ?? createOrderId(), customer: event.data.customer, email: event.data.email, items: event.data.items, total: event.data.total, status: "pending", createdAt: new Date().toISOString()})};
        case "payment.succeeded":
            return { action: "paid", order: updateOrderStatus(event.data.orderId, "paid")};
        case "order.shipped":
            return { action: "shipped", order: updateOrderStatus(event.data.orderId, "shipped")};
        case "order.cancelled":
            return { action: "cancelled", order:updateOrderStatus(event.data.orderId, "cancelled")};
        default:
            return { error: `Unknown event type: ${event.type}`};
            }
}
app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})