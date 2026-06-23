const STATUS_CLASS = {
    pending: "status--pending",
    paid: "status--paid",
    shipped: "status--shipped",
    cancelled: "status--cancelled",
  };
  
  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  }
  
  function updateStats(orders, events) {
    const pending = orders.filter((o) => o.status === "pending").length;
  
    document.getElementById("stat-orders").textContent = orders.length;
    document.getElementById("stat-pending").textContent = pending;
    document.getElementById("stat-events").textContent = events.length;
    document.getElementById("orders-badge").textContent =
      `${orders.length} total`;
    document.getElementById("events-badge").textContent =
      `${events.length} received`;
  }
  
  function renderOrders(orders) {
    const el = document.getElementById("orders-list");
  
    if (!orders.length) {
      el.innerHTML =
        "<p class='empty-state'>No orders yet. Run <code>npm run simulate -- order.created</code>.</p>";
      return;
    }
  
    el.innerHTML = orders
      .map(
        (o) => `
      <article class="order-item">
        <div class="order-header">
          <span class="order-id">${o.id}</span>
          <span class="status ${STATUS_CLASS[o.status] ?? ""}">${o.status}</span>
        </div>
        <p class="order-customer">${o.customer}</p>
        <p class="order-total">€${Number(o.total).toFixed(2)}</p>
        <p class="order-items">${o.items?.map((i) => i.name).join(", ") ?? ""}</p>
      </article>
    `,
      )
      .join("");
  }
  
  function renderEvents(events) {
    const el = document.getElementById("events-list");
  
    if (!events.length) {
      el.innerHTML =
        "<p class='empty-state'>No webhook events yet. Simulate one from the terminal.</p>";
      return;
    }
  
    el.innerHTML = events
      .map(
        (e) => `
      <article class="event-item">
        <div class="event-header">
          <span class="event-type">${e.type}</span>
          <span class="event-time">${new Date(e.receivedAt).toLocaleTimeString()}</span>
        </div>
        <pre class="event-payload">${JSON.stringify(e.data, null, 2)}</pre>
      </article>
    `,
      )
      .join("");
  }
  
  function setLiveStatus(connected) {
    const badge = document.getElementById("live-badge");
    badge.className = connected
      ? "live-badge live-badge--on"
      : "live-badge live-badge--off";
    badge.innerHTML = connected
      ? '<span class="live-dot" aria-hidden="true"></span> Connected'
      : '<span class="live-dot" aria-hidden="true"></span> Reconnecting…';
  }
  
  async function refresh() {
    try {
      const [orders, events] = await Promise.all([
        fetchJSON("/api/orders"),
        fetchJSON("/api/events"),
      ]);
      updateStats(orders, events);
      renderOrders(orders);
      renderEvents(events);
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  }
  
  refresh();
  
  const source = new EventSource("/api/events/stream");
  source.onmessage = () => {
    refresh();
  };
  
  source.onerror = () => {
    setLiveStatus(false);
  };
  
  source.onopen = () => {
    setLiveStatus(true);
  };
  