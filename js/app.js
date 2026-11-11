/* =========================================================
   STUDENT NAVIGATION AUTH STATE
========================================================= */

(function () {
    let student = null;
    try {
        student = JSON.parse(localStorage.getItem("unifitCurrentUser") || "null");
    } catch (error) {
        student = null;
    }

    const isLoggedIn =
        localStorage.getItem("unifitLoggedIn") === "true" &&
        student && student.role === "student";

    document.querySelectorAll('a[href="login.html"]').forEach(function (link) {
        (link.closest("li") || link).hidden = Boolean(isLoggedIn);
    });

    document.querySelectorAll('a[href="profile.html"]').forEach(function (link) {
        (link.closest("li") || link).hidden = !isLoggedIn;
    });
})();

/* =========================================================
   FABRIC & COLOR SELECTION
========================================================= */

(function () {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const chooseFabricBtn =
        document.getElementById("chooseFabricBtn");

    const openFabricImage =
        document.getElementById("openFabricImage");

    const fabricModal =
        document.getElementById("fabricModal");

    const closeFabricModal =
        document.getElementById("closeFabricModal");

    const fabricModalOverlay =
        document.getElementById("fabricModalOverlay") ||
        document.querySelector(".fabric-modal-overlay");

    const fabricChoices =
        document.querySelectorAll(".fabric-choice");

    const selectedFabricName =
        document.getElementById("selectedFabricName");

    const selectedFabricPriceText =
        document.getElementById("selectedFabricPrice");

    const fabricYards =
        document.getElementById("fabricYards");

    const fabricYardMinus =
        document.getElementById("fabricYardMinus");

    const fabricYardPlus =
        document.getElementById("fabricYardPlus");

    const fabricTotal =
        document.getElementById("fabricTotal");

    const confirmFabricBtn =
        document.getElementById("confirmFabricBtn");

    const fabricSelectionText =
        document.getElementById("fabricSelectionText");


    /* =====================================================
       STOP IF FABRIC FEATURE IS NOT ON THIS PAGE
    ====================================================== */

    if (!fabricModal || fabricChoices.length === 0) {
        return;
    }


    /* =====================================================
       VALUES
    ====================================================== */

    let selectedFabric = "";

    let selectedDescription = "";

    let selectedFabricPrice = 0;

    let selectedFabricImage = "";

    let selectedFabricYards = 1;


    /* =====================================================
       FORMAT PESO
    ====================================================== */

    function formatFabricPeso(value) {

        const amount =
            Number(value) || 0;

        return (
            "₱" +
            amount.toLocaleString(
                "en-PH",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
        );

    }


    /* =====================================================
       UPDATE TOTAL
    ====================================================== */

    function updateFabricTotal() {

        if (!fabricYards) {
            return;
        }


        let yards =
            Number(fabricYards.value) || 1;


        if (yards < 1) {
            yards = 1;
        }


        selectedFabricYards =
            yards;


        fabricYards.value =
            selectedFabricYards;


        const total =
            selectedFabricPrice *
            selectedFabricYards;


        if (fabricTotal) {

            fabricTotal.textContent =
                formatFabricPeso(total);

        }

    }


    /* =====================================================
       OPEN MODAL
    ====================================================== */

    function openFabricModalWindow() {

        fabricModal.classList.add("show");

        document.body.style.overflow =
            "hidden";

    }


    if (chooseFabricBtn) {

        chooseFabricBtn.addEventListener(
            "click",
            openFabricModalWindow
        );

    }


    if (openFabricImage) {

        openFabricImage.addEventListener(
            "click",
            openFabricModalWindow
        );

    }


    /* =====================================================
       CLOSE MODAL
    ====================================================== */

    function closeFabricModalWindow() {

        fabricModal.classList.remove("show");

        document.body.style.overflow =
            "";

    }


    if (closeFabricModal) {

        closeFabricModal.addEventListener(
            "click",
            closeFabricModalWindow
        );

    }


    if (fabricModalOverlay) {

        fabricModalOverlay.addEventListener(
            "click",
            closeFabricModalWindow
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                fabricModal.classList.contains("show")
            ) {

                closeFabricModalWindow();

            }

        }
    );


    /* =====================================================
       SELECT FABRIC
    ====================================================== */

    fabricChoices.forEach(
        function (choice) {

            choice.addEventListener(
                "click",
                function () {

                    /* REMOVE OLD SELECTION */

                    fabricChoices.forEach(
                        function (item) {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                    /* SELECT NEW FABRIC */

                    choice.classList.add(
                        "selected"
                    );


                    selectedFabric =
                        choice.dataset.fabric || "";


                    selectedDescription =
                        choice.dataset.description || "";


                    selectedFabricPrice =
                        Number(
                            choice.dataset.price
                        ) || 0;


                    selectedFabricImage =
                        choice.dataset.image || "";


                    /* DISPLAY NAME */

                    if (selectedFabricName) {

                        selectedFabricName.textContent =
                            selectedFabric +
                            " — " +
                            selectedDescription;

                    }


                    /* DISPLAY PRICE */

                    if (selectedFabricPriceText) {

                        selectedFabricPriceText.textContent =
                            formatFabricPeso(
                                selectedFabricPrice
                            ) +
                            " per yard";

                    }


                    /* ENABLE ADD TO CART */

                    if (confirmFabricBtn) {

                        confirmFabricBtn.disabled =
                            false;

                    }


                    updateFabricTotal();

                }
            );

        }
    );


    /* =====================================================
       MINUS YARD
    ====================================================== */

    if (
        fabricYardMinus &&
        fabricYards
    ) {

        fabricYardMinus.addEventListener(
            "click",
            function () {

                let yards =
                    Number(
                        fabricYards.value
                    ) || 1;


                if (yards > 1) {

                    yards--;

                }


                fabricYards.value =
                    yards;


                updateFabricTotal();

            }
        );

    }


    /* =====================================================
       PLUS YARD
    ====================================================== */

    if (
        fabricYardPlus &&
        fabricYards
    ) {

        fabricYardPlus.addEventListener(
            "click",
            function () {

                let yards =
                    Number(
                        fabricYards.value
                    ) || 1;


                yards++;


                fabricYards.value =
                    yards;


                updateFabricTotal();

            }
        );

    }


    /* =====================================================
       MANUAL YARD INPUT
    ====================================================== */

    if (fabricYards) {

        fabricYards.addEventListener(
            "input",
            updateFabricTotal
        );

    }


    /* =====================================================
       GET CART
    ====================================================== */

    function getFabricCart() {

        try {

            const cart =
                JSON.parse(
                    localStorage.getItem(
                        "unifitCart"
                    )
                );


            return Array.isArray(cart)
                ? cart
                : [];

        } catch (error) {

            return [];

        }

    }


    /* =====================================================
       ADD FABRIC TO CART
    ====================================================== */

    if (confirmFabricBtn) {

        confirmFabricBtn.addEventListener(
            "click",
            function () {

                if (!selectedFabric) {

                    alert(
                        "Please select a fabric first."
                    );

                    return;

                }


                if (selectedFabricPrice <= 0) {

                    alert(
                        "This fabric does not have a valid price."
                    );

                    return;

                }


                updateFabricTotal();


                const cart =
                    getFabricCart();


                const fabricItem = {

                    id:
                        "fabric-" +
                        selectedFabric
                            .toLowerCase()
                            .replace(/\s+/g, "-"),

                    name:
                        selectedFabric +
                        " Fabric",

                    category:
                        "Fabric",

                    price:
                        selectedFabricPrice,

                    image:
                        selectedFabricImage,

                    size:
                        "Per Yard",

                    quantity:
                        selectedFabricYards,

                    fabric:
                        selectedDescription

                };


                /* CHECK IF SAME FABRIC IS ALREADY IN CART */

                const existingItem =
                    cart.find(
                        function (item) {

                            return (
                                item.id ===
                                    fabricItem.id &&
                                item.fabric ===
                                    fabricItem.fabric
                            );

                        }
                    );


                if (existingItem) {

                    existingItem.quantity +=
                        selectedFabricYards;

                } else {

                    cart.push(
                        fabricItem
                    );

                }


                /* SAVE CART */

                localStorage.setItem(
                    "unifitCart",
                    JSON.stringify(cart)
                );


                /* UPDATE PRODUCT CARD */

                if (fabricSelectionText) {

                    fabricSelectionText.textContent =
                        "Selected: " +
                        selectedFabric +
                        " — " +
                        selectedDescription;

                }


                if (chooseFabricBtn) {

                    chooseFabricBtn.textContent =
                        "Change Fabric Color";

                }


                /* UPDATE NAV CART */

                if (
                    typeof updateUniFitCartCount ===
                    "function"
                ) {

                    updateUniFitCartCount();

                }


                alert(
                    selectedFabricYards +
                    " yard(s) of " +
                    selectedFabric +
                    " fabric added to cart."
                );


                /* GO TO CART */

                window.location.href =
                    "cart.html";

            }
        );

    }

})();





/* =========================================================
   UNIFIT DYNAMIC SHOPPING CART
========================================================= */

(function () {

    const cartItemsContainer =
        document.getElementById("cartItemsContainer");


    /*
        Run only on cart.html
    */

    if (!cartItemsContainer) {
        return;
    }


    const subtotalElement =
        document.getElementById("cartSubtotal");

    const discountElement =
        document.getElementById("cartDiscount");

    const totalElement =
        document.getElementById("cartTotal");

    const itemTextElement =
        document.getElementById("cartItemText");

    const emptyMessage =
        document.getElementById("cartEmptyMessage");

    const checkoutButtonElement =
        document.getElementById("checkoutButton");

    const couponInput =
        document.getElementById("couponCode");

    const couponButton =
        document.getElementById("applyCoupon");

    const couponMessageElement =
        document.getElementById("couponMessage");


    let cartPageCouponPercent =
        Number(localStorage.getItem("unifitCouponPercent")) || 0;



    /* =====================================================
       GET CART
    ====================================================== */

    function getUniFitCart() {

        try {

            const savedCart =
                JSON.parse(
                    localStorage.getItem(
                        "unifitCart"
                    )
                );


            return Array.isArray(savedCart)
                ? savedCart
                : [];

        }

        catch (error) {

            return [];

        }

    }



    /* =====================================================
       SAVE CART
    ====================================================== */

    function saveUniFitCart(cart) {

        localStorage.setItem(
            "unifitCart",
            JSON.stringify(cart)
        );


        if (
            typeof updateUniFitCartCount ===
            "function"
        ) {

            updateUniFitCartCount();

        }

    }



    /* =====================================================
       SAFE NUMBER
    ====================================================== */

    function cartNumber(value) {

        const cleaned =
            String(value ?? "")
                .replace(
                    /[^\d.-]/g,
                    ""
                );


        const number =
            Number(cleaned);


        return Number.isFinite(number)
            ? number
            : 0;

    }



    /* =====================================================
       FORMAT PESO
    ====================================================== */

    function formatCartPeso(value) {

        const amount =
            cartNumber(value);


        return (
            "₱" +
            amount.toLocaleString(
                "en-PH",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
        );

    }



    /* =====================================================
       CART TOTALS
    ====================================================== */

    function updateCartSummary() {

        const cart =
            getUniFitCart();


        let subtotal = 0;
        let totalQuantity = 0;


        cart.forEach(
            function (item) {

                const price =
                    cartNumber(
                        item.price
                    );


                const quantity =
                    Math.max(
                        1,
                        parseInt(
                            item.quantity,
                            10
                        ) || 1
                    );


                subtotal +=
                    price * quantity;


                totalQuantity +=
                    quantity;

            }
        );


        const discount =
            subtotal *
            (
                cartPageCouponPercent /
                100
            );


        const total =
            subtotal -
            discount;



        /* SUBTOTAL */

        if (subtotalElement) {

            subtotalElement.textContent =
                formatCartPeso(
                    subtotal
                );

        }



        /* DISCOUNT */

        if (discountElement) {

            if (discount > 0) {

                discountElement.textContent =
                    "- " +
                    formatCartPeso(
                        discount
                    );

            }

            else {

                discountElement.textContent =
                    formatCartPeso(0);

            }

        }



        /* TOTAL */

        if (totalElement) {

            totalElement.textContent =
                formatCartPeso(
                    total
                );

        }



        /* ITEM COUNT */

        if (itemTextElement) {

            itemTextElement.textContent =
                totalQuantity === 1
                    ? "1 Item"
                    : totalQuantity +
                      " Items";

        }



        /* GLOBAL CART COUNT */

        if (
            typeof updateUniFitCartCount ===
            "function"
        ) {

            updateUniFitCartCount();

        }



        /* EMPTY CART */

        if (cart.length === 0) {

            if (emptyMessage) {

                emptyMessage.classList.add(
                    "show"
                );

            }


            if (checkoutButtonElement) {

                checkoutButtonElement
                    .classList.add(
                        "disabled"
                    );

            }

        }

        else {

            if (emptyMessage) {

                emptyMessage.classList.remove(
                    "show"
                );

            }


            if (checkoutButtonElement) {

                checkoutButtonElement
                    .classList.remove(
                        "disabled"
                    );

            }

        }

    }



    /* =====================================================
       CREATE CART ITEM
    ====================================================== */

    function createCartItem(
        item,
        index
    ) {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "cart-product-row";


        const price =
            cartNumber(
                item.price
            );


        const quantity =
            Math.max(
                1,
                parseInt(
                    item.quantity,
                    10
                ) || 1
            );


        let fabricHTML = "";


        if (item.fabric) {

            fabricHTML = `

                <span>

                    Fabric:

                    <strong>
                        ${item.fabric}
                    </strong>

                </span>

            `;

        }


        article.innerHTML = `

            <div class="cart-thumb">

                <img
                    src="${item.image}"
                    alt="${item.name}">

            </div>


            <div class="cart-product-details">

                <p class="cart-product-category">
                    ${item.category}
                </p>


                <h3>
                    ${item.name}
                </h3>


                <div class="cart-meta">

                    <span>

                        Size:

                        <strong>
                            ${item.size}
                        </strong>

                    </span>

                    ${fabricHTML}

                </div>


                <p class="cart-unit-price">

                    ${formatCartPeso(price)}

                </p>

            </div>


            <div class="cart-item-actions">

                <div class="cart-quantity">

                    <button
                        type="button"
                        class="quantity-minus">

                        −

                    </button>


                    <span class="quantity-value">

                        ${quantity}

                    </span>


                    <button
                        type="button"
                        class="quantity-plus">

                        +

                    </button>

                </div>


                <p class="cart-line-total">

                    ${formatCartPeso(
                        price *
                        quantity
                    )}

                </p>


                <button
                    type="button"
                    class="cart-remove">

                    Remove

                </button>

            </div>

        `;



        /* PLUS */

        const plusButton =
            article.querySelector(
                ".quantity-plus"
            );


        plusButton.addEventListener(
            "click",
            function () {

                const cart =
                    getUniFitCart();


                if (!cart[index]) {
                    return;
                }


                cart[index].quantity =
                    Math.max(
                        1,
                        parseInt(
                            cart[index].quantity,
                            10
                        ) || 1
                    ) + 1;


                saveUniFitCart(cart);

                renderCart();

            }
        );



        /* MINUS */

        const minusButton =
            article.querySelector(
                ".quantity-minus"
            );


        minusButton.addEventListener(
            "click",
            function () {

                const cart =
                    getUniFitCart();


                if (!cart[index]) {
                    return;
                }


                const currentQuantity =
                    Math.max(
                        1,
                        parseInt(
                            cart[index].quantity,
                            10
                        ) || 1
                    );


                if (
                    currentQuantity >
                    1
                ) {

                    cart[index].quantity =
                        currentQuantity -
                        1;


                    saveUniFitCart(cart);

                    renderCart();

                }

            }
        );



        /* REMOVE */

        const removeButton =
            article.querySelector(
                ".cart-remove"
            );


        removeButton.addEventListener(
            "click",
            function () {

                const cart =
                    getUniFitCart();


                cart.splice(
                    index,
                    1
                );


                saveUniFitCart(cart);

                renderCart();

            }
        );


        return article;

    }



    /* =====================================================
       RENDER CART
    ====================================================== */

    function renderCart() {

        const cart =
            getUniFitCart();


        cartItemsContainer.innerHTML =
            "";


        cart.forEach(
            function (
                item,
                index
            ) {

                cartItemsContainer.appendChild(
                    createCartItem(
                        item,
                        index
                    )
                );

            }
        );


        updateCartSummary();

    }

    /* =====================================================
   COUPON
====================================================== */

if (couponButton) {

    couponButton.addEventListener(
        "click",
        function () {

            const code =
                couponInput
                    .value
                    .trim()
                    .toUpperCase();


            couponMessageElement
                .classList.remove(
                    "success",
                    "error"
                );


            if (code === "STUDENT10") {

                let couponStudent = null;
                let usedStudent10 = [];
                try {
                    couponStudent = JSON.parse(localStorage.getItem("unifitCurrentUser") || "null");
                    usedStudent10 = JSON.parse(localStorage.getItem("unifitUsedStudent10") || "[]");
                } catch (error) {
                    couponStudent = null;
                    usedStudent10 = [];
                }

                const couponEmail = couponStudent && couponStudent.email
                    ? couponStudent.email.trim().toLowerCase()
                    : "";

                if (!couponEmail || usedStudent10.includes(couponEmail)) {
                    cartPageCouponPercent = 0;
                    localStorage.removeItem("unifitCouponPercent");
                    localStorage.removeItem("unifitCouponCode");
                    couponMessageElement.textContent = !couponEmail
                        ? "Please login with a student account to use this coupon."
                        : "STUDENT10 has already been used by this student.";
                    couponMessageElement.classList.add("error");
                    updateCartSummary();
                    return;
                }

                cartPageCouponPercent = 10;


                localStorage.setItem(
                    "unifitCouponPercent",
                    "10"
                );

                localStorage.setItem("unifitCouponCode", "STUDENT10");


                couponMessageElement.textContent =
                    "Student discount applied: 10% off.";


                couponMessageElement
                    .classList.add(
                        "success"
                    );

            }

            else if (code === "") {

                cartPageCouponPercent = 0;


                localStorage.removeItem(
                    "unifitCouponPercent"
                );

                localStorage.removeItem("unifitCouponCode");


                couponMessageElement.textContent =
                    "Please enter a coupon code.";


                couponMessageElement
                    .classList.add(
                        "error"
                    );

            }

            else {

                cartPageCouponPercent = 0;


                localStorage.removeItem(
                    "unifitCouponPercent"
                );

                localStorage.removeItem("unifitCouponCode");


                couponMessageElement.textContent =
                    "Invalid coupon code.";


                couponMessageElement
                    .classList.add(
                        "error"
                    );

            }


            updateCartSummary();

        }
    );

}

    /* =====================================================
       START
    ====================================================== */

    renderCart();

})();

/* =========================================================
   PASSWORD EYE TOGGLE
========================================================= */

const passwordToggleButtons =
    document.querySelectorAll(
        ".password-toggle"
    );


passwordToggleButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    button.dataset.target;


                const passwordInput =
                    document.getElementById(
                        targetId
                    );


                if (!passwordInput) {
                    return;
                }


                if (
                    passwordInput.type ===
                    "password"
                ) {

                    passwordInput.type =
                        "text";

                    button.classList.add(
                        "showing-password"
                    );

                    button.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                }

                else {

                    passwordInput.type =
                        "password";

                    button.classList.remove(
                        "showing-password"
                    );

                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            }
        );

    }
);


