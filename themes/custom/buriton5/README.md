# Buriton Bootstrap 5 theme

[Bootstrap 5](https://www.drupal.org/project/bootstrap5) subtheme.

The subtheme supports Drupal 9.5 and Drupal 10.1+.

The project now uses Bootstrap5 4.0.8 on Drupal 10. The Drupal 9 preparation
used Bootstrap5 3.0.16 as a temporary bridge. A Composer-managed patch preserves
Classy and
Stable during Bootstrap5's database updates because Zircon still needs them.
See [the upgrade notes](../../../docs/theme-upgrade.md).

The subtheme's `libraries-override` removes only the parent's compiled stylesheet;
other parent libraries, including Bootstrap's JavaScript, remain available.

## Development

### CSS compilation

Prerequisites: install [sass](https://sass-lang.com/install).

To compile, run from the subtheme directory:

```sh
sass --style=compressed scss/style.scss css/style.css
```

Rebuild the CSS after every parent-theme upgrade, then run `ddev drush cr`.
The source builds against both Bootstrap5 3.0.16 and 4.0.8. Upstream Sass
deprecation warnings still occur with Dart Sass 1.98; compilation succeeds.

The page template uses a 3/6/3 grid with both sidebars and a 4/8 grid with one
sidebar. Navigation indicators use CSS rather than depending on a Font Awesome
font being attached by another module.

Run the CLI-only rendering and asset check without changing the selected theme:

```sh
ddev exec env THEME_QA_THEME=buriton5 vendor/bin/drush php:script tools/check-theme.php
```
