import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { socialApi, siteApi } from '@/services/api';

interface SocialConfig {
  id: string;
  platform: string;
  accountUrl: string | null;
  isActive: boolean;
}

interface SiteSettings {
  [key: string]: string;
}

const PLATFORM_ICONS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'X',
};

function getUsername(platform: string, accountUrl: string | null): string {
  if (!accountUrl) return '';
  try {
    return accountUrl.split('/').filter(Boolean).pop() || '';
  } catch {
    return '';
  }
}

export default function Community() {
  const [socials, setSocials] = useState<SocialConfig[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([socialApi.getConfigs(), siteApi.getSettings()])
      .then(([socialRes, settingsRes]) => {
        setSocials(socialRes.data.filter((s: SocialConfig) => s.isActive));
        setSettings(settingsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative bg-dark py-20 md:py-28">
        <div className="container-custom text-center">
          <p className="font-heading text-gold uppercase tracking-[0.2em] text-sm mb-4">
            Nuestra Familia
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-gold tracking-wider">
            Comunidad
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-silver text-lg">
            Somos una red global de personas que transforman sus familias y comunidades
            a través de la fe. Súmate y conecta con nosotros.
          </p>
        </div>
      </section>

      {/* Conexión */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <h2 className="font-display text-3xl md:text-4xl text-dark tracking-wider mb-4 text-center">
            {settings.connection_title || 'Conecta con nosotros'}
          </h2>
          <p className="max-w-2xl mx-auto text-center text-dark-light mb-10">
            {settings.connection_description ||
              'Síguenos en nuestras redes sociales y mantente al día con todo lo que Dios está haciendo a través de nuestra red.'}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card animate-pulse h-32" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {socials.map((social, index) => (
                <motion.a
                  key={social.id}
                  href={social.accountUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="card p-6 text-center group hover:border-gold hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-gold/15 flex items-center justify-center mb-4 group-hover:bg-gold transition-colors">
                    <span className="text-gold group-hover:text-dark font-heading font-bold">
                      {PLATFORM_ICONS[social.platform]?.charAt(0) || social.platform.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-dark">{social.platform}</h3>
                  {social.accountUrl && (
                    <p className="text-sm text-dark-light mt-1 line-clamp-1">
                      @{getUsername(social.platform, social.accountUrl)}
                    </p>
                  )}
                  <span className="mt-3 inline-block text-sm text-gold font-medium">Seguir →</span>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </section>

      {settings.phone && (
        <section className="section-padding bg-dark">
          <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-gold tracking-wider mb-2">
                ¿Quieres saber más?
              </h2>
              <p className="text-silver">
                Escríbenos y con gusto te compartiremos cómo ser parte de la red.
              </p>
            </div>
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary shrink-0"
            >
              Escríbenos por WhatsApp
            </a>
          </div>
        </section>
      )}
    </div>
  );
}