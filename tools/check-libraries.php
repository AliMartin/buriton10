<?php

/**
 * @file
 * Check Composer library installations with `drush php:script`.
 */

if (PHP_SAPI !== 'cli') {
  http_response_code(403);
  exit;
}

$packages = [];
$directories = [];
$missing = [];
$assets = [];
foreach (\Composer\InstalledVersions::getInstalledPackagesByType('drupal-library') as $package) {
  $path = \Composer\InstalledVersions::getInstallPath($package);
  if (!$path || !is_dir($path) || dirname(realpath($path)) !== realpath(DRUPAL_ROOT . '/libraries')) {
    $missing[] = $package . ': missing or unexpected installation directory';
    continue;
  }
  $directory = basename($path);
  $directories[$directory] = TRUE;
  $packages[$package] = ['version' => \Composer\InstalledVersions::getPrettyVersion($package), 'directory' => $directory];
}

// Read the original definitions so CDN fallbacks cannot conceal missing files.
$extensions = array_merge(\Drupal::moduleHandler()->getModuleList(), \Drupal::service('theme_handler')->listInfo());
foreach ($extensions as $name => $extension) {
  $file = DRUPAL_ROOT . '/' . $extension->getPath() . '/' . $name . '.libraries.yml';
  if (!is_file($file)) {
    continue;
  }
  foreach (\Drupal\Component\Serialization\Yaml::decode(file_get_contents($file)) ?? [] as $library) {
    $paths = array_keys($library['js'] ?? []);
    foreach ($library['css'] ?? [] as $group) {
      $paths = array_merge($paths, array_keys($group));
    }
    foreach ($paths as $path) {
      if (preg_match('@^/?libraries/([^/]+)/@', $path, $match) && isset($directories[$match[1]])) {
        $assets[ltrim($path, '/')] = TRUE;
      }
    }
  }
}

// CKEditor plugins and these consumers also refer to files outside YAML assets.
foreach (['iframe/plugin.js', 'fakeobjects/plugin.js', 'fitvids/jquery.fitvids.js', 'jquery.cycle/jquery.cycle.all.js', 'jquery.hover-intent/jquery.hoverIntent.js', 'json2/json2.js'] as $file) {
  $assets['libraries/' . $file] = TRUE;
}
foreach (array_keys($assets) as $path) {
  if (!is_file(DRUPAL_ROOT . '/' . $path)) {
    $missing[] = $path;
  }
}

$unmanaged = [];
foreach (new DirectoryIterator(DRUPAL_ROOT . '/libraries') as $file) {
  if (!$file->isDot() && $file->isDir() && !isset($directories[$file->getFilename()])) {
    $unmanaged[] = $file->getFilename();
  }
}
ksort($packages);
echo json_encode(['packages' => $packages, 'checked_asset_files' => count($assets), 'missing' => $missing, 'unmanaged_directories' => $unmanaged], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
if ($missing || $unmanaged) {
  throw new RuntimeException('Library installation verification failed.');
}
