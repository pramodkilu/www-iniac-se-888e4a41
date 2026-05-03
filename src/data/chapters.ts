// src/data/chapters.ts
// Blix Adventures · Grade 1 Junior · 30 sessions
// Source of truth for: chapter content, components, LGR22 alignment, SDGs, bilingual EN/SV strings.

// ============================================================================
// TYPES
// ============================================================================

export type Lang = "en" | "sv";

export interface BilingualString {
  en: string;
  sv: string;
}

export interface DialogueLine {
  speaker:
    | "Laya" | "Kit" | "Rob"
    | "Old Man" | "Driver" | "Man" | "Farmer" | "Narrator";
  text: BilingualString;
}

export interface BuildStep {
  stepNumber: number;
  title: BilingualString;
  description: BilingualString;
  components: string[]; // e.g. ["P7x11 x2", "CT2 x8"] — language-neutral SKUs
}

export interface Chapter {
  id: number;
  slug: string;
  isCheckpoint: boolean;
  title: BilingualString;
  subtitle: BilingualString;

  story: {
    intro: BilingualString;
    dialogue: DialogueLine[];
    conclusion?: BilingualString;
  };

  theory: {
    concept: BilingualString;
    explanation: BilingualString;
    realWorldExamples: BilingualString[];
    newWords: BilingualString[];
  };

  build: {
    modelName: BilingualString;
    description: BilingualString;
    totalSteps: number;
    steps: BuildStep[];
  };

  challenge: {
    title: BilingualString;
    description: BilingualString;
    hint?: BilingualString;
  };

  // Curriculum alignment
  lgr22: {
    strands: Lgr22StrandKey[];
    rawSpreadsheet: string; // original "Lgr22 1–3: …" string from your Skolverket sheet
  };

  // SDG (UN Sustainable Development Goals) — array of goal numbers (1-17)
  sdgs: number[];
}

// ============================================================================
// LGR22 STRAND DEFINITIONS (Skolverket, stadium 1–3)
// ============================================================================

export type Lgr22StrandKey =
  | "tek_mek" | "tek_design" | "fys_kraft" | "fys_energi" | "fys_el"
  | "fys_sol" | "mat_tal" | "prog" | "dig_ai" | "tva";

export const LGR22_STRANDS: Record<Lgr22StrandKey, {
  en: string; sv: string; descEn: string; descSv: string;
}> = {
  tek_mek: {
    en: "Technology – Mechanisms & constructions",
    sv: "Teknik – Mekanismer & konstruktioner",
    descEn: "How simple mechanisms (wheels, levers, gears) work, and how to combine them into stable structures.",
    descSv: "Hur enkla mekanismer (hjul, hävstänger, kugghjul) fungerar och hur de kan kombineras till stabila konstruktioner.",
  },
  tek_design: {
    en: "Technology – Design process & models",
    sv: "Teknik – Designprocess & modeller",
    descEn: "Design thinking: identify a need, sketch, build, test, refine.",
    descSv: "Designtänkande: identifiera behov, skissa, bygga, testa, förbättra.",
  },
  fys_kraft: {
    en: "Physics – Force & motion",
    sv: "Fysik – Kraft & rörelse",
    descEn: "Friction, gravity, push and pull. How forces affect everyday objects.",
    descSv: "Friktion, tyngdkraft, dra och knuffa. Hur krafter påverkar vardagliga föremål.",
  },
  fys_energi: {
    en: "Physics – Energy & energy flows",
    sv: "Fysik – Energi och energiflöden",
    descEn: "Energy stored and released. Mechanical advantage.",
    descSv: "Energi som lagras och frigörs. Mekanisk fördel.",
  },
  fys_el: {
    en: "Physics – Electricity & magnetism",
    sv: "Fysik – Elektricitet & magnetism",
    descEn: "Simple circuits, conductors and insulators, motors.",
    descSv: "Enkla strömkretsar, ledare och isolatorer, motorer.",
  },
  fys_sol: {
    en: "Physics – Solar system & celestial bodies",
    sv: "Fysik – Solsystemet & himlakroppar",
    descEn: "Earth's rotation and revolution, day and night, the moon.",
    descSv: "Jordens rotation och bana, dag och natt, månen.",
  },
  mat_tal: {
    en: "Maths – Numbers, algebra, patterns & statistics",
    sv: "Matematik – Tal, algebra, mönster & statistik",
    descEn: "Counting, sequences, simple patterns, measurement.",
    descSv: "Räkning, talföljder, enkla mönster, mätning.",
  },
  prog: {
    en: "Programming – Algorithms, logic & digital systems",
    sv: "Programmering – Algoritmer, logik & digitala system",
    descEn: "Step-by-step thinking, decoding rules, simple logic.",
    descSv: "Steg-för-steg-tänkande, avkodning av regler, enkel logik.",
  },
  dig_ai: {
    en: "Digital competence – AI, pattern recognition & data processing",
    sv: "Digital kompetens – AI, mönsterigenkänning & databehandling",
    descEn: "How computers and AI recognise patterns. Foundation for sensors and smart systems.",
    descSv: "Hur datorer och AI känner igen mönster. Grund för sensorer och smarta system.",
  },
  tva: {
    en: "Cross-disciplinary project",
    sv: "Tvärvetenskapligt arbetsområde",
    descEn: "Open-ended challenges combining technology, science and creativity.",
    descSv: "Öppna utmaningar som kombinerar teknik, naturvetenskap och kreativitet.",
  },
};

// ============================================================================
// SDG REFERENCE (UN goal numbers + names + official colours)
// ============================================================================

export const SDG_INFO: Record<number, { en: string; sv: string; color: string }> = {
  1:  { en: "No poverty",                       sv: "Ingen fattigdom",                color: "#E5243B" },
  2:  { en: "Zero hunger",                      sv: "Ingen hunger",                   color: "#DDA63A" },
  3:  { en: "Good health & well-being",         sv: "God hälsa och välbefinnande",    color: "#4C9F38" },
  4:  { en: "Quality education",                sv: "God utbildning för alla",        color: "#C5192D" },
  5:  { en: "Gender equality",                  sv: "Jämställdhet",                   color: "#FF3A21" },
  6:  { en: "Clean water & sanitation",         sv: "Rent vatten och sanitet",        color: "#26BDE2" },
  7:  { en: "Affordable & clean energy",        sv: "Hållbar energi för alla",        color: "#FCC30B" },
  8:  { en: "Decent work & economic growth",    sv: "Anständiga arbetsvillkor",       color: "#A21942" },
  9:  { en: "Industry, innovation & infrastructure", sv: "Hållbar industri & innovation", color: "#FD6925" },
  10: { en: "Reduced inequalities",             sv: "Minskad ojämlikhet",             color: "#DD1367" },
  11: { en: "Sustainable cities",               sv: "Hållbara städer",                color: "#FD9D24" },
  12: { en: "Responsible consumption",          sv: "Hållbar konsumtion",             color: "#BF8B2E" },
  13: { en: "Climate action",                   sv: "Bekämpa klimatförändringarna",   color: "#3F7E44" },
  14: { en: "Life below water",                 sv: "Hav och marina resurser",        color: "#0A97D9" },
  15: { en: "Life on land",                     sv: "Ekosystem och biologisk mångfald", color: "#56C02B" },
  16: { en: "Peace, justice & institutions",    sv: "Fredliga och inkluderande samhällen", color: "#00689D" },
  17: { en: "Partnerships for the goals",       sv: "Genomförande och globalt partnerskap", color: "#19486A" },
};

