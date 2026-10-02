import { useState, FormEvent, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiUser, FiChevronLeft } from 'react-icons/fi';
import { useAuthStore } from '@/admin/stores/authStore';

const LogoIcon = () => (
  <svg
    viewBox="0 0 448 557"
    className="w-full h-full"
    aria-hidden="true"
    role="img"
    fill="#C9A84C"
  >
    <path d="M2151 5215 c-12 -31 -21 -58 -21 -61 0 -9 -39 -97 -61 -139 -12 -22 -32 -60 -44 -85 -13 -25 -41 -74 -63 -110 -22 -36 -59 -96 -83 -135 -42 -70 -209 -326 -219 -335 -3 -3 -21 -30 -40 -60 -19 -30 -38 -59 -43 -65 -4 -5 -18 -26 -31 -45 -13 -19 -86 -126 -161 -238 -76 -112 -144 -210 -151 -217 -8 -7 -14 -18 -14 -24 0 -5 -6 -16 -13 -23 -7 -7 -39 -51 -70 -98 -31 -47 -87 -128 -123 -180 -339 -490 -466 -765 -531 -1150 -21 -128 -21 -409 1 -550 63 -399 267 -777 582 -1080 108 -104 164 -149 263 -216 81 -55 237 -144 253 -144 5 0 27 -9 49 -20 52 -27 187 -74 269 -95 227 -56 229 -57 505 -52 253 4 263 5 380 36 270 71 404 125 583 233 199 121 421 327 565 524 37 51 67 95 67 100 0 4 6 15 14 23 29 31 144 278 180 384 70 204 87 299 93 524 8 298 -21 504 -106 754 -49 145 -134 322 -209 439 -75 116 -173 260 -257 375 -47 66 -101 140 -118 164 -62 87 -205 266 -236 297 -17 16 -31 34 -31 38 0 18 -408 459 -441 477 -23 12 -43 -20 -87 -140 -33 -92 -35 -103 -40 -259 -4 -158 11 -313 38 -377 5 -11 12 -39 15 -62 4 -23 15 -59 26 -80 10 -20 19 -46 19 -56 0 -10 6 -31 14 -45 8 -15 26 -58 41 -97 15 -38 35 -85 46 -103 10 -18 19 -38 19 -44 0 -15 199 -410 216 -429 8 -8 14 -19 14 -23 0 -6 85 -159 166 -301 12 -22 35 -62 50 -90 14 -27 32 -57 39 -65 17 -19 67 -150 103 -266 26 -85 27 -98 27 -304 l0 -215 -32 -62 c-43 -82 -116 -153 -179 -176 -64 -22 -180 -22 -253 0 -81 26 -186 132 -220 223 -34 90 -40 241 -16 382 21 122 24 344 6 435 -40 208 -128 378 -289 561 l-22 25 -20 -21 c-11 -12 -54 -88 -96 -169 -42 -81 -93 -177 -113 -213 -42 -73 -281 -555 -281 -565 0 -4 -15 -39 -34 -79 -52 -108 -132 -305 -185 -451 -32 -90 -51 -131 -63 -133 -25 -5 -162 132 -208 208 -53 89 -62 132 -63 300 -1 113 4 167 21 246 35 161 58 215 193 444 54 91 103 179 110 195 7 17 21 39 30 50 9 11 27 38 39 60 11 22 26 49 33 59 7 11 27 44 45 72 17 29 32 57 32 62 0 5 9 17 20 27 11 10 20 21 20 25 0 15 112 200 121 200 5 0 9 8 9 18 0 11 9 29 20 42 11 13 20 29 20 36 0 7 6 17 13 21 8 4 21 22 29 38 8 17 41 80 73 140 53 101 101 216 127 305 5 19 14 40 19 45 4 6 11 30 15 53 4 23 11 45 15 48 5 3 9 18 9 33 0 15 4 31 9 36 39 41 41 578 2 670 -5 11 -18 53 -30 92 -27 89 -98 229 -154 303 -57 76 -162 180 -180 180 -10 0 -24 -22 -36 -55z m-709 -3481 c8 -129 31 -211 89 -309 47 -81 70 -106 159 -178 76 -60 82 -67 74 -87 -4 -8 -22 -76 -41 -150 -33 -132 -34 -138 -30 -305 4 -202 12 -242 72 -360 25 -50 45 -94 45 -99 0 -12 -53 0 -113 27 -28 13 -68 30 -87 37 -230 89 -424 298 -461 497 -23 117 4 371 57 556 56 195 191 493 219 484 5 -2 13 -53 17 -113z m2307 11 c112 -224 153 -542 96 -752 -13 -51 -36 -116 -51 -145 -77 -154 -245 -320 -409 -405 -133 -69 -203 -87 -335 -81 -111 4 -175 30 -248 101 -123 118 -154 231 -132 478 12 137 47 293 97 441 28 82 47 105 60 71 28 -77 132 -181 232 -231 72 -35 80 -37 194 -41 116 -3 120 -2 182 28 78 39 131 97 180 197 42 86 75 228 75 325 0 96 16 100 59 14z"/>
  </svg>
);

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

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(201, 168, 76, 0.2)',
    color: '#F5F5F5',
    transition: 'border-color 200ms ease, box-shadow 200ms ease, background 200ms ease',
    width: '100%',
    boxSizing: 'border-box',
  };

  const inputErrorStyle: React.CSSProperties = {
    ...inputStyle,
    border: '1px solid #f87171',
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
          <div className="mx-auto w-16 h-16 mb-5 relative" style={{ filter: 'drop-shadow(0 4px 12px rgba(201, 168, 76, 0.3))' }}>
            <LogoIcon />
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
                <div className="relative w-full">
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
                    className={`input pl-10 pr-4 ${usernameError ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="admin"
                    required
                    autoComplete="username"
                    aria-invalid={usernameError || undefined}
                    aria-describedby={usernameError ? 'username-error' : undefined}
                    disabled={loading}
                    style={usernameError ? inputErrorStyle : inputStyle}
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
                <div className="relative w-full">
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
                    style={passwordError ? inputErrorStyle : inputStyle}
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