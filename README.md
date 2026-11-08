# UniFit Student Ordering System

UniFit is a frontend-only student ordering system for school uniforms, uniform sets, Sportsfest uniforms, and student essentials. It includes student registration/login, shopping cart and checkout, student order history, and an admin panel for managing orders, students, and sub-admin accounts.

## Technology

- HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage` and `sessionStorage`

There is no backend server and no external SQL/Firebase database. The browser storage acts as the project's local database.

> Important: Students and admins must use the same browser profile and computer to share the same stored accounts and orders. Data does not automatically synchronize to another device or browser.

## Account Connections

### Student accounts

Student registration is handled by:

- Page: `register.html`
- Script: `js/auth.js`
- Storage: `localStorage.unifitStudents`

Each student account contains:

```text
id
firstName
lastName
contactNumber
email
password
role = student
active
createdAt
```

Student login is handled by `login.html` and `js/auth.js`. After a successful login:

- `localStorage.unifitLoggedIn` is set to `true`.
- The logged-in student's safe profile is stored in `localStorage.unifitCurrentUser`.
- The student is redirected to `profile.html`.

There is no predefined student account. A student must first register through `register.html`.

### Admin accounts

Admin login is handled by:

- Page: `admin/admin_login.html`
- Script: `js/admin-auth.js`
- Storage: `localStorage.unifitAdminAccounts`
- Current session: `sessionStorage.unifitAdminSession`

Default main admin:

```text
Email: admin@unifit.com
Password: Admin123
Role: main_admin
```

The main admin can create and activate/deactivate sub-admin accounts on `admin/register_A.html`. Sub-admin accounts are stored in the same `unifitAdminAccounts` collection with the role `sub_admin`.

Main-admin-only elements use the `data-main-admin-only` attribute and are controlled by `js/admin-auth.js`.

## Local Database

The following browser storage keys act as the database:

| Storage key | Purpose |
| --- | --- |
| `unifitStudents` | Registered student accounts |
| `unifitCurrentUser` | Currently logged-in student profile |
| `unifitLoggedIn` | Student login flag |
| `unifitAdminAccounts` | Main admin and sub-admin accounts |
| `unifitAdminSession` | Current admin session in `sessionStorage` |
| `unifitCart` | Current shopping cart |
| `unifitOrders` | All student orders and their statuses |
| `unifitCouponCode` | Currently applied coupon code |
| `unifitCouponPercent` | Currently applied discount percentage |
| `unifitUsedStudent10` | Students who already used `STUDENT10` |

To inspect these values in Chrome, open Developer Tools, choose **Application**, then open **Local Storage** or **Session Storage** for the UniFit page.

## How Accounts Connect to Orders

1. A student registers, creating an entry in `unifitStudents`.
2. Student login creates `unifitCurrentUser`.
3. Products added to the cart are stored in `unifitCart`.
4. Checkout reads the logged-in student from `unifitCurrentUser`.
5. The new order stores both `studentId` and the student's email.
6. The order is added to `unifitOrders`.
7. `js/student-orders.js` filters `unifitOrders` using the logged-in student ID or email.
8. Admin pages read the same `unifitOrders` collection and display all student orders.

The student ID is the primary connection for new orders. Email matching remains as a fallback for older saved orders.

## Order and Payment Flow

```text
Student Checkout
    -> Payment Verification
    -> Admin confirms payment
    -> Pending
    -> Processing
    -> Ready for Pickup
    -> Completed
```

The admin can also:

- Reject a payment with a required rejection note.
- Cancel an order with a required cancellation note.
- Record the admin name and update time for status changes.

If payment is rejected:

1. The student sees the rejection note in My Orders.
2. The student selects **Re-upload Receipt**.
3. The student supplies a new receipt and required note.
4. The order returns to `Payment Verification` / `For Verification`.

Payment receipts are compressed and stored as image data inside the order in `unifitOrders`. New receipts accept PNG/JPG images up to 8 MB before compression.

## Admin Pages

| Page | Purpose |
| --- | --- |
| `admin/dashboard.html` | Order totals and recent orders |
| `admin/orders.html` | Complete order list and order management |
| `admin/products.html` | Orders containing regular products |
| `admin/uniform-sets.html` | Orders containing uniform sets |
| `admin/sportsfest.html` | Orders containing Sportsfest uniforms |
| `admin/students.html` | Registered students and order activity |
| `admin/register_A.html` | Main-admin-only sub-admin management |

Filtered admin pages use the categories stored in each order item:

- Regular products: any category except `Uniform Set` and `Sportsfest Uniform`
- Uniform Sets: `Uniform Set`
- Sportsfest: `Sportsfest Uniform`

## Main JavaScript Files

| File | Responsibility |
| --- | --- |
| `js/app.js` | Store, cart, checkout, products, and shared UI |
| `js/auth.js` | Student registration and login |
| `js/student-guard.js` | Protects student-only pages |
| `js/student-orders.js` | Dynamic student order history and receipt re-upload |
| `js/admin-auth.js` | Admin login, session, and role checks |
| `admin.js` | Admin order list, details, and order actions |
| `js/admin-dashboard.js` | Admin dashboard statistics |
| `js/admin-filtered-orders.js` | Product/Uniform Set/Sportsfest order filters |
| `js/admin-students.js` | Student account list and activation status |
| `js/admin-management.js` | Sub-admin creation and activation status |

## Running the Project

Open `index.html` in a browser, or use a local static server. No package installation or database setup is required.

For a more consistent browser origin, a local static server is recommended:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Data Backup and Reset

Because all data is browser-local, clearing site data will remove registered accounts and orders. Back up important values from browser Local Storage before clearing browser data.

To reset the demo completely, clear the site's Local Storage and Session Storage. The main admin account is recreated automatically the next time the admin login page loads.

## Security Notice

This project is intended as a frontend demonstration. Passwords and roles are stored in browser storage and can be inspected or modified through Developer Tools. It should not be used as a production authentication or payment system without a secure backend and database.