/* =========================================================
   UNIFIT REGISTER AND LOGIN
   Front-End Demo using Local Storage
========================================================= */

(function () {

    /* Student authentication is now handled by js/auth.js. */
    return;

    /* =====================================================
       REGISTER
    ====================================================== */

    const unifitRegisterForm =
        document.getElementById("registerForm");


    if (unifitRegisterForm) {

        unifitRegisterForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const firstName =
                    document
                        .getElementById("firstName")
                        .value
                        .trim();


                const lastName =
                    document
                        .getElementById("lastName")
                        .value
                        .trim();

                        const contactNumber =
                          document
                         .getElementById("contactNumber")
                         .value
                         .trim();

                        const email =
                         document
                        .getElementById("registerEmail")
                        .value
                        .trim()
                        .toLowerCase();


                        const password =
                        document
                        .getElementById("registerPassword")
                        .value;


                        const confirmPassword =
                         document
                        .getElementById("confirmPassword")
                        .value;


                /* CHECK EMPTY FIELDS */

                if (
                 firstName === "" ||
                 lastName === "" ||
                 contactNumber === "" ||
                 email === "" ||
                 password === "" ||
                 confirmPassword === ""
                ) {

                 alert(
                  "Please complete all required fields."
                );

                 return;
                 }


                /* CHECK PASSWORD */

                if (password !== confirmPassword) {

                    alert(
                        "Passwords do not match. Please try again."
                    );

                    return;
                }


                /* PASSWORD LENGTH */

                if (password.length < 6) {

                    alert(
                        "Password must be at least 6 characters."
                    );

                    return;
                }


                /* CHECK EXISTING ACCOUNT */

                const existingAccount =
                    localStorage.getItem(
                        "unifitUser"
                    );


                if (existingAccount) {

                    const existingUser =
                        JSON.parse(
                            existingAccount
                        );


                    if (
                        existingUser.email ===
                        email
                    ) {

                        alert(
                            "An account with this email already exists. Please login instead."
                        );

                        return;
                    }

                }


                /* CREATE USER */

                const newUser = {

    firstName:
        firstName,

    lastName:
        lastName,

    contactNumber:
        contactNumber,

    email:
        email,

    password:
        password

};


                /* SAVE ACCOUNT */

                localStorage.setItem(
                    "unifitUser",
                    JSON.stringify(newUser)
                );


                alert(
                    "Account created successfully! You can now login."
                );


                /* GO TO LOGIN */

                window.location.href =
                    "login.html";

            }
        );

    }



    /* =====================================================
       LOGIN
    ====================================================== */

    const unifitLoginForm =
        document.getElementById("loginForm");


    if (unifitLoginForm) {

        unifitLoginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    document
                        .getElementById("loginEmail")
                        .value
                        .trim()
                        .toLowerCase();


                const password =
                    document
                        .getElementById("loginPassword")
                        .value;


                /* CHECK EMPTY */

                if (
                    email === "" ||
                    password === ""
                ) {

                    alert(
                        "Please enter your email and password."
                    );

                    return;
                }

                document.addEventListener("DOMContentLoaded", function () {
    const unifitLoginForm = document.getElementById("loginForm");

    if (unifitLoginForm) {
        unifitLoginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            const emailInput = document.getElementById("loginEmail");
            const passwordInput = document.getElementById("loginPassword");

            const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
            const password = passwordInput ? passwordInput.value : "";

            // 1. Check kung walang laman
            if (email === "" || password === "") {
                alert("Please enter your email and password.");
                return;
            }

            let foundUser = null;

            // 2. Suriin kung nakasave bilang array ("unifitUsers") o single object ("unifitUser")
            const savedUsers = localStorage.getItem("unifitUsers");
            const singleUser = localStorage.getItem("unifitUser");

            if (savedUsers) {
                const usersArray = JSON.parse(savedUsers);
                foundUser = usersArray.find(u => u.email && u.email.toLowerCase() === email);
            }

            // Kung hindi nahanap sa array, subukan namang hanapin sa single account
            if (!foundUser && singleUser) {
                const userObj = JSON.parse(singleUser);
                if (userObj.email && userObj.email.toLowerCase() === email) {
                    foundUser = userObj;
                }
            }

            // 3. Kung wala pa rin kahit saan, ibig sabihin ay hindi pa rehistrado
            if (!foundUser) {
                alert("No account found. Please register first.");
                return;
            }

            // 4. I-check kung tama ang password
            if (foundUser.password !== password) {
                alert("Wrong Password");
                return;
            }

            // 5. KUNG TAMA ANG LAHAT: I-save ang session at mag-redirect sa homepage
            localStorage.setItem('unifit_isLoggedIn', 'true');
            localStorage.setItem('unifit_registered_email', foundUser.email);
            localStorage.setItem('unifit_registered_name', (foundUser.firstName || '') + " " + (foundUser.lastName || ''));
            localStorage.setItem('unifit_registered_contact', foundUser.contactNumber || '');
            localStorage.setItem('currentUser', JSON.stringify(foundUser));

            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 600);
        });
    }
});


                /* GET REGISTERED ACCOUNT */

                const savedAccount =
                    localStorage.getItem(
                        "unifitUser"
                    );


                if (!savedAccount) {

                    alert(
                        "No account found. Please create an account first."
                    );

                    return;
                }


                const user =
                    JSON.parse(
                        savedAccount
                    );


                /* CHECK LOGIN */

                if (
                    user.email === email &&
                    user.password === password
                ) {

                    /* SAVE LOGIN SESSION */

                    localStorage.setItem(
                        "unifitLoggedIn",
                        "true"
                    );


                    localStorage.setItem(
    "unifitCurrentUser",
    JSON.stringify({

        firstName:
            user.firstName,

        lastName:
            user.lastName,

        contactNumber:
            user.contactNumber,

        email:
            user.email

    })
);


                    alert(
                        "Welcome back, " +
                        user.firstName +
                        "!"
                    );


                    /* REDIRECT HOME */

                    window.location.href =
                        "index.html";

                }

                else {

                    alert(
                        "Incorrect email or password."
                    );

                }

            }
        );

    }

})();

