//load document then execute jquery
$(document).ready(function () {
    // BEGIN GLOBAL VARIABLE ASSIGNMENT
    const searchInput = $(".uk-search-input").val().trim();
    const searchBtn = $(".uk-search-icon-flip uk-icon uk-search-icon")
    var userInfo // declared but no value saved, will be filled in Ajax call.
    const book = $(".book")



    /* 
    
    1. ajax call for user id - store in a variable for use later - DONE
    
    
    
    3. make request to borrow if not available add to wish list
     - get request to check availability, if not available then post request to add to wish list table
    
   
    
    5. mark it as returned
    - post request to update availability and hide the button for returning
    
    6. delete book from owned library
    -  ajax call to delete the book from books where ownerId = [user id]
    
    7. delete books from wishlist 
    -  ajax call to delete the book from wishlist where userId = [user id]
    
    */




    // immediately make ajax call to save user info into an object for later use.
    $.ajax('/api/user_data', {
        type: "GET"
    }).then(function (response) {
        console.log(response)
        userInfo = {
            id: response.user.id,
            first_name: response.user.first_name,
            last_name: response.user.last_name,
            email: response.user.email,
        }

        renderOwnedBooks();
        //changeBookAvailability();

    });// closes user info request


    //////BEGIN FUNCTION DEFINITIONS

    function renderOwnedBooks() {
        console.log("called renderOwnedBooks")
        $.ajax("/api/bookByOwnerId/:id" + userInfo.id, {
            type: "GET"
        }).then(function (data) {
            let bookObjArr = data

            for (i = 0; i < bookObjArr.length; i++) {
                console.log("loop started")
                console.log(bookObjArr[i])
            }




        });// closes get books by id ajax call

    }// closes renderOwnedBooks()



    /*2. change availability of their book 
         
        - this will be a post request to update the bool val available */

    function changeBookAvailability() {
        console.log("changeBookAvail called")
        var bookId = "1"
        var bookAvailability = "true"
        var testObj = {availability: bookAvailability}
        //var bookId = $(this).attr("data-id")
        //bookAvailability = $(this).attr("data-availability")

        if (bookAvailability === "true"){

            $.ajax("/api/bookUnavailable/" + bookId, {
                type: "PUT",
                data: JSON.stringify(testObj),
                dataType: 'json',
                contentType: 'application/json'
            }).then(function () {
                console.log("changed devour state to", bookAvailability);
                // Reload the page to get the updated list
                location.reload();
            });

        }
        else {
    
            $.ajax("/api/bookAvailable/" + bookId, {
                type: "PUT",
                data: JSON.stringify(testObj),
                dataType: 'json',
                contentType: 'application/json'
            }).then(function () {
                console.log("changed devour state to", bookAvailability);
                // Reload the page to get the updated list
                location.reload();
            });

    }

    } // closes checkAvailability();


    /* 4. if one of the user's books are borrowed show the email of the person borrowing it
     -  get request to check if borrowed, if true dynamically add an icon to suggest it's borrowed, if false hide then hide the button for returning */

     function isBorrowed(){
        $.ajax("/api/bookIdWhereBorrowed/:id" + userInfo.id, {
            type: "GET"
        }).then(function (data) {
            let bookObjArr = data

            for (i = 0; i < bookObjArr.length; i++) {
                console.log("loop started")
                console.log(bookObjArr[i])
            }

            $.ajax("/api/bookByOwnerId/:id" + userInfo.id, {
                type: "GET"
            }).then(function (data) {
                let bookObjArr = data
    
                for (i = 0; i < bookObjArr.length; i++) {
                    console.log("loop started")
                    console.log(bookObjArr[i])
                }
    
    
    
    
            });// closes get books by id ajax call


        });// closes get books by id ajax call


     }// closes isBorrowed();








    //$(document).on("click", book, );















})// closes doc.ready function
