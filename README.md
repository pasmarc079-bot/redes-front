# Ministerio REDES — Frontend

Sitio web público + panel de administración del Ministerio Cristiano REDES.

## Stack

- **Frontend Público:** React + Vite + Tailwind CSS + Framer Motion
- **Admin Panel:** React + Vite + Tailwind + TipTap (Rich Text Editor)
- **Despliegue:** Servidor Express (server.cjs) para SPA + API proxy

## Desarrollo Local

```bash
# Frontend público
cd frontend
npm install
npm run dev
# http://localhost:5173

# Admin panel (otra terminal)
cd frontend/admin
npm install
npm run dev
# http://localhost:5174
# Login: admin / admin123
```

## Build para producción

```bash
# Frontend público
cd frontend
npm run build

# Admin panel
cd frontend/admin
npm run build
```

Cada uno se sirve con `node server.cjs` en el puerto 3000.

## Identidad Visual

- **Colores:** Dorado (`#C9A84C`) + Negro (`#1A1A1A`)
- **Tipografías:** Montserrat (headings), Inter (body), Bebas Neue (display)

## Redes Sociales

- Facebook: [@MinisterioREDESlive](https://facebook.com/MinisterioREDESlive)
- YouTube: [Canal oficial](https://youtube.com/channel/UClpoz4Olk2soO3Cg2gUKWKA)
- WhatsApp: 099 453 8859
