$(document).ready(function(){
    $('.top').fadeOut();
    emailjs.init("user_4mMoVT0ZELfg2O7FqCiNW");
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

// contact form
document.getElementById('contact-form').addEventListener('submit', function(event){
  event.preventDefault();

  var template_params = {
      "name": document.ContactForm.name.value,
      "sender": document.ContactForm.sender.value,
      "subject": document.ContactForm.subject.value,
      "body": document.ContactForm.body.value
  }

  console.log(template_params);
  
  var service_id = "default_service";
  var template_id = "template_R29tRKrv";
  emailjs.send(service_id, template_id, template_params)
    .then(
        function(response) {
            console.log("SUCCESS. status=%d, text=%s", response.status, response.text);
            alert('寄送成功喔！請靜候回覆');
            document.ContactForm.reset();
            $('html, body').animate({
              scrollTop: $('body').offset().top
            }, 2000);
        },
        function(error) {
            console.log("FAILED", error);
            alert('寄送失敗，如有問題請直接以信箱聯絡我');
            window.location.reload();
        });
});

/* ---- particles.js config ---- */

particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 380,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });
  
  
  