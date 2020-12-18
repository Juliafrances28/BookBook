//load document then execute jquery
$(document).ready(function(){
    // BEGIN GLOBAL VARIABLE ASSIGNMENT
    const searchInput = $(".uk-search-input").val().trim();
    const searchBtn = $(".uk-search-icon-flip uk-icon uk-search-icon")
    var userInfo // declared but no value saved, will be filled in Ajax call.


    
    
    /* 
    
    1. ajax call for user id - store in a variable for use later
    
    2. change availability of their book 
     
    - this will be a post request to update the bool val available 
    
    3. make request to borrow if not available add to wish list
     - get request to check availability, if not available then post request to add to wish list table
    
    4. if one of the user's books are borrowed show the email of the person borrowing it
     -  get request to check if borrowed, if true dynamically add an icon to suggest it's borrowed, if false hide then hide the button for returning
    
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

    });// closes user info request



function renderOwnedBooks(){
    console.log("called renderOwnedBooks")
   $.ajax("/api/bookById/:"+ userInfo.id, {
    type: "GET"
}).then(function (data) {





});// closes get books by id ajax call

}// closes renderOwnedBooks()

$(document).on("click", searchBtn, renderOwnedBooks());
    




    
    
    
    
    
    
    
    
    
    
    })// closes doc.ready function
