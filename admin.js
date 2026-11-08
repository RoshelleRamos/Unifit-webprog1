/* =====================================================
   UNIFIT ADMIN LOGIN
===================================================== */

function getCurrentAdminActor() {
    try {
        const session = JSON.parse(sessionStorage.getItem("unifitAdminSession") || "null");
        return session ? { id: session.id, name: session.name, email: session.email } : { id: "unknown", name: "Administrator", email: "" };
    } catch (error) {
        return { id: "unknown", name: "Administrator", email: "" };
    }
}

(function () {

    const adminLoginForm =
        document.getElementById("adminLoginForm");

    if (!adminLoginForm) return;


    const ADMIN_EMAIL = "admin@unifit.com";
    const ADMIN_PASSWORD = "Admin123";


    adminLoginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById("adminEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("adminPassword")
                .value;

        const message =
            document.getElementById("adminLoginMessage");


        /* CHECK ADMIN ACCOUNT */

        if (
            email === ADMIN_EMAIL &&
            password === ADMIN_PASSWORD
        ) {

            localStorage.setItem(
                "unifitAdminLoggedIn",
                "true"
            );

            localStorage.setItem(
                "unifitAdminName",
                "Administrator"
            );


            message.textContent =
                "Login successful.";

            message.style.color =
                "#2e7d32";


            window.location.href =
                "dashboard.html";

        }

        else {

            message.textContent =
                "Invalid admin email or password.";

            message.style.color =
                "#b3261e";

        }

    });

})();

/* =====================================================
   UNIFIT ADMIN DASHBOARD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* Run this only on the Admin Dashboard */
    const adminDashboard =
        document.querySelector(".admin-layout");

    if (!adminDashboard) {
        return;
    }


    /* =================================================
       PROTECT ADMIN DASHBOARD
    ================================================= */

    const adminLoggedIn =
        localStorage.getItem("unifitAdminLoggedIn");

    if (adminLoggedIn !== "true") {

        window.location.href = "admin_login.html";

        return;
    }


    /* =================================================
       SHOW ADMIN NAME
    ================================================= */

    const adminName =
        localStorage.getItem("unifitAdminName")
        || "Administrator";

    const adminNameElement =
        document.querySelector(".admin-name");

    if (adminNameElement) {

        adminNameElement.textContent =
            adminName;

    }

    });


    /* =================================================
   ADMIN LOGOUT
================================================= */

const logoutButton =
    document.getElementById("adminLogoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "unifitAdminLoggedIn"
            );

            localStorage.removeItem(
                "unifitAdminName"
            );

            window.location.href =
                "admin_login.html";

        }
    );

}

/* =====================================================
   ADMIN SIDEBAR ACTIVE MENU
===================================================== */

const adminMenuLinks =
    document.querySelectorAll(".admin-navigation a");

adminMenuLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        adminMenuLinks.forEach(function (item) {

            item.classList.remove("active");

        });

        link.classList.add("active");

    });

});

    /* =================================================
   LOAD CUSTOMER ORDERS
================================================= */

const adminOrdersList =
    document.getElementById("adminOrdersList");