/* =========================================================
   USER PROFILE
========================================================= */

(function () {

    const profileName =
        document.getElementById(
            "profileName"
        );

    const profileFullName =
        document.getElementById(
            "profileFullName"
        );

    const profileContact =
        document.getElementById(
            "profileContact"
        );

    const profileEmail =
        document.getElementById(
            "profileEmail"
        );

    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    /*
        Only run this code on profile.html
    */

    if (!profileName) {
        return;
    }


    /* =============================================
       GET CURRENT USER
    ============================================== */

    let currentUser = null;


    try {

        currentUser =
            JSON.parse(
                localStorage.getItem(
                    "unifitCurrentUser"
                )
            );

    }

    catch (error) {

        currentUser = null;

    }


    /* =============================================
       NOT LOGGED IN
    ============================================== */

    if (!currentUser) {

        profileName.textContent =
            "Not Available";

        if (profileContact) {

            profileContact.textContent =
                "Not Available";

        }

        if (profileEmail) {

            profileEmail.textContent =
                "Not Available";

        }

        return;

    }


    /* =============================================
       FULL NAME
    ============================================== */

    const fullName =
        (
            (currentUser.firstName || "") +
            " " +
            (currentUser.lastName || "")
        ).trim();


    profileName.textContent =
        fullName || "Not Available";


    if (profileFullName) {

        profileFullName.textContent =
            fullName || "Student Profile";

    }


    /* =============================================
       CONTACT NUMBER
    ============================================== */

    if (profileContact) {

        profileContact.textContent =
            currentUser.contactNumber ||
            "Not Available";

    }


    /* =============================================
       EMAIL
    ============================================== */

    if (profileEmail) {

        profileEmail.textContent =
            currentUser.email ||
            "Not Available";

    }


    /* =============================================
       AVATAR
    ============================================== */

    if (profileAvatar) {

        const firstLetter =
            currentUser.firstName
                ? currentUser.firstName
                    .charAt(0)
                    .toUpperCase()
                : "U";


        profileAvatar.textContent =
            firstLetter;

    }


    /* =============================================
       LOGOUT
    ============================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "unifitLoggedIn"
                );

                localStorage.removeItem(
                    "unifitCurrentUser"
                );


                alert(
                    "You have been logged out."
                );


                window.location.href =
                    "login.html";

            }
        );

    }

})();

/* =========================================================
   MY ORDERS FILTER
========================================================= */

const orderFilterButtons =
    document.querySelectorAll(".order-filter");

const orderCards =
    document.querySelectorAll(".order-card");

const ordersEmpty =
    document.getElementById("ordersEmpty");


orderFilterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const selectedFilter =
                    button.dataset.filter;


                /* ACTIVE BUTTON */

                orderFilterButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                let visibleOrders = 0;


                /* FILTER ORDERS */

                orderCards.forEach(
                    function (order) {

                        const status =
                            order.dataset.status;


                        if (
                            selectedFilter === "all" ||
                            status === selectedFilter
                        ) {

                            order.style.display =
                                "block";

                            visibleOrders++;

                        }

                        else {

                            order.style.display =
                                "none";

                        }

                    }
                );


                /* EMPTY MESSAGE */

                if (ordersEmpty) {

                    if (visibleOrders === 0) {

                        ordersEmpty.classList.add(
                            "show"
                        );

                    }

                    else {

                        ordersEmpty.classList.remove(
                            "show"
                        );

                    }

                }

            }
        );

    }
);

