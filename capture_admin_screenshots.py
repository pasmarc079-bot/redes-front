#!/usr/bin/env python3
"""
Script Playwright para capturar screenshots de todas las páginas del admin.
Ejecuta: python capture_admin_screenshots.py
Requiere: pip install playwright && playwright install chromium
"""

import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

# ─── Configuración ───
BASE_URL = "https://www.ministerioredes.org"
CREDENTIALS = {
    "username": "pasmarc079",
    "password": "Excelencia079"
}

# Páginas a capturar (ruta, nombre_archivo, selector_esperado)
PAGES = [
    ("/admin/login", "01_login.png", "input#username"),
    ("/admin/dashboard", "02_dashboard.png", "h1:has-text('Dashboard')"),
    ("/admin/dashboard/events", "03_eventos_lista.png", "h1:has-text('Eventos')"),
    ("/admin/dashboard/events/new", "04_evento_nuevo.png", "h1:has-text('Nuevo Evento')"),
    ("/admin/dashboard/blog", "05_blog_lista.png", "h1:has-text('Artículos del Blog')"),
    ("/admin/dashboard/blog/new", "06_articulo_nuevo.png", "h1:has-text('Nuevo Artículo')"),
    ("/admin/dashboard/media", "07_media_library.png", "h1:has-text('Biblioteca de Media')"),
    ("/admin/dashboard/settings", "08_configuracion_paginas.png", "button:has-text('Configuración de Páginas')"),
    ("/admin/dashboard/system", "09_sistema.png", "h1:has-text('Acerca del Sistema')"),
]

OUT_DIR = Path(__file__).parent / "admin_screenshots"
OUT_DIR.mkdir(exist_ok=True)


async def login(page):
    """Inicia sesión en el admin."""
    await page.goto(f"{BASE_URL}/admin/login", wait_until="networkidle")
    await page.fill('input[id="username"]', CREDENTIALS["username"])
    await page.fill('input[id="password"]', CREDENTIALS["password"])
    await page.click('button[type="submit"]')
    # Espera redirección a dashboard
    await page.wait_for_url(f"{BASE_URL}/admin/dashboard**", timeout=15000)
    print("✅ Login exitoso")


async def capture_page(page, path, filename, selector):
    """Navega a una página y captura screenshot."""
    url = f"{BASE_URL}{path}"
    try:
        await page.goto(url, wait_until="networkidle", timeout=20000)
        # Espera que aparezca el selector característico
        await page.wait_for_selector(selector, timeout=10000)
        # Pequeña pausa para render completo
        await page.wait_for_timeout(1000)
        # Captura viewport completo
        await page.screenshot(
            path=str(OUT_DIR / filename),
            full_page=True,
            animations="disabled"
        )
        print(f"📸 {filename} ✓")
        return True
    except Exception as e:
        print(f"❌ {filename} falló: {e}")
        return False


async def main():
    async with async_playwright() as p:
        # Lanza Chromium headless
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 720},
            device_scale_factor=2,  # Retina/HDPI
        )
        page = await context.new_page()

        print("🚀 Iniciando captura de screenshots...")
        print(f"📁 Guardando en: {OUT_DIR}\n")

        # Login una vez
        await login(page)

        # Captura cada página
        success = 0
        for path, filename, selector in PAGES:
            if await capture_page(page, path, filename, selector):
                success += 1

        await browser.close()
        print(f"\n✅ Completado: {success}/{len(PAGES)} capturas exitosas")
        print(f"📂 Archivos en: {OUT_DIR}")


if __name__ == "__main__":
    asyncio.run(main())