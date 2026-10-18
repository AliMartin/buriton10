# Buriton Parish Council: Drupal upgrade feasibility study

Recorded: 18 October 2026. This folder is the project handover, independent of
the chat history. All implementation and tests so far concern a local copy.
The live website has not been upgraded or deployed by this work.

## Conclusion supported by the work so far

The Drupal 9.5.11 copy has been upgraded successfully to Drupal 10.6.19 while
retaining its content, users, RSS feeds and existing default theme. The custom
themes have been repaired and tested, and the main public pages and feed output
work. The owner subsequently tested the local site and reported that it looks
good so far.

The full Drupal 9-to-11 route is **not yet demonstrated**. The Drupal 11 rehearsal
will take place in a new GitHub repository. It must resolve the known package,
theme and hosting requirements and pass acceptance checks before the study can
support an unconditional Drupal 11 feasibility statement or a fixed quote.

Suggested council-facing wording at this point:

> We have successfully rehearsed the upgrade from Drupal 9 to Drupal 10 on a
> local copy, retaining the council's existing website and content. This gives
> us a tested foundation for the Drupal 11 upgrade. The remaining rehearsal will
> establish the final compatibility work, hosting requirements and implementation
> cost before changes are made to the live website.

## Read in this order

| Document | Purpose |
| --- | --- |
| [01-work-completed.md](01-work-completed.md) | What changed, why, and implementation details worth reusing |
| [02-replay-runbook.md](02-replay-runbook.md) | How to reproduce the Drupal 9-to-10 stage on a fresh live-site copy |
| [03-drupal11-handover.md](03-drupal11-handover.md) | Starting state, known blockers and a copy-ready prompt for the next repository |
| [04-estimating-and-acceptance.md](04-estimating-and-acceptance.md) | Estimate worksheet, scope decisions and acceptance criteria |
| [05-composer-libraries.md](05-composer-libraries.md) | Follow-up: reproducible library installation and retirement of manual copies |
| [evidence/README.md](evidence/README.md) | Saved observations, version snapshots, checksums and source-change index |
| [checks/README.md](checks/README.md) | Reusable theme and JavaScript checks |

Earlier technical records are preserved as [the Drupal 10 upgrade record](evidence/drupal10-upgrade-record.md)
and [theme preparation record](evidence/theme-upgrade-record.md). This folder
can be carried to another repository on its own; the actual implementation and
private data must also be transferred separately as described below.

## Tested checkpoint

| Item | Result |
| --- | --- |
| Drupal | 10.6.19, upgraded from 9.5.11 |
| Aggregator | Contributed 2.2.6; never uninstalled during handover |
| Default / administration theme | Custom Zircon / core Claro |
| Alternative custom theme | Buriton5, extending Bootstrap5 4.0.8 |
| Local environment | DDEV; PHP 8.2.30; MariaDB 11.8; legacy repository-root web layout |
| Preserved data | 1,880 nodes; 6 users; 2 feed definitions; 2,314 feed items |
| Feed migration | Existing item fields and feed definitions match baseline checksums; 2,314 distinct item UUIDs, none missing |
| Public checks | Seven page/feed endpoints returned 200; 15 distinct local CSS/JS assets loaded |
| Database updates | None pending at completion |
| Composer checks | Manifest/lock validate; platform requirements pass; no known advisories or abandoned packages in the recorded audit |
| Production | Unchanged; hosting and deployment not tested |

Versions and security results are dated observations, not promises that those
versions will remain suitable when the production work is commissioned.

## Preserve the implementation as well as the notes

Carry the following to the new working repository through a reviewed source
transfer: Composer manifest, `composer.libraries.json` and lock, `patches.lock.json`, `patches/`, both
`themes/custom/` directories, `tools/check-theme.php`, the reviewed configuration
exports and this documentation folder. Recreate the DDEV settings deliberately.
Do not assume copying these Markdown files alone also copies the working code.
Browser libraries under `/libraries` now rebuild through Composer; carry their
manifests and merge-plugin configuration instead of committing downloaded files.

At the time of the study, most application files in this checkout were
**untracked**, and `.ddev`, contributed modules/themes and settings files were
ignored. No commits, pushes, pull requests or deployments were made by the
upgrade work. Check exactly what the new repository contains before treating
it as a recoverable checkpoint.

Temporary historical backups have now been copied into the ignored local folder
`.ddev/upgrade-study-archive/`. It also holds a current Drupal 10 source/configuration
checkpoint and database dump. The archive contains private database/configuration
material and must stay out of GitHub. The evidence in this documentation folder
does not contain a database dump, settings credentials or uploaded files.

The ignored archive is local preservation, not an off-machine backup. Retain a
private copy elsewhere. Source/configuration archives do not contain the full
public/private uploaded-file trees; preserve those separately when reproducing
the site or preparing a production rollback.

## Study boundary

This documentation task adds records, checks and private backup preservation.
It does not begin Drupal 11 work, change the live site, establish a price or
replace the future rehearsal against a fresh copy of the then-current live site.
