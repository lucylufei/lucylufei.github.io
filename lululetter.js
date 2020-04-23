$(document).ready(function () {
    $(".requestFont").click(function () {
        $('#fontModal').modal('show');
    });

    $("#type_toggle").change(function () {
        // otf
        if (this.checked === true) {
            $("#type_toggle_label").html("otf");
            $(".font-download").each(function () {
                console.log($(this).attr("href"));
                var oldUrl = $(this).attr("href");
                var newUrl = oldUrl.replace("ttf", "otf");
                $(this).attr("href", newUrl);
            })
        }

        // ttf
        else {
            $("#type_toggle_label").html("ttf");
            $(".font-download").each(function () {
                console.log($(this).attr("href"));
                var oldUrl = $(this).attr("href");
                var newUrl = oldUrl.replace("otf", "ttf");
                $(this).attr("href", newUrl);
            })
        }
    });
});