$(function () {
    //Will change this but I made it this to not refresh the page
    let searchBox = $(".uk-navbar-center");
 
    //If the person presses the key it searches - NEED TO CHANGE THIS ONCE THE BUTTON IS UPDATED
    $(searchBox).on("click", function () {
        searchGBooks();
    });
 
    //Once the person starts typing, the search begins 
    $(".uk-search-default").keypress(function (event) {
        if (event.keyCode == 13) {
            return false;
        }
 
        searchGBooks();
    })
 
 
 
    //When "add to library" is clicked, we need to send the backend title, author, genre, gbooksId
    //NEED TO CHANGE THE ELEMENT TO THE BUTTON
    $("#displayTitle").on("click", function(){
        //Should dynamically make the data-gbooksId of the element the id number
    })
 
 
    function searchGBooks() {
        //Need to save what the user searches
        let searchInput = $(".uk-search-input");
 
        let searchValue = searchInput.val();
 
        //Spaces must be replaced with "+"
        searchValue = searchValue.replace(/ /g, "+");
 
        $.get(`/gbooks/${searchValue}`, function (data) {
            let slideDisplayEl = $("#sliderList");
 
            //We want to be able to see the covers of the books
            for (let i = 0; i < data.length; i++) {
                let html = "<li";
                let item = data.items[i].volumeInfo;
                let bookTitle = item.title;
                let authorName = item.authors[0];
                let genre = item.categories[0];
                let pages = item.pageCount;
                let smallImage = item.imageLinks.smallThumbnail;
                let normImage = item.imageLinks.thumbnail;
                let smallBlurb = item.description;
                let isbn_13 = item.industryIdentifiers[0].identifier;
                html +="data-gbooksId="+isbn_13;
                html += ">Test</li>";
                slideDisplayEl.append(html);
            }
 
            //THIS WILL ALL CHANGE DEPENDING ON FRONT END
            // let titleEl = $("#displayTitle");
            // titleEl.empty();
            // titleEl.text(data.items[0].volumeInfo.title);
 
            // let authorEl = $("#displayAuthor");
            // authorEl.empty();
            // authorEl.text(data.items[0].volumeInfo.authors[0]);
 
            // let genreEl = $("#displayGenre");
            // genreEl.empty();
            // genreEl.text(data.items[0].volumeInfo.categories[0]);
 
            // let discEl = $("#displayDescription");
            // discEl.empty();
            // discEl.text(data.items[0].volumeInfo.description);
        });
    }
 
})
 
