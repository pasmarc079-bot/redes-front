import { useState, FormEvent, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiUser, FiChevronLeft } from 'react-icons/fi';
import { useAuthStore } from '@/admin/stores/authStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ username: false, password: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const usernameError = touched.username && !username.trim();
  const passwordError = touched.password && !password;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, password: true });

    if (!username.trim() || !password) return;

    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.status === 429
          ? 'Demasiados intentos. Espera un momento antes de volver a intentar.'
          : 'Credenciales inválidas. Verifica tu usuario y contraseña.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-dvh w-full flex items-center justify-center p-4 md:p-8"
      style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #050506 50%, #020203 100%)',
      }}
      role="main"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 mb-5 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true" role="img">
              <circle cx="50" cy="50" r="48" fill="#020203" stroke="#C9A84C" strokeWidth="2"/>
              <path d="M50 12 C32 30 22 50 22 64 C22 78 34 90 50 90 C66 90 78 78 78 64 C78 50 68 30 50 12Z" fill="#C9A84C"/>
              <path d="M50 30 C42 44 37 54 37 64 C37 74 43 80 50 80 C57 80 63 74 63 64 C63 54 58 44 50 30Z" fill="#020203"/>
              <path d="M50 46 C46 54 44 60 44 66 C44 72 47 76 50 76 C53 76 56 72 56 66 C56 60 54 54 50 46Z" fill="#C9A84C"/>
            </svg>
            <span
              className="absolute -bottom-2 right-2 w-5 h-5 bg-gold rounded-full border-2 border-bg-deep flex items-center justify-center"
              aria-hidden="true"
            >
              <FiLock size={10} className="text-dark" />
            </span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-cream tracking-tight">REDES</h1>
          <p className="text-muted mt-2 text-sm font-medium">Panel de Administración</p>
        </div>

        <div
          className="card relative overflow-hidden"
          style={{
            background: 'rgba(10, 10, 15, 0.95)',
            border: '1px solid rgba(201, 168, 76, 0.15)',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(201, 168, 76, 0.05) inset',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px" aria-hidden="true" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
          <div className="p-6 md:p-8">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-cream mb-6 text-center">Iniciar Sesión</h2>

            {error && (
              <div
                role="alert"
                className="mb-5 p-4 rounded-lg text-sm flex items-start gap-3 animate-in slide-in-from-top-2 duration-200"
                style={{
                  background: 'rgba(220, 38, 38, 0.15)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  color: '#fca5a5',
                }}
              >
                <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="Formulario de inicio de sesión">
              <div>
                <label htmlFor="username" className="label text-sm font-medium text-cream mb-2">
                  Usuario o Email
                </label>
                <div className="relative">
                  <FiUser
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    ref={usernameRef}
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
                    className={`input pl-10 ${usernameError ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="admin"
                    required
                    autoComplete="username"
                    aria-invalid={usernameError || undefined}
                    aria-describedby={usernameError ? 'username-error' : undefined}
                    disabled={loading}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: usernameError ? '1px solid #f87171' : '1px solid rgba(201, 168, 76, 0.2)',
                      color: '#F5F5F5',
                      transition: 'border-color 200ms ease, box-shadow 200ms ease, background 200ms ease',
                    }}
                  />
                </div>
                {usernameError && (
                  <p id="username-error" className="mt-1.5 text-xs text-red-400" role="alert">
                    Ingresa tu usuario o email
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="label text-sm font-medium text-cream mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                    className={`input pl-10 pr-12 ${passwordError ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    aria-invalid={passwordError || undefined}
                    aria-describedby={passwordError ? 'password-error' : undefined}
                    disabled={loading}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: passwordError ? '1px solid #f87171' : '1px solid rgba(201, 168, 76, 0.2)',
                      color: '#F5F5F5',
                      transition: 'border-color 200ms ease, box-shadow 200ms ease, background 200ms ease',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-gold transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    tabIndex={-1}
                    disabled={loading}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {passwordError && (
                  <p id="password-error" className="mt-1.5 text-xs text-red-400" role="alert">
                    Ingresa tu contraseña
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn w-full justify-center py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C 0%, #A16207 100%)',
                  color: '#020203',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 14px -2px rgba(201, 168, 76, 0.3)',
                  transition: 'transform 150ms ease, box-shadow 200ms ease, background 200ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.transform = 'translateY(-1px)';
                  if (!loading) e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(201, 168, 76, 0.4)';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.transform = 'translateY(0)';
                  if (!loading) e.currentTarget.style.boxShadow = '0 4px 14px -2px rgba(201, 168, 76, 0.3)';
                }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: 'currentColor' }}>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Ingresando...
                  </span>
                ) : (
                  'Ingresar'
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-6">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-muted hover:text-gold transition-colors text-sm font-medium"
            style={{ textDecoration: 'none' }}
          >
            <FiChevronLeft size={16} aria-hidden="true" />
            Volver al sitio público
          </a>
        </p>

        <p className="text-center mt-8 text-xs text-muted/60">
          Ministerio REDES &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}