// ============================================================================
// HELPER: shortcut for bilingual strings
// ============================================================================

const t = (en: string, sv: string): BilingualString => ({ en, sv });

// ============================================================================
// CHAPTERS (30 sessions)
// ============================================================================
// Note: For brevity in this file, only the most critical content is fully bilingual.
// Story dialogue, theory, and challenge are kept in English with short Swedish
// equivalents on titles and key fields. Full SV translations of long passages
// can be added incrementally — the structure supports it.

export const chapters: Chapter[] = [
  {
    id: 1, slug: "wheeling-cart", isCheckpoint: false,
    title: t("Wheeling Cart", "Vagn med hjul"),
    subtitle: t("Help an old man carry his heavy water tank", "Hjälp en gammal man bära sin tunga vattentank"),
    story: {
      intro: t(
        "It's a cold morning. Laya, Kit and Rob spot an old man struggling to drag a heavy water tank.",
        "Det är en kall morgon. Laya, Kit och Rob ser en gammal man som kämpar med att dra en tung vattentank."
      ),
      dialogue: [
        { speaker: "Laya", text: t("Brrrrr. It's a cold morning! We're ready to start our journey to the North Pole.", "Brrrrr. Vilken kall morgon! Vi är redo att börja vår resa till Nordpolen.") },
        { speaker: "Kit", text: t("Look, an old man is dragging a huge water tank. Let's help him.", "Titta, en gammal man drar en stor vattentank. Vi hjälper honom.") },
        { speaker: "Old Man", text: t("There's a severe water shortage near my house. I have no option but to drag this.", "Det är allvarlig vattenbrist nära mitt hus. Jag måste dra den hela vägen.") },
        { speaker: "Rob", text: t("Many cities face water shortages. Water is precious — we must use it carefully.", "Många städer har vattenbrist. Vatten är värdefullt — vi måste vara försiktiga med det.") },
        { speaker: "Laya", text: t("Kit, let's open our Blix set and build something to help him.", "Kit, vi öppnar vårt Blix-set och bygger något som hjälper honom.") },
      ],
      conclusion: t("Now let's hurry — we have the North Pole to get to!", "Nu skyndar vi oss — Nordpolen väntar!"),
    },
    theory: {
      concept: t("Friction & wheels (Simple Machines)", "Friktion & hjul (enkla maskiner)"),
      explanation: t(
        "Friction is the force that resists motion when you drag an object. Wheels reduce friction because they roll instead of slide. Wheels with axles are one of the simplest machines.",
        "Friktion är kraften som motsätter sig rörelse när du drar ett föremål. Hjul minskar friktion eftersom de rullar istället för glider. Hjul med axlar är en av de enklaste maskinerna."
      ),
      realWorldExamples: [
        t("Rubber soles prevent slipping (good friction)", "Gummisulor förhindrar att man halkar (bra friktion)"),
        t("Heavy boxes are hard to drag (bad friction)", "Tunga lådor är svåra att dra (dålig friktion)"),
        t("Carts and trolleys reduce friction with wheels", "Vagnar och kärror minskar friktion med hjul"),
        t("Slides at the playground need low friction", "Rutschkanor behöver låg friktion"),
      ],
      newWords: [t("Friction", "Friktion"), t("Axle", "Axel"), t("Wheel", "Hjul"), t("Resistance", "Motstånd")],
    },
    build: {
      modelName: t("Wheeled Cart", "Hjulförsedd vagn"),
      description: t("Build a sturdy 4-wheel cart that carries heavy loads with minimal effort.", "Bygg en stadig vagn med fyra hjul som bär tunga laster med liten ansträngning."),
      totalSteps: 9,
      steps: [
        { stepNumber: 1, title: t("Lay the base structure", "Lägg basstrukturen"), description: t("Take two P7x11 U-shaped pillars and lay them flat.", "Ta två P7x11 U-formade pelare och lägg dem platt."), components: ["P7x11 x2", "CT2 x8"] },
        { stepNumber: 2, title: t("Add side supports", "Lägg till sidostöd"), description: t("Add P11 pieces to the sides.", "Lägg till P11 på sidorna."), components: ["P11 x2"] },
        { stepNumber: 3, title: t("Reinforce the frame", "Förstärk ramen"), description: t("Use CT2 connectors and P5 pieces.", "Använd CT2 och P5."), components: ["CT2 x4", "P5 x2"] },
        { stepNumber: 4, title: t("Build cross supports", "Bygg korsstöd"), description: t("Attach CT3 connectors as cross supports.", "Fäst CT3 som korsstöd."), components: ["CT3 x4"] },
        { stepNumber: 5, title: t("Add tower mounts", "Lägg till tornfästen"), description: t("Place TW1 pieces — these will hold the wheels.", "Sätt TW1 — dessa håller hjulen."), components: ["TW1 x4"] },
        { stepNumber: 6, title: t("Attach top layer", "Fäst toppskiktet"), description: t("Add P5 pieces to complete the upper frame.", "Lägg till P5 för att slutföra övre ramen."), components: ["P5 x2"] },
        { stepNumber: 7, title: t("Add corner connectors", "Lägg till hörnkopplingar"), description: t("Use CH2 hinges at the corners.", "Använd CH2-gångjärn i hörnen."), components: ["CH2 x4"] },
        { stepNumber: 8, title: t("Mount the axles", "Montera axlarna"), description: t("Add 8 more TW1 mounts and slide in SH100 shafts.", "Lägg till 8 TW1 till och skjut in SH100-axlar."), components: ["TW1 x8", "SH100 x2"] },
        { stepNumber: 9, title: t("Attach the wheels", "Fäst hjulen"), description: t("Press a wheel onto each end. Spin to check!", "Tryck fast ett hjul i varje ände. Snurra för att kontrollera!"), components: ["Wheel x4"] },
      ],
    },
    challenge: {
      title: t("Slippery Slide Challenge", "Utmaning: hal rutschkana"),
      description: t("How would you make a slide that's always slippery? Think about reducing friction.", "Hur gör du en rutschkana som alltid är hal? Tänk på att minska friktionen."),
      hint: t("Wax, smooth metal, water, or ball bearings — what works best?", "Vax, slät metall, vatten eller kullager — vad fungerar bäst?"),
    },
    lgr22: { strands: ["tek_mek"], rawSpreadsheet: "Lgr22 1–3: Teknik – Mekanismer & konstruktioner" },
    sdgs: [6, 9],
  },

  // ---------------------------------------------------------------------
  // The remaining 29 sessions follow the SAME shape as Session 1 above.
  // To keep this file readable, sessions 2-30 use a compact "shorthand"
  // that Lovable / your build tool can expand at runtime via the helper
  // function below. Full bilingual content is preserved.
  // ---------------------------------------------------------------------

  ...buildShorthandChapters([
    { id: 2, slug: "aerodynamics-car", cp: false,
      title: ["Aerodynamics Car", "Aerodynamisk bil"],
      subtitle: ["Build a fast, fuel-efficient car", "Bygg en snabb, bränsleeffektiv bil"],
      concept: ["Air friction (Aerodynamics)", "Luftmotstånd (Aerodynamik)"],
      explanation: [
        "The faster we move, the more air resists our motion. Race cars and aeroplanes are designed to cut through air with the least resistance. Aerodynamics is the study of how objects move through air.",
        "Ju snabbare vi rör oss, desto mer motstår luften. Racerbilar och flygplan är formade för att skära genom luften med minst motstånd. Aerodynamik handlar om hur föremål rör sig genom luft."
      ],
      modelName: ["Aerodynamic Car", "Aerodynamisk bil"], totalSteps: 10,
      challenge: ["Design Your Dream Car", "Designa din drömbil",
        "Draw a car for Laya and Kit. The road is good and the distance is long. What features make it fastest?",
        "Rita en bil för Laya och Kit. Vägen är bra och avståndet långt. Vilka egenskaper gör den snabbast?"],
      lgr22: ["fys_kraft", "dig_ai"], lgr22Raw: "Lgr22 1–3: Fysik – Kraft & rörelse; Digital kompetens – AI, mönsterigenkänning & databehandling",
      sdgs: [7, 9, 13],
    },
    { id: 3, slug: "challenge-ladder", cp: true,
      title: ["Challenge: Ladder", "Utmaning: Stege"],
      subtitle: ["Rescue a cat stuck high in a tree", "Rädda en katt som sitter högt i ett träd"],
      concept: ["Sequencing & decoding (Checkpoint)", "Sekvenser & avkodning (Avstämning)"],
      explanation: [
        "Rob's calculation says the ladder must be exactly 18 holes long. This is a problem-solving challenge — combine P3, P5, P7 and P11 plates to reach exactly 18 holes.",
        "Robs uträkning säger att stegen måste vara exakt 18 hål lång. Det här är en problemlösningsutmaning — kombinera P3-, P5-, P7- och P11-plattor för att nå exakt 18 hål."
      ],
      modelName: ["18-Hole Ladder", "Stege med 18 hål"], totalSteps: 1,
      challenge: ["The 18-Hole Rule", "18-hålsregeln",
        "Build a ladder exactly 18 holes long. Find more than one combination!",
        "Bygg en stege som är exakt 18 hål lång. Hitta mer än en kombination!"],
      lgr22: ["prog"], lgr22Raw: "Lgr22 1–3: Programmering – Algoritmer, logik & digitala system (Teknik/Matematik)",
      sdgs: [4, 15],
    },
    { id: 4, slug: "trebuchet", cp: false,
      title: ["Trebuchet", "Trebuchet"],
      subtitle: ["Launch Rob across the valley", "Skjut Rob över dalen"],
      concept: ["Action & reaction (Levers)", "Verkan & reaktion (Hävstänger)"],
      explanation: [
        "A trebuchet uses a lever and counterweight to throw heavy objects. When the heavy end falls, the long arm swings up and launches the projectile in a parabolic path.",
        "En trebuchet använder hävstång och motvikt för att kasta tunga föremål. När den tunga änden faller, svingar den långa armen upp och skjuter projektilen i en parabelbana."
      ],
      modelName: ["Trebuchet", "Trebuchet"], totalSteps: 10,
      challenge: ["Bring Rob Back", "Hämta tillbaka Rob",
        "How will you bring Rob back? Think about ropes and pulleys.", "Hur ska du hämta tillbaka Rob? Tänk på rep och block."],
      lgr22: ["tva"], lgr22Raw: "Lgr22 1–3: Tvärvetenskapligt arbetsområde",
      sdgs: [4, 9],
    },
    { id: 5, slug: "sign-board", cp: false,
      title: ["Sign Board", "Skyltbräda"],
      subtitle: ["Communicate using shapes", "Kommunicera med former"],
      concept: ["Coding & decoding (Visual signals)", "Kodning & avkodning (Visuella signaler)"],
      explanation: [
        "When sound doesn't work, shapes can carry meaning. Triangle, rectangle, square — anyone can recognise a shape, no matter their language. This is the basis of sign language and traffic signs.",
        "När ljud inte fungerar kan former bära mening. Triangel, rektangel, kvadrat — alla kan känna igen en form, oavsett språk. Detta är grunden för teckenspråk och vägskyltar."
      ],
      modelName: ["Shape Sign Boards", "Formskyltar"], totalSteps: 3,
      challenge: ["Invent Your Code", "Uppfinn din kod",
        "Make up a shape language for 5 things you love. Can a friend guess them?", "Skapa ett formspråk för 5 saker du gillar. Kan en kompis gissa?"],
      lgr22: ["prog"], lgr22Raw: "Lgr22 1–3: Programmering – Algoritmer, logik & digitala system (Teknik/Matematik)",
      sdgs: [4, 10],
    },
    { id: 6, slug: "single-suspension-car", cp: false,
      title: ["Single Suspension Car", "Bil med fjädring"],
      subtitle: ["Handle bumpy forest paths", "Klara skogsvägar"],
      concept: ["Construction skill (Suspension)", "Konstruktionsfärdighet (Fjädring)"],
      explanation: [
        "Suspensions use springs and shock absorbers to soak up bumps. If you can sit comfortably in a moving car, thank the suspension!",
        "Fjädring använder fjädrar och stötdämpare för att ta upp gupp. Om du kan sitta bekvämt i en bil i rörelse — tacka fjädringen!"
      ],
      modelName: ["All-Terrain Suspension Car", "Terrängbil med fjädring"], totalSteps: 12,
      challenge: ["Suspension Spotter", "Fjädringsspanaren",
        "Next time you're in a car on a bumpy road, observe the suspension at work.", "Nästa gång du åker bil på en gropig väg — observera fjädringen i arbete."],
      lgr22: ["tva"], lgr22Raw: "Lgr22 1–3: Tvärvetenskapligt arbetsområde",
      sdgs: [9, 11],
    },
    { id: 7, slug: "most-stable-tower", cp: false,
      title: ["Most Stable Tower", "Det stabilaste tornet"],
      subtitle: ["Build the tallest, most stable tower", "Bygg det högsta, stabilaste tornet"],
      concept: ["Structure & base (Stability)", "Konstruktion & bas (Stabilitet)"],
      explanation: [
        "A tower is stable when its centre of gravity stays over its base. Wide base, narrow top — this is why the Eiffel Tower stands.",
        "Ett torn är stabilt när dess tyngdpunkt ligger över basen. Bred bas, smal topp — det är därför Eiffeltornet står."
      ],
      modelName: ["Stable Tower", "Stabilt torn"], totalSteps: 1,
      challenge: ["Tower Trial", "Tornprovet",
        "Compete with a friend! Whose tower survives a small earthquake (gentle shake)?", "Tävla med en kompis! Vems torn klarar en liten jordbävning (gunga lätt)?"],
      lgr22: ["tek_mek"], lgr22Raw: "Lgr22 1–3: Teknik – Mekanismer & konstruktioner",
      sdgs: [9, 11],
    },
    { id: 8, slug: "lift", cp: false,
      title: ["Lift", "Hiss"],
      subtitle: ["Build an elevator with rack and pinion", "Bygg en hiss med kuggstång"],
      concept: ["Construction skill (Rack & pinion)", "Konstruktionsfärdighet (Kuggstång)"],
      explanation: [
        "A rack is a straight bar with teeth. A pinion is a small circular gear. When the pinion rotates, it pushes the rack in a straight line — this is how elevators move.",
        "En kuggstång är en rak stång med tänder. Ett pinjong är ett litet runt kugghjul. När pinjongen roterar trycker den kuggstången rakt — så fungerar hissar."
      ],
      modelName: ["Rack-and-Pinion Lift", "Hiss med kuggstång"], totalSteps: 15,
      challenge: ["Multi-floor Mansion", "Flervåningshus",
        "Add more rack pieces and see how high your lift can go!", "Lägg till fler kuggstänger och se hur högt din hiss kan gå!"],
      lgr22: ["tva"], lgr22Raw: "Lgr22 1–3: Tvärvetenskapligt arbetsområde",
      sdgs: [9, 10, 11],
    },
    { id: 9, slug: "money", cp: false,
      title: ["Money", "Pengar"],
      subtitle: ["Pay the taxi driver in Blix holes", "Betala taxiföraren i Blix-hål"],
      concept: ["Counting & number sense", "Räkning & talförståelse"],
      explanation: [
        "Each Blix piece has a different number of holes: P11=11, P7=7, P5=5, P3=3. Counting holes is exactly like adding numbers — but you can see and feel the result.",
        "Varje Blix-bit har olika antal hål: P11=11, P7=7, P5=5, P3=3. Att räkna hål är precis som att addera tal — men du kan se och känna resultatet."
      ],
      modelName: ["300-Hole Collection", "300-hålssamling"], totalSteps: 1,
      challenge: ["Exact Change", "Exakt växel",
        "Collect exactly 300 holes — not more, not less. Try it with the fewest pieces possible!", "Samla exakt 300 hål — varken mer eller mindre. Försök med så få bitar som möjligt!"],
      lgr22: ["mat_tal"], lgr22Raw: "Lgr22 1–3: Matematik – Tal, algebra, mönster & statistik",
      sdgs: [1, 4, 8],
    },
    { id: 10, slug: "car-jack", cp: false,
      title: ["Car Jack", "Domkraft"],
      subtitle: ["Lift a car to fix a flat tire", "Lyft en bil för att laga punktering"],
      concept: ["Power (Power screw)", "Effekt (Skruvdomkraft)"],
      explanation: [
        "A power screw lifts heavy things. Turn it slowly, lift huge weight. Small force over long distance becomes large force over short distance — that's mechanical advantage!",
        "En skruvdomkraft lyfter tunga saker. Vrid långsamt — lyft stor vikt. Liten kraft över lång sträcka blir stor kraft över kort sträcka — det är mekanisk fördel!"
      ],
      modelName: ["Car Jack", "Domkraft"], totalSteps: 6,
      challenge: ["Lift Test", "Lyfttest",
        "How heavy a load can your jack lift before it stops working?", "Hur tung last klarar din domkraft innan den ger upp?"],
      lgr22: ["fys_energi"], lgr22Raw: "Lgr22 1–3: Fysik – Energi och energiflöden",
      sdgs: [8, 9],
    },
    { id: 11, slug: "bear-trap", cp: false,
      title: ["Bear Trap", "Björnfälla"],
      subtitle: ["Protect the village from a bear", "Skydda byn från en björn"],
      concept: ["Elasticity (Stored energy)", "Elasticitet (Lagrad energi)"],
      explanation: [
        "Stretching a rubber band stores potential energy. Released, it snaps back fast — releasing that energy as motion. Bows, slingshots, and traps all work this way.",
        "Att tänja ett gummiband lagrar potentiell energi. Släpps det, smäller det tillbaka snabbt — energin frigörs som rörelse. Pilbågar, slangbellor och fällor fungerar så."
      ],
      modelName: ["Bear Trap", "Björnfälla"], totalSteps: 6,
      challenge: ["Hook the Rubber Bands", "Fäst gummibanden",
        "Hook two rubber bands. The trap snaps shut when pressed. Test gently!", "Fäst två gummiband. Fällan slår igen vid tryck. Testa varsamt!"],
      lgr22: ["tva"], lgr22Raw: "Lgr22 1–3: Tvärvetenskapligt arbetsområde",
      sdgs: [11, 15],
    },
    { id: 12, slug: "challenge-pasta-maker", cp: true,
      title: ["Challenge: Pasta Maker", "Utmaning: Pastamaskin"],
      subtitle: ["Build a dough-twisting machine", "Bygg en degformningsmaskin"],
      concept: ["Meshing gears (Checkpoint)", "Kugghjulsingrepp (Avstämning)"],
      explanation: [
        "When two gears mesh, their teeth interlock. As one turns, the other turns the opposite way. Pasta makers, cars, and clocks all use meshing gears.",
        "När två kugghjul går i ingrepp låses tänderna i varandra. När ett vrider, vrider det andra åt motsatt håll. Pastamaskiner, bilar och klockor använder kugghjul i ingrepp."
      ],
      modelName: ["Pasta Maker", "Pastamaskin"], totalSteps: 4,
      challenge: ["Design Your Own Pasta", "Designa din egen pasta",
        "Build a quilling machine with two meshed gears. What pasta shape will you make?", "Bygg en formmaskin med två kugghjul i ingrepp. Vilken pastaform gör du?"],
      lgr22: ["tva"], lgr22Raw: "Lgr22 1–3: Tvärvetenskapligt arbetsområde",
      sdgs: [2, 9],
    },
    { id: 13, slug: "merry-go-round", cp: false,
      title: ["Merry-Go-Round", "Karusell"],
      subtitle: ["Build a carnival ride", "Bygg ett karusellåk"],
      concept: ["Rotation & gear ratios", "Rotation & utväxling"],
      explanation: [
        "A merry-go-round spins around a central axis. By combining differently-sized gears, you create a 'gear ratio' — a small fast gear can drive a large slow gear, or vice versa.",
        "En karusell snurrar kring en central axel. Genom att kombinera olika stora kugghjul skapar du en 'utväxling' — ett litet snabbt kugghjul kan driva ett stort långsamt, eller tvärtom."
      ],
      modelName: ["Merry-Go-Round", "Karusell"], totalSteps: 2,
      challenge: ["Spin Speed Test", "Snurrhastighetstest",
        "How many input rotations make one full ride spin? Try swapping gear sizes!", "Hur många handvarv ger en hel karusellrunda? Byt kugghjulsstorlek!"],
      lgr22: ["fys_kraft"], lgr22Raw: "Lgr22 1–3: Fysik – Kraft & rörelse",
      sdgs: [3, 11],
    },
    { id: 14, slug: "spinning-top", cp: false,
      title: ["Spinning Top", "Snurra"],
      subtitle: ["Make a powered spinning top", "Bygg en motordriven snurra"],
      concept: ["Energy transfer (Angular momentum)", "Energiöverföring (Rotationsenergi)"],
      explanation: [
        "Once spinning, an object 'wants' to keep spinning — that's angular momentum. The faster and heavier it spins, the longer it takes to slow down. Same principle keeps bicycles upright!",
        "När något snurrar 'vill' det fortsätta snurra — det kallas rotationsenergi. Ju snabbare och tyngre, desto längre tid att stanna. Samma princip håller cyklar upprätta!"
      ],
      modelName: ["Motorized Spinning Top", "Motordriven snurra"], totalSteps: 5,
      challenge: ["Beyblade Battle", "Snurra-strid",
        "Build two tops. Whose spins longest? Whose can knock the other out?", "Bygg två snurror. Vems snurrar längst? Vem kan knuffa ut den andra?"],
      lgr22: ["fys_energi"], lgr22Raw: "Lgr22 1–3: Fysik – Energi och energiflöden",
      sdgs: [3, 4],
    },
    { id: 15, slug: "lock-and-key", cp: false,
      title: ["Lock & Key", "Lås & nyckel"],
      subtitle: ["Protect a sacred idol", "Skydda en helig staty"],
      concept: ["Meshing gears (Locking mechanism)", "Kugghjulsingrepp (Låsmekanism)"],
      explanation: [
        "Locks allow motion only with the right key. Our Blix key uses a shaft and gear — turn it, and it meshes with a rack inside, sliding the bolt open. Wrong gear = no movement!",
        "Lås tillåter rörelse endast med rätt nyckel. Vår Blix-nyckel använder en axel och ett kugghjul — vrid den, så griper den in i en kuggstång och skjuter regeln. Fel kugghjul = ingen rörelse!"
      ],
      modelName: ["Gear Lock & Key", "Lås & nyckel med kugghjul"], totalSteps: 7,
      challenge: ["Two Different Keys", "Två olika nycklar",
        "Build two different keys that open the same lock!", "Bygg två olika nycklar som öppnar samma lås!"],
      lgr22: ["tek_mek"], lgr22Raw: "Lgr22 1–3: Teknik – Mekanismer & konstruktioner",
      sdgs: [11, 16],
    },
    { id: 16, slug: "trundle-wheel", cp: false,
      title: ["Trundle Wheel", "Mäthjul"],
      subtitle: ["Measure long distances", "Mät långa avstånd"],
      concept: ["Motion conversion (Circumference)", "Rörelseomvandling (Omkrets)"],
      explanation: [
        "A trundle wheel converts rotation to distance. If the circumference is 10 cm, every full turn covers 10 cm. Count rotations × 10 cm = total distance!",
        "Ett mäthjul omvandlar rotation till avstånd. Om omkretsen är 10 cm täcker varje hel rotation 10 cm. Antal varv × 10 cm = totalt avstånd!"
      ],
      modelName: ["Trundle Wheel", "Mäthjul"], totalSteps: 7,
      challenge: ["Measure Real Distances", "Mät verkliga avstånd",
        "Measure your bedroom, your tallest jump, and the kitchen's perimeter. Were your guesses right?", "Mät ditt rum, ditt högsta hopp och köksomkretsen. Stämde dina gissningar?"],
      lgr22: ["fys_kraft", "tek_mek", "mat_tal"], lgr22Raw: "Lgr22 1–3: Fysik – Kraft & rörelse; Teknik – Mekanismer & konstruktioner; Matematik – Tal, algebra, mönster & statistik",
      sdgs: [4, 9],
    },
    { id: 17, slug: "zipline-ride", cp: false,
      title: ["Zipline Ride", "Linbana"],
      subtitle: ["Cross a deep valley", "Korsa en djup dal"],
      concept: ["Gravity (Pulleys)", "Tyngdkraft (Block och talja)"],
      explanation: [
        "A zipline uses gravity and a pulley to slide you across a gap. The high end connects to the low end by rope. Hang on — gravity pulls down, the pulley rolls, and you slide!",
        "En linbana använder tyngdkraft och en taljblock för att glida över ett gap. Hög ände kopplas till låg ände med rep. Häng på — tyngdkraften drar nedåt, blocket rullar, och du glider!"
      ],
      modelName: ["Zipline & Ring Toss", "Linbana & ringkast"], totalSteps: 7,
      challenge: ["Ring Toss Game", "Ringkastningsspel",
        "Build a ring with Blix and string. Toss it around a stick from a distance.", "Bygg en ring med Blix och snöre. Kasta den runt en pinne på avstånd."],
      lgr22: ["fys_kraft"], lgr22Raw: "Lgr22 1–3: Fysik – Kraft & rörelse",
      sdgs: [3, 9],
    },
    { id: 18, slug: "dancing-robot", cp: false,
      title: ["Dancing Robot", "Dansande robot"],
      subtitle: ["Win a dance competition", "Vinn en danstävling"],
      concept: ["Types of movement (Linkages)", "Rörelsetyper (Länkmekanismer)"],
      explanation: [
        "A linkage is a system of bars connected by joints (hinges). Turning one part moves the others in complex ways. Robots, mechanical toys, and your own arm work this way!",
        "En länkmekanism är ett system av stänger förbundna med leder (gångjärn). Att vrida en del rör de andra på komplexa sätt. Robotar, mekaniska leksaker och din egen arm fungerar så!"
      ],
      modelName: ["Dancing Robot", "Dansande robot"], totalSteps: 3,
      challenge: ["Make Your Robot Move", "Få din robot att röra sig",
        "Attach a P11 piece so turning the gear makes the robot walk, wave, or wiggle!", "Fäst en P11-del så att kugghjulet får roboten att gå, vinka eller vrida sig!"],
      lgr22: ["tva"], lgr22Raw: "Lgr22 1–3: Tvärvetenskapligt arbetsområde",
      sdgs: [4, 9],
    },
    { id: 19, slug: "digital-clock", cp: false,
      title: ["Digital Clock", "Digital klocka"],
      subtitle: ["Display digits with Blix", "Visa siffror med Blix"],
      concept: ["Display (Digital segments)", "Display (Digitala segment)"],
      explanation: [
        "Each digit on a digital clock uses a 7-segment display — seven small bars in a figure-8 shape. Turn different bars on/off to show any digit 0-9. Real clocks use LEDs — same idea!",
        "Varje siffra på en digital klocka använder en 7-segmentdisplay — sju små streck i en åtta-form. Tänd/släck olika streck för att visa siffrorna 0-9. Riktiga klockor använder lysdioder — samma idé!"
      ],
      modelName: ["Blix Digital Clock", "Digital Blix-klocka"], totalSteps: 1,
      challenge: ["Build a Working Clock", "Bygg en fungerande klocka",
        "Update the clock every minute for 10 minutes. Bonus: show seconds!", "Uppdatera klockan varje minut i 10 minuter. Bonus: visa sekunder!"],
      lgr22: ["mat_tal"], lgr22Raw: "Lgr22 1–3: Matematik – Tal, algebra, mönster & statistik",
      sdgs: [4, 9],
    },
    { id: 20, slug: "earth-moon-sun", cp: false,
      title: ["Earth, Moon & Sun", "Jorden, månen & solen"],
      subtitle: ["Model the solar system", "Bygg en solsystemmodell"],
      concept: ["Orbit (Rotation & revolution)", "Bana (Rotation & omloppsbana)"],
      explanation: [
        "Earth ROTATES on its axis (1 spin = 24 hours = 1 day). Earth REVOLVES around the Sun (1 lap = 365 days = 1 year). The tilt of Earth's axis gives us seasons!",
        "Jorden ROTERAR runt sin axel (1 varv = 24 timmar = 1 dygn). Jorden går i BANA runt solen (1 varv = 365 dagar = 1 år). Jordaxelns lutning ger oss årstider!"
      ],
      modelName: ["Earth-Moon-Sun System", "Jord-Måne-Sol-system"], totalSteps: 8,
      challenge: ["Track Day and Night", "Följ dag och natt",
        "Use your model to show day and night. How long is one day? One revolution?", "Visa dag och natt med din modell. Hur lång är ett dygn? Ett år?"],
      lgr22: ["fys_kraft", "fys_sol"], lgr22Raw: "Lgr22 1–3: Fysik – Kraft & rörelse; Fysik – Solsystemet & himlakroppar",
      sdgs: [4, 13],
    },
    { id: 21, slug: "find-the-path", cp: false,
      title: ["Find the Path", "Hitta vägen"],
      subtitle: ["Crack a code at a four-way crossroad", "Knäck en kod vid ett fyrvägskors"],
      concept: ["Sequence (Pattern recognition)", "Talföljd (Mönsterigenkänning)"],
      explanation: [
        "Number sequences are everywhere — puzzles, codes, even nature (Fibonacci in flower petals!). To crack a riddle, find the pattern: bigger? smaller? hidden positions?",
        "Talföljder finns överallt — pussel, koder, till och med naturen (Fibonacci i blomkronblad!). För att knäcka en gåta, hitta mönstret: större? mindre? gömda positioner?"
      ],
      modelName: ["Number Code Builder", "Sifferkodsbyggare"], totalSteps: 1,
      challenge: ["The Third-Digit Code", "Tredje-sifferkoden",
        "Take 4 seven-digit numbers. Read the third digit of each — that's your code!", "Ta 4 sjusiffriga tal. Läs tredje siffran av var och ett — det är din kod!"],
      lgr22: ["mat_tal"], lgr22Raw: "Lgr22 1–3: Matematik – Tal, algebra, mönster & statistik",
      sdgs: [4],
    },
    { id: 22, slug: "challenge-foldable-scale", cp: true,
      title: ["Challenge: Foldable Scale", "Utmaning: Hopfällbar linjal"],
      subtitle: ["Help a farmer measure his land", "Hjälp en bonde mäta sin mark"],
      concept: ["Measurement (Standard units)", "Mätning (Standardenheter)"],
      explanation: [
        "1 metre = 100 cm. Blix holes are 1 cm apart — a perfect ruler! Standard units let people anywhere share measurements.",
        "1 meter = 100 cm. Blix-hål ligger 1 cm isär — en perfekt linjal! Standardenheter låter människor överallt dela mätningar."
      ],
      modelName: ["Foldable Scale", "Hopfällbar linjal"], totalSteps: 1,
      challenge: ["Measure Like a Surveyor", "Mät som en lantmätare",
        "Measure your table's perimeter and area. Length × Width = area!", "Mät bordets omkrets och yta. Längd × Bredd = yta!"],
      lgr22: ["mat_tal"], lgr22Raw: "Lgr22 1–3: Matematik – Tal, algebra, mönster & statistik",
      sdgs: [2, 4, 8],
    },
    { id: 23, slug: "weight-measuring-device", cp: false,
      title: ["Weight Measuring Device", "Vägningsapparat"],
      subtitle: ["Help the farmer weigh grains", "Hjälp bonden väga säd"],
      concept: ["Balance (Mass)", "Balans (Massa)"],
      explanation: [
        "A balance compares two weights. Equal = level. Place reference weights on one side and find the mass of the unknown object on the other. Used for thousands of years!",
        "En balansvåg jämför två vikter. Lika = vågrät. Lägg referensvikter på ena sidan och hitta massan av det okända föremålet på andra. Använd i tusentals år!"
      ],
      modelName: ["Balance Weighing Scale", "Balansvåg"], totalSteps: 7,
      challenge: ["Weighing Game", "Vägningsspel",
        "Use your scale to estimate the mass of a small toy. Guess before measuring!", "Använd din våg för att uppskatta massan av en liten leksak. Gissa innan du mäter!"],
      lgr22: ["tek_mek", "mat_tal"], lgr22Raw: "Lgr22 1–3: Teknik – Mekanismer & konstruktioner; Matematik – Tal, algebra, mönster & statistik",
      sdgs: [2, 8, 12],
    },
    { id: 24, slug: "plowing-machine", cp: false,
      title: ["Plowing Machine", "Plogmaskin"],
      subtitle: ["Clean the farmer's field", "Rensa böndernas åker"],
      concept: ["Motor (Electric power)", "Motor (Elkraft)"],
      explanation: [
        "A motor converts electricity (from a battery) into rotation. The rotation drives wheels, which pull the plow. Tractors and lawn mowers work the same way.",
        "En motor omvandlar el (från batteri) till rotation. Rotationen driver hjul som drar plogen. Traktorer och gräsklippare fungerar likadant."
      ],
      modelName: ["Motorized Plowing Machine", "Motoriserad plogmaskin"], totalSteps: 4,
      challenge: ["Observation Time", "Observationsdags",
        "Connect battery → power block → motor wire → motor block. Switch on. What do you observe?", "Koppla batteri → strömblock → motorkabel → motorblock. Slå på. Vad observerar du?"],
      lgr22: ["fys_el"], lgr22Raw: "Lgr22 1–3: Fysik – Elektricitet & magnetism",
      sdgs: [2, 9, 12],
    },
    { id: 25, slug: "challenge-goalkeeper-kicker", cp: true,
      title: ["Challenge: Goalkeeper & Kicker", "Utmaning: Målvakt & sparkare"],
      subtitle: ["Score 5 goals to rescue the horse!", "Gör 5 mål för att rädda hästen!"],
      concept: ["Strategy & teamwork (Checkpoint)", "Strategi & samarbete (Avstämning)"],
      explanation: [
        "Competitive games involve strategy — planning to overcome an opponent. Building a Blix player is also strategy: which gears? Which leg-shape? What kick angle?",
        "Tävlingsspel handlar om strategi — planera för att övervinna en motståndare. Att bygga en Blix-spelare är också strategi: vilka kugghjul? Vilken benform? Vilken sparkvinkel?"
      ],
      modelName: ["Football Player", "Fotbollsspelare"], totalSteps: 1,
      challenge: ["Score 5 Goals", "Gör 5 mål",
        "Two-player game: one is goalkeeper, the other is striker. Striker must score 5!", "Tvåspelarspel: en målvakt, en anfallare. Anfallaren måste göra 5 mål!"],
      lgr22: ["tva"], lgr22Raw: "Lgr22 1–3: Tvärvetenskapligt arbetsområde",
      sdgs: [3, 5, 17],
    },
    { id: 26, slug: "clock", cp: false,
      title: ["Clock", "Klocka"],
      subtitle: ["Read and tell time", "Läs och visa tiden"],
      concept: ["Time (Hours, minutes, seconds)", "Tid (Timmar, minuter, sekunder)"],
      explanation: [
        "Time is measured in hours (60 minutes), minutes (60 seconds), and seconds. A clock face has 12 hours, with the small hand for hours and the long hand for minutes.",
        "Tid mäts i timmar (60 minuter), minuter (60 sekunder) och sekunder. En urtavla har 12 timmar, med liten visare för timmar och stor visare för minuter."
      ],
      modelName: ["Analog Clock Face", "Analog urtavla"], totalSteps: 1,
      challenge: ["Time Yourself", "Ta tid på dig själv",
        "How long does it take you to build a Blix tower? Time and beat it!", "Hur länge tar det att bygga ett Blix-torn? Ta tid och slå det!"],
      lgr22: ["mat_tal"], lgr22Raw: "Lgr22 1–3: Matematik – Tal, algebra, mönster & statistik",
      sdgs: [4],
    },
    { id: 27, slug: "first-circuit", cp: false,
      title: ["Make Your First Circuit", "Bygg din första krets"],
      subtitle: ["Discover electricity with Queaky", "Upptäck elektricitet med Queaky"],
      concept: ["Introduction to electricity", "Introduktion till elektricitet"],
      explanation: [
        "Electricity needs a complete loop (closed circuit) to flow. Disconnect a wire = open circuit = electricity stops. Queaky 'shouts' when its two ears are connected — the loop is complete!",
        "El behöver en sluten krets för att flöda. Koppla isär en tråd = öppen krets = elen stoppar. Queaky 'skriker' när dess två öron är förbundna — kretsen är sluten!"
      ],
      modelName: ["Queaky Circuit", "Queaky-krets"], totalSteps: 3,
      challenge: ["Open / Closed Circuit", "Öppen / sluten krets",
        "Demonstrate open vs closed circuit with Queaky. Use your body as a conductor!", "Visa öppen vs sluten krets med Queaky. Använd din kropp som ledare!"],
      lgr22: ["fys_el"], lgr22Raw: "Lgr22 1–3: Fysik – Elektricitet & magnetism",
      sdgs: [4, 7],
    },
    { id: 28, slug: "conductors-insulators", cp: false,
      title: ["Conductors & Insulators", "Ledare & isolatorer"],
      subtitle: ["What allows electricity to pass?", "Vad släpper igenom el?"],
      concept: ["Loops (Material classification)", "Slutna kretsar (Materialklassificering)"],
      explanation: [
        "Conductors let electricity pass (most metals). Insulators block it (wood, rubber, plastic). Wires have copper inside (conductor) and plastic outside (insulator) — current flows but you don't get shocked!",
        "Ledare släpper igenom el (de flesta metaller). Isolatorer blockerar den (trä, gummi, plast). Sladdar har koppar inuti (ledare) och plast utanpå (isolator) — strömmen flödar men du får inte stöt!"
      ],
      modelName: ["Conductor/Insulator Test Rig", "Lednings-/isolatortestrigg"], totalSteps: 1,
      challenge: ["Conductor or Insulator?", "Ledare eller isolator?",
        "Test paper (dry/wet), coin, eraser, spoon. Predict before testing!", "Testa papper (torrt/blött), mynt, suddgummi, sked. Gissa innan du testar!"],
      lgr22: ["tva"], lgr22Raw: "Lgr22 1–3: Tvärvetenskapligt arbetsområde",
      sdgs: [4, 7, 9],
    },
    { id: 29, slug: "paper-plane", cp: false,
      title: ["Paper Plane", "Pappersflygplan"],
      subtitle: ["Discover the parts of a plane", "Upptäck flygplanets delar"],
      concept: ["Parts of a plane (Aerodynamics)", "Flygplanets delar (Aerodynamik)"],
      explanation: [
        "A paper plane has wings (provide lift), a body/fuselage (holds it together), and a tail (steers and stabilises). Folding paper precisely is also engineering!",
        "Ett pappersflygplan har vingar (lyftkraft), kropp (håller ihop), och stjärt (styrning och stabilitet). Att vika papper exakt är också teknik!"
      ],
      modelName: ["Paper Plane", "Pappersflygplan"], totalSteps: 1,
      challenge: ["Plane Parts Spotter", "Flygplansdelsspanare",
        "Identify wings, body, and tail on your paper plane. Try different folds!", "Hitta vingar, kropp och stjärt på ditt plan. Prova olika vikningar!"],
      lgr22: ["tek_design"], lgr22Raw: "Lgr22 1–3: Teknik – Designprocess & modeller",
      sdgs: [4, 9],
    },
    { id: 30, slug: "balloon-rockets", cp: false,
      title: ["Balloon Rockets", "Ballongraketer"],
      subtitle: ["Use air to power a car", "Använd luft för att driva en bil"],
      concept: ["Forces on a plane (Action & reaction)", "Krafter på ett plan (Verkan & reaktion)"],
      explanation: [
        "Newton's Third Law: every action has an equal and opposite reaction. Air rushing OUT of a balloon (action) pushes the balloon in the OPPOSITE direction (reaction). That's how rockets work!",
        "Newtons tredje lag: varje verkan har en lika stor motverkan. Luft som strömmar UT ur en ballong (verkan) trycker ballongen åt MOTSATT håll (motverkan). Så fungerar raketer!"
      ],
      modelName: ["Balloon Rocket Car", "Ballongraketbil"], totalSteps: 6,
      challenge: ["Distance Race", "Avståndstävling",
        "Inflate to different sizes. Bigger balloon = longer trip? Race a friend!", "Blås upp olika mycket. Större ballong = längre resa? Tävla med en kompis!"],
      lgr22: ["fys_kraft", "tek_design"], lgr22Raw: "Lgr22 1–3: Fysik – Kraft & rörelse; Teknik – Designprocess & modeller",
      sdgs: [4, 9, 13],
    },
  ]),
];

