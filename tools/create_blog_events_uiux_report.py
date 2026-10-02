from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "reports" / "blog-events-uiux-analysis.pdf"
ARTIFACTS = ROOT / ".artifacts"


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="ReportTitle", parent=styles["Title"], fontName="Helvetica-Bold",
    fontSize=25, leading=30, textColor=colors.HexColor("#1A1A1A"),
    alignment=TA_CENTER, spaceAfter=14,
))
styles.add(ParagraphStyle(
    name="ReportSubtitle", parent=styles["Normal"], fontName="Helvetica",
    fontSize=11, leading=16, textColor=colors.HexColor("#5A5A5A"),
    alignment=TA_CENTER, spaceAfter=18,
))
styles.add(ParagraphStyle(
    name="H1Report", parent=styles["Heading1"], fontName="Helvetica-Bold",
    fontSize=18, leading=23, textColor=colors.HexColor("#5B4300"),
    spaceBefore=12, spaceAfter=9,
))
styles.add(ParagraphStyle(
    name="H2Report", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=13, leading=17, textColor=colors.HexColor("#1A1A1A"),
    spaceBefore=10, spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="BodyReport", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=9.2, leading=13.5, textColor=colors.HexColor("#303030"),
    spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="SmallReport", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=7.8, leading=10.5, textColor=colors.HexColor("#555555"),
    spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="CodeReport", parent=styles["BodyText"], fontName="Courier",
    fontSize=7.5, leading=10, textColor=colors.HexColor("#303030"),
    backColor=colors.HexColor("#F4F1EA"), leftIndent=7, rightIndent=7,
    borderPadding=5, spaceAfter=7,
))
styles.add(ParagraphStyle(
    name="CaptionReport", parent=styles["BodyText"], fontName="Helvetica-Oblique",
    fontSize=7.5, leading=10, textColor=colors.HexColor("#666666"),
    alignment=TA_CENTER, spaceAfter=9,
))
styles.add(ParagraphStyle(
    name="CalloutReport", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=9, leading=13, textColor=colors.HexColor("#303030"),
    backColor=colors.HexColor("#FFF7DF"), borderColor=colors.HexColor("#C9A84C"),
    borderWidth=0.7, borderPadding=8, spaceBefore=5, spaceAfter=8,
))


def p(text, style="BodyReport"):
    return Paragraph(escape(text).replace("\n", "<br/>"), styles[style])


def rich(text, style="BodyReport"):
    return Paragraph(text, styles[style])


def bullets(items):
    return [rich(f"&#8226; {escape(item)}", "BodyReport") for item in items]


def code(text):
    return p(text, "CodeReport")


def image(path, caption, max_width=16.5 * cm, max_height=8.6 * cm):
    path = Path(path)
    if not path.exists():
        return [p(f"Captura no disponible: {path}", "SmallReport")]
    img = Image(str(path))
    scale = min(max_width / img.imageWidth, max_height / img.imageHeight)
    img.drawWidth = img.imageWidth * scale
    img.drawHeight = img.imageHeight * scale
    img.hAlign = "CENTER"
    return [img, p(caption, "CaptionReport")]