/* =========================================================
   GLOBAL CART COUNT
========================================================= */

function updateUniFitCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem(
                "unifitCart"
            )
        ) || [];


    let totalQuantity = 0;


    cart.forEach(
        function (item) {

            totalQuantity +=
                item.quantity;

        }
    );


    const cartCountElements =
        document.querySelectorAll(
            ".cart-count"
        );


    cartCountElements.forEach(
        function (element) {

            element.textContent =
                totalQuantity;

        }
    );

}


/* LOAD COUNT ON EVERY PAGE */

updateUniFitCartCount();

/* =========================================================
   PRODUCT DETAILS
========================================================= */

(function () {

    const productImage =
        document.getElementById("detailProductImage");

    /*
       Stop if we are not on product-details.html
    */

    if (!productImage) {
        return;
    }


    /* =====================================================
       PRODUCTS DATABASE - FRONT END DEMO
    ====================================================== */

    const products = {

        "mens-top": {

            name:
                "Men's School Uniform Top",

            category:
                "School Uniform",

            price:
                450,

            image:
                "assets/images/mens-pink-brown-uniform-top.png",

            description:
                "A comfortable school uniform top designed for everyday class use.",

            sizes:
                ["S", "M", "L", "XL"],

            fabric:
                true,

            fabricName:
                "Pink",

            fabricDescription:
                "Men's Uniform Top Fabric",

            fabricImage:
                "assets/images/fabric-pink.png"

        },


        "mens-pants": {

            name:
                "Men's School Uniform Pants",

            category:
                "School Uniform",

            price:
                500,

            image:
                "assets/images/mens-dark-brown-straight-slacks.png",

            description:
                "Dark brown school uniform pants designed for a comfortable and proper school fit.",

            sizes:
                ["S", "M", "L", "XL"],

            fabric:
                true,

            fabricName:
                "Black",

            fabricDescription:
                "Men's Slacks Fabric",

            fabricImage:
                "assets/images/fabric-black.png"

        },


        "pe-top": {

            name:
                "PE Uniform Top",

            category:
                "PE Uniform",

            price:
                350,

            image:
                "assets/images/pe-top-yellow-white.png",

            description:
                "Lightweight PE uniform top suitable for physical education classes and school activities.",

            sizes:
                ["S", "M", "L", "XL"],

            fabric:
                false

        },


        "pe-pants": {

            name:
                "PE Jogger Pants",

            category:
                "PE Uniform",

            price:
                400,

            image:
                "assets/images/pe-jogger-pants-black-yellow.png",

            description:
                "Comfortable PE jogger pants designed for movement and physical activities.",

            sizes:
                ["S", "M", "L", "XL"],

            fabric:
                false

        },


        "id-lace": {

            name:
                "School ID Lace",

            category:
                "ID Essentials",

            price:
                100,

            image:
                "assets/images/escr-id-lace-red-holder.png",

            description:
                "Official-style school ID lace for carrying your student identification card.",

            sizes:
                ["One Size"],

            fabric:
                false

        },


        "patch": {

            name:
                "School Uniform Patch",

            category:
                "Accessories",

            price:
                50,

            image:
                "assets/images/escr-stacked-patches.png",

            description:
                "School uniform patch designed for placement on the approved school uniform.",

            sizes:
                ["Standard"],

            fabric:
                false

        },


        "belt": {

            name:
                "School Uniform Belt",

            category:
                "Accessories",

            price:
                150,

            image:
                "assets/images/dark-brown-white-buckle-belt.png",

            description:
                "Adjustable school uniform belt designed to complement the standard uniform.",

            sizes:
                ["Adjustable"],

            fabric:
                false

        },


        "ribbon": {

            name:
                "School Uniform Ribbon",

            category:
                "Accessories",

            price:
                80,

            image:
                "assets/images/flat-brown-cloth-ribbon.png",

            description:
                "School uniform ribbon designed to complete the required uniform look.",

            sizes:
                ["One Size"],

            fabric:
                false

        }

    };


    /* =====================================================
       GET PRODUCT FROM URL
    ====================================================== */

    const urlParameters =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        urlParameters.get("id") ||
        "mens-top";


    const product =
        products[productId] ||
        products["mens-top"];



    /* =====================================================
       ELEMENTS
    ====================================================== */

    const productName =
        document.getElementById(
            "detailProductName"
        );


    const productCategory =
        document.getElementById(
            "detailProductCategory"
        );


    const productPrice =
        document.getElementById(
            "detailProductPrice"
        );


    const productDescription =
        document.getElementById(
            "detailProductDescription"
        );


    const breadcrumbProduct =
        document.getElementById(
            "breadcrumbProduct"
        );


    const sizeOptions =
        document.getElementById(
            "productSizeOptions"
        );


    const selectedSizeText =
        document.getElementById(
            "selectedSizeText"
        );


    const fabricGroup =
        document.getElementById(
            "productFabricGroup"
        );


    const fabricImage =
        document.getElementById(
            "detailFabricImage"
        );


    const fabricName =
        document.getElementById(
            "detailFabricName"
        );


    const fabricDescription =
        document.getElementById(
            "detailFabricDescription"
        );


    const quantityElement =
        document.getElementById(
            "detailQuantity"
        );


    const minusButton =
        document.getElementById(
            "detailQuantityMinus"
        );


    const plusButton =
        document.getElementById(
            "detailQuantityPlus"
        );


    const addToCartButton =
        document.getElementById(
            "detailAddToCart"
        );


    const buyNowButton =
        document.getElementById(
            "detailBuyNow"
        );


    const addedMessage =
        document.getElementById(
            "productAddedMessage"
        );



    /* =====================================================
       LOAD PRODUCT
    ====================================================== */

    productImage.src =
        product.image;

    productImage.alt =
        product.name;


    productName.textContent =
        product.name;


    productCategory.textContent =
        product.category;


    productPrice.textContent =
        "₱" +
        product.price.toFixed(2);


    productDescription.textContent =
        product.description;


    breadcrumbProduct.textContent =
        product.name;


    document.title =
        product.name +
        " | UniFit";



    /* =====================================================
       FABRIC
    ====================================================== */

    if (product.fabric) {

        fabricGroup.style.display =
            "block";


        fabricImage.src =
            product.fabricImage;


        fabricName.textContent =
            product.fabricName;


        fabricDescription.textContent =
            product.fabricDescription;

    }

    else {

        fabricGroup.style.display =
            "none";

    }



    /* =====================================================
       SIZE OPTIONS
    ====================================================== */

    let selectedSize = "";


    sizeOptions.innerHTML = "";


    product.sizes.forEach(
        function (size) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "product-size-button";


            button.textContent =
                size;


            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".product-size-button"
                        )
                        .forEach(
                            function (item) {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    button.classList.add(
                        "selected"
                    );


                    selectedSize =
                        size;


                    selectedSizeText.textContent =
                        "Selected size: " +
                        size;

                }
            );


            sizeOptions.appendChild(
                button
            );

        }
    );



    /* =====================================================
       QUANTITY
    ====================================================== */

    let quantity = 1;


    plusButton.addEventListener(
        "click",
        function () {

            quantity++;

            quantityElement.textContent =
                quantity;

        }
    );


    minusButton.addEventListener(
        "click",
        function () {

            if (quantity > 1) {

                quantity--;

                quantityElement.textContent =
                    quantity;

            }

        }
    );



    /* =====================================================
       ADD TO CART

     
    ====================================================== */

   addToCartButton.addEventListener(
    "click",
    function () {

        /* ---------------------------------------------
           REQUIRE SIZE
        --------------------------------------------- */

        if (!selectedSize) {

            alert(
                "Please select a size first."
            );

            return;
        }


        /* ---------------------------------------------
           GET EXISTING CART
        --------------------------------------------- */

        let cart =
            JSON.parse(
                localStorage.getItem(
                    "unifitCart"
                )
            ) || [];


        /* ---------------------------------------------
           CREATE CART ITEM
        --------------------------------------------- */

        const cartItem = {

            id:
                productId,

            name:
                product.name,

            category:
                product.category,

            price:
                product.price,

            image:
                product.image,

            size:
                selectedSize,

            quantity:
                quantity,

            fabric:
                product.fabric
                    ? product.fabricName
                    : ""

        };


        /* ---------------------------------------------
           CHECK IF SAME PRODUCT ALREADY EXISTS
        --------------------------------------------- */

        const existingItem =
            cart.find(
                function (item) {

                    return (
                        item.id === cartItem.id &&
                        item.size === cartItem.size &&
                        item.fabric === cartItem.fabric
                    );

                }
            );


        /* ---------------------------------------------
           ADD QUANTITY OR NEW ITEM
        --------------------------------------------- */

        if (existingItem) {

            existingItem.quantity +=
                cartItem.quantity;

        }

        else {

            cart.push(
                cartItem
            );

        }


        /* ---------------------------------------------
           SAVE CART
        --------------------------------------------- */

        localStorage.setItem(
            "unifitCart",
            JSON.stringify(cart)
        );


        /* ---------------------------------------------
           UPDATE CART COUNT
        --------------------------------------------- */

        updateUniFitCartCount();


        /* ---------------------------------------------
           SHOW MESSAGE
        --------------------------------------------- */

        addedMessage.textContent =
            product.name +
            " added to your cart.";


        addedMessage.classList.add(
            "show"
        );


        /* ---------------------------------------------
           GO TO CART
        --------------------------------------------- */

        setTimeout(
            function () {

                window.location.href =
                    "cart.html";

            },
            600
        );

    }
);

    /* =====================================================
       BUY NOW
    ====================================================== */

    buyNowButton.addEventListener(
        "click",
        function () {

            if (!selectedSize) {

                alert(
                    "Please select a size first."
                );

                return;
            }


            window.location.href =
                "checkout.html";

        }
    );

})();

