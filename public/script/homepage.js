$(function () {
    //When user clicks "Book inventory" they are redirected to the library
    $(document).on("click", ".inventory", function (result) {
        console.log("test");
        window.location.replace("../library/");
    });

    //When user clicks "Sign out" they are redirected to the sign up page
    $(document).on("click", ".sign-out", function (result) {
        window.location.replace("../login/");
    });

    //Will need wrapper function to get user's first name, email, and id
    //For testing purposes will use the following
    let userId = 1;
    let firstName = "test";
    let userEmail = "test@gmail.com";

    //We want the span to populate with the user's first name
    let nameSpan = $(".firstName");
    nameSpan.empty();
    nameSpan.text(firstName);

    //Will change this but I made it this to not refresh the page
    let searchBox = $("#searchForm");

    //If the person presses the key it searches 
    $(searchBox).on("submit", function (event) {
        event.preventDefault();
        searchGBooks();
    });




    //When "add to library" is clicked, we need to send the backend title, author, genre, gbooksId

    $(document).on("click", ".addToLibrary", function (event) {
        //Should dynamically make the data-gbooksId of the element the id number
        event.preventDefault();

        let isbn = $(this).data("isbn13");

        $.get(`/gbooks/${isbn}`, function (data) {
            let item = data.items[0].volumeInfo;
            let title = item.title;
            let author = item.authors[0];
            let genre = item.categories[0];
            let imageURL = item.imageLinks.thumbnail;


            //Now need a backend route to feed this data into
            let newBook = {
                title: title,
                author: author,
                genre: genre,
                isbn: isbn,
                ownerId: userId,
                ownerEmail: userEmail,
                imgUrl: imageURL
            };


            //This inserts into the books table
            $.ajax("/library/new/", {
                type: "POST",
                data: JSON.stringify(newBook),
                dataType: 'json',
                contentType: 'application/json'
            }).then(function () {
                location.reload();
            });

        });

    });

    //When "request to borrow" is clicked, look through books and find all available books
    $(document).on("click", ".requestToBorrow", function (event) {
        event.preventDefault();

        //Search through the books table, find all available books of that isbn number
        let isbn = $(this).data("isbn13");


        let newAvailability = {
            available: false,
            borrowed: true
        }


        $.ajax(`/borrow/${isbn}`, {
            type: "PUT",
            data: JSON.stringify(newAvailability),
            dataType: 'json',
            contentType: 'application/json',
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 400) {
                    addToWishList(isbn, userId);
                } else {
                    console.log("Other type of error");
                }
            }
        }).then(function () {
            location.reload();
        });
    });

    //A list of available books will populate below these will be at random
    let availableEl = $(".available.book");

    $.ajax("/books/available", {
        type: "GET"
    }).then(function (data) {
        //The data should have the image URLs in it
    });

    //Function to add to wishlist if the book is not available
    function addToWishList(isbn, userId) {

        $.get("/gbooks/" + isbn, function (data) {
            let item = data.items[0];
            let author = item.volumeInfo.authors[0];
            let title = item.volumeInfo.title;

            let wishListEntry = {
                userId: userId,
                title: title,
                author: author,
                isbn: isbn
            }


            $.post("/wishlist", {
                type: "POST",
                data: wishListEntry,
                dataType: 'json',
                contentType: 'application/json'
            }).then(function () {
                //Need to alert user that the item isn't available and that item is added to wishList
                wishListAlert(isbn);
            });
        })
        //Need to alert user that the item isn't available
    }

    //Alerts the user that the book isn't available and that it is added to their wishlist
    function wishListAlert(isbn) {
        console.log(isbn);
        
        let alertEl = $(`<div class="avail-alert">`);
        alertEl.html("This book is not currently available. It is being added to your library.");
        $("#searchForm").append(alertEl);
    }

    function searchGBooks() {
        //Need to save what the user searches
        let searchInput = $(".uk-search-input");

        let searchValue = searchInput.val();


        //Spaces must be replaced with "+"
        searchValue = searchValue.replace(/ /g, "+");

        $.get("/gbooks/" + searchValue, function (data) {

            let imageEl = $(".results-images");

            imageEl.empty();
            //We want to generate a button under each one to add to library or request to borrow
            for (let i = 0; i < imageEl.length; i++) {
                let item = data.items[i].volumeInfo;
                let normImage = item.imageLinks.thumbnail;
                let bookTitle = item.title;
                isbn_13 = item.industryIdentifiers[0].identifier;
                $(imageEl[i]).html(`<a><img src  = "${normImage}" alt = "book-result ${bookTitle}"></a>`);
                let btnsEl = $("<div>");
                $(btnsEl).html(`<button type=button class="btn btn-primary addToLibrary" data-isbn13="${isbn_13}">Add to library</button>
            <button type=button class="btn btn-primary requestToBorrow" data-isbn13="${isbn_13}">Request to borrow</button>`);
                $(imageEl[i]).append(btnsEl);

            }

        });
    }










})

