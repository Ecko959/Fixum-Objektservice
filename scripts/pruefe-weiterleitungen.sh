#!/usr/bin/env bash
# Prüft alle Weiterleitungen aus vercel.json gegen eine laufende Seite.
# Aufruf nach dem Deploy:  bash scripts/pruefe-weiterleitungen.sh
#          oder lokal:      bash scripts/pruefe-weiterleitungen.sh http://localhost:4322
# Erwartet je Regel: Status 301, Location = Ziel, Ziel antwortet mit 200.
set -u
BASIS="${1:-https://www.fixum-objektservice.de}"
fehler=0
while IFS=$'\t' read -r quelle ziel; do
  kopf=$(curl -s -o /dev/null -I -w "%{http_code} %{redirect_url}" "$BASIS$quelle")
  code=${kopf%% *}
  ort=${kopf#* }
  ort=${ort#"$BASIS"}
  zielcode=$(curl -s -o /dev/null -I -w "%{http_code}" "$BASIS$ziel")
  if [ "$code" = "301" ] && [ "$ort" = "$ziel" ] && [ "$zielcode" = "200" ]; then
    status=OK
  else
    status=FEHLER
    fehler=$((fehler + 1))
  fi
  printf "%-6s %s  %-44s -> %-26s (Ziel %s)\n" "$status" "$code" "$quelle" "$ort" "$zielcode"
done < <(node -e 'for (const r of require("./vercel.json").redirects) console.log(r.source + "\t" + r.destination)')
echo "Fehler: $fehler"
exit $((fehler > 0))