/* =========================================================
   UNIFIT CHECKOUT
========================================================= */

(function () {

    const checkoutForm =
        document.getElementById("checkoutForm");


    /*
        Only run on checkout.html
    */

    if (!checkoutForm) {
        return;
    }



    const checkoutProducts =
        document.getElementById("checkoutProducts");

    const checkoutSubtotal =
        document.getElementById("checkoutSubtotal");

    const checkoutDiscount =
        document.getElementById("checkoutDiscount");

    const checkoutTotal =
        document.getElementById("checkoutTotal");

    const checkoutSuccess =
        document.getElementById("checkoutSuccess");

    const checkoutOrderNumber =
        document.getElementById("checkoutOrderNumber");



    /* =====================================================
       GET CART
    ====================================================== */

    function getCheckoutCart() {

        try {

            const cart =
                JSON.parse(
                    localStorage.getItem(
                        "unifitCart"
                    )
                );


            return Array.isArray(cart)
                ? cart
                : [];

        }

        catch (error) {

            return [];

        }

    }



    /* =====================================================
       FORMAT PESO
    ====================================================== */

    function checkoutPeso(value) {

        const number =
            Number(value) || 0;


        return (
            "₱" +
            number.toLocaleString(
                "en-PH",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
        );

    }



    /* =====================================================
       LOAD CUSTOMER
    ====================================================== */

    let currentUser = null;
    try {
        currentUser = JSON.parse(
            localStorage.getItem("unifitCurrentUser") || "null"
        );
    } catch (error) {
        currentUser = null;
    }


    if (currentUser) {

        const nameInput =
            document.getElementById(
                "checkoutName"
            );

        const emailInput =
            document.getElementById(
                "checkoutEmail"
            );

        const phoneInput =
            document.getElementById(
                "checkoutPhone"
            );


        if (nameInput) {

            nameInput.value =
                (
                    currentUser.firstName +
                    " " +
                    currentUser.lastName
                ).trim();

        }


        if (emailInput) {

            emailInput.value =
                currentUser.email || "";

        }

        if (phoneInput) {

            phoneInput.value =
                currentUser.contactNumber || "";

}

    }



    /* =====================================================
       RENDER ORDER SUMMARY
    ====================================================== */

    function renderCheckout() {

        const cart =
            getCheckoutCart();


        checkoutProducts.innerHTML =
            "";


        let subtotal = 0;



        cart.forEach(
            function (item) {

                const price =
                    Number(item.price) || 0;


                const quantity =
                    Number(item.quantity) || 1;


                const lineTotal =
                    price * quantity;


                subtotal +=
                    lineTotal;



                const product =
                    document.createElement(
                        "div"
                    );


                product.className =
                    "checkout-product-item";


                let fabricText = "";


                if (item.fabric) {

                    fabricText =
                        " • " +
                        item.fabric;

                }


                product.innerHTML = `

                    <div class="checkout-product-image">

                        <img
                            src="${item.image}"
                            alt="${item.name}">

                    </div>


                    <div class="checkout-product-info">

                        <h4>
                            ${item.name}
                        </h4>

                        <p>
                            ${item.size}
                            ${fabricText}
                            • Qty ${quantity}
                        </p>

                    </div>


                    <strong class="checkout-product-price">

                        ${checkoutPeso(lineTotal)}

                    </strong>

                `;


                checkoutProducts.appendChild(
                    product
                );

            }
        );



        /* GET SAVED COUPON */

        const couponPercent =
            Number(
                localStorage.getItem(
                    "unifitCouponPercent"
                )
            ) || 0;


        const discount =
            subtotal *
            (
                couponPercent /
                100
            );


        const total =
            subtotal -
            discount;



        checkoutSubtotal.textContent =
            checkoutPeso(subtotal);


        checkoutDiscount.textContent =
            discount > 0
                ? "- " +
                  checkoutPeso(discount)
                : checkoutPeso(0);


        checkoutTotal.textContent =
            checkoutPeso(total);



        /*
            Don't allow checkout
            if cart is empty
        */

        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );


            window.location.href =
                "products.html";

        }

    }



    /* =====================================================
       PLACE ORDER
    ====================================================== */

    function compressReceipt(file) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onerror = function () { reject(new Error("Unable to read receipt.")); };
            reader.onload = function () {
                const image = new Image();
                image.onerror = function () { reject(new Error("Invalid receipt image.")); };
                image.onload = function () {
                    const maxSide = 1200;
                    const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
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

    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const cart =
                getCheckoutCart();


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }



            const fullName =
                document
                    .getElementById(
                        "checkoutName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "checkoutEmail"
                    )
                    .value
                    .trim();

            const notes =
                document
                    .getElementById("checkoutNotes")
                    .value
                    .trim();

                    const phone =
            document
                .getElementById(
                    "checkoutPhone"
                )
                .value
                .trim();


            const gcashReference =
    document
        .getElementById(
            "gcashReference"
        )
        .value
        .trim();


const gcashReceipt =
    document
        .getElementById(
            "gcashReceipt"
        );


const gcashPaidConfirmation =
    document
        .getElementById(
            "gcashPaidConfirmation"
        );

/* =================================================
   VALIDATE GCASH PAYMENT
================================================= */

if (gcashReference === "") {

    alert(
        "Please enter your GCash reference number."
    );

    return;
}


if (
    !gcashReceipt.files ||
    gcashReceipt.files.length === 0
) {

    alert(
        "Please upload your GCash payment receipt."
    );

    return;
}


if (!gcashPaidConfirmation.checked) {

    alert(
        "Please confirm that you have completed the GCash payment."
    );

    return;
}

            const receiptFile = gcashReceipt.files[0];
            if (!/^image\/(png|jpe?g)$/i.test(receiptFile.type)) {
                alert("Receipt must be a PNG or JPG image.");
                return;
            }
            if (receiptFile.size > 8 * 1024 * 1024) {
                alert("Receipt image must be 8 MB or smaller.");
                return;
            }

            let paymentReceiptData = "";
            try {
                paymentReceiptData = await compressReceipt(receiptFile);
            } catch (error) {
                alert(error.message || "Unable to process the payment receipt.");
                return;
            }

            /* =================================================
               CALCULATE ORDER
            ================================================= */

            let subtotal = 0;


            cart.forEach(
                function (item) {

                    subtotal +=
                        (Number(item.price) || 0) *
                        (Number(item.quantity) || 1);

                }
            );


            const couponPercent =
                Number(
                    localStorage.getItem(
                        "unifitCouponPercent"
                    )
                ) || 0;


            const discount =
                subtotal *
                (
                    couponPercent /
                    100
                );


            const total =
                subtotal -
                discount;



            /* =================================================
               GENERATE ORDER NUMBER
            ================================================= */

            const year =
                new Date()
                    .getFullYear();


            const uniqueNumber =
                Date.now()
                    .toString()
                    .slice(-6);


            const orderNumber =
                "UF-" +
                year +
                "-" +
                uniqueNumber;



            /* =================================================
               ORDER OBJECT
            ================================================= */

            const newOrder = {

                studentId:
                    currentUser && currentUser.id ? currentUser.id : "",

                orderNumber:
                    orderNumber,

                orderDate:
                    new Date()
                        .toISOString(),

                customer: {

                    fullName:
                        fullName,

                    email:
                        email,

                    phone:
                        phone

                },

                fulfillment:
                    "School Pickup",

                payment:
                  "GCash",

                paymentReference:
                  gcashReference,

                  paymentReceiptName:
                    gcashReceipt.files[0].name,

                  paymentReceiptData:
                    paymentReceiptData,

                  paymentStatus:
                    "For Verification",

                notes:
                    notes,

                items:
                    cart,

                subtotal:
                    subtotal,

                discount:
                    discount,

                total:
                    total,

                status:
                    "Payment Verification"

            };



                    /* =================================================
                    SAVE ORDER
                    ================================================= */

                    let previousOrders = [];

                    try {
                        const savedOrders = JSON.parse(
                            localStorage.getItem("unifitOrders") || "[]"
                        );
                        previousOrders = Array.isArray(savedOrders)
                            ? savedOrders
                            : [];
                    } catch (error) {
                        previousOrders = [];
                    }


                    previousOrders.unshift(
                        newOrder
                    );


                    localStorage.setItem(
                        "unifitOrders",
                        JSON.stringify(
                            previousOrders
                        )
                    );

                    /* =================================================
        MARK STUDENT10 AS USED
        ================================================= */

        const usedCouponCode =
            localStorage.getItem(
                "unifitCouponCode"
            );


        const loggedInUser =
            JSON.parse(
                localStorage.getItem(
                    "unifitCurrentUser"
                ) || "null"
            );


        if (
            usedCouponCode === "STUDENT10" &&
            loggedInUser &&
            loggedInUser.email &&
            discount > 0
        ) {

            const usedStudent10 =
                JSON.parse(
                    localStorage.getItem(
                        "unifitUsedStudent10"
                    ) || "[]"
                );


            const userEmail =
                loggedInUser.email
                    .trim()
                    .toLowerCase();


            if (!usedStudent10.includes(userEmail)) {

                usedStudent10.push(
                    userEmail
                );

            }


            localStorage.setItem(
                "unifitUsedStudent10",
                JSON.stringify(
                    usedStudent10
                )
            );

        }



            /* =================================================
               CLEAR CART
            ================================================= */

            localStorage.removeItem(
                "unifitCart"
            );


            localStorage.removeItem(
                "unifitCouponPercent"
            );

            localStorage.removeItem(
                "unifitCouponCode"
            );


            if (
                typeof updateUniFitCartCount ===
                "function"
            ) {

                updateUniFitCartCount();

            }



            /* =================================================
               SUCCESS SCREEN
            ================================================= */

            document
                .querySelector(
                    ".unifit-checkout-layout"
                )
                .style.display =
                    "none";


            checkoutOrderNumber.textContent =
                orderNumber;


            checkoutSuccess.classList.add(
                "show"
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );



    /* =====================================================
       INITIAL
    ====================================================== */

    renderCheckout();

})();

