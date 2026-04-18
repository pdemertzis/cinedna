import { searchFilm, getFilmById, discoverFilms } from "./tmdb";

export const DNA_TYPES = {
  d: {
    key: "d",
    name: "Ονειρικός Εξερευνητής",
    name_en: "Dreamy Explorer",
    desc: "Αναζητάς το υπαινικτικό, το ονειρικό και το εσωτερικό ταξίδι της εικόνας.",
    desc_en: "You seek the suggestive, the dreamlike, and the inner journey of the image.",
    directors: ["Tarkovsky", "Lynch", "Malick"],
    tmdb_genres: [18, 14, 9648],
  },
  st: {
    key: "st",
    name: "Υπαρξιστής Στοχαστής",
    name_en: "Existential Thinker",
    desc: "Σε ελκύει ο στοχαστικός κινηματογράφος που θέτει ηθικά και υπαρξιακά ερωτήματα.",
    desc_en: "You are drawn to thoughtful cinema that poses ethical and existential questions.",
    directors: ["Bergman", "Bresson", "Haneke"],
    tmdb_genres: [18, 36],
  },
  h: {
    key: "h",
    name: "Ανθρωπιστής Ρεαλιστής",
    name_en: "Humanist Realist",
    desc: "Προτιμάς ιστορίες καθημερινών ανθρώπων, με τρυφερότητα και κοινωνική ευαισθησία.",
    desc_en: "You prefer stories of everyday people, with tenderness and social sensitivity.",
    directors: ["De Sica", "Cassavetes", "Ozu"],
    tmdb_genres: [18, 10749],
  },
  of: {
    key: "of",
    name: "Οπτικός Φορμαλιστής",
    name_en: "Visual Formalist",
    desc: "Σε κερδίζει η αυστηρή φόρμα, η γεωμετρία κάδρου και η κινηματογραφική κατασκευή.",
    desc_en: "You are captivated by strict form, frame geometry, and cinematic construction.",
    directors: ["Kubrick", "Eisenstein", "Welles"],
    tmdb_genres: [18, 53, 878],
  },
  r: {
    key: "r",
    name: "Σκοτεινός Ρομαντικός",
    name_en: "Dark Romantic",
    desc: "Αγαπάς τη μελαγχολία, τον έρωτα και την ατμόσφαιρα που μένει μετά τους τίτλους τέλους.",
    desc_en: "You love melancholy, love, and the atmosphere that lingers after the credits roll.",
    directors: ["Wong Kar-wai", "Antonioni"],
    tmdb_genres: [10749, 18, 9648],
  },
  c: {
    key: "c",
    name: "Κοινωνικός Κριτής",
    name_en: "Social Critic",
    desc: "Θέλεις σινεμά που παρατηρεί δομές εξουσίας και σχολιάζει την κοινωνική πραγματικότητα.",
    desc_en: "You want cinema that observes power structures and comments on social reality.",
    directors: ["Bong Joon-ho", "Loach", "Godard"],
    tmdb_genres: [18, 35, 80],
  },
  ea: {
    key: "ea",
    name: "Επικός Αφηγητής",
    name_en: "Epic Storyteller",
    desc: "Σε συγκινούν οι μεγάλες αφηγήσεις, οι οικογενειακές δυναστείες και οι κόσμοι σε σύγκρουση.",
    desc_en: "You are moved by grand narratives, family dynasties, and worlds in conflict.",
    directors: ["Leone", "Coppola", "Kurosawa"],
    tmdb_genres: [12, 18, 37, 10752],
  },
  op: {
    key: "op",
    name: "Ονειρικός Ψυχαναλυτής",
    name_en: "Psychoanalytic Dreamer",
    desc: "Σε ελκύουν οι εμμονές, η παράνοια και το σώμα ως πεδίο ψυχολογικής έντασης.",
    desc_en: "You are drawn to obsessions, paranoia, and the body as a field of psychological tension.",
    directors: ["Polanski", "Cronenberg"],
    tmdb_genres: [27, 53, 9648],
  },
  n: {
    key: "n",
    name: "Ποιητής Φύσης & Χώρου",
    name_en: "Poet of Nature & Space",
    desc: "Βλέπεις τον κινηματογράφο ως ποίηση τοπίου, σιωπής και ρυθμού.",
    desc_en: "You see cinema as poetry of landscape, silence, and rhythm.",
    directors: ["Herzog", "Parajanov", "Erice"],
    tmdb_genres: [18, 99, 12],
  },
  pp: {
    key: "pp",
    name: "Παιχνιδιάρικο Πνεύμα",
    name_en: "Playful Spirit",
    desc: "Σου ταιριάζει η ευφυής κωμωδία, η λεπτή ειρωνεία και η στιλιστική ελαφρότητα.",
    desc_en: "Witty comedy, subtle irony, and stylistic lightness suit you perfectly.",
    directors: ["Tati", "Chaplin", "Wes Anderson"],
    tmdb_genres: [35, 10751, 12],
  },
  a: {
    key: "a",
    name: "Ψυχή του Animation",
    name_en: "Animation Soul",
    desc: "Ζεις το animation ως ώριμη κινηματογραφική γλώσσα με φαντασία και συναίσθημα.",
    desc_en: "You experience animation as a mature cinematic language of imagination and emotion.",
    directors: ["Miyazaki", "Satoshi Kon"],
    tmdb_genres: [16, 14, 12],
  },
  ve: {
    key: "ve",
    name: "Βιρτουόζος του Είδους",
    name_en: "Genre Virtuoso",
    desc: "Χαίρεσαι το άρτιο genre cinema: αγωνία, ρυθμό και αφηγηματική ακρίβεια.",
    desc_en: "You enjoy masterful genre cinema: suspense, rhythm, and narrative precision.",
    directors: ["Hitchcock", "Leone", "Hawks"],
    tmdb_genres: [53, 80, 37, 28],
  },
};