if (adminOrdersList) {

    const orders =
        JSON.parse(
            localStorage.getItem("unifitOrders")
        ) || [];


    /* ---------------------------------------------
       ORDER COUNTS
    --------------------------------------------- */

    const totalOrdersElement =
        document.getElementById("ordersTotalCount");

    const pendingOrdersElement =
        document.getElementById("ordersPendingCount");

    const verificationOrdersElement =
        document.getElementById(
            "ordersVerificationCount"
        );

    const completedOrdersElement =
        document.getElementById(
            "ordersCompletedCount"
        );


    const pendingOrders =
        orders.filter(function (order) {

            return order.status === "Pending";

        });


    const verificationOrders =
        orders.filter(function (order) {

            return (
                order.paymentStatus === "For Verification" ||
                order.status === "Payment Verification"
            );

        });


    const completedOrders =
        orders.filter(function (order) {

            return order.status === "Completed";

        });


    if (totalOrdersElement) {
        totalOrdersElement.textContent =
            orders.length;
    }

    if (pendingOrdersElement) {
        pendingOrdersElement.textContent =
            pendingOrders.length;
    }

    if (verificationOrdersElement) {
        verificationOrdersElement.textContent =
            verificationOrders.length;
    }

    if (completedOrdersElement) {
        completedOrdersElement.textContent =
            completedOrders.length;
    }


    /* ---------------------------------------------
       EMPTY ORDERS
    --------------------------------------------- */

    if (orders.length === 0) {

        adminOrdersList.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="admin-empty">
                    No customer orders available yet.
                </td>
            </tr>
        `;

    }

    else {

        adminOrdersList.innerHTML = "";


        /* -----------------------------------------
           DISPLAY ORDERS
        ----------------------------------------- */

        orders.forEach(function (order, index) {

            const row =
                document.createElement("tr");


            const orderDate =
                order.orderDate
                    ? new Date(
                        order.orderDate
                    ).toLocaleDateString(
                        "en-PH",
                        {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        }
                    )
                    : "—";


            const customerName =
                order.customer &&
                order.customer.fullName
                    ? order.customer.fullName
                    : "Unknown Customer";


            const total =
                Number(order.total || 0);


            row.innerHTML = `

                <td>
                    ${order.orderNumber || "—"}
                </td>

                <td>
                    ${customerName}
                </td>

                <td>
                    ${orderDate}
                </td>

                <td>
                    ₱${total.toLocaleString(
                        "en-PH",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )}
                </td>

                <td>
                    ${order.payment || "GCash"}
                    <small class="admin-table-payment-status">
                        ${order.paymentStatus || "For Verification"}
                    </small>
                </td>

                <td>
                    ${order.status || "Pending"}
                </td>

                <td>
                    <button
                        type="button"
                        class="admin-view-order-button"
                        data-order-index="${index}">
                        View
                    </button>
                </td>

            `;


            adminOrdersList.appendChild(row);

        });

        /* =================================================
            VIEW ORDER DETAILS
            ================================================= */

            const orderModal =
                document.getElementById("orderDetailsModal");

            const orderDetailsContent =
                document.getElementById("orderDetailsContent");

            const closeOrderModal =
                document.getElementById("closeOrderModal");


            adminOrdersList.addEventListener(
                "click",
                function (event) {

                    const viewButton =
                        event.target.closest(
                            ".admin-view-order-button"
                        );

                    if (!viewButton) {
                        return;
                    }


                    const orderIndex =
                        Number(
                            viewButton.dataset.orderIndex
                        );

                    const order =
                        orders[orderIndex];

                    if (!order) {
                        return;
                    }

                    function stampOrder() {
                        const actor = getCurrentAdminActor();
                        orders[orderIndex].statusUpdatedBy = actor.name;
                        orders[orderIndex].statusUpdatedAt = new Date().toISOString();
                    }


                    const customer =
                        order.customer || {};

                    const items =
                        order.items || [];


                    let productsHTML = "";


                    if (items.length === 0) {

                        productsHTML = `
                            <p>No product information available.</p>
                        `;

                    } else {

                        items.forEach(function (item) {

                            const itemQuantity = Number(item.quantity) || 1;
                            const itemUnitPrice = Number(item.price) || 0;
                            const itemLineTotal = itemQuantity * itemUnitPrice;

                            productsHTML += `

                                <div class="admin-order-product">

                                    <img
                                        src="../${item.image || ""}"
                                        alt="${item.name || "Product"}">

                                    <div>

                                        <h4>
                                            ${item.name || "Product"}
                                        </h4>

                                        <p>
                                            Size:
                                            ${item.size || "—"}
                                        </p>

                                        <p>
                                            Quantity:
                                            ${item.quantity || 1}
                                        </p>

                                        <p>
                                            <strong>Variant/Fabric:</strong>
                                            ${item.fabric || "Standard"}
                                        </p>

                                        <p>
                                            <strong>Unit Price:</strong>
                                            ₱${itemUnitPrice.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>

                                    </div>

                                    <strong>
                                        ₱${Number(
                                            item.price || 0
                                        ).toLocaleString(
                                            "en-PH",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }
                                        )}
                                    </strong>

                                    <span class="admin-product-line-total">
                                        Line total: ₱${itemLineTotal.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>

                                </div>

                            `;

                        });

                    }


                    orderDetailsContent.innerHTML = `

                        <div class="admin-order-info">

                            <div class="admin-order-info-item">
                                <strong>Order ID</strong>
                                ${order.orderNumber || "—"}
                            </div>

                            <div class="admin-order-info-item">
                                <strong>Student</strong>
                                ${
                                    customer.fullName ||
                                    customer.name ||
                                    "Unknown Customer"
                                }
                            </div>

                            <div class="admin-order-info-item">
                                <strong>Email</strong>
                                ${customer.email || "—"}
                            </div>

                            <div class="admin-order-info-item">
                                <strong>Contact Number</strong>
                                ${
                                    customer.phone ||
                                    customer.contactNumber ||
                                    "—"
                                }
                            </div>

                            <div class="admin-order-info-item">
                                <strong>Payment Method</strong>
                                ${
                                    order.payment ||
                                    order.paymentMethod ||
                                    "—"
                                }
                            </div>

                            <div class="admin-order-info-item">
                                <strong>Payment Status</strong>
                                <span class="admin-payment-badge ${order.paymentStatus === "Verified" ? "received" : "not-received"}">
                                    Payment Received: ${order.paymentStatus === "Verified" ? "YES" : "NO"}
                                </span>
                                ${
                                    order.paymentStatus ||
                                    "—"
                                }
                            </div>

                            <div class="admin-order-info-item">
                                <strong>GCash Reference</strong>
                                ${order.paymentReference || "—"}
                            </div>

                            <div class="admin-order-info-item">
                                <strong>Receipt File</strong>
                                ${order.paymentReceiptName || "—"}
                            </div>

                            ${order.paymentReceiptData && order.paymentReceiptData.startsWith("data:image/") ? `
                                <div class="admin-order-info-item admin-receipt-preview">
                                    <strong>Payment Receipt Preview</strong>
                                    <img src="${order.paymentReceiptData}" alt="GCash payment receipt">
                                </div>
                            ` : ""}

                            <div class="admin-order-info-item">
                                <strong>Order Status</strong>
                                ${
                                    order.status ||
                                    "Pending"
                                }
                            </div>

                            <div class="admin-order-info-item">
                                <strong>Total</strong>
                                ₱${Number(
                                    order.total || 0
                                ).toLocaleString(
                                    "en-PH",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}
                            </div>

                            <div class="admin-order-info-item">
                                <strong>Last Updated By</strong>
                                ${order.statusUpdatedBy || "Not updated yet"}
                                ${order.statusUpdatedAt ? `<small>${new Date(order.statusUpdatedAt).toLocaleString("en-PH")}</small>` : ""}
                            </div>

                            ${order.cancelNote ? `
                                <div class="admin-order-info-item admin-cancel-note">
                                    <strong>Cancellation Note</strong>
                                    ${order.cancelNote}
                                    <small>Cancelled by ${order.cancelledBy || "Administrator"}${order.cancelledAt ? " — " + new Date(order.cancelledAt).toLocaleString("en-PH") : ""}</small>
                                </div>
                            ` : ""}

                            ${order.rejectionNote ? `
                                <div class="admin-order-info-item admin-rejection-note">
                                    <strong>Payment Rejection Note</strong>
                                    ${order.rejectionNote}
                                    <small>Rejected by ${order.rejectedBy || "Administrator"}${order.rejectedAt ? " — " + new Date(order.rejectedAt).toLocaleString("en-PH") : ""}</small>
                                </div>
                            ` : ""}

                            ${order.resubmissionNote ? `
                                <div class="admin-order-info-item admin-resubmission-note">
                                    <strong>Student Re-upload Note</strong>
                                    ${order.resubmissionNote}
                                    ${order.receiptReuploadedAt ? `<small>${new Date(order.receiptReuploadedAt).toLocaleString("en-PH")}</small>` : ""}
                                </div>
                            ` : ""}

                        </div>


                        <div class="admin-order-summary">
                            <div><span>Subtotal</span><strong>₱${Number(order.subtotal || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
                            <div><span>Discount</span><strong>- ₱${Number(order.discount || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
                            <div class="total"><span>Student Order Total</span><strong>₱${Number(order.total || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
                        </div>

                        <div class="admin-order-notes">
                            <strong>Student Notes</strong>
                            <p>${order.notes || "No special instructions."}</p>
                        </div>


                        <div class="admin-order-products">

                            <h3>Ordered Products</h3>

                            ${productsHTML}

                        </div>

                        <div class="admin-order-actions">

                        <h3>Manage Order</h3>

                        <div class="admin-order-action-buttons">

                            ${
                                order.paymentStatus !== "Verified" &&
                                order.status !== "Payment Rejected" &&
                                order.status !== "Cancelled"
                                    ? `
                                        <button
                                            type="button"
                                            class="admin-order-action-button"
                                            id="approvePaymentButton"
                                            data-order-index="${orderIndex}">
                                            Confirm Payment Received
                                        </button>
                                    `
                                    : ""
                            }

                            ${
                                order.paymentStatus !== "Verified" &&
                                order.status !== "Payment Rejected" &&
                                order.status !== "Cancelled"
                                    ? `<button type="button" class="admin-order-action-button danger" id="rejectPaymentButton">Reject Payment</button>`
                                    : ""
                            }


                            ${
                                order.paymentStatus === "Verified" &&
                                (
                                    !order.status ||
                                    order.status === "Pending"
                                )
                                    ? `
                                        <button
                                            type="button"
                                            class="admin-order-action-button"
                                            id="processingOrderButton"
                                            data-order-index="${orderIndex}">
                                            Mark as Processing
                                        </button>
                                    `
                                    : ""
                            }


                            ${
                                order.status === "Processing"
                                    ? `
                                        <button
                                            type="button"
                                            class="admin-order-action-button"
                                            id="readyOrderButton"
                                            data-order-index="${orderIndex}">
                                            Ready for Pickup
                                        </button>
                                    `
                                    : ""
                            }


                            ${
                                order.status === "Ready for Pickup"
                                    ? `
                                        <button
                                            type="button"
                                            class="admin-order-action-button completed"
                                            id="completeOrderButton"
                                            data-order-index="${orderIndex}">
                                            Complete Order
                                        </button>
                                    `
                                    : ""
                            }


                            ${
                                order.status === "Completed"
                                    ? `
                                        <p class="admin-order-completed-message">
                                            This order has been completed.
                                        </p>
                                    `
                                    : ""
                            }

                            ${
                                order.status !== "Completed" &&
                                order.status !== "Cancelled" &&
                                order.status !== "Payment Rejected"
                                    ? `<button type="button" class="admin-order-action-button danger" id="cancelOrderButton">Cancel Order</button>`
                                    : ""
                            }

                        </div>

                    </div>
                    `;

                    /* ---------------------------------------------
                        APPROVE PAYMENT
                        --------------------------------------------- */

                        const approvePaymentButton =
                            document.getElementById("approvePaymentButton");

                        if (approvePaymentButton) {

                            approvePaymentButton.addEventListener(
                                "click",
                                function () {

                                    orders[orderIndex].paymentStatus =
                                        "Verified";

                                    orders[orderIndex].status =
                                        "Pending";

                                    const paymentActor = getCurrentAdminActor();
                                    orders[orderIndex].paymentVerifiedBy = paymentActor.name;
                                    orders[orderIndex].paymentVerifiedAt = new Date().toISOString();
                                    stampOrder();

                                    localStorage.setItem(
                                        "unifitOrders",
                                        JSON.stringify(orders)
                                    );

                                    alert(
                                        "Payment has been approved successfully."
                                    );

                                    window.location.reload();

                                }
                            );

                        }

                        const rejectPaymentButton = document.getElementById("rejectPaymentButton");
                        if (rejectPaymentButton) rejectPaymentButton.addEventListener("click", function () {
                            const rejectionNote = window.prompt("Enter the reason for rejecting this payment receipt:", "");
                            if (rejectionNote === null) return;
                            if (!rejectionNote.trim()) {
                                alert("Payment rejection note is required.");
                                return;
                            }
                            const actor = getCurrentAdminActor();
                            orders[orderIndex].paymentStatus = "Rejected";
                            orders[orderIndex].status = "Payment Rejected";
                            orders[orderIndex].rejectionNote = rejectionNote.trim();
                            orders[orderIndex].rejectedBy = actor.name;
                            orders[orderIndex].rejectedAt = new Date().toISOString();
                            stampOrder();
                            localStorage.setItem("unifitOrders", JSON.stringify(orders));
                            window.location.reload();
                        });

                        /* ---------------------------------------------
                            MARK AS PROCESSING
                            --------------------------------------------- */

                            const processingOrderButton =
                                document.getElementById("processingOrderButton");

                            if (processingOrderButton) {

                                processingOrderButton.addEventListener(
                                    "click",
                                    function () {

                                        orders[orderIndex].status =
                                            "Processing";

                                        stampOrder();

                                        localStorage.setItem(
                                            "unifitOrders",
                                            JSON.stringify(orders)
                                        );

                                        alert(
                                            "Order status changed to Processing."
                                        );

                                        window.location.reload();

                                    }
                                );

                            }

                            const cancelOrderButton = document.getElementById("cancelOrderButton");
                            if (cancelOrderButton) cancelOrderButton.addEventListener("click", function () {
                                const cancelNote = window.prompt("Enter the reason for cancelling this student order:", "");
                                if (cancelNote === null) return;
                                if (!cancelNote.trim()) {
                                    alert("Cancellation note is required.");
                                    return;
                                }
                                const actor = getCurrentAdminActor();
                                orders[orderIndex].status = "Cancelled";
                                orders[orderIndex].cancelNote = cancelNote.trim();
                                orders[orderIndex].cancelledBy = actor.name;
                                orders[orderIndex].cancelledAt = new Date().toISOString();
                                stampOrder();
                                localStorage.setItem("unifitOrders", JSON.stringify(orders));
                                window.location.reload();
                            });

                            /* ---------------------------------------------
                            READY FOR PICKUP
                            --------------------------------------------- */

                            const readyOrderButton =
                                document.getElementById("readyOrderButton");

                            if (readyOrderButton) {

                                readyOrderButton.addEventListener(
                                    "click",
                                    function () {

                                        orders[orderIndex].status =
                                            "Ready for Pickup";

                                        stampOrder();

                                        localStorage.setItem(
                                            "unifitOrders",
                                            JSON.stringify(orders)
                                        );

                                        alert(
                                            "Order is now Ready for Pickup."
                                        );

                                        window.location.reload();

                                    }
                                );

                            }

                            /* ---------------------------------------------
                            COMPLETE ORDER
                            --------------------------------------------- */

                            const completeOrderButton =
                                document.getElementById("completeOrderButton");

                            if (completeOrderButton) {

                                completeOrderButton.addEventListener(
                                    "click",
                                    function () {

                                        orders[orderIndex].status =
                                            "Completed";

                                        stampOrder();

                                        localStorage.setItem(
                                            "unifitOrders",
                                            JSON.stringify(orders)
                                        );

                                        alert(
                                            "Order has been completed successfully."
                                        );

                                        window.location.reload();

                                    }
                                );

                            }


                    if (orderModal) {

                        orderModal.classList.add("show");

                    }

                }
            );


            /* CLOSE ORDER DETAILS */

            if (closeOrderModal && orderModal) {

                closeOrderModal.addEventListener(
                    "click",
                    function () {

                        orderModal.classList.remove("show");

                    }
                );

            }

    }

}
