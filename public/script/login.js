// Zo's script file - sound fx ;)

$(document).ready(function () {

    function play() {
        var sound = document.getElementById("mouse-click");
        sound.play();
    }



    $("#entry").on("click", function (event) {
        event.preventDefault();

        let user = {
            email: $(".email").val(),
            password: $(".secret").val()
        }


        $.ajax("/login", {
            type: "POST",
            data: user,
            dataType: "json"
        }).then(function (data) {
            window.location.replace("/home")

        })



    })






})




// Mouse click sound effect

