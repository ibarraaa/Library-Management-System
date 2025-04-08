
// Login
function login() {
  const email = document.getElementById("email").value;
  if (email) {
    const librarian = { id: Date.now().toString(), name: email };
    localStorage.setItem("librarian", JSON.stringify(librarian));
    window.location.href = "dashboard.html";
  }
}

// Logout
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("librarian");
    window.location.href = "login.html";
  });
}

// Render dashboard data
function renderDashboard() {
  const bh = document.getElementById("borrowing-history");
  const libs = document.getElementById("librarians");

  const borrowers = JSON.parse(localStorage.getItem("borrowers")) || [];
  const librarianLogs = JSON.parse(localStorage.getItem("librarianLogs")) || [];

  if (bh) {
    bh.innerHTML = borrowers.map(b => `
      <div><strong>${b.name}</strong> (ID: ${b.studentId}) - ${b.course}, Book: ${b.bookId}</div>
    `).join('') || "<p>No borrowers yet.</p>";
  }

  if (libs) {
    libs.innerHTML = librarianLogs.map(l => `
      <div>${l.name} added borrower(s) at ${l.timestamp}</div>
    `).join('') || "<p>No librarian logs yet.</p>";
  }
}

renderDashboard();

// Borrower form
const borrowerForm = document.getElementById("borrower-form");
if (borrowerForm) {
  borrowerForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const studentId = document.getElementById("studentId").value;
    const bookId = document.getElementById("bookId").value;
    const course = document.getElementById("course").value;

    const borrower = { name, studentId, bookId, course };
    const borrowers = JSON.parse(localStorage.getItem("borrowers")) || [];
    borrowers.push(borrower);
    localStorage.setItem("borrowers", JSON.stringify(borrowers));

    const librarian = JSON.parse(localStorage.getItem("librarian"));
    const librarianLogs = JSON.parse(localStorage.getItem("librarianLogs")) || [];
    librarianLogs.push({
      name: librarian.name,
      timestamp: new Date().toLocaleString()
    });
    localStorage.setItem("librarianLogs", JSON.stringify(librarianLogs));

    borrowerForm.reset();
    alert("Borrower added!");
    location.reload();
  });

  // Display current borrowers
  const currentBorrowers = document.getElementById("current-borrowers");
  const borrowers = JSON.parse(localStorage.getItem("borrowers")) || [];
  if (currentBorrowers) {
    currentBorrowers.innerHTML = borrowers.map(b => `
      <div><strong>${b.name}</strong> (ID: ${b.studentId}) - ${b.course}, Book: ${b.bookId}</div>
    `).join('') || "<p>No borrowers yet.</p>";
  }
}
