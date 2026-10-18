# Drupal 11 handover

No Drupal 11 installation or database migration has been attempted in this
checkout. The owner intends to create a new GitHub repository for that stage.
Keep this Drupal 10 checkpoint as the comparison/rollback reference.

## Copy-ready prompt for the next session

```text
This is the Buriton Parish Council upgrade feasibility study, not a live
deployment. Read docs/feasibility-study/README.md and all linked handover files
before changing anything. The previous dry run upgraded a copy of Drupal 9.5.11
to Drupal 10.6.19 and retained its content, users, feeds and custom Zircon theme.

We are now continuing the Drupal 11 dry run in this new repository. Compare
the actual files/environment with the recorded checkpoint first; do not assume
the documentation proves Drupal 11 compatibility. Reuse the existing theme
fixes, hoverIntent Composer dependency, Bootstrap5 migration patch and checks.
Preserve existing data and configuration differences. Do not deploy to the live
website or send external messages as part of this study.

Resolve the Drupal 11 platform/package/theme blockers, perform and validate the
next major upgrade on the isolated copy, and update this knowledge folder with
the actual changes, command outcomes, tests, remaining risks and effort needed
to replay Drupal 9 -> 10 -> 11 against a fresh copy of the live site. The purpose
is to support a council-facing feasibility statement and a costed proposal.
```

## Transfer and inventory first

Carry the actual Composer/patch files, including **`composer.libraries.json`**,
the merge-plugin configuration, custom themes, `tools/check-theme.php`,
`tools/check-libraries.php`,
reviewed configuration and this folder. The source diff in `evidence/` is an
audit aid, not a complete substitute for compiled CSS, fonts and vendor assets.
Copy private database/uploads and environment settings separately through a
private channel. Do not add the ignored archive, settings credentials, FTP
configuration or database dumps to GitHub.

The current repository has a legacy root web layout. A move to recommended-project
with `web/` is possible, but is a separate deployment/layout change and should
not be introduced accidentally while following a generic upgrade tutorial.

Start by comparing core and package versions with the saved checkpoint. Check
enabled/disabled status afresh; disabled package code can still block Composer.
The old working directory and DDEV URL are historical references, not mandatory
names for the new repository.

## Known Drupal 11 work, based on the recorded checkpoint

A read-only `composer prohibits drupal/core 11.4.10 --tree` check was run while
writing this handover. It made no package changes and correctly returned a
non-zero result because the current project is constrained to Drupal 10.
The saved output is [in evidence](evidence/drupal11-composer-precheck.txt).
It identifies installed constraints, not proof that newer compatible releases
or replacements are unavailable.

| Area | Recorded condition | Next action |
| --- | --- | --- |
| PHP | Local 8.2.30; queried Drupal 11 target requires at least 8.3 | Choose and test a PHP version supported by the actual target and the host |
| Core dependencies | Core packages constrained to 10.6 | Update the coordinated core/Drush/Symfony set in a dry-run plan; choose compatible Drush rather than blindly retaining 12.x |
| Custom Zircon | Metadata allows 9.5/10, not 11 | Scan PHP/Twig/libraries; update metadata only after real fixes/testing; preserve Classy markup |
| Buriton5 | Metadata allows 9.5/10.1+, not 11 | Scan/test against the chosen compatible Bootstrap5 parent, rebuild CSS, then update metadata |
| Tour | Installed deprecated core module | Determine actual use; replace with a supported contributed route or uninstall if unused |
| Password compatibility | `phpass` enabled by Drupal 10 migration | Verify old-account login support across 11; preserve the required compatibility path, not just new-password logins |
| Font Awesome | Installed 2.26.0 excludes core 11 | Investigate compatible branch/replacement and icon usage; it is enabled in the study checkpoint |
| Image Field to Media | Installed 2.0.2 excludes core 11 | Establish whether still required for operations or only historical migration; choose compatible code or remove deliberately |
| CKEditor iframe chain | `ckeditor_iframe` 2.2.0 pulls contributed `ckeditor` 1.0.2; both exclude 11 | Audit actual usage and text formats; remove unused legacy code or provide equivalent editing support |
| Adminimal packages | Adminimal Admin Toolbar 2.0.0 and Adminimal theme 1.7 exclude 11 | Audit whether needed; update or remove unused packages deliberately |
| Seven | 1.0 excludes 11; dependency of Adminimal theme | Resolve with the Adminimal decision; Claro is the actual administration theme |
| Aggregator | Contributed 2.2.6 declares 11 support | Recheck its manual scan findings against the 11 runtime, refresh/feed functionality and data preservation |
| Bundled Bootstrap 3 | Zircon still uses end-of-life 3.4.1 | Agree whether framework replacement is included in the quote or a separate modernisation project |
| Hosting | Only local DDEV is proven | Verify production PHP, database, Composer/build access, storage, web rules, cron and backup facilities |

These are starting findings, not an exhaustive Drupal 11 audit. Package metadata
and support windows must be rechecked at the time of the new rehearsal. The
[official PHP requirements](https://www.drupal.org/docs/getting-started/system-requirements/php-requirements)
were consulted for the platform distinction; exact minor-release requirements
and database requirements should be checked again for the selected target.

## Avoid losing the work already done

- Reuse the existing `core/once` changes; do not reintroduce `jquery.once`.
- Preserve the Composer-managed hoverIntent file and Bootstrap5 patch.
- Rebuild `/libraries` through Composer; retain both merged library catalogues
  and review the explicit legacy iframe library if removing its module chain.
- Preserve Aggregator's tables/module state rather than uninstalling it.
- Keep the existing `3/6/3` layout and parent CSS override tests.
- Keep the five pre-existing configuration differences visible until reconciled.
- Do not confuse unused contributed themes with the custom default theme.
- Check DDEV and production sync protection independently.
- Do not skip Drupal 10 database updates when replaying from live Drupal 9.

## Completion evidence needed for the council

Record the selected Drupal 11 version and platform, package removals/upgrades,
theme patches, migrations, old/new content and feed checksums, editor/form/login
tests, status/audit results, visual acceptance and remaining exceptions. Rehearse
again from a fresh production snapshot using the final repeatable sequence.

Only after that should the feasibility conclusion be updated to say that the
whole Drupal 9-to-11 path has been demonstrated. Record a measured/reviewed
implementation estimate using [the worksheet](04-estimating-and-acceptance.md),
and distinguish one-time investigation already completed from work that must
still be repeated for the live cutover.
