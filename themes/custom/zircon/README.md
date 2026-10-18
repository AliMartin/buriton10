# Buriton Zircon

This is Buriton's maintained custom copy of Zircon, supporting Drupal 9.5 and 10.
The duplicate `drupal/zircon` Composer package is intentionally removed: it had
the same machine name and did not supply the custom theme actually used here.

Classy remains the base theme to preserve existing markup and styling. Composer
explicitly supplies contributed Classy and Stable for the Drupal 10 transition.
Drupal 9 continues to use its core copies of those base themes.

The custom scripts use Drupal behaviors and `core/once`. They support AJAX
attachment without duplicate listeners or slider instances. The old form DOM
replacement and placeholder polyfill have been removed. FlexSlider supplies its
own touch support and pause/play controls; reduced-motion preferences disable
automatic playback.

Bundled assets loaded by `zircon.libraries.yml`:

| Library | Version | Upstream package |
| --- | --- | --- |
| Bootstrap | 3.4.1 | https://registry.npmjs.org/bootstrap/-/bootstrap-3.4.1.tgz |
| FlexSlider | 2.7.2 | https://registry.npmjs.org/flexslider/-/flexslider-2.7.2.tgz |
| Slick | 1.8.1 | https://registry.npmjs.org/slick-carousel/-/slick-carousel-1.8.1.tgz |

Their licence headers and font resources are preserved. Bootstrap 3 remains an
upstream end-of-life dependency; a Bootstrap 5 redesign is a separate transition.
The two Bootstrap major versions must not be loaded together on the same page.

Run the rendering and asset check without changing the site's selected theme:

```sh
ddev exec env THEME_QA_THEME=zircon vendor/bin/drush php:script tools/check-theme.php
```
