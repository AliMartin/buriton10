(function ($, Drupal, once) {
  "use strict";

  Drupal.behaviors.zirconCarousel = {
    attach: function (context) {
      $(once('zircon-carousel', '.carousel-responsive', context)).each(function () {
        if ($(this).hasClass('slick-initialized')) {
          return;
        }
        $(this).slick({
          dots: false,
          infinite: true,
          speed: 300,
          slidesToShow: 4,
          slidesToScroll: 4,
          responsive: [
            {breakpoint: 992, settings: {slidesToShow: 3, slidesToScroll: 3, dots: true}},
            {breakpoint: 768, settings: {slidesToShow: 2, slidesToScroll: 2, dots: true}},
            {breakpoint: 480, settings: {slidesToShow: 1, slidesToScroll: 1, dots: true}}
          ]
        });
      });
    }
  };
})(jQuery, Drupal, once);
