$(document).ready(function() {
    $('#submit').click(function(){
        $.ajax({
            type: "GET",
            url: "/results",
            data: {input: $('#input-area').val()},
            success: function(data) {
                $('#output').text(data)
            }
        });
    });
});