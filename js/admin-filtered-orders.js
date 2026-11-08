(function () {
    "use strict";
    const page = document.querySelector("[data-order-filter]");
    const table = document.getElementById("filteredOrdersTable");
    const count = document.getElementById("filteredOrdersCount");
    if (!page || !table) return;

    const type = page.dataset.orderFilter;
    let orders = [];
    try { const saved = JSON.parse(localStorage.getItem("unifitOrders") || "[]"); orders = Array.isArray(saved) ? saved : []; } catch (error) { orders = []; }

    function matches(item) {
        const category = String(item.category || "").toLowerCase();
        if (type === "uniform-sets") return category === "uniform set";
        if (type === "sportsfest") return category === "sportsfest uniform";
        return category !== "uniform set" && category !== "sportsfest uniform";
    }
    function peso(value) { return "₱" + (Number(value) || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    function cell(text) { const td = document.createElement("td"); td.textContent = text; return td; }

    const filtered = orders.map(function (order) {
        return { order: order, items: (Array.isArray(order.items) ? order.items : []).filter(matches) };
    }).filter(function (entry) { return entry.items.length > 0; });

    count.textContent = filtered.length + (filtered.length === 1 ? " order" : " orders");
    table.textContent = "";
    if (!filtered.length) {
        const row = document.createElement("tr"); const empty = cell("No matching student orders yet."); empty.colSpan = 7; empty.className = "admin-empty"; row.appendChild(empty); table.appendChild(row); return;
    }

    filtered.forEach(function (entry) {
        const order = entry.order;
        const row = document.createElement("tr");
        row.appendChild(cell(order.orderNumber || "—"));
        row.appendChild(cell(order.customer && order.customer.fullName ? order.customer.fullName : "Unknown Student"));
        const itemCell = document.createElement("td");
        entry.items.forEach(function (item) {
            const line = document.createElement("div"); line.className = "admin-filtered-item";
            const quantity = Number(item.quantity) || 1;
            line.textContent = (item.name || "Product") + " — Size: " + (item.size || "N/A") + " — Qty: " + quantity + " — " + peso((Number(item.price) || 0) * quantity);
            itemCell.appendChild(line);
        });
        row.appendChild(itemCell);
        row.appendChild(cell(order.orderDate ? new Date(order.orderDate).toLocaleDateString("en-PH") : "—"));
        row.appendChild(cell(peso(entry.items.reduce(function (sum, item) { return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1); }, 0))));
        row.appendChild(cell((order.payment || "GCash") + " — " + (order.paymentStatus || "For Verification")));
        row.appendChild(cell(order.status || "Pending"));
        table.appendChild(row);
    });
})();
