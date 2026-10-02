/**
 * ═══════════════════════════════════════════════════════════════
 *  MINISTERIO REDES — Chrome DevTools Test Data Injection Script
 * ═══════════════════════════════════════════════════════════════
 *
 *  HOW TO USE:
 *  1. Open http://localhost:5173 in Chrome
 *  2. Open DevTools (Cmd+Option+I on Mac)
 *  3. Go to Console tab
 *  4. Paste this entire script and press Enter
 *
 *  The script will:
 *  - Log in as admin and get a JWT token
 *  - Inject test events, blog posts, and settings
 *  - Show progress in the console
 * ═══════════════════════════════════════════════════════════════
 */

(async () => {
  const API = '/api/v1';
  const logs = [];

  function log(msg, type = 'info') {
    const styles = {
      info: 'color: #2196F3; font-weight: bold',
      success: 'color: #4CAF50; font-weight: bold',
      warn: 'color: #FF9800; font-weight: bold',
      error: 'color: #F44336; font-weight: bold',
    };
    console.log(`%c[REDES] ${msg}`, styles[type] || styles.info);
    logs.push({ msg, type });
  }

  async function api(path, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, { ...options, headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    if (res.status === 204) return null;
    return res.json();
  }

  // ── Step 1: Login ──────────────────────────────────────────
  log('Step 1: Authenticating as admin...');
  try {
    const auth = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'pasmarc079', password: 'Excelencia079' }),
    });
    localStorage.setItem('token', auth.token);
    log(`Logged in as ${auth.user.username} ✓`, 'success');
  } catch (e) {
    log(`Login failed: ${e.message}`, 'error');
    return;
  }

  // ── Step 2: Inject Events ──────────────────────────────────
  log('Step 2: Injecting test events...');
  const testEvents = [
    {
      title: 'Vigilia de Oración — Edición Especial',
      slug: 'vigilia-de-oracion-edicion-especial',
      description: '<p>Una noche intensa de oración intercesora por la ciudad de Lago Agrio y la nación. Unidos ante el trono de gracia para clamar por avivamiento.</p>',
      shortDescription: 'Noche de oración intercesora por la ciudad',
      location: 'Sede Principal Ministerio REDES',
      startDate: '2026-09-15T19:00:00.000Z',
      endDate: '2026-09-15T23:00:00.000Z',
      isFeatured: true,
      status: 'UPCOMING',
    },
    {
      title: 'Conferencia de Jóvenes "Sin Límites"',
      slug: 'conferencia-jovenes-sin-limites',
      description: '<p>Encuentro de jóvenes de todo el oriente ecuatoriano. Talleres, alabanza y predicación poderosa. ¡No te lo pierdas!</p>',
      shortDescription: 'Encuentro regional de jóvenes',
      location: 'Coliseo Municipal, Lago Agrio',
      startDate: '2026-10-10T08:00:00.000Z',
      endDate: '2026-10-12T18:00:00.000Z',
      isFeatured: true,
      status: 'UPCOMING',
    },
    {
      title: 'Retiro de Matrimonios — Amor Inquebrantable',
      slug: 'retiro-matrimonios-amor-inquebrantable',
      description: '<p>Un fin de semana para fortalecer los lazos matrimoniales con enseñanzas bíblicas y dinámicas de pareja.</p>',
      shortDescription: 'Retiro especial para parejas',
      location: 'Hotel Mirador, Lago Agrio',
      startDate: '2026-11-05T08:00:00.000Z',
      endDate: '2026-11-07T16:00:00.000Z',
      isFeatured: false,
      status: 'UPCOMING',
    },
  ];

  let eventsCreated = 0;
  for (const event of testEvents) {
    try {
      await api('/admin/events', { method: 'POST', body: JSON.stringify(event) });
      eventsCreated++;
      log(`  ✓ Created: ${event.title}`, 'success');
    } catch (e) {
      log(`  ✗ Failed: ${event.title} — ${e.message}`, 'warn');
    }
  }
  log(`Events: ${eventsCreated}/${testEvents.length} created`, 'success');

  // ── Step 3: Inject Blog Posts ──────────────────────────────
  log('Step 3: Injecting test blog posts...');
  const testPosts = [
    {
      title: 'El Impacto de la Adoración en las Familias',
      slug: 'impacto-adoracion-familias',
      content: '<h2>La adoración transforma hogares</h2><p>Cuando una familia se une en adoración, los lazos se fortalecen y la paz de Dios invade el hogar. En Ministerio REDES hemos visto cómo familias enteras se transforman cuando ponen a Cristo en el centro.</p><p>Las estadísticas muestran que las familias que oran juntas reportan mayor satisfacción y resiliencia ante las crisis.</p><h2>Testimonios reales</h2><p>Maria y Carlos compartieron: "Antes de venir a REDES, estábamos al borde del divorcio. Hoy servimos juntos en el ministerio y nuestra familia es más fuerte que nunca."</p>',
      excerpt: 'Descubre cómo la adoración en familia puede transformar tu hogar y fortalecer tus lazos.',
      status: 'PUBLISHED',
      publishedAt: '2026-08-20T12:00:00.000Z',
      readTime: 6,
      seoTitle: 'Impacto de la Adoración en Familias | Ministerio REDES',
      seoDescription: 'Conoce cómo la adoración en familia transforma hogares en Lago Agrio.',
    },
    {
      title: 'Guía para Nuevos Creyentes: Tu Primera Semana',
      slug: 'guia-nuevos-creyentes-primera-semana',
      content: '<h2>Bienvenido a la familia de fe</h2><p>Si recién has decidido seguir a Jesús, ¡felicitaciones! Esta guia te ayudará a establecer bases sólidas en tu caminar con Dios.</p><h2>Día 1-2: Oración</h2><p>Comienza cada día hablando con Dios. No necesitas palabras elaboradas; simplemente háblale desde tu corazón.</p><h2>Día 3-4: Lectura de la Biblia</h2><p>Empieza con el Evangelio de Juan. Lee un capítulo al día y medita en lo que Dios te dice.</p><h2>Día 5-7: Comunidad</h2><p>Busca una comunidad de fe. El cristianismo no se vive solo; necesitas hermanos que te acompañen.</p>',
      excerpt: 'Una guía práctica para comenzar tu caminar cristiano con bases sólidas.',
      status: 'PUBLISHED',
      publishedAt: '2026-08-18T10:00:00.000Z',
      readTime: 4,
      seoTitle: 'Guía para Nuevos Creyentes | Ministerio REDES Lago Agrio',
      seoDescription: 'Primeros pasos en la fe cristiana — guía práctica de Ministerio REDES.',
    },
  ];

  let postsCreated = 0;
  for (const post of testPosts) {
    try {
      await api('/admin/posts', { method: 'POST', body: JSON.stringify(post) });
      postsCreated++;
      log(`  ✓ Created: ${post.title}`, 'success');
    } catch (e) {
      log(`  ✗ Failed: ${post.title} — ${e.message}`, 'warn');
    }
  }
  log(`Posts: ${postsCreated}/${testPosts.length} created`, 'success');

  // ── Step 4: Inject/Update Site Settings ────────────────────
  log('Step 4: Injecting site settings...');
  const testSettings = [
    { key: 'hero.title', value: 'Ministerio REDES', label: 'Hero Title' },
    { key: 'hero.subtitle', value: 'Transformando vidas en Lago Agrio y el oriente ecuatoriano', label: 'Hero Subtitle' },
    { key: 'hero.ctaText', value: 'Conoce Nuestros Eventos', label: 'Hero CTA Text' },
    { key: 'about.title', value: 'Nuestra Misión', label: 'About Title' },
    { key: 'about.description', value: 'Ministerio REDES es una comunidad cristiana dedicada al avivamiento espiritual, la formación de líderes y la transformación social en Lago Agrio, Sucumbíos, Ecuador.', label: 'About Description' },
    { key: 'services.title', value: 'Nuestros Servicios', label: 'Services Section Title' },
    { key: 'services.subtitle', value: 'Formando líderes para transformar la sociedad', label: 'Services Section Subtitle' },
    { key: 'featuredEvents.title', value: 'Próximos Eventos', label: 'Featured Events Title' },
    { key: 'featuredEvents.subtitle', value: 'No te pierdas lo que Dios está haciendo', label: 'Featured Events Subtitle' },
    { key: 'featuredEvents.linkText', value: 'Ver todos los eventos', label: 'Featured Events Link Text' },
    { key: 'socialFeed.title', value: 'Síguenos en Redes Sociales', label: 'Social Feed Title' },
    { key: 'socialFeed.subtitle', value: 'Conecta con nosotros en nuestras plataformas digitales', label: 'Social Feed Subtitle' },
    { key: 'footer.description', value: 'Ministerio cristiano dedicado al avivamiento y la transformación de vidas en Lago Agrio, Sucumbíos, Ecuador.', label: 'Footer Description' },
    { key: 'nav.brandText', value: 'REDES', label: 'Navbar Brand Text' },
  ];

  let settingsCreated = 0;
  for (const s of testSettings) {
    try {
      await api('/admin/site/settings', {
        method: 'PUT',
        body: JSON.stringify(s),
      });
      settingsCreated++;
    } catch (e) {
      log(`  ✗ Failed: ${s.key} — ${e.message}`, 'warn');
    }
  }
  log(`Settings: ${settingsCreated}/${testSettings.length} updated`, 'success');

  // ── Summary ────────────────────────────────────────────────
  log('═══════════════════════════════════════', 'info');
  log('TEST DATA INJECTION COMPLETE', 'success');
  log(`  Events created: ${eventsCreated}`, 'success');
  log(`  Posts created:   ${postsCreated}`, 'success');
  log(`  Settings set:    ${settingsCreated}`, 'success');
  log('Refresh the page to see changes.', 'info');
  log('═══════════════════════════════════════', 'info');
})();
