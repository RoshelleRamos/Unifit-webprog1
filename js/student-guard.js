(function () {
    "use strict";
    let student = null;
    try { student = JSON.parse(localStorage.getItem("unifitCurrentUser") || "null"); } catch (error) { student = null; }
    if (!student || student.role !== "student" || !student.email) {
        localStorage.removeItem("unifitLoggedIn");
        localStorage.removeItem("unifitCurrentUser");
        window.location.replace("login.html");
    }
})();
