// ===================================================================
// SMART TEMPLATE ENGINE — personalised Hemingway-style film descriptions
// Uses real TMDB data (overview, tagline, keywords) to create unique
// 2-line descriptions per film, in user's chosen language.
// ===================================================================

// Hand-crafted curated descriptions for ~50 famous films
// (takes priority when title matches)
const CURATED = {
  "stalker": {
    el: "Μια Ζώνη που δεν ανταμείβει τους αδύναμους. Ο δρόμος εκεί είναι η ερώτηση — όχι η απάντηση.",
    en: "Rails in wet grass and three faces moving without certainty. The Zone gives nothing — and that is the point.",
  },
  "parasite": {
    el: "Ένα υπόγειο που κρύβει αυτό που η επιφάνεια αρνείται να δει. Η ανισότητα εδώ δεν εξηγείται — δείχνεται.",
    en: "A family holds its breath in the dark beneath another family's floor. Class is not explained here — it is shown.",
  },
  "2001 a space odyssey": {
    el: "Ένας πίθηκος σηκώνει ένα κόκαλο. Εκατομμύρια χρόνια αργότερα, κάποιος κλείνει μια πόρτα στο διάστημα.",
    en: "A bone rises in a primate hand, then a door seals in deep space. The same question across four million years.",
  },
  "in the mood for love": {
    el: "Δύο άνθρωποι σε έναν στενό διάδρομο. Δεν αγγίζονται ποτέ — και αυτό είναι το παν.",
    en: "A narrow hallway, slow steps, rain on neon. Everything happens in what is not said.",
  },
  "bicycle thieves": {
    el: "Ένας πατέρας και ένας γιος περπατούν στη Ρώμη ψάχνοντας ένα ποδήλατο. Βρίσκουν κάτι πιο βαρύ.",
    en: "A father and son cross Rome looking for one stolen bicycle. What they find weighs more than metal.",
  },
  "wild strawberries": {
    el: "Ένας γέρος ταξιδεύει και θυμάται. Τα όνειρα λένε αυτό που η μνήμη δεν τολμά.",
    en: "An old man travels and remembers. Dreams speak where memory refuses.",
  },
  "taxi driver": {
    el: "Νυχτερινό παρμπρίζ και δρόμοι που στάζουν κούραση. Ένας άντρας παρακολουθεί μια πόλη που δεν τον βλέπει.",
    en: "A night windshield and streets that drip with exhaustion. A man watches a city that does not watch back.",
  },
  "there will be blood": {
    el: "Λάσπη, πετρέλαιο, ένα πρόσωπο που δεν χαρίζεται. Η φιλοδοξία εδώ δεν κρύβεται πίσω από τίποτα.",
    en: "Mud, oil, a face that gives nothing away. Ambition here hides behind nothing.",
  },
  "mulholland drive": {
    el: "Μια γυναίκα δεν θυμάται ποια είναι. Η άλλη ξέρει πολύ καλά. Το Χόλιγουντ είναι το όνειρο που τρώει τους ονειρευτές.",
    en: "A blue box, an empty theater, a voice without a body. Hollywood is the dream that devours the dreamer.",
  },
  "blade runner": {
    el: "Βροχή σε νέον και μάτια που ρωτούν τι σημαίνει ζωή. Κανείς στο δωμάτιο δεν ξέρει την απάντηση.",
    en: "Rain on neon and eyes asking what life means. No one in the room knows the answer.",
  },
  "blade runner 2049": {
    el: "Πορτοκαλί σκόνη και ένα μοναχικό βήμα σε άδειο τοπίο. Η μοναξιά εδώ έχει αρχιτεκτονική.",
    en: "Orange dust and one solitary step across an empty landscape. Loneliness here has architecture.",
  },
  "the godfather": {
    el: "Ένα χέρι που φιλάς και μια πόρτα που κλείνει αργά. Κάθε επιλογή σε αυτή την ταινία γράφει μοίρα.",
    en: "A hand you kiss and a door closing slowly. Every choice in this film writes fate.",
  },
  "apocalypse now": {
    el: "Έλικες πάνω από νερό και φωτιά στον ορίζοντα. Το σκοτάδι εδώ είναι μέσα στα πρόσωπα.",
    en: "Helicopter blades over water and fire on the horizon. The darkness here is in the faces.",
  },
  "the tree of life": {
    el: "Χέρια στο φως και παιδικά βήματα σε αυλή με αέρα. Η ταινία ρωτά πώς φτάσαμε εδώ — και δεν αναμένει απάντηση.",
    en: "Hands in light and childhood steps in a windy yard. The film asks how we got here — and expects no answer.",
  },
  "the seventh seal": {
    el: "Ένας ιππότης παίζει σκάκι με τον Θάνατο σε μια παραλία. Κερδίζει χρόνο — όχι απάντηση.",
    en: "A chessboard on the shore and a black cloak across the table. He wins time — not an answer.",
  },
  "persona": {
    el: "Μια ηθοποιός σταματά να μιλά. Μια νοσοκόμα αρχίζει να χάνει τον εαυτό της. Τα πρόσωπά τους στο τέλος είναι ένα.",
    en: "An actress stops speaking. A nurse begins to lose herself. By the end their faces are one.",
  },
  "mirror": {
    el: "Νερό στο τραπέζι και αέρας που περνά μέσα από κουρτίνες. Η μνήμη εδώ δεν έχει χρονολογική σειρά.",
    en: "Water on a table and wind moving through curtains. Memory here has no chronological order.",
  },
  "nostalghia": {
    el: "Ένας άντρας κουβαλάει ένα κερί αναμμένο σε μια άδεια πισίνα. Αν σβήσει, αρχίζει από την αρχή.",
    en: "A lit candle must cross an empty pool without going out. He starts over each time.",
  },
  "andrei rublev": {
    el: "Λάσπη, καμπάνα, χέρια που δουλεύουν μέσα στην πίστη και τον φόβο. Η τέχνη εδώ γεννιέται από τη σύγκρουση.",
    en: "Mud, a bell, hands working through faith and fear. Art here is born from conflict.",
  },
  "moonlight": {
    el: "Μπλε νύχτα στην ακτή και ένα χέρι στον ώμο. Ένα αγόρι μαθαίνει ποιος είναι σε τρεις εποχές.",
    en: "Blue night by the shore and a hand on a shoulder. A boy learns who he is across three stages.",
  },
  "portrait of a lady on fire": {
    el: "Φλόγα σε φόρεμα και βλέμματα που δεν αποστρέφονται. Η αγάπη εδώ υπάρχει ακριβώς επειδή έχει χρόνο.",
    en: "Flame on a dress and eyes that never turn away. Love here exists precisely because it has a deadline.",
  },
  "spirited away": {
    el: "Μια σήραγγα, νερό ως τον ορίζοντα, τρένο στη σιωπή. Ένα κορίτσι μεγαλώνει σε κόσμο χωρίς χάρτη.",
    en: "A tunnel, water to the horizon, a train in silence. A girl grows up in a world with no map.",
  },
  "my neighbor totoro": {
    el: "Στάση λεωφορείου στη βροχή και μια ομπρέλα που μοιράζεται. Η παιδική ηλικία εδώ αξίζει να θυμάσαι.",
    en: "A bus stop in the rain and an umbrella shared in silence. Childhood here is something worth remembering.",
  },
  "tokyo story": {
    el: "Γονείς πηγαίνουν να δουν τα παιδιά τους. Τα παιδιά είναι απασχολημένα. Δεν χρειάζεται τίποτα άλλο.",
    en: "Parents travel to see their children. The children are busy. Nothing more needs to be said.",
  },
  "battleship potemkin": {
    el: "Μια σκάλα. Ένα καρότσι. Πέντε λεπτά που άλλαξαν τον τρόπο που βλέπουμε εικόνες.",
    en: "A staircase. A carriage. Five minutes that changed how images hit the body.",
  },
  "wings of desire": {
    el: "Άγγελοι ακούνε τις σκέψεις στο Βερολίνο. Ένας θέλει να νιώσει τον καφέ — και αυτό φτάνει.",
    en: "Angels hear thoughts over Berlin. One wants to taste coffee — and that is enough.",
  },
  "rashomon": {
    el: "Η πύλη στη βροχή και τέσσερις ιστορίες για το ίδιο τραύμα. Η αλήθεια εξαρτάται από το ποιος μιλά.",
    en: "The gate in the rain and four stories around one wound. Truth depends on who is speaking.",
  },
  "seven samurai": {
    el: "Χώμα, ιδρώτας και χωρικοί που μαθαίνουν να στέκονται. Η αξιοπρέπεια εδώ δεν διαπραγματεύεται.",
    en: "Soil, sweat, and villagers learning to stand. Dignity here is never negotiated.",
  },
  "oldboy": {
    el: "Σφυρί σε διάδρομο και μια πόρτα που ανοίγει αργά στο παρελθόν. Η αποκάλυψη εδώ δεν θεραπεύει.",
    en: "A hammer in a corridor and a door opening slowly to the past. The revelation does not heal.",
  },
  "burning": {
    el: "Θερμοκήπια στο λυκόφως και ένα χαμόγελο που δεν εξηγείται. Το μυστήριο δεν λύνεται — αυξάνεται.",
    en: "Greenhouses at dusk and a smile that refuses explanation. The mystery does not resolve — it grows.",
  },
  "ikiru": {
    el: "Ένας άντρας μαθαίνει ότι πεθαίνει και αποφασίζει επιτέλους να ζήσει. Αργά — αλλά ακόμα.",
    en: "A man learns he is dying and decides finally to live. Late — but still.",
  },
  "citizen kane": {
    el: "Μια λέξη πριν τον θάνατο. Μια ζωή που δεν εξηγείται πλήρως. Ο Γουέλς άλλαξε τα πάντα στα 25.",
    en: "One word before death. A life that no one fully explains. Welles changed everything at twenty-five.",
  },
  "vertigo": {
    el: "Ένας άντρας ερωτεύεται μια γυναίκα — και μετά την εικόνα της. Ο Χίτσκοκ ξέρει ότι δεν είναι το ίδιο.",
    en: "A man falls in love with a woman — and then with her image. Hitchcock knows these are not the same.",
  },
  "psycho": {
    el: "Μια γυναίκα σταματά σε ένα μοτέλ. Ο Χίτσκοκ σου κλέβει την ηρωίδα στο πρώτο μισό.",
    en: "A woman stops at a motel. Hitchcock steals your protagonist at the halfway point.",
  },
  "8 1/2": {
    el: "Σκηνοθέτης δεν μπορεί να φτιάξει ταινία. Ο Φελίνι κάνει αυτό ακριβώς — και είναι αριστούργημα.",
    en: "A director cannot make his film. Fellini does exactly that — and it becomes a masterpiece.",
  },
  "barry lyndon": {
    el: "Κεριά και φυσικό φως σε κάθε κάδρο. Ο Κιούμπρικ κάνει τον 18ο αιώνα να φαίνεται πραγματικός.",
    en: "Candlelight in every frame. Kubrick makes the 18th century feel like it is actually happening.",
  },
  "the shining": {
    el: "Ένα ξενοδοχείο που θυμάται. Ο Κιούμπρικ κάνει τον τρόμο να μοιάζει με αρχιτεκτονική.",
    en: "A hotel that remembers. Kubrick makes horror feel like architecture.",
  },
  "a separation": {
    el: "Ένα ζευγάρι χωρίζει. Ένα ατύχημα. Και η αλήθεια είναι πολύ πιο περίπλοκη απ' ό,τι βλέπουμε.",
    en: "A couple separates. An accident. And the truth is far more complicated than what we see.",
  },
  "amour": {
    el: "Ένα ηλικιωμένο ζευγάρι κλεισμένο σε διαμέρισμα. Η αγάπη εδώ δεν εξιδανικεύεται — επιμένει.",
    en: "An elderly couple closed in an apartment. Love here is not idealized — it persists.",
  },
  "roma": {
    el: "Μια οικιακή βοηθός στην Πόλη του Μεξικό. Ο Κουαρόν μετατρέπει μνήμη σε εικόνα.",
    en: "A domestic worker in Mexico City. Cuarón turns memory into image.",
  },
};

