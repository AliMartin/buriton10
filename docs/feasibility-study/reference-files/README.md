# Reference implementation files

These copies make key parts of the handover independent of the original
checkout. They are records, not active project configuration from this folder.

| Files | Meaning |
| --- | --- |
| `composer.initial-drupal9.json` / `.lock` | Earliest retained Drupal 9 Composer baseline |
| `composer.prepared-drupal9.json` / `.lock` | Prepared Drupal 9 checkpoint immediately before the core upgrade |
| `composer.tested-drupal10.json` / `.lock` | Successful Drupal 10 dependency set |
| `patches.lock.json` | Patch checksum/depth metadata for the tested implementation |
| `bootstrap5-preserve-required-base-themes.patch` | Local Composer-managed migration fix |
| `config-sync.nginx.conf` | DDEV nginx directory protection, originally `.ddev/nginx/config-sync.conf` |
| `check-theme.php` | CLI-only render/asset check, originally `tools/check-theme.php` |
| `composer.library-checkpoint.json` / `.lock` | Later Composer setup after converting `/libraries` to generated dependencies |
| `composer.libraries.json` | Project-specific library declarations merged by the later setup |
| `composer.webform-libraries.json` | Snapshot of Webform 6.3.1's own catalogue, for reference; the build merges the installed module's original file |
| `check-libraries.php` | CLI-only managed-directory and library asset check |

Restore Composer snapshots under their standard root names only as part of an
intentional matching code/database replay. The Drupal 10 snapshot expects the
patch at `patches/bootstrap5-preserve-required-base-themes.patch`, the normal
installer paths and the actual custom themes, not these renamed reference paths.

These snapshots are not instructions to downgrade the working database or freeze
production forever at the recorded versions. Verify security/compatibility and
re-resolve on a rehearsal copy when doing the real work, then deploy its tested
lock/build. Never copy a Drupal 9 Composer snapshot over the migrated Drupal 10
database and assume that is a rollback.
The library-checkpoint manifests supersede the earlier Drupal 10 Composer
snapshot for reproducing the current library setup; they retain all previous
locked dependency versions and add the library packages/merge plugin.

Complete custom themes, configuration and local settings are preserved in the
private checkpoint archive. The actual project source directories should be
carried into the new repository after reviewing private FTP settings and other
non-source files. The source diff and file hashes in `../evidence/` help check
the transfer but do not contain every vendor/binary asset.
