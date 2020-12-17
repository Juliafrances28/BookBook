$(function () {
        //When user clicks "Book inventory" they are redirected to the library
    $(document).on("click", ".inventory", function (result) {
        window.location.replace("../library/");
    });


    //Will need wrapper function to get user's first name, email, and id
    //For testing purposes will use the following
    let userId = 1;
    let firstName = "samplefirtname";
    let userEmail = "sample@gmail.com";

    //We want the span to populate with the user's first name
    let nameSpan = $(".firstName");
    nameSpan.empty();
    nameSpan.text(firstName);
    
    //Will change this but I made it this to not refresh the page
    let searchBox = $("#searchForm");

    //If the person presses the key it searches - NEED TO CHANGE THIS ONCE THE BUTTON IS UPDATED
    $(searchBox).on("submit", function (event) {
        event.preventDefault();
        searchGBooks();
    });



    //When "add to library" is clicked, we need to send the backend title, author, genre, gbooksId
    //NEED TO CHANGE THE ELEMENT TO THE BUTTON
    $("#displayTitle").on("click", function () {
        //Should dynamically make the data-gbooksId of the element the id number
    })


    //When "add to library" is clicked, we need to send the backend title, author, genre, gbooksId
    //We also need to somehow get the userId TALK TO DAVID
    $(document).on("click", ".addToLibrary", function (event) {
        //Should dynamically make the data-gbooksId of the element the id number
        event.preventDefault();

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
                isbn: isbn,
                ownerId: userId,
                ownerEmail: userEmail
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
            checkedOut: true
        }

        //WILL NEED TO ADD IN borrowedBy here as well


        $.ajax(`/borrow/${isbn}`, {
            type: "PUT",
            data: JSON.stringify(newAvailability),
            dataType: 'json',
            contentType: 'application/json'
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
            for(let i=0; i<imageEl.length; i++){
                let item = data.items[i].volumeInfo;
                let normImage = item.imageLinks.thumbnail;
                let bookTitle = item.title;
                isbn_13 = item.industryIdentifiers[0].identifier;
                $(imageEl[i]).html(`<a><img src  = "${normImage}" alt = "book-result ${bookTitle}"></a>`);
                let btnsEl = $("<div>");
                $(btnsEl).html(`<button type=button class="btn btn-primary addToLibrary" data-isbn13="${isbn_13}">Add to library</button>
                <button type=button class="btn btn-primary requestToBorrow" data-isbn13="${isbn_13}">Request to borrow</button>`);
                $(imageEl[i]).append(btnsEl);

                // imageEl[i].innerHTML =`<a><img src  = "${normImage}" alt = "book-result ${bookTitle}"></a>`;
                // let buttonsEl = $("<li>");
                // let buttonHTML = `<li>${bookTitle} <button type=button class="btn btn-primary addToLibrary" data-isbn13="${isbn_13}">Add to library</button>
                // <button type=button class="btn btn-primary requestToBorrow" data-isbn13="${isbn_13}">Request to borrow</button>
                // </li>`;
                // console.log(buttonHTML);
                // buttonsEl.innerHTML = buttonHTML;
                // imageEl[i].append(buttonsEl);
            }

            //We want to be able to see the covers of the books
            // for (let i = 0; i < data.length; i++) {
            //     let html = "<li";
            //     let item = data.items[i].volumeInfo;
            //     let bookTitle = item.title;
            //     let authorName = item.authors[0];
            //     let genre = item.categories[0];
            //     let pages = item.pageCount;
            //     let smallImage = item.imageLinks.smallThumbnail;
            //     let normImage = item.imageLinks.thumbnail;
            //     let smallBlurb = item.description;
            //     let isbn_13 = item.industryIdentifiers[0].identifier;
            //     html += "data-gbooksId=" + isbn_13;
            //     html += ">Test</li>";
            //     slideDisplayEl.append(html);
            //     console.log(html);
            // }

        });
    }

})


// Zo's login page javascript 
function play() 
{
  var audio = document.getElementById("audio-mouse");
  audio.play();
}