def table(rows, widths):
    data = []
    for row in rows:
        data.append([rich(cell, "SmallReport") if isinstance(cell, str) else cell for cell in row])
    t = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1A1A1A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D8D1C2")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAF8F3")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D8D1C2"))
    canvas.line(1.7 * cm, 1.35 * cm, A4[0] - 1.7 * cm, 1.35 * cm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(colors.HexColor("#777777"))
    canvas.drawString(1.7 * cm, 0.9 * cm, "Ministerio REDES - Auditoría UI/UX de Blog y Eventos")
    canvas.drawRightString(A4[0] - 1.7 * cm, 0.9 * cm, f"Página {doc.page}")
    canvas.restoreState()


story = []
story += [
    Spacer(1, 1.2 * cm),
    p("Análisis UI/UX y Arquitectura de Blog y Eventos", "ReportTitle"),
    p("Ministerio REDES · Informe técnico y de experiencia de usuario · 20 de septiembre de 2026", "ReportSubtitle"),
    rich("<b>Alcance.</b> Auditoría del flujo público y administrativo, librerías utilizadas, componentes propios, persistencia, contratos API, estados de carga/error, accesibilidad, riesgos y oportunidades de mejora.", "CalloutReport"),
    Spacer(1, 0.3 * cm),
]
story += image(ARTIFACTS / "ux-blog-public.png", "Figura 1. Listado público del Blog.")
story += image(ARTIFACTS / "ux-events-public.png", "Figura 2. Listado público de Eventos.")
story.append(PageBreak())

story += [
    p("1. Resumen ejecutivo", "H1Report"),
    p("Blog y Eventos están implementados como dos dominios CRUD independientes que comparten la misma infraestructura: React/Vite en el cliente, Axios para HTTP, Express/TypeScript en el servidor, Prisma como ORM y PostgreSQL como persistencia. El portal público consume únicamente publicaciones publicadas y eventos próximos/en curso; el panel administrativo expone el ciclo completo de creación, edición, publicación y eliminación según rol.", "BodyReport"),
    p("El flujo de Eventos es funcional y relativamente directo. El flujo de Blog es más rico: incorpora BlockNote, conversión HTML, portada multimedia, etiquetas, estados editoriales, SEO y botones de compartir. Durante la auditoría se reprodujo un fallo real al abrir un artículo: el editor quedaba en blanco por una incompatibilidad entre React 18 y Mantine 9.5.2. Se corrigió alineando Mantine 8 con React 18 y se verificó el editor en navegador.", "BodyReport"),
    p("Evaluación resumida", "H2Report"),
    table([
        ["Área", "Estado actual", "Riesgo / oportunidad"],
        ["Eventos público", "Funcional, tarjetas y detalle", "Falta paginación visible, filtros y mapa/registro más contextual"],
        ["Eventos admin", "Formulario claro con validación básica", "Persistencia de fechas y campos opcionales necesita validación de servidor más estricta"],
        ["Blog público", "Tarjetas, tags, portada, detalle y compartir", "Contenido HTML se inserta con dangerouslySetInnerHTML; requiere sanitización explícita"],
        ["Blog admin", "Editor BlockNote, portada, tags, publicación y SEO", "Complejidad alta; dependencia de editor sensible a versiones"],
        ["Accesibilidad", "Labels, botones y estados principales presentes", "Hay advertencias de labels/ids en Blog editor y controles del sistema"],
        ["Arquitectura", "Separación clara por rutas y servicios", "Axios duplicado en páginas admin; falta capa API/admin compartida"],
    ], [3.1 * cm, 5.0 * cm, 8.4 * cm]),
    p("Hallazgo corregido durante la auditoría", "H2Report"),
    rich("<b>Blog no cargaba al pulsar Editar.</b> La consola mostraba <font name='Courier'>render2 is not a function</font> dentro de MantineProvider. <font name='Courier'>@mantine/core@9.5.2</font> declara React 19 como peer dependency, mientras el proyecto usa React 18. Se ajustaron <font name='Courier'>@mantine/core</font> y <font name='Courier'>@mantine/hooks</font> a 8.3.x; el editor volvió a montar correctamente.", "CalloutReport"),
]

story += [
    p("2. Arquitectura general", "H1Report"),
    p("El frontend se monta como una SPA única. Las rutas públicas y administrativas viven en el mismo árbol React, pero el prefijo /admin se renderiza fuera del Layout público.", "BodyReport"),
    code("frontend/src/App.tsx\n  /admin/* -> AdminApp lazy + AuthGuard\n  /       -> Layout público + páginas Home, About, Blog, Events, Community, Contact"),
    p("El servidor Express registra las rutas públicas y administrativas sobre el mismo router de dominio. La protección se aplica a las rutas administrativas mediante JWT y roles.", "BodyReport"),
    code("backend/src/index.ts\n  /api/v1/events       -> event.routes.ts\n  /api/v1/posts        -> blog.routes.ts\n  /api/v1/admin/events -> event.routes.ts protegido por middleware\n  /api/v1/admin/posts  -> blog.routes.ts protegido por middleware"),
    p("Librerías relevantes", "H2Report"),
    table([
        ["Librería", "Uso en Blog/Eventos", "Observación UX/técnica"],
        ["React + React Router", "Render, rutas y formularios", "Navegación SPA sin recarga; rutas de edición por ID"],
        ["Vite", "Dev server y build", "HMR acelerado; requiere reinicio cuando cambia optimización de dependencias"],
        ["Axios", "CRUD y carga de datos", "Cada página admin crea su propia instancia y interceptor JWT"],
        ["Framer Motion", "Animación de tarjetas y detalle", "Entrada progresiva; no bloquea el contenido"],
        ["BlockNote", "Editor enriquecido del Blog", "Editor por bloques, serializado a HTML; sensible a compatibilidad Mantine/React"],
        ["Mantine", "UI interna de BlockNote", "Debe mantenerse alineada con la versión de React del proyecto"],
        ["react-icons", "Iconografía de acciones y metadatos", "Consistente con el lenguaje visual del panel"],
        ["MediaPicker / MediaUpload", "Portadas de posts y flyers", "Dos caminos: elegir biblioteca o subir a Cloudinary"],
        ["react-share", "Compartir artículos", "Facebook, X y WhatsApp en detalle de Blog"],
        ["Prisma", "Persistencia y consultas", "Servicios de dominio encapsulan la mayoría de reglas CRUD"],
    ], [3.0 * cm, 6.0 * cm, 7.5 * cm]),
]
story.append(PageBreak())

story += [
    p("3. Módulo de Eventos", "H1Report"),
    p("Eventos tiene dos experiencias: el catálogo público y el backoffice de gestión. El dominio de datos está representado por el modelo Prisma Event.", "BodyReport"),
    p("Flujo público", "H2Report"),
    bullets([
        "Events.tsx solicita hasta 20 eventos mediante eventsApi.getAll(1, 20).",
        "El backend filtra estados UPCOMING y ONGOING y ordena por startDate ascendente.",
        "La tarjeta muestra flyer, etiqueta Destacado, título, fecha, ubicación y shortDescription.",
        "El enlace navega a /eventos/:slug y EventDetail.tsx obtiene el detalle por slug.",
        "EventDetail muestra hero, fecha, ubicación, flyer, descripción, capacidad, dirección y registrationUrl.",
        "EventImage centraliza el fallback/selección visual del flyer.",
    ]),
    p("Archivos principales de Eventos", "H2Report"),
    table([
        ["Archivo", "Responsabilidad"],
        ["frontend/src/pages/Events.tsx", "Listado público, loading skeleton, empty state, tarjetas y metadatos"],
        ["frontend/src/pages/EventDetail.tsx", "Detalle por slug, error de no encontrado, CTA de registro"],
        ["frontend/src/admin/pages/events/EventList.tsx", "Tabla admin, estado, fecha, flyer, editar y eliminar"],
        ["frontend/src/admin/pages/events/EventForm.tsx", "Crear/editar, fechas, ubicación, capacidad, estado, flyer y registro"],
        ["frontend/src/components/events/EventImage.tsx", "Presentación/fallback de imágenes de eventos"],
        ["backend/src/routes/event.routes.ts", "Rutas públicas y admin con orden de rutas para evitar conflictos"],
        ["backend/src/services/event.service.ts", "Consultas, slugify, estados, fechas, creación, actualización y eliminación"],
        ["backend/prisma/schema.prisma", "Modelo Event, EventStatus y relaciones con User"],
    ], [6.0 * cm, 10.5 * cm]),
    p("Formulario administrativo de Eventos", "H2Report"),
    bullets([
        "Título y fecha de inicio son obligatorios; la validación ocurre en cliente antes de enviar.",
        "La imagen puede seleccionarse con MediaPicker o subirse con MediaUpload.",
        "El estado usa DRAFT, UPCOMING, ONGOING, COMPLETED y CANCELLED.",
        "isFeatured controla la insignia Destacado y el endpoint featured del catálogo público.",
        "El backend convierte fechas a Date y latitud/longitud a Decimal/número cuando existen.",
        "Al cambiar el título, el backend recalcula el slug sin comprobar explícitamente colisiones en update.",
    ]),
]
story += image(ARTIFACTS / "ux-event-admin-editor.png", "Figura 3. Formulario administrativo de edición de Eventos.")
story.append(PageBreak())

story += [
    p("4. Módulo de Blog", "H1Report"),
    p("Blog es el módulo con mayor densidad funcional. Combina contenido editorial enriquecido, taxonomía, publicación, SEO, portada multimedia y distribución social.", "BodyReport"),
    p("Flujo público", "H2Report"),
    bullets([
        "Blog.tsx consulta postsApi.getAll() y solo recibe publicaciones PUBLISHED desde el backend.",
        "Las tarjetas muestran portada, tags, título, excerpt, autor y fecha publicada.",
        "BlogPost.tsx obtiene un artículo por slug y construye metadata SEO con Seo.tsx.",
        "El contenido se renderiza como HTML mediante dangerouslySetInnerHTML.",
        "react-share genera botones para Facebook, X/Twitter y WhatsApp.",
        "Si no existe portada, se muestra un fallback visual con REDES.",
    ]),
    p("Archivos principales de Blog", "H2Report"),
    table([
        ["Archivo", "Responsabilidad"],
        ["frontend/src/pages/Blog.tsx", "Listado público y tarjetas de artículos"],
        ["frontend/src/pages/BlogPost.tsx", "Detalle, portada, HTML, metadata y compartir"],
        ["frontend/src/admin/pages/blog/PostList.tsx", "Listado admin, publicación/despublicación, editar y eliminar"],
        ["frontend/src/admin/pages/blog/PostEditor.tsx", "Editor BlockNote, portada, tags, estado y SEO"],
        ["frontend/src/admin/components/editor/", "Bloques, slash menu, YouTube, columnas y media con texto"],
        ["frontend/src/admin/components/upload/MediaUpload.tsx", "Subida con metadata/label y Cloudinary vía API"],
        ["backend/src/routes/blog.routes.ts", "CRUD público/admin, detalle y tags"],
        ["backend/src/services/blog.service.ts", "Slug, publicación, tags, author, consultas y CRUD"],
        ["backend/prisma/schema.prisma", "BlogPost, Tag y PostTag"],
    ], [6.0 * cm, 10.5 * cm]),
    p("Editor administrativo", "H2Report"),
    bullets([
        "useCreateBlockNote construye el editor con BlockNoteSchema y el bloque custom mediaWithText.",
        "HTMLToBlocks convierte el contenido persistido a bloques al editar.",
        "createInternalHTMLSerializer convierte los bloques a HTML antes de guardar.",
        "Se eliminan clases/UI administrativa de bloques media-with-text antes de persistir.",
        "La portada puede elegirse de MediaPicker o cargarse mediante MediaUpload.",
        "Tags se cargan desde /posts/tags y se envían como tagIds.",
        "El estado editorial se controla con botones Borrador, Publicado y Archivado.",
        "SEO title y description tienen límites 60/160 y contador visual.",
    ]),
]
story += image(ARTIFACTS / "ux-blog-admin-editor.png", "Figura 4. Editor administrativo de Blog después de corregir la incompatibilidad de Mantine.")
story.append(PageBreak())

story += [
    p("5. Persistencia y API", "H1Report"),
    p("Los dos dominios usan un patrón de rutas delgadas y servicios de dominio. Las rutas controlan autorización y formato HTTP; los servicios ejecutan Prisma y reglas específicas.", "BodyReport"),
    table([
        ["Operación", "Eventos", "Blog"],
        ["Listado público", "GET /api/v1/events", "GET /api/v1/posts"],
        ["Detalle público", "GET /api/v1/events/:slug", "GET /api/v1/posts/:slug"],
        ["Listado admin", "GET /api/v1/admin/events/all", "GET /api/v1/admin/posts/all"],
        ["Detalle admin", "GET /api/v1/admin/events/detail/:id", "GET /api/v1/admin/posts/detail/:id"],
        ["Crear", "POST /api/v1/admin/events", "POST /api/v1/admin/posts"],
        ["Actualizar", "PUT /api/v1/admin/events/:id", "PUT /api/v1/admin/posts/:id"],
        ["Eliminar", "DELETE /api/v1/admin/events/:id", "DELETE /api/v1/admin/posts/:id"],
        ["Autorización", "ADMIN/EVENT_MANAGER", "ADMIN/EDITOR"],
    ], [4.0 * cm, 6.0 * cm, 6.5 * cm]),
    p("Modelos de datos", "H2Report"),
    code("Event\n  title, slug, description, shortDescription, startDate, endDate\n  location, address, latitude, longitude, flyerUrl, gallery\n  status, isFeatured, capacity, registrationUrl, createdById\n\nBlogPost\n  title, slug, content, excerpt, coverImageUrl\n  authorId, status, publishedAt, readTime, seoTitle, seoDescription, ogImageUrl\n\nTag / PostTag\n  relación N:M entre artículos y etiquetas"),
    p("Persistencia de imágenes", "H2Report"),
    p("MediaUpload recibe el archivo en memoria mediante multer, lo envía a Cloudinary con transformaciones de calidad/formato y persiste URLs original, thumbnail y medium en Media. El editor de Blog y el formulario de Eventos pueden usar también MediaPicker para seleccionar una imagen existente.", "BodyReport"),
    p("La biblioteca exige actualmente una etiqueta al subir. La tabla Media contiene label, altText, dimensiones, tamaño y usuario cargador. Esta consistencia fue reparada mediante una migración que agregó la columna label a bases existentes.", "BodyReport"),
]
story.append(PageBreak())

story += [
    p("6. Evaluación UI/UX", "H1Report"),
    p("Fortalezas", "H2Report"),
    bullets([
        "El panel separa claramente listado y formulario mediante rutas /new y /:id.",
        "Las acciones principales tienen jerarquía consistente: Nuevo, Editar, Publicar, Eliminar.",
        "Los estados se expresan con colores y etiquetas legibles.",
        "El editor de Blog agrupa portada, extracto, tags, publicación y SEO en tarjetas.",
        "Eventos usa una estructura de formulario familiar: contenido principal, sidebar y detalles.",
        "Las tarjetas públicas priorizan imagen, título y metadatos; la información se puede escanear rápidamente.",
        "Existe feedback de loading, empty state, toast y confirmación de eliminación.",
        "Los botones de edición tienen aria-labels descriptivos en las listas.",
    ]),
    p("Problemas y riesgos", "H2Report"),
    table([
        ["Prioridad", "Hallazgo", "Impacto", "Recomendación"],
        ["Alta", "Blog usa dangerouslySetInnerHTML", "Riesgo XSS si HTML no confiable llega al frontend", "Sanitizar con allowlist en backend y/o DOMPurify antes de renderizar"],
        ["Alta", "Errores del editor podían dejar la pantalla en blanco", "Pérdida total del flujo de edición", "Mantener versiones React/Mantine/BlockNote bloqueadas y añadir smoke test de ruta :id"],
        ["Alta", "Campos del Blog no tienen ids/labels completos", "Problemas de accesibilidad y automatización", "Asociar label htmlFor con id estable en título, BlockNote, SEO y tags"],
        ["Media", "Axios se instancia en cada página admin", "Headers y errores duplicados", "Crear un cliente admin único y servicios tipados"],
        ["Media", "Errores de carga redirigen silenciosamente a la lista", "El usuario no sabe si falló auth, red o recurso", "Mostrar alerta contextual y diferenciar 401/404/500"],
        ["Media", "Fechas se muestran en timezone local sin explicación", "Riesgo de discrepancia Ecuador/servidor", "Normalizar timezone y mostrar zona en el formulario"],
        ["Media", "El endpoint público de detalle no filtra estado", "Un slug de borrador podría ser accesible", "Restringir detalle público a PUBLISHED o introducir preview autenticado"],
        ["Baja", "Eventos no tienen filtros/paginación visible", "Escalabilidad UX limitada", "Añadir filtros por estado, fecha y destacado"],
        ["Baja", "Blog no muestra paginación aunque API la entrega", "Contenido antiguo queda difícil de descubrir", "Implementar paginador o carga incremental"],
    ], [1.6 * cm, 5.0 * cm, 4.5 * cm, 5.4 * cm]),
    p("Accesibilidad", "H2Report"),
    bullets([
        "La tabla admin necesita caption o un heading asociado para contexto de lector de pantalla.",
        "Los iconos de acción están correctamente rotulados en listas, pero algunos botones del formulario de Evento no tienen aria-label.",
        "El editor BlockNote genera controles complejos: debe probarse navegación por teclado y foco tras cargar un artículo.",
        "La tarjeta pública depende de color para Destacado/estado; el texto también está presente, lo cual es positivo.",
        "Los warnings observados de labels/ids en PostEditor deben resolverse antes de auditoría WCAG formal.",
    ]),
]
story.append(PageBreak())

story += [
    p("7. Recomendaciones de arquitectura", "H1Report"),
    p("Corto plazo", "H2Report"),
    bullets([
        "Añadir un cliente HTTP admin compartido con interceptor JWT, normalización de errores y timeouts.",
        "Crear pruebas de navegación que abran /admin/dashboard/events/:id y /admin/dashboard/blog/:id con datos reales simulados.",
        "Sanitizar HTML de Blog al guardar y al renderizar.",
        "Validar duplicados de slug también en updateEvent y updatePost.",
        "No ocultar errores de carga redirigiendo silenciosamente; mostrar mensaje y acción de reintento.",
    ]),
    p("Mediano plazo", "H2Report"),
    bullets([
        "Extraer formularios en subcomponentes: EventDetails, EventMedia, PostContent, PostTaxonomy, PostSeo.",
        "Introducir schemas de validación compartidos, por ejemplo Zod, en frontend y backend.",
        "Usar respuestas tipadas para eventos, posts, tags y paginación.",
        "Mover serialización BlockNote/HTML a un módulo especializado y probado.",
        "Agregar preview autenticado del Blog antes de publicar.",
        "Añadir auditoría de cambios editoriales: quién, cuándo, qué campos y estado anterior.",
    ]),
    p("Largo plazo", "H2Report"),
    bullets([
        "Separar contenido editorial y configuración de página en contratos explícitos.",
        "Incorporar versionado o borradores con preview para Blog y Eventos.",
        "Optimizar imágenes y generar srcset responsive desde Cloudinary.",
        "Adoptar observabilidad: métricas de API, errores de editor, latencia de media y fallos de publicación.",
    ]),
    p("8. Conclusión", "H1Report"),
    p("La arquitectura actual es coherente para un CMS institucional pequeño: los dominios están bien delimitados, el público y el admin comparten contratos claros y la experiencia visual mantiene una identidad consistente. Eventos es simple y estable; Blog ofrece capacidades editoriales avanzadas, pero necesita más disciplina de dependencias, seguridad HTML y accesibilidad. La corrección de Mantine/React resolvió el bloqueo de edición observado y debe quedar protegida por pruebas de navegación y un lockfile estable.", "BodyReport"),
    rich("<b>Capturas incluidas:</b> listado público de Blog, listado público de Eventos, editor admin de Blog y editor admin de Eventos. Los archivos originales se conservan en <font name='Courier'>.artifacts/</font>.", "CalloutReport"),
]


def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result


story = flatten(story)

doc = SimpleDocTemplate(
    str(OUTPUT), pagesize=A4, rightMargin=1.7 * cm, leftMargin=1.7 * cm,
    topMargin=1.5 * cm, bottomMargin=1.8 * cm,
    title="Análisis UI/UX y Arquitectura de Blog y Eventos - Ministerio REDES",
    author="OpenCode",
)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
