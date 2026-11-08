(function () {
    "use strict";
    const list = document.querySelector(".orders-list");
    const empty = document.getElementById("ordersEmpty");
    if (!list || !empty) return;

    let student = null;
    let orders = [];
    try {
        student = JSON.parse(localStorage.getItem("unifitCurrentUser") || "null");
        const saved = JSON.parse(localStorage.getItem("unifitOrders") || "[]");
        orders = Array.isArray(saved) ? saved : [];
    } catch (error) { orders = []; }

    const email = student && student.email ? student.email.trim().toLowerCase() : "";
    orders = orders.filter(function (order) {
        const orderEmail = order.customer && order.customer.email ? order.customer.email.trim().toLowerCase() : "";
        return (student.id && order.studentId === student.id) || orderEmail === email;
    });

    function peso(value) { return "₱" + (Number(value) || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    function statusInfo(status) {
        if (status === "Processing") return { filter: "preparing", label: "Preparing", css: "status-preparing" };
        if (status === "Ready for Pickup") return { filter: "ready", label: status, css: "status-ready" };
        if (status === "Completed") return { filter: "completed", label: status, css: "status-completed" };
        if (status === "Cancelled" || status === "Payment Rejected") return { filter: "pending", label: status, css: "status-cancelled" };
        return { filter: "pending", label: status || "Pending", css: "status-pending" };
    }
    function compressReceipt(file) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onerror = function () { reject(new Error("Unable to read receipt.")); };
            reader.onload = function () {
                const image = new Image();
                image.onerror = function () { reject(new Error("Invalid receipt image.")); };
                image.onload = function () {
                    const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
                    const canvas = document.createElement("canvas");
                    canvas.width = Math.max(1, Math.round(image.width * scale));
                    canvas.height = Math.max(1, Math.round(image.height * scale));
                    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL("image/jpeg", 0.72));
                };
                image.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }
    async function saveReuploadedReceipt(order, file, note) {
        if (!/^image\/(png|jpe?g)$/i.test(file.type)) throw new Error("Receipt must be a PNG or JPG image.");
        if (file.size > 8 * 1024 * 1024) throw new Error("Receipt image must be 8 MB or smaller.");
        const data = await compressReceipt(file);
        const allOrders = JSON.parse(localStorage.getItem("unifitOrders") || "[]");
        const target = allOrders.find(function (item) { return item.orderNumber === order.orderNumber; });
        if (!target) throw new Error("Order could not be found.");
        target.paymentReceiptName = file.name;
        target.paymentReceiptData = data;
        target.paymentStatus = "For Verification";
        target.status = "Payment Verification";
        target.resubmissionNote = note;
        target.receiptReuploadedAt = new Date().toISOString();
        target.statusUpdatedBy = (student.firstName || "Student") + " " + (student.lastName || "");
        target.statusUpdatedAt = target.receiptReuploadedAt;
        localStorage.setItem("unifitOrders", JSON.stringify(allOrders));
    }
    function make(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }
    function render(orderList) {
        list.textContent = "";
        orderList.forEach(function (order) {
            const info = statusInfo(order.status);
            const card = make("article", "order-card"); card.dataset.status = info.filter;
            const header = make("div", "order-card-header");
            const numberBox = make("div"); numberBox.append(make("p", "order-label", "Order Number"), make("h3", "", "#" + (order.orderNumber || "—")));
            const dateBox = make("div"); dateBox.append(make("p", "order-label", "Order Date"), make("strong", "", order.orderDate ? new Date(order.orderDate).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) : "—"));
            header.append(numberBox, dateBox, make("span", "order-status " + info.css, info.label));

            const itemsBox = make("div", "order-items");
            (Array.isArray(order.items) ? order.items : []).forEach(function (item) {
                const quantity = Number(item.quantity) || 1;
                const row = make("div", "order-item");
                const imageBox = make("div", "order-item-image");
                const image = document.createElement("img"); image.src = item.image || ""; image.alt = item.name || "Product"; imageBox.appendChild(image);
                const itemInfo = make("div", "order-item-info");
                itemInfo.append(make("h4", "", item.name || "Product"), make("p", "", "Size: " + (item.size || "Not applicable")), make("p", "", "Quantity: " + quantity));
                if (item.fabric) itemInfo.appendChild(make("p", "", "Variant/Fabric: " + item.fabric));
                row.append(imageBox, itemInfo, make("strong", "order-item-price", peso((Number(item.price) || 0) * quantity)));
                itemsBox.appendChild(row);
            });

            const details = make("div", "student-order-details"); details.hidden = true;
            details.append(make("p", "", "Payment: " + (order.payment || "GCash") + " — " + (order.paymentStatus || "For Verification")), make("p", "", "GCash Reference: " + (order.paymentReference || "—")), make("p", "", "Student Notes: " + (order.notes || "No special instructions.")));
            if (order.cancelNote) details.appendChild(make("p", "student-cancel-note", "Cancellation Note: " + order.cancelNote));
            if (order.rejectionNote) details.appendChild(make("p", "student-rejection-note", "Payment Rejection Note: " + order.rejectionNote));
            const footer = make("div", "order-card-footer");
            const totalBox = make("div", "order-total"); totalBox.append(make("span", "", "Order Total"), make("strong", "", peso(order.total)));
            const actions = make("div", "order-actions");
            const view = make("button", "order-secondary-button", "View Details"); view.type = "button";
            view.addEventListener("click", function () { details.hidden = !details.hidden; view.textContent = details.hidden ? "View Details" : "Hide Details"; });
            actions.appendChild(view); footer.append(totalBox, actions);
            if (order.status === "Payment Rejected") {
                const upload = make("button", "order-primary-button", "Re-upload Receipt"); upload.type = "button";
                upload.addEventListener("click", function () {
                    const note = window.prompt("Add a note for the new payment receipt:", "");
                    if (note === null) return;
                    if (!note.trim()) { alert("A re-upload note is required."); return; }
                    const input = document.createElement("input"); input.type = "file"; input.accept = "image/png,image/jpeg";
                    input.addEventListener("change", async function () {
                        if (!input.files || !input.files[0]) return;
                        upload.disabled = true; upload.textContent = "Uploading...";
                        try { await saveReuploadedReceipt(order, input.files[0], note.trim()); alert("New receipt submitted for verification."); window.location.reload(); }
                        catch (error) { alert(error.message || "Unable to upload receipt."); upload.disabled = false; upload.textContent = "Re-upload Receipt"; }
                    });
                    input.click();
                });
                actions.appendChild(upload);
            }
            card.append(header, itemsBox, details, footer); list.appendChild(card);
        });
        empty.classList.toggle("show", orderList.length === 0);
    }

    document.querySelectorAll(".order-filter").forEach(function (button) {
        button.addEventListener("click", function () {
            const selected = button.dataset.filter;
            document.querySelectorAll(".order-filter").forEach(function (item) { item.classList.toggle("active", item === button); });
            const filtered = selected === "all" ? orders : orders.filter(function (order) { return statusInfo(order.status).filter === selected; });
            render(filtered);
        });
    });
    render(orders);
})();
