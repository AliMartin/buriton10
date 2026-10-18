# Work completed and decisions

This is a technical reconstruction from the working files, saved before/after
Composer locks, backups and validation output. It is not a complete terminal
transcript. Version snapshots are in [evidence/package-versions.json](evidence/package-versions.json).
No production changes were made.

## 1. Initial review and dependency preparation on Drupal 9

The working copy used Drupal 9.5.11 in a legacy layout: `composer.json`, `core/`,
`modules/`, `themes/` and `sites/` are at the repository root. Commands copied from
recommended-project tutorials that assume a `web/` directory need adapting.

The actual default theme was the custom `themes/custom/zircon`; administration
used Claro. Buriton5 was installed as an alternative custom subtheme. A second
Composer-installed Zircon copy had the same machine name, but was not the
custom implementation supplying the site. Discovery and actual active paths
were checked rather than inferring the active theme from package names.

Composer was reviewed and module release constraints updated while retaining
Drupal 9 during preparation. These version changes were made before core 10:

| Package | Initial recorded version | Drupal 9 preparation result |
| --- | --- | --- |
| `drupal/adminimal_admin_toolbar` | 1.11.0 | 2.0.0 |
| `drupal/captcha` | 1.16.0 | 2.0.10 |
| `drupal/image_field_to_media` | 1.0.2 | 2.0.2 |
| `drupal/upgrade_status` | 3.19.0 | 4.3.10 |

The old core/dependency set triggered Composer security blocking. The owner
explicitly authorised a one-command security-blocking override for the legacy
preparation. The CLI flag used was `--no-security-blocking`; no permanent audit
disable or blanket advisory ignore was left in `composer.json`. The coordinated
Drupal 10 update later succeeded with normal security blocking enabled.

Broad updates on Drupal 9 were not a reliable way to choose the final package
set. A newer Admin Toolbar dependency declaration caused resolution trouble,
and targeted updates were used during preparation. Keep the successful lock
files and review dependency plans instead of assuming every latest release can
be installed on Drupal 9.

## 2. Removed unused Popup Message

`popup_message` was confirmed not installed/enabled in Drupal's active
configuration. Its Composer dependency and downloaded code were removed. The
unused popup CSS/library entry and close icon in custom Zircon were removed too:

- `themes/custom/zircon/zircon.libraries.yml`
- `themes/custom/zircon/css/popup.css`
- `themes/custom/zircon/img/close.png`

No forced uninstall or deletion of unrelated content was required. Repeat the
usage/configuration check against the fresh production copy: this finding is
specific to the study snapshot.

## 3. Repaired Views Slideshow's missing hoverIntent library

The warning on Upgrade Status was caused by a genuinely missing file:
`libraries/jquery.hover-intent/jquery.hoverIntent.js`. It surfaced while Drupal
was aggregating JavaScript; it was not a theme-specific PHP compatibility error.

A reproducible Composer `package` repository was added for
`briancherne/jquery.hover-intent` 1.10.2, using the upstream GitHub tag archive and
the `drupal-library` installer type. Requiring `^1.10.2` installs the file at the
path expected by Views Slideshow. Existing Composer installer paths were kept.
The final manifest contains the exact repository definition and URL.

## 4. Updated contributed themes and base-theme dependencies

| Component | Drupal 9 bridge | Tested Drupal 10 checkpoint |
| --- | --- | --- |
| Bootstrap5 | 2.0.10 to 3.0.16 | 4.0.8 |
| Classy | Contributed 1.0.2 added alongside core | Contributed 2.0.3 |
| Stable | Contributed 2.0.1 added alongside core | Contributed 2.1.0 |
| Stable9 | Core theme explicitly enabled | Core theme retained |
| Adminimal | 1.7, compatible stable release at the time | 1.7 retained |
| Seven | 1.0 | 1.0 retained |

Core Classy and Stable disappear in Drupal 10, so their contributed packages
were explicit dependencies. Adminimal and Seven were tested in the isolated
Drupal 10 fixture; they are not the working site's selected administration theme.

The Drupal 9 Bootstrap5 bridge was deprecated upstream. The temporary constraint
was `^3.0.16 || ^4.0.8`; after the core update it became `^4.0.8`. Classy and Stable
constraints similarly moved to their Drupal 10-compatible branches. The unused
`drupal/zircon` duplicate was removed; custom Zircon remains authoritative.

### Bootstrap5 migration patch

Bootstrap5's post-update routine tried to uninstall Classy and Stable, even when
another installed theme still required them. This would break the migration
because Zircon extends Classy, which in turn needs Stable.

