# Propuesta · Salón / Jardín de eventos

Plantilla demo de Sistemas Mexicanos para salones y jardines de eventos (bodas, XV años, bautizos, cumpleaños, empresariales). Página estática, sin build.

Publicada en: https://propuesta-salon-eventos.netlify.app

## Parámetros en la URL

| Parámetro | Ejemplo | Qué hace |
|---|---|---|
| `n` | `?n=Jardin-de-Eventos-El-Cielito` | Nombre del negocio (guiones → espacios; "Jardin" y "Salon" se acentúan solos). Sin `n`: "Jardín de Eventos". |
| `w` | `&w=5579094806` | WhatsApp del negocio a 10 dígitos → `wa.me/52…`. Sin `w`: WhatsApp de Sistemas Mexicanos (56 1188 2182). |
| `c` | `&c=300` | Opcional: capacidad ("Hasta 300 invitados"). |
| `z` | `&z=Tlahuac-CDMX` | Opcional: zona en la sección de ubicación. |

Ejemplo: `https://propuesta-salon-eventos.netlify.app/?n=Jardin-de-Eventos-El-Cielito&w=5579094806`

El mensaje de WhatsApp prellenado es "Hola, quiero información para un evento".

`netlify/edge-functions/nombre.js` pone el nombre en `<title>` y Open Graph del lado del servidor, para que la vista previa del link en WhatsApp muestre el nombre del negocio.

## Estructura

- `site/` — index.html, styles.css, script.js, img/ (fotos generadas, sin personas), fonts/ (Cormorant Garamond y Jost, OFL)
- `netlify/edge-functions/` — nombre en la vista previa del link
- `test/` — `node --test test/site.test.js`

Deploy: `netlify deploy --prod --dir site` desde la raíz.