/* =========================================================
   UNIFORM SET SIZE AND PRICE
========================================================= */

(function () {

    const uniformSetCards =
        document.querySelectorAll(
            ".uniform-set-card"
        );


    uniformSetCards.forEach(
        function (card) {

            const sizeButtons =
                card.querySelectorAll(
                    ".set-size-button"
                );


            const priceElement =
                card.querySelector(
                    ".set-current-price"
                );


            sizeButtons.forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            /* REMOVE OLD SELECTION */

                            sizeButtons.forEach(
                                function (item) {

                                    item.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                            /* SELECT CLICKED SIZE */

                            button.classList.add(
                                "selected"
                            );


                            /* GET PRICE */

                            const price =
                                Number(
                                    button.dataset.price
                                );


                            /* UPDATE PRICE */

                            if (priceElement) {

                                priceElement.textContent =
                                    "₱" +
                                    price.toLocaleString(
                                        "en-PH",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }
                                    );

                            }

                        }
                    );

                }
            );

        }
    );

})();

/* =========================================================
   UNIFORM SET - ADD TO CART
========================================================= */

(function () {

    const uniformSetCards =
        document.querySelectorAll(
            ".uniform-set-card"
        );


    uniformSetCards.forEach(
        function (card) {

            const addButton =
                card.querySelector(
                    ".set-button"
                );


            if (!addButton) {
                return;
            }


            addButton.addEventListener(
                "click",
                function () {

                    /* GET SELECTED SIZE */

                    const selectedSizeButton =
                        card.querySelector(
                            ".set-size-button.selected"
                        );


                    if (!selectedSizeButton) {

                        alert(
                            "Please select a size first."
                        );

                        return;

                    }


                    /* GET SET INFORMATION */

                    const setId =
                        card.dataset.setId;


                    const setName =
                        card.querySelector("h3")
                            .textContent
                            .trim();


                    const setImage =
                        card.querySelector(
                            ".uniform-set-image img"
                        );


                    const size =
                        selectedSizeButton
                            .dataset.size;


                    const price =
                        Number(
                            selectedSizeButton
                                .dataset.price
                        );


                    /* GET EXISTING CART */

                    let cart =
                        JSON.parse(
                            localStorage.getItem(
                                "unifitCart"
                            )
                        ) || [];


                    /* CREATE CART ITEM */

                    const cartItem = {

                        id:
                            setId,

                        name:
                            setName,

                        category:
                            "Uniform Set",

                        price:
                            price,

                        image:
                            setImage
                                ? setImage.getAttribute("src")
                                : "",

                        size:
                            size,

                        quantity:
                            1,

                        fabric:
                            ""

                    };


                    /* CHECK IF SAME SET + SIZE EXISTS */

                    const existingItem =
                        cart.find(
                            function (item) {

                                return (
                                    item.id === cartItem.id &&
                                    item.size === cartItem.size
                                );

                            }
                        );


                    if (existingItem) {

                        existingItem.quantity += 1;

                    }

                    else {

                        cart.push(
                            cartItem
                        );

                    }


                    /* SAVE CART */

                    localStorage.setItem(
                        "unifitCart",
                        JSON.stringify(cart)
                    );


                    /* UPDATE NAVBAR CART NUMBER */

                    if (
                        typeof updateUniFitCartCount ===
                        "function"
                    ) {

                        updateUniFitCartCount();

                    }


                    alert(
                        setName +
                        " - Size " +
                        size +
                        " added to cart."
                    );


                    /* GO TO CART */

                    window.location.href =
                        "cart.html";

                }
            );

        }
    );

})();