// Opening phrases — 4 variations per DNA type per language
const DNA_OPENERS = {
  el: {
    d:  ["Εικόνες που κινούνται σαν όνειρο.", "Ατμόσφαιρα πάνω από αφήγηση.", "Κάτι υπαινικτικό που δεν λύνεται.", "Ο χρόνος εδώ ρέει αλλιώς."],
    st: ["Ερώτημα χωρίς εύκολη απάντηση.", "Σιωπή που λέει περισσότερα από τα λόγια.", "Ηθική που δεν συγχωρεί.", "Μια ταινία που σε κοιτά στα μάτια."],
    h:  ["Πρόσωπο που θυμάσαι μετά.", "Απλή ανθρώπινη αλήθεια.", "Στιγμή που μετρά.", "Κάτι μικρό που γίνεται μεγάλο."],
    of: ["Κάθε κάδρο μελετημένο.", "Η φόρμα είναι το μήνυμα.", "Κινηματογράφος που ξέρει τι κάνει.", "Γεωμετρία και φως σε συνομιλία."],
    r:  ["Μελαγχολία που είναι όμορφη.", "Έρωτας που αφήνει σημάδι.", "Ατμόσφαιρα που μένει μετά τους τίτλους.", "Κάτι που χάθηκε πριν ειπωθεί."],
    c:  ["Κάτι για τον κόσμο όπως πραγματικά είναι.", "Εξουσία που αποκαλύπτεται.", "Κοινωνία κάτω από μικροσκόπιο.", "Αυτό που δεν θέλουμε να δούμε."],
    ea: ["Μεγάλη ιστορία, μεγάλοι χαρακτήρες.", "Αφήγηση που κρατά από την αρχή.", "Μύθος σε κινούμενη εικόνα.", "Η κλίμακα έχει σημασία εδώ."],
    op: ["Κάτι κάτω από την επιφάνεια.", "Εμμονή που δεν εξηγείται.", "Το ασυνείδητο ως σκηνικό.", "Μια ταινία που μένει στο σώμα."],
    n:  ["Τοπίο που αναπνέει.", "Φύση ως δύναμη — όχι φόντο.", "Σιωπή που έχει βάρος.", "Ο χώρος είναι πρωταγωνιστής."],
    pp: ["Ευφυΐα με ελαφράδα.", "Χιούμορ που δεν χάνει τη σοβαρότητά του.", "Παιχνίδι με φόρμα και ιδέες.", "Κάτι που σε κάνει να γελάς και μετά να σκέφτεσαι."],
    a:  ["Animation ως σοβαρή γλώσσα.", "Φαντασία που αγγίζει αλήθεια.", "Εικόνες που δεν χρειάζονται εξήγηση.", "Ο κόσμος χτισμένος από το μηδέν."],
    ve: ["Ρυθμός και αφηγηματική ακρίβεια.", "Είδος στην τελειότητά του.", "Craftsmanship που δεν κρύβεται.", "Όλα στη θέση τους — και αυτό είναι το θαύμα."],
  },
  en: {
    d:  ["Images that move like a dream.", "Atmosphere over narrative.", "Something suggestive that does not resolve.", "Time flows differently here."],
    st: ["A question without an easy answer.", "Silence that says more than words.", "Morality that does not forgive.", "A film that looks you in the eye."],
    h:  ["A face you remember after.", "Simple human truth.", "A moment that counts.", "Something small that becomes large."],
    of: ["Every frame deliberate.", "The form is the message.", "Cinema that knows exactly what it is doing.", "Geometry and light in conversation."],
    r:  ["A melancholy that is beautiful.", "Love that leaves a mark.", "Atmosphere that lingers after the credits.", "Something lost before it was said."],
    c:  ["Something about the world as it actually is.", "Power revealed.", "Society under a microscope.", "What we do not want to see."],
    ea: ["A big story, big characters.", "Narrative that holds from beginning to end.", "Myth in moving images.", "Scale matters here."],
    op: ["Something beneath the surface.", "Obsession without explanation.", "The unconscious as a setting.", "A film that stays in the body."],
    n:  ["Landscape that breathes.", "Nature as force — not background.", "Silence that has weight.", "Space is the protagonist."],
    pp: ["Intelligence with lightness.", "Humour that does not lose its seriousness.", "Play with form and ideas.", "Something that makes you laugh, then think."],
    a:  ["Animation as a serious language.", "Fantasy that touches truth.", "Images that need no explanation.", "A world built from nothing."],
    ve: ["Rhythm and narrative precision.", "Genre at its finest.", "Craftsmanship that does not hide.", "Everything in its place — and that is the miracle."],
  },
};

