# Navjyot Materials

Buildless, mobile-friendly pilot catalog. Serve `dist/` with any static host. No buyer login or app installation required.

## Updating the inventory

Edit `dist/catalog.json` and redeploy. Current entries are explicitly labeled examples, not real stock. Replace these with confirmed material and set `demo` to `false` only once every listing represents real inventory. The first version uses illustrations; real photos should replace them when supplied. The example notice in `index.html` must also be updated when launching real stock.

Each material records an ID, name, category, grade, shape, dimensions, quantity, illustration type, tone and note. To remove sold stock, remove the corresponding record and redeploy. Do not treat the catalog as a live reservation system.

WhatsApp inquiries go to +91 99784 41381. Buyers send messages themselves; the website opens a prefilled draft. No requests, buyer data or messages are stored by the website.

## Seller verification

Navjyot's network-verification badge records the pilot organizer's personal confirmation that they know the owner and that the workshop operates in Bakrol. It is not independent certification or material verification. The badge opens a disclosure explaining these limits.

## Local preview

`python3 -m http.server 4173 --directory dist`

Open http://localhost:4173. Public hosting is required for a link that works on other phones.
