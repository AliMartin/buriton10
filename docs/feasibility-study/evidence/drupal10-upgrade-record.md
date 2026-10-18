# Drupal 10 and Aggregator upgrade

Completed locally on 18 October 2026. Production has not been changed.

## Result

| Component | Before | After |
| --- | --- | --- |
| Drupal core and core Composer packages | 9.5.11 | 10.6.19 |
| Aggregator | Core 9.5.11 | Contributed 2.2.6 |
| Drush | 11.6.0 | 12.5.3 |
| Rules | 3.0.0-alpha9 | 4.0.1 |
| Typed Data | 2.0.0 | 2.1.1 |
| Bootstrap5 | 3.0.16 | 4.0.8 |
| Classy | 1.0.2 | 2.0.3 |
| Stable | 2.0.1 | 2.1.0 |

Composer updated compatible contributed modules and transitive dependencies.
The final manifest and lock file validate, platform requirements pass, and
`composer audit` reports no known security advisories or abandoned packages.
The normal security blocker remained enabled for this upgrade.

Aggregator remained enabled throughout: it was never uninstalled. All database
updates completed. Its feed definitions and existing item fields have identical
checksums before and after migration. The two feeds, 2,314 items, 1,880 nodes and
six users are retained. New Aggregator item UUIDs were populated by its updates.
The BBC feed blocks retain their existing IDs and placements in Zircon and
Buriton5. The Neighbourhood Watch feed still has no stored items; its source
URL should be reviewed separately if that feed is needed.

The obsolete `admin_toolbar_links_access_filter` submodule was uninstalled:
Drupal core now provides its functionality. Admin Toolbar remains installed.
Core's update process enabled `phpass` for existing password compatibility.
Zircon remains the default theme, and Claro remains the administration theme.
Buriton5 CSS and its source map were rebuilt against Bootstrap5 4.0.8. The
Composer-managed Bootstrap5 base-theme preservation patch is still applied.

## Configuration and environment

- DDEV now declares the `drupal10` project type, retaining PHP 8.2 and the
  existing database and URL.
- The DDEV-specific settings use the repository's `sync` directory, replacing
  the stale local path. Production settings retain their existing sync path.
- `.ddev/nginx/config-sync.conf` blocks `/sync` and `/sync/`; `sync/.htaccess`
  provides the equivalent Apache protection. Local requests to exported YAML
  now return 403. Production nginx must have an equivalent rule if this
  directory is deployed inside its document root.
- 120 configuration files capture database migrations and the obsolete
  submodule removal. Changes were compared with a separate restored copy of
  the pre-upgrade database before merging.
- Five pre-existing database/export differences were preserved: `core.extension`,
  `upgrade_status.settings`, the financial-report View and the two contact
  Webforms. The settings and financial-report View were already database-only.
  Configuration import therefore still needs review of these existing
  differences; the upgrade did not import configuration files into the database.

## Verification

- No database updates remain pending.
- Both custom themes compile all their Twig templates and render login/password
  pages without warnings or missing assets. Their two-sidebar layouts and
  Buriton5's parent CSS override pass the reusable theme check.
- Claro renders the site-information and status administration pages.
- HTTP 200: homepage, parish council minutes, contact, login, Aggregator sources,
  BBC source page and Aggregator RSS. The BBC block is present on the homepage;
  all 15 distinct local CSS/JavaScript URLs used by these pages load successfully.
- Upgrade Status renders successfully. Its deprecated-core list no longer
  contains Aggregator. Tour is now listed for the next Drupal 11 stage.
- Available-update metadata was refreshed. Drupal's final requirements report
  contains no errors; its remaining warnings concern writable local settings,
  Tour and core security coverage ending on 9 December 2026.
- The contributed Aggregator scan produces manual-review findings for
  newer-core attributes, a newer JSON:API symbol and missing PHPUnit test APIs
  in this Drupal 10/runtime dependency set. The entity classes retain Drupal 10
  annotations, procedural hooks delegate to the hook classes, and the JSON:API
  constant uses a version-dependent compatibility callback. These findings
  have not been hidden or suppressed; the runtime checks above pass.

Full visual acceptance testing is still needed before production deployment.
Drupal 10 is the intermediate step toward Drupal 11, which should be completed
before that security-coverage deadline. Tour needs replacement or
removal for that step, and Zircon's bundled Bootstrap 3 remains end-of-life.
Local writable settings-file warnings are also separate from this migration.

## Backup and rollback

The host backup directory is:

`/private/tmp/buriton-before-d10-h0gik8wl`

It contains the database dump, original Composer files, original configuration
and custom themes, scaffold files, data checksums, migration/export comparisons
and verification logs. Copy it to durable storage before relying on it for a
production deployment. A temporary comparison database named
`buriton9_upgrade_baseline` was used locally.

Rollback requires restoring both the original Composer lock/dependencies and
the matching database, custom themes, configuration and environment settings.
Restoring Drupal 9 code alone after the database migrations is not sufficient.
