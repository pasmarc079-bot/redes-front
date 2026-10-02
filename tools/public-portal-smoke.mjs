const baseUrl = process.env.PUBLIC_URL || 'http://localhost:5173';

const routes = [
  '/',
  '/nosotros',
  '/eventos',
  '/eventos/exaltando-al-padre-2026',
  '/blog',
  '/blog/el-poder-de-la-adoracion-en-comunidad',
  '/comunidad',
  '/contacto',
];

const resources = [
  '/robots.txt',
  '/llms.txt',
  '/og-image.jpg',
  '/assets/events/exaltando.png',
  '/assets/events/bautizos.png',
  '/assets/blog/adoracion.jpg',
  '/assets/blog/bautismos.jpg',
];

const apiEndpoints = [
  '/api/v1/events',
  '/api/v1/posts',
  '/api/v1/site/settings',
];

let failures = 0;
const targets = process.env.CHECK_API === 'false'
  ? [...routes, ...resources]
  : [...routes, ...resources, ...apiEndpoints];

for (const path of targets) {
  try {
    const response = await fetch(`${baseUrl}${path}`);
    if (!response.ok) {
      failures += 1;
      console.error(`FAIL ${response.status} ${path}`);
    } else {
      console.log(`OK   ${response.status} ${path}`);
    }
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${path}: ${error.message}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} public portal checks failed.`);
  process.exitCode = 1;
} else {
  console.log('\nPublic portal smoke checks passed.');
}