/* =========================================================
   SPORTSFEST - SIZE SELECTION + ADD TO CART
========================================================= */

(function () {

    const sportsfestCards =
        document.querySelectorAll(
            ".sportsfest-card, .sportsfest-option-card"
        );


    sportsfestCards.forEach(
        function (card) {

            const sizeButtons =
                card.querySelectorAll(
                    ".sportsfest-size-button"
                );


            const addButton =
                card.querySelector(
                    ".sportsfest-button"
                );


            /* =============================================
               SIZE SELECTION
            ============================================== */

            sizeButtons.forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            sizeButtons.forEach(
                                function (item) {

                                    item.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                            button.classList.add(
                                "selected"
                            );

                        }
                    );

                }
            );


            /* =============================================
               ADD TO CART
            ============================================== */

            if (!addButton) {
                return;
            }


            addButton.addEventListener(
                "click",
                function () {

                    const selectedSizeButton =
                        card.querySelector(
                            ".sportsfest-size-button.selected"
                        );


                    /* REQUIRE SIZE */

                    if (!selectedSizeButton) {

                        alert(
                            "Please select a size first."
                        );

                        return;

                    }


                    const size =
                        selectedSizeButton.dataset.size;


                    const productName =
                        card.querySelector("h3")
                            .textContent
                            .trim();


                    /* GET TEAM */

                    const teamSection =
                        card.closest(
                            ".sportsfest-team-section"
                        );


                    let teamName =
                        "Sportsfest";


                    if (teamSection) {

                        const teamHeading =
                            teamSection.querySelector(
                                ".sportsfest-team-heading h2"
                            );


                        if (teamHeading) {

                            teamName =
                                teamHeading
                                    .textContent
                                    .trim();

                        }

                    }


                    /* GET PRICE */

                    let price = 0;


                    if (
                        productName
                            .toLowerCase()
                            .includes(
                                "basketball jersey"
                            )
                    ) {

                        price = 750;

                    }

                    else if (
                        productName
                            .toLowerCase()
                            .includes(
                                "upper jersey"
                            )
                    ) {

                        price = 500;

                    }


                    /* GET IMAGE */

                    let image = "";


                    if (teamSection) {

                        const teamImage =
                            teamSection.querySelector(
                                ".sportsfest-team-image img"
                            );


                        if (teamImage) {

                            image =
                                teamImage.getAttribute(
                                    "src"
                                );

                        }

                    }


                    /* CREATE ID */

                    const productId =
                        (
                            teamName +
                            "-" +
                            productName
                        )
                            .toLowerCase()
                            .replace(
                                /[^a-z0-9]+/g,
                                "-"
                            )
                            .replace(
                                /^-|-$|/g,
                                ""
                            );


                    /* GET CART */

                    let cart =
                        JSON.parse(
                            localStorage.getItem(
                                "unifitCart"
                            )
                        ) || [];


                    const cartItem = {

                        id:
                            productId,

                        name:
                            teamName +
                            " - " +
                            productName,

                        category:
                            "Sportsfest Uniform",

                        price:
                            price,

                        image:
                            image,

                        size:
                            size,

                        quantity:
                            1,

                        fabric:
                            ""

                    };


                    /* CHECK SAME ITEM */

                    const existingItem =
                        cart.find(
                            function (item) {

                                return (
                                    item.id ===
                                        cartItem.id &&
                                    item.size ===
                                        cartItem.size
                                );

                            }
                        );


                    if (existingItem) {

                        existingItem.quantity += 1;

                    }

                    else {

                        cart.push(
                            cartItem
                        );

                    }


                    /* SAVE */

                    localStorage.setItem(
                        "unifitCart",
                        JSON.stringify(cart)
                    );


                    /* UPDATE CART COUNT */

                    if (
                        typeof updateUniFitCartCount ===
                        "function"
                    ) {

                        updateUniFitCartCount();

                    }


                    alert(
                        teamName +
                        " " +
                        productName +
                        " - Size " +
                        size +
                        " added to cart."
                    );


                    window.location.href =
                        "cart.html";

                }
            );

        }
    );

})();

