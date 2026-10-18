(function ($, Drupal, once) {
  "use strict";

  Drupal.behaviors.zircon = {
    attach: function (context) {
      $(once('zircon-back-to-top', '.btn-btt', context)).each(function () {
        $(this).smoothScroll({speed: 1000});
      });
      $(once('zircon-search', '#search-block-form input[name="keys"]', context))
        .attr('placeholder', Drupal.t('Keywords'));

      once('zircon-scroll', 'html', context).forEach(function () {
        var update = function () {
          $('.btn-btt').toggle($(window).scrollTop() > 200);
        };
        $(window).on('scroll.zircon resize.zircon', update);
        update();
      });
    }
  };
})(jQuery, Drupal, once);
