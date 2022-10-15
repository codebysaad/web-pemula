const dataKey = "BOOKSHELF"

const title = document.querySelector("#inputBookTitle")
const errorTitle = document.querySelector("#errorTitle")
const sectionTitle = document.querySelector("#sectionTitle")

const author = document.querySelector("#inputBookAuthor")
const errorAuthor = document.querySelector("#errorAuthor")
const sectionAuthor = document.querySelector("#sectionAuthor")

const year = document.querySelector("#inputBookYear")
const errorYear = document.querySelector("#errorYear")
const sectionYear = document.querySelector("#sectionYear")

const bookIsCompleted = document.querySelector("#inputBookIsComplete")

const btnSubmit = document.querySelector("#bookSubmit")

let checkInput = []
let checkTitle = null
let checkAuthor = null
let checkYear = null

window.addEventListener("load", function(){
    if (localStorage.getItem(dataKey) !== null) {    
        const booksData = getData()
        showData(booksData)
    }
})

btnSubmit.addEventListener("click", function() {
    if (btnSubmit.value == "") {
        checkInput = []

        title.classList.remove("error")
        author.classList.remove("error")
        year.classList.remove("error")

        errorTitle.classList.add("error-display")
        errorAuthor.classList.add("error-display")
        errorYear.classList.add("error-display")

        if (title.value == "") {
            checkTitle = false
        }else{
            checkTitle = true
        }

        if (author.value == "") {
            checkAuthor = false
        }else{
            checkAuthor = true
        }

        if (year.value == "") {
            checkYear = false
        }else{
            checkYear = true
        }

        checkInput.push(checkTitle,checkAuthor,checkYear)
        let resultCheck = validation(checkInput)

        if (resultCheck.includes(false)) {
            return false
        }else{
            const newData = {
                id: +new Date(),
                title: title.value.trim(),
                author: author.value.trim(),
                year: year.value,
                isCompleted: bookIsCompleted.checked
            }
            insertData(newData)

            title.value = ''
            author.value = ''
            year.value = ''
            bookIsCompleted.checked = false
        }    
    }else{
        const bookData = getData().filter(book => book.id != btnSubmit.value);
        localStorage.setItem(dataKey,JSON.stringify(bookData))

        const newData = {
            id: btnSubmit.value,
            title: title.value.trim(),
            author: author.value.trim(),
            year: year.value,
            isCompleted: bookIsCompleted.checked
        }
        insertData(newData)
        btnSubmit.innerHTML = "Masukkan Buku"
        btnSubmit.value = ''
        title.value = ''
        author.value = ''
        year.value = ''
        bookIsCompleted.checked = false
        alert("Buku berhasil diupdate")
    }
})

function validation(check) {
    let resultCheck = []
    
    check.forEach((a,i) => {
        if (a == false) {
            if (i == 0) {
                title.classList.add("error")
                errorTitle.classList.remove("error-display")
                resultCheck.push(false)
            }else if (i == 1) {
                author.classList.add("error")
                errorAuthor.classList.remove("error-display")
                resultCheck.push(false)
            }else{
                year.classList.add("error")
                errorYear.classList.remove("error-display")
                resultCheck.push(false)
            }
        }
    });

    return resultCheck
}

function insertData(book) {
    let bookData = []


    if (localStorage.getItem(dataKey) === null) {
        localStorage.setItem(dataKey, 0);
    }else{
        bookData = JSON.parse(localStorage.getItem(dataKey))
    }

    bookData.unshift(book)   
    localStorage.setItem(dataKey,JSON.stringify(bookData))

    showData(getData())
}

function getData() {
    return JSON.parse(localStorage.getItem(dataKey)) || []
}

function showData(books = []) {
    const inCompleted = document.querySelector("#incompleteBookshelfList")
    const completed = document.querySelector("#completeBookshelfList")

    inCompleted.innerHTML = ''
    completed.innerHTML = ''

    books.forEach(book => {
        if (book.isCompleted == false) {
            let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button class="green" onclick="bookIsCompletedBook('${book.id}')">Selesai dibaca</button>
                    <button class="yellow" onclick="editBook('${book.id}')">Edit Buku</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `

            inCompleted.innerHTML += el
        }else{
            let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button class="green" onclick="unbookIsCompletedBook('${book.id}')">Belum selesai di Baca</button>
                    <button class="yellow" onclick="editBook('${book.id}')">Edit Buku</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `
            completed.innerHTML += el
        }
    });
}

function bookIsCompletedBook(id) {
    let confirmation = confirm("Pindah ke rak selesai dibaca?")

    if (confirmation == true) {
        const bookDataDetail = getData().filter(book => book.id == id);
        const newData = {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].title,
            author: bookDataDetail[0].author,
            year: bookDataDetail[0].year,
            isCompleted: true
        }

        const bookData = getData().filter(book => book.id != id);
        localStorage.setItem(dataKey,JSON.stringify(bookData))

        insertData(newData)
    }else{
        return 0
    }
}

function unbookIsCompletedBook(id) {
    let confirmation = confirm("Pindah ke rak belum selesai dibaca?")

    if (confirmation == true) {
        const bookDataDetail = getData().filter(book => book.id == id);
        const newData = {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].title,
            author: bookDataDetail[0].author,
            year: bookDataDetail[0].year,
            isCompleted: false
        }

        const bookData = getData().filter(book => book.id != id);
        localStorage.setItem(dataKey,JSON.stringify(bookData))

        insertData(newData)
    }else{
        return 0
    }
}

function editBook(id) {
    const bookDataDetail = getData().filter(book => book.id == id);
    title.value = bookDataDetail[0].title
    author.value = bookDataDetail[0].author
    year.value = bookDataDetail[0].year
    bookDataDetail[0].isCompleted ? bookIsCompleted.checked = true:bookIsCompleted.checked = false

    btnSubmit.innerHTML = "Edit buku"
    btnSubmit.value = bookDataDetail[0].id
}

function deleteBook(id) {
    let confirmation = confirm("Apakah anda yakin ingin menghapus buku?")

    if (confirmation == true) {
        const bookDataDetail = getData().filter(book => book.id == id);
        const bookData = getData().filter(book => book.id != id);
        localStorage.setItem(dataKey,JSON.stringify(bookData))
        showData(getData())
        alert(`Buku ${bookDataDetail[0].title} berhasil dihapus`)
    }else{
        return 0
    }
}