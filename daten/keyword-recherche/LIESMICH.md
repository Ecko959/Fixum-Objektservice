# Keyword-Recherche – Rohdaten

**Abrufdatum:** 2026-11-08

Diese Dateien enthalten nur Rohdaten. An der Website wurde nichts geändert.

## Dateien

- `autocomplete.json` – Google-Autovervollständigung (`suggestqueries.google.com`, `client=firefox`, `hl=de`, `gl=de`)
- `trends.json` – Google Trends über pytrends, Zeitraum `today 5-y`

## Autovervollständigung

- Anfragen gesamt: **1336** (a: 20, b: 580, c: 580, d: 156)
- Davon mit Fehler (endgültig): **0**
- Ohne Fehler, aber ohne Vorschläge: 105
- Ab etwa Anfrage 500 antwortete Google im ersten Durchlauf mit HTTP 403 (Drosselung). Diese 837 Anfragen wurden in einem zweiten Durchlauf mit ca. 1 s Abstand nachgeholt (Feld `"nachgeholt": true`).

## Google Trends

- Abfragen gesamt: **28** Einträge (8 × `interest_by_region` Stadtebene DE-NI, 4 Vergleichs-Payloads × 5 Begriffe `interest_over_time`)
- Davon mit Fehler: **0**
- **Wichtig:** Auf Stadtebene in Niedersachsen (`resolution=CITY`, `inc_low_vol=True`) liefert Google für alle 8 Keywords bei allen Orten den Wert 0 bzw. `hasData=false`. Das ist auch in der Rohantwort des Endpunkts `/trends/api/widgetdata/comparedgeo` so – das Suchvolumen liegt unter Googles Mindestschwelle. Die Werte sind also „keine Daten“, nicht „kein Interesse“.
- Die Vergleichswerte (`mittelwert`) sind nur **innerhalb derselben Vergleichsgruppe und Region** vergleichbar (0–100, relativ zum höchsten Punkt der Gruppe).

## Hinweis

Weder die Autovervollständigung noch Google Trends liefern **absolute Suchvolumen**. Die Autovervollständigung zeigt nur, dass Suchanfragen tatsächlich vorkommen; Trends zeigt nur relatives Interesse (0–100). Für echte Monatsvolumen braucht man z. B. den Google Ads Keyword-Planer.
