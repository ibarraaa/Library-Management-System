
const librarians = [
  // Pre-registered librarians (replace with database in the future)
    { id: "202501", email: "librarian01@example.com" },
    { id: "202502", email: "librarian02@example.com" },
    { id: "202503", email: "librarian03@example.com" }
];


function login() {
  // Handle login
    const librarianId = document.getElementById("librarian-id").value.trim();
    const email = document.getElementById("email").value.trim();
    const errorMessage = document.getElementById("error-message");

    const librarian = librarians.find(l => l.id === librarianId && l.email === email);

    if (!librarian) {
        errorMessage.innerText = "Invalid ID or Email. Please try again.";
    } else {
        localStorage.setItem("librarianId", librarianId);
        localStorage.setItem("librarianEmail", email);
        window.location.href = "dashboard.html"; // Redirect to dashboard
    }
}

// Handle logout
function logout() {
    localStorage.removeItem("librarianId");
    localStorage.removeItem("librarianEmail");
    window.location.href = "index.html";
}

// Check if user is logged in (on dashboard)
function checkLogin() {
    const librarianId = localStorage.getItem("librarianId");
    if (!librarianId) {
        window.location.href = "index.html"; // Redirect if not logged in
    }
}

// Populate dashboard data
function loadDashboardData() {
    const borrowHistory = [
        { id: "2025104", name: "Juan Dela Cruz", course: "BSCS", bookId: "78" },
        { id: "2025110", name: "Maria Santos", course: "BSIT", bookId: "102" },
        { id: "2025122", name: "Pedro Reyes", course: "BSCPE", bookId: "56" }
    ];

    const librarians = [
        { id: "00001", name: "Maria Clara", added: 3, time: "3:56 PM, Mar 23, 2025" },
        { id: "00002", name: "Mary Agape", added: 4, time: "2:06 PM, Mar 23, 2025" }
    ];

    const historyContainer = document.getElementById("history-list");
    const librarianContainer = document.getElementById("librarian-list");

    if (historyContainer) {
        borrowHistory.forEach(entry => {
            const div = document.createElement("div");
            div.classList.add("history-item");
            div.innerHTML = `
                <p><strong>Borrower ID:</strong> ${entry.id}</p>
                <p><strong>Name:</strong> ${entry.name}</p>
                <p><strong>Course:</strong> ${entry.course}</p>
                <p><strong>Book ID:</strong> ${entry.bookId}</p>
            `;
            historyContainer.appendChild(div);
        });
    }

    if (librarianContainer) {
        librarians.forEach(lib => {
            const div = document.createElement("div");
            div.classList.add("librarian-item");
            div.innerHTML = `
                <p><strong>Librarian ID:</strong> ${lib.id}</p>
                <p><strong>Name:</strong> ${lib.name}</p>
                <p>Added <strong>${lib.added}</strong> Borrowers at ${lib.time}</p>
            `;
            librarianContainer.appendChild(div);
        });
    }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("login-btn")) {
        document.getElementById("login-btn").addEventListener("click", login);
    }

    if (document.getElementById("logout-btn")) {
        document.getElementById("logout-btn").addEventListener("click", logout);
    }

    if (window.location.pathname.includes("dashboard.html")) {
        checkLogin();
        loadDashboardData();
    }
});
