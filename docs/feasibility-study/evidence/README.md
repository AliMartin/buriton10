# Evidence index

These files preserve the observations supporting the local Drupal 10 result.
They are dated records, not fresh scans of whatever code is installed later.
No database dump, uploaded content or settings credential file is included here.

| File | Meaning / limitation |
| --- | --- |
| `package-versions.json` | Complete locked package versions at initial Drupal 9, prepared Drupal 9 and tested Drupal 10 checkpoints |
| `extensions-snapshot.json` | Installed/enabled extension inventory taken while preparing this handover |
| `checkpoint-manifest.json` | SHA-256 fingerprints of the original Drupal 10 checkpoint, before the later library conversion |
| `libraries-checkpoint.json` | Later library package versions, install directories and manifest fingerprints |
| `libraries-verification.json` | 23 managed directories, 40 asset files checked, no missing files or unmanaged directories |
| `libraries-http-verification.json` | Follow-up public/admin checks and 21 successful local CSS/JavaScript URL requests |
| `libraries-audit.json` | Composer audit after adding library packages |
| `webform-libraries-status.txt` | Included Webform libraries found locally after Composer installation |
| `initial-upgrade-status.txt` | Original supplied Upgrade Status findings; historical input, not a fresh scan |
| `baseline.json` | Pre-core-upgrade checksums and row counts for the recorded SQL queries |
| `verification.json` | Post-upgrade equality results for those same queries |
| `http-verification.json` | Seven endpoint checks and 15 successful distinct local CSS/JavaScript asset requests |
| `composer-audit.json` | Final core-upgrade audit: no advisory or abandoned-package entries |
| `platform-check.log` | Successful Composer platform check |
| `config-status-final.json` | The five original configuration differences deliberately retained |
| `custom-theme-changes.json` | Added/modified/removed theme files relative to the pre-theme-upgrade backup, with content hashes |
| `custom-theme-source.diff` | Source-only theme changes; excludes compiled CSS/maps, vendors, binary assets and private FTP settings |
| `aggregator-upgrade-status.txt` | Raw manual-review findings after installing Aggregator 2.2.6; original output was saved with a misleading `.json` extension and has been renamed here |
| `drupal11-composer-precheck.txt` | Read-only Composer prohibits check against 11.4.10; expected non-zero outcome on the current Drupal 10 dependency set |
| `drupal10-upgrade-record.md` | Copy of the earlier core/Aggregator implementation record |
| `theme-upgrade-record.md` | Copy of the earlier theme preparation record |

The checkpoint manifest excludes itself, generated documentation, private FTP
configuration and settings/credential files. A matching hash confirms the same
file bytes; it does not prove the file is secure or that a database matches.
The root lock file remains the complete dependency/build authority.
The original fingerprints are deliberately retained as historical evidence;
use the later library record and reference manifests for the current Composer
setup rather than interpreting those intentional changes as a failed transfer.

## Data-preservation checks

The saved SQL baseline compared:

```sql
SELECT fid,title,url,refresh FROM aggregator_feed ORDER BY fid;

SELECT iid,fid,title,link,author,description,timestamp,guid
FROM aggregator_item ORDER BY iid;

SELECT
  (SELECT COUNT(*) FROM aggregator_feed),
  (SELECT COUNT(*) FROM aggregator_item),
  (SELECT COUNT(*) FROM node),
  (SELECT COUNT(*) FROM users_field_data);
```

Results: 2 feeds, 2,314 items, 1,880 nodes, 6 users. TSV output from the same
`drush sql:query` command was hashed before/after; raw row data stays in the
private archive. The item comparison intentionally excludes the new UUID field
added by the migration. A separate check confirmed 2,314 distinct non-empty
UUIDs. These are preservation checks, not an exhaustive integrity audit of
every entity/table/file.

## Private archive

The historical backup directories originally lived in macOS temporary folders.
They have been copied into `.ddev/upgrade-study-archive/`, which is ignored by
the existing root `.gitignore`. `archive-index.json` there maps original paths
to preserved paths. Main contents:

- Original Composer manifests/locks before dependency and branch updates.
- Popup removal backup including the old module and custom popup assets.
- Pre-hoverIntent Composer files.
- Pre-theme-update database plus theme/Composer archive.
- Pre-Drupal-10 database, source/configuration and scaffold archives, comparison
  and merge helpers, migration logs, raw checksums and verification output.
- Selected Sass build logs and the downloaded Bootstrap5 review archive.
- `drupal10-checkpoint/`: current database and source/configuration checkpoint.

The latest checkpoint source/configuration archive includes custom themes,
Composer/patch files, reviewed exports, tools and local settings. It is private
because those settings/configuration can contain credentials and personal data.
It is not a complete uploaded-files backup. Keep a separate private off-machine
copy; an ignored folder is not preserved by pushing a Git repository.
`MANIFEST.json` fingerprints the preserved private files; `knowledge-pack.tar.gz`
is a portable copy of this documentation folder. The new checkpoint database
dump was read back through gzip successfully when this handover was written.

The temporary comparison database `buriton9_upgrade_baseline` remains local.
The earlier isolated Drupal 10 theme fixture lived at `/tmp/buriton-themes-d10`
inside DDEV and may disappear on container rebuild. Do not make future work
depend on that fixture still existing.

## Sources consulted

Source pages are included for rechecking assumptions, not as substitutes for
the saved project evidence. Compatibility and release status can change.

- [Drupal deprecated/obsolete extension replacement](https://www.drupal.org/docs/core-modules-and-themes/deprecated-and-obsolete)
- [Aggregator project](https://www.drupal.org/project/aggregator)
- [Drupal 10.6.19 release](https://www.drupal.org/project/drupal/releases/10.6.19)
- [Bootstrap5 project/releases](https://www.drupal.org/project/bootstrap5/releases)
- [Classy project](https://www.drupal.org/project/classy)
- [Stable project](https://www.drupal.org/project/stable)
- [Rules 4.0.1 release](https://www.drupal.org/project/rules/releases/4.0.1)
- [Composer Patches definitions](https://docs.cweagans.net/composer-patches/usage/defining-patches/)
- [Composer Patches commands](https://docs.cweagans.net/composer-patches/usage/commands/)
- [Drupal PHP requirements](https://www.drupal.org/docs/getting-started/system-requirements/php-requirements)
- [Bootstrap 3 documentation](https://getbootstrap.com/docs/3.4/getting-started/)