// Mood-based closing connectors
const MOOD_CLOSERS = {
  el: {
    calm:      ["Η ταινία έχει τον χρόνο της — και σου δίνει χρόνο.", "Κάτι ήρεμο που δεν χρειάζεται να εξηγηθεί."],
    challenge: ["Δεν αφήνει τα πράγματα εκεί που τα βρήκε.", "Κάτι θα σε κρατά να σκέφτεσαι μετά."],
    escape:    ["Σε πηγαίνει κάπου αλλού — χωρίς να λέει πού.", "Δύο ώρες μακριά από τον κόσμο σου."],
    thought:   ["Κάτι θα αλλάξει τη γωνία από την οποία βλέπεις.", "Μια εικόνα που θα σε συνοδεύει."],
    beauty:    ["Υπάρχουν κάδρα εδώ που δεν ξεχνιούνται εύκολα.", "Κάθε πλάνο είναι αυτοτελές έργο."],
    tension:   ["Κάτι χτίζεται αργά — και όταν σπάει, το νιώθεις.", "Η αγωνία εδώ είναι σωματική."],
  },
  en: {
    calm:      ["The film has its own time — and gives you time.", "Something quiet that needs no explanation."],
    challenge: ["It does not leave things where it found them.", "Something will keep you thinking after."],
    escape:    ["It takes you somewhere else — without saying where.", "Two hours away from your world."],
    thought:   ["Something will shift the angle from which you see.", "An image that will stay with you."],
    beauty:    ["There are frames here that do not easily leave you.", "Every shot is a self-contained work."],
    tension:   ["Something builds slowly — and when it breaks, you feel it.", "The tension here is physical."],
  },
};

