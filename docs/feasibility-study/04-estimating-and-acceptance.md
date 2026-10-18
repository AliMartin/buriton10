# Estimating and acceptance

This study supplies reusable technical work and evidence. It does not yet supply
a fixed price for a completed Drupal 11 production upgrade. No hourly/day rate,
agreed scope or measured production-replay duration has been provided.

## What the council can be told now

The Drupal 9-to-10 stage has been demonstrated on the local copy, including
custom-theme repairs, module updates, feed preservation and working-page checks.
The owner has also performed initial local testing with a positive result.

The remaining Drupal 11 rehearsal will determine the final upgrade work and
hosting changes. Once that succeeds, a proposal can say that the complete
Drupal 9-to-11 route has been demonstrated and specify the price to reproduce
it safely against the live site.

Do not describe a clean Composer audit or a green compatibility declaration as
proof of accessibility, hosting compatibility, correct emails, visual acceptance
or complete Drupal 11 readiness. Those need their own checks.

## Scope to agree before fixing the price

| Decision | Why it affects effort |
| --- | --- |
| Preserve Zircon's appearance, or redesign/rebuild? | A framework/theme replacement is different work from retaining the current site through a core upgrade |
| Include removal of Bootstrap 3? | The theme still contains an end-of-life framework; agreeing this explicitly avoids hiding a modernisation cost |
| Which themes must remain usable? | Supporting Buriton5 and unused administrative themes adds testing/maintenance beyond the current Zircon/Claro pairing |
| Which unused modules may be removed? | Legacy editor/admin/migration packages can otherwise add unnecessary Drupal 11 compatibility work |
| Does live hosting support the target? | PHP/database/runtime changes or a hosting move can affect the price and cutover plan |
| What forms/integrations must be proven? | Contact delivery, village-hall messages, CAPTCHA, analytics, cron/backups and RSS need agreed end-to-end coverage |
| What accessibility/browser acceptance is included? | Existing council-site accessibility requirements need agreed testing/remediation scope; the study is not an accessibility audit |
| Who signs off, and how many review rounds? | Editorial, council and technical acceptance time should be allowed for |
| What downtime and rollback window is acceptable? | Final content synchronisation and restoration arrangements affect cutover work |
| What support is included afterwards? | Separate a defined post-launch support period from ongoing maintenance |

## Estimate worksheet

Fill this in after the Drupal 11 rehearsal. Reuse the completed investigation;
still allow for checking differences in a fresh live copy and applying/testing
the final sequence. Do not count the study's already completed development twice
unless that work is explicitly part of the commercial arrangement.

| Workstream | Reusable work already available | Remaining estimate, hours |
| --- | --- | --- |
| Fresh live baseline and differences | Inventory, version snapshots, replay checklist | TBD |
| Drupal 11 package/platform work | Named blockers and tested Drupal 10 checkpoint | TBD |
| Custom-theme Drupal 11 work | Implemented Drupal 10 fixes and automated checks | TBD |
| Removed-core/legacy features | Aggregator migration pattern; Tour/password/editor audit items identified | TBD |
| Configuration reconciliation | Five known differences and three-way comparison approach | TBD |
| Hosting/build/deployment preparation | DDEV reference, patch/lock workflow, sync protection | TBD |
| Rehearsal from fresh live data | Baseline queries, feed checksums, route checks | TBD |
| Functional/visual/accessibility testing | Defined minimum acceptance list below | TBD |
| Stakeholder testing and fixes | Owner's initial local test only | TBD |
| Live cutover and rollback preparation | Sequential 9 -> 10 -> 11 procedure to validate | TBD |
| Post-launch checks and agreed support | Scope to agree | TBD |
| Project coordination and documentation | This reusable knowledge pack | TBD |

Cost calculation:

```text
Agreed labour hours × agreed hourly rate
+ separately itemised hosting/licence/external costs
+ explicitly stated contingency for remaining uncertainty
+ VAT if applicable
= proposed total (£n)
```

If quoting by days, agree hours per day and use one consistent basis. Identify
exclusions, dependencies on the council/host, the quote's validity period and the
change-control approach. Recheck release/support dates before scheduling work.

## Acceptance criteria for the complete feasibility study

### Reproducible upgrade

- [x] Drupal 9.5.11 -> 10.6.19 demonstrated on the study copy.
- [x] Data/count checks, custom-theme render checks and public HTTP checks saved.
- [x] Owner reports initial local testing looks good.
- [ ] Drupal 10 -> selected supported Drupal 11 release demonstrated.
- [ ] Entire sequence repeated from a fresh copy of the then-current live site.
- [ ] Matching fixed Composer locks/builds and all required source changes retained.
- [ ] Restore procedure exercised against matching backups.

### Content, users and permissions

- [ ] Check content types, council minutes/financial reports, menus, aliases and
  redirects against the live baseline; open representative documents and media.
- [ ] Confirm node/user/feed counts and investigate any intentional differences.
- [ ] Verify representative existing-account passwords and password reset flows,
  not only a newly created administrator account.
- [ ] Verify anonymous/member/editor/admin permissions and private-file access.
- [ ] Check CKEditor 5, iframe/media editing, image uploads and save/reopen behavior.
- [ ] Verify configured Rules behavior without unintentionally sending real mail
  during the rehearsal.

### Front end and integrations

- [ ] Check desktop/tablet/mobile navigation, logo, layout, sidebars, footer,
  slideshow, carousel, search, keyboard focus, zoom and print output.
- [ ] Perform agreed accessibility checks and document existing versus introduced
  issues and the agreed remediation scope.
- [ ] Test council and village-hall contact delivery with agreed recipients and
  CAPTCHA/spam protection; verify stored Webform submissions where applicable.
- [ ] Verify RSS refresh, BBC block links, feed pages and outbound RSS. Decide
  what to do with the empty Neighbourhood Watch source.
- [ ] Review analytics/widget behavior and any consent requirements in the
  agreed scope; their presence was preserved, not certified by this study.
- [ ] Verify scheduled jobs, backups and restore on the target hosting platform.

### Operational acceptance

- [ ] No pending database updates or unresolved release-blocking status errors.
- [ ] Current Composer audit/platform checks and package security coverage reviewed.
- [ ] Production configuration, credentials and sync/file protection reviewed.
- [ ] Cache/asset generation, log errors, TLS, canonical URLs and redirects checked.
- [ ] Final write freeze, database/file sync, downtime, rollback trigger and
  recovery of post-cutover edits agreed.
- [ ] Council/owner acceptance and post-launch support arrangements recorded.

## Update the estimate after each remaining milestone

Record actual work, unexpected blockers and decisions after the Drupal 11
rehearsal, fresh-live replay and hosting rehearsal. Replace TBDs with reviewed
effort figures and update the council-facing conclusion. Keep verified evidence
separate from assumptions so the final £n is explainable.