`patches/bootstrap5-preserve-required-base-themes.patch` checks installed themes'
base-theme dependencies before uninstalling either base. It applied cleanly to
both Bootstrap5 3.0.16 and 4.0.8, and the migration was exercised on Drupal 9 and
the isolated Drupal 10 fixture. It is maintained through Composer Patches 2.0,
with its checksum in `patches.lock.json`, rather than an unrecorded vendor edit.

Keep `cweagans/composer-patches`, its plugin permission, the root patch definition,
patch file and patch lock together. When editing a patch, the workflow is
`composer patches-relock` then `composer patches-repatch`. Repatching reinstalls
patched packages, so never put local-only customisations in those vendor folders.

## 5. Updated Buriton5

Changes in `themes/custom/buriton5/`:

- Compatibility declaration now includes Drupal 9.5 / Drupal 10.1+; explicit
  Bootstrap5 dependency added.
- Replaced obsolete `stylesheets-remove` with `libraries-override` to remove
  only the parent's compiled CSS, retaining required parent JavaScript.
- Updated the HTML template for the parent colour-mode attribute and a
  keyboard-focusable skip link.
- Corrected the two-sidebar grid to 3/6/3; one sidebar remains 4/8.
- Added navigation labels and removed an undefined sub-footer class variable.
- Allowed footer wrapping and replaced a Font Awesome-dependent navigation
  indicator with a CSS triangle.
- Rebuilt `css/style.css` and its source map. Sass source compiled against both
  parent 3.0.16 and 4.0.8; the final CSS uses 4.0.8.
- Added build/maintenance instructions to the theme README.

Dart Sass 1.98.0 produced upstream deprecation warnings but completed. Build
from the subtheme directory with `sass --style=compressed scss/style.scss css/style.css`.

## 6. Updated custom Zircon

Changes in `themes/custom/zircon/`:

- Replaced stale core/project metadata with an explicit custom theme description,
  Drupal 9.5/10 requirement and Classy dependency.
- Replaced `core/jquery.once` with `core/once`; the three custom scripts now use
  Drupal behaviors and per-element attachment guards, including AJAX content.
- Search uses a real placeholder instead of submitting the word "Keywords".
  Removed the old Firefox/form-DOM reconstruction workaround, preserving form
  elements and their attached handlers.
- Prevented duplicate window scroll/resize handlers, Slick instances and
  FlexSlider initialisation. Removed duplicate FlexSlider loading.
- Retained slideshow images and linked captions while replacing the legacy
  initialisation; use FlexSlider touch controls, pause/play and reduced-motion
  handling.
- Stopped loading obsolete IE scripts and unused Jssor scripts. This did not
  indiscriminately delete all old bundled demo/vendor directories.
- Fixed the Monokai stylesheet path (`monokai.min.css`, not `monokai.min/css`).
- Removed zoom-restricting viewport duplication, fixed logo rendering and
  navigation labels, and made the main-content target focusable.
- Calculated widths for zero, one or two sidebars; defaulted optional Views grid
  class arrays to avoid undefined values.
- Preserved the existing analytics/widget integrations; moving analytics into
  the document head was not a review of tracking or consent arrangements.

Loaded bundled assets were updated from upstream distributions:

| Library | Previous | Final | Source |
| --- | --- | --- | --- |
| Bootstrap | 3.2 | 3.4.1 | `bootstrap` npm tarball |
| FlexSlider | 2.5 | 2.7.2 | `flexslider` npm tarball |
| Slick | 1.3.6 | 1.8.1 | `slick-carousel` npm tarball |

Matching CSS/JS, minified distributions and font resources were supplied; licence
headers were retained. This preserves Zircon's existing framework. Bootstrap 3
is end-of-life: a Bootstrap 5 rebuild/redesign is a separate scope decision.

[The change manifest](evidence/custom-theme-changes.json) lists affected theme
files and before/after hashes. [The source diff](evidence/custom-theme-source.diff)
records non-vendor PHP/Twig/YAML/SCSS/JS changes against the pre-theme backup.
It deliberately omits compiled CSS/maps, vendor distributions and binary assets;
use the actual checkpoint theme directories for the complete implementation.

## 7. Coordinated Drupal 10 and Aggregator upgrade

The site was put into local maintenance mode after backups and dependency
previews. Core Composer packages moved to `^10.6.19`, Aggregator was added at
`^2.2`, and Drush moved to `^12.5`. The normal update was:

