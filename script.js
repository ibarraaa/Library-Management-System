// Sidebar toggle
function toggleSidebar() {
  const sidebar = document.getElementById('sidebarLinks');
  sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
}

// Librarian accounts
const librarians = [
  { name: "Anna Cruz", email: "anna@ace.edu", id: "10001" },
  { name: "Ben Santos", email: "ben@ace.edu", id: "10002" },
  { name: "Celine Yu", email: "celine@ace.edu", id: "10003" },
  { name: "Dino Reyes", email: "dino@ace.edu", id: "10004" },
  { name: "Ella Torres", email: "ella@ace.edu", id: "10005" },
  { name: "Felix Gomez", email: "felix@ace.edu", id: "10006" },
  { name: "Gina Chan", email: "gina@ace.edu", id: "10007" },
  { name: "Hector Lim", email: "hector@ace.edu", id: "10008" },
  { name: "Ivy Lopez", email: "ivy@ace.edu", id: "10009" },
  { name: "Jake Diaz", email: "jake@ace.edu", id: "10010" }
];

// Preload 100 School Books
function preloadBooks() {
  if (!localStorage.getItem('books')) {
    const books = [];
    const subjects = ["English", "Math", "Science", "History", "Computer Science", "Business", "Education", "Engineering", "Social Science", "Arts"];
    for (let i = 1; i <= 100; i++) {
      books.push({ id: String(i).padStart(3, '0'), title: `${subjects[Math.floor((i-1)/10)]} Book ${i}`, author: `Author ${i}` });
    }
    localStorage.setItem('books', JSON.stringify(books));
  }
}
preloadBooks();

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const id = document.getElementById('id').value;
    const librarian = librarians.find(lib => lib.email === email && lib.id === id);
    
    if (librarian) {
      localStorage.setItem('loggedInLibrarian', JSON.stringify(librarian));
      const logs = JSON.parse(localStorage.getItem('librarianLogs') || '[]');
      logs.unshift({ ...librarian, date: new Date().toLocaleString() });
      localStorage.setItem('librarianLogs', JSON.stringify(logs.slice(0, 10)));

      // SHOW LOADING MESSAGE + DELAYED REDIRECT
      const loading = document.getElementById("loadingLogin");
      if (loading) loading.style.display = "block";
      document.body.style.opacity = "0.5";

      setTimeout(() => {
        window.location.href = 'home.html';
      }, 3000); // 3-second delay


    } 
    
    else {
      document.getElementById('loginError').textContent = "Invalid credentials.";
    }
  });
}


// Display logged-in librarian
const librarian = JSON.parse(localStorage.getItem('loggedInLibrarian'));
if (librarian && document.getElementById('loggedInName')) {
  document.getElementById('loggedInName').textContent = librarian.name;
}

// Home Page: Render Borrowing History
if (document.getElementById('borrowingHistory')) {
  const borrowing = JSON.parse(localStorage.getItem('borrowers') || '[]');
  document.getElementById('borrowingHistory').innerHTML = borrowing.map(b =>
    `<tr>
      <td>${b.name}</td>
      <td>${b.studentId}</td>
      <td>${b.course}</td>
      <td>${b.section}</td>
      <td>${b.bookId}</td>
    </tr>`
  ).join('');
}


// Home Page: Render Librarian Logs
if (document.getElementById('librarianLogs')) {
  const logs = JSON.parse(localStorage.getItem('librarianLogs') || '[]');
  document.getElementById('librarianLogs').innerHTML = logs.map(l =>
    `<tr><td>${l.name}</td><td>${l.email}</td><td>${l.id}</td><td>${l.date}</td></tr>`
  ).join('');
}

// Borrowers Page
if (document.getElementById('borrowerForm')) {
  const form = document.getElementById('borrowerForm');
  const table = document.getElementById('borrowersTable');

  function renderBorrowers() {
    const borrowers = JSON.parse(localStorage.getItem('borrowers') || '[]');
    table.innerHTML = borrowers.map((b, i) =>
      `<tr>
    
              <td>${b.name}</td>
              <td>${b.studentId}</td>
              <td>${b.bookId}</td>
              <td>${b.course}</td>
              <td>${b.section}</td>

            <td>
                <button onclick="editBorrower(${i})">Edit</button> 
                <button onclick="deleteBorrower(${i})">Delete</button>
            </td>


      </tr>`
    ).join('');
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const borrowers = JSON.parse(localStorage.getItem('borrowers') || '[]');
    const books = JSON.parse(localStorage.getItem('books') || '[]');

    const bookIdInput = form.bookId.value.trim();
    const book = books.find(bk => bk.id === bookIdInput);
    




    if (!book) {
      alert("Invalid Book ID. Please enter a valid 3-digit Book ID (001 to 100).");
      return;
    }

    borrowers.push({
      name: form.borrowerName.value,
      studentId: form.studentId.value,
      bookId: book.id,
      bookTitle: book.title, // even if not shown in Home, still useful internally
      course: form.course.value,
      section: form.section.value
    });

    localStorage.setItem('borrowers', JSON.stringify(borrowers));
    form.reset();


      // adding prompt
    const saving = document.getElementById("savingMessage");
    if (saving) saving.style.display = "block";
        document.body.style.opacity = "0.5";
    
    setTimeout(() => {
      localStorage.setItem('borrowers', JSON.stringify(borrowers));
      form.reset();
      renderBorrowers();
    
      document.body.style.opacity = "1";
      saving.style.display = "none";
      
      alert("✅ Successfully added borrower!");
    }, 4000); // 1-second delay
    



    renderBorrowers();
  });

  window.editBorrower = function(index) {
    const borrowers = JSON.parse(localStorage.getItem('borrowers'));
    const b = borrowers[index];
    document.getElementById('borrowerName').value = b.name;
    document.getElementById('studentId').value = b.studentId;
    document.getElementById('bookId').value = b.bookId;
    document.getElementById('course').value = b.course;
    document.getElementById('section').value = b.section;
    borrowers.splice(index, 1);
    localStorage.setItem('borrowers', JSON.stringify(borrowers));
    renderBorrowers();
  };

  window.deleteBorrower = function(index) {
    const borrowers = JSON.parse(localStorage.getItem('borrowers'));
    borrowers.splice(index, 1);
    localStorage.setItem('borrowers', JSON.stringify(borrowers));
    renderBorrowers();
  };

  renderBorrowers();
}

// Books Page
if (document.getElementById('bookList')) {
  const books = JSON.parse(localStorage.getItem('books') || '[]');
  const borrowedBooks = (JSON.parse(localStorage.getItem('borrowers') || '[]')).map(b => b.bookId);
  document.getElementById('bookList').innerHTML = books.map(book => `
    <tr>
      <td class="${borrowedBooks.includes(book.id) ? 'borrowed' : ''}">${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
    </tr>
  `).join('');
}



// 2-second delayed navigation for sidebar links
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById('sidebarLinks');
  if (sidebar) {
    const links = sidebar.querySelectorAll("a");
    links.forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = this.getAttribute("href");
        document.body.style.opacity = "0.5"; // optional fade effect
        document.getElementById("loadingMessage").style.display = "block"; // loading messege
        setTimeout(() => {
          window.location.href = target;
        }, 1000); // 2 seconds
      });
    });
  }
});



// log out function;
function logout() {
  const message = document.getElementById("logoutMessage");
  if (message) message.style.display = "block";
  document.body.style.opacity = "0.5";

  setTimeout(() => {
    localStorage.removeItem('loggedInLibrarian');
    window.location.href = 'login.html';
  }, 2000);
}
