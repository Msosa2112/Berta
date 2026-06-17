# Design

## Visual Identity & Theme

### Color Palette
- **Fondo General (Body):** Gradiente de malla oscura (`hsla(253,16%,7%,1)`, `hsla(225,39%,30%,1)`, `hsla(339,49%,30%,1)`).
- **Contenedor Principal (#root):** Blanco translúcido (`rgba(255,255,255,0.3)`) con efecto frosted glass (`blur(60px) saturate(200%)`).
- **Acento de Marca:** Azul iOS (`#007aff`) con gradientes complementarios (`linear-gradient(135deg, #007aff 0%, #5ac8fa 100%)`).
- **Texto:** Oscuro principal (`#1c1c1e`), secundario (`#3a3a3c`), gris tenue (`#8e8e93`).

### Typography
- **Fuente Principal & Display:** Fuente del sistema nativo iOS (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, etc.).
- **Escala de Texto:**
  - Titulares principales: 1.2rem - 1.4rem, peso 800 (semi-condensado).
  - Cuerpo del texto: 0.88rem, peso 500, espaciado relajado.

### Spacing & Layout
- Rejilla responsiva móvil de 1 columna con márgenes laterales de 20px.
- Contenedores con radios grandes: `24px` para tarjetas principales, `16px` para secundarias.

### Motion & Interactions
- Easing principal: `cubic-bezier(0.32, 0.72, 0, 1)` (curva tipo iOS).
- Duración: 150ms a 280ms para transiciones estándar, 550ms para overlays de pantalla completa.
- Respuesta física al presionar: `transform: scale(0.97)` o `scale(0.98)` en botones e ítems clicables al activarse (`:active`).
