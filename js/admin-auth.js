(function () {
    "use strict";
    const ADMINS_KEY = "unifitAdminAccounts";
    const SESSION_KEY = "unifitAdminSession";
    const MAIN_ADMIN = { id: "main-admin", name: "Main Administrator", email: "admin@unifit.com", password: "Admin123", role: "main_admin", active: true };

    function readAdmins() {
        let admins = [];
        try { admins = JSON.parse(localStorage.getItem(ADMINS_KEY)) || []; } catch (error) { admins = []; }
        if (!Array.isArray(admins)) admins = [];
        if (!admins.some(function (admin) { return admin.role === "main_admin"; })) admins.unshift(MAIN_ADMIN);
        localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
        return admins;
    }
    function getSession() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch (error) { return null; } }
    function clearSession() {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem("unifitAdminLoggedIn");
        localStorage.removeItem("unifitAdminName");
        localStorage.removeItem("unifitAdminRole");
    }
    window.unifitAdminAuth = { readAdmins: readAdmins, getSession: getSession, clearSession: clearSession, adminsKey: ADMINS_KEY };
    readAdmins();

    const loginForm = document.getElementById("adminLoginForm");
    if (loginForm) {
        const passwordInput = document.getElementById("adminPassword");
        document.getElementById("toggleAdminPassword").addEventListener("click", function () { passwordInput.type = passwordInput.type === "password" ? "text" : "password"; this.textContent = passwordInput.type === "password" ? "Show" : "Hide"; });
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const email = document.getElementById("adminEmail").value.trim().toLowerCase();
            const password = passwordInput.value;
            const admin = readAdmins().find(function (account) { return account.active !== false && account.email.toLowerCase() === email && account.password === password; });
            const message = document.getElementById("adminLoginMessage");
            if (!admin) { message.textContent = "Invalid or inactive admin account."; message.style.color = "#b3261e"; return; }
            const session = { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
            localStorage.setItem("unifitAdminLoggedIn", "true");
            localStorage.setItem("unifitAdminName", admin.name);
            localStorage.setItem("unifitAdminRole", admin.role);
            window.location.href = "dashboard.html";
        });
        return;
    }

    if (!document.body.classList.contains("admin-body")) return;
    const session = getSession();
    const activeAccount = session && readAdmins().find(function (admin) { return admin.id === session.id && admin.active !== false; });
    if (!activeAccount) { clearSession(); window.location.replace("admin_login.html"); return; }
    document.querySelectorAll(".admin-name").forEach(function (element) { element.textContent = session.name; });
    document.querySelectorAll("[data-main-admin-only]").forEach(function (element) { element.hidden = session.role !== "main_admin"; });
    document.querySelectorAll(".admin-logout-button, #adminLogoutButton").forEach(function (button) { button.onclick = function () { clearSession(); window.location.href = "admin_login.html"; }; });
})();
