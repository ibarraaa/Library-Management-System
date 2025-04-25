// script.js


function forcePreloadBooks() {
    const books = [];
    for (let i = 1; i <= 100; i++) {
      books.push({
        id: (1000 + i).toString(),
        title: `School Book Title ${i}`,
        author: `Author ${i}`
      });
    }
    localStorage.setItem('books', JSON.stringify(books));
  }
  
  //forcePreloadBooks();

//////////////////wala pa ot


// Utility
function getLocalData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

        function saveLocalData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
  
  // Home Page Logic
  if (document.getElementById('borrowingHistory')) {
    const history = getLocalData('borrowers');
    const table = document.getElementById('borrowingHistory');
    table.innerHTML = history.map(b => `<tr><td>${b.studentId}</td><td>${b.course}</td><td>${b.bookTitle}</td><td>${b.bookId}</td></tr>`).join('');
  }
  
  if (document.getElementById('librarianLogs')) {
    const logs = getLocalData('librarianLogs');
    const table = document.getElementById('librarianLogs');
    table.innerHTML = logs.map(log => `<tr><td>${log.name}</td><td>${log.email}</td><td>${log.id}</td><td>${log.date}</td><td>${log.totalBorrows || 0}</td></tr>`).join('');
  }
  
  // Books Page Logic
  if (document.getElementById('addBookForm')) {
    const form = document.getElementById('addBookForm');
    const bookList = document.getElementById('bookList');
    const borrowedBooks = getLocalData('borrowers').map(b => b.bookId);
  
    const renderBooks = () => {
      const books = getLocalData('books');
      bookList.innerHTML = books.map(book => {
        const isBorrowed = borrowedBooks.includes(book.id);
        return `<tr><td class="${isBorrowed ? 'borrowed' : ''}">${book.id}</td><td>${book.title}</td><td>${book.author}</td></tr>`;
      }).join('');
    }
  
    form.onsubmit = e => {
      e.preventDefault();
      const id = form.bookId.value.trim();
      const title = form.bookTitle.value.trim();
      const author = form.bookAuthor.value.trim();
      const books = getLocalData('books');
      books.push({ id, title, author });
      saveLocalData('books', books);
      form.reset();
      renderBooks();
    }
  
    renderBooks();
  }
  
  // Borrowers Page Logic
  if (document.getElementById('borrowerForm')) {
    const form = document.getElementById('borrowerForm');
    const table = document.getElementById('borrowersTable');
  
    const renderBorrowers = () => {
      const borrowers = getLocalData('borrowers');
      table.innerHTML = borrowers.map((b, i) => `
        <tr>
          <td>${b.name}</td><td>${b.studentId}</td><td>${b.bookId}</td><td>${b.course}</td>
          <td><button onclick="editBorrower(${i})">Edit</button> <button onclick="removeBorrower(${i})">Remove</button></td>
        </tr>`).join('');
    }
  
    form.onsubmit = e => {
      e.preventDefault();
      const name = form.borrowerName.value.trim();
      const studentId = form.studentId.value.trim();
      const bookId = form.bookId.value.trim();
      const course = form.course.value.trim();
      const books = getLocalData('books');
      const book = books.find(b => b.id === bookId);
      const borrowers = getLocalData('borrowers');
      borrowers.push({ name, studentId, bookId, course, bookTitle: book ? book.title : "" });
      saveLocalData('borrowers', borrowers);
      form.reset();
      renderBorrowers();
    }
  
    window.editBorrower = (i) => {
      const b = getLocalData('borrowers')[i];
      form.borrowerName.value = b.name;
      form.studentId.value = b.studentId;
      form.bookId.value = b.bookId;
      form.course.value = b.course;
      removeBorrower(i);
    }
  
    window.removeBorrower = (i) => {
      const borrowers = getLocalData('borrowers');
      borrowers.splice(i, 1);
      saveLocalData('borrowers', borrowers);
      renderBorrowers();
    }
  
    renderBorrowers();
  }
  
  // Return Page Logic
  if (document.getElementById('returnForm')) {
    const select = document.getElementById('selectBorrower');
    const returnList = document.getElementById('returnList');
    const form = document.getElementById('returnForm');
  
    const renderSelect = () => {
      const borrowers = getLocalData('borrowers');
      select.innerHTML = borrowers.map((b, i) => `<option value="${i}">${b.studentId} - ${b.bookTitle}</option>`).join('');
    }
  
    const renderReturns = () => {
      const returns = getLocalData('returns');
      returnList.innerHTML = returns.map(r => `<li>${r.studentId} returned ${r.bookTitle}</li>`).join('');
    }
  
    form.onsubmit = e => {
      e.preventDefault();
      const borrowers = getLocalData('borrowers');
      const index = select.value;
      const borrower = borrowers.splice(index, 1)[0];
      saveLocalData('borrowers', borrowers);
  
      const returns = getLocalData('returns');
      returns.push(borrower);
        saveLocalData('returns', returns);
  
        renderSelect();
        renderReturns();
    }
  
    renderSelect();
    renderReturns();
  }
  
  // Display Logged-in Librarian
  const loggedIn = JSON.parse(localStorage.getItem('loggedInLibrarian'));
  if (loggedIn && document.getElementById('loggedInInfo')) {
    document.getElementById('loggedInInfo').textContent = `Logged in as: ${loggedIn.name}`;
  }
  



const logged = JSON.parse(localStorage.getItem('loggedInLibrarian'));
const logs = getLocalData('librarianLogs');

// hahanapin si logged-in librarian sa logs
const index = logs.findIndex(log => log.id === logged.id);

// dagdagan yung totalBorrows kung meron na siya sa logs
if (index !== -1) {
  logs[index].totalBorrows = (logs[index].totalBorrows || 0) + 1;
  saveLocalData('librarianLogs', logs);
}