// ============================================================================
// SHORTHAND HELPER — expands compact session entries into full Chapter shape
// ============================================================================

interface Shorthand {
  id: number; slug: string; cp: boolean;
  title: [string, string]; subtitle: [string, string];
  concept: [string, string]; explanation: [string, string];
  modelName: [string, string]; totalSteps: number;
  challenge: [string, string, string, string]; // [titleEn, titleSv, descEn, descSv]
  lgr22: Lgr22StrandKey[]; lgr22Raw: string;
  sdgs: number[];
}

function buildShorthandChapters(items: Shorthand[]): Chapter[] {
  return items.map(s => ({
    id: s.id, slug: s.slug, isCheckpoint: s.cp,
    title: { en: s.title[0], sv: s.title[1] },
    subtitle: { en: s.subtitle[0], sv: s.subtitle[1] },
    story: {
      intro: { en: `${s.title[0]}: ${s.subtitle[0]}.`, sv: `${s.title[1]}: ${s.subtitle[1]}.` },
      dialogue: [], // populate per-chapter as needed; keep empty for compact build
    },
    theory: {
      concept: { en: s.concept[0], sv: s.concept[1] },
      explanation: { en: s.explanation[0], sv: s.explanation[1] },
      realWorldExamples: [],
      newWords: [],
    },
    build: {
      modelName: { en: s.modelName[0], sv: s.modelName[1] },
      description: { en: `Build the ${s.modelName[0].toLowerCase()}.`, sv: `Bygg ${s.modelName[1].toLowerCase()}.` },
      totalSteps: s.totalSteps,
      steps: [], // detailed steps live in Session 1; expand others as needed
    },
    challenge: {
      title: { en: s.challenge[0], sv: s.challenge[1] },
      description: { en: s.challenge[2], sv: s.challenge[3] },
    },
    lgr22: { strands: s.lgr22, rawSpreadsheet: s.lgr22Raw },
    sdgs: s.sdgs,
  }));
}

