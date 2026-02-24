#!/bin/bash
# ASTRO4 — Test suite post-refactor Opción B
# Uso: bash test-astro4.sh
# Valida que el prompt server-side produce resultados equivalentes al viejo

BASE="https://astro4.duendes.app"
PASS=0
FAIL=0

green() { echo -e "\033[32m✅ $1\033[0m"; }
red() { echo -e "\033[31m❌ $1\033[0m"; }
header() { echo -e "\n\033[1;36m━━━ $1 ━━━\033[0m"; }

check() {
  local desc="$1" condition="$2"
  if eval "$condition"; then
    green "$desc"
    ((PASS++))
  else
    red "$desc"
    ((FAIL++))
  fi
}

# ══════════════════════════════════════
header "1. PÁGINAS CARGAN"
# ══════════════════════════════════════

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/")
check "index.html → 200" '[ "$STATUS" = "200" ]'

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/app.html?nombre=Test&fecha=1990-01-15&genero=m&lang=es")
check "app.html → 200" '[ "$STATUS" = "200" ]'

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/privacy.html")
check "privacy.html → 200" '[ "$STATUS" = "200" ]'

# ══════════════════════════════════════
header "2. API — FORMATO NUEVO (JSON estructurado)"
# ══════════════════════════════════════

RESP_ES=$(curl -s -X POST "$BASE/api/consulta" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María",
    "genero": "f",
    "lang": "es",
    "pregunta": "¿Cómo será mi día de hoy en el amor?",
    "perfil": {
      "westernName": "Scorpio",
      "westernElement": "Water",
      "chineseAnimal": "Serpiente",
      "chineseElement": "Fuego",
      "chineseYinYang": "Yin",
      "vedic": "Anuradha",
      "lifeNumber": 9,
      "lifeMeaning": "compasión",
      "personalDay": 6
    },
    "datosNum": {
      "edad": 34,
      "anoPersonal": 3,
      "etapaActual": 2,
      "edadInicioEtapa": 27
    }
  }')

