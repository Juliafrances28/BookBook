$(function () {
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

