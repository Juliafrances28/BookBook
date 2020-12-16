$(function () {

    const searchBox = $("#searchForm");

    //If the person presses the key it searches - NEED TO CHANGE THIS ONCE THE BUTTON IS UPDATED
    $(searchBox).on("submit", function (event) {
        event.preventDefault();
        searchGBooks();
    });

    //Need to make a get request to get the user ID and email



    //When "add to library" is clicked, we need to send the backend title, author, genre, gbooksId
    //We also need to somehow get the userId TALK TO DAVID
    $(document).on("click", ".addToLibrary", function (event) {
        //Should dynamically make the data-gbooksId of the element the id number
        event.preventDefault();
        console.log("test");

        let isbn = $(this).data("isbn13");

        $.get(`/gbooks/${isbn}`, function (data) {
            let item = data.items[0].volumeInfo;

            let title = item.title;
            let author = item.authors[0];
            let genre = item.categories[0];

            //Now need a backend route to feed this data into
            let newBook = {
                title: title,
                author: author,
                genre: genre,
                isbn: isbn
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

        console.log(isbn);
    })

    function searchGBooks() {
        //Need to save what the user searches
        let searchInput = $(".uk-search-input");

        let searchValue = searchInput.val();

        console.log(searchValue);

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
