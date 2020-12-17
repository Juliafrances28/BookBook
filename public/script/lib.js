$(document).ready(function(){


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
    
   $.ajax('/api/user', {
    type: "GET"
}).then(function (data) {
    let devourList = $("#devourList");
    let deleteList = $("#deleteList");

    let burgers = data.burgers
    let length = burgers.length

    for (let i = 0; i < length; i++) {
        var devoured = burgers[i].devoured
        if (devoured === 1) {
            devoured = true
        }
        else {
            devoured = false
        }
        console.log("the burger is" + burgers[i].burger_name + "devoured flag is set to " + devoured)
        //check if devoured flag is sett to true, if so add to the deleteList
        if (devoured === true) {

            var new_elem = `<li id= "#${burgers[i].burger_name}" class = "mb-md-3" data-id ="${burgers[i].id}" data-devoured ="${devoured}">
        ${burgers[i].burger_name} <button class = "ml-md-5 btn btn-danger deleteBtn" data-id ="${burgers[i].id}">DELETE</button>
         </li>`
            deleteList.append(new_elem);
        }
        else {


            var new_elem = `<li id= "#${burgers[i].burger_name}" class = "mb-md-3" data-id ="${burgers[i].id}" data-devoured ="${devoured}">
        ${burgers[i].burger_name} <button class = "ml-md-5 btn btn-primary devourBtn" data-id ="${burgers[i].id}" data-devourState ="${devoured}">DEVOUR</button>
         </li>`
            devourList.append(new_elem);
        }
    }


});//closes get request for burgers
    
    
    
    
    
    
    
    
    
    
    })