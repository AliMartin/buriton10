# Drupal 10 theme preparation

The theme preparation was followed by the coordinated core and Aggregator
upgrade on 18 October 2026. The working site now runs Drupal 10.6.19, with
Zircon as the default theme and Claro for administration. See
[the upgrade record](drupal10-upgrade.md) for migration and verification details.

| Theme | Previous Drupal 9 version | Current Drupal 10 version |
| --- | --- | --- |
| Buriton Zircon | Custom Drupal 9.5/10 implementation | Same custom theme |
| Buriton5 | Custom Drupal 9.5/10.1+ subtheme | Same custom subtheme |
| Bootstrap5 | 3.0.16 bridge | 4.0.8 |
| Classy | Core; contributed 1.0.2 also installed | Contributed 2.0.3 |
| Stable | Core; contributed 2.0.1 also installed | Contributed 2.1.0 |
| Stable 9 | Core, enabled as the Bootstrap5 dependency | Core |
| Adminimal | 1.7, latest compatible stable release | 1.7 |
| Seven | 1.0, latest compatible stable release | 1.0 |
| Claro | Supplied by core | Supplied by core |

The unused contributed Zircon duplicate has been removed. The custom copy is
authoritative. Adminimal and Seven remain available; they are not selected on
the working site. Their current stable releases already declare Drupal 10
compatibility, so their vendor source is not edited.

## Changes

- Explicit Classy and Stable Composer requirements retain the base themes that
  leave Drupal core in Drupal 10.
- A Composer-managed Bootstrap5 patch prevents its post-update routine from
  uninstalling Classy or Stable while another installed theme requires them.
  This matters because Zircon still extends Classy. The patch applies to both
  Bootstrap5 3.0.16 and 4.0.8; `patches.lock.json` records its checksum. Keep the
  patch, lock file and Composer files together when deploying. Composer Patches
  applies it automatically on installation; after editing the patch, run
  `composer patches-relock` followed by `composer patches-repatch`.
- Both custom compatibility declarations now include Drupal 10.
- Buriton5 uses `libraries-override`, a keyboard-focusable skip link, the parent
  theme's colour-mode attribute, a corrected two-sidebar grid and rebuilt CSS.
- Zircon replaces `core/jquery.once` with `core/once` and attaches custom scripts
  once per element, including after AJAX requests. It no longer replaces contact
  forms or submits search placeholders as input values.
- Zircon loads FlexSlider once, uses its native touch controls, and updates
  Bootstrap 3, Slick and FlexSlider distributions. The invalid Monokai CSS path
  is repaired. Obsolete IE scripts and unused Jssor scripts are no longer loaded.
- Zircon preserves mobile zoom, fixes its logo URL and accessible navigation
  labels, and calculates column widths for zero, one or two sidebars.

## Verification

During preparation, Upgrade Status reported no known Drupal 10 issues in Zircon,
Buriton5 and the Bootstrap5 3.0.16 bridge. The bridge has now been replaced by
Bootstrap5 4.0.8, and both custom themes pass rendering and asset checks on the
upgraded working site.

Both custom themes were checked on the working Drupal 9.5.11 site and a separate
temporary Drupal 10.6.19 installation with Twig 3, Bootstrap5 4.0.8, Classy 2.0.3
and Stable 2.1.0. Verification includes template compilation, page rendering,
local library file existence, the parent CSS override and the two-sidebar grid.
Adminimal and Seven are also checked in that isolated Drupal 10 installation.
The patched base-theme migration is checked on both core versions, and the
working site's pending Bootstrap5 database updates have been applied.
HTTP checks of the working homepage, parish council minutes, contact and login
pages returned 200, as did all nine distinct generated local CSS/JavaScript
assets used by those pages. The configured themes remain Zircon and Claro.

The JavaScript regression check uses jQuery 3.7.1 and a DOM fixture to verify
slideshow content, repeated Drupal behavior attachment, AJAX carousel insertion,
single event registration, search placeholders and contact-form preservation.

The reusable CLI check is `tools/check-theme.php`:

```sh
ddev exec env THEME_QA_THEME=zircon vendor/bin/drush php:script tools/check-theme.php
ddev exec env THEME_QA_THEME=buriton5 vendor/bin/drush php:script tools/check-theme.php
```

Full visual acceptance testing across browser/device combinations is still
needed before production deployment. Bootstrap 3 in Zircon is end-of-life,
and these checks do not establish Drupal 11 compatibility. The coordinated
core upgrade resolves the previous Composer advisories; the final Composer
audit reports none. The stale local configuration-sync path has also been
corrected and HTTP access to configuration exports blocked.
