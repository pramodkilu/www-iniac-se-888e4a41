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

  // ─── Chapters 13–30: fully expanded ──────────────────────────────────────

  // Ch13
  {
    id: 13, slug: "merry-go-round", isCheckpoint: false,
    title: t("Merry-Go-Round", "Karusell"),
    subtitle: t("Build a carnival ride with gears", "Bygg ett karusellåk med kugghjul"),
    story: {
      intro: t("The team finds a broken merry-go-round at a village fair. The children are disappointed — can the team fix it?", "Laget hittar en trasig karusell på en byfest. Barnen är besvikna — kan laget laga den?"),
      dialogue: [
        { speaker: "Laya", text: t("A merry-go-round needs a big gear driven by a small gear to spin at the right speed.", "En karusell behöver ett stort kugghjul drivet av ett litet för att snurra i rätt hastighet.") },
        { speaker: "Kit",  text: t("The small G20 gear turns three times for every one turn of the big G60 gear. That's a 3:1 ratio!", "Det lilla G20-kugghjulet vrids tre gånger för varje ett varv av det stora G60. Det är ett 3:1-förhållande!") },
        { speaker: "Rob",  text: t("Combine the G20 Idler between them and the rotation transfers smoothly.", "Kombinera G20 Idler mellan dem och rotationen överförs smidigt.") },
        { speaker: "Laya", text: t("Done! Now the children can ride again. Gear ratios save the day!", "Klart! Nu kan barnen åka igen. Kugghjulsförhållanden räddar dagen!") },
      ],
      conclusion: t("The merry-go-round spins smoothly — gear ratios really are magical!", "Karusellen snurrar smidigt — kugghjulsförhållanden är verkligen magiska!"),
    },
    theory: {
      concept: t("Rotation & gear ratios", "Rotation & utväxling"),
      explanation: t("A merry-go-round spins around a central axis. By combining differently-sized gears, you create a gear ratio — a small fast gear can drive a large slow gear, or vice versa.", "En karusell snurrar kring en central axel. Genom att kombinera olika stora kugghjul skapar du en utväxling — ett litet snabbt kugghjul kan driva ett stort långsamt, eller tvärtom."),
      realWorldExamples: [
        t("A bicycle uses gears to go fast on flat roads or slow on steep hills", "En cykel använder växlar för att gå fort på platt mark eller långsamt i branta backar"),
        t("Clock gears turn at different speeds: seconds, minutes, hours", "Klockans kugghjul vrids med olika hastigheter: sekunder, minuter, timmar"),
        t("Car engines use gear ratios to balance speed and power", "Bilmotorer använder kugghjulsförhållanden för att balansera hastighet och kraft"),
      ],
      newWords: [t("Gear ratio", "Kugghjulsförhållande"), t("Rotation", "Rotation"), t("Axis", "Axel"), t("Idler gear", "Mellanhjul")],
    },
    build: {
      modelName: t("Merry-Go-Round", "Karusell"),
      description: t("Build a merry-go-round with a central gear train and rotating platform.", "Bygg en karusell med ett centralt kugghjultåg och roterande plattform."),
      totalSteps: 5,
      steps: [
        { stepNumber: 1, title: t("Build the base frame", "Bygg basramen"), description: t("Lay P7x11 pillar flat as the sturdy base. Reinforce with P11 beams and CT2.", "Lägg P7x11-pelaren platt som den stabila basen. Förstärk med P11-balkar och CT2."), components: ["P7x11 x1", "P11 x2", "CT2 x4"] },
        { stepNumber: 2, title: t("Add the central pillar", "Lägg till centralpelaren"), description: t("Attach PU5x7 pillar vertically in the centre with CT3 connectors.", "Fäst PU5x7-pelaren vertikalt i mitten med CT3-kopplingar."), components: ["PU5x7 x1", "CT3 x2", "P7 x2"] },
        { stepNumber: 3, title: t("Mount the gear shafts", "Montera kugghjulsaxlarna"), description: t("Thread SH60 shafts through the TW1 and CL2 mounts at the top of the pillar.", "Trä SH60-axlar genom TW1- och CL2-hållarna i toppen av pelaren."), components: ["SH60 x2", "TW1 x3", "CL2 x4"] },
        { stepNumber: 4, title: t("Install the gear train", "Installera kugghjulståget"), description: t("Press G20 Plus as the drive gear, G20 Idler in the middle, and G60 as the large output gear.", "Tryck G20 Plus som drivkugghjul, G20 Idler i mitten och G60 som stort utgångskugghjul."), components: ["G20 Plus x1", "G20 Idler x1", "G60 x2"] },
        { stepNumber: 5, title: t("Build and attach the ride platform", "Bygg och fäst åkplattformen"), description: t("Assemble P5 and P3 arms as the ride seats. Attach CH2 as the seat connectors. Turn the handle and ride!", "Montera P5- och P3-armar som åkstolar. Fäst CH2 som stolskopplingar. Vrid handtaget och åk!"), components: ["P5 x4", "P3 x2", "CH2 x2", "CT2 x4", "CL2 x3"] },
      ],
    },
    challenge: { title: t("Spin Speed Test", "Snurrhastighetstest"), description: t("How many input rotations make one full ride spin? Try swapping gear sizes!", "Hur många handvarv ger en hel karusellrunda? Byt kugghjulsstorlek!"), hint: t("Count teeth: G20 has 20, G60 has 60. What ratio is that?", "Räkna tänder: G20 har 20, G60 har 60. Vilket förhållande är det?") },
    lgr22: { strands: ["fys_kraft"], rawSpreadsheet: "Lgr22 1–3: Fysik – Kraft & rörelse" },
    sdgs: [3, 11],
  },

  // Ch14
  {
    id: 14, slug: "spinning-top", isCheckpoint: false,
    title: t("Spinning Top", "Snurra"),
    subtitle: t("Build a motor-powered spinning top", "Bygg en motordriven snurra"),
    story: {
      intro: t("Kit challenges Rob to a spinning-top duel. Whoever's top spins longest wins! Rob wants a motor-powered advantage.", "Kit utmanar Rob till en snurraduell. Vems snurra snurrar längst vinner! Rob vill ha motordrivet försprång."),
      dialogue: [
        { speaker: "Rob",  text: t("Angular momentum means a spinning object resists stopping. Heavier and faster = spins longer!", "Rörelsemängdsmoment innebär att ett snurrande föremål motstår att stanna. Tyngre och snabbare = snurrar längre!") },
        { speaker: "Kit",  text: t("A motor connected through gears gives constant spin without losing energy to a hand-push.", "En motor kopplad via kugghjul ger konstant snurrande utan att förlora energi till ett handtryck.") },
        { speaker: "Laya", text: t("G20 drives G60 — that reduces speed but greatly increases torque for a steady spin.", "G20 driver G60 — det minskar hastigheten men ökar vridmomentet för en stadig snurrning.") },
        { speaker: "Rob",  text: t("My motor-top will spin forever! Well… until the battery runs out.", "Min motorsnurra snurrar för evigt! Ja... tills batteriet tar slut.") },
      ],
      conclusion: t("Rob's motor-powered top outlasts Kit's hand-spun top — physics wins!", "Robs motordrivna snurra varar längre än Kits handspunna — fysiken vinner!"),
    },
    theory: {
      concept: t("Angular momentum & energy transfer", "Rörelsemängdsmoment & energiöverföring"),
      explanation: t("Once spinning, an object wants to keep spinning — that's angular momentum. The faster and heavier it spins, the longer it takes to slow down. Same principle keeps bicycles upright!", "När något snurrar vill det fortsätta snurra — det kallas rörelsemängdsmoment. Ju snabbare och tyngre, desto längre tid att stanna. Samma princip håller cyklar upprätta!"),
      realWorldExamples: [
        t("A bicycle stays upright while moving because of spinning-wheel momentum", "En cykel förblir upprätt medan den rör sig på grund av hjulens rörelsemängdsmoment"),
        t("A gyroscope resists tilting because it spins so fast", "Ett gyroskop motstår lutning eftersom det snurrar så fort"),
        t("A boomerang spins in flight to keep it stable in the air", "En bumerang snurrar i luften för att hålla sig stabil"),
      ],
      newWords: [t("Angular momentum", "Rörelsemängdsmoment"), t("Torque", "Vridmoment"), t("Gyroscope", "Gyroskop"), t("Inertia", "Tröghet")],
    },
    build: {
      modelName: t("Motorized Spinning Top", "Motordriven snurra"),
      description: t("Build a motorized spinning top with a multi-gear drive train.", "Bygg en motordriven snurra med ett flerkugghjulsdrivsystem."),
      totalSteps: 5,
      steps: [
        { stepNumber: 1, title: t("Build the base support", "Bygg basstödet"), description: t("Attach PU5x7 and PU5x13 pillars together as the main vertical support.", "Fäst PU5x7- och PU5x13-pelare tillsammans som det viktigaste vertikala stödet."), components: ["PU5x7 x1", "PU5x13 x1", "CT2 x2"] },
        { stepNumber: 2, title: t("Mount the motor", "Montera motorn"), description: t("Attach the Motor with Battery Box to the base. This is your power source.", "Fäst Motor with Battery Box till basen. Det här är din kraftkälla."), components: ["Motor with Battery Box x1", "CH2 x2"] },
        { stepNumber: 3, title: t("Insert the drive shafts", "Sätt in drivaxlarna"), description: t("Thread two SH60 shafts through the support frame for the gear train.", "Trä två SH60-axlar genom stödenheten för kugghjulssystemet."), components: ["SH60 x2"] },
        { stepNumber: 4, title: t("Build the gear train", "Bygg kugghjulssystemet"), description: t("Mount three G20 Plus gears and three G60 gears to create the speed-reduction drive.", "Montera tre G20 Plus-kugghjul och tre G60-kugghjul för att skapa hastighetsminskning."), components: ["G20 Plus x3", "G60 x3"] },
        { stepNumber: 5, title: t("Attach the spinning disc and test", "Fäst snurrskivan och testa"), description: t("Clip the disc top using remaining CT2 pieces. Switch on the motor and watch it spin!", "Klicka fast skivtoppen med återstående CT2. Slå på motorn och se den snurra!"), components: ["CT2 x1"] },
      ],
    },
    challenge: { title: t("Beyblade Battle", "Snurra-strid"), description: t("Build two tops. Whose spins longest? Whose can knock the other out?", "Bygg två snurror. Vems snurrar längst? Vem kan knuffa ut den andra?"), hint: t("More gear reduction = more torque = steadier spin. But is it more fun?", "Mer utväxling = mer vridmoment = stadigare snurr. Men är det roligare?") },
    lgr22: { strands: ["fys_energi"], rawSpreadsheet: "Lgr22 1–3: Fysik – Energi och energiflöden" },
    sdgs: [3, 4],
  },

  // Ch15
  {
    id: 15, slug: "lock-and-key", isCheckpoint: false,
    title: t("Lock & Key", "Lås & nyckel"),
    subtitle: t("Protect a sacred idol with a gear lock", "Skydda en helig staty med ett kugghjulslås"),
    story: {
      intro: t("The team discovers a sacred idol that must be protected. They design a gear-based lock that only opens with the right key.", "Laget hittar en helig staty som måste skyddas. De designar ett kugghjulsbaserat lås som bara öppnas med rätt nyckel."),
      dialogue: [
        { speaker: "Laya", text: t("A lock only opens when the right key meshes perfectly with its internal gears.", "Ett lås öppnas bara när rätt nyckel griper in perfekt med dess interna kugghjul.") },
        { speaker: "Kit",  text: t("If the gear teeth don't align, the bolt can't slide — wrong key, no entry!", "Om kuggtänderna inte stämmer kan regeln inte glida — fel nyckel, ingen tillgång!") },
        { speaker: "Rob",  text: t("This is exactly how combination locks work — the right sequence aligns the gears.", "Det är precis så kombinationslås fungerar — rätt sekvens justerar kugghjulen.") },
        { speaker: "Laya", text: t("Our Blix lock uses G20 and a shaft — turn it and the bolt slides open!", "Vårt Blix-lås använder G20 och en axel — vrid det och regeln glider upp!") },
      ],
      conclusion: t("The idol is safe — gear locks are stronger than any padlock!", "Statyn är säker — kugghjulslås är starkare än vilket hänglås som helst!"),
    },
    theory: {
      concept: t("Meshing gears as a locking mechanism", "Kugghjulsingrepp som låsmekanism"),
      explanation: t("Locks allow motion only with the right key. Our Blix key uses a shaft and gear — turn it, and it meshes with a rack inside, sliding the bolt open. Wrong gear = no movement!", "Lås tillåter rörelse endast med rätt nyckel. Vår Blix-nyckel använder en axel och ett kugghjul — vrid den, griper den in i en kuggstång inuti och skjuter regeln. Fel kugghjul = ingen rörelse!"),
      realWorldExamples: [
        t("Door locks use rotating pins that must align to open", "Dörrlås använder roterande stift som måste justeras för att öppna"),
        t("Safe combination locks rotate discs until notches align", "Kassaskåpskombinationslås roterar skivor tills skåror justeras"),
        t("Bike locks use a coded sequence of rotating rings", "Cykellås använder en kodad sekvens av roterande ringar"),
      ],
      newWords: [t("Lock", "Lås"), t("Bolt", "Regel"), t("Key", "Nyckel"), t("Combination", "Kombination")],
    },
    build: {
      modelName: t("Gear Lock & Key", "Lås & nyckel med kugghjul"),
      description: t("Build a lock body with a sliding bolt mechanism and a gear-driven key.", "Bygg ett låshus med en glidande regelmekanism och en kugghjulsdriven nyckel."),
      totalSteps: 7,
      steps: [
        { stepNumber: 1, title: t("Build the lock body base", "Bygg låshusets bas"), description: t("Assemble three P7x11 pillars as the main lock housing.", "Montera tre P7x11-pelare som det viktigaste låshuset."), components: ["P7x11 x3"] },
        { stepNumber: 2, title: t("Add lock frame sides", "Lägg till låsramens sidor"), description: t("Attach CH2 connectors along the sides to form the lock frame.", "Fäst CH2-kopplingar längs sidorna för att bilda låsramen."), components: ["CH2 x4", "CT2 x4"] },
        { stepNumber: 3, title: t("Build the bolt channel", "Bygg regelkanalen"), description: t("Add CH2 pieces as the guide channel where the bolt will slide.", "Lägg till CH2-bitar som guidekanalerna där regeln kommer glida."), components: ["CH2 x4", "CT3 x1"] },
        { stepNumber: 4, title: t("Insert the bolt shaft", "Sätt in regelaxeln"), description: t("Thread SH100 as the sliding bolt through the guide channel.", "Trä SH100 som den glidande regeln genom guidekanalerna."), components: ["SH100 x1"] },
        { stepNumber: 5, title: t("Mount the key gear mount", "Montera nyckelkugghjulshållaren"), description: t("Attach CH2 and CT2 as the keyhole housing where the key gear inserts.", "Fäst CH2 och CT2 som nyckelhålshuset där nyckelkugghjulet sätts in."), components: ["CH2 x3", "CT2 x2"] },
        { stepNumber: 6, title: t("Build the key", "Bygg nyckeln"), description: t("Thread SH60 through a G20 Plus gear — this is your key.", "Trä SH60 genom ett G20 Plus-kugghjul — det här är din nyckel."), components: ["SH60 x1", "G20 Plus x1", "P3 Plus x1"] },
        { stepNumber: 7, title: t("Test lock and key", "Testa låset och nyckeln"), description: t("Insert the key, turn it — the gear meshes and the bolt slides open. Remove key — lock closes!", "Sätt in nyckeln, vrid den — kugghjulet griper in och regeln glider upp. Ta ut nyckeln — låset stängs!"), components: [] },
      ],
    },
    challenge: { title: t("Two Different Keys", "Två olika nycklar"), description: t("Build two different keys that open the same lock!", "Bygg två olika nycklar som öppnar samma lås!"), hint: t("The bolt slot must align with BOTH keys — what shaft position makes this work?", "Reglurtappet måste justeras med BÅDA nycklarna — vilken axelposition gör detta?") },
    lgr22: { strands: ["tek_mek"], rawSpreadsheet: "Lgr22 1–3: Teknik – Mekanismer & konstruktioner" },
    sdgs: [11, 16],
  },

  // Ch16
  {
    id: 16, slug: "trundle-wheel", isCheckpoint: false,
    title: t("Trundle Wheel", "Mäthjul"),
    subtitle: t("Measure long distances by rolling", "Mät långa avstånd genom att rulla"),
    story: {
      intro: t("The class needs to measure the school playground but there is no tape measure long enough. Rob builds a trundle wheel!", "Klassen måste mäta skolgårdens lekplats men det finns inget tillräckligt långt måttband. Rob bygger ett mäthjul!"),
      dialogue: [
        { speaker: "Rob",  text: t("A trundle wheel converts one rotation into a known distance. Count the clicks, multiply!", "Ett mäthjul omvandlar en rotation till ett känt avstånd. Räkna klickljuden, multiplicera!") },
        { speaker: "Kit",  text: t("If the wheel circumference is 31 cm, every full rotation = 31 cm of distance covered.", "Om hjulets omkrets är 31 cm, varje full rotation = 31 cm avstånd.") },
        { speaker: "Laya", text: t("Surveyors used trundle wheels for hundreds of years before laser measuring was invented.", "Lantmätare använde mäthjul i hundratals år innan lasermätning uppfanns.") },
        { speaker: "Rob",  text: t("Let's measure the playground! One rotation at a time. Click, click, click!", "Vi mäter lekplatsen! En rotation i taget. Klick, klick, klick!") },
      ],
      conclusion: t("The playground is 23 metres long — the trundle wheel nailed it!", "Lekplatsen är 23 meter lång — mäthjulet lyckades!"),
    },
    theory: {
      concept: t("Circumference & motion conversion", "Omkrets & rörelseomvandling"),
      explanation: t("A trundle wheel converts rotation to distance. If the circumference is 10 cm, every full turn covers 10 cm. Count rotations × circumference = total distance!", "Ett mäthjul omvandlar rotation till avstånd. Om omkretsen är 10 cm täcker varje hel rotation 10 cm. Antal varv × omkrets = totalt avstånd!"),
      realWorldExamples: [
        t("Odometers in cars count wheel rotations to show distance travelled", "Vägmätare i bilar räknar hjulrotationer för att visa körsträckan"),
        t("Surveyors use electronic trundle wheels to map land", "Lantmätare använder elektroniska mäthjul för att kartlägga land"),
        t("Bicycle computers count wheel rotations to calculate speed", "Cykeldatorer räknar hjulrotationer för att beräkna hastigheten"),
      ],
      newWords: [t("Circumference", "Omkrets"), t("Rotation", "Rotation"), t("Distance", "Avstånd"), t("Odometer", "Vägmätare")],
    },
    build: {
      modelName: t("Trundle Wheel", "Mäthjul"),
      description: t("Build a rolling wheel on a handle that measures distance with each rotation.", "Bygg ett rullande hjul på ett handtag som mäter avstånd med varje rotation."),
      totalSteps: 7,
      steps: [
        { stepNumber: 1, title: t("Build the handle frame", "Bygg handtagsramen"), description: t("Join two P11 beams with CT2 connectors to form the long handle.", "Foga ihop två P11-balkar med CT2 för att bilda det långa handtaget."), components: ["P11 x2", "CT2 x4"] },
        { stepNumber: 2, title: t("Add the axle support", "Lägg till axelstödet"), description: t("Attach PU5x7 pillars at the base of the handle as the wheel axle holder.", "Fäst PU5x7-pelare vid basen av handtaget som hjulaxelns hållare."), components: ["PU5x7 x2", "CT3 x2"] },
        { stepNumber: 3, title: t("Build the side reinforcement", "Bygg sidoförstärkningen"), description: t("Add P5 beams and CL2 connectors to stiffen the handle sides.", "Lägg till P5-balkar och CL2-kopplingar för att stärka handtagets sidor."), components: ["P5 x3", "CL2 x3"] },
        { stepNumber: 4, title: t("Insert the axle shafts", "Sätt in axelaxlarna"), description: t("Thread SH60 shafts horizontally through the PU5x7 pillar axle mounts.", "Trä SH60-axlar horisontellt genom PU5x7-pelarnas axelhållare."), components: ["SH60 x2", "TW1 x2"] },
        { stepNumber: 5, title: t("Mount the gear counter", "Montera kugghjulsräknaren"), description: t("Press G20 Plus gears and a G60 onto the axle to create a rotation counter mechanism.", "Tryck G20 Plus-kugghjul och ett G60 på axeln för att skapa en rotationsräknarmekanism."), components: ["G20 Plus x2", "G60 x1"] },
        { stepNumber: 6, title: t("Add the rack click-counter", "Lägg till kuggstångsklickräknaren"), description: t("Attach Rack pieces with P3 and P3 Plus as the click mechanism — one click per rotation.", "Fäst kuggstångsbitar med P3 och P3 Plus som klickmekanism — ett klick per rotation."), components: ["Rack x3", "P3 x3", "P3 Plus x1"] },
        { stepNumber: 7, title: t("Attach the measuring wheel and test", "Fäst mäthjulet och testa"), description: t("Press the main wheel onto the axle end. Roll it 10 times and measure the distance covered.", "Tryck huvudhjulet på axelns ände. Rulla det 10 gånger och mät det avstånd som täcks."), components: ["P7 x1", "P5 x1"] },
      ],
    },
    challenge: { title: t("Measure Real Distances", "Mät verkliga avstånd"), description: t("Measure your bedroom, your tallest jump, and the kitchen's perimeter. Were your guesses right?", "Mät ditt rum, ditt högsta hopp och köksomkretsen. Stämde dina gissningar?"), hint: t("Distance = number of clicks × wheel circumference in cm.", "Avstånd = antal klick × hjulets omkrets i cm.") },
    lgr22: { strands: ["fys_kraft", "tek_mek", "mat_tal"], rawSpreadsheet: "Lgr22 1–3: Fysik – Kraft & rörelse; Teknik – Mekanismer; Matematik – Tal" },
    sdgs: [4, 9],
  },

  // Ch17
  {
    id: 17, slug: "zipline-ride", isCheckpoint: false,
    title: t("Zipline Ride", "Linbana"),
    subtitle: t("Cross a deep valley on a pulley and rope", "Korsa en djup dal på ett block och rep"),
    story: {
      intro: t("The team reaches a deep valley with no bridge. Laya spots two tall trees — perfect for a zipline!", "Laget når en djup dal utan bro. Laya ser två höga träd — perfekt för en linbana!"),
      dialogue: [
        { speaker: "Laya", text: t("A zipline uses gravity to pull you from high to low. We just need rope, a pulley, and a frame!", "En linbana använder tyngdkraft för att dra dig från högt till lågt. Vi behöver bara rep, ett block och en ram!") },
        { speaker: "Kit",  text: t("The pulley wheel reduces friction on the rope so it glides smoothly instead of grinding.", "Blockkjulet minskar friktionen på repet så det glider smidigt istället för att slira.") },
        { speaker: "Rob",  text: t("And the Wheel without tires rolls along the rope — like a trolley on a rail!", "Och hjulet utan däck rullar längs repet — som en vagn på en räls!") },
        { speaker: "Laya", text: t("Gravity does all the work. Higher start = faster ride. Physics is the ultimate engineer!", "Tyngdkraften gör allt arbete. Högre start = snabbare åk. Fysik är den ultimata ingenjören!") },
      ],
      conclusion: t("The whole team crosses safely — gravity-powered transport at its finest!", "Hela laget korsar säkert — gravitationsdriven transport i sin finaste form!"),
    },
    theory: {
      concept: t("Gravity & pulley mechanics", "Tyngdkraft & blockmekanism"),
      explanation: t("A zipline uses gravity and a pulley to slide across a gap. The high end connects to the low end by rope. Gravity pulls down, the pulley rolls, and you slide!", "En linbana använder tyngdkraft och ett block för att glida över ett gap. Hög ände kopplas till låg ände med rep. Tyngdkraften drar nedåt, blocket rullar och du glider!"),
      realWorldExamples: [
        t("Ski lifts use pulleys and cables to carry skiers uphill", "Skidliftar använder block och kablar för att bära skidåkare uppför backen"),
        t("Cranes use pulleys to lift heavy loads with less force", "Kranar använder block för att lyfta tunga laster med mindre kraft"),
        t("Fishing rods use a pulley (reel) to retrieve the line", "Fiskespön använder ett block (spole) för att dra in linan"),
      ],
      newWords: [t("Pulley", "Block"), t("Gravity", "Tyngdkraft"), t("Friction", "Friktion"), t("Zipline", "Linbana")],
    },
    build: {
      modelName: t("Zipline & Ring Toss", "Linbana & ringkast"),
      description: t("Build a zipline frame with a pulley wheel that slides along a string.", "Bygg en linbaneram med ett blockhjul som glider längs ett snöre."),
      totalSteps: 7,
      steps: [
        { stepNumber: 1, title: t("Build the tall support towers", "Bygg de höga stödtornen"), description: t("Assemble three P7x11 pillars as two tall towers for the zipline endpoints.", "Montera tre P7x11-pelare som två höga torn för linbanans ändpunkter."), components: ["P7x11 x3", "CT2 x4"] },
        { stepNumber: 2, title: t("Reinforce the towers", "Förstärk tornen"), description: t("Add P11 and P7 beams as cross-bracing to keep the towers standing.", "Lägg till P11- och P7-balkar som korsförband för att hålla tornen stående."), components: ["P11 x4", "P7 x2", "CT(1x2) x4"] },
        { stepNumber: 3, title: t("Build the pulley mount", "Bygg blockhållaren"), description: t("Attach TW1 connectors and CH2 at the tower top as the rope guide.", "Fäst TW1-kopplingar och CH2 i tornets topp som repguide."), components: ["TW1 x6", "CH2 x2"] },
        { stepNumber: 4, title: t("Insert the pulley axle", "Sätt in blockaxeln"), description: t("Thread SH60 through the TW1 mounts as the pulley shaft.", "Trä SH60 genom TW1-hållarna som blockaxel."), components: ["SH60 x1", "CT3 x2"] },
        { stepNumber: 5, title: t("Mount pulley and ride wheels", "Montera block och åkhjul"), description: t("Attach the Pulley wheel on the axle. Add Wheel-without-tires as the zipline trolley.", "Fäst blockhjulet på axeln. Lägg till Hjul-utan-däck som linbanans vagn."), components: ["Pulley x1", "Wheel w/o tires x2"] },
        { stepNumber: 6, title: t("Add gear reduction and P3", "Lägg till kugghjulsreduktion och P3"), description: t("Mount G60 gears and CL2 pieces as the brake/slow-down mechanism.", "Montera G60-kugghjul och CL2-bitar som broms/avmattningssystem."), components: ["G60 x2", "CL2 x2", "P3 x1"] },
        { stepNumber: 7, title: t("String the rope and test", "Spänn repet och testa"), description: t("Thread the Thread/rope through the pulley. Tilt one tower lower and release a small weight. Does it slide?", "Trä tråden/repet genom blocket. Luta ett torn lägre och släpp en liten vikt. Glider den?"), components: ["Thread x1"] },
      ],
    },
    challenge: { title: t("Ring Toss Game", "Ringkastningsspel"), description: t("Build a ring with Blix and string. Toss it around a stick from a distance.", "Bygg en ring med Blix och snöre. Kasta den runt en pinne på avstånd."), hint: t("A heavier ring flies further but is harder to aim. Find the balance!", "En tyngre ring flyger längre men är svårare att sikta med. Hitta balansen!") },
    lgr22: { strands: ["fys_kraft"], rawSpreadsheet: "Lgr22 1–3: Fysik – Kraft & rörelse" },
    sdgs: [3, 9],
  },

  // Ch18
  {
    id: 18, slug: "dancing-robot", isCheckpoint: false,
    title: t("Dancing Robot", "Dansande robot"),
    subtitle: t("Build a motor-powered robot that dances", "Bygg en motordriven robot som dansar"),
    story: {
      intro: t("The village is holding a dance competition and Rob wants to enter — but Rob can't dance! Laya builds a dancing robot instead.", "Byn håller en danstävling och Rob vill delta — men Rob kan inte dansa! Laya bygger en dansrobot istället."),
      dialogue: [
        { speaker: "Rob",  text: t("I want to win the dance competition but my moves are terrible!", "Jag vill vinna danstävlingen men mina rörelser är fruktansvärda!") },
        { speaker: "Laya", text: t("A motor plus gears creates controlled, repeating movement — exactly what a robot dancer needs!", "En motor plus kugghjul skapar kontrollerad, upprepande rörelse — precis vad en dansrobot behöver!") },
        { speaker: "Kit",  text: t("The G20 drives G60 for slow, strong rotation. The P21x21 base keeps it steady while it spins.", "G20 driver G60 för långsam, stark rotation. P21x21-basen håller den stabil medan den snurrar.") },
        { speaker: "Rob",  text: t("My dancing robot wins every time — and it never gets tired!", "Min dansrobot vinner varje gång — och den tröttnar aldrig!") },
      ],
      conclusion: t("The robot dances perfectly — and wins the competition for Rob!", "Roboten dansar perfekt — och vinner tävlingen för Rob!"),
    },
    theory: {
      concept: t("Motor-driven linkages & movement types", "Motordrivna länkmekanismer & rörelsetyper"),
      explanation: t("A linkage is a system of bars connected by joints. Turning one part moves the others in complex ways. Robots, mechanical toys, and your own arm work this way!", "En länkmekanism är ett system av stänger kopplade med leder. Att vrida en del rör de andra på komplexa sätt. Robotar, mekaniska leksaker och din egen arm fungerar så!"),
      realWorldExamples: [
        t("Factory robots use motorized linkages to weld and assemble cars", "Fabriksrobotar använder motordrivna länkmekanismer för att svetsa och montera bilar"),
        t("A mechanical clock uses linkages to move the hands at different speeds", "En mekanisk klocka använder länkmekanismer för att röra visarna i olika hastigheter"),
        t("Prosthetic limbs use motors and linkages to mimic natural movement", "Proteser använder motorer och länkmekanismer för att imitera naturliga rörelser"),
      ],
      newWords: [t("Linkage", "Länkmekanism"), t("Joint", "Led"), t("Oscillation", "Svängning"), t("Mechanism", "Mekanism")],
    },
    build: {
      modelName: t("Dancing Robot", "Dansande robot"),
      description: t("Build a motorized robot with a gear-driven spinning base and moving arms.", "Bygg en motordrivet robot med en kugghjulsdriven snurrande bas och rörliga armar."),
      totalSteps: 3,
      steps: [
        { stepNumber: 1, title: t("Build the stable base", "Bygg den stabila basen"), description: t("Mount P21x21 as the wide base. Attach PU5x7 pillars vertically as the body supports.", "Montera P21x21 som den breda basen. Fäst PU5x7-pelare vertikalt som kroppsstöd."), components: ["P21x21 x1", "PU5x7 x2", "CT2 x2", "CH2 x2"] },
        { stepNumber: 2, title: t("Build the gear drive", "Bygg kugghjulsdriften"), description: t("Thread SH100 through the body centre. Mount G20 Plus as the drive gear and G60 as the output gear.", "Trä SH100 genom kroppens centrum. Montera G20 Plus som drivkugghjul och G60 som utgångskugghjul."), components: ["SH100 x1", "G20 Plus x1", "G60 x2"] },
        { stepNumber: 3, title: t("Attach motor and build arms", "Fäst motorn och bygg armarna"), description: t("Connect the Motor with Battery Box to the drive shaft. Build robot arms and switch on — dance!", "Anslut Motor with Battery Box till drivaxeln. Bygg robotarmar och slå på — dansa!"), components: ["Motor with Battery Box x1"] },
      ],
    },
    challenge: { title: t("Make Your Robot Move", "Få din robot att röra sig"), description: t("Attach a P11 piece so turning the gear makes the robot walk, wave, or wiggle!", "Fäst en P11-del så att kugghjulet får roboten att gå, vinka eller vrida sig!"), hint: t("Offset the arm pivot point from the gear centre to create an eccentric motion.", "Förskjut armens pivotpunkt från kugghjulets centrum för att skapa en excentrisk rörelse.") },
    lgr22: { strands: ["tva"], rawSpreadsheet: "Lgr22 1–3: Tvärvetenskapligt arbetsområde" },
    sdgs: [4, 9],
  },

  // Ch19
  {
    id: 19, slug: "digital-clock", isCheckpoint: false,
    title: t("Digital Clock", "Digital klocka"),
    subtitle: t("Display digits with Blix beams", "Visa siffror med Blix-balkar"),
    story: {
      intro: t("Laya wants to know the time but there is no clock at the campsite. She decides to build a digital clock display from Blix pieces.", "Laya vill veta vad klockan är men det finns ingen klocka på campingplatsen. Hon bestämmer sig för att bygga en digital klockdisplay av Blix-bitar."),
      dialogue: [
        { speaker: "Laya", text: t("A digital display uses seven segments — seven bars arranged like a figure 8!", "En digital display använder sju segment — sju streck arrangerade som en åtta!") },
        { speaker: "Kit",  text: t("Turn some segments on and others off to make any digit from 0 to 9.", "Tänd några segment och släck andra för att visa vilken siffra som helst från 0 till 9.") },
        { speaker: "Rob",  text: t("Real digital clocks use LEDs — tiny lights — for each segment. Same idea, different materials.", "Riktiga digitala klockor använder lysdioder — winziga lampor — för varje segment. Samma idé, olika material.") },
        { speaker: "Laya", text: t("We need P7 beams for the long segments and P3 for the short ones. Let's build 8:00!", "Vi behöver P7-balkar för de långa segmenten och P3 för de korta. Bygg 8:00!") },
      ],
      conclusion: t("The Blix digital clock shows 8:00 — time to cook breakfast!", "Blix digitalklockan visar 8:00 — dags att laga frukost!"),
    },
    theory: {
      concept: t("Seven-segment digital display", "Sjusegmentsdisplay"),
      explanation: t("Each digit on a digital clock uses a 7-segment display — seven small bars in a figure-8 shape. Turn different bars on/off to show any digit 0-9. Real clocks use LEDs — same idea!", "Varje siffra på en digital klocka använder en 7-segmentsdisplay — sju små streck i en åttaform. Tänd/släck olika streck för att visa siffrorna 0-9. Riktiga klockor använder lysdioder — samma idé!"),
      realWorldExamples: [
        t("Calculators use 7-segment displays to show numbers", "Räknedosor använder 7-segmentsdisplayer för att visa siffror"),
        t("Microwave ovens display cooking time with 7-segment digits", "Mikrovågsugnar visar tillagningstid med 7-segmentssiffror"),
        t("Petrol station price displays use large 7-segment segments", "Bensinstationsprisvisare använder stora 7-segmentsssegment"),
      ],
      newWords: [t("Segment", "Segment"), t("Display", "Display"), t("LED", "LED"), t("Binary", "Binärt")],
    },
    build: {
      modelName: t("Blix Digital Clock Display", "Digital Blix-klockdisplay"),
      description: t("Build a 7-segment style digit display using P7 and P3 Blix beams.", "Bygg en 7-segmentsstil sifferdisplay med P7- och P3-Blix-balkar."),
      totalSteps: 1,
      steps: [
        { stepNumber: 1, title: t("Build a 7-segment digit", "Bygg en 7-segmentssiffra"), description: t("Use P7 beams as the top, middle, and bottom horizontals. Use P3 beams as the four vertical sides. Arrange them to show digit '8'. Then remove segments to show 0-9.", "Använd P7-balkar som de övre, mellersta och undre horisontella. Använd P3-balkar som de fyra vertikala sidorna. Arrangera dem för att visa siffran '8'. Ta sedan bort segment för att visa 0-9."), components: ["P7 x28", "CT2 x28", "P21x21 x2", "CH2 x2", "CT(1x2) x2"] },
      ],
    },
    challenge: { title: t("Build a Working Clock", "Bygg en fungerande klocka"), description: t("Update the clock every minute for 10 minutes. Bonus: show seconds!", "Uppdatera klockan varje minut i 10 minuter. Bonus: visa sekunder!"), hint: t("Draw a chart: which 7 segments are on/off for each digit 0-9?", "Rita ett diagram: vilka 7 segment är på/av för varje siffra 0-9?") },
    lgr22: { strands: ["mat_tal"], rawSpreadsheet: "Lgr22 1–3: Matematik – Tal, algebra, mönster & statistik" },
    sdgs: [4, 9],
  },

  // Ch20
  {
    id: 20, slug: "earth-moon-sun", isCheckpoint: false,
    title: t("Earth, Moon & Sun", "Jorden, månen & solen"),
    subtitle: t("Build a model of the solar system", "Bygg en modell av solsystemet"),
    story: {
      intro: t("Under a clear night sky, Rob points at the Moon. The team decides to build a mechanical model showing how Earth, Moon and Sun move.", "Under en klar natthimmel pekar Rob på månen. Laget bestämmer sig för att bygga en mekanisk modell som visar hur Jord, Måne och Sol rör sig."),
      dialogue: [
        { speaker: "Rob",  text: t("Earth rotates once every 24 hours — that's one day. And it orbits the Sun once every 365 days!", "Jorden roterar en gång var 24:e timme — det är ett dygn. Och den kretsar runt solen en gång var 365:e dag!") },
        { speaker: "Kit",  text: t("The Moon orbits Earth every 28 days. We can model all three movements with gears!", "Månen kretsar runt Jorden var 28:e dag. Vi kan modellera alla tre rörelserna med kugghjul!") },
        { speaker: "Laya", text: t("Different-sized gears will spin at different rates — just like the real solar system!", "Olika stora kugghjul snurrar med olika hastigheter — precis som det verkliga solsystemet!") },
        { speaker: "Rob",  text: t("Earth's tilt is 23.5 degrees — that's why we have summer and winter!", "Jordens lutning är 23,5 grader — det är därför vi har sommar och vinter!") },
      ],
      conclusion: t("The model solar system spins perfectly — space engineering at its finest!", "Modellsolsystemet snurrar perfekt — rymdteknik på sitt bästa!"),
    },
    theory: {
      concept: t("Orbit, rotation & revolution", "Bana, rotation & omloppsbana"),
      explanation: t("Earth ROTATES on its axis (1 spin = 24 hours = 1 day). Earth REVOLVES around the Sun (1 lap = 365 days = 1 year). The tilt of Earth's axis gives us seasons!", "Jorden ROTERAR runt sin axel (1 varv = 24 timmar = 1 dygn). Jorden går i BANA runt solen (1 varv = 365 dagar = 1 år). Jordaxelns lutning ger oss årstider!"),
      realWorldExamples: [
        t("Day and night happen because Earth rotates toward and away from the Sun", "Dag och natt uppstår när Jorden roterar mot och från solen"),
        t("The Moon's phases change because it orbits Earth every 28 days", "Månens faser förändras eftersom den kretsar runt Jorden var 28:e dag"),
        t("Seasons occur because Earth's axis is tilted 23.5 degrees", "Årstiderna uppstår eftersom Jordens axel är lutad 23,5 grader"),
      ],
      newWords: [t("Rotation", "Rotation"), t("Revolution", "Omloppsbana"), t("Orbit", "Bana"), t("Axis", "Axel")],
    },
    build: {
      modelName: t("Earth-Moon-Sun System", "Jord-Måne-Sol-system"),
      description: t("Build a gear-driven orrery showing Earth rotating and orbiting the Sun.", "Bygg ett kugghjulsdrivet planetarium som visar Jordens rotation och bana runt solen."),
      totalSteps: 8,
      steps: [
        { stepNumber: 1, title: t("Build the Sun base", "Bygg solbasen"), description: t("Mount P21x21 flat as the solar system base plate.", "Montera P21x21 platt som solsystemets basplatta."), components: ["P21x21 x1", "CT2 x2"] },
        { stepNumber: 2, title: t("Build the central pillar (Sun)", "Bygg centralpelaren (Solen)"), description: t("Attach PU5x7 pillars vertically in the centre as the Sun's axis.", "Fäst PU5x7-pelare vertikalt i mitten som solens axel."), components: ["PU5x7 x2", "CH2 x2"] },
        { stepNumber: 3, title: t("Insert the main shaft", "Sätt in huvudaxeln"), description: t("Thread SH100 vertically through the central pillar.", "Trä SH100 vertikalt genom centralpelaren."), components: ["SH100 x1", "TW1 x1"] },
        { stepNumber: 4, title: t("Build the Earth orbit arm", "Bygg Jordens omloppsbanearm"), description: t("Attach P7x11 pillar horizontally as the arm that holds Earth.", "Fäst P7x11-pelaren horisontellt som armen som håller Jorden."), components: ["P7x11 x1", "CL2 x3"] },
        { stepNumber: 5, title: t("Mount Earth gear train", "Montera Jordens kugghjulssystem"), description: t("Press G20 gears on the orbit arm axle to drive Earth's rotation.", "Tryck G20-kugghjul på omloppsbanearmens axel för att driva Jordens rotation."), components: ["G20 x3", "SH60 x1"] },
        { stepNumber: 6, title: t("Add large Sun gear", "Lägg till stort solkugghjul"), description: t("Mount G20 Plus and G60 as the solar drive gears.", "Montera G20 Plus och G60 som de solara drivkugghjulen."), components: ["G20 Plus x2", "G60 x1"] },
        { stepNumber: 7, title: t("Build the Moon arm", "Bygg månens arm"), description: t("Attach P11 beam and P3 Plus as the arm that holds the Moon around Earth.", "Fäst P11-balk och P3 Plus som armen som håller månen runt Jorden."), components: ["P11 x1", "P3 Plus x2", "CT3 x1", "P5 x1"] },
        { stepNumber: 8, title: t("Add the wheel and test orbits", "Lägg till hjulet och testa omloppsbanan"), description: t("Mount a Wheel as the Earth sphere. Turn the main shaft — Earth orbits, Moon follows!", "Montera ett hjul som Jordsféren. Vrid huvudaxeln — Jorden kretsar, Månen följer!"), components: ["Wheel x1", "CH2 x2"] },
      ],
    },
    challenge: { title: t("Track Day and Night", "Följ dag och natt"), description: t("Use your model to show day and night. How long is one day? One revolution?", "Visa dag och natt med din modell. Hur lång är ett dygn? Ett år?"), hint: t("Mark one point on Earth as your house. How many rotations = one orbit?", "Markera en punkt på Jorden som ditt hus. Hur många rotationer = ett omloppsbana?") },
    lgr22: { strands: ["fys_kraft", "fys_sol"], rawSpreadsheet: "Lgr22 1–3: Fysik – Kraft & rörelse; Fysik – Solsystemet & himlakroppar" },
    sdgs: [4, 13],
  },

  // Ch21
  {
    id: 21, slug: "find-the-path", isCheckpoint: false,
    title: t("Find the Path", "Hitta vägen"),
    subtitle: t("Crack a number code at a crossroads", "Knäck en sifferkod vid ett vägskäl"),
    story: {
      intro: t("The team reaches a four-way crossroads with no signpost. A coded message on a stone points to the right path — but only if they can decode it.", "Laget når ett fyrvägskors utan skylt. Ett kodat meddelande på en sten pekar på rätt väg — men bara om de kan avkoda det."),
      dialogue: [
        { speaker: "Rob",  text: t("The stone shows: 2, 4, 8, 16, ?, 64. What comes next — find the pattern!", "Stenen visar: 2, 4, 8, 16, ?, 64. Vad kommer härnäst — hitta mönstret!") },
        { speaker: "Kit",  text: t("Each number doubles! 2×2=4, 4×2=8, 8×2=16 — so the answer is 32!", "Varje tal fördubblas! 2×2=4, 4×2=8, 8×2=16 — så svaret är 32!") },
        { speaker: "Laya", text: t("The code says: go north if the answer is below 40. It's 32, so we go north!", "Koden säger: gå norrut om svaret är under 40. Det är 32, så vi går norrut!") },
        { speaker: "Rob",  text: t("Number patterns are everywhere in nature — petals, spirals, even rabbit populations!", "Talmönster finns överallt i naturen — kronblad, spiraler, till och med kaninpopulationer!") },
      ],
      conclusion: t("The pattern leads them north — maths opens every door!", "Mönstret leder dem norrut — matte öppnar varje dörr!"),
    },
    theory: {
      concept: t("Number sequences & pattern recognition", "Talföljder & mönsterigenkänning"),
      explanation: t("Number sequences are everywhere — puzzles, codes, even nature. To crack a riddle, find the pattern: doubling, halving, adding, subtracting, or something more hidden.", "Talföljder finns överallt — pussel, koder, till och med naturen. För att knäcka en gåta, hitta mönstret: fördubbla, halvera, addera, subtrahera eller något mer gömt."),
      realWorldExamples: [
        t("Fibonacci sequence appears in sunflower seed spirals", "Fibonacci-sekvensen förekommer i solrosfröets spiraler"),
        t("Computer binary code uses doubling sequences: 1, 2, 4, 8, 16...", "Datorns binärkod använder fördubblingssekvenser: 1, 2, 4, 8, 16..."),
        t("Music rhythms use repeating patterns of beats", "Musikrytmer använder upprepande mönster av slag"),
      ],
      newWords: [t("Sequence", "Sekvens"), t("Pattern", "Mönster"), t("Fibonacci", "Fibonacci"), t("Algorithm", "Algoritm")],
    },
    build: {
      modelName: t("Number Code Builder", "Sifferkodsbyggare"),
      description: t("Use Blix pieces as physical number tokens to represent and solve number sequences.", "Använd Blix-bitar som fysiska siffertokens för att representera och lösa talföljder."),
      totalSteps: 1,
      steps: [
        { stepNumber: 1, title: t("Build and solve number sequences", "Bygg och lös talföljder"), description: t("Use P3=3, P5=5, P7=7, P11=11 as tokens. Lay them in a pattern sequence. Find what comes next. Challenge a friend to guess!", "Använd P3=3, P5=5, P7=7, P11=11 som tokens. Lägg dem i ett mönster. Hitta vad som kommer härnäst. Utmana en kompis att gissa!"), components: ["P3 x4", "P5 x4", "P7 x4", "P11 x4"] },
      ],
    },
    challenge: { title: t("The Third-Digit Code", "Tredje-sifferkoden"), description: t("Take 4 seven-digit numbers. Read the third digit of each — that's your code!", "Ta 4 sjusiffriga tal. Läs tredje siffran av var och ett — det är din kod!"), hint: t("Try making your own code using Blix hole-counts as cipher values.", "Prova att göra din egen kod med Blix-hålräkningar som chiffervärden.") },
    lgr22: { strands: ["mat_tal"], rawSpreadsheet: "Lgr22 1–3: Matematik – Tal, algebra, mönster & statistik" },
    sdgs: [4],
  },

  // Ch22
  {
    id: 22, slug: "challenge-foldable-scale", isCheckpoint: true,
    title: t("Challenge: Foldable Scale", "Utmaning: Hopfällbar linjal"),
    subtitle: t("Help a farmer measure his land precisely", "Hjälp en bonde mäta sin mark exakt"),
    story: {
      intro: t("A farmer needs to measure his fields to sell them fairly, but his old measuring rope has snapped. The team builds a foldable Blix ruler.", "En bonde måste mäta sina åkrar för att sälja dem rättvist, men hans gamla mätsträng har gått av. Laget bygger en hopfällbar Blix-linjal."),
      dialogue: [
        { speaker: "Farmer", text: t("I need to measure exactly 10 metres — not a centimetre more or less!", "Jag måste mäta exakt 10 meter — inte en centimeter mer eller mindre!") },
        { speaker: "Laya",   text: t("Blix holes are exactly 1 cm apart. P11 = 11 cm. Five P11 pieces = 55 cm!", "Blix-hål är exakt 1 cm isär. P11 = 11 cm. Fem P11-bitar = 55 cm!") },
        { speaker: "Kit",    text: t("Standard units like centimetres let anyone in the world share measurements accurately.", "Standardenheter som centimeter låter vem som helst i världen dela mätningar exakt.") },
        { speaker: "Laya",   text: t("Fold the ruler to carry it easily. Unfold to measure. Simple and accurate!", "Vik ihop linjalen för att bära den lätt. Vik ut för att mäta. Enkelt och exakt!") },
      ],
      conclusion: t("The farmer measures his field precisely — standard units make the world fair!", "Bonden mäter sin åker exakt — standardenheter gör världen rättvis!"),
    },
    theory: {
      concept: t("Standard measurement units", "Standardmätenheter"),
      explanation: t("1 metre = 100 cm. Blix holes are 1 cm apart — a perfect ruler! Standard units let people anywhere share measurements and build things together without confusion.", "1 meter = 100 cm. Blix-hål ligger 1 cm isär — en perfekt linjal! Standardenheter låter människor överallt dela mätningar och bygga saker tillsammans utan förvirring."),
      realWorldExamples: [
        t("All countries agreed on the metre system so trade is fair everywhere", "Alla länder enades om metersystemet så att handel är rättvis överallt"),
        t("Carpenters use millimetres for precise cuts in woodworking", "Snickare använder millimeter för exakta snitt i trä"),
        t("Scientists worldwide use SI units to share research results", "Forskare världen över använder SI-enheter för att dela forskningsresultat"),
      ],
      newWords: [t("Standard unit", "Standardenhet"), t("Metre", "Meter"), t("Centimetre", "Centimeter"), t("Perimeter", "Omkrets")],
    },
    build: {
      modelName: t("Foldable Scale", "Hopfällbar linjal"),
      description: t("Build a foldable ruler from P11 beams and hinge connectors.", "Bygg en hopfällbar linjal av P11-balkar och gångjärnkopplingar."),
      totalSteps: 1,
      steps: [
        { stepNumber: 1, title: t("Build the foldable ruler", "Bygg den hopfällbara linjalen"), description: t("Connect five P11 beams end-to-end with Hinge connectors so it folds accordion-style. Each P11 = 11 cm. Full length = 55 cm.", "Anslut fem P11-balkar ände-till-ände med gångjärnkopplingar så det viks dragspelsstil. Varje P11 = 11 cm. Full längd = 55 cm."), components: ["P11 x5", "Hinges x1"] },
      ],
    },
    challenge: { title: t("Measure Like a Surveyor", "Mät som en lantmätare"), description: t("Measure your table's perimeter and area. Length × Width = area!", "Mät bordets omkrets och yta. Längd × Bredd = yta!"), hint: t("Perimeter = all sides added together. Area = length × width.", "Omkrets = alla sidor ihopaddade. Yta = längd × bredd.") },
    lgr22: { strands: ["mat_tal"], rawSpreadsheet: "Lgr22 1–3: Matematik – Tal, algebra, mönster & statistik" },
    sdgs: [2, 4, 8],
  },

  // Ch23
  {
    id: 23, slug: "weight-measuring-device", isCheckpoint: false,
    title: t("Weight Measuring Device", "Vägningsapparat"),
    subtitle: t("Build a balance scale to weigh grains", "Bygg en balansvåg för att väga säd"),
    story: {
      intro: t("A farmer needs to weigh grain to sell it fairly at the market. The team builds a balance scale from Blix pieces.", "En bonde måste väga säd för att sälja den rättvist på marknaden. Laget bygger en balansvåg av Blix-bitar."),
      dialogue: [
        { speaker: "Farmer", text: t("I need to know exactly how many grams of grain are in each sack for the market!", "Jag måste veta exakt hur många gram säd som finns i varje säck för marknaden!") },
        { speaker: "Rob",    text: t("A balance scale compares masses. When both pans are level, the weights are equal!", "En balansvåg jämför massor. När båda skålarna är jämna är vikterna lika!") },
        { speaker: "Kit",    text: t("Place known weights on one side and grain on the other. When it balances — you know the mass!", "Lägg kända vikter på ena sidan och säden på den andra. När det balanserar — vet du massan!") },
        { speaker: "Laya",   text: t("Balance scales were used in ancient Egypt and are still used in chemistry labs today!", "Balansvågar användes i antikens Egypten och används fortfarande i kemilabb idag!") },
      ],
      conclusion: t("Every sack is weighed precisely — fairness at the market starts with a good balance!", "Varje säck vägs exakt — rättvisa på marknaden börjar med en bra balans!"),
    },
    theory: {
      concept: t("Balance & mass comparison", "Balans & massajämförelse"),
      explanation: t("A balance compares two weights. Equal = level. Place reference weights on one side and find the mass of the unknown object on the other. Used for thousands of years!", "En balansvåg jämför två vikter. Lika = vågrät. Lägg referensvikter på ena sidan och hitta massan av det okända föremålet på andra. Använd i tusentals år!"),
      realWorldExamples: [
        t("Chemists use precision balances to measure tiny amounts of substances", "Kemister använder precisionsvågar för att mäta winziga mängder ämnen"),
        t("Grocers use scales to weigh fruit and vegetables for customers", "Grönsakshandlare använder vågar för att väga frukt och grönsaker"),
        t("Justice is symbolised by scales — equal weight = fair treatment", "Rättvisa symboliseras av vågar — lika vikt = rättvis behandling"),
      ],
      newWords: [t("Mass", "Massa"), t("Balance", "Balans"), t("Fulcrum", "Vridpunkt"), t("Calibrate", "Kalibrera")],
    },
    build: {
      modelName: t("Balance Weighing Scale", "Balansvåg"),
      description: t("Build a pivot-arm balance scale with two hanging pans.", "Bygg en pivotarmsbalansvåg med två hängande skålar."),
      totalSteps: 7,
      steps: [
        { stepNumber: 1, title: t("Build the base support", "Bygg basstödet"), description: t("Assemble two P7x11 pillars as the base and vertical support of the scale.", "Montera två P7x11-pelare som basen och det vertikala stödet för vågen."), components: ["P7x11 x2", "CT2 x4"] },
        { stepNumber: 2, title: t("Build the upright column", "Bygg den upprätta kolumnen"), description: t("Stack P11 beams vertically supported by CT3 connectors.", "Stapla P11-balkar vertikalt stödda av CT3-kopplingar."), components: ["P11 x4", "CT3 x4"] },
        { stepNumber: 3, title: t("Add the pivot mount", "Lägg till pivothållaren"), description: t("Attach TW1 connectors at the top of the column as the balance arm pivot.", "Fäst TW1-kopplingar i toppen av kolumnen som balanarmens pivot."), components: ["TW1 x4", "P5 x2"] },
        { stepNumber: 4, title: t("Build the balance beam", "Bygg balansbalkens arm"), description: t("Connect two P11 beams end-to-end as the long balance arm.", "Anslut två P11-balkar ände-till-ände som den långa balansbalkens arm."), components: ["P11 x4", "CT2 x4"] },
        { stepNumber: 5, title: t("Mount the balance arm on pivot", "Montera balansbalkens arm på pivot"), description: t("Thread the balance arm through the TW1 pivot mounts so it can swing freely.", "Trä balansbalkens arm genom TW1-pivothållarna så den kan svänga fritt."), components: ["TW1 x4"] },
        { stepNumber: 6, title: t("Build the scale pans", "Bygg vågskålarna"), description: t("Use P5 beams as the flat pan surfaces. Attach with CT2 connectors as the pan frame.", "Använd P5-balkar som de platta skålytan. Fäst med CT2-kopplingar som vågskålramen."), components: ["P5 x6", "CT2 x2"] },
        { stepNumber: 7, title: t("Hang pans and calibrate", "Häng skålarna och kalibrera"), description: t("Attach pans to each end of the balance arm. Add equal weights — does it level? Test with a coin on one side!", "Fäst skålarna i varje ände av balansbalkens arm. Lägg lika vikter — nivellar det? Testa med ett mynt på ena sidan!"), components: ["CT3 x4"] },
      ],
    },
    challenge: { title: t("Weighing Game", "Vägningsspel"), description: t("Use your scale to estimate the mass of a small toy. Guess before measuring!", "Använd din våg för att uppskatta massan av en liten leksak. Gissa innan du mäter!"), hint: t("Use Blix pieces as reference weights: P11 ≈ 5g, P7 ≈ 3g, P5 ≈ 2g.", "Använd Blix-bitar som referensvikter: P11 ≈ 5g, P7 ≈ 3g, P5 ≈ 2g.") },
    lgr22: { strands: ["tek_mek", "mat_tal"], rawSpreadsheet: "Lgr22 1–3: Teknik – Mekanismer & konstruktioner; Matematik – Tal" },
    sdgs: [2, 8, 12],
  },

  // Ch24
  {
    id: 24, slug: "plowing-machine", isCheckpoint: false,
    title: t("Plowing Machine", "Plogmaskin"),
    subtitle: t("Use a motor to plow the farmer's field", "Använd en motor för att plöja bondens åker"),
    story: {
      intro: t("The farmer's field is full of weeds and must be plowed before spring. Manual plowing takes days — the team builds a motorized plow.", "Bondens åker är full av ogräs och måste plöjas inför våren. Manuell plöjning tar dagar — laget bygger en motoriserad plog."),
      dialogue: [
        { speaker: "Farmer", text: t("Plowing by hand takes all week. My back is aching already just thinking about it!", "Att plöja för hand tar hela veckan. Ryggen värker redan bara av tanken!") },
        { speaker: "Laya",   text: t("A motor converts electrical energy into rotation. The rotation drives wheels, which pull the plow.", "En motor omvandlar elektrisk energi till rotation. Rotationen driver hjul som drar plogen.") },
        { speaker: "Rob",    text: t("The battery box stores energy. Connect it to the motor and energy flows — the plow moves!", "Batterilådan lagrar energi. Anslut den till motorn och energi flödar — plogen rör sig!") },
        { speaker: "Kit",    text: t("Tractors use exactly this principle — a big motor driving big wheels with great force.", "Traktorer använder exakt denna princip — en stor motor som driver stora hjul med stor kraft.") },
      ],
      conclusion: t("The field is plowed in minutes — electric motors change everything!", "Åkern är plöjd på minuter — elektriska motorer förändrar allt!"),
    },
    theory: {
      concept: t("Electric motor & energy conversion", "Elektrisk motor & energiomvandling"),
      explanation: t("A motor converts electricity from a battery into rotation. The rotation drives wheels, which pull the plow. Tractors and lawn mowers work the same way.", "En motor omvandlar el från ett batteri till rotation. Rotationen driver hjul som drar plogen. Traktorer och gräsklippare fungerar likadant."),
      realWorldExamples: [
        t("Electric cars use large motors instead of petrol engines", "Elbilar använder stora motorer istället för bensinmotorer"),
        t("Wind turbines use the opposite — rotation makes electricity!", "Vindkraftverk gör det omvända — rotation skapar elektricitet!"),
        t("Washing machines use motors to spin the drum", "Tvättmaskiner använder motorer för att snurra trumman"),
      ],
      newWords: [t("Motor", "Motor"), t("Battery", "Batteri"), t("Electrical energy", "Elektrisk energi"), t("Conversion", "Omvandling")],
    },
    build: {
      modelName: t("Motorized Plowing Machine", "Motoriserad plogmaskin"),
      description: t("Build a motorized vehicle with four wheels and a plow attachment.", "Bygg ett motoriserat fordon med fyra hjul och en ploginfästning."),
      totalSteps: 4,
      steps: [
        { stepNumber: 1, title: t("Build the chassis frame", "Bygg chassiets ram"), description: t("Assemble CH2 connectors and CT3 pieces as the sturdy vehicle chassis.", "Montera CH2-kopplingar och CT3-bitar som det robusta fordonschassis."), components: ["CH2 x6", "CT3 x4", "CT2 x3", "PU5x13 x1"] },
        { stepNumber: 2, title: t("Mount wheels and axles", "Montera hjul och axlar"), description: t("Thread SH100 shafts through TW1 holders. Attach Wheel-without-tires on all four axle ends.", "Trä SH100-axlar genom TW1-hållare. Fäst Hjul-utan-däck på alla fyra axelns ändar."), components: ["SH100 x3", "TW1 x8", "Wheel w/o tires x4"] },
        { stepNumber: 3, title: t("Attach the motor", "Fäst motorn"), description: t("Connect the Motor with Battery Box to the rear axle drive position.", "Anslut Motor with Battery Box till drivaxelns bakre position."), components: ["Motor with Battery Box x1", "CH2 x3", "P5 x1", "P3 x1", "P3 Plus x2"] },
        { stepNumber: 4, title: t("Build the plow and test", "Bygg plogen och testa"), description: t("Attach mudguards as the plow blades at the front. Switch on — does it drive forward?", "Fäst stänkskärmar som plogblad framtill. Slå på — kör det framåt?"), components: ["Mudguard Left x2", "Mudguard Right x2", "CT3 x2"] },
      ],
    },
    challenge: { title: t("Observation Time", "Observationsdags"), description: t("Connect battery → motor → switch on. What do you observe? What happens if you reverse the wires?", "Anslut batteri → motor → slå på. Vad observerar du? Vad händer om du vänder trådarna?"), hint: t("Reversing the battery connections reverses the motor direction!", "Att vända batteriets anslutningar vänder motorns riktning!") },
    lgr22: { strands: ["fys_el"], rawSpreadsheet: "Lgr22 1–3: Fysik – Elektricitet & magnetism" },
    sdgs: [2, 9, 12],
  },

  // Ch25
  {
    id: 25, slug: "challenge-goalkeeper-kicker", isCheckpoint: true,
    title: t("Challenge: Goalkeeper & Kicker", "Utmaning: Målvakt & sparkare"),
    subtitle: t("Score 5 goals to rescue the horse!", "Gör 5 mål för att rädda hästen!"),
    story: {
      intro: t("A horse is trapped behind a gate that only opens when the team scores 5 goals against a goalkeeper robot. Game on!", "En häst är instängd bakom en grind som bara öppnas när laget gör 5 mål mot en målvaktsrobot. Dags att spela!"),
      dialogue: [
        { speaker: "Kit",      text: t("Strategy time! I'll aim for the bottom corners — hardest for the goalkeeper to reach.", "Strategidags! Jag siktar på de nedre hörnen — svårast för målvakten att nå.") },
        { speaker: "Rob",      text: t("I'll build the goalkeeper with a wide flat arm — more coverage area means harder to score!", "Jag bygger målvakten med en bred platt arm — större täckningsyta = svårare att göra mål!") },
        { speaker: "Laya",     text: t("Building a good kicker is also engineering — the right gear ratio gives the perfect kick force.", "Att bygga en bra sparkare är också teknik — rätt kugghjulsförhållande ger den perfekta sparkkraften.") },
        { speaker: "Narrator", text: t("Two engineers, one ball, five goals to score. May the best builder win!", "Två ingenjörer, en boll, fem mål att göra. Måtte den bäste byggaren vinna!") },
      ],
      conclusion: t("5 goals scored — the gate opens and the horse gallops free!", "5 mål gjorda — grinden öppnas och hästen galoppar fri!"),
    },
    theory: {
      concept: t("Strategy & design thinking (Checkpoint)", "Strategi & designtänkande (Avstämning)"),
      explanation: t("Competitive games involve strategy — planning to overcome an opponent. Building a Blix player is also strategy: which gears? Which leg shape? What kick angle gives maximum power?", "Tävlingsspel handlar om strategi — planera för att övervinna en motståndare. Att bygga en Blix-spelare är också strategi: vilka kugghjul? Vilken benform? Vilken sparkvinkel ger maximal kraft?"),
      realWorldExamples: [
        t("Football coaches use data analytics to plan winning strategies", "Fotbollstränare använder dataanalys för att planera vinnande strategier"),
        t("Chess is pure strategy — planning many moves ahead", "Schack är ren strategi — planera många drag framåt"),
        t("Engineers design machines with strategy: strength, weight, cost", "Ingenjörer designar maskiner strategiskt: styrka, vikt, kostnad"),
      ],
      newWords: [t("Strategy", "Strategi"), t("Teamwork", "Lagarbete"), t("Optimise", "Optimera"), t("Iterate", "Iterera")],
    },
    build: {
      modelName: t("Football Player", "Fotbollsspelare"),
      description: t("Build a kicker and goalkeeper for a two-player robot football match.", "Bygg en sparkare och målvakt för en tvåspelares robotfotbollsmatch."),
      totalSteps: 1,
      steps: [
        { stepNumber: 1, title: t("Build kicker and goalkeeper robots", "Bygg sparkar- och målvaktsrobotar"), description: t("Build a kicker with a lever-arm kick mechanism and a goalkeeper with a wide blocking arm. Use gears to control kick power. Play the match — first to 5 goals wins!", "Bygg en sparkare med en hävstångsarmsparkmekanism och en målvakt med en bred blockeringsarm. Använd kugghjul för att kontrollera sparkkraften. Spela matchen — den som gör 5 mål vinner!"), components: ["CT3 x4", "P11 x2", "CT2 x4", "P7 x2"] },
      ],
    },
    challenge: { title: t("Score 5 Goals", "Gör 5 mål"), description: t("Two-player game: one is goalkeeper, the other is striker. Striker must score 5!", "Tvåspelarspel: en målvakt, en anfallare. Anfallaren måste göra 5 mål!"), hint: t("Aim for the corners — most goalkeepers can't cover the full width!", "Sikta på hörnen — de flesta målvakter kan inte täcka hela bredden!") },
    lgr22: { strands: ["tva"], rawSpreadsheet: "Lgr22 1–3: Tvärvetenskapligt arbetsområde" },
    sdgs: [3, 5, 17],
  },

  // Ch26
  {
    id: 26, slug: "clock", isCheckpoint: false,
    title: t("Clock", "Klocka"),
    subtitle: t("Build an analogue clock face and read the time", "Bygg en analog urtavla och läs av tiden"),
    story: {
      intro: t("Rob keeps missing meals because there is no clock at the campsite. Kit decides to build an analogue Blix clock so the whole team stays on schedule.", "Rob missar ständigt måltiderna för det finns ingen klocka på campingplatsen. Kit bestämmer sig för att bygga en analog Blix-klocka så att hela laget håller schemat."),
      dialogue: [
        { speaker: "Kit",  text: t("A clock face has 12 hour positions and 60 minute marks. The short hand shows hours, long hand shows minutes.", "En urtavla har 12 timpositioner och 60 minutmarkeringar. Den korta visaren visar timmar, den långa visaren minuter.") },
        { speaker: "Laya", text: t("Gear ratios make the minute hand turn 12 times for every one turn of the hour hand.", "Kugghjulsförhållanden gör att minutvisaren vrids 12 gånger för varje ett varv av timvisaren.") },
        { speaker: "Rob",  text: t("So if the minute hand goes all the way round once, the hour hand only moves one hour position. Smart!", "Alltså om minutvisaren går runt en gång, rör sig timvisaren bara en timpostion. Smart!") },
        { speaker: "Kit",  text: t("Now Rob has no excuse for missing dinner. 6 o'clock — time to eat!", "Nu har Rob ingen ursäkt för att missa middagen. Klockan 6 — dags att äta!") },
      ],
      conclusion: t("The clock ticks perfectly — time management is the ultimate life skill!", "Klockan tickar perfekt — tidshantering är den ultimata livskunskapen!"),
    },
    theory: {
      concept: t("Time reading & clock mechanisms", "Tidsavläsning & klockmekanismer"),
      explanation: t("Time is measured in hours (60 minutes), minutes (60 seconds) and seconds. A clock face has 12 hours, with the small hand for hours and the long hand for minutes. Gear ratios make the hands move at different speeds.", "Tid mäts i timmar (60 minuter), minuter (60 sekunder) och sekunder. En urtavla har 12 timmar, med liten visare för timmar och stor visare för minuter. Kugghjulsförhållanden gör att visarna rör sig med olika hastigheter."),
      realWorldExamples: [
        t("Grandfather clocks use a pendulum to regulate the gear movement", "Morfarsur använder ett pendel för att reglera kugghjulsrörelsen"),
        t("Church bells ring every hour — a clock mechanism triggers them", "Kyrkklockor ringer varje timme — en klockmekanism utlöser dem"),
        t("Atomic clocks are so precise they lose only one second per 300 million years", "Atomur är så exakta att de tappar bara en sekund per 300 miljoner år"),
      ],
      newWords: [t("Hour hand", "Timvisare"), t("Minute hand", "Minutvisare"), t("Clockwise", "Medurs"), t("Analogue", "Analog")],
    },
    build: {
      modelName: t("Analogue Clock Face", "Analog urtavla"),
      description: t("Build a Blix clock face with hour and minute positions.", "Bygg en Blix-urtavla med tim- och minutpositioner."),
      totalSteps: 1,
      steps: [
        { stepNumber: 1, title: t("Build the clock face", "Bygg urtavlan"), description: t("Build a circular arrangement with 12 P3 pieces as hour markers. Use two Blix arms as the clock hands. Practice showing different times!", "Bygg ett cirkulärt arrangemang med 12 P3-bitar som timmarkerare. Använd två Blix-armar som klockvisare. Öva på att visa olika tider!"), components: ["P3 x8", "P5 x4", "CT2 x4", "P7 x2"] },
      ],
    },
    challenge: { title: t("Time Yourself", "Ta tid på dig själv"), description: t("How long does it take you to build a Blix tower? Time it and try to beat your record!", "Hur länge tar det att bygga ett Blix-torn? Ta tid och försök slå ditt rekord!"), hint: t("5 minutes = minute hand at 12 → 1. Can you build a tower that fast?", "5 minuter = minutvisare vid 12 → 1. Kan du bygga ett torn det fort?") },
    lgr22: { strands: ["mat_tal"], rawSpreadsheet: "Lgr22 1–3: Matematik – Tal, algebra, mönster & statistik" },
    sdgs: [4],
  },

  // Ch27
  {
    id: 27, slug: "first-circuit", isCheckpoint: false,
    title: t("Make Your First Circuit", "Bygg din första krets"),
    subtitle: t("Discover electricity with Queaky", "Upptäck elektricitet med Queaky"),
    story: {
      intro: t("Laya discovers Queaky — a strange device that makes noise when its two ears are touched together. The team investigates electricity.", "Laya hittar Queaky — ett märkligt redskap som gör ljud när dess två öron rörs ihop. Laget undersöker elektricitet."),
      dialogue: [
        { speaker: "Laya", text: t("When I touch Queaky's ears together it screams! When I let go, it stops. Why?", "När jag rör Queasky's öron ihop skriker den! När jag släpper stannar det. Varför?") },
        { speaker: "Rob",  text: t("Electricity needs a complete loop — a closed circuit — to flow. You completed the circuit!", "Elektricitet behöver en komplett slinga — en sluten krets — för att flöda. Du avslutade kretsen!") },
        { speaker: "Kit",  text: t("Break the loop anywhere and electricity stops — that's how every light switch works!", "Bryt slingan var som helst och elektriciteten stannar — det är hur varje strömbrytare fungerar!") },
        { speaker: "Laya", text: t("So a switch is just a gap in the circuit that I can close or open. Brilliant!", "Alltså är en strömbrytare bara ett gap i kretsen som jag kan stänga eller öppna. Lysande!") },
      ],
      conclusion: t("Queaky teaches the team everything about circuits — electricity is alive!", "Queaky lär laget allt om kretsar — elektriciteten lever!"),
    },
    theory: {
      concept: t("Open and closed electrical circuits", "Öppna och slutna elektriska kretsar"),
      explanation: t("Electricity needs a complete loop (closed circuit) to flow. Disconnect a wire = open circuit = electricity stops. Queaky shouts when its two ears are connected — the loop is complete!", "El behöver en komplett slinga (sluten krets) för att flöda. Koppla isär en tråd = öppen krets = elen stannar. Queaky skriker när dess två öron är förbundna — slingan är komplett!"),
      realWorldExamples: [
        t("A light switch opens and closes the circuit to turn lights on and off", "En strömbrytare öppnar och stänger kretsen för att tända och släcka lampor"),
        t("A doorbell circuit closes when you press the button", "En dörrklockskrets stängs när du trycker på knappen"),
        t("A torch battery, wires, bulb and switch form a complete circuit", "En ficklampas batteri, trådar, glödlampa och strömbrytare bildar en komplett krets"),
      ],
      newWords: [t("Circuit", "Krets"), t("Open circuit", "Öppen krets"), t("Closed circuit", "Sluten krets"), t("Switch", "Strömbrytare")],
    },
    build: {
      modelName: t("Queaky Circuit", "Queaky-krets"),
      description: t("Build a simple circuit using Queaky as the detector.", "Bygg en enkel krets med Queaky som detektor."),
      totalSteps: 3,
      steps: [
        { stepNumber: 1, title: t("Prepare the circuit holder", "Förbered kretshållaren"), description: t("Build a flat platform using P21x21 as the circuit base board. Mount PU5x7 pillars as component holders.", "Bygg en plan plattform med P21x21 som kretskortet. Montera PU5x7-pelare som komponenthållare."), components: ["PU5x7 x2"] },
        { stepNumber: 2, title: t("Mount Queaky and wire up", "Montera Queaky och anslut"), description: t("Place Queaky on the platform. Connect alligator clips or CT3 connectors to Queaky's two ear positions.", "Placera Queaky på plattformen. Anslut krokodilklämmor eller CT3-kopplingar till Queasky's två öronpositioner."), components: ["Queaky x1", "CT3 x2", "SH60 x1"] },
        { stepNumber: 3, title: t("Complete the circuit and test open/closed", "Avsluta kretsen och testa öppen/sluten"), description: t("Touch the two wire ends together → Queaky screams (closed circuit). Separate them → silence (open circuit). Test both states!", "Rör de två trådändarna ihop → Queaky skriker (sluten krets). Separera dem → tystnad (öppen krets). Testa båda tillstånden!"), components: [] },
      ],
    },
    challenge: { title: t("Open / Closed Circuit", "Öppen / sluten krets"), description: t("Demonstrate open vs closed circuit with Queaky. Use your body as a conductor — hold one wire in each hand!", "Visa öppen vs sluten krets med Queaky. Använd din kropp som ledare — håll en tråd i varje hand!"), hint: t("Wet hands conduct better than dry hands — does Queaky scream louder?", "Blöta händer leder bättre än torra — skriker Queaky högre?") },
    lgr22: { strands: ["fys_el"], rawSpreadsheet: "Lgr22 1–3: Fysik – Elektricitet & magnetism" },
    sdgs: [4, 7],
  },

  // Ch28
  {
    id: 28, slug: "conductors-insulators", isCheckpoint: false,
    title: t("Conductors & Insulators", "Ledare & isolatorer"),
    subtitle: t("Test materials that let electricity pass", "Testa material som släpper igenom el"),
    story: {
      intro: t("Rob wonders why some things let electricity through and others don't. The team builds a tester and investigates everyday materials.", "Rob undrar varför en del saker släpper igenom el och andra inte. Laget bygger en testare och undersöker vardagsmaterial."),
      dialogue: [
        { speaker: "Rob",  text: t("Why does Queaky scream when I touch the metal coin but not the rubber eraser?", "Varför skriker Queaky när jag rör vid myntet men inte vid gummisuddgummit?") },
        { speaker: "Kit",  text: t("Conductors like metals have free electrons that can carry electric current easily.", "Ledare som metaller har fria elektroner som lätt kan bära elektrisk ström.") },
        { speaker: "Laya", text: t("Insulators like rubber, wood and plastic hold their electrons tightly — no flow!", "Isolatorer som gummi, trä och plast håller sina elektroner tätt — inget flöde!") },
        { speaker: "Rob",  text: t("That's why wires have copper inside (conductor) and plastic outside (insulator) — safe and functional!", "Det är därför sladdar har koppar inuti (ledare) och plast utanpå (isolator) — säkra och funktionella!") },
      ],
      conclusion: t("The team tests 10 materials — conductors and insulators revealed!", "Laget testar 10 material — ledare och isolatorer avslöjas!"),
    },
    theory: {
      concept: t("Conductors & insulators", "Ledare & isolatorer"),
      explanation: t("Conductors let electricity pass (most metals). Insulators block it (wood, rubber, plastic). Wires have copper inside (conductor) and plastic outside (insulator) — current flows but you don't get shocked!", "Ledare släpper igenom el (de flesta metaller). Isolatorer blockerar den (trä, gummi, plast). Sladdar har koppar inuti (ledare) och plast utanpå (isolator) — strömmen flödar men du får inte stöt!"),
      realWorldExamples: [
        t("Copper wire conducts electricity in all our appliances", "Kopparsladdar leder elektricitet i alla våra apparater"),
        t("Rubber gloves protect electricians from electric shocks", "Gummihandskar skyddar elektriker från elektriska stötar"),
        t("Glass is an insulator — that's why electricity poles use glass insulators", "Glas är en isolator — det är därför elstolpar använder glasisolatorer"),
      ],
      newWords: [t("Conductor", "Ledare"), t("Insulator", "Isolator"), t("Electron", "Elektron"), t("Current", "Ström")],
    },
    build: {
      modelName: t("Conductor/Insulator Test Rig", "Lednings-/isolatortestrigg"),
      description: t("Build a test rig using Queaky to classify everyday materials.", "Bygg ett testriggsystem med Queaky för att klassificera vardagsmaterial."),
      totalSteps: 1,
      steps: [
        { stepNumber: 1, title: t("Build the material test rig", "Bygg materialtestriggen"), description: t("Mount P21x21 as the base. Attach PU5x7 pillars as object holders. Connect Queaky via CT3 and SH60 as the test circuit. Place each material between the contacts — does Queaky scream?", "Montera P21x21 som basen. Fäst PU5x7-pelare som objekthållare. Anslut Queaky via CT3 och SH60 som testkretsen. Placera varje material mellan kontakterna — skriker Queaky?"), components: ["P21x21 x1", "PU5x7 x2", "CT3 x4", "SH60 x1", "Queaky x1"] },
      ],
    },
    challenge: { title: t("Conductor or Insulator?", "Ledare eller isolator?"), description: t("Test paper (dry/wet), coin, eraser, spoon. Predict before testing!", "Testa papper (torrt/blött), mynt, suddgummi, sked. Gissa innan du testar!"), hint: t("Wet paper conducts better than dry paper — why do you think that is?", "Blött papper leder bättre än torrt papper — varför tror du det är så?") },
    lgr22: { strands: ["tva"], rawSpreadsheet: "Lgr22 1–3: Tvärvetenskapligt arbetsområde" },
    sdgs: [4, 7, 9],
  },

  // Ch29
  {
    id: 29, slug: "paper-plane", isCheckpoint: false,
    title: t("Paper Plane", "Pappersflygplan"),
    subtitle: t("Fold and fly — discover aeronautics", "Vik och flyg — upptäck luftfart"),
    story: {
      intro: t("The team is stuck waiting for a boat crossing. Kit pulls out a sheet of paper and folds the perfect plane — launching it into the wind.", "Laget väntar på en båtöverfart. Kit tar fram ett papper och viker det perfekta planet — och skjuter det ut i vinden."),
      dialogue: [
        { speaker: "Kit",  text: t("A paper plane has three parts: wings for lift, a fuselage to hold it together, and a tail to steer.", "Ett pappersflygplan har tre delar: vingar för lyft, en flygkropp för att hålla ihop det och en stjärt för att styra.") },
        { speaker: "Laya", text: t("Lift happens because air moves faster over the curved top of the wing than under the flat bottom.", "Lyft uppstår eftersom luft rör sig snabbare över den böjda vingsovansidan än under den platta undersidan.") },
        { speaker: "Rob",  text: t("Exactly! That pressure difference creates upward force — that's Bernoulli's principle.", "Exakt! Den tryckcilllskillnaden skapar uppåtkraft — det är Bernoullis princip.") },
        { speaker: "Kit",  text: t("And folding precisely is engineering. Every crease must be sharp for best performance!", "Och att vika exakt är teknik. Varje veck måste vara skarpt för bästa prestanda!") },
      ],
      conclusion: t("Kit's paper plane soars across the river — aeronautics in a sheet of paper!", "Kits pappersplan svävar över floden — luftfart i ett pappersark!"),
    },
    theory: {
      concept: t("Lift & aeronautics (Parts of a plane)", "Lyft & luftfart (Flygplanets delar)"),
      explanation: t("A paper plane has wings (provide lift), a body/fuselage (holds it together), and a tail (steers and stabilises). Folding paper precisely is also engineering — every crease matters!", "Ett pappersflygplan har vingar (lyftkraft), kropp (håller ihop) och stjärt (styrning och stabilitet). Att vika papper exakt är också teknik — varje veck spelar roll!"),
      realWorldExamples: [
        t("Real aircraft have the same three parts: wings, fuselage, tail", "Riktiga flygplan har samma tre delar: vingar, flygkropp, stjärt"),
        t("Birds tuck their wings to dive and spread them to glide", "Fåglar fäller in vingarna för att dyka och breder ut dem för att glida"),
        t("Frisbees use aerodynamics to fly straight and far", "Frisbees använder aerodynamik för att flyga rakt och långt"),
      ],
      newWords: [t("Lift", "Lyft"), t("Fuselage", "Flygkropp"), t("Drag", "Luftmotstånd"), t("Bernoulli", "Bernoulli")],
    },
    build: {
      modelName: t("Paper Plane", "Pappersflygplan"),
      description: t("Fold a precision paper plane and test its aerodynamic performance.", "Vik ett precisionspappersplan och testa dess aerodynamiska prestanda."),
      totalSteps: 1,
      steps: [
        { stepNumber: 1, title: t("Fold and fly your paper plane", "Vik och flyg ditt pappersplan"), description: t("Fold a sheet of A4 paper into a plane with sharp wings and a pointed nose. Mark the wings, fuselage and tail. Launch it from the same spot three times — measure the average distance!", "Vik ett A4-papper till ett plan med skarpa vingar och en spetsig nos. Markera vingarna, flygkroppen och stjärten. Skjuta det från samma plats tre gånger — mät medelavståndet!"), components: [] },
      ],
    },
    challenge: { title: t("Plane Parts Spotter", "Flygplansdelsspanare"), description: t("Identify wings, body, and tail on your paper plane. Try different folds — which flies furthest?", "Hitta vingar, kropp och stjärt på ditt plan. Prova olika vikningar — vilken flyger längst?"), hint: t("Sharper nose = less drag = further flight. But too sharp and it nose-dives!", "Spetsigare nos = mindre luftmotstånd = längre flygning. Men för spetsig och den dyker!") },
    lgr22: { strands: ["tek_design"], rawSpreadsheet: "Lgr22 1–3: Teknik – Designprocess & modeller" },
    sdgs: [4, 9],
  },

  // Ch30
  {
    id: 30, slug: "balloon-rockets", isCheckpoint: false,
    title: t("Balloon Rockets", "Ballongraketer"),
    subtitle: t("Use air pressure to power a rocket car", "Använd lufttryck för att driva en raketbil"),
    story: {
      intro: t("Rob wants to travel to the Moon! The team explains that rockets work by pushing air backwards — and they build a balloon-powered car to prove it.", "Rob vill resa till månen! Laget förklarar att raketer fungerar genom att trycka luft bakåt — och de bygger en ballongdriven bil för att bevisa det."),
      dialogue: [
        { speaker: "Rob",  text: t("How do rockets fly in space if there's no air to push against?", "Hur flyger raketer i rymden om det inte finns luft att trycka mot?") },
        { speaker: "Laya", text: t("Newton's Third Law: every action has an equal and opposite reaction. Air rushes out backwards — rocket goes forwards!", "Newtons tredje lag: varje verkan har en lika stor motverkan. Luft strömmar ut bakåt — raketen åker framåt!") },
        { speaker: "Kit",  text: t("The balloon pushes air out — the air pushes the balloon (and our car) the other way. No air needed outside!", "Ballongen trycker ut luft — luften trycker ballongen (och vår bil) åt andra hållet. Ingen luft behövs utanför!") },
        { speaker: "Rob",  text: t("So our balloon car IS a rocket! Let's build it and race to the North Pole!", "Alltså ÄR vår ballongbil en raket! Bygg den och tävla till Nordpolen!") },
      ],
      conclusion: t("The balloon rocket car zooms across the floor — Newton was right all along!", "Ballongraketbilen svischar över golvet — Newton hade rätt hela tiden!"),
    },
    theory: {
      concept: t("Newton's Third Law — action & reaction", "Newtons tredje lag — verkan & motverkan"),
      explanation: t("Newton's Third Law: every action has an equal and opposite reaction. Air rushing OUT of a balloon (action) pushes the balloon in the OPPOSITE direction (reaction). That's exactly how rockets work!", "Newtons tredje lag: varje verkan har en lika stor motverkan. Luft som strömmar UT ur en ballong (verkan) trycker ballongen åt MOTSATT håll (motverkan). Det är precis hur raketer fungerar!"),
      realWorldExamples: [
        t("Rocket engines burn fuel to push exhaust gas backwards — rocket goes forward", "Raketmotorer bränner bränsle för att trycka avgaser bakåt — raketen åker framåt"),
        t("A fire hose recoils backwards when water shoots forward", "En brandslang rekylar bakåt när vatten skjuts framåt"),
        t("Squid jet propulsion: squirt water backwards to move forward", "Bläckfiskens jetframdrivning: spruta vatten bakåt för att röra sig framåt"),
      ],
      newWords: [t("Action", "Verkan"), t("Reaction", "Motverkan"), t("Thrust", "Tryck"), t("Propulsion", "Framdrivning")],
    },
    build: {
      modelName: t("Balloon Rocket Car", "Ballongraketbil"),
      description: t("Build a wheeled car powered by a balloon — release the air, watch it race!", "Bygg en hjulförsedd bil driven av en ballong — släpp luften, se den tävla!"),
      totalSteps: 6,
      steps: [
        { stepNumber: 1, title: t("Build the car chassis", "Bygg bilchassit"), description: t("Attach two CT2 beams and CT3 connectors as the thin, light car body.", "Fäst två CT2-balkar och CT3-kopplingar som den tunna, lätta bilkroppen."), components: ["CT2 x2", "CT3 x2"] },
        { stepNumber: 2, title: t("Add the axle mounts", "Lägg till axelmonteringen"), description: t("Click TW1 connectors and CH2 pieces as the axle holders on the chassis.", "Klicka TW1-kopplingar och CH2-bitar som axelns hållare på chassit."), components: ["TW1 x6", "CH2 x4"] },
        { stepNumber: 3, title: t("Insert both axles", "Sätt in båda axlarna"), description: t("Slide two SH100 shafts through the TW1 axle mounts, one front, one rear.", "Skjut två SH100-axlar genom TW1-axelns hållare, en fram och en bak."), components: ["SH100 x2"] },
        { stepNumber: 4, title: t("Attach all four wheels", "Fäst alla fyra hjul"), description: t("Press a wheel firmly onto each of the four axle ends.", "Tryck fast ett hjul ordentligt på var och en av de fyra axlarnas ändar."), components: ["Wheel x4"] },
        { stepNumber: 5, title: t("Build the balloon mount", "Bygg ballongmonteringen"), description: t("Use PU5x7 pillar and P5 to create the balloon nozzle holder at the rear.", "Använd PU5x7-pelaren och P5 för att skapa ballongens munstyckhållare baktill."), components: ["PU5x7 x1", "P3 x1"] },
        { stepNumber: 6, title: t("Attach balloon and launch!", "Fäst ballongen och skjut!"), description: t("Stretch the Balloon over the nozzle. Blow it up, pinch the neck, place on the floor — let go and watch it race!", "Sträck Ballongen över munstycket. Blås upp det, nyp om halsen, placera på golvet — släpp och se det tävla!"), components: ["Balloon x1"] },
      ],
    },
    challenge: { title: t("Distance Race", "Avståndstävling"), description: t("Inflate to different sizes. Bigger balloon = longer trip? Race a friend!", "Blås upp olika mycket. Större ballong = längre resa? Tävla med en kompis!"), hint: t("More air = more thrust = further distance. But too heavy = slows down!", "Mer luft = mer tryck = längre avstånd. Men för tungt = bromsar!") },
    lgr22: { strands: ["fys_kraft", "tek_design"], rawSpreadsheet: "Lgr22 1–3: Fysik – Kraft & rörelse; Teknik – Designprocess & modeller" },
    sdgs: [4, 9, 13],
  },
];
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
