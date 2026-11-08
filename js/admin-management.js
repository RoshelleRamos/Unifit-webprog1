(function () {
    "use strict";
    const auth = window.unifitAdminAuth;
    const session = auth && auth.getSession();
    if (!session || session.role !== "main_admin") { window.location.replace("dashboard.html"); return; }
    const table = document.getElementById("adminAccountsTable");
    const form = document.getElementById("subAdminForm");
    const message = document.getElementById("adminFormMessage");
    function save(admins) { localStorage.setItem(auth.adminsKey, JSON.stringify(admins)); }
    function render() {
        table.innerHTML = "";
        auth.readAdmins().forEach(function (admin) {
            const row = document.createElement("tr");
            [admin.name, admin.email, admin.role === "main_admin" ? "Main Admin" : "Sub-Admin", admin.active === false ? "Inactive" : "Active"].forEach(function (value, index) {
                const cell = document.createElement("td"); cell.textContent = value; if (index === 2) cell.className = "admin-role-badge"; row.appendChild(cell);
            });
            const action = document.createElement("td");
            if (admin.role === "main_admin") action.textContent = "Protected";
            else {
                const button = document.createElement("button"); button.type = "button"; button.className = "btn"; button.textContent = admin.active === false ? "Activate" : "Deactivate";
                button.addEventListener("click", function () {
                    const admins = auth.readAdmins(); const target = admins.find(function (item) { return item.id === admin.id; }); target.active = target.active === false; save(admins); render();
                }); action.appendChild(button);
            }
            row.appendChild(action); table.appendChild(row);
        });
    }
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("subAdminName").value.trim();
        const email = document.getElementById("subAdminEmail").value.trim().toLowerCase();
        const password = document.getElementById("subAdminPassword").value;
        const confirmation = document.getElementById("subAdminConfirm").value;
        const admins = auth.readAdmins(); message.className = "admin-form-message error";
        if (password.length < 8) { message.textContent = "Password must contain at least 8 characters."; return; }
        if (password !== confirmation) { message.textContent = "Passwords do not match."; return; }
        if (admins.some(function (admin) { return admin.email.toLowerCase() === email; })) { message.textContent = "That admin email already exists."; return; }
        admins.push({ id: "sub-admin-" + Date.now(), name: name, email: email, password: password, role: "sub_admin", active: true, createdBy: session.id, createdAt: new Date().toISOString() });
        save(admins); form.reset(); message.className = "admin-form-message success"; message.textContent = "Sub-admin account created successfully."; render();
    });
    render();
})();
