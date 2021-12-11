var bookmarks = [];
let currentCategory = "";
let phpScriptsUrl = 'http://localhost/www/bookmarker/assets/scripts/php';
let bookmarkCategories = [];

function setup() {
    // Load categories from DB
    let parsedJson;
    let result2;
    const result = fetch(`${phpScriptsUrl}/fetchCategories.php`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => response.text())
            .then((res) => {
                console.log(JSON.parse(res));

                // Parse json
                parsedJson = JSON.parse(res);
            });

    // Continue setup of page
    result.then(r => {

        // Add parsed items to bookmark categories array
        for (var i = 0; i < parsedJson.length; i++) {
            bookmarkCategories.push({
                category: parsedJson[i].categoryName, 
                bookmarks: [] 
            });
        }
        
        // Retrieve bookmarks
        result2 = fetch(`${phpScriptsUrl}/fetchBookmarks.php`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => response.text())
            .then((res) => {
                console.log(JSON.parse(res));

                // Parse json
                parsedJson = JSON.parse(res);
            });

        result2.then(r => {

            // Load bookmarks into their respective categories
            for (var i = 0; i < parsedJson.length; i++) {
                var indexOfCategory = bookmarkCategories.findIndex(b => b.category === parsedJson[i].categoryName);
                var category = bookmarkCategories[indexOfCategory];
                category.bookmarks.push({
                    name: parsedJson[i].bookmarkName,
                    url: parsedJson[i].bookmarkUrl
                });
            }

            // Add categories to nav items upon load
            for (var i = 0; i < bookmarkCategories.length; i++) {
                addNavItem(bookmarkCategories[i].category);
            }

            addClickListenerToNavItems();
            selectDefaultCategory();

            // Set sidebar collapse button click
            let sidebar = document.querySelector(".sidebar");
            let sidebarBtn = document.querySelector(".bx-menu");
            sidebarBtn.addEventListener("click", () => {
                sidebar.classList.toggle("close");
            });

            configureModalEvents();

            // Set sidebar to close when small width
            var x = window.matchMedia("(max-width: 850px)");
            closeSidebarOnWidthChange(x) // Call listener function at run time
            x.addEventListener("change", closeSidebarOnWidthChange); // Attach listener function on state changes
        });
    });
}

