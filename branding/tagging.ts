// Grille de tags de Polaire Refs, commune à tous les comptes.
// apply.sh copie ce fichier dans packages/shared/polaire.ts : ces règles
// passent avant les règles personnelles de chaque compte (Paramètres → IA),
// et seuls les tags de la grille sont gardés.
// Pour modifier la grille : éditer ce fichier puis recompiler l'image (README).

const FORMAT = [
  "pub",
  "film de marque",
  "film institutionnel",
  "documentaire",
  "clip",
  "fiction",
  "contenu social",
  "motion design",
  "captation",
  "bande-annonce",
  "générique",
  "photo",
  "affiche",
  "identité visuelle",
  "site web",
];

const INTERET = [
  "hook",
  "narration",
  "concept",
  "écriture",
  "montage",
  "rythme",
  "transition",
  "effet visuel",
  "cadrage",
  "mouvement de caméra",
  "lumière",
  "étalonnage",
  "direction artistique",
  "décor",
  "casting",
  "jeu d'acteur",
  "sound design",
  "musique",
  "voix off",
  "typographie",
  "titrage",
  "packshot",
  "call to action",
];

const TECHNIQUE = [
  "plan-séquence",
  "drone",
  "fpv",
  "caméra à l'épaule",
  "ralenti",
  "timelapse",
  "macro",
  "split screen",
  "stop motion",
  "animation 2d",
  "3d",
  "mixed media",
  "rotoscopie",
  "ia générative",
  "images d'archives",
  "face caméra",
  "ugc",
];

const TON = [
  "émouvant",
  "drôle",
  "inspirant",
  "engagé",
  "poétique",
  "épuré",
  "brut",
  "cinématographique",
  "pop",
  "sombre",
  "rétro",
  "décalé",
  "élégant",
];

const THEME = [
  "environnement",
  "santé",
  "solidarité",
  "éducation",
  "culture",
  "sport",
  "alimentation",
  "mobilité",
  "tech",
  "mode",
  "luxe",
  "finance",
  "institution",
  "territoire",
];

export const POLAIRE_TAG_NAMES = [
  ...FORMAT,
  ...INTERET,
  ...TECHNIQUE,
  ...TON,
  ...THEME,
  "vertical",
];

const list = (tags: string[]) => tags.join(", ");

const TAGGING_RULES = [
  "Contexte : Polaire Studios est un studio de production audiovisuelle (pubs, films de marque, documentaires, contenus sociaux). Chaque favori est une référence créative à retrouver par FORMAT, INTÉRÊT, TECHNIQUE, TON et THÈME. Choisis exactement 1 FORMAT et 1 TON, puis 0 à 2 INTÉRÊT, 0 à 2 TECHNIQUE et 0 ou 1 THÈME, soit 2 à 7 tags. Cette règle remplace toute consigne de nombre de tags donnée plus haut.",
  `FORMAT (ce qu'est la référence) : ${list(FORMAT)}.`,
  `INTÉRÊT (ce qu'on veut en retenir pour un projet) : ${list(INTERET)}.`,
  `TECHNIQUE (comment c'est fabriqué) : ${list(TECHNIQUE)}.`,
  `TON (une seule ambiance dominante) : ${list(TON)}.`,
  `THÈME (seulement si le sujet est clair) : ${list(THEME)}.`,
  "N'utilise que les tags de ces listes (et vertical), écrits exactement comme ci-dessus : minuscules, accents et tirets compris, même si une consigne de style plus haut dit autre chose.",
  "N'attribue un tag que si le contenu le justifie ; dans le doute, abstiens-toi : un tag manquant vaut mieux qu'un tag faux.",
];

export const POLAIRE_TEXT_RULES = [
  ...TAGGING_RULES,
  "Pour une vidéo (YouTube, Vimeo, Instagram, TikTok), tu ne vois pas les images : seulement le titre, la description et le texte de la page. Déduis le FORMAT, le TON et le THÈME ; ne mets un tag INTÉRÊT ou TECHNIQUE que si le texte le dit explicitement (ex. « filmé en plan-séquence », « tourné au drone », « VFX », « making-of »).",
  "Si la page est un article ou une fiche crédits qui présente un film (Shots, Stash, Ads of the World, It's Nice That, Creative Review, Vimeo Staff Picks…), tague le film présenté, pas l'article ni le site qui le publie.",
  "Correspondances : spot, TVC, commercial, campagne → pub ; brand film, manifesto → film de marque ; corporate → film institutionnel ; music video → clip ; short film → fiction ; title sequence, opening credits → générique ; trailer → bande-annonce ; reel, short, TikTok → contenu social.",
  "Ajoute aussi le tag vertical si la référence est un Reel Instagram, un TikTok ou un YouTube Short.",
];

export const POLAIRE_IMAGE_RULES = [
  ...TAGGING_RULES,
  "L'image est le plus souvent une capture de film, un photogramme ou une planche de moodboard. Tague ce qui est intéressant à reprendre (cadrage, lumière, étalonnage, direction artistique, décor, typographie…) et mets toujours au moins un tag INTÉRÊT. Vise 3 à 6 tags au total, pas 10 à 15.",
  "Ne tague pas les objets, personnes ou lieux visibles (voiture, femme, ciel, ville). Si l'image est une capture d'un lecteur vidéo ou d'un réseau social, ignore l'interface et analyse seulement l'image du contenu. Ajoute le tag vertical si l'image est au format portrait 9:16.",
];

export const POLAIRE_SUMMARY_RULES = [
  "Ignore la consigne de 3-4 phrases : écris 2 phrases au plus, du point de vue d'un réalisateur. Phrase 1 : ce que c'est et ce qu'on y voit. Phrase 2 : ce qu'on pourrait en reprendre pour un projet Polaire (idée, mise en scène, technique).",
  "Termine par une ligne « Crédits : » avec l'annonceur, l'agence, la production et le réalisateur s'ils sont mentionnés ; omets cette ligne si aucun crédit n'est indiqué et n'invente aucun nom.",
];

// Même normalisation que Karakeep pour comparer les tags (bookmarkTags.normalizedName).
const normalize = (tag: string) => tag.toLowerCase().replace(/[ \-_]/g, "");

// Garde les tags de la grille, ou de la liste choisie dans les paramètres du
// compte, avec leur orthographe exacte ; les autres propositions sont ignorées.
export function keepGridTags(tags: string[], curatedTags: string[] = []) {
  const allowed = new Map(
    [...POLAIRE_TAG_NAMES, ...curatedTags].map((t) => [normalize(t), t]),
  );
  const kept = tags.flatMap((t) => allowed.get(normalize(t)) ?? []);
  return [...new Set(kept)];
}