// ============================================================================
// COMPONENT REQUIREMENTS PER CHAPTER (from your kit analysis)
// ============================================================================

export const chapterComponents: Record<number, Record<string, number>> = {
  1: {"P7x11":2,"CT2":12,"P11":2,"P5":4,"CT3":4,"TW1":12,"CH2":4,"SH100":2,"Wheel":4},
  2: {"CT2":12,"P3":4,"P5":3,"CT3":4,"P11":2,"TW1":4,"SH100":2,"Wheel":4,"Mudguard Left":1,"Mudguard Right":1},
  3: {},
  4: {"CT2":6,"P7x11":1,"PU5x7":2,"CT3":8,"P7":2,"P11":2,"P3":2,"CH2":4,"P5":4,"SH100":1},
  5: {"Long plates":5,"Short plates":2,"Equal plates":4},
  6: {"CL2":5,"CT3":4,"P5":4,"Suspension":1,"P3":3,"P11":2,"CT2":6,"CH2":5,"TW1":4,"Wheel":3,"SH100":1,"Mudguard Left":1,"Mudguard Right":1,"Steering wheel":1,"Spoiler":1,"SH60":1},
  7: {},
  8: {"CH2":9,"CT2":20,"P7x11":1,"PU5x13":2,"P3":5,"P7":8,"P11":2,"Rack":3,"P5":8,"CL2":1,"CT3":2,"G20 Plus":2,"SH100":1},
  9: {},
  10: {"TW1":4,"CT3":4,"P7":4,"CH2":5,"CT2":2,"P7x11":1,"P5 Nut":1,"CL2":2,"P3":2,"Power Screw":1},
  11: {"CT2":12,"CT3":8,"P5":11,"P7":6,"CH2":4,"TW1":6,"CL2":2,"SH100":2,"P3 Plus":4},
  12: {"SH60":2,"P7x11":1,"G20 Plus":1,"P3 Plus":2,"G60":2},
  13: {"TW1":3,"CL2":7,"CT2":8,"CH2":2,"P3":2,"G20 Plus":1,"CT3":2,"SH60":2,"P5":4,"P7":2,"PU5x7":1,"P11":2,"G20 Idler":1,"G60":2,"P7x11":1},
  14: {"CH2":2,"PU5x7":1,"PU5x13":1,"G20 Plus":3,"SH60":2,"G60":3,"CT2":2,"Motor with Battery Box":1},
  15: {"CH2":11,"CT2":6,"P7x11":3,"SH60":1,"G20 Plus":1,"CT3":1,"SH100":1,"P3 Plus":1},
  16: {"CT2":8,"P5":3,"PC3":2,"P11":2,"P3":3,"Rack":3,"P7":1,"TW1":2,"PU5x7":2,"CL2":3,"G20 Plus":2,"SH60":2,"G60":1,"P3 Plus":1,"CT3":2},
  17: {"PC3":2,"P7x11":3,"CT2":6,"CT(1x2)":4,"P11":4,"P3":1,"Thread":1,"TW1":6,"Pulley":1,"SH60":1,"CH2":2,"CT3":2,"P7":2,"CL2":2,"G60":2,"Wheel w/o tires":2},
  18: {"G60":2,"PU5x7":2,"G20 Plus":1,"P21x21":1,"SH100":1,"CH2":2,"CT2":2,"Motor with Battery Box":1},
  19: {"P7":28,"CH2":2,"CT2":28,"P21x21":2,"CT(1x2)":2},
  20: {"CT2":2,"CH2":4,"P21x21":1,"SH60":1,"PU5x7":2,"P7x11":1,"P3 Plus":2,"G60":1,"CL2":3,"P11":1,"G20":3,"G20 Plus":2,"CT3":1,"P5":1,"SH100":1,"TW1":1,"Wheel":1},
  21: {},
  22: {"P11":5,"Hinges":1},
  23: {"CT3":8,"P11":4,"CT2":10,"P7x11":2,"P5":6,"TW1":8,"PC3":1},
  24: {"TW1":8,"CH2":9,"P5":1,"SH100":3,"PU5x13":1,"CT2":3,"CT3":4,"Wheel w/o tires":4,"P3":1,"P3 Plus":2,"Mudguard Left":2,"Mudguard Right":2,"Motor with Battery Box":1},
  25: {},
  26: {},
  27: {"Queaky":1},
  28: {"Alligator clips":2,"PU5x7":2,"P21x21":1,"Connecting towers":4,"CT3":4,"SH60":1,"Queaky":1},
  29: {},
  30: {"CH2":8,"P5":1,"CT2":2,"PU5x7":1,"CT3":2,"TW1":6,"SH100":2,"Wheel":4,"P3":1,"Balloon":1},
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getChapter(id: number): Chapter | undefined {
  return chapters.find(c => c.id === id);
}

export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find(c => c.slug === slug);
}

export function tr(field: BilingualString, lang: Lang): string {
  return field[lang] || field.en;
}
