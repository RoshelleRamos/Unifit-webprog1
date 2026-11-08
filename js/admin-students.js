(function () {
    "use strict";
    const table = document.getElementById("adminStudentsTable");
    if (!table) return;
    function read(key) { try { const data = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(data) ? data : []; } catch (error) { return []; } }
    function peso(value) { return "₱" + (Number(value) || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    function render() {
        const students = read("unifitStudents");
        const orders = read("unifitOrders");
        table.textContent = "";
        if (!students.length) {
            const row = document.createElement("tr"); const cell = document.createElement("td"); cell.colSpan = 7; cell.className = "admin-empty"; cell.textContent = "No registered students yet."; row.appendChild(cell); table.appendChild(row); return;
        }
        students.forEach(function (student) {
            const studentOrders = orders.filter(function (order) { const orderEmail = order.customer && order.customer.email ? order.customer.email.toLowerCase() : ""; return (student.id && order.studentId === student.id) || orderEmail === student.email.toLowerCase(); });
            const total = studentOrders.filter(function (order) { return order.status !== "Cancelled" && order.status !== "Payment Rejected"; }).reduce(function (sum, order) { return sum + (Number(order.total) || 0); }, 0);
            const row = document.createElement("tr");
            [((student.firstName || "") + " " + (student.lastName || "")).trim() || "Student", student.email, student.contactNumber || "—", studentOrders.length, peso(total), student.active === false ? "Inactive" : "Active"].forEach(function (value) { const cell = document.createElement("td"); cell.textContent = value; row.appendChild(cell); });
            const action = document.createElement("td"); const button = document.createElement("button"); button.type = "button"; button.className = "btn"; button.textContent = student.active === false ? "Activate" : "Deactivate";
            button.addEventListener("click", function () { const saved = read("unifitStudents"); const target = saved.find(function (item) { return item.id === student.id || item.email === student.email; }); if (target) { target.active = target.active === false; localStorage.setItem("unifitStudents", JSON.stringify(saved)); render(); } });
            action.appendChild(button); row.appendChild(action); table.appendChild(row);
        });
    }
    render();
})();