const passwordToggleBtn = document.querySelector('.password-toggle');
const passwordInput = document.getElementById('loginPassword');

if (passwordToggleBtn && passwordInput) {
    passwordToggleBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordToggleBtn.classList.add('showing');
        } else {
            passwordInput.type = 'password';
            passwordToggleBtn.classList.remove('showing');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('unifit_isLoggedIn');

    // Hanapin ang Login at Profile links sa navbar
    const loginLink = document.querySelector('a[href="login.html"]');
    const profileLink = document.querySelector('a[href="profile.html"]');

    // --- 1. NAVBAR DYNAMIC DISPLAY ---
    if (isLoggedIn === 'true') {
        if (loginLink) {
            const loginItem = loginLink.closest('li') || loginLink;
            loginItem.style.setProperty('display', 'none', 'important');
        }
        if (profileLink) {
            const profileItem = profileLink.closest('li') || profileLink;
            profileItem.style.removeProperty('display');
        }
    } else {
        if (loginLink) {
            const loginItem = loginLink.closest('li') || loginLink;
            loginItem.style.removeProperty('display');
        }
        if (profileLink) {
            const profileItem = profileLink.closest('li') || profileLink;
            profileItem.style.setProperty('display', 'none', 'important');
        }
    }

    // --- 2. LOGOUT LOGIC WITH OVERLAY (Para sa profile.html) ---
    const logoutBtn = document.getElementById('logoutButton') || document.getElementById('logoutBtn');
    const logoutOverlay = document.getElementById('logoutOverlay');
    const logoutPercentage = document.getElementById('logoutPercentage');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (logoutOverlay) {
                logoutOverlay.style.display = 'flex';
                let currentProgress = 1;
                if (logoutPercentage) logoutPercentage.textContent = '1%';

                let logoutInterval = setInterval(function() {
                    if (currentProgress >= 100) {
                        clearInterval(logoutInterval);
                        localStorage.removeItem('unifit_isLoggedIn');
                        document.body.classList.add('fade-out');
                        setTimeout(function() {
                            window.location.href = 'index.html';
                        }, 600);
                    } else {
                        currentProgress++;
                        if (logoutPercentage) logoutPercentage.textContent = currentProgress + '%';
                    }
                }, 40);
            } else {
                localStorage.removeItem('unifit_isLoggedIn');
                window.location.href = 'index.html';
            }
        });
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const passwordToggleButtons = document.querySelectorAll(".password-toggle");

    passwordToggleButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            // Kunin ang target gamit ang data-target, o hanapin sa malapit na container
            const targetId = button.getAttribute("data-target");
            let passwordInput = targetId ? document.getElementById(targetId) : null;
            
            if (!passwordInput) {
                const container = button.closest(".form-group") || button.closest(".password-field") || button.parentElement;
                passwordInput = container ? container.querySelector("input[type='password'], input[type='text']") : null;
            }

            if (!passwordInput) return;

            const eyeClosed = button.querySelector(".eye-closed");
            const eyeOpen = button.querySelector(".eye-open");

            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                if (eyeClosed) eyeClosed.style.setProperty("display", "none", "important");
                if (eyeOpen) eyeOpen.style.setProperty("display", "block", "important");
            } else {
                passwordInput.type = "password";
                if (eyeClosed) eyeClosed.style.setProperty("display", "block", "important");
                if (eyeOpen) eyeOpen.style.setProperty("display", "none", "important");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const unifitLoginForm = document.getElementById("loginForm");

    if (unifitLoginForm) {
        unifitLoginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            const emailInput = document.getElementById("loginEmail");
            const passwordInput = document.getElementById("loginPassword");

            const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
            const password = passwordInput ? passwordInput.value : "";

            // 1. Check kung walang laman
            if (email === "" || password === "") {
                alert("Please enter your email and password.");
                return;
            }

            // 2. Kunin ang listahan ng lahat ng rehistradong accounts mula sa localStorage
            const savedUsers = localStorage.getItem("unifitUsers");

            if (!savedUsers) {
                alert("No account found. Please register first.");
                return;
            }

            const usersArray = JSON.parse(savedUsers);

            // 3. Hanapin kung nag-e-exist ang email sa listahan
            const foundUser = usersArray.find(user => user.email.toLowerCase() === email);

            if (!foundUser) {
                // Kapag walang kaparehong email sa database/localStorage
                alert("No account found. Please register first.");
                return;
            }

            // 4. I-check kung tama ang password para sa email na 'yon
            if (foundUser.password !== password) {
                // Kapag rehistrado ang email pero mali ang password
                alert("Wrong Password");
                return;
            }

            // 5. KUNG TAMA ANG LAHAT: I-save ang active session at mag-redirect
            localStorage.setItem('unifit_isLoggedIn', 'true');
            localStorage.setItem('unifit_registered_email', foundUser.email);
            localStorage.setItem('unifit_registered_name', (foundUser.firstName || '') + " " + (foundUser.lastName || ''));
            localStorage.setItem('unifit_registered_contact', foundUser.contactNumber || '');
            localStorage.setItem('currentUser', JSON.stringify(foundUser));

            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 600);
        });
    }
});

const registerForm = document.getElementById("registerForm"); // O kung ano man ang ID ng form mo sa register.html

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // 1. Kunin ang mga nilagay ng user sa inputs
        const firstName = document.getElementById("regFirstName").value.trim();
        const lastName = document.getElementById("regLastName").value.trim();
        const email = document.getElementById("regEmail").value.trim().toLowerCase();
        const password = document.getElementById("regPassword").value;
        const contactNumber = document.getElementById("regContact").value.trim();

        // (Opsyonal dito ang validation kung may blangko o kung tugma ang passwords)

        // 2. DITO MO ILALAGAY ANG CODE NA IBINIGAY MO:
        let users = JSON.parse(localStorage.getItem("unifitUsers")) || [];

        const newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            contactNumber: contactNumber
        };

        users.push(newUser);

        // I-save ulit sa localStorage
        localStorage.setItem("unifitUsers", JSON.stringify(users));

        // 3. Mag-alert o mag-redirect papunta sa login page pagkatapos mag-register
        alert("Registration successful! You can now log in.");
        window.location.href = "login.html";
    });
}