// Extract the first sensory sentence from a TMDB overview — Hemingway-style
// Returns a single short sentence, trimmed of fluff
function extractImage(overview, lang) {
  if (!overview || overview.length < 20) return null;

  // Take first sentence
  const firstSentence = overview.split(/[.!?]/)[0].trim();
  if (firstSentence.length < 15 || firstSentence.length > 200) return null;

  // Strip common opening fluff
  const stripPatterns = [
    /^(in |an? |the |this |when |after |during |before |while |as )/i,
    /^(set in |based on |a film about |a story about |tells the story of |follows the )/i,
  ];
  let cleaned = firstSentence;
  for (const pattern of stripPatterns) {
    cleaned = cleaned.replace(pattern, "");
  }
  cleaned = cleaned.trim();
  if (cleaned.length === 0) return null;

  // Capitalize first letter
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  // Ensure ending punctuation
  if (!/[.!?]$/.test(cleaned)) cleaned += ".";

  return cleaned;
}

// Deterministic pseudo-random selector based on film ID
// Ensures same film always gets same text (consistency per film)
function pickFrom(array, seed) {
  if (!array || array.length === 0) return "";
  const index = Math.abs(seed) % array.length;
  return array[index];
}

function normalizeTitle(title = "") {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ===================================================================
// MAIN GENERATOR
// ===================================================================
export function generateWhy(film, dnaType, mood, lang = "el") {
  // 1. Check curated list first (for ~50 famous films)
  const normTitle = normalizeTitle(film?.title || "");
  const curated = CURATED[normTitle];
  if (curated) {
    return lang === "en" ? (curated.en || curated.el) : curated.el;
  }

  // 2. Build smart template from TMDB data
  const dnaKey = (typeof dnaType === "object" && dnaType?.key) ? dnaType.key : (dnaType || "d");
  const filmSeed = Number(film?.id) || 0;

  const openers = DNA_OPENERS[lang]?.[dnaKey] || DNA_OPENERS[lang]?.d || [];
  const closers = MOOD_CLOSERS[lang]?.[mood] || MOOD_CLOSERS[lang]?.thought || [];

  // Pick opener and closer deterministically per film
  const opener = pickFrom(openers, filmSeed);
  const closer = pickFrom(closers, filmSeed + 7); // offset for variety

  // Try to extract an image from overview (in user's language — tmdb.js handles this)
  const image = extractImage(film?.overview, lang);

  // Use tagline if available and short enough
  const tagline = film?.tagline && film.tagline.length > 10 && film.tagline.length < 120
    ? film.tagline
    : null;

  // COMPOSE — three strategies based on available data

  // Strategy A: We have an image from overview → use it as the concrete hook
  if (image) {
    return `${opener} ${image} ${closer}`;
  }

  // Strategy B: We have a tagline → quote it in context
  if (tagline) {
    const connector = lang === "en" ? `"${tagline}"` : `«${tagline}»`;
    return `${opener} ${connector} ${closer}`;
  }

  // Strategy C: Pure DNA + mood template with director/year context
  const directorLine = film?.director
    ? (lang === "en"
        ? `A film by ${film.director}${film.year ? ` (${film.year})` : ""}.`
        : `Ταινία του ${film.director}${film.year ? ` (${film.year})` : ""}.`)
    : "";

  const parts = [opener, directorLine, closer].filter(Boolean);
  return parts.join(" ");
}
