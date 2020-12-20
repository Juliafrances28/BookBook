//load document then execute jquery
$(document).ready(function () {
    // BEGIN GLOBAL VARIABLE ASSIGNMENT
    //const searchInput = $(".uk-search-input").val().trim();
    //const searchBtn = $(".uk-search-icon-flip uk-icon uk-search-icon")
    var userInfo // declared but no value saved, will be filled in Ajax call.
    const book = $(".book")
    const libContainer = $("#libContainer")
    const wishListContainer = $("#wishListContainer")



    /*
    
    
    
    3. make request to borrow if not available add to wish list
     - get request to check availability, if not available then post request to add to wish list table
    
   
    
    5. mark it as returned
    - post request to update availability and hide the button for returning
    
    6. delete book from owned library
    -  ajax call to delete the book from books where ownerId = [user id]
    
    7. delete books from wishlist 
    -  ajax call to delete the book from wishlist where userId = [user id]
    
    */



    /* 
        
        1. ajax call for user id - store in a variable for use later - DONE*/

    //promisified the ajax call to be able to run requestUserInfo afterwards
    function requestUserInfo() {

        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/user_data',
                type: "GET",
                success: function (data) {
                    resolve(data)
                },
                error: function (error) {
                    reject(error)
                }
            })

        })

    }// closes user info request function (new)


    // CALLED REQUEST USER INFO THEN SAVE THE RESPONSE INTO AN OBJECT AND PASS THAT OBJECT AS A PARAMETER TO RENDER OWNED BOOKS
    requestUserInfo().then((response) => {
        console.log(response)
        userInfo = {
            id: response.user.id,
            first_name: response.user.first_name,
            last_name: response.user.last_name,
            email: response.user.email,
        }
        renderOwnedBooks(userInfo);
    })


    /*
    $.ajax('/api/user_data', {
        type: "GET"
    }).then(function (response) {
        console.log(response)
        
        console.log(JSON.stringify(userInfo))

       

        //renderOwnedBooks(userInfo);




    }).catch((err) => {
        console.error(err)

    });// closes user info request
    */




    //////BEGIN FUNCTION DEFINITIONS

    function renderOwnedBooks(userInfo) {
        console.log("called renderOwnedBooks")
        console.log("The data in user info is \n \n \n \n " + JSON.stringify(userInfo))
        $.ajax("/api/bookByOwnerId/" + userInfo.id, {
            type: "GET"
        }).then(function (data) {
            console.log("the response from renderOwned books is " + JSON.stringify(data))

            let bookObjArr = data

            for (i = 0; i < bookObjArr.length; i++) {
                let bookAvailability = bookObjArr[i].available
                let borrowStatus = bookObjArr[i].borrowed

                if (borrowStatus === 1 && bookAvailability === 1) {
                    console.log("else statement hit, the next line is the book obj arr \n" + JSON.stringify(bookObjArr))

                    console.log("loop started")
                    console.log(bookObjArr[i])

                    libContainer.append(`

                    <div class="uk-grid uk-flex-center" data-id = "${bookObjArr[i].id}" data-avail="false">
                        <img src="${bookObjArr[i].imgUrl}" alt="imgUrl for ${bookObjArr[i].title}">
                    <div class="uk-flex uk-flex-column uk-margin uk-width-1-4">
                      <button class="uk-button uk-button-secondary returnButton" data-id = "${bookObjArr[i].id}" data-avail="false">Marked as Returned</button>
                      <button class="uk-button uk-button-primary deleteBtn libDelete" data-id = "${bookObjArr[i].id}" data-delete = "library" data-isbn="${bookObjArr[i].isbn}" >Delete from Library</button>
                    </div>
                    <div class="uk-width-1-3 uk-text-center uk-margin">
                      <li ><strong> TITLE:</strong> ${bookObjArr[i].title}</li>
                      <li ><strong> AUTHOR:</strong> ${bookObjArr[i].author}</li>
                      <li ><strong> Genre:</strong> ${bookObjArr[i].genre}</li>
                      <li ><strong> ISBN:</strong> ${bookObjArr[i].isbn}</li>
                      <li ><span class="uk-label uk-label-warning">Borrowed By: ${bookObjArr[i].borrowerEmail} </span> </li>
                    </div>
                  
                
                
                `)

                }

                else if (bookAvailability === 1) {

                    console.log("if statement hit, the next line is the book obj arr \n" + bookObjArr)

                    console.log("loop started")
                    console.log(bookObjArr[i])
                    console.log("bookavialability is set to \n \n \n  " + bookAvailability)
                    console.log("borrow status is set to \n \n \n " + borrowStatus)

                    libContainer.append(`
                
                <div class="uk-grid uk-flex-center" data-id = "${bookObjArr[i].id}" data-avail="true">
                    <img src="${bookObjArr[i].imgUrl}" alt="imgUrl for ${bookObjArr[i].title}">
                <div class="uk-flex uk-flex-column uk-margin uk-width-1-4">
                    <button class="uk-button uk-button-primary AvailableButton" data-id = "${bookObjArr[i].id}" data-avail="true">Marked as Available</button>
                    <button class="uk-button uk-button-primary deleteBtn libDelete" data-id = "${bookObjArr[i].id}" data-delete = "library" data-isbn="${bookObjArr[i].isbn}">Delete from Library</button>
                    
                </div>
                <div class="uk-width-1-3 uk-text-center uk-margin">
                    <li class="book_title"><strong> TITLE:</strong> ${bookObjArr[i].title}</li>
                    <li class="author"><strong> AUTHOR:</strong> ${bookObjArr[i].author}</li>
                    <li class="genre"><strong> Genre:</strong> ${bookObjArr[i].genre}</li>
                    <li class="isbn"><strong> ISBN:</strong> ${bookObjArr[i].isbn}</li>
                </div>
                
                
                
                `)
                }


                else {

                    console.log("else statement hit, the next line is the book obj arr \n" + bookObjArr)

                    console.log("loop started")
                    console.log(bookObjArr[i])

                    libContainer.append(`
                
                    <div class="uk-grid uk-flex-center" data-id = "${bookObjArr[i].id}" data-avail="false">
                      <img src="${bookObjArr[i].imgUrl}" alt="imgUrl for ${bookObjArr[i].title}">
                    <div class="uk-flex uk-flex-column uk-margin uk-width-1-4">
                      <button class="uk-button uk-button-danger AvailableButton" data-id = "${bookObjArr[i].id}" data-avail="false">Marked Unavailable</button>
                      <button class="uk-button uk-button-primary deleteBtn libDelete" data-id = "${bookObjArr[i].id}" data-delete = "library" data-isbn="${bookObjArr[i].isbn}">Delete from Library</button>
                    </div>
                    <div class="uk-width-1-3 uk-text-center uk-margin">
                      <li class="book_title"><strong> TITLE:</strong> ${bookObjArr[i].title}</li>
                      <li class="author"><strong> AUTHOR:</strong> ${bookObjArr[i].author}</li>
                      <li class="genre"><strong> Genre:</strong> ${bookObjArr[i].genre}</li>
                      <li class="isbn"><strong> ISBN:</strong> ${bookObjArr[i].isbn}</li>
                    </div>
                  
                
                
                `)
                }





            }




        });// closes get books by id ajax call

    }// closes renderOwnedBooks()


    function renderWishList(userInfo) {
        console.log("called renderWishList")
        console.log("The data in user info is \n \n \n \n " + JSON.stringify(userInfo))
        $.ajax("/api/WishlistByUserId/" + userInfo.id, {
            type: "GET"
        }).then(function (data) {
            console.log("the response from renderOwned books is " + JSON.stringify(data))

            let bookObjArr = data

            for (i = 0; i < bookObjArr.length; i++) {
                let bookAvailability = bookObjArr[i].available
                let borrowStatus = bookObjArr[i].borrowed

                if (borrowStatus === 1 && bookAvailability === 1) {
                    console.log("else statement hit, the next line is the book obj arr \n" + JSON.stringify(bookObjArr))

                    console.log("loop started")
                    console.log(bookObjArr[i])

                    wishListContainer.append(`

                    <div class="uk-grid uk-flex-center" data-id = "${bookObjArr[i].id}" data-avail="false">
                        <img src="${bookObjArr[i].imgUrl}" alt="imgUrl for ${bookObjArr[i].title}">
                    <div class="uk-flex uk-flex-column uk-margin uk-width-1-4">
                      <button class="uk-button uk-button-secondary returnButton" data-id = "${bookObjArr[i].id}" data-avail="false">Marked as Returned</button>
                      <button class="uk-button uk-button-primary deleteBtn libDelete" data-id = "${bookObjArr[i].id}" data-delete = "library" data-isbn="${bookObjArr[i].isbn}">Delete from Library</button>
                    </div>
                    <div class="uk-width-1-3 uk-text-center uk-margin">
                      <li ><strong> TITLE:</strong> ${bookObjArr[i].title}</li>
                      <li ><strong> AUTHOR:</strong> ${bookObjArr[i].author}</li>
                      <li ><strong> Genre:</strong> ${bookObjArr[i].genre}</li>
                      <li ><strong> ISBN:</strong> ${bookObjArr[i].isbn}</li>
                      <li ><span class="uk-label uk-label-warning">Borrowed By: ${bookObjArr[i].borrowerEmail} </span> </li>
                    </div>
                  
                
                
                `)

                }

                else if (bookAvailability === 1) {

                    console.log("if statement hit, the next line is the book obj arr \n" + bookObjArr)

                    console.log("loop started")
                    console.log(bookObjArr[i])
                    console.log("bookavialability is set to \n \n \n  " + bookAvailability)
                    console.log("borrow status is set to \n \n \n " + borrowStatus)

                    wishListContainer.append(`
                
                <div class="uk-grid uk-flex-center" data-id = "${bookObjArr[i].id}" data-avail="true">
                    <img src="${bookObjArr[i].imgUrl}" alt="imgUrl for ${bookObjArr[i].title}">
                <div class="uk-flex uk-flex-column uk-margin uk-width-1-4">
                    <button class="uk-button uk-button-primary AvailableButton" data-id = "${bookObjArr[i].id}" data-avail="true">Marked as Available</button>
                    <button class="uk-button uk-button-primary deleteBtn libDelete" data-id = "${bookObjArr[i].id}" data-delete = "library" data-isbn="${bookObjArr[i].isbn}" >Delete from Library</button>
                    
                </div>
                <div class="uk-width-1-3 uk-text-center uk-margin">
                    <li class="book_title"><strong> TITLE:</strong> ${bookObjArr[i].title}</li>
                    <li class="author"><strong> AUTHOR:</strong> ${bookObjArr[i].author}</li>
                    <li class="genre"><strong> Genre:</strong> ${bookObjArr[i].genre}</li>
                    <li class="isbn"><strong> ISBN:</strong> ${bookObjArr[i].isbn}</li>
                </div>
                
                
                
                `)
                }


                else {

                    console.log("else statement hit, the next line is the book obj arr \n" + bookObjArr)

                    console.log("loop started")
                    console.log(bookObjArr[i])

                    wishListContainer.append(`
                
                    <div class="uk-grid uk-flex-center" data-id = "${bookObjArr[i].id}" data-avail="false">
                      <img src="${bookObjArr[i].imgUrl}" alt="imgUrl for ${bookObjArr[i].title}">
                    <div class="uk-flex uk-flex-column uk-margin uk-width-1-4">
                      <button class="uk-button uk-button-danger AvailableButton" data-id = "${bookObjArr[i].id}" data-avail="false">Marked Unavailable</button>
                      <button class="uk-button uk-button-primary deleteBtn libDelete" data-id = "${bookObjArr[i].id}" data-delete = "library" data-isbn="${bookObjArr[i].isbn}" >Delete from Library</button>
                    </div>
                    <div class="uk-width-1-3 uk-text-center uk-margin">
                      <li class="book_title"><strong> TITLE:</strong> ${bookObjArr[i].title}</li>
                      <li class="author"><strong> AUTHOR:</strong> ${bookObjArr[i].author}</li>
                      <li class="genre"><strong> Genre:</strong> ${bookObjArr[i].genre}</li>
                      <li class="isbn"><strong> ISBN:</strong> ${bookObjArr[i].isbn}</li>
                    </div>
                  
                
                
                `)
                }





            }




        });// closes get books by id ajax call

    }// closes renderOwnedBooks()


    /*2. change availability of their book 
         
        - this will be a post request to update the bool val available */

    function changeBookAvailability(bookId, bookAvailability) {
        console.log("changeBookAvail called")
        console.log("the parameter bookAvailability is set to " + bookAvailability)

        //var bookId = "4"
        //var bookAvailability = "true"

        //var bookId = $(this).attr("data-id")
        //bookAvailability = $(this).attr("data-availability")

        if (bookAvailability === true) {
            bookAvailability1 = "false"
            var testObj = { availability: bookAvailability1 }
            console.log(JSON.stringify(testObj))
            console.log("calling bookUnavailable api route")
            console.log("book Availability is set to " + bookAvailability)

            $.ajax("/api/bookUnavailable/" + bookId, {
                type: "PUT",
                data: JSON.stringify(testObj),
                dataType: 'json',
                contentType: 'application/json'
            }).then(function (response) {
                console.log("changed bookAvailability state to", response);
                // Reload the page to get the updated list
                location.reload();
            });

        }
        else {
            bookAvailability1 = false
            var testObj = { availability: bookAvailability1 }
            console.log("calling book Available api route")
            console.log("book Availability1 is set to " + bookAvailability1)

            $.ajax("/api/bookAvailable/" + bookId, {
                type: "PUT",
                data: JSON.stringify(testObj),
                dataType: 'json',
                contentType: 'application/json'
            }).then(function (response) {
                console.log("changed devour state to", response);
                // Reload the page to get the updated list
                location.reload();
            });

        }

    } // closes checkAvailability();


    function markReturned(bookId, borrowedStatus) {
        var testObj = { borrowedStatus: "false" }
        $.ajax("/api/returnBook/" + bookId, {
            type: "PUT",
            data: JSON.stringify(testObj),
            dataType: 'json',
            contentType: 'application/json'
        }).then(function (response) {
            console.log("changed bookAvailability state to", response);
            // Reload the page to get the updated list
            location.reload();
        });

    }


    /* 4. if one of the user's books are borrowed show the email of the person borrowing it
     -  get request to check if borrowed, if true dynamically add an icon to suggest it's borrowed, if false hide then hide the button for returning */

    function deleteBook(bookId, deleteClass, isbn) {
        console.log("deleteBook(); has been called")

        if (deleteClass === "library") {

            $.ajax("/api/" + bookId + "/delete", {
                type: "DELETE"
            }).then(function () {
                console.log("deleted book", bookId);
                // Reload the page to get the updated list
                location.reload();
            });
        }

        else {
            $.ajax("/api/" + isbn + "/removeWishlistitem", {
                type: "DELETE"
            }).then(function () {
                console.log("deleted book", bookId);
                // Reload the page to get the updated list
                location.reload();
            });
        }
    }










    $(document).on("click", ".AvailableButton", function (event) {
        event.preventDefault();

        /*let availBtn = event.target
        let imgel = $(availBtn).parent().parent()
        let bookel = imgel[0]
        let bookId = $(bookel).attr("data-id")
        let bookAvailability = $(bookel).attr("data-avail")
        console.log(bookId)
        console.log(bookAvailability)*/
        //console.log($(bookel).attr("data-id"))
        let test = $(this)
        console.log(test)
        let bookId = $(this).data("id");
        let bookAvailability = $(this).data("avail");
        changeBookAvailability(bookId, bookAvailability);
        //location.reload();
        //renderOwnedBooks();



    });// closes change availability button


    $(document).on("click", ".returnButton", function (event) {
        event.preventDefault();

        /*let availBtn = event.target
        let imgel = $(availBtn).parent().parent()
        let bookel = imgel[0]
        let bookId = $(bookel).attr("data-id")
        let bookAvailability = $(bookel).attr("data-avail")
        console.log(bookId)
        console.log(bookAvailability)*/
        //console.log($(bookel).attr("data-id"))
        let test = $(this)
        console.log(test)
        let bookId = $(this).data("id");
        let borrowedStatus = $(this).data("avail");
        //changeBookAvailability(bookId, bookAvailability);
        console.log("clicked this button")
        markReturned(bookId, borrowedStatus);
        location.reload();
        //renderOwnedBooks();



    });// closes return button on click




    $(document).on("click", ".libDelete", function (event) {
        event.preventDefault();
        let bookId = $(this).data("id");
        let deleteClass = $(this).data("delete")
        let isbn = $(this).data("isbn")
        deleteBook(bookId, deleteClass, isbn);
        console.log(deleteClass)



    });

    /* $("button.AvailableButton").click(function(event){
         let e = event
         let c = $(e).children().children();
         console.log("clicked")
 
 
 
     });*/












})// closes doc.ready function
