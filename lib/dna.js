import { searchFilm, getFilmById } from "./tmdb";

export const DNA_TYPES = {
  d: {
    key: "d",
    name: "Ονειρικός Εξερευνητής",
    name_en: "Dreamy Explorer",
    desc: "Αναζητάς το υπαινικτικό, το ονειρικό και το εσωτερικό ταξίδι της εικόνας.",
    desc_en: "You seek the suggestive, the dreamlike, and the inner journey of the image.",
    directors: ["Tarkovsky", "Lynch", "Malick"],
    tmdb_genres: [18, 14, 9648],
    explanation_el: "Οι ταινίες που διαλέγεις δεν αφηγούνται ιστορίες τόσο όσο ανοίγουν χώρους. Σε ενδιαφέρει πού πηγαίνει το μυαλό σου όταν η εικόνα αφήνει κενό — και αυτό είναι σπάνιο.",
    explanation_en: "The films you choose don't so much tell stories as open spaces. You're drawn to what happens in your mind when the image leaves room. That's rarer than it sounds.",
  },
  st: {
    key: "st",
    name: "Υπαρξιστής Στοχαστής",
    name_en: "Existential Thinker",
    desc: "Σε ελκύει ο στοχαστικός κινηματογράφος που θέτει ηθικά και υπαρξιακά ερωτήματα.",
    desc_en: "You are drawn to thoughtful cinema that poses ethical and existential questions.",
    directors: ["Bergman", "Bresson", "Haneke"],
    tmdb_genres: [18, 36],
    explanation_el: "Ψάχνεις ταινίες που τολμούν να μείνουν με την ερώτηση χωρίς να βιαστούν να απαντήσουν. Ο κινηματογράφος για σένα είναι ένας τόπος σκέψης, όχι διαφυγής.",
    explanation_en: "You look for films that sit with the question rather than rush to answer it. Cinema for you is a place to think, not escape.",
  },
  h: {
    key: "h",
    name: "Ανθρωπιστής Ρεαλιστής",
    name_en: "Humanist Realist",
    desc: "Προτιμάς ιστορίες καθημερινών ανθρώπων, με τρυφερότητα και κοινωνική ευαισθησία.",
    desc_en: "You prefer stories of everyday people, with tenderness and social sensitivity.",
    directors: ["De Sica", "Cassavetes", "Ozu"],
    tmdb_genres: [18, 10749],
    explanation_el: "Σε αγγίζουν οι ταινίες που κοιτούν τον άνθρωπο κατάματα — χωρίς ηρωισμό, χωρίς συμπόνια από ψηλά. Απλώς με ακρίβεια και σεβασμό.",
    explanation_en: "You're moved by films that look people in the eye — no heroism, no pity from a distance. Just precision and respect.",
  },
  of: {
    key: "of",
    name: "Οπτικός Φορμαλιστής",
    name_en: "Visual Formalist",
    desc: "Σε κερδίζει η αυστηρή φόρμα, η γεωμετρία κάδρου και η κινηματογραφική κατασκευή.",
    desc_en: "You are captivated by strict form, frame geometry, and cinematic construction.",
    directors: ["Kubrick", "Eisenstein", "Welles"],
    tmdb_genres: [18, 53, 878],
    explanation_el: "Για σένα το πλάνο δεν εξυπηρετεί την ιστορία — είναι η ιστορία. Παρατηρείς πράγματα στις ταινίες που οι περισσότεροι αισθάνονται χωρίς να τα δουν.",
    explanation_en: "For you the shot doesn't serve the story — it is the story. You notice things in films that most people feel without seeing.",
  },
  r: {
    key: "r",
    name: "Σκοτεινός Ρομαντικός",
    name_en: "Dark Romantic",
    desc: "Αγαπάς τη μελαγχολία, τον έρωτα και την ατμόσφαιρα που μένει μετά τους τίτλους τέλους.",
    desc_en: "You love melancholy, love, and the atmosphere that lingers after the credits roll.",
    directors: ["Wong Kar-wai", "Antonioni"],
    tmdb_genres: [10749, 18, 9648],
    explanation_el: "Το ωραίο για σένα έχει πάντα κάτι επικίνδυνο μέσα του. Διαλέγεις ταινίες που επιτρέπουν στο συναίσθημα να πάει μέχρι το τέλος, ακόμα κι αν εκεί δεν σε περιμένει τίποτα καλό.",
    explanation_en: "Beauty, for you, always carries something dangerous inside it. You choose films that let feeling go all the way — even when nothing good is waiting at the end.",
  },
  c: {
    key: "c",
    name: "Κοινωνικός Κριτής",
    name_en: "Social Critic",
    desc: "Θέλεις σινεμά που παρατηρεί δομές εξουσίας και σχολιάζει την κοινωνική πραγματικότητα.",
    desc_en: "You want cinema that observes power structures and comments on social reality.",
    directors: ["Bong Joon-ho", "Loach", "Godard"],
    tmdb_genres: [18, 35, 80],
    explanation_el: "Δεν σε αρκεί μια ταινία που απλώς δείχνει τον κόσμο. Θέλεις να καταλαβαίνεις πώς λειτουργεί — και γιατί σπάει. Ο κινηματογράφος για σένα έχει υποχρέωση.",
    explanation_en: "A film that just shows the world isn't enough. You want to understand how it works — and why it breaks. Cinema, for you, has obligations.",
  },
  ea: {
    key: "ea",
    name: "Επικός Αφηγητής",
    name_en: "Epic Storyteller",
    desc: "Σε συγκινούν οι μεγάλες αφηγήσεις, οι οικογενειακές δυναστείες και οι κόσμοι σε σύγκρουση.",
    desc_en: "You are moved by grand narratives, family dynasties, and worlds in conflict.",
    directors: ["Leone", "Coppola", "Kurosawa"],
    tmdb_genres: [12, 18, 37, 10752],
    explanation_el: "Σε τραβούν ταινίες με βάρος — ιστορίες που χρειάζονται χώρο για να ξεδιπλωθούν. Η κλίμακα δεν σε τρομάζει· σε βοηθά να δεις.",
    explanation_en: "You're drawn to films with weight — stories that need room to unfold. Scale doesn't intimidate you; it helps you see.",
  },
  op: {
    key: "op",
    name: "Ονειρικός Ψυχαναλυτής",
    name_en: "Psychoanalytic Dreamer",
    desc: "Σε ελκύουν οι εμμονές, η παράνοια και το σώμα ως πεδίο ψυχολογικής έντασης.",
    desc_en: "You are drawn to obsessions, paranoia, and the body as a field of psychological tension.",
    directors: ["Polanski", "Cronenberg"],
    tmdb_genres: [27, 53, 9648],
    explanation_el: "Αναζητάς ταινίες που λειτουργούν σαν όνειρα: τα γεγονότα έχουν δεύτερο πάτο, οι εικόνες σημαίνουν κάτι παραπάνω απ' ό,τι δείχνουν και τα πρόσωπα δεν είναι ποτέ μόνο αυτό που φαίνονται.",
    explanation_en: "You look for films that work like dreams: events have a second layer, images mean more than they show, and faces are never only what they appear to be.",
  },
  n: {
    key: "n",
    name: "Ποιητής Φύσης & Χώρου",
    name_en: "Poet of Nature & Space",
    desc: "Βλέπεις τον κινηματογράφο ως ποίηση τοπίου, σιωπής και ρυθμού.",
    desc_en: "You see cinema as poetry of landscape, silence, and rhythm.",
    directors: ["Herzog", "Parajanov", "Erice"],
    tmdb_genres: [18, 99, 12],
    explanation_el: "Οι ταινίες που διαλέγεις αφήνουν τον τόπο να μιλήσει. Ο χώρος δεν είναι σκηνικό — είναι χαρακτήρας. Ξέρεις την αίσθηση μιας σκηνής που δεν χρειάζεται διάλογο.",
    explanation_en: "The films you choose let place speak. Landscape isn't backdrop — it's character. You know the feeling of a scene that needs no dialogue.",
  },
  pp: {
    key: "pp",
    name: "Παιχνιδιάρικο Πνεύμα",
    name_en: "Playful Spirit",
    desc: "Σου ταιριάζει η ευφυής κωμωδία, η λεπτή ειρωνεία και η στιλιστική ελαφρότητα.",
    desc_en: "Witty comedy, subtle irony, and stylistic lightness suit you perfectly.",
    directors: ["Tati", "Chaplin", "Wes Anderson"],
    tmdb_genres: [35, 10751, 12],
    explanation_el: "Εκτιμάς ταινίες που δεν φοβούνται να γελάσουν με τον εαυτό τους — που ξέρουν ότι το παιχνίδι και η σκέψη δεν αλληλοαποκλείονται. Η ελαφρότητα που διαλέγεις δεν είναι ποτέ άδεια.",
    explanation_en: "You value films that aren't afraid to laugh at themselves — that know play and thought aren't opposites. The lightness you choose is never empty.",
  },
  a: {
    key: "a",
    name: "Ψυχή του Animation",
    name_en: "Animation Soul",
    desc: "Ζεις το animation ως ώριμη κινηματογραφική γλώσσα με φαντασία και συναίσθημα.",
    desc_en: "You experience animation as a mature cinematic language of imagination and emotion.",
    directors: ["Miyazaki", "Satoshi Kon"],
    tmdb_genres: [16, 14, 12],
    explanation_el: "Καταλαβαίνεις ότι το animation δεν είναι για παιδιά — είναι ο μόνος τρόπος να δείξεις κάποια πράγματα ακριβώς όπως είναι. Διαλέγεις ταινίες που το ξέρουν κι αυτό.",
    explanation_en: "You understand that animation isn't for children — it's sometimes the only way to show certain things exactly as they are. You choose films that know this too.",
  },
  ve: {
    key: "ve",
    name: "Βιρτουόζος του Είδους",
    name_en: "Genre Virtuoso",
    desc: "Χαίρεσαι το άρτιο genre cinema: αγωνία, ρυθμό και αφηγηματική ακρίβεια.",
    desc_en: "You enjoy masterful genre cinema: suspense, rhythm, and narrative precision.",
    directors: ["Hitchcock", "Leone", "Hawks"],
    tmdb_genres: [53, 80, 37, 28],
    explanation_el: "Γνωρίζεις τους κανόνες αρκετά καλά ώστε να εκτιμάς πότε κάποιος τους σπάει με λόγο. Ψάχνεις ταινίες που χρησιμοποιούν το είδος σαν γλώσσα — όχι σαν φόρμουλα.",
    explanation_en: "You know the rules well enough to appreciate when someone breaks them deliberately. You look for films that use genre as a language — not a formula.",
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

// Picks the runner-up archetype by score, excluding the primary key.
// Selection logic for the primary stays untouched — this only adds a #2 lookup.
function pickSecondBestDNA(scores, primaryKey) {
  let secondKey = null;
  let secondScore = -Infinity;
  Object.entries(scores).forEach(([key, score]) => {
    if (key === primaryKey) return;
    if (score > secondScore) {
      secondScore = score;
      secondKey = key;
    }
  });
  return { secondKey, secondScore };
}

// Builds the public archetype object returned to callers, aliasing the
// Greek `name` field as `name_el` per the Phase 3 response shape.
function toArchetypeResult(dnaKey) {
  const dna = DNA_TYPES[dnaKey];
  return { ...dna, name_el: dna.name };
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
  const { secondKey, secondScore } = pickSecondBestDNA(scores, bestKey);

  // Confidence reflects how dominant the primary score is over the runner-up,
  // not its share of all archetype scores combined.
  const primaryScore = Math.max(0, bestScore);
  const secondaryScore = secondKey !== null ? Math.max(0, secondScore) : 0;
  const total = primaryScore + secondaryScore;
  const hasSecondary = secondKey !== null && secondaryScore > 0;

  const confidence = hasSecondary
    ? (total > 0 ? Math.round((primaryScore / total) * 100) : 50)
    : 100;

  return {
    primary: toArchetypeResult(bestKey),
    secondary: hasSecondary ? toArchetypeResult(secondKey) : null,
    confidence,
    processedFilms,
  };
}
