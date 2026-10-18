# Composer-managed browser libraries

Follow-up to the Drupal 10 rehearsal, recorded 18 October 2026. The `/libraries`
directory is now entirely installed through Composer and ignored by Git.
Drupal core and all previously locked dependency versions were unchanged by
this work. The local site is out of maintenance mode; production was not changed.

## Implementation

The root `composer.json` now requires and permits
`wikimedia/composer-merge-plugin:^2.1`. Its merge configuration includes:

- `modules/contrib/webform/composer.libraries.json`: Webform's own library
  catalogue, tied to the installed module version (6.3.1 at this checkpoint).
- Root `composer.libraries.json`: FitVids, jQuery Cycle, JSON2 and the iframe
  plugin, with pinned versions and the correct Drupal installation directory names.

The existing `composer/installers` rule installs `drupal-library` packages under
`libraries/{$name}`. Package `extra.installer-name` values preserve directory
names such as `jquery.cycle` instead of inventing paths the modules cannot find.
The already-managed hoverIntent and transitive FakeObjects packages remain.

The lock file now contains **23 browser-library packages**. This change added
21 library packages plus the merge plugin. It did not update or remove any
previously locked package. No permanent security override was introduced.

Webform's catalogue covers optional features too, including currently excluded
Chosen. Installing a library does not enable its Webform feature or module.
The catalogue is the module-maintainer's version set, not an attempt to upgrade
every JavaScript project to its latest major release.

## Deliberate version alignment

The original manual Webform files were much older than the versions expected
by Webform 6.3.1. For example:

| Library | Previous files | Composer-installed version |
| --- | --- | --- |
| CodeMirror | 5.21.0 | 5.65.12 |
| Inputmask | 3.3.3 | 5.0.9 |
| International Telephone Input | 11.0.0 | 17.0.19 |
| Select2 | 4.0.3 | 4.0.13 |
| Signature Pad | 1.5.3 | 2.3.0 |
| FitVids | 1.1 | 1.1.0 release |
| jQuery Cycle | 3.0.3 | 3.0.3 |
| JSON2 | 2016-10-28 snapshot | 2023-05-10 upstream commit |
| iframe plugin | Legacy 2022 copy | 4.22.1 |

Some libraries that previously fell back to Webform's CDN are now local.
Webform's status display labels a found directory with the *expected* version;
that alone did not establish the actual version of the old files. The new lock
file and fresh downloads establish which distributions are installed.

JSON2 has no release version scheme matching the old manual file. Its custom
package uses the upstream commit date as the version and pins the archive URL
to commit `7e83f38a2312429fd4933169c1f6a27fd65e889c`, not a moving `master` download.
Its source identifies it as public-domain code.

## Retired manual directories

All 24 previously unmanaged directories were moved to the ignored private
archive before installation. Thirteen were replaced at their normal paths by
Composer packages. These eleven unused directories were not recreated:

```text
ckeditor
ckeditor.autogrow
ckeditor.codemirror
ckeditor.fakeobjects
ckeditor.image
ckeditor.link
geocomplete
jquery.geocomplete
jquery.icheck
jquery.toggles
jquery.word-and-character-counter
```

The configured text formats use CKEditor 5, and the old CKEditor modules are
disabled. The installed Webform no longer references those retired library
paths. The iframe and FakeObjects libraries are still supplied through Composer
for the existing, disabled module chain; this does not re-enable CKEditor 4.
When that chain is removed during the Drupal 11 work, review the explicit iframe
requirement in `composer.libraries.json` as part of the cleanup.

## Files to commit and carry into the next repository

- `composer.json`, **`composer.libraries.json`**, `composer.lock` and `.gitignore`.
- Existing patch files and `patches.lock.json`.
- `tools/check-libraries.php`, the existing theme check and this documentation.

Commit the manifests and lock, not `/libraries`. The old Git exceptions for
`libraries/jqueryinstagramfeed` and `libraries/slick` were removed; neither
directory existed here. This checkout had no tracked files under `/libraries`,
so no `git rm --cached` operation was necessary.

On a new checkout, use the normal build command:

```sh
composer install --no-interaction
```

For production, also apply the project's agreed `--no-dev`/autoload build policy.
Do not copy generated library files manually or add post-install `curl`/Drush
download commands. The Composer merge plugin and both merged manifests must be
available; keep the module-supplied Webform catalogue inside the installed
Webform package rather than editing that vendor file.

When updating Webform, review its changed library catalogue and update the
affected library packages with a reviewed Composer dependency plan. An unchanged
lock file deliberately keeps existing downloads pinned. Use a catalogue that
matches the module actually installed at that migration stage; do not impose
the Drupal 10 checkpoint's Webform catalogue on an older Drupal 9 module version.

## Verification

- Composer validate passes; a normal lock-file install dry-run has nothing to
  install/update/remove. The recorded audit has no known advisories. Composer's
  advisory coverage is not a comprehensive security audit of browser libraries.
- All 23 Composer library directories are present, no unmanaged library
  directories remain, and 40 referenced/direct-consumer asset files exist.
  The check reads original YAML so a CDN fallback cannot hide missing files.
- Webform reports its included libraries as locally installed.
- Zircon's template/render/asset checks pass.
- JavaScript smoke checks pass with the site's actual jQuery: Inputmask value
  formatting, Select2, telephone input, timepicker and Choices initialisation;
  CodeMirror, Signature Pad and Text Counter APIs are present.
- Webform's contact administration page renders successfully. Public pages and
  their local assets were checked again: four public endpoints and 21 distinct
  local CSS/JavaScript URLs returned 200. Results are saved in evidence.

Reusable commands:

```sh
ddev drush php:script tools/check-libraries.php
ddev drush webform:libraries:status
```

The JavaScript fixture is `checks/check-libraries.cjs`; see
[the check instructions](checks/README.md). These checks do not replace browser
testing of every Webform widget or actual contact-message delivery.

## Backup and evidence

Original files, manifests, file hashes and moved directories are retained in:

`.ddev/upgrade-study-archive/libraries-before-composer/`

The original tar archive is `libraries.tar.gz`. `manual-directories/` holds the
moved originals, including directories replaced by Composer. The archive stays
ignored and private. The earlier Drupal 10 checkpoint is deliberately retained
as historical evidence; this follow-up has its own library checkpoint record,
reference manifests and verification files in the knowledge folder.
Rollback of this library-only step restores its original Composer files and
complete library tree; this step did not run database schema migrations.

The approach follows [Webform's Composer library guidance](https://www.drupal.org/docs/contributed-modules/webform/webform-libraries).