```sh
ddev composer update --with-all-dependencies --no-interaction
ddev drush updatedb --yes
```

An initial dry-run tried to downgrade Rules and Typed Data to satisfy the old
Rules constraint. This was corrected **before installation** by moving Rules
from `^3.0@alpha` to `^4.0`. Final installed versions are Rules 4.0.1 / Typed Data
2.1.1. The final update also selected compatible newer contributed modules;
the version snapshots record all transitive and direct package changes.

Aggregator was **not uninstalled**. Drupal discovered the contributed copy at
`modules/contrib/aggregator`, preserving existing tables, feed IDs, Views, roles
and block placements. Its update hooks migrated settings and text format,
removed an obsolete field and populated item UUIDs. Both feed definitions and
all existing item fields match the saved checksums after migration.

The BBC feed has 2,314 items and blocks in Zircon's `panel_second_2` and Buriton5's
`footer`. The second feed, Local Neighbourhood Watch, had no items before or after
the migration. Its URL needs separate review if the council still wants it.

Core enabled `phpass` for legacy password compatibility. Admin Toolbar Links
Access Filter became obsolete on Drupal 10.3+ and was uninstalled after the
status report flagged it; Admin Toolbar itself remains installed. All pending
database updates completed, caches were rebuilt and maintenance mode disabled.

## 8. Local environment and configuration reconciliation

DDEV now declares `drupal10`, retaining PHP 8.2 and the existing database. A stale
sync path in local settings was replaced, **only inside the DDEV conditional**,
with the repository `sync/` directory. Production settings were not repointed.

Direct access to `/sync/core.extension.yml` initially returned 200 on local nginx.
A local nginx rule now denies `/sync` and `/sync/`, and `sync/.htaccess` supplies
Apache protection. The local URL now returns 403. Apache rules do not protect
nginx hosting; production must use equivalent rules or keep exports outside the
public document root.

Configuration export was staged separately. The original database was restored
into an isolated `buriton9_upgrade_baseline` comparison database. Database
migration changes were merged into the existing exports without importing them
into the running site or overwriting unrelated file changes. The merge treated
nulls, booleans and ordering changes explicitly. It updated 120 files and retained
the same five pre-existing differences:

| Configuration | Existing difference retained |
| --- | --- |
| `core.extension` | Database and export differ |
| `upgrade_status.settings` | Database only |
| `views.view.parish_council_financial_reports` | Database only |
| `webform.webform.contact` | Database and export differ |
| `webform.webform.contact_buriton_village_hall` | Database and export differ |

Do not blindly import the study's entire configuration export over a fresh live
copy. Reconcile that site's actual differences, especially Webform handlers.

## 9. Validation and current limits

An independent temporary Drupal 10.6.19/SQLite fixture was first used to test
the themes with Twig 3, Bootstrap5 4.0.8, Classy 2.0.3, Stable 2.1.0, Adminimal
1.7 and Seven 1.0. The actual site's core upgrade was then tested separately.

The reusable theme check compiles templates, renders public/admin routes,
checks resolved local assets, asserts the two-sidebar layout and verifies the
Buriton5 stylesheet override. JavaScript tests cover repeated behavior attachment,
AJAX insertion, slideshow content, event duplication and form preservation.
The portable checks are documented in [checks/README.md](checks/README.md).

The real upgraded site's public pages and generated assets passed. Upgrade
Status opens; Aggregator is no longer a deprecated core module. Its contributed
scan still has manual-review findings involving newer-core attributes/JSON:API
symbols and absent PHPUnit test APIs. Drupal 10 annotation/procedural fallbacks
and conditional compatibility callbacks were inspected; findings were not hidden.

The final Drupal requirements report has no errors. Remaining warnings concern
local writable settings, Tour and core security coverage ending 9 December 2026.
That date was the report's observation on the study date; verify the support
calendar again before scheduling production work.

The owner has performed an initial local visual test. Full browser/device,
editing, form-delivery, permission, accessibility and live-hosting acceptance
testing has not been completed. No Drupal 11 deployment, external email test or
production rollback rehearsal has yet been demonstrated.

## 10. Follow-up: Composer-managed libraries

After the main study record was prepared, `/libraries` was converted to fully
Composer-managed downloads and excluded from Git. This added the standard
Webform merge-plugin catalogue and project-specific library definitions,
aligned old Webform files with the installed module's expected versions and
archived eleven unused legacy directories. No previously locked package version
was changed. See [the library implementation record](05-composer-libraries.md)
for the complete setup, version changes, backup and validation evidence.
