$(document).ready(function(){
    $('.top').fadeOut();
});

$('body').scrollspy(
    { target: '#navbar-example' }
);

$('.btn-more').click(function(){
    var target=$(this).data('id');
	$('html, body').animate({
		scrollTop: $('#'+target).offset().top
    }, 2000);
});

$('.nav-link').click(function(){
    var target=$(this).data('id');
	$('html, body').animate({
		scrollTop: $(target).offset().top
    }, 2000);
});

$(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
        $('.top').fadeIn();
    } else {
        $('.top').fadeOut();
    }
});

$('.top').click(function(){
    $('html, body').animate({
        scrollTop: $('body').offset().top
    }, 2000);
    return false;
})

new WOW().init();