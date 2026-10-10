# Navjyot Materials

Buildless, mobile-friendly pilot catalog. Serve `dist/` with any static host. No buyer login or app installation required.

## Updating the inventory

Edit `dist/catalog.json` and redeploy. The catalog now contains one seller-reported EN8 D stock lot, NAV-001, with three supplied workshop photos. Approximately 4 tonnes is the combined quantity across all lengths, not a quantity per length. Keep specs as seller stated until documentation is supplied. Update the stock notice in `index.html` alongside catalog changes. Original photo files are copied without alteration into `dist/assets/`.

Each material records an ID, name, category, grade, shape, diameter, available lengths, combined quantity, make, purchase year, stock reporting date, photos and note. To remove sold stock, remove the corresponding record and redeploy. Do not treat the catalog as a live reservation system.

WhatsApp inquiries go to +91 99784 41381. Buyers send messages themselves; the website opens a prefilled draft. No requests, buyer data or messages are stored by the website.

## Seller verification

Navjyot's network-verification badge records the pilot organizer's personal confirmation that they know the owner and that the workshop operates in Bakrol. It is not independent certification or material verification. The badge opens a disclosure explaining these limits.

## Local preview

`python3 -m http.server 4173 --directory dist`

Open http://localhost:4173. Public hosting is required for a link that works on other phones.
