# ASTRO4 — Calculadora Astrológica PWA

App de astrología personal con 4 tradiciones (Occidental, Védica, China, Numerología).
Disponible en Google Play como TWA y en web en [astro4.duendes.app](https://astro4.duendes.app).

---

## Branches

| Branch | Propósito | Acceso |
|--------|-----------|--------|
| `main` | Staging / desarrollo. Los duendes trabajan aquí. | Libre |
| `production` | **Rama protegida.** Solo recibe merges aprobados desde `main`. Vercel sirve `astro4.duendes.app` desde esta branch. | Solo merge explícito |

**Flujo de trabajo:**
```
main (desarrollo) → revisión → merge a production → Vercel deploya automático
```

> ⚠️ No hacer commits directos a `production`. Todo cambio va a `main` primero.

---

## Stack

- **Frontend:** PWA vanilla JS — `public/index.html`, `public/app.html`
- **Backend:** Vercel Serverless Functions — `api/`
- **Pagos:** Stripe (modo live)
- **Analytics:** Plausible
- **AI:** Anthropic Claude (Haiku)

## APIs

| Endpoint | Método | Descripción | Rate limit |
|----------|--------|-------------|-----------|
| `/api/consulta` | POST | Consulta astrológica principal | 20 req/IP/hora |
| `/api/profundizar` | POST | Lectura rápida del día | 10 req/IP/hora |
| `/api/webhook` | POST | Stripe webhook (signature requerida) | — |
| `/api/verify-session` | POST | Verificar sesión de pago | — |

## Seguridad

- CSP, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy — configurados en `vercel.json`
- Rate limiting in-memory por IP en todos los endpoints de IA
- Input validation + gibberish check en todas las APIs
- SRI (Subresource Integrity) en scripts de CDN
- Sin secrets en código fuente — todo via `process.env`

---

*La Colmena — 2026*
