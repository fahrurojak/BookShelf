document.addEventListener("DOMContentLoaded", function () {
    const inputBookTitle = document.getElementById("inputBookTitle");
    const inputBookAuthor = document.getElementById("inputBookAuthor");
    const inputBookYear = document.getElementById("inputBookYear");
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
    const inputBookForm = document.getElementById("inputBook");
    const searchBookTitle = document.getElementById("searchBookTitle");
    const searchBookForm = document.getElementById("searchBook");
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    const addNameIcon = document.getElementById("add-name-icon");
    const userNameSpan = document.getElementById("user-name");

    const STORAGE_KEY = "bookshelf_apps";

    // Tambahkan penanganan kesalahan
    function handleError(error) {
        console.error("Error:", error);
        // Tampilkan pesan kesalahan kepada pengguna jika perlu
    }

    // Tambahkan validasi input untuk memastikan tahun terbit adalah bilangan bulat positif
    function validateInput(title, author, year) {
        if (!title || !author || !year) {
            alert("Harap lengkapi semua input.");
            return false;
        }
        if (isNaN(year) || year < 0 || !Number.isInteger(+year)) {
            alert("Tahun terbit harus berupa bilangan bulat positif.");
            return false;
        }
        return true;
    }

    // Tambahkan penanganan kesalahan saat mengakses localStorage
    function handleLocalStorageError(action) {
        console.error(`Error accessing localStorage during ${action}.`);
        alert(`Terjadi kesalahan saat ${action}. Silakan coba lagi.`);
    }

    // Function to show input field when clicking on the edit icon
    addNameIcon.addEventListener("click", function () {
        const userName = prompt("Please enter your name:");
        if (userName !== null && userName.trim() !== "") {
            localStorage.setItem("userName", userName); // Save user's name to localStorage
            userNameSpan.textContent = userName; // Update user's name in the welcome message
        }
    });

    // Retrieve user's name from localStorage and update the welcome message
    const storedName = localStorage.getItem("userName");
    if (storedName) {
        userNameSpan.textContent = storedName;
    }

    function refreshDataFromStorage() {
        const parsedData = JSON.parse(localStorage.getItem(STORAGE_KEY));

        let incompleteBooks = [];
        let completeBooks = [];

        if (parsedData !== null) {
            incompleteBooks = parsedData.filter(book => !book.isComplete);
            completeBooks = parsedData.filter(book => book.isComplete);
        }

        renderBookshelf(incompleteBookshelfList, incompleteBooks);
        renderBookshelf(completeBookshelfList, completeBooks);
    }

    function saveDataToStorage(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        refreshDataFromStorage();
    }

    function addBook(title, author, year, isComplete) {
        const newBook = {
            id: +new Date(),
            title: title,
            author: author,
            year: parseInt(year),
            isComplete: isComplete
        };

        const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        storedData.push(newBook);
        saveDataToStorage(storedData);
    }

    function renderBookshelf(bookshelfList, books) {
        bookshelfList.innerHTML = "";

        books.forEach(book => {
            const bookItem = document.createElement("article");
            bookItem.classList.add("book_item");
            const bookTitle = document.createElement("h3");
            bookTitle.innerText = book.title;
            const bookAuthor = document.createElement("p");
            bookAuthor.innerText = `Penulis: ${book.author}`;
            const bookYear = document.createElement("p");
            bookYear.innerText = `Tahun: ${book.year}`;

            const actionContainer = document.createElement("div");
            actionContainer.classList.add("action");

            const actionButton = document.createElement("button");
            actionButton.innerText = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
            actionButton.classList.add(book.isComplete ? "green" : "red");
            actionButton.addEventListener("click", function () {
                toggleBookStatus(book.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Hapus buku";
            deleteButton.classList.add("red");
            deleteButton.addEventListener("click", function () {
                deleteBook(book.id);
            });

            const moveButton = document.createElement("button");
            moveButton.innerText = book.isComplete ? "Pindahkan ke Belum selesai dibaca" : "Pindahkan ke Selesai dibaca";
            moveButton.classList.add("blue");
            moveButton.addEventListener("click", function () {
                moveBook(book.id);
            });

            actionContainer.appendChild(actionButton);
            actionContainer.appendChild(moveButton);
            actionContainer.appendChild(deleteButton);

            bookItem.appendChild(bookTitle);
            bookItem.appendChild(bookAuthor);
            bookItem.appendChild(bookYear);
            bookItem.appendChild(actionContainer);

            bookshelfList.appendChild(bookItem);
        });
    }

    function toggleBookStatus(id) {
        const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
        const targetBookIndex = storedData.findIndex(book => book.id === id);

        if (targetBookIndex !== -1) {
            storedData[targetBookIndex].isComplete = !storedData[targetBookIndex].isComplete;
            saveDataToStorage(storedData);
        }
    }

    function deleteBook(id) {
        const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
        const filteredData = storedData.filter(book => book.id !== id);
        saveDataToStorage(filteredData);
    }

    function moveBook(id) {
        const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
        const targetBookIndex = storedData.findIndex(book => book.id === id);

        if (targetBookIndex !== -1) {
            storedData[targetBookIndex].isComplete = !storedData[targetBookIndex].isComplete;
            saveDataToStorage(storedData);
        }
    }

    inputBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const title = inputBookTitle.value;
        const author = inputBookAuthor.value;
        const year = inputBookYear.value;
        const isComplete = inputBookIsComplete.checked;

        if (validateInput(title, author, year)) {
            addBook(title, author, year, isComplete);

            inputBookTitle.value = "";
            inputBookAuthor.value = "";
            inputBookYear.value = "";
            inputBookIsComplete.checked = false;
        }
    });

    searchBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const keyword = searchBookTitle.value.toLowerCase();
        const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (keyword.trim() !== "") {
            const filteredBooks = storedData.filter(book => book.title.toLowerCase().includes(keyword));
            const incompleteBooks = filteredBooks.filter(book => !book.isComplete);
            const completeBooks = filteredBooks.filter(book => book.isComplete);

            renderBookshelf(incompleteBookshelfList, incompleteBooks);
            renderBookshelf(completeBookshelfList, completeBooks);
        } else {
            refreshDataFromStorage();
        }
    });

    refreshDataFromStorage();
});