// Helper: get localised name/desc for a DNA type
export function getDNAStrings(dnaKey, lang = "el") {
  const dna = DNA_TYPES[dnaKey];
  if (!dna) return { name: "", desc: "" };
  return {
    name: lang === "en" ? (dna.name_en || dna.name) : dna.name,
    desc: lang === "en" ? (dna.desc_en || dna.desc) : dna.desc,
  };
}

const MOOD_WEIGHTS = {
  calm: { h: 3, pp: 2, a: 2, r: 1 },
  challenge: { st: 3, c: 2, op: 2, of: 1 },
  escape: { ea: 3, a: 2, d: 2, ve: 1 },
  thought: { h: 3, c: 2, st: 2, n: 1 },
  beauty: { of: 3, d: 2, r: 2, n: 1 },
  tension: { ve: 3, op: 2, c: 2, d: 1 },
};

const ERA_WEIGHTS = {
  "Όλες": {},
  "All": {},
  "Κλασικές": { ea: 2, of: 2, ve: 2, h: 1 },
  "Classic": { ea: 2, of: 2, ve: 2, h: 1 },
  "Σύγχρονες": { c: 2, op: 2, r: 1, pp: 1 },
  "Modern": { c: 2, op: 2, r: 1, pp: 1 },
  "Νέες": { a: 2, c: 2, d: 1, op: 1 },
  "New": { a: 2, c: 2, d: 1, op: 1 },
};

function getInitialScores() {
  return Object.keys(DNA_TYPES).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});
}

function applyWeightMap(scores, weightMap = {}) {
  Object.entries(weightMap).forEach(([key, points]) => {
    if (scores[key] !== undefined) {
      scores[key] += points;
    }
  });
}

function scoreByGenres(scores, genreIds = []) {
  const genreSet = new Set(genreIds);
  Object.values(DNA_TYPES).forEach((dna) => {
    const matches = dna.tmdb_genres.filter((genreId) => genreSet.has(genreId)).length;
    if (matches > 0) {
      scores[dna.key] += matches * 2;
    }
  });
}

function pickBestDNA(scores) {
  let bestKey = "d";
  let bestScore = -Infinity;
  Object.entries(scores).forEach(([key, score]) => {
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  });
  return { bestKey, bestScore };
}

export async function computeDNA(filmTitles = [], mood = "", era = "") {
  const cleanTitles = filmTitles
    .filter((title) => typeof title === "string")
    .map((title) => title.trim())
    .filter(Boolean);

  const scores = getInitialScores();
  let processedFilms = 0;

  for (const title of cleanTitles) {
    const film = await searchFilm(title);
    if (!film?.id) continue;
    const details = await getFilmById(film.id);
    if (!details) continue;
    const genreIds = (details.genres ?? []).map((genre) => genre.id).filter(Boolean);
    scoreByGenres(scores, genreIds);
    processedFilms += 1;
  }

  applyWeightMap(scores, MOOD_WEIGHTS[mood] ?? {});
  applyWeightMap(scores, ERA_WEIGHTS[era] ?? {});

  const { bestKey, bestScore } = pickBestDNA(scores);
  const totalScore = Object.values(scores).reduce((sum, val) => sum + Math.max(0, val), 0);
  const confidence = totalScore > 0 ? Math.round((Math.max(0, bestScore) / totalScore) * 100) : 0;

  return {
    dnaKey: bestKey,
    dnaName: DNA_TYPES[bestKey].name,
    confidence,
    processedFilms,
    scores,
  };
}
