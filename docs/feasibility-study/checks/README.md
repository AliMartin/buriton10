# Reusable checks

These checks were developed during the theme preparation and exercised against
the Drupal 10 checkpoint. They support the broader acceptance plan; they are
not a substitute for a browser/device review or a production deployment test.

## Drupal rendering and assets

The implementation copy is `tools/check-theme.php`; a portable reference copy is
in `../reference-files/check-theme.php`. It is CLI-only and returns 403 over HTTP.

From the project root:

```sh
ddev exec env THEME_QA_THEME=zircon vendor/bin/drush php:script tools/check-theme.php
ddev exec env THEME_QA_THEME=buriton5 vendor/bin/drush php:script tools/check-theme.php
ddev exec env THEME_QA_THEME=claro vendor/bin/drush php:script tools/check-theme.php
```

If the DDEV URL changes, also set `THEME_QA_BASE_URL` to the new absolute site
URL. The script selects the active theme only for its process and switches to
an appropriate account for public/admin checks; it does not save a different
default theme in configuration. It does use the real Drupal runtime and caches.

Checks include Twig compilation, public or admin page rendering, warning and
asset-file checks, two-sidebar grid assertions for the custom themes and the
Buriton5 parent-CSS override. Adminimal/Seven were also checked in the independent
theme fixture where those themes were installed; do not enable unused themes
on the real site merely to reproduce that fixture.

## Zircon JavaScript regression fixture

The previously temporary JavaScript fixture has been preserved here and made
portable by accepting the repository root as an argument. Its npm lock pins the
tested resolution, including jQuery 3.7.1 and jsdom 26.1.0.

Run from this `checks` directory:

```sh
npm ci --ignore-scripts
npm test -- ../../..
```

Or pass an absolute path to the Drupal project root. The test needs the project's
actual `core/assets/vendor/once/once.min.js` and Zircon assets. `node_modules` is
ignored locally and is not part of the handover.

It verifies single carousel/slider initialisation, retention of slideshow
content, repeat behavior attachment, AJAX insertion, one scroll handler, a real
search placeholder and preservation of the original contact-form DOM. It does
not send mail or contact external services. jsdom does not provide full browser
layout, touch rendering or visual accessibility testing.
The portable fixture was rerun successfully against the Drupal 10 working copy
while this handover was prepared.

## Additional recorded checks

The HTTP test fetched the homepage, minutes, contact, login, Aggregator sources,
BBC source and RSS endpoints and all distinct local CSS/JavaScript URLs they
referenced. Its results are in `../evidence/http-verification.json`. Recreate
this check for the actual URL; do not count an HTTP 200 as proof of visual or
form-delivery correctness.

Also repeat Composer validation/platform/audit, `drush updatedb:status`, the
Drupal status report and the baseline-data comparisons when migrating a new
copy. Upgrade Status's Aggregator manual findings are retained in evidence;
the study did not suppress them to obtain a clean-looking report.

## Composer-managed libraries

The later library conversion added `tools/check-libraries.php`. It checks that
every Composer `drupal-library` package is installed in the correct directory,
that referenced asset files exist and that no unmanaged library directories
remain. It is CLI-only and does not rely on Webform's CDN fallback.

```sh
ddev drush php:script tools/check-libraries.php
ddev drush webform:libraries:status
```

The additional JavaScript smoke fixture uses the actual project's jQuery and
downloaded library files. From this `checks` directory after `npm ci`:

```sh
npm run test:libraries -- ../../..
```

It exercises Inputmask formatting and basic Select2, telephone, timepicker and
Choices setup, and checks editor/widget APIs. This is not full browser testing
of all Webform elements. See [the library record](../05-composer-libraries.md).