function configureModalEvents() {
    var modal = document.getElementById("categoriesModal");
    let sidebar = document.querySelector(".sidebar");

    // When the user clicks on the button, open the modal
    const editCategoriesBtn = document.querySelector("#btnAdd");
    editCategoriesBtn.onclick = function () {
        var categoriesCopy2 = bookmarkCategories;

        // Reset categories op result div and input
        document.getElementById("categoryOpResult").innerHTML = '';
        document.getElementById("category-name").value = '';

        // Close sidebar
        sidebar.classList.toggle("close");

        var ul = document.querySelector("#categoryItems");
        ul.innerHTML = '';

        // Fil list of categories in ul element
        for (var i = 0 ; i < bookmarkCategories.length; i++) {
            (function() {
                var index = i;
                addItemToCategories(bookmarkCategories[i].category, index);
            })();
        }

        // Display the modal
        modal.style.display = "block";
    }

    const addCategoryBtn = document.querySelector("#addCategoryBtn");
    addCategoryBtn.addEventListener('click', () => {
        var categoryName = document.querySelector("#category-name").value;
        if (categoryName != "") {

            let categoryID;

            // Save category to database
            fetch(`${phpScriptsUrl}/insertCategory.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                body: `categoryName=${categoryName}`,
            })
            .then((response) => response.text())
            .then((res) => {
                categoryID = res;

                document.getElementById("categoryOpResult").innerHTML = categoryID;

                alert(categoryID);

                if (categoryID !== '' || categoryID != null) {
                    // Create new category obj with empty bookmarks
                    bookmarkCategories.push({
                        category: categoryName, 
                        bookmarks: [] 
                    });
                    
                    // Adds item to categories in DOM
                    addItemToCategories(categoryName);
                }

                // Reset input field to empty
                document.querySelector("#category-name").value = '';
            });
        }
        else {
            alert("Please fill in a category name to add");
        }
    });

    const saveCategoriesBtn = document.getElementById("saveCategoriesButton");
    saveCategoriesBtn.onclick = function () {
        // Save changes and update DOM
        saveCategoryChanges();
        sidebar.classList.toggle("close");
        modal.style.display = "none";
    }

    // When the user clicks on <span> (x), close the modal
    const closeSpan = document.querySelector("#categoriesModal .close-modal");
    closeSpan.onclick = function () {
        // Save changes and update DOM
        saveCategoryChanges();
        sidebar.classList.toggle("close");
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            // Save changes and update DOM
            saveCategoryChanges();
            sidebar.classList.toggle("close");
            modal.style.display = "none";
        }
    }
}

function saveCategoryChanges() {
    // Save list of categories to db, verify data first
    var navLinks = document.querySelector('#nav-links');
    navLinks.innerHTML = '';

    // Re-create navigation items
    for (var i = 0; i < bookmarkCategories.length; i++) {
        addNavItem(bookmarkCategories[i].category);
    }

    addClickListenerToNavItems();
    selectDefaultCategory();
}

function addClickListenerToNavItems() {
    // Set onclick of nav items - updates category selected
    var navItems = document.querySelectorAll("#nav-links li a span");
    var categorySpan = document.querySelector(".text");
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].onclick = function () {
            // Set the category text 
            categorySpan.innerHTML = this.innerHTML;

            // Clear bookmark ops result from previous nav location
            document.getElementById("bookmarkOpResult").innerHTML = '';

            // Add array items to the bookmarks element on screen
            var div = document.querySelector(".bookmarks");
            div.innerHTML = '';

            var ul = document.createElement("ul");

            var indexOfCategory = bookmarkCategories.findIndex(b => b.category === this.innerHTML);
            var category = bookmarkCategories[indexOfCategory];
            
            if (category.bookmarks.length !== 0) {
                // Load bookmarks into ul element
                for (var j = 0; j < category.bookmarks.length; j++) {
                    var name = category.bookmarks[j].name;
                    var url = category.bookmarks[j].url;
                    var index = j;
                    var li = createBookmarkItem(name, url, index);
                    ul.appendChild(li);
                }
            }
            else {
                // Load empty bookmarks message
                let emptyMsg = createEmptyBookmarksMessage();
                ul.appendChild(emptyMsg);
            }

            div.appendChild(ul);
    
            // debug - log in console
            console.log(this.innerHTML + " Index = " + indexOfCategory);
        }
    }
}

function createEmptyBookmarksMessage() {
    let emptyMsg = document.createElement('span');
    let text = document.createTextNode("No bookmarks available");
    emptyMsg.appendChild(text);
    return emptyMsg;
}

function selectDefaultCategory() {
    var navItems = document.querySelectorAll("#nav-links li a span");

    if (navItems.length > 0) {
        navItems[0].click();
    }
}

/* Called when Save Bookmark is clicked */
function saveBookmark(e) {
    e.preventDefault(); // Prevent page from reloading

    let bookmarkName = document.getElementById("bookmark-name").value;
    let bookmarkUrl = document.getElementById("bookmark-url").value;
    let category = document.querySelector(".text").innerHTML;

    // Validate user put in bookmark information
    if (bookmarkName === '' || bookmarkUrl === '') {
        alert("Please fill out bookmark info");
        return;
    }
    else if (!isValidURL(bookmarkUrl)) {
        alert("Please enter a valid url format");
        return;
    }
    else if (category === '' || category === null) {
        alert("Please create and select a category to add a bookmark to");
        return;
    }

    // Insert into DB
    const result = fetch(`${phpScriptsUrl}/insertBookmark.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `categoryName=${category}&bookmarkName=${bookmarkName}&bookmarkUrl=${bookmarkUrl}`,
    })
    .then((response) => response.text())
    .then((res) => {
        document.getElementById("bookmarkOpResult").innerHTML = res;
        console.log(res);
    })
    .catch(error => alert(error));

    // ...
    result.then(r => {
        // Use categorySpan to get current selected category (for now)
        // Then add item to array
        var currentCategory = document.querySelector(".text").innerHTML;
        var categoryIndex = bookmarkCategories.findIndex(b => b.category === currentCategory);
        bookmarkCategories[categoryIndex].bookmarks.push({
            name: bookmarkName,
            url: bookmarkUrl
        });

        let newIndex = bookmarkCategories[categoryIndex].bookmarks.length - 1;

        // Create and add item to DOM
        var li = createBookmarkItem(bookmarkName, bookmarkUrl, newIndex);
        var ul = document.querySelector("div.bookmarks > ul");

        // Remove empty bookmarks message if there was no elements
        // previously
        if (ul.firstChild.innerHTML === "No bookmarks available") {
            ul.firstChild.remove();
        }

        ul.appendChild(li);

        // Clear inputs
        document.getElementById("bookmark-name").value = "";
        document.getElementById("bookmark-url").value = "";
    });
}

function addItemToCategories(categoryName, index) {
    var ul = document.querySelector("#categoryItems");
    var category = categoryName;

    // Configure li element
    var liElem = document.createElement("li");
    liElem.classList.add("category-item");

    var textSpan = document.createElement("span");
    var spanText = document.createTextNode(categoryName);
    textSpan.appendChild(spanText);
    liElem.appendChild(textSpan);

    // Configure delete button
    var deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.classList.add("delete-category-button");
    deleteBtn.addEventListener('click', () => {
        var currentIndex = index;

        // Delete category from db & its corresponding bookmarks
        fetch(`${phpScriptsUrl}/deleteCategory.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                body: `categoryName=${category}`,
            })
            .then((response) => response.text())
            .then((res) => {
                document.getElementById("categoryOpResult").innerHTML = res;

                if (res === "Deleted successfully!") {
                    // Delete from in-memory array and update UI
                    var i = bookmarkCategories.findIndex(c => c.category === category);
                    bookmarkCategories.splice(i, 1);
                    ul.removeChild(liElem);
                }
            })
            .catch(error => alert(error));
    });

    // Configure rename button
    var renameBtn = document.createElement("button");
    renameBtn.innerHTML = "Rename";
    renameBtn.classList.add("rename-category-button");

    // Create div to hold buttons
    let div = document.createElement("div");
    div.className = "category-item-buttons";
    div.appendChild(deleteBtn);
    div.appendChild(renameBtn);

    // Append children for list item and ul
    liElem.appendChild(div);
    ul.appendChild(liElem);
}

function addNavItem(categoryName) {
    const ulList = document.querySelector("#nav-links");

    const li = document.createElement('li');

    var div = document.createElement('div');
    div.className = "icon-link";

    var aLink = document.createElement('a');
    aLink.href = '#';
    // aLink.addEventListener("click", () => {
    //     // alert(aLink.innerText);
    // });

    var icon = document.createElement('i');
    icon.className = "bx bx-collection";

    var span = document.createElement('span');
    span.className = "nav-item-name";
    var spanText = document.createTextNode(categoryName);
    span.appendChild(spanText);
    aLink.appendChild(icon);
    aLink.appendChild(span);

    div.appendChild(aLink);
    li.appendChild(div);
    ulList.appendChild(li);
}

function closeSidebarOnWidthChange(x) {
    let sidebar = document.querySelector(".sidebar");

    // If media query matches
    if (x.matches) { 
        sidebar.classList.add("close");
    }
    else {
        sidebar.className = "sidebar";
    }
}

function createBookmarkItem(bookmarkName, bookmarkUrl="placeholderurl", index) {
    var li = document.createElement("li");
    li.classList.add("bookmark");

    // Configure bookmark-header
    var header = document.createElement("div");
    header.classList.add("bookmark-header");

    // Configure bookmark-body
    var body = document.createElement("div");
    body.classList.add("bookmark-body");
    var bookmarkTitle = document.createElement('span');
    bookmarkTitle.innerHTML = bookmarkName;
    bookmarkTitle.classList.add("bookmark-title");
    var url = document.createElement('span');
    url.innerHTML = bookmarkUrl;
    body.appendChild(bookmarkTitle);
    body.appendChild(url);

    // Configure bookmark-footer
    var footer = document.createElement("div");
    footer.classList.add("bookmark-footer");
    var visitButton = document.createElement("button");
    visitButton.id = "visitBtn";
    visitButton.innerHTML = "Visit";
    visitButton.addEventListener('click', () => visitBookmark(bookmarkUrl));
    var editButton = document.createElement("button");
    editButton.id = "editBtn";
    editButton.innerHTML = "Edit";
    editButton.addEventListener('click', () => editBookmark(bookmarkTitle.innerHTML, bookmarkUrl, index));
    var deleteButton = document.createElement("button");
    deleteButton.id = "deleteBtn";
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener('click', () => deleteBookmark(bookmarkTitle.innerHTML, bookmarkUrl));

    footer.appendChild(visitButton);
    footer.appendChild(editButton);
    footer.appendChild(deleteButton);

    // Append header/body/footer to bookmark item
    // li.appendChild(header);
    li.appendChild(body);
    li.appendChild(footer);

    return li;
}

function newBookmark(bookmarkName) {
    var div = document.querySelector(".bookmarks");
    var ul = document.createElement("ul");

    let item = `<li class="bookmark">
                    <div>
                        <div class="bookmark-header">
                            <span>Image Here</span>
                        </div>
                        <div class="bookmark-body">
                            <span>${bookmarkName}</span>
                            <span>Description</span>
                            <span>(maybe url)</span>
                        </div>
                        <div class="bookmark-footer">
                            <button id="visitBtn">Visit</button>
                            <button id="previewBtn">Preview</button>
                            <button id="deleteBtn">Delete</button>
                        </div>
                    </div>
                </li>`;

    return item;
}

function visitBookmark(url) {
    window.open(url, "_blank");
}

function editBookmark(bookmarkTitle, url, index) {
    var modal = document.getElementById("editModal");
    modal.style.display = "block";

    console.log("Index of editing item: " + index);

    let originalName = bookmarkTitle; 
    let originalUrl = url;
    let categoryName = document.querySelector(".text").innerHTML;

    let nameInput = document.getElementById("bookmark-name-edit");
    let urlInput = document.getElementById("bookmark-url-edit");
    nameInput.value= originalName;
    urlInput.value = originalUrl;

    // Create event for closing modal on X
    const closeSpan = document.querySelector("#editModal .close-modal");
    closeSpan.onclick = function () {
        modal.style.display = "none";

        // Helps avoid multiple listeners being set if modal closed
        // by clicking the X
        updateBookmarkBtn.removeEventListener('click', updateBookmark)
        // sidebar.classList.toggle("close");
    }
  
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";

            // Helps avoid multiple listeners being set if modal closed
            // by clicking outside of the modal
            updateBookmarkBtn.removeEventListener('click', updateBookmark)
            // sidebar.classList.toggle("close");
        }
    }

    // Create event for updating bookmark
    const updateBookmarkBtn = document.querySelector("#updateBookmarkBtn");
    updateBookmarkBtn.addEventListener('click', updateBookmark);

    // Updates bookmark in database and then its in memory array
    // and the DOM
    function updateBookmark() {
        let bookmarkIndex = index;
        let newName = nameInput.value;
        let newUrl = urlInput.value;

        if (!isValidURL(newUrl)) {
            alert("Please enter a valid url format");
            return;
        }
        else if (newName === originalName && newUrl === originalUrl) {
            // Avoid extra database call if no inputs have been changed
            return;
        }

        // Prepare parameters to send in request
        let params = `categoryName=${categoryName}&oldName=${originalName}&oldUrl=${originalUrl}&bookmarkName=${newName}&bookmarkUrl=${newUrl}`;
        console.log(params);

        // Send request to update bookmark
        fetch(`${phpScriptsUrl}/updateBookmark.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: params,
        })
        .then((response) => response.text())
        .then((res) => {
            console.log(res);
            document.getElementById("bookmarkOpResult").innerHTML = res;

            // Update bookmark in array
            var categoryIndex = bookmarkCategories.findIndex(b => b.category === categoryName);
            let bookmark = bookmarkCategories[categoryIndex].bookmarks[index];
            bookmark.name = newName;
            bookmark.url = newUrl;
            
            // Update list item in DOM
            let list = document.querySelector(".bookmarks > ul");
            let newLi = createBookmarkItem(bookmark.name, bookmark.url, bookmarkIndex);
            list.replaceChild(newLi, list.childNodes[index]);
            
            // Re-hide modal on completion & remove event listener
            modal.style.display = "none";
            updateBookmarkBtn.removeEventListener('click', updateBookmark);
        });
    }
}

function deleteBookmark(bookmarkTitle, url) {
    var currentCategory = document.querySelector(".text").innerHTML;

    // Delete bookmark from db
    const result = fetch(`${phpScriptsUrl}/deleteBookmark.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `&categoryName=${currentCategory}&bookmarkName=${bookmarkTitle}&bookmarkUrl=${url}`,
    })
    .then((response) => response.text())
    .then((res) => {
        document.getElementById("bookmarkOpResult").innerHTML = res;

        if (res === "Deleted successfully!") {
            var title = bookmarkTitle;

            // Delete from in memory list
            var categoryIndex = bookmarkCategories.findIndex(b => b.category === currentCategory);
            var bookmarkIndex = bookmarkCategories[categoryIndex].bookmarks.findIndex(b => b.name === title);
            bookmarkCategories[categoryIndex].bookmarks.splice(bookmarkIndex, 1);
        
            // Continue deletion from DOM
            // var test = document.querySelectorAll("div.bookmarks ul li");
            var childElements = document.querySelectorAll("div.bookmark-body .bookmark-title");
            var elementToDelete;
            for (let elem of childElements) {
        
                // Get the specific li element to delete 
                if (elem.innerHTML === title) {
                    elementToDelete = elem.parentNode.parentNode;
                }
            }
        
            let ul = document.querySelector("div.bookmarks > ul");
            ul.removeChild(elementToDelete);

            // Add empty message if no more bookmarks exist
            if (ul.childElementCount === 0) {
                let msg = createEmptyBookmarksMessage();
                ul.appendChild(msg);
            }
        }
    })
    .catch(error => alert(error));
}

function isValidURL(url) {
    // Regular expression literal
    // Test against all possible matches with /g (global flag)
    let pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    return pattern.test(url);
};

document.addEventListener("DOMContentLoaded", setup);