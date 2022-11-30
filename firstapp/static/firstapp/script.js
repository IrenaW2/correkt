$(document).ready(function() {
    $('#submit').click(function() {
        $.ajax({
            type: "GET",
            url: "/results",
            data: {input: $('#input-area').val()},
            success: function(data) {
                $('#output').text(data);
                $('#output').fadeTo(0, 0).delay(50).fadeTo(500, 1);
                if (data == "Not Cyberbullying") {
                    $("#input-area").css("border", "2px solid green");
                }
                else {
                    $("#input-area").css("border", "2px solid red");
                }
            }
        });
    });
});