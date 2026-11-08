(function () {
    "use strict";
    const STUDENTS_KEY = "unifitStudents";

    function readStudents() {
        try {
            const students = JSON.parse(localStorage.getItem(STUDENTS_KEY));
            if (Array.isArray(students)) return students;
            const oldStudent = JSON.parse(localStorage.getItem("unifitUser"));
            if (oldStudent && oldStudent.email) {
                localStorage.setItem(STUDENTS_KEY, JSON.stringify([oldStudent]));
                return [oldStudent];
            }
        } catch (error) { console.warn("Student data could not be read.", error); }
        return [];
    }

    function showMessage(message, isError) {
        let element = document.getElementById("authMessage");
        if (!element) {
            element = document.createElement("p");
            element.id = "authMessage";
            element.setAttribute("aria-live", "polite");
            document.querySelector(".auth-form").appendChild(element);
        }
        element.textContent = message;
        element.className = "auth-message " + (isError ? "error" : "success");
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const contactNumber = document.getElementById("contactNumber").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;
        const confirmation = document.getElementById("confirmPassword").value;
        if (!/^09\d{9}$/.test(contactNumber)) return showMessage("Enter a valid 11-digit Philippine mobile number.", true);
        if (password.length < 6) return showMessage("Password must contain at least 6 characters.", true);
        if (password !== confirmation) return showMessage("Passwords do not match.", true);
        const students = readStudents();
        if (students.some(function (student) { return student.email.toLowerCase() === email; })) return showMessage("This email is already registered.", true);
        students.push({ id: "student-" + Date.now(), firstName: firstName, lastName: lastName, contactNumber: contactNumber, email: email, password: password, role: "student", createdAt: new Date().toISOString() });
        localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
        showMessage("Student account created. Redirecting to login...", false);
        setTimeout(function () { window.location.href = "login.html"; }, 700);
    });

    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;
        const student = readStudents().find(function (account) { return account.active !== false && account.email.toLowerCase() === email && account.password === password; });
        if (!student) return showMessage("Incorrect student email or password.", true);
        localStorage.setItem("unifitLoggedIn", "true");
        localStorage.setItem("unifitCurrentUser", JSON.stringify({ id: student.id, firstName: student.firstName, lastName: student.lastName, contactNumber: student.contactNumber, email: student.email, role: "student" }));
        showMessage("Welcome back, " + student.firstName + "!", false);
        setTimeout(function () { window.location.href = "profile.html"; }, 500);
    });
})();
