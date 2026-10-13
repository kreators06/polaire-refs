# Polaire Refs

Base de références créatives de Polaire Studios : [Karakeep](https://github.com/karakeep-app/karakeep) (logiciel libre, AGPL-3.0) habillé à la charte Polaire V2.

Ce dépôt ne contient pas de copie de Karakeep, seulement ce qui change :

- `branding/assets/` : logotype « polaire. », pastille et icônes Polaire ;
- `branding/theme.css` : couleurs papier / encre / os, rayons, sélection jaune ;
- `branding/apply.sh` : applique le tout sur le code de Karakeep (nom « Polaire Refs », police Area, boutons en pilule, français par défaut) ;
- `.github/workflows/build.yml` : compile l'image `ghcr.io/kreators06/polaire-refs` sur GitHub Actions.

## Mettre à jour vers une nouvelle version de Karakeep

Chaque lundi, le workflow compile automatiquement la dernière version publiée de Karakeep si elle n'existe pas encore. Pour forcer une version : onglet **Actions** → **Image Polaire Refs** → **Run workflow**, puis indiquer le tag (ex. `v0.34.0`).

Ensuite, dans Coolify, remplacer le tag de l'image du service « Web » par la nouvelle version et redéployer.

Si une nouvelle version de Karakeep déplace un fichier modifié, `apply.sh` s'arrête avec le message « motif introuvable » : il faut alors ajuster le script.

## Tagging automatique par Claude

L'image est préréglée pour que Karakeep tague les références avec Claude (`claude-opus-5-5`, tags en français), via la passerelle compatible OpenAI de l'API Anthropic (`https://api.anthropic.com/v1/`). Il suffit de mettre une clé API Claude (platform.claude.com → API keys) dans la variable `SERVICE_OPENAI_API_KEY` du service dans Coolify, puis de redémarrer.

Pour changer de modèle, modifier `AI_MODEL` dans `branding/apply.sh` et recompiler, ou définir `INFERENCE_TEXT_MODEL` / `INFERENCE_IMAGE_MODEL` dans l'environnement du conteneur.

### Grille de tags

`branding/tagging.ts` définit la grille commune à tous les comptes : format, intérêt, technique, ton et thème (83 tags), ainsi que les consignes envoyées à Claude pour les liens, les images et les résumés. Ces consignes passent avant les règles personnelles de chaque compte (Paramètres → IA → Règles de tagging), et l'aperçu du prompt les affiche.

Claude ne peut poser que des tags de la grille, ou de la liste « Tags sélectionnés » d'un compte. Une autre proposition est ignorée, et une variante d'écriture (« Plan Séquence ») est ramenée au tag de la grille (« plan-séquence »).

Pour modifier la grille, éditer `branding/tagging.ts`, recompiler l'image (onglet **Actions**), puis redéployer dans Coolify. Pour re-taguer les références existantes : Administration → Actions → regénérer les tags IA de tous les favoris.

## Polices

Aucun fichier de police n'est publié ici (licences restreintes). L'interface charge Area depuis le kit Adobe Fonts de Polaire (`amt1dky`) ; le domaine `refs.polairestudios.com` doit être autorisé dans ce kit, sinon l'interface s'affiche en Helvetica Neue.

## Licences

- Karakeep et ses modifications (`apply.sh`, `theme.css`, workflow) : AGPL-3.0, voir `LICENSE`. Le code source correspondant à l'image publiée est la version de Karakeep indiquée par son tag, plus ce dépôt.
- Logotype, pastille et étoile Polaire : marques de Polaire Studios, tous droits réservés, hors licence libre.
