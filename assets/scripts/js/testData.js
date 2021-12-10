const bookmarkCategoriesTest = [
    {
        category: "Main Category", 
        bookmarks: [
            {
                name: "Bookmark1",
                url: "www.testtttttttt.com"
            },
            {
                name: "Bookmark2",
                url: "www.testtttttttttt.com"
            },
            {
                name: "Bookmark3",
                url: "www.testtttttttttttt.com"
            },
            {
                name: "Bookmark4",
                url: "www.testttttttttt.com"
            },
            {
                name: "Bookmark5",
                url: "www.testtttttttttttt.com"
            }
        ]
    },
    {
        category: "Default Category", 
        bookmarks: [
            {
                name: "Bk1",
                url: "www.test.com"
            },
            {
                name: "Bk2",
                url: "www.test.com"
            },
            {
                name: "Bk3",
                url: "www.test.com"
            },
            {
                name: "Bk4",
                url: "www.test.com"
            }
        ]
    },
    {
        category: "Category1",
        bookmarks: [
            {
                name: "fdsafdafda",
                url: "fafda"
            },
            {
                name: "fdsa",
                url: "fafda"
            },
            {
                name: "fafa",
                url: "fafda"
            },
            {
                name: "fewafewafe",
                url: "fafda"
            }
        ]
    },
    {
        category: "Category2",
        bookmarks: [
            {
                name: "Some bookmark",
                url: "fdsafafas"
            },
            {
                name: "Some bookmark 2",
                url: "fdsafafas"
            },
            {
                name: "Some bookmark 3",
                url: "fdsafafas"
            },
            {
                name: "Some bookmark 4",
                url: "fdsafafas"
            }
        ]
    }
];

function test() {
    bookmarkCategoriesTest.forEach(bookmarkCategory => {
        console.log("Category: " + bookmarkCategory.category);
        bookmarkCategory.bookmarks.forEach(bookmark => {
            var outputString = `Bookmark: ${bookmark.name}, Url: ${bookmark.url}`;
            console.log(outputString);
        });
    });
}

test();