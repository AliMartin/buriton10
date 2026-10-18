(function ($, Drupal, once) {
  "use strict";

  Drupal.behaviors.zirconSlideshow = {
    attach: function (context) {
      once('zircon-slideshow', '#slideshow_container', context).forEach(function (element) {
        var container = $(element);
        if (!container.children('ul.slides').length) {
          var slides = $('<ul class="slides"></ul>');
          container.children('[u="slides"]').children().each(function () {
            var row = $(this);
            var image = row.find('.views-field-field-slideshow img, .views-field-field-image img').first();
            if (!image.length) {
              return;
            }
            var imageLink = image.closest('a');
            var slide = $('<li></li>').append((imageLink.length ? imageLink : image).clone());
            var title = row.find('.views-field-title a').first();
            if (title.length) {
              slide.append($('<p class="flex-caption"></p>').append(title.clone()));
            }
            slides.append(slide);
          });
          if (!slides.children().length) {
            return;
          }
          container.empty().append(slides);
        }
        container.flexslider({
          animation: 'slide',
          pauseOnHover: true,
          pausePlay: true,
          pauseText: Drupal.t('Pause'),
          playText: Drupal.t('Play'),
          slideshow: !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        });
      });
    }
  };
})(jQuery, Drupal, once);
