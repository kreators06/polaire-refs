#!/usr/bin/env bash
# Applique la charte Polaire sur une copie du code source de Karakeep.
# Usage : branding/apply.sh <dossier karakeep>
# Chaque modification vérifie qu'elle a bien eu lieu : si une nouvelle version
# de Karakeep déplace un fichier, la compilation s'arrête au lieu de produire
# une image à moitié habillée.
set -euo pipefail

UP="${1:?usage: apply.sh <dossier karakeep>}"
HERE="$(cd "$(dirname "$0")" && pwd)"
export APP_NAME="${APP_NAME:-Polaire Refs}"
export APP_DESCRIPTION="${APP_DESCRIPTION:-Base de références créatives de Polaire Studios.}"
export AI_MODEL="${AI_MODEL:-claude-opus-5-5}"
WEB="$UP/apps/web"

# Remplace via une expression perl et échoue si le fichier n'a pas changé.
patch_file() {
  local file="$1" expr="$2" before
  before="$(cksum < "$file")"
  perl -0pi -e "$expr" "$file"
  if [ "$(cksum < "$file")" = "$before" ]; then
    echo "apply.sh : motif introuvable dans $file" >&2
    exit 1
  fi
}

echo "→ Logos et icônes"
cp "$HERE/assets/icons/"* "$WEB/public/icons/"
cp "$HERE/assets/apple-icon.png" "$WEB/app/apple-icon.png"
cp "$HERE/assets/favicon.ico" "$WEB/public/favicon.ico"

echo "→ Nom de l'application ($APP_NAME)"
# « Karakeep » reste quand il désigne le format d'import/export.
grep -rlE '\bKarakeep\b' \
    "$WEB/app" "$WEB/components" \
    "$WEB/lib/i18n/locales/fr" "$WEB/lib/i18n/locales/en" \
    "$UP/packages/trpc/email.ts" "$UP/packages/trpc/routers/invites.ts" \
  | grep -vE 'components/settings/ImportExport\.tsx|components/shared/sidebar/SidebarVersion\.tsx' \
  | while read -r f; do
      perl -pi -e 'next if /karakeep_export/; s/\bKarakeep\b/$ENV{APP_NAME}/g' "$f"
    done
# La version affichée garde la mention de Karakeep (logiciel libre AGPL).
patch_file "$WEB/components/shared/sidebar/SidebarVersion.tsx" \
  's/`Karakeep v/`$ENV{APP_NAME} · Karakeep v/'

echo "→ Description et couleurs du manifeste"
for f in "$WEB/app/layout.tsx" "$WEB/app/manifest.ts"; do
  patch_file "$f" 's/"The Bookmark Everything app\.[^"]*"/"$ENV{APP_DESCRIPTION}"/'
done
patch_file "$WEB/app/manifest.ts" 's/background_color: "#ffffff"/background_color: "#F8F9F3"/; s/theme_color: "#ffffff"/theme_color: "#1F1C17"/'

echo "→ Police Area (kit Adobe Fonts Polaire)"
patch_file "$WEB/app/layout.tsx" \
  's|(\s*)<body className=\{inter\.className\}>|$1<head>$1  <link rel="stylesheet" href="https://use.typekit.net/amt1dky.css" />$1</head>$1<body className={inter.className}>|'

echo "→ Thème (couleurs, rayons, sélection)"
cat "$HERE/theme.css" >> "$UP/tooling/tailwind/globals.css"

echo "→ Boutons en pilule"
patch_file "$UP/packages/shared-react/components/ui/button.tsx" 's/\brounded-md\b/rounded-full/g'

echo "→ Interface en français par défaut"
patch_file "$WEB/lib/userLocalSettings/types.ts" 's/lang: z\.string\(\)\.optional\(\)\.default\("en"\)/lang: z.string().optional().default("fr")/'

echo "→ Tagging par Claude ($AI_MODEL)"
# Karakeep ne parle que le format OpenAI : on passe par la passerelle compatible
# d'Anthropic. Elle ignore response_format, d'où la sortie « plain » que Karakeep
# sait analyser. Ce sont des valeurs par défaut : l'environnement du conteneur
# peut les remplacer. La clé reste dans Coolify (OPENAI_API_KEY = clé Claude).
patch_file "$UP/docker/Dockerfile" 's/^(FROM aio_builder AS aio\n)/$1ENV OPENAI_BASE_URL=https:\/\/api.anthropic.com\/v1\/ \\\n    INFERENCE_TEXT_MODEL=$ENV{AI_MODEL} \\\n    INFERENCE_IMAGE_MODEL=$ENV{AI_MODEL} \\\n    INFERENCE_OUTPUT_SCHEMA=plain \\\n    INFERENCE_LANG=french \\\n    INFERENCE_MAX_OUTPUT_TOKENS=4096 \\\n    INFERENCE_JOB_TIMEOUT_SEC=120\n/m'

echo "Charte Polaire appliquée."
