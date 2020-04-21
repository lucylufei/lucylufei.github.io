$(document).scroll(function () {
    // Identify scrolled distance
    var y = $(this).scrollTop();

    // Identify location of menu
    var trigger = $('.words').offset().top;

    if (y >= (trigger)) {
        $('.navbar').fadeIn();
    } else {
        $('.navbar').fadeOut();
    }
});


$(document).ready(function () {
    $('.navbar').removeClass('hidden');
    $('.navbar').hide();

})

