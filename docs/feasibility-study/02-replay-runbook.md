# Replay the Drupal 9-to-10 stage

Use this on a **new isolated copy of the live site**, not as a script to rerun
over the already-upgraded study database. The sequence below is a reusable
procedure reconstructed from the successful rehearsal. Some commands are
templates: substitute the correct backup path, site URL and reviewed packages.

The study used DDEV. Equivalent hosting commands omit `ddev` and use the correct
PHP/Composer/Drush binaries for that environment. Do not assume production has
DDEV, the same PHP/database versions or the same filesystem paths.

## A. Establish the new baseline

1. Copy fresh production code, database and both public/private uploaded files.
   Configure a separate database, domain and local credentials. Arrange safe
   handling of outgoing mail, scheduled backups and other live integrations in
   the rehearsal environment.
2. Confirm actual default/admin themes, enabled modules, Composer versions,
   PHP/database versions and pending database updates. Record the live commit
   or code snapshot, database capture time and content counts.
3. Back up the matching code/configuration, lock file, database and files to
   private durable storage. Verify the dump is readable and rollback is possible.
4. Run Upgrade Status and Composer checks appropriate to that fresh baseline.
   Compare with this study; identify any live changes made since the rehearsal.

Useful baseline commands:

```sh
ddev drush status
ddev drush config:get system.theme
ddev drush pm:list --status=enabled
ddev drush updatedb:status
ddev drush config:status
ddev composer validate --no-check-publish
ddev export-db --file=/YOUR-PRIVATE-BACKUP-PATH/before-upgrade.sql.gz
```

`ddev export-db --file` takes a **host** path. Ordinary `ddev exec` paths refer
to the container, whose project root here is `/var/www/html`.

## B. Reapply the prepared Drupal 9 changes where needed

Use [the work record](01-work-completed.md) and the actual code checkpoint.

- Apply the custom theme source changes and complete vendor assets; rebuild
  Buriton5 CSS against the parent actually installed for this stage.
- Update the four module branches recorded in the work log. Check and apply
  their pending Drupal 9 database updates before replacing core.
- Remove Popup Message only after confirming the fresh site does not use it.
- Add the Composer-managed hoverIntent library; confirm its expected file exists.
- Remove the contributed Zircon duplicate only after confirming custom Zircon
  is the authoritative implementation on the fresh site.
- Supply contributed Classy and Stable. If retaining an operational Drupal 9
  checkpoint, use the temporary bridge constraints recorded in the work log;
  the final Drupal 10 `composer.json` cannot itself be installed as Drupal 9.
- Configure Composer Patches and apply the Bootstrap5 post-update guard **before
  running the theme's database updates**. Enable Stable9 as required.

The original legacy security override was exceptional and explicitly authorised.
First attempt normal resolution. If an unsupported Drupal 9 baseline prevents
preparation, document the specific conflict and narrowly scope any approved
override. Do not permanently disable Composer security blocking, suppress all
advisories, or deploy the unsupported bridge as the final result.

## C. Resolve the Drupal 10 package set

The successful study manifest is the reference implementation. Its final core
constraints are `^10.6.19`, Aggregator `^2.2`, Drush `^12.5`, Rules `^4.0`,
Bootstrap5 `^4.0.8`, Classy `^2.0` and Stable `^2.1`.

Revalidate supported release versions at the time of the real work. On the
rehearsal copy, preview the **whole coordinated set**:

```sh
ddev composer update --with-all-dependencies --dry-run --no-interaction
```

Read the plan. In particular, do not accept a Rules/Typed Data downgrade as a
way around a core conflict. Ensure Aggregator will come from the contributed
package, and that custom Zircon's required base themes remain available.

For a production release, build and test a fixed lock/artifact beforehand;
deploy that tested dependency set with `composer install`. Do not resolve a new
set of versions through a broad `composer update` during the live cutover.

## D. Perform the sequential migration on the rehearsal copy

1. Take/verify a final pre-migration backup and record feed/content checksums.
2. Set maintenance mode and rebuild caches before replacing core.
3. Install the reviewed Drupal 10 package set and confirm the Bootstrap5 patch
   was applied. Rebuild Buriton5's CSS for parent 4.x.
4. Run `updatedb`; read the full output, address genuine requirements failures
   and confirm no updates remain. Rebuild caches.
5. Uninstall the now-obsolete Admin Toolbar Links Access Filter submodule.
6. Check configuration changes and reconcile exports as described below.
7. Verify data, public/admin routes and assets, then leave maintenance mode.

Commands used for the migration and cleanup:

```sh
ddev drush state:set system.maintenance_mode 1 --input-format=integer
ddev drush cache:rebuild
ddev composer update --with-all-dependencies --no-interaction
ddev drush updatedb --yes
ddev drush pm:uninstall admin_toolbar_links_access_filter --yes
ddev drush cache:rebuild
ddev drush updatedb:status
ddev drush state:set system.maintenance_mode 0 --input-format=integer
ddev drush cache:rebuild
```

The Composer update above is the **rehearsal** command. The production cutover
uses the previously tested build/lock instead. If maintenance mode was already
enabled for another reason, preserve the agreed maintenance state.

Do not uninstall/reinstall Aggregator. Its contributed package takes over the
existing module name and its update hooks migrate the stored data in place.
Never delete core module folders manually to influence discovery.

Do not install Drupal 11 code against the still-Drupal-9 database. Complete and
verify the Drupal 10 database migrations before the next major-version stage.

## E. Reconcile configuration without overwriting current live changes

The study had five existing DB/export differences listed in the work log.
Those must be checked again on the new baseline, not assumed identical forever.

1. Export current active configuration into a separate review directory.
2. Compare baseline active configuration, upgraded active configuration and
   existing export files. Apply the migration changes while retaining intended
   pre-existing edits. Distinguish empty strings from nulls and booleans from
   integers; account for intentional ordering changes.
3. Review changes to roles, Views, text formats, enabled extensions and Webform
   handlers. Never import the study's contact-form settings blindly.
4. Review `config:status`. The study intentionally retained the original five
   differences; it did not manufacture a clean status by overwriting them.

Example staging export:

```sh
ddev drush config:export --destination=/tmp/buriton-config-review --yes
ddev drush config:status
```

The one-off comparison/merge helpers are preserved in the private archive with
their baseline data. They hard-code the study's database names, paths and merge
assumptions. Review/adapt them rather than treating them as production tools.

## F. Environment adjustments

- Use a Drupal 10-compatible PHP/database combination verified on the host.
  The rehearsal used PHP 8.2.30 and MariaDB 11.8; it did not validate the live host.
- For DDEV, use `type: drupal10` and the reviewed settings. The local sync-path
  override belongs inside the DDEV conditional, not an unconditional production
  settings replacement.
- Protect configuration exports from HTTP access. Prefer a directory outside
  the public document root where practical. The study's nginx and Apache rules
  are available in the checkpoint; `.htaccess` is ineffective on nginx.
- Verify local `/sync/core.extension.yml` returns 403/404, not YAML content.
- Regenerate/merge scaffold files deliberately, retaining any real hosting
  redirects, access rules and customisations.
- Build Buriton5 from `themes/custom/buriton5` with:

```sh
sass --style=compressed scss/style.scss css/style.css
```

## G. Verification and cutover gates

Use [the reusable checks](checks/README.md) and the broader
[acceptance checklist](04-estimating-and-acceptance.md). At minimum:

- Verify feed definitions, existing item checksums, counts and generated UUIDs.
- Check node/user counts, public/private documents, permissions and old passwords.
- Render both custom themes and Claro; verify real pages, slideshow/carousels,
  login, editor forms, contact forms and RSS output.
- Validate Composer files, platform requirements and the current security audit.
- Confirm no pending database updates and inspect the complete status report.

The DDEV generated-asset checks needed explicit argument handling for URLs with
`&` query parameters. Use `ddev exec --raw -- curl ...` with each complete URL
passed as one argument; a shell-interpreted partial URL can produce a misleading
400 response. HTTP 200 alone is not visual or functional acceptance.

For available-update metadata, the working Drupal API sequence was:

```sh
ddev drush php:eval '\Drupal::service("update.manager")->refreshUpdateData();'
ddev drush php:eval '\Drupal::service("update.processor")->fetchData();'
```

`update_fetch_tasks` is not an ordinary queue-worker plugin here; running it
through `drush queue:run` failed. Do not run all cron merely to refresh update
information: that can also update feeds, send notifications and run backups.

## H. Production replay and rollback

The production plan still needs a fresh rehearsal, the complete Drupal 11 stage,
a tested fixed build, a cutover window and an accountable rollback decision.
Freeze writes for the final database/file sync and prevent split writes between
old and new sites. Confirm mail, cron, backups, TLS and URLs after switching.

Rollback restores matching **code, dependencies, database, configuration and
files**, as well as compatible PHP/runtime settings. Restoring Drupal 9 code
over an upgraded database is not a rollback. Define how any content entered
after cutover would be recovered before agreeing the window.
