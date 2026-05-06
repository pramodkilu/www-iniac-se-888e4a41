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

  // ─── Chapters 2–30: fully expanded ────────────────────────────────────────

  // Ch2
  {
    id: 2, slug: "aerodynamics-car", isCheckpoint: false,
    title: t("Aerodynamics Car", "Aerodynamisk bil"),
    subtitle: t("Build a fast, fuel-efficient car", "Bygg en snabb, bränsleeffektiv bil"),
    story: {
      intro: t("Laya, Kit and Rob spot a slow old truck puffing smoke on a steep hill. The driver looks worried.", "Laya, Kit och Rob ser en gammal långsam lastbil som puttar rök uppför en brant backe. Föraren ser orolig ut."),
      dialogue: [
        { speaker: "Driver", text: t("This old truck burns so much fuel going uphill. I can barely afford it!", "Den här gamla lastbilen bränner så mycket bränsle i backen. Jag har knappt råd!") },
        { speaker: "Laya",  text: t("The shape of a vehicle makes a huge difference. Flat fronts create lots of air resistance.", "Fordonets form gör stor skillnad. Platta fronter skapar mycket luftmotstånd.") },
        { speaker: "Kit",   text: t("Race cars have pointed noses and smooth curves to cut through air easily!", "Racerbilar har spetsiga nosar och mjuka kurvor för att lätt skära genom luften!") },
        { speaker: "Rob",   text: t("Let's build an aerodynamic car and show how a better shape saves energy.", "Vi bygger en aerodynamisk bil och visar hur en bättre form sparar energi.") },
      ],
      conclusion: t("The driver was amazed — a smooth shape really does travel further with less effort!", "Föraren blev förvånad — en slät form tar verkligen längre sträcka med mindre ansträngning!"),
    },
    theory: {
      concept: t("Air friction (Aerodynamics)", "Luftmotstånd (Aerodynamik)"),
      explanation: t("The faster we move, the more air resists our motion. Race cars and aeroplanes are designed to cut through air with the least resistance. Aerodynamics is the study of how objects move through air.", "Ju snabbare vi rör oss, desto mer motstår luften. Racerbilar och flygplan är formade för att skära genom luften med minst motstånd. Aerodynamik handlar om hur föremål rör sig genom luft."),
      realWorldExamples: [
        t("Racing cars have low, pointed noses to slice through air", "Racerbilar har låga, spetsiga nosar för att skära genom luft"),
        t("Birds tuck their wings to dive faster", "Fåglar fäller in vingarna för att dyka snabbare"),
        t("Cyclists crouch low on their bikes to reduce drag", "Cyklister sitter lågt på cykeln för att minska luftmotståndet"),
      ],
      newWords: [t("Aerodynamics", "Aerodynamik"), t("Drag", "Luftmotstånd"), t("Streamlined", "Strömlinjeformad"), t("Resistance", "Motstånd")],
    },
    build: {
      modelName: t("Aerodynamic Car", "Aerodynamisk bil"),
      description: t("Build a sleek, low-profile car with mudguards and smooth axles.", "Bygg en slank, lågprofilbil med stänkskärmar och smidiga axlar."),
      totalSteps: 10,
      steps: [
        { stepNumber: 1, title: t("Build the base frame", "Bygg basramen"), description: t("Place two P11 beams parallel and connect with CT2 at each end.", "Lägg två P11-balkar parallellt och anslut med CT2 i varje ände."), components: ["P11 x2", "CT2 x4"] },
        { stepNumber: 2, title: t("Add front connectors", "Lägg till frontanslutningar"), description: t("Attach CT3 pieces to the front corners of the frame.", "Fäst CT3-delar i framhörnen av ramen."), components: ["CT3 x2"] },
        { stepNumber: 3, title: t("Build rear connectors", "Bygg bakanslutningar"), description: t("Attach CT3 to the rear corners to mirror the front.", "Fäst CT3 i bakhörnen för att spegla framsidan."), components: ["CT3 x2"] },
        { stepNumber: 4, title: t("Add side struts", "Lägg till sidostöttor"), description: t("Connect P3 pieces along both sides for rigidity.", "Anslut P3-delar längs båda sidorna för styvhet."), components: ["P3 x4", "CT2 x4"] },
        { stepNumber: 5, title: t("Attach axle mounts", "Fäst axelhållare"), description: t("Press TW1 twist connectors onto each axle position.", "Tryck TW1-vridkopplingar på varje axelposition."), components: ["TW1 x4"] },
        { stepNumber: 6, title: t("Add side supports", "Lägg till sidostöd"), description: t("Reinforce each side with a P5 piece.", "Förstärk varje sida med en P5-bit."), components: ["P5 x3", "CT2 x4"] },
        { stepNumber: 7, title: t("Insert front axle", "Sätt in frontaxel"), description: t("Slide a SH100 shaft through the front TW1 mounts.", "Skjut en SH100-axel genom de främre TW1-hållarna."), components: ["SH100 x1"] },
        { stepNumber: 8, title: t("Insert rear axle", "Sätt in bakaxel"), description: t("Slide the second SH100 shaft through the rear mounts.", "Skjut den andra SH100-axeln genom de bakre hållarna."), components: ["SH100 x1"] },
        { stepNumber: 9, title: t("Mount all wheels", "Montera alla hjul"), description: t("Press a wheel onto each end of both axles.", "Tryck fast ett hjul i varje ände på båda axlarna."), components: ["Wheel x4"] },
        { stepNumber: 10, title: t("Add mudguards", "Lägg till stänkskärmar"), description: t("Clip the left and right mudguards over the rear wheels.", "Klicka fast vänster och höger stänkskärm över bakhjulen."), components: ["Mudguard Left x1", "Mudguard Right x1"] },
      ],
    },
    challenge: { title: t("Design Your Dream Car", "Designa din drömbil"), description: t("Draw a car for Laya and Kit. The road is good and the distance is long. What features make it fastest?", "Rita en bil för Laya och Kit. Vägen är bra och avståndet långt. Vilka egenskaper gör den snabbast?"), hint: t("Think about the front shape, roof height, and tyre width.", "Tänk på frontformen, takhöjden och däckbredden.") },
    lgr22: { strands: ["fys_kraft"], rawSpreadsheet: "Lgr22 1–3: Fysik – Kraft & rörelse" },
    sdgs: [7, 9, 13],
  },

  // Ch3
  {
    id: 3, slug: "challenge-ladder", isCheckpoint: true,
    title: t("Challenge: Ladder", "Utmaning: Stege"),
    subtitle: t("Rescue a cat stuck high in a tree", "Rädda en katt som sitter högt i ett träd"),
    story: {
      intro: t("A cat is stranded high in a tree! Rob calculates the rescue ladder must be exactly 18 holes long.", "En katt sitter fast högt i ett träd! Rob räknar ut att räddningsstegen måste vara exakt 18 hål lång."),
      dialogue: [
        { speaker: "Rob",      text: t("My calculation says the ladder must be exactly 18 holes. Not 17, not 19!", "Min uträkning säger att stegen måste vara exakt 18 hål. Inte 17, inte 19!") },
        { speaker: "Laya",     text: t("We have P3, P5, P7, and P11 pieces. Can we combine them to reach 18?", "Vi har P3-, P5-, P7- och P11-bitar. Kan vi kombinera dem för att nå 18?") },
        { speaker: "Kit",      text: t("P11 + P7 = 18! But wait — P5 + P5 + P5 + P3 = 18 too!", "P11 + P7 = 18! Men vänta — P5 + P5 + P5 + P3 = 18 också!") },
        { speaker: "Narrator", text: t("There are many ways to reach 18 — the cat is saved!", "Det finns många sätt att nå 18 — katten är räddad!") },
      ],
      conclusion: t("The cat purrs safely on the ground — maths saves the day!", "Katten spinner tryggt på marken — matematiken räddar dagen!"),
    },
    theory: {
      concept: t("Sequencing & decoding (Checkpoint)", "Sekvenser & avkodning (Avstämning)"),
      explanation: t("Rob's calculation says the ladder must be exactly 18 holes long. This is a problem-solving challenge — combine P3, P5, P7 and P11 plates to reach exactly 18 holes.", "Robs uträkning säger att stegen måste vara exakt 18 hål lång. Det här är en problemlösningsutmaning — kombinera P3-, P5-, P7- och P11-plattor för att nå exakt 18 hål."),
      realWorldExamples: [
        t("Builders use standard plank sizes to reach exact heights", "Byggare använder standardstorlekar för att nå exakta höjder"),
        t("Recipes combine exact amounts to make the right quantity", "Recept kombinerar exakta mängder för att nå rätt mängd"),
        t("Computer code uses sequences of steps to solve problems", "Datorkod använder sekvenser av steg för att lösa problem"),
      ],
      newWords: [t("Sequence", "Sekvens"), t("Combination", "Kombination"), t("Algorithm", "Algoritm")],
    },
    build: {
      modelName: t("18-Hole Ladder", "Stege med 18 hål"),
      description: t("Combine Blix beams to build a ladder that is exactly 18 holes long.", "Kombinera Blix-balkar för att bygga en stege som är exakt 18 hål lång."),
      totalSteps: 1,
      steps: [
        { stepNumber: 1, title: t("Build the 18-hole ladder", "Bygg stegen med 18 hål"), description: t("Find a combination of P3, P5, P7 and P11 pieces that totals exactly 18 holes. Try more than one solution!", "Hitta en kombination av P3-, P5-, P7- och P11-bitar som totalt ger exakt 18 hål. Prova mer än en lösning!"), components: ["P3 x1", "P5 x1", "P7 x1", "P11 x1"] },
      ],
    },
    challenge: { title: t("The 18-Hole Rule", "18-hålsregeln"), description: t("Build a ladder exactly 18 holes long. Find more than one combination!", "Bygg en stege som är exakt 18 hål lång. Hitta mer än en kombination!"), hint: t("List all combinations: which ones use the fewest pieces?", "Lista alla kombinationer: vilka använder färst bitar?") },
    lgr22: { strands: ["prog"], rawSpreadsheet: "Lgr22 1–3: Programmering – Algoritmer, logik & digitala system" },
    sdgs: [4, 15],
  },

  // Ch4
  {
    id: 4, slug: "trebuchet", isCheckpoint: false,
    title: t("Trebuchet", "Trebuchet"),
    subtitle: t("Launch Rob across the valley", "Skjut Rob över dalen"),
    story: {
      intro: t("The team reaches a wide valley. There is no bridge — Rob has an idea involving a very big lever.", "Laget når en bred dal. Det finns ingen bro — Rob har en idé med en mycket stor hävstång."),
      dialogue: [
        { speaker: "Rob",  text: t("A trebuchet uses a lever and counterweight to launch objects. I'll fly across!", "En trebuchet använder hävstång och motvikt för att skjuta föremål. Jag flyger över!") },
        { speaker: "Laya", text: t("The heavy side falls down — that makes the long arm swing up and launch you!", "Den tunga sidan faller ner — det gör att den långa armen svänger upp och skjuter dig!") },
        { speaker: "Kit",  text: t("Castles used trebuchets to throw heavy rocks at walls. Much more powerful than a catapult.", "Slott använde trebuchets för att kasta tunga stenar mot murar. Mycket kraftfullare än en katapult.") },
        { speaker: "Rob",  text: t("Ready! On three… one… two… WHEEE!", "Klar! På tre… ett… två… WEEEE!") },
      ],
      conclusion: t("Rob lands safely on the other side — physics is amazing!", "Rob landar säkert på andra sidan — fysik är fantastiskt!"),
    },
    theory: {
      concept: t("Action & reaction (Levers)", "Verkan & reaktion (Hävstänger)"),
      explanation: t("A trebuchet uses a lever and counterweight to throw heavy objects. When the heavy end falls, the long arm swings up and launches the projectile in a parabolic path.", "En trebuchet använder hävstång och motvikt för att kasta tunga föremål. När den tunga änden faller, svingar den långa armen upp och skjuter projektilen i en parabelbana."),
      realWorldExamples: [
        t("A see-saw is a simple lever — the heavy end goes down", "En gungbräda är en enkel hävstång — den tunga änden går ner"),
        t("A bottle opener uses a lever to pop caps with little force", "En flasköppnare använder hävstång för att popa kapsyler med lite kraft"),
        t("Cranes use counterweights to lift heavy loads safely", "Kranar använder motvikter för att lyfta tunga laster säkert"),
      ],
      newWords: [t("Lever", "Hävstång"), t("Counterweight", "Motvikt"), t("Pivot", "Stödpunkt"), t("Projectile", "Projektil")],
    },
    build: {
      modelName: t("Trebuchet", "Trebuchet"),
      description: t("Build a working trebuchet with a pivot arm and counterweight.", "Bygg en fungerande trebuchet med en pivotarm och motvikt."),
      totalSteps: 10,
      steps: [
        { stepNumber: 1, title: t("Build the base", "Bygg basen"), description: t("Lay two P11 beams flat and join them with CT2 at each end.", "Lägg två P11-balkar platt och foga ihop dem med CT2 i varje ände."), components: ["P11 x2", "CT2 x4"] },
        { stepNumber: 2, title: t("Build the side towers", "Bygg sidotornen"), description: t("Attach P7 beams vertically at each end of the base.", "Fäst P7-balkar vertikalt i varje ände av basen."), components: ["P7 x2", "CT3 x4"] },
        { stepNumber: 3, title: t("Add U-pillar supports", "Lägg till U-pelare"), description: t("Insert PU5x7 pillars inside each tower for stability.", "Sätt in PU5x7-pelare inuti varje torn för stabilitet."), components: ["PU5x7 x2", "CT3 x2"] },
        { stepNumber: 4, title: t("Connect tower tops", "Anslut tornens topp"), description: t("Bridge the two towers with CH2 connectors at the top.", "Brygga de två tornen med CH2-kopplingar högst upp."), components: ["CH2 x2", "CT3 x2"] },
        { stepNumber: 5, title: t("Assemble the pivot arm", "Montera pivotarmen"), description: t("Take the P7x11 U-pillar and lay it as the throwing arm.", "Ta P7x11-U-pelaren och lägg den som kastarm."), components: ["P7x11 x1"] },
        { stepNumber: 6, title: t("Mount the pivot shaft", "Montera pivotaxeln"), description: t("Slide SH100 through the arm centre and CH2 on each side.", "Skjut SH100 genom armens centrum och CH2 på varje sida."), components: ["SH100 x1", "CH2 x2"] },
        { stepNumber: 7, title: t("Attach the arm supports", "Fäst armstöden"), description: t("Add CT2 and P5 to reinforce the arm on both sides.", "Lägg till CT2 och P5 för att förstärka armen på båda sidor."), components: ["CT2 x2", "P5 x2"] },
        { stepNumber: 8, title: t("Build the sling guide", "Bygg slungguiden"), description: t("Add P5 pieces at the tip of the throwing arm.", "Lägg till P5-bitar vid spetsen av kastarmen."), components: ["P5 x2"] },
        { stepNumber: 9, title: t("Add arm stops", "Lägg till armstopp"), description: t("Clip P3 pieces as stops to limit arm travel.", "Klicka fast P3-bitar som stopp för att begränsa armens rörelse."), components: ["P3 x2"] },
        { stepNumber: 10, title: t("Test and balance", "Testa och balansera"), description: t("Pull the short arm down and release. Adjust the counterweight position for best launch.", "Dra ner den korta armen och släpp. Justera motviktens position för bästa kast."), components: [] },
      ],
    },
    challenge: { title: t("Bring Rob Back", "Hämta tillbaka Rob"), description: t("How will you bring Rob back? Think about ropes and pulleys.", "Hur ska du hämta tillbaka Rob? Tänk på rep och block."), hint: t("A pulley reverses the direction of force — pull down to lift up!", "Ett block vänder kraftens riktning — dra ner för att lyfta upp!") },
    lgr22: { strands: ["tva"], rawSpreadsheet: "Lgr22 1–3: Tvärvetenskapligt arbetsområde" },
    sdgs: [4, 9],
  },

  // Ch5
  {
    id: 5, slug: "sign-board", isCheckpoint: false,
    title: t("Sign Board", "Skyltbräda"),
    subtitle: t("Communicate using shapes", "Kommunicera med former"),
    story: {
      intro: t("The team arrives at a crossroads in the middle of nowhere. A confused farmer needs directions but speaks a different language.", "Laget kommer till en vägkorsning i mitten av ingenstans. En förvirrad bonde behöver vägvisning men talar ett annat språk."),
      dialogue: [
        { speaker: "Farmer", text: t("I need to find the market but I cannot read the signs here!", "Jag måste hitta marknaden men kan inte läsa skyltarna här!") },
        { speaker: "Laya",   text: t("Shapes work in any language — a triangle always means warning, a circle means rule!", "Former fungerar på alla språk — en triangel betyder alltid varning, en cirkel betyder regel!") },
        { speaker: "Kit",    text: t("Traffic signs use shapes so everyone understands, even without words.", "Trafikskyltar använder former så alla förstår, även utan ord.") },
        { speaker: "Rob",    text: t("Let's build a sign board with shapes the farmer can recognise.", "Vi bygger en skylt med former som bonden kan känna igen.") },
      ],
      conclusion: t("The farmer finds the market — shapes really are a universal language!", "Bonden hittar marknaden — former är verkligen ett universellt språk!"),
    },
    theory: {
      concept: t("Coding & decoding (Visual signals)", "Kodning & avkodning (Visuella signaler)"),
      explanation: t("When sound doesn't work, shapes can carry meaning. Triangle, rectangle, square — anyone can recognise a shape, no matter their language. This is the basis of sign language and traffic signs.", "När ljud inte fungerar kan former bära mening. Triangel, rektangel, kvadrat — vem som helst kan känna igen en form, oavsett språk. Det här är grunden för teckenspråk och trafikskyltar."),
      realWorldExamples: [
        t("Traffic signs use shapes: triangles for warning, circles for rules", "Trafikskyltar använder former: trianglar för varning, cirklar för regler"),
        t("Airport symbols help travellers who speak any language", "Flygplatssymboler hjälper resenärer som talar vilket språk som helst"),
        t("Emoji are modern picture symbols understood worldwide", "Emoji är moderna bildsymboler som förstås världen över"),
      ],
      newWords: [t("Symbol", "Symbol"), t("Decode", "Avkoda"), t("Signal", "Signal"), t("Pattern", "Mönster")],
    },
    build: {
      modelName: t("Shape Sign Boards", "Formskyltar"),
      description: t("Build three sign boards using different plate combinations.", "Bygg tre skyltar med olika platkombinationer."),
      totalSteps: 3,
      steps: [
        { stepNumber: 1, title: t("Build the tall sign post", "Bygg den höga skyltstolpen"), description: t("Stack five long plates end-to-end to form the tall sign pole.", "Stapla fem långa plattor ände-till-ände för att forma den höga skyltstolpen."), components: ["Long plates x5"] },
        { stepNumber: 2, title: t("Add horizontal cross bars", "Lägg till horisontella tvärbalkar"), description: t("Attach two short plates across the pole to form sign arms.", "Fäst två korta plattor tvärs över stolpen för att forma skyltstammar."), components: ["Short plates x2"] },
        { stepNumber: 3, title: t("Mount the sign faces", "Montera skyltytorna"), description: t("Clip four equal plates onto the arms as the sign display surfaces.", "Klicka fast fyra lika plattor på armarna som skyltens visningssidor."), components: ["Equal plates x4"] },
      ],
    },
    challenge: { title: t("Design Your Own Sign", "Designa din egen skylt"), description: t("Invent a new road sign using only shapes. What does it mean?", "Uppfinn en ny vägskylt med enbart former. Vad betyder den?"), hint: t("Use triangles for danger, circles for must-do, squares for information.", "Använd trianglar för fara, cirklar för måste-göra, kvadrater för information.") },
    lgr22: { strands: ["prog"], rawSpreadsheet: "Lgr22 1–3: Programmering – Algoritmer, logik & digitala system" },
    sdgs: [4, 11],
  },

  // Ch6
  {
    id: 6, slug: "suspension-car", isCheckpoint: false,
    title: t("All-Terrain Suspension Car", "Terrängbil med fjädring"),
    subtitle: t("Drive over rocky roads without breaking", "Kör på steniga vägar utan att gå sönder"),
    story: {
      intro: t("The path to the North Pole turns bumpy and rocky. Kit needs a car that won't fall apart on rough terrain.", "Vägen mot Nordpolen blir ojämn och stenig. Kit behöver en bil som inte faller isär på ojämnt underlag."),
      dialogue: [
        { speaker: "Kit",  text: t("Every bump feels like I'm going to fall off! We need suspension.", "Varje gupp känns som att jag ska ramla av! Vi behöver fjädring.") },
        { speaker: "Rob",  text: t("Suspension absorbs bumps so the passengers stay smooth even on rough roads.", "Fjädring absorberar gupp så att passagerarna förblir jämna även på ojämna vägar.") },
        { speaker: "Laya", text: t("Mountain bikes, jeeps, and trucks all use suspension. It's essential for rough terrain.", "Mountainbikes, jeepbilar och lastbilar använder alla fjädring. Det är viktigt för ojämnt underlag.") },
        { speaker: "Kit",  text: t("Let's add a suspension piece and a spoiler — style AND function!", "Vi lägger till ett fjädringshjälpmedel och en spoiler — stil OCH funktion!") },
      ],
      conclusion: t("The suspension car rolls smoothly over every rock — the North Pole is closer now!", "Terrängbilen rullar mjukt över varje sten — Nordpolen är nu närmre!"),
    },
    theory: {
      concept: t("Suspension & friction (Terrain engineering)", "Fjädring & friktion (Terrängkonstruktion)"),
      explanation: t("Suspension systems use springs or flexible parts to absorb bumps. Without suspension, every rock sends a shockwave through the whole vehicle. With it, the wheels move up and down while the body stays level.", "Fjädringssystem använder fjädrar eller flexibla delar för att absorbera gupp. Utan fjädring skickar varje sten en chockvåg genom hela fordonet. Med fjädring rör sig hjulen upp och ner medan kroppen förblir jämn."),
      realWorldExamples: [
        t("Mountain bikes have front forks with suspension for rocky trails", "Mountainbikes har framgafflar med fjädring för steniga stigar"),
        t("Car shock absorbers keep the ride smooth on bumpy roads", "Bil-stötdämpare håller körningen jämn på ojämna vägar"),
        t("Pogo sticks store energy in a spring and release it to bounce", "Pogo-pinnar lagrar energi i en fjäder och frigör den för att studsa"),
      ],
      newWords: [t("Suspension", "Fjädring"), t("Shock absorber", "Stötdämpare"), t("Terrain", "Terräng"), t("Stability", "Stabilitet")],
    },
    build: {
      modelName: t("All-Terrain Suspension Car", "Terrängbil med fjädring"),
      description: t("Build a car with suspension, steering, and a spoiler for rough terrain.", "Bygg en bil med fjädring, styrning och spoiler för ojämnt underlag."),
      totalSteps: 12,
      steps: [
        { stepNumber: 1,  title: t("Build the main chassis", "Bygg huvudchassit"), description: t("Place two P11 beams parallel. Join with CT2 at both ends.", "Lägg två P11-balkar parallellt. Foga ihop med CT2 i båda ändar."), components: ["P11 x2", "CT2 x4"] },
        { stepNumber: 2,  title: t("Add front frame", "Lägg till frontram"), description: t("Attach P3 beams and CL2 connectors to form the front section.", "Fäst P3-balkar och CL2-kopplingar för att forma frontsektionen."), components: ["P3 x2", "CL2 x2"] },
        { stepNumber: 3,  title: t("Build rear section", "Bygg baksektion"), description: t("Add CT3 and CT2 connectors at the rear.", "Lägg till CT3 och CT2-kopplingar baktill."), components: ["CT3 x2", "CT2 x2"] },
        { stepNumber: 4,  title: t("Add corner connectors", "Lägg till hörnkopplingar"), description: t("Press CH2 connectors at all four frame corners.", "Tryck CH2-kopplingar på alla fyra ramhörnen."), components: ["CH2 x4", "CL2 x2"] },
        { stepNumber: 5,  title: t("Mount axle holders", "Montera axelhållare"), description: t("Click TW1 twist connectors onto the axle positions.", "Klicka TW1-vridkopplingar på axelpositionerna."), components: ["TW1 x4"] },
        { stepNumber: 6,  title: t("Install front axle", "Installera frontaxeln"), description: t("Slide the SH60 shaft through the front TW1 holders.", "Skjut SH60-axeln genom de främre TW1-hållarna."), components: ["SH60 x1"] },
        { stepNumber: 7,  title: t("Install rear axle", "Installera bakaxeln"), description: t("Slide the SH100 shaft through the rear TW1 holders.", "Skjut SH100-axeln genom de bakre TW1-hållarna."), components: ["SH100 x1"] },
        { stepNumber: 8,  title: t("Attach wheels", "Fäst hjulen"), description: t("Press three wheels onto the axle ends.", "Tryck tre hjul på axelns ändar."), components: ["Wheel x3"] },
        { stepNumber: 9,  title: t("Mount the suspension", "Montera fjädringen"), description: t("Clip the suspension piece under the chassis and add P5 supports.", "Klicka fast fjädringsenheten under chassit och lägg till P5-stöd."), components: ["Suspension x1", "P5 x2", "CH2 x1"] },
        { stepNumber: 10, title: t("Add mudguards", "Lägg till stänkskärmar"), description: t("Attach the left and right mudguards over the rear wheels.", "Fäst vänster och höger stänkskärm över bakhjulen."), components: ["Mudguard Left x1", "Mudguard Right x1"] },
        { stepNumber: 11, title: t("Attach steering wheel", "Fäst ratten"), description: t("Connect the steering wheel with CL2 and CT3 to the front.", "Anslut ratten med CL2 och CT3 till fronten."), components: ["Steering wheel x1", "CL2 x1", "CT3 x2", "P3 x1"] },
        { stepNumber: 12, title: t("Add spoiler", "Lägg till spoiler"), description: t("Clip the spoiler onto the rear with P5 supports.", "Klicka fast spoilern baktill med P5-stöd."), components: ["Spoiler x1", "P5 x2"] },
      ],
    },
    challenge: { title: t("Bumpy Road Test", "Ojämnt vägtest"), description: t("Build a ramp with books and test if your car makes it over without tipping.", "Bygg en ramp med böcker och testa om din bil klarar sig utan att välta."), hint: t("Lower centre of gravity = more stable. Can you lower the body?", "Lägre tyngdpunkt = mer stabil. Kan du sänka kroppen?") },
    lgr22: { strands: ["tek_mek", "fys_kraft"], rawSpreadsheet: "Lgr22 1–3: Teknik – Mekanismer & konstruktioner; Fysik – Kraft & rörelse" },
    sdgs: [9, 11],
  },

  // Ch7
  {
    id: 7, slug: "stable-tower", isCheckpoint: true,
    title: t("Stable Tower", "Stabilt torn"),
    subtitle: t("Build the tallest tower that won't fall", "Bygg det högsta tornet som inte faller"),
    story: {
      intro: t("The team reaches a windy plateau. Whoever builds the tallest standing tower wins a head-start to the North Pole!", "Laget når ett blåsigt platå. Den som bygger det högsta stående tornet får ett försprång till Nordpolen!"),
      dialogue: [
        { speaker: "Rob",      text: t("The key to a tall tower is a wide base — like a pyramid!", "Nyckeln till ett högt torn är en bred bas — som en pyramid!") },
        { speaker: "Kit",      text: t("Triangles are the strongest shape. Bridges use triangles everywhere.", "Trianglar är den starkaste formen. Broar använder trianglar överallt.") },
        { speaker: "Laya",     text: t("I'll try using all my P7x11 pillars as the base and stack up from there.", "Jag provar att använda alla mina P7x11-pelare som bas och staplar därifrån.") },
        { speaker: "Narrator", text: t("Who will build the tallest stable tower? It's a checkpoint challenge!", "Vem bygger det högsta stabila tornet? Det är en checkpointutmaning!") },
      ],
      conclusion: t("Every tower tells a story about balance, structure and gravity!", "Varje torn berättar en historia om balans, struktur och gravitation!"),
    },
    theory: {
      concept: t("Structural stability (Checkpoint)", "Strukturell stabilitet (Avstämning)"),
      explanation: t("Taller structures are less stable because their centre of gravity is higher. A wide base lowers the centre of gravity and prevents tipping. Triangles distribute forces evenly — that's why engineers use them everywhere.", "Högre strukturer är mindre stabila eftersom deras tyngdpunkt är högre. En bred bas sänker tyngdpunkten och förhindrar välting. Trianglar fördelar krafter jämnt — det är därför ingenjörer använder dem överallt."),
      realWorldExamples: [
        t("The Eiffel Tower has a very wide base to stay stable", "Eiffeltornet har en mycket bred bas för att förbli stabilt"),
        t("Egyptian pyramids are the most stable shape ever built", "Egyptiska pyramider är den stabilaste formen som någonsin byggts"),
        t("Tripods (three legs) never wobble because triangles are rigid", "Stativ (tre ben) skakar aldrig eftersom trianglar är stela"),
      ],
      newWords: [t("Stability", "Stabilitet"), t("Centre of gravity", "Tyngdpunkt"), t("Triangle", "Triangel"), t("Structure", "Struktur")],
    },
    build: {
      modelName: t("Stable Tower", "Stabilt torn"),
      description: t("Use all available pieces to build the tallest free-standing tower.", "Använd alla tillgängliga bitar för att bygga det högsta fristående tornet."),
      totalSteps: 1,
      steps: [
        { stepNumber: 1, title: t("Build your tallest stable tower", "Bygg ditt högsta stabila torn"), description: t("Use any combination of pieces. Start with a wide base and taper as you go up. Must stand on its own for 10 seconds!", "Använd vilken kombination av bitar som helst. Börja med en bred bas och avsmalna uppåt. Måste stå självständigt i 10 sekunder!"), components: ["P7x11 x2", "P11 x2", "CT2 x4", "CT3 x4"] },
      ],
    },
    challenge: { title: t("Tower Height Record", "Tornhöjdsrekord"), description: t("Measure your tower in Blix holes. Can you beat 30 holes tall?", "Mät ditt torn i Blix-hål. Kan du slå 30 hål högt?"), hint: t("Add cross-bracing (diagonal pieces) to resist side forces.", "Lägg till korsförband (diagonala bitar) för att motstå sidokrafter.") },
    lgr22: { strands: ["tek_mek", "tek_design"], rawSpreadsheet: "Lgr22 1–3: Teknik – Mekanismer & konstruktioner; Teknik – Designprocess & modeller" },
    sdgs: [4, 9, 11],
  },

  // Ch8
  {
    id: 8, slug: "rack-pinion-lift", isCheckpoint: false,
    title: t("Rack-and-Pinion Lift", "Hiss med kuggstång"),
    subtitle: t("Lift heavy loads with a gear and rack", "Lyft tunga laster med kugge och kuggstång"),
    story: {
      intro: t("A man at a building site struggles to lift heavy materials to the upper floor. The team spots a clever solution.", "En man på en byggplats kämpar med att lyfta tungt material till övervåningen. Laget ser en smart lösning."),
      dialogue: [
        { speaker: "Man",  text: t("My arms are aching — I've been lifting boxes all day!", "Mina armar värker — jag har lyft lådor hela dagen!") },
        { speaker: "Laya", text: t("A rack and pinion converts rotation into straight-line movement — like a lift!", "En kuggstång omvandlar rotation till rätlinjig rörelse — som en hiss!") },
        { speaker: "Kit",  text: t("The small gear (pinion) turns against the rack's teeth, pushing it up and down.", "Det lilla kugghjulet (drevet) vrids mot kuggstångens tänder och driver den upp och ner.") },
        { speaker: "Rob",  text: t("Car steering racks, elevators and even dentist chairs use this mechanism!", "Bilar styrväxlar, hissar och till och med tandläkarstolar använder denna mekanism!") },
      ],
      conclusion: t("The lift works perfectly — no more aching arms at the building site!", "Hissen fungerar perfekt — inga mer värkande armar på byggplatsen!"),
    },
    theory: {
      concept: t("Rack & pinion mechanism", "Kuggstångsmekanism"),
      explanation: t("A rack is a flat strip of teeth. A pinion is a small circular gear. When the pinion rotates, its teeth push against the rack's teeth, converting rotation into linear (straight-line) motion. This is how car steering and many lifts work.", "En kuggstång är en platt remsa med tänder. Ett drev är ett litet runt kugghjul. När drevet roterar trycker dess tänder mot kuggstångens tänder och omvandlar rotation till linjär (rätlinjig) rörelse. Så fungerar bilarnas styrning och många hissar."),
      realWorldExamples: [
        t("Car steering converts steering wheel rotation into wheel turning", "Bilstyrning omvandlar rattrotation till hjulvridning"),
        t("Elevator mechanisms use rack and pinion to move cabins", "Hissmekanismer använder kuggstång för att röra hissburen"),
        t("A clock uses gears and racks to move clock hands precisely", "En klocka använder kugghjul och kuggstänger för att precisionsröra visarna"),
      ],
      newWords: [t("Rack", "Kuggstång"), t("Pinion", "Drev"), t("Linear motion", "Linjär rörelse"), t("Gear teeth", "Kuggtänder")],
    },
    build: {
      modelName: t("Rack-and-Pinion Lift", "Hiss med kuggstång"),
      description: t("Build a tall lift frame with a rack and pinion mechanism that raises a platform.", "Bygg en hög hissram med en kuggstångsmekanism som lyfter en plattform."),
      totalSteps: 15,
      steps: [
        { stepNumber: 1,  title: t("Build the base frame", "Bygg basramen"), description: t("Lay two P11 beams and join with CT2 to form the base.", "Lägg två P11-balkar och foga ihop med CT2 för att forma basen."), components: ["P11 x2", "CT2 x6"] },
        { stepNumber: 2,  title: t("Build the left column", "Bygg vänster pelare"), description: t("Stack P7 beams vertically on the left side with CT2.", "Stapla P7-balkar vertikalt på vänster sida med CT2."), components: ["P7 x4", "CT2 x4"] },
        { stepNumber: 3,  title: t("Build the right column", "Bygg höger pelare"), description: t("Mirror the left column on the right side.", "Spegla den vänstra pelaren på höger sida."), components: ["P7 x4", "CT2 x4"] },
        { stepNumber: 4,  title: t("Add U-pillar supports", "Lägg till U-pelarpelare"), description: t("Insert PU5x13 pillars inside each column for rigidity.", "Sätt in PU5x13-pelare inuti varje pelare för styvhet."), components: ["PU5x13 x2", "CH2 x2"] },
        { stepNumber: 5,  title: t("Connect the column tops", "Anslut pelarnas toppar"), description: t("Bridge the tops with P5 beams and CH2 connectors.", "Brygga topparna med P5-balkar och CH2-kopplingar."), components: ["P5 x4", "CH2 x2"] },
        { stepNumber: 6,  title: t("Add horizontal braces", "Lägg till horisontella förband"), description: t("Attach P3 beams across the middle for stability.", "Fäst P3-balkar tvärs mittendelen för stabilitet."), components: ["P3 x2", "CT2 x2"] },
        { stepNumber: 7,  title: t("Mount the rack guides", "Montera kuggstångsguiderna"), description: t("Attach CH2 connectors where the rack will slide.", "Fäst CH2-kopplingar där kuggstången ska glida."), components: ["CH2 x2", "CT3 x2"] },
        { stepNumber: 8,  title: t("Insert the rack rails", "Sätt in kuggstångskarvorna"), description: t("Slide three Rack pieces end-to-end in the guide channel.", "Skjut tre kuggstångsbitar ände-till-ände i guidekanalerna."), components: ["Rack x3"] },
        { stepNumber: 9,  title: t("Install the drive shaft", "Installera drivaxeln"), description: t("Thread SH100 horizontally through the P7x11 pillar.", "Trä SH100 horisontellt genom P7x11-pelaren."), components: ["SH100 x1", "P7x11 x1"] },
        { stepNumber: 10, title: t("Mount the pinion gears", "Montera drevkugghjulen"), description: t("Press G20 Plus gears onto the drive shaft to mesh with the rack.", "Tryck G20 Plus-kugghjul på drivaxeln för att gripa in i kuggstången."), components: ["G20 Plus x2"] },
        { stepNumber: 11, title: t("Add side supports", "Lägg till sidostöd"), description: t("Reinforce both sides with P5 beams and CL2 connector.", "Förstärk båda sidor med P5-balkar och CL2-koppling."), components: ["P5 x4", "CL2 x1"] },
        { stepNumber: 12, title: t("Reinforce the columns", "Förstärk pelarna"), description: t("Add P3 pieces to stiffen the lower columns.", "Lägg till P3-bitar för att styva upp de nedre pelarna."), components: ["P3 x3"] },
        { stepNumber: 13, title: t("Add upper connectors", "Lägg till övre kopplingar"), description: t("Attach remaining CH2 connectors at the top for a clean finish.", "Fäst återstående CH2-kopplingar högst upp för en snygg avslutning."), components: ["CH2 x3", "CT2 x4"] },
        { stepNumber: 14, title: t("Assemble the lift platform", "Montera hissplattformen"), description: t("Clip a flat plate onto the rack as the cargo platform.", "Klicka fast en flat platta på kuggstången som lastplattform."), components: ["P5 x2"] },
        { stepNumber: 15, title: t("Test the lift", "Testa hissen"), description: t("Turn the drive shaft. Does the platform rise smoothly? Place a small load on it!", "Vrid drivaxeln. Stiger plattformen jämnt? Placera en liten last på den!"), components: [] },
      ],
    },
    challenge: { title: t("Gear Ratio Challenge", "Kugghjulsförhållande-utmaning"), description: t("Replace G20 with G60. Does the platform rise faster or slower? Why?", "Ersätt G20 med G60. Stiger plattformen snabbare eller långsammare? Varför?"), hint: t("Bigger gear = more turns needed = slower but stronger lift.", "Större kugghjul = fler varv behövs = långsammare men starkare lyft.") },
    lgr22: { strands: ["tek_mek"], rawSpreadsheet: "Lgr22 1–3: Teknik – Mekanismer & konstruktioner" },
    sdgs: [9, 11],
  },

  // Ch9
  {
    id: 9, slug: "collection-challenge", isCheckpoint: true,
    title: t("300-Hole Collection", "300-hålssamling"),
    subtitle: t("Sort and count your Blix pieces", "Sortera och räkna dina Blix-bitar"),
    story: {
      intro: t("After so many builds the pieces are scattered everywhere! This checkpoint is about organising and counting.", "Efter så många byggen är bitarna spridda överallt! Den här checkpointen handlar om att organisera och räkna."),
      dialogue: [
        { speaker: "Rob",      text: t("If we count all the holes in all our pieces, can we reach 300?", "Om vi räknar alla hål i alla våra bitar, kan vi nå 300?") },
        { speaker: "Kit",      text: t("P3 has 3 holes, P5 has 5… this is going to take some real maths!", "P3 har 3 hål, P5 har 5… det här kräver lite riktig matematik!") },
        { speaker: "Laya",     text: t("Sorting first makes counting easier — group by piece type.", "Att sortera först gör det lättare att räkna — gruppera efter bittyp.") },
        { speaker: "Narrator", text: t("Sorting is the first step in data organisation — just like a computer!", "Sortering är det första steget i dataorganisation — precis som en dator!") },
      ],
      conclusion: t("Sorted, counted and ready — data skills are life skills!", "Sorterade, räknade och klara — datakunskaper är livskunskaper!"),
    },
    theory: {
      concept: t("Counting & data sorting (Checkpoint)", "Räkning & datasortering (Avstämning)"),
      explanation: t("Sorting means grouping similar things together. Counting means knowing how many there are. Computers sort and count billions of items per second — but the idea is the same as sorting your Blix pieces!", "Sortering innebär att gruppera liknande saker. Räkning innebär att veta hur många det finns. Datorer sorterar och räknar miljarder föremål per sekund — men idén är densamma som att sortera dina Blix-bitar!"),
      realWorldExamples: [
        t("Supermarkets sort products by type so customers find them fast", "Snabbköp sorterar varor efter typ så kunderna hittar dem snabbt"),
        t("Libraries sort books by subject and author name", "Bibliotek sorterar böcker efter ämne och författarnamn"),
        t("Apps sort your photos by date automatically", "Appar sorterar dina foton efter datum automatiskt"),
      ],
      newWords: [t("Sort", "Sortera"), t("Data", "Data"), t("Count", "Räkna"), t("Organise", "Organisera")],
    },
    build: {
      modelName: t("300-Hole Collection", "300-hålssamling"),
      description: t("Sort all pieces by type, count the total holes, and reach 300.", "Sortera alla bitar efter typ, räkna de totala hålen och nå 300."),
      totalSteps: 1,
      steps: [
        { stepNumber: 1, title: t("Sort, count and total your pieces", "Sortera, räkna och summera dina bitar"), description: t("Group all Blix pieces by type. Count the holes in each group. Add them all up — can you reach 300 total holes?", "Gruppera alla Blix-bitar efter typ. Räkna hålen i varje grupp. Lägg ihop dem alla — kan du nå 300 totala hål?"), components: ["P3 x4", "P5 x4", "P7 x4", "P11 x4"] },
      ],
    },
    challenge: { title: t("Beat 300 Holes!", "Slå 300 hål!"), description: t("Can you arrange pieces to total more than 300 holes? Draw your arrangement.", "Kan du arrangera bitar för att totalt nå mer än 300 hål? Rita din arrangement."), hint: t("More P11 pieces = more holes. Count in groups to go faster.", "Fler P11-bitar = fler hål. Räkna i grupper för att gå snabbare.") },
    lgr22: { strands: ["mat_tal"], rawSpreadsheet: "Lgr22 1–3: Matematik – Taluppfattning" },
    sdgs: [4],
  },

  // Ch10
  {
    id: 10, slug: "car-jack", isCheckpoint: false,
    title: t("Car Jack", "Domkraft"),
    subtitle: t("Lift a car with a power screw", "Lyft en bil med en kraftskruv"),
    story: {
      intro: t("A driver has a flat tyre but no way to lift the car. The team knows exactly what to do.", "En förare har ett punkterat däck men inget sätt att lyfta bilen. Laget vet precis vad man ska göra."),
      dialogue: [
        { speaker: "Driver", text: t("My tyre is flat but the car is too heavy to lift by hand!", "Mitt däck är punkterat men bilen är för tung att lyfta för hand!") },
        { speaker: "Laya",   text: t("A screw is a ramp wrapped around a cylinder. Turning it a little lifts a lot!", "En skruv är en ramp lindat runt en cylinder. Att vrida lite lyfter mycket!") },
        { speaker: "Kit",    text: t("Power screws can lift a whole car with just one hand — that's mechanical advantage.", "Kraftskruvar kan lyfta en hel bil med bara en hand — det är mekanisk fördel.") },
        { speaker: "Rob",    text: t("The more threads per centimetre, the more force is multiplied. Maths in action!", "Fler gängor per centimeter = mer kraft multipliceras. Matte i praktiken!") },
      ],
      conclusion: t("The tyre is changed in minutes — a simple screw saves the day!", "Däcket byts på minuter — en enkel skruv räddar dagen!"),
    },
    theory: {
      concept: t("Screw as simple machine", "Skruv som enkel maskin"),
      explanation: t("A screw is a ramp (inclined plane) wound around a cylinder. Each turn of the screw moves the load a tiny distance but multiplies the turning force enormously. This is why a small hand crank can lift a heavy car.", "En skruv är en ramp (lutande plan) lindad runt en cylinder. Varje varv av skruven rör lasten ett litet avstånd men multiplicerar vridkraften enormt. Det är därför en liten handvev kan lyfta en tung bil."),
      realWorldExamples: [
        t("A car jack uses a power screw to lift vehicles", "En domkraft använder en kraftskruv för att lyfta fordon"),
        t("Bottle caps are screws — twist to seal or open", "Flasklock är skruvar — vrid för att stänga eller öppna"),
        t("A drill bit is a helical screw that bores into wood", "Ett borr är en spiralformad skruv som borrar in i trä"),
      ],
      newWords: [t("Screw", "Skruv"), t("Thread", "Gänga"), t("Mechanical advantage", "Mekanisk fördel"), t("Inclined plane", "Lutande plan")],
    },
    build: {
      modelName: t("Car Jack", "Domkraft"),
      description: t("Build a screw-lift mechanism that raises a load when the handle is turned.", "Bygg en skruvlyftmekanism som lyfter en last när handtaget vrids."),
      totalSteps: 6,
      steps: [
        { stepNumber: 1, title: t("Build the base platform", "Bygg basplattformen"), description: t("Assemble the P7x11 pillar flat as the sturdy base.", "Montera P7x11-pelaren platt som den stabila basen."), components: ["P7x11 x1", "CT2 x2"] },
        { stepNumber: 2, title: t("Build the side towers", "Bygg sidotornen"), description: t("Attach P7 beams vertically on each side with CT3.", "Fäst P7-balkar vertikalt på varje sida med CT3."), components: ["P7 x4", "CT3 x4"] },
        { stepNumber: 3, title: t("Add TW1 pivot holders", "Lägg till TW1-pivothållare"), description: t("Click TW1 connectors at the midpoint of each tower.", "Klicka TW1-kopplingar vid mittpunkten av varje torn."), components: ["TW1 x4"] },
        { stepNumber: 4, title: t("Add CH2 cross connectors", "Lägg till CH2-korskopplingar"), description: t("Bridge the towers with CH2 to form a stable frame.", "Brygga tornen med CH2 för att bilda en stabil ram."), components: ["CH2 x5"] },
        { stepNumber: 5, title: t("Insert the power screw", "Sätt in kraftskruven"), description: t("Thread the Power Screw through the TW1 mounts vertically.", "Trä kraftskruven vertikalt genom TW1-hållarna."), components: ["Power Screw x1", "P5 Nut x1"] },
        { stepNumber: 6, title: t("Add handle and test", "Lägg till handtag och testa"), description: t("Attach CL2 pieces as the turning handle. Turn and watch the platform rise!", "Fäst CL2-bitar som vridhandtag. Vrid och se plattformen stiga!"), components: ["CL2 x2", "P3 x2"] },
      ],
    },
    challenge: { title: t("How High Can You Lift?", "Hur högt kan du lyfta?"), description: t("Place a small book on the lift platform. How many turns to raise it 5 cm?", "Lägg en liten bok på lyftplattformen. Hur många varv krävs för att lyfta den 5 cm?"), hint: t("Count turns carefully — each full rotation is one thread pitch of movement.", "Räkna varven noggrant — varje fullständig rotation är ett gängsteg.") },
    lgr22: { strands: ["tek_mek"], rawSpreadsheet: "Lgr22 1–3: Teknik – Mekanismer & konstruktioner" },
    sdgs: [9],
  },

  // Ch11
  {
    id: 11, slug: "bear-trap", isCheckpoint: false,
    title: t("Bear Trap", "Björnfälla"),
    subtitle: t("Build a spring-loaded snap mechanism", "Bygg en fjäderlastad snappningsmekanism"),
    story: {
      intro: t("Rob spots a bear approaching the camp! The team needs a safe, humane trap to redirect the bear away.", "Rob ser en björn som närmar sig lägret! Laget behöver en säker, human fälla för att leda björnen bort."),
      dialogue: [
        { speaker: "Rob",  text: t("Bear incoming! We need something that snaps shut fast to startle it away!", "Björn på väg! Vi behöver något som snäpper igen snabbt för att skrämma bort den!") },
        { speaker: "Kit",  text: t("A spring stores energy when you compress or bend it. Release it — snap!", "En fjäder lagrar energi när du tryckt ihop eller böjer den. Släpp — snap!") },
        { speaker: "Laya", text: t("Mouse traps, pinball launchers and even clothes pegs use spring energy.", "Musfällor, flipperspel och till och med klädnypor använder fjäderenergi.") },
        { speaker: "Rob",  text: t("Build it fast — the bear is getting closer!", "Bygg det snabbt — björnen kommer närmre!") },
      ],
      conclusion: t("The trap snaps and startles the bear away safely — elastic energy saves the campsite!", "Fällan snäpper till och skrämmer björnen bort säkert — elastisk energi räddar lägerplatsen!"),
    },
    theory: {
      concept: t("Spring & elastic energy", "Fjäder- & elastisk energi"),
      explanation: t("Springs store energy when stretched or compressed. Release the spring and that energy is returned as motion — very fast motion! This is called elastic potential energy, and it powers everything from watches to trampolines.", "Fjädrar lagrar energi när de sträcks ut eller trycks ihop. Släpp fjädern och den energin återgår som rörelse — mycket snabb rörelse! Detta kallas elastisk potentiell energi och driver allt från klockor till trampoliner."),
      realWorldExamples: [
        t("A mousetrap uses a spring to snap shut instantly", "En musfälla använder en fjäder för att snäppa igen omedelbart"),
        t("A trampoline stores energy when you push it down", "En trampolin lagrar energi när du trycket ner den"),
        t("Watches use coil springs wound tight to power the clock hands", "Klockor använder spiralfjädrar hårt uppvridna för att driva visarna"),
      ],
      newWords: [t("Spring", "Fjäder"), t("Elastic energy", "Elastisk energi"), t("Compress", "Komprimera"), t("Snap", "Snäppa")],
    },
    build: {
      modelName: t("Bear Trap", "Björnfälla"),
      description: t("Build a spring-loaded jaw mechanism that snaps shut when triggered.", "Bygg en fjäderlastad käkmekanism som snäpper igen när den utlöses."),
      totalSteps: 6,
      steps: [
        { stepNumber: 1, title: t("Build the base plate", "Bygg basplattan"), description: t("Arrange P5 beams in a flat rectangular base.", "Arrangera P5-balkar i en platt rektangulär bas."), components: ["P5 x4", "CT2 x4"] },
        { stepNumber: 2, title: t("Add corner supports", "Lägg till hörnstöd"), description: t("Attach CH2 connectors at each corner.", "Fäst CH2-kopplingar i varje hörn."), components: ["CH2 x4", "CT3 x4"] },
        { stepNumber: 3, title: t("Build the lower jaw", "Bygg det nedre käken"), description: t("Assemble P7 beams as the lower jaw of the trap.", "Montera P7-balkar som fällans nedre käke."), components: ["P7 x3", "CT3 x2"] },
        { stepNumber: 4, title: t("Build the upper jaw", "Bygg det övre käken"), description: t("Mirror the lower jaw using P7 beams.", "Spegla det nedre käken med P7-balkar."), components: ["P7 x3", "CT3 x2"] },
        { stepNumber: 5, title: t("Add axle and spring tension", "Lägg till axel och fjäderspänning"), description: t("Thread SH100 shafts through both jaws with TW1 connectors as the pivot.", "Trä SH100-axlar genom båda käkarna med TW1-kopplingar som pivot."), components: ["SH100 x2", "TW1 x6", "CL2 x2"] },
        { stepNumber: 6, title: t("Add P3 Plus trigger and test", "Lägg till P3 Plus-utlösare och testa"), description: t("Attach P3 Plus as the trigger arm. Open jaws, set trigger, then gently press — SNAP!", "Fäst P3 Plus som utlösararm. Öppna käkarna, ställ in utlösaren, tryck sedan försiktigt — SNAP!"), components: ["P3 Plus x4"] },
      ],
    },
    challenge: { title: t("Spring Energy Comparison", "Fjäderenergi-jämförelse"), description: t("How far does a cotton ball fly when launched by the trap? Measure the distance.", "Hur långt flyger en bomullstuss när den skjuts av fällan? Mät avståndet."), hint: t("More spring tension = more energy stored = further launch!", "Mer fjäderspänning = mer lagrad energi = längre kast!") },
    lgr22: { strands: ["fys_energi"], rawSpreadsheet: "Lgr22 1–3: Fysik – Energi och energiflöden" },
    sdgs: [15],
  },

  // Ch12
  {
    id: 12, slug: "pasta-maker", isCheckpoint: false,
    title: t("Pasta Maker", "Pastamaskin"),
    subtitle: t("Roll flat pasta with a gear-driven roller", "Rulla platt pasta med en kugghjulsdriven vals"),
    story: {
      intro: t("A farmer's family is hungry but their pasta machine is broken! The team builds a new one using gears.", "En bondgårdsfamilj är hungrig men deras pastamaskin är trasig! Laget bygger en ny med kugghjul."),
      dialogue: [
        { speaker: "Farmer", text: t("Our pasta machine broke! We can't make spaghetti without it.", "Vår pastamaskin gick sönder! Vi kan inte göra spaghetti utan den.") },
        { speaker: "Laya",   text: t("Two rollers connected by gears spin at the same speed — that's all a pasta maker is!", "Två valsar kopplade med kugghjul snurrar i samma hastighet — det är allt en pastamaskin är!") },
        { speaker: "Kit",    text: t("One large gear and one small gear can change the speed and force of the rollers.", "Ett stort och ett litet kugghjul kan ändra hastigheten och kraften hos valsarna.") },
        { speaker: "Rob",    text: t("Gear ratio! If G20 drives G60, the output spins three times slower but three times stronger.", "Kugghjulsförhållande! Om G20 driver G60 snurrar utdata tre gånger långsammare men tre gånger starkare.") },
      ],
      conclusion: t("Fresh pasta for everyone — gears really do make life tastier!", "Färsk pasta för alla — kugghjul gör verkligen livet godare!"),
    },
    theory: {
      concept: t("Gear ratios", "Kugghjulsförhållanden"),
      explanation: t("When a small gear (G20, 20 teeth) drives a large gear (G60, 60 teeth), the large gear turns 3× slower but with 3× more torque. This is gear reduction — trading speed for force. Pasta machines use this to roll dough smoothly.", "När ett litet kugghjul (G20, 20 tänder) driver ett stort kugghjul (G60, 60 tänder), vrids det stora 3× långsammare men med 3× mer vridmoment. Det är kugghjulsreduktion — att byta ut hastighet mot kraft. Pastamaskiner använder detta för att rulla deg jämnt."),
      realWorldExamples: [
        t("Bicycle gears let you go fast on flat roads or climb steep hills", "Cykelväxlar låter dig gå fort på platta vägar eller klättra branta backar"),
        t("Electric screwdrivers use gear reduction for high torque", "Elektriska skruvdragare använder kugghjulsreduktion för högt vridmoment"),
        t("A pasta machine uses two rollers linked by gears for even thickness", "En pastamaskin använder två valsar kopplade med kugghjul för jämn tjocklek"),
      ],
      newWords: [t("Gear ratio", "Kugghjulsförhållande"), t("Torque", "Vridmoment"), t("Reduction", "Reduktion"), t("Roller", "Vals")],
    },
    build: {
      modelName: t("Pasta Maker", "Pastamaskin"),
      description: t("Build a roller mechanism driven by interlocking gears.", "Bygg en valsmekanism driven av sammanlänkade kugghjul."),
      totalSteps: 4,
      steps: [
        { stepNumber: 1, title: t("Build the side frame", "Bygg sidramen"), description: t("Assemble the P7x11 pillar as the main frame. Add P3 Plus support pieces.", "Montera P7x11-pelaren som huvudramen. Lägg till P3 Plus-stödstycken."), components: ["P7x11 x1", "P3 Plus x2"] },
        { stepNumber: 2, title: t("Insert the axle shafts", "Sätt in axelaxlarna"), description: t("Thread two SH60 shafts through the frame — these are the two rollers.", "Trä två SH60-axlar genom ramen — dessa är de två valsarna."), components: ["SH60 x2"] },
        { stepNumber: 3, title: t("Mount the gears", "Montera kugghjulen"), description: t("Press one G20 Plus gear on the top shaft and one G60 on the lower shaft.", "Tryck ett G20 Plus-kugghjul på den övre axeln och ett G60 på den nedre axeln."), components: ["G20 Plus x1", "G60 x2"] },
        { stepNumber: 4, title: t("Mesh gears and test", "Gripa in kugghjulen och testa"), description: t("Adjust until the gears mesh smoothly. Turn the handle — do both rollers spin together?", "Justera tills kugghjulen griper in jämnt. Vrid handtaget — snurrar båda valsarna tillsammans?"), components: [] },
      ],
    },
    challenge: { title: t("Gear Ratio Race", "Kugghjulsförhållande-tävling"), description: t("Swap G60 for a second G20. Now what happens to roller speed?", "Byt ut G60 mot ett andra G20. Vad händer nu med valsarnas hastighet?"), hint: t("Same size gears = same speed. Different sizes = speed change!", "Samma storlekskugghjul = samma hastighet. Olika storlekar = hastighetsbyte!") },
    lgr22: { strands: ["tek_mek"], rawSpreadsheet: "Lgr22 1–3: Teknik – Mekanismer & konstruktioner" },
    sdgs: [2, 9],
  },

  // Ch13–30: continue with the shorthand approach for remaining chapters
  ...buildShorthandChapters([
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
