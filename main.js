// Do your work here...
// DOM Elements
const bookForm = document.getElementById('bookForm');
const bookFormTitle = document.getElementById('bookFormTitle');
const bookFormAuthor = document.getElementById('bookFormAuthor');
const bookFormYear = document.getElementById('bookFormYear');
const bookFormIsComplete = document.getElementById('bookFormIsComplete');
const bookFormSubmit = document.getElementById('bookFormSubmit');
const searchBook = document.getElementById('searchBook');
const searchBookTitle = document.getElementById('searchBookTitle');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');

// Storage Key
const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];
let editingBookId = null;

// Load books from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
  // Load books from localStorage
  loadBooksFromStorage();
  
  // Update the UI with books
  renderBooks();
  
  // Update button text based on checkbox state
  updateSubmitButtonText();
});

// Update submit button text when checkbox changes
bookFormIsComplete.addEventListener('change', function() {
  updateSubmitButtonText();
});

// Handle form submission
bookForm.addEventListener('submit', function(e) {
  e.preventDefault();
  saveBook();
});

// Handle search form
searchBook.addEventListener('submit', function(e) {
  e.preventDefault();
  renderBooks();
});

// Update submit button text based on checkbox state
function updateSubmitButtonText() {
  const buttonText = bookFormIsComplete.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
  bookFormSubmit.querySelector('span').innerText = buttonText;
}

// Save or update a book
function saveBook() {
  const title = bookFormTitle.value;
  const author = bookFormAuthor.value;
  const year = parseInt(bookFormYear.value);
  const isComplete = bookFormIsComplete.checked;
  
  // Create new book object
  const newBook = {
    id: editingBookId || +new Date(),
    title,
    author,
    year,
    isComplete
  };
  
  if (editingBookId) {
    // Update existing book
    const index = books.findIndex(book => book.id === editingBookId);
    books[index] = newBook;
    editingBookId = null;
  } else {
    // Add new book
    books.push(newBook);
  }
  
  // Save to localStorage
  saveToStorage();
  
  // Reset form
  bookForm.reset();
  updateSubmitButtonText();
  
  // Update UI
  renderBooks();
}

// Load books from localStorage
function loadBooksFromStorage() {
  const storedBooks = localStorage.getItem(STORAGE_KEY);
  
  if (storedBooks) {
    books = JSON.parse(storedBooks);
  }
}

// Save books to localStorage
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Render books to the UI
function renderBooks() {
  // Clear current lists
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';
  
  // Get search query
  const searchQuery = searchBookTitle.value.toLowerCase().trim();
  
  // Filter books based on search
  const filteredBooks = searchQuery 
    ? books.filter(book => book.title.toLowerCase().includes(searchQuery))
    : books;
  
  // Render each book
  filteredBooks.forEach(book => {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');
    
    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;
    
    // Add event listeners to buttons
    const toggleButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
    const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
    const editButton = bookElement.querySelector('[data-testid="bookItemEditButton"]');
    
    toggleButton.addEventListener('click', function() {
      toggleBookStatus(book.id);
    });
    
    deleteButton.addEventListener('click', function() {
      deleteBook(book.id);
    });
    
    editButton.addEventListener('click', function() {
      editBook(book.id);
    });
    
    // Add to appropriate list
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// Toggle book completion status
function toggleBookStatus(id) {
  const bookIndex = books.findIndex(book => book.id === id);
  
  if (bookIndex !== -1) {
    // Toggle isComplete status
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    
    // Save to localStorage
    saveToStorage();
    
    // Update UI
    renderBooks();
  }
}

// Delete a book
function deleteBook(id) {
  if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
    books = books.filter(book => book.id !== id);
    
    // If the book being deleted is currently being edited, reset the form
    if (editingBookId === id) {
      bookForm.reset();
      editingBookId = null;
      updateSubmitButtonText();
    }
    
    // Save to localStorage
    saveToStorage();
    
    // Update UI
    renderBooks();
  }
}

// Edit a book
function editBook(id) {
  const book = books.find(book => book.id === id);
  
  if (book) {
    // Fill form with book data
    bookFormTitle.value = book.title;
    bookFormAuthor.value = book.author;
    bookFormYear.value = book.year;
    bookFormIsComplete.checked = book.isComplete;
    
    // Save book ID for later update
    editingBookId = id;
    
    // Update submit button text
    updateSubmitButtonText();
    
    // Scroll to form
    bookForm.scrollIntoView({ behavior: 'smooth' });
    
    // Change button text
    bookFormSubmit.textContent = 'Edit Buku';
  }
}
