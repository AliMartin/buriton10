<?php

/**
 * @file
 * Render and asset checks, run through `drush php:script tools/check-theme.php`.
 * Select a theme with THEME_QA_THEME; no configuration is changed.
 */

if (PHP_SAPI !== 'cli') {
  http_response_code(403);
  exit;
}

$theme_name = getenv('THEME_QA_THEME') ?: 'zircon';
$base_url = getenv('THEME_QA_BASE_URL') ?: 'https://buriton10.ddev.site';
$warnings = [];
$results = [];
$switcher = \Drupal::service('account_switcher');
$admin_theme = in_array($theme_name, ['adminimal_theme', 'seven', 'claro']);
$switcher->switchTo($admin_theme ? \Drupal\user\Entity\User::load(1) : new \Drupal\Core\Session\AnonymousUserSession());
chdir(DRUPAL_ROOT);
set_error_handler(function ($level, $message, $file, $line) use (&$warnings) {
  if (($level & error_reporting()) && in_array($level, [E_WARNING, E_USER_WARNING])) {
    $warnings[] = "$message ($file:$line)";
    return TRUE;
  }
  return FALSE;
});

try {
  $active = \Drupal::service('theme.initialization')->getActiveThemeByName($theme_name);
  \Drupal::theme()->setActiveTheme($active);
  $twig = \Drupal::service('twig');
  $path = DRUPAL_ROOT . '/' . $active->getPath();
  $compiled = 0;
  foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path)) as $file) {
    if ($file->isFile() && $file->getExtension() === 'twig') {
      $name = substr($file->getPathname(), strlen(DRUPAL_ROOT) + 1);
      $twig->compileSource(new \Twig\Source(file_get_contents($file->getPathname()), $name));
      $compiled++;
    }
  }

  $routes = $admin_theme ? ['/admin/config/system/site-information', '/admin/reports/status'] : ['/user/login', '/user/password'];
  foreach ($routes as $url) {
    \Drupal::theme()->setActiveTheme($active);
    $request = \Symfony\Component\HttpFoundation\Request::create($base_url . $url);
    $response = \Drupal::service('http_kernel')->handle($request, \Symfony\Component\HttpKernel\HttpKernelInterface::SUB_REQUEST);
    $results[$url] = $response->getStatusCode();
    if ($response->getStatusCode() !== 200 || strpos($response->getContent(), '<html') === FALSE) {
      throw new RuntimeException("Failed to render $theme_name at $url");
    }
    if (\Drupal::theme()->getActiveTheme()->getName() !== $theme_name) {
      throw new RuntimeException('The request used a different theme.');
    }
  }

  if (in_array($theme_name, ['zircon', 'buriton5'])) {
    $page = [
      '#type' => 'page',
      'content' => ['#markup' => 'Theme test main content'],
      'sidebar_first' => ['#markup' => 'Theme test left sidebar'],
      'sidebar_second' => ['#markup' => 'Theme test right sidebar'],
    ];
    $layout = (string) \Drupal::service('renderer')->renderPlain($page);
    if (substr_count($layout, 'col-lg-3') !== 2 || strpos($layout, 'col-lg-6') === FALSE) {
      throw new RuntimeException('The two-sidebar layout does not use a 3/6/3 grid.');
    }
  }

  $assets = new \Drupal\Core\Asset\AttachedAssets();
  $libraries = $active->getLibraries();
  // Include runtime libraries inherited from all base themes.
  foreach ($active->getBaseThemeExtensions() as $base) {
    $libraries = array_merge($libraries, $base->info['libraries'] ?? []);
  }
  $assets->setLibraries(array_values(array_unique($libraries)));
  $resolver = \Drupal::service('asset.resolver');
  $css = $resolver->getCssAssets($assets, FALSE);
  [$header, $footer] = $resolver->getJsAssets($assets, FALSE);
  $missing = [];
  foreach (array_merge($css, $header, $footer) as $asset) {
    if ($asset['type'] === 'file' && !is_file($asset['data'])) {
      $missing[] = $asset['data'];
    }
  }
  if ($missing || $warnings) {
    throw new RuntimeException(json_encode(['missing_assets' => $missing, 'warnings' => $warnings]));
  }
  if ($theme_name === 'buriton5' && isset($css['themes/contrib/bootstrap5/css/style.css'])) {
    throw new RuntimeException('The parent Bootstrap5 stylesheet was not overridden.');
  }
  echo json_encode([
    'core' => \Drupal::VERSION,
    'theme' => $theme_name,
    'compiled_twig_templates' => $compiled,
    'routes' => $results,
    'css_assets' => count($css),
    'javascript_assets' => count($header) + count($footer),
    'missing_assets' => $missing,
    'warnings' => $warnings,
  ], JSON_PRETTY_PRINT) . PHP_EOL;
}
finally {
  restore_error_handler();
  $switcher->switchBack();
}