RESP_TEXT=$(echo "$RESP_ES" | python3 -c "import sys,json; print(json.load(sys.stdin).get('respuesta',''))" 2>/dev/null)
RESP_LEN=${#RESP_TEXT}

check "API responde (len > 50)" '[ "$RESP_LEN" -gt 50 ]'
check "Usa nombre 'María'" 'echo "$RESP_TEXT" | grep -qi "María"'
check "Saludo femenino (Querida)" 'echo "$RESP_TEXT" | grep -qi "Querida"'
check "NO menciona 'Scorpio/Escorpio'" '! echo "$RESP_TEXT" | grep -qi "Scorpio\|Escorpio"'
check "NO menciona 'Serpiente/Snake'" '! echo "$RESP_TEXT" | grep -qi "Serpiente\|Snake"'
check "Responde en español" 'echo "$RESP_TEXT" | grep -qi "tu\|para\|hoy\|día\|amor"'

# ══════════════════════════════════════
header "3. API — FORMATO NUEVO EN INGLÉS"
# ══════════════════════════════════════

RESP_EN=$(curl -s -X POST "$BASE/api/consulta" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "John",
    "genero": "m",
    "lang": "en",
    "pregunta": "What should I focus on today?",
    "perfil": {
      "westernName": "Aries",
      "westernElement": "Fire",
      "chineseAnimal": "Tiger",
      "chineseElement": "Wood",
      "chineseYinYang": "Yang",
      "vedic": "Ashwini",
      "lifeNumber": 1,
      "lifeMeaning": "leadership",
      "personalDay": 8
    },
    "datosNum": {
      "edad": 40,
      "anoPersonal": 7,
      "etapaActual": 3,
      "edadInicioEtapa": 35
    }
  }')

RESP_EN_TEXT=$(echo "$RESP_EN" | python3 -c "import sys,json; print(json.load(sys.stdin).get('respuesta',''))" 2>/dev/null)

check "Inglés responde (len > 50)" '[ ${#RESP_EN_TEXT} -gt 50 ]'
check "Usa nombre 'John'" 'echo "$RESP_EN_TEXT" | grep -qi "John"'
check "Responde en inglés" 'echo "$RESP_EN_TEXT" | grep -qi "you\|your\|today\|focus"'
check "NO menciona 'Aries'" '! echo "$RESP_EN_TEXT" | grep -qi "Aries"'

# ══════════════════════════════════════
header "4. API — BACKWARD COMPAT (formato viejo)"
# ══════════════════════════════════════

RESP_OLD=$(curl -s -X POST "$BASE/api/consulta" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Responde en ESPAÑOL. USUARIO: Legacy (hombre, 30 años). PREGUNTA: Hola. INSTRUCCIONES: 1.Saluda. 2.Máximo 2 oraciones."}')

RESP_OLD_TEXT=$(echo "$RESP_OLD" | python3 -c "import sys,json; print(json.load(sys.stdin).get('respuesta',''))" 2>/dev/null)

check "Backward compat responde" '[ ${#RESP_OLD_TEXT} -gt 10 ]'
check "Usa nombre Legacy" 'echo "$RESP_OLD_TEXT" | grep -qi "Legacy"'

# ══════════════════════════════════════
header "5. API — VALIDACIÓN / GIBBERISH"
# ══════════════════════════════════════

RESP_GARBG=$(curl -s -X POST "$BASE/api/consulta" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "genero": "x",
    "lang": "es",
    "pregunta": "asdfghjkl",
    "perfil": {"westernName":"Leo","westernElement":"Fire","chineseAnimal":"Dragón","chineseElement":"Fuego","chineseYinYang":"Yang","vedic":"Magha","lifeNumber":5,"lifeMeaning":"cambio","personalDay":1},
    "datosNum": {"edad":25,"anoPersonal":3,"etapaActual":1,"edadInicioEtapa":0}
  }')

RESP_GARBG_TEXT=$(echo "$RESP_GARBG" | python3 -c "import sys,json; print(json.load(sys.stdin).get('respuesta',''))" 2>/dev/null)

check "Gibberish rechazado" 'echo "$RESP_GARBG_TEXT" | grep -qi "No entendí\|reformul"'

RESP_EMPTY=$(curl -s -X POST "$BASE/api/consulta" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"X","genero":"x","lang":"es","pregunta":"ab","perfil":{"westernName":"Leo","westernElement":"Fire","chineseAnimal":"Dragón","chineseElement":"Fuego","chineseYinYang":"Yang","vedic":"Magha","lifeNumber":5,"lifeMeaning":"cambio","personalDay":1},"datosNum":{"edad":25,"anoPersonal":3,"etapaActual":1,"edadInicioEtapa":0}}')

RESP_EMPTY_TEXT=$(echo "$RESP_EMPTY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('respuesta',''))" 2>/dev/null)

check "Pregunta muy corta rechazada" 'echo "$RESP_EMPTY_TEXT" | grep -qi "No entendí\|reformul"'

# ══════════════════════════════════════
header "6. GÉNERO NEUTRO"
# ══════════════════════════════════════

RESP_X=$(curl -s -X POST "$BASE/api/consulta" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Alex",
    "genero": "x",
    "lang": "es",
    "pregunta": "¿Qué energía tiene hoy para mí?",
    "perfil": {"westernName":"Gemini","westernElement":"Air","chineseAnimal":"Mono","chineseElement":"Metal","chineseYinYang":"Yang","vedic":"Ardra","lifeNumber":3,"lifeMeaning":"expresión","personalDay":5},
    "datosNum": {"edad":28,"anoPersonal":1,"etapaActual":1,"edadInicioEtapa":0}
  }')

RESP_X_TEXT=$(echo "$RESP_X" | python3 -c "import sys,json; print(json.load(sys.stdin).get('respuesta',''))" 2>/dev/null)

check "Género neutro: NO dice Querido/Querida" '! echo "$RESP_X_TEXT" | grep -qi "Querid"'
check "Género neutro: usa nombre Alex" 'echo "$RESP_X_TEXT" | grep -qi "Alex"'

# ══════════════════════════════════════
header "7. SEGURIDAD — PROMPT NO EXPUESTO"
# ══════════════════════════════════════

APP_SOURCE=$(curl -s "$BASE/app.html?nombre=Test&fecha=1990-01-15&genero=m&lang=es")

check "app.html NO tiene INSTRUCCIONES" '! echo "$APP_SOURCE" | grep -q "INSTRUCCIONES:"'
check "app.html NO tiene 5-7 oraciones" '! echo "$APP_SOURCE" | grep -q "5-7 oraciones"'
check "app.html NO tiene PERFIL ENERGÉTICO" '! echo "$APP_SOURCE" | grep -q "PERFIL ENERGÉTICO"'
check "app.html SÍ tiene JSON.stringify(payload)" 'echo "$APP_SOURCE" | grep -q "JSON.stringify(payload)"'

# ══════════════════════════════════════
header "RESULTADOS"
# ══════════════════════════════════════

TOTAL=$((PASS + FAIL))
echo ""
echo "Pasaron: $PASS / $TOTAL"
if [ "$FAIL" -gt 0 ]; then
  red "FALLARON: $FAIL tests"
  exit 1
else
  green "TODOS LOS TESTS PASARON"
  exit 0
fi
