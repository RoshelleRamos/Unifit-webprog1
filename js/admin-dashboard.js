(function () {
    "use strict";
    const table = document.getElementById("adminOrdersTable");
    if (!table) return;

    let orders = [];
    try {
        const saved = JSON.parse(localStorage.getItem("unifitOrders") || "[]");
        orders = Array.isArray(saved) ? saved : [];
    } catch (error) { orders = []; }

    const pending = orders.filter(function (order) { return !order.status || order.status === "Pending" || order.status === "Payment Verification"; });
    const verification = orders.filter(function (order) { return order.paymentStatus === "For Verification" || order.status === "Payment Verification"; });
    const sales = orders.filter(function (order) { return order.status === "Completed"; }).reduce(function (sum, order) { return sum + (Number(order.total) || 0); }, 0);

    document.getElementById("adminTotalOrders").textContent = orders.length;
    document.getElementById("adminPendingOrders").textContent = pending.length;
    document.getElementById("adminPaymentOrders").textContent = verification.length;
    document.getElementById("adminTotalSales").textContent = "₱" + sales.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    table.innerHTML = "";
    if (!orders.length) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5; cell.className = "admin-empty"; cell.textContent = "No orders available yet.";
        row.appendChild(cell); table.appendChild(row); return;
    }

    orders.slice(0, 5).forEach(function (order) {
        const row = document.createElement("tr");
        const values = [
            order.orderNumber || "—",
            order.customer && order.customer.fullName ? order.customer.fullName : "Unknown Customer",
            "₱" + (Number(order.total) || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            order.paymentStatus || order.payment || "—",
            order.status || "Pending"
        ];
        values.forEach(function (value) { const cell = document.createElement("td"); cell.textContent = value; row.appendChild(cell); });
        table.appendChild(row);
    });
})();
