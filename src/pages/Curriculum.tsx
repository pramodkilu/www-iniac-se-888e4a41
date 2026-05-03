import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Brain,
  Bot,
  Cpu,
  Code2,
  Boxes,
  Layers,
  Zap,
  Wrench,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Monitor,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Session {
  n: number;
  project: string;
  concept: string;
  conceptColor: string;
  skills: string;
  skolverket: string;
  highlight?: boolean;
}

interface GradeData {
  grade: number;
  stadium: "1–3" | "4–6" | "7–9";
  sessionCount: number;
  sessions: Session[];
}

// ─── Grade data (preserves the existing structure shown in screenshots) ──────
const grades: GradeData[] = [
  {
    grade: 1,
    stadium: "1–3",
    sessionCount: 30,
    sessions: [
      { n: 1, project: "Wheeling Cart", concept: "Simple Machines", conceptColor: "bg-orange-100 text-orange-700", skills: "Scientific literacy, Problem Solving", skolverket: "Lgr22 1–3: Teknik – Mekanismer & konstruktioner" },
      { n: 2, project: "Aerodynamics Car", concept: "Air Friction", conceptColor: "bg-orange-100 text-orange-700", skills: "Scientific literacy, Problem Solving, Critical Thinking", skolverket: "Lgr22 1–3: Fysik – Kraft & rörelse; Digital kompetens – AI, mönsterigenkänning & databehandling" },
      { n: 3, project: "Challenge: Ladder Checkpoint -1", concept: "Checkpoint", conceptColor: "bg-orange-100 text-orange-700", skills: "Problem solving, Creativity, Initiative", skolverket: "Lgr22 1–3: Programmering – Algoritmer, logik & digitala system (Teknik/Matematik)", highlight: true },
      { n: 4, project: "Trebuchet", concept: "Action & Reactions", conceptColor: "bg-orange-100 text-orange-700", skills: "Scientific literacy, Problem Solving, Critical Thinking", skolverket: "Lgr22 1–3: Tvärvetenskapligt arbetsområde" },
      { n: 5, project: "Sign Board", concept: "Coding & Decoding", conceptColor: "bg-orange-100 text-orange-700", skills: "Problem solving, Creativity, Communication", skolverket: "Lgr22 1–3: Programmering – Algoritmer, logik & digitala system (Teknik/Matematik)" },
      { n: 6, project: "Single suspension Car", concept: "Construction Skill", conceptColor: "bg-orange-100 text-orange-700", skills: "Scientific literacy, Critical Thinking", skolverket: "Lgr22 1–3: Tvärvetenskapligt arbetsområde" },
      { n: 7, project: "Most stable tower", concept: "Structure & Base", conceptColor: "bg-orange-100 text-orange-700", skills: "Creativity, Initiative", skolverket: "Lgr22 1–3: Teknik – Mekanismer & konstruktioner" },
      { n: 8, project: "Lift", concept: "Construction Skill", conceptColor: "bg-orange-100 text-orange-700", skills: "Scientific literacy", skolverket: "Lgr22 1–3: Tvärvetenskapligt arbetsområde" },
      { n: 9, project: "Money", concept: "Counting", conceptColor: "bg-orange-100 text-orange-700", skills: "Numeracy", skolverket: "Lgr22 1–3: Matematik – Tal, algebra, mönster & statistik" },
    ],
  },
  { grade: 2, stadium: "1–3", sessionCount: 30, sessions: [] },
  { grade: 3, stadium: "1–3", sessionCount: 30, sessions: [] },
  { grade: 4, stadium: "4–6", sessionCount: 32, sessions: [] },
  { grade: 5, stadium: "4–6", sessionCount: 32, sessions: [] },
  { grade: 6, stadium: "4–6", sessionCount: 32, sessions: [] },
  { grade: 7, stadium: "7–9", sessionCount: 36, sessions: [] },
  { grade: 8, stadium: "7–9", sessionCount: 36, sessions: [] },
];

// ─── Module data (from Blix Educator Set leaflet) ────────────────────────────
interface Module {
  topic: string;
  description: string;
  grade: string;
  qty: string;
  icon: React.ReactNode;
  color: string;
}

const modules: Module[] = [
  {
    topic: "Simple Construction",
    description: "Stories that instil maximum engagement — children build through guided narratives.",
    grade: "1–2",
    qty: "Included",
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
  },
  {
    topic: "Junior Electronics",
    description: "Open & closed loops, earthing, resistance and fun games with the Queaky module.",
    grade: "1–2",
    qty: "2 per kit",
    icon: <Zap className="w-5 h-5" />,
    color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
  },
  {
    topic: "Screenless Coding (Logic Blocks)",
    description: "Build robots and code algorithms with physical interconnecting blocks — no screen required.",
    grade: "3–5",
    qty: "2 per kit",
    icon: <Boxes className="w-5 h-5" />,
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  },
  {
    topic: "Motions & Mechanisms",
    description: "Mechanical advantage, energy, force, power and work — explored hands-on.",
    grade: "3–5",
    qty: "2 per kit",
    icon: <Wrench className="w-5 h-5" />,
    color: "from-orange-500/20 to-amber-500/20 border-orange-500/30",
  },
  {
    topic: "Physics & Mechanics (Marble Stem)",
    description: "Structural integrity, trial-and-error engineering — build, test, iterate.",
    grade: "3–5",
    qty: "Included",
    icon: <Layers className="w-5 h-5" />,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  },
  {
    topic: "Discovering Electricity",
    description: "Voltage, current, AC/DC, resistance, capacitance and electrical power — for real understanding.",
    grade: "3–5",
    qty: "2 per kit",
    icon: <Zap className="w-5 h-5" />,
    color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
  },
  {
    topic: "Discovering Electronics",
    description: "Breadboard-free electronics to learn gates, multiplexers and digital logic.",
    grade: "6–8",
    qty: "2 per kit",
    icon: <Cpu className="w-5 h-5" />,
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  },
  {
    topic: "Block Coding (Boffin Set)",
    description: "Construction followed by block-based coding — bridge the physical and the digital.",
    grade: "6–8",
    qty: "Included",
    icon: <Code2 className="w-5 h-5" />,
    color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
  },
  {
    topic: "C++ Coding (Boffin Set)",
    description: "Construction followed by text-based coding through the Arduino paradigm.",
    grade: "6–8",
    qty: "Included",
    icon: <Code2 className="w-5 h-5" />,
    color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
  },
  {
    topic: "MicroPython (Boffin Set)",
    description: "IoT projects through a Python coding paradigm — sensors, networks, real devices.",
    grade: "6–8",
    qty: "Included",
    icon: <Code2 className="w-5 h-5" />,
    color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  },
  {
    topic: "AI & Machine Learning",
    description: "Train models and build AI projects with the Boffin set — from concept to deployment.",
    grade: "6–8",
    qty: "Included",
    icon: <Brain className="w-5 h-5" />,
    color: "from-pink-500/20 to-purple-500/20 border-pink-500/30",
  },
  {
    topic: "AR/VR through CoSpaces",
    description: "Design 3D objects, 3D environments and mixed reality experiences.",
    grade: "6–8",
    qty: "Software",
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  },
];

// ─── Software tools (from Blix leaflet) ──────────────────────────────────────
interface Tool {
  name: string;
  purpose: string;
  grade: string;
  level: "Intermediate" | "Advanced" | "Intermediate & Advanced";
}

const tools: Tool[] = [
  { name: "Ardublock", purpose: "Block & text coding for Arduino-style hardware", grade: "6–8", level: "Intermediate & Advanced" },
  { name: "Machine Learning", purpose: "Train ML models for student AI projects", grade: "6–8", level: "Intermediate" },
  { name: "Codeskool", purpose: "Train and operate hardware-based AI models", grade: "7–8", level: "Advanced" },
  { name: "Tinkercad", purpose: "Design 3D objects ready for printing", grade: "4–5", level: "Intermediate" },
  { name: "CoSpaces EDU", purpose: "Build VR projects and immersive worlds", grade: "4–5", level: "Intermediate" },
  { name: "Edublocks", purpose: "Learn Python through a block-based drag-and-drop interface", grade: "7–8", level: "Advanced" },
  { name: "Thonny", purpose: "Create Python-operated IoT projects", grade: "7–8", level: "Advanced" },
  { name: "Scratch + CoSpaces", purpose: "Create AR projects and animated stories", grade: "4–5", level: "Intermediate" },
  { name: "INIAC LMS", purpose: "Assignments, assessments and submissions", grade: "1–8", level: "Intermediate" },
];

// ─── Component pieces (structured per-component data from Blix leaflet) ─────
//
// This data model is designed for future AR/AI visualization work.
// Each component carries:
//   • id          — stable slug (used as the asset key for 3D models, AI labels)
//   • code        — printed label on the piece (e.g. "P3", "CT1X2")
//   • name        — human-readable name
//   • qty         — quantity per Educator Set
//   • category    — functional grouping (electronic, structural, mechanical…)
//   • description — what it does / what concept it teaches
//   • assetRef    — placeholder for future 3D model / AR asset path
//   • aiLabel     — placeholder for ML classifier label
//
// When you build the AR scanner or vision model, swap assetRef and aiLabel
// for real paths — the rest of the UI keeps working unchanged.

type ComponentCategory =
  | "logic-block"
  | "passive-electronic"
  | "active-electronic"
  | "ic"
  | "pcb"
  | "sensor"
  | "actuator"
  | "power"
  | "wiring"
  | "structural"
  | "connector"
  | "shaft"
  | "gear"
  | "wheel-tyre"
  | "mechanical"
  | "marble-stem"
  | "stationery"
  | "consumable"
  | "magnet"
  | "tool";

interface KitComponent {
  id: string;
  code: string;
  name: string;
  qty: number;
  unit: "pc" | "pcs";
  category: ComponentCategory;
  description: string;
  assetRef?: string; // e.g. "/models/blocks/power-block.glb"
  aiLabel?: string;  // e.g. "blix.power_block"
}

interface KitGroup {
  group: string;
  multiplier?: string; // e.g. "x2 per kit"
  items: KitComponent[];
}

interface KitBox {
  box: string;
  title: string;
  subtitle: string;
  color: string;
  image: string;
  groups: KitGroup[];
}

const componentBoxes: KitBox[] = [
  // ═════════════════════════════════════════════════════════════════════════
  {
    box: "Box 1",
    title: "Logic Blocks, Discovering Electricity, Junior Electronics",
    subtitle: "E-circuits, logic blocks & junior electronics — 2 sets per kit",
    color: "bg-yellow-500",
    image: "/box1.jpg",
    groups: [
      {
        group: "Logic Blocks (screenless coding)",
        multiplier: "x2 per kit",
        items: [
          { id: "power-block",    code: "POWER",    name: "Power Block",        qty: 1, unit: "pc",  category: "logic-block", description: "Powers the screenless logic-block circuit." },
          { id: "not-block",      code: "NOT",      name: "Not Block",          qty: 1, unit: "pc",  category: "logic-block", description: "Inverts the logical input signal." },
          { id: "led-block",      code: "LED",      name: "LED Block",          qty: 1, unit: "pc",  category: "logic-block", description: "Lights up to indicate logical HIGH." },
          { id: "buzzer-block",   code: "BUZZER",   name: "Buzzer Block",       qty: 1, unit: "pc",  category: "logic-block", description: "Audio output for HIGH-state alerts." },
          { id: "motor-block",    code: "MOTOR",    name: "Motor Block",        qty: 2, unit: "pcs", category: "logic-block", description: "Drives a motor when input is HIGH." },
          { id: "distance-block", code: "DISTANCE", name: "Distance Block",     qty: 2, unit: "pcs", category: "logic-block", description: "Senses proximity (HIGH on near object)." },
          { id: "ir-block",       code: "IR",       name: "IR Block",           qty: 2, unit: "pcs", category: "logic-block", description: "Infrared input — line / object detection." },
          { id: "switch-block",   code: "SWITCH",   name: "Switch Block",       qty: 1, unit: "pc",  category: "logic-block", description: "Manual ON/OFF input for logic chains." },
          { id: "ir-relimate",    code: "3CR-IR",   name: "3-Core Relimate (for IR)", qty: 2, unit: "pcs", category: "wiring",   description: "Cable connecting the IR block to the controller." },
        ],
      },
      {
        group: "Discovering Electricity (passive & active components)",
        multiplier: "x2 per kit",
        items: [
          { id: "push-button",     code: "PB",      name: "Push Button",          qty: 3, unit: "pcs", category: "active-electronic",  description: "Momentary contact switch." },
          { id: "led-green",       code: "LED-G",   name: "Green LED",            qty: 1, unit: "pc",  category: "active-electronic",  description: "Polarised light-emitting diode (green)." },
          { id: "led-red",         code: "LED-R",   name: "Red LED",              qty: 2, unit: "pcs", category: "active-electronic",  description: "Polarised light-emitting diode (red)." },
          { id: "buzzer",          code: "BZ",      name: "Buzzer",               qty: 1, unit: "pc",  category: "active-electronic",  description: "Piezoelectric audio output." },
          { id: "slide-switch",    code: "SW",      name: "Slide Switch",         qty: 1, unit: "pc",  category: "active-electronic",  description: "SPDT slide — bi-stable input." },
          { id: "capacitor",       code: "CAP",     name: "Capacitor",            qty: 2, unit: "pcs", category: "passive-electronic", description: "Stores electric charge — RC timing." },
          { id: "resistor-10k",    code: "R-10K",   name: "10K Resistor",         qty: 1, unit: "pc",  category: "passive-electronic", description: "Limits current — voltage divider stage." },
          { id: "resistor-20k",    code: "R-20K",   name: "20K Resistor",         qty: 1, unit: "pc",  category: "passive-electronic", description: "Higher-resistance current limiter." },
          { id: "resistor-3k3",    code: "R-3K3",   name: "3.3K Resistor",        qty: 1, unit: "pc",  category: "passive-electronic", description: "Pull-up / current-limit resistor." },
          { id: "potentiometer",   code: "POT",     name: "Potentiometer",        qty: 1, unit: "pc",  category: "active-electronic",  description: "Variable resistor — analog input." },
          { id: "ldr",             code: "LDR",     name: "Light Dependent Resistor", qty: 1, unit: "pc", category: "sensor",         description: "Resistance varies with incident light." },
          { id: "motor",           code: "M",       name: "Motor",                qty: 1, unit: "pc",  category: "actuator",           description: "Small DC motor for kinetic projects." },
          { id: "alligator-red",   code: "AC-R",    name: "Red Alligator Clips",  qty: 1, unit: "pc",  category: "wiring",             description: "Test-lead pair for + (red) connections." },
          { id: "alligator-black", code: "AC-B",    name: "Black Alligator Clips",qty: 1, unit: "pc",  category: "wiring",             description: "Test-lead pair for − (black) connections." },
          { id: "jumper-wire",     code: "JW",      name: "Jumper Wire",          qty: 3, unit: "pcs", category: "wiring",             description: "Flexible wires for breadboard-free wiring." },
          { id: "battery-box",     code: "BB",      name: "Battery Box",          qty: 1, unit: "pc",  category: "power",              description: "AA-cell holder powering the circuit." },
          { id: "connecting-tower",code: "CT-TWR",  name: "Connecting Tower",     qty: 6, unit: "pcs", category: "wiring",             description: "Stackable nodes for solderless joins." },
          { id: "rainbow-disk",    code: "RD",      name: "Rainbow Disk",         qty: 1, unit: "pc",  category: "active-electronic",  description: "Spinning colour-mix demo for persistence of vision." },
        ],
      },
      {
        group: "Junior Electronics (Queaky)",
        multiplier: "x2 per kit",
        items: [
          { id: "queaky", code: "QY",     name: "Queaky",  qty: 1, unit: "pc", category: "active-electronic", description: "Audio-feedback device for open/closed-loop games." },
          { id: "thread", code: "TH",     name: "Thread",  qty: 1, unit: "pc", category: "consumable",       description: "Conductive thread for Queaky games." },
          { id: "wire",   code: "WIRE",   name: "Wire",    qty: 1, unit: "pc", category: "wiring",            description: "Bare wire roll for custom circuits." },
        ],
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════════
  {
    box: "Box 2",
    title: "Marble Stem",
    subtitle: "Marble-run construction kit — 1 set per kit",
    color: "bg-blue-500",
    image: "/box2.jpg",
    groups: [
      {
        group: "Marble Stem track parts",
        multiplier: "x1 per kit",
        items: [
          { id: "p3-marble",       code: "P3",        name: "Pillar (3-hole)",         qty: 25, unit: "pcs", category: "structural",  description: "Short pillar — vertical track support." },
          { id: "p3c2-marble",     code: "P3C2",      name: "P3C2 angled beam",        qty: 62, unit: "pcs", category: "structural",  description: "Angled connector beam — track curves." },
          { id: "ct1x2-marble",    code: "CT1X2",     name: "Connector (2 pieces, 1 plane)", qty: 4, unit: "pcs", category: "connector", description: "Joins two beams in one plane." },
          { id: "tw2",             code: "TW-2",      name: "Tubular Washer (2-hole)", qty: 44, unit: "pcs", category: "connector",   description: "Spacer washer for axles." },
          { id: "marbles",         code: "MAR",       name: "Marbles",                 qty: 10, unit: "pcs", category: "marble-stem", description: "Glass marbles — payload through the run." },
          { id: "rubber-band",     code: "RB",        name: "Rubber Band",             qty: 2,  unit: "pcs", category: "consumable",  description: "Elastic energy / launchers." },
          { id: "mrs14",           code: "MRS14",     name: "MRS14 chute",             qty: 8,  unit: "pcs", category: "marble-stem", description: "Straight chute — 14-unit slide." },
          { id: "mrb7",            code: "MRB7",      name: "MRB7 curved chute",       qty: 12, unit: "pcs", category: "marble-stem", description: "Curved chute — 7-unit bend." },
          { id: "stencil-sheet",   code: "ST-SH",    name: "Stencil Sheet",            qty: 1,  unit: "pc",  category: "consumable",  description: "Layout reference for builds." },
          { id: "mrh5",            code: "MRH5",      name: "MRH5 hopper",             qty: 6,  unit: "pcs", category: "marble-stem", description: "Hopper / collector for marbles." },
          { id: "bucket",          code: "BCKT",      name: "Bucket",                  qty: 10, unit: "pcs", category: "marble-stem", description: "Marble catch-cups." },
          { id: "paper-strips",    code: "PS",        name: "Paper Strips",            qty: 3,  unit: "pcs", category: "consumable",  description: "Custom track surfaces." },
          { id: "wheel-no-tyre",   code: "W-NT",      name: "Wheel without Tyre",      qty: 1,  unit: "pc",  category: "wheel-tyre",  description: "Bare hub — used in marble flywheel demos." },
        ],
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════════
  {
    box: "Box 3",
    title: "Discovering Electronics & Boffin Basic Electronics",
    subtitle: "Digital ICs, PCBs, ESP32 — 2 sets of ICs / 1 set of boards",
    color: "bg-purple-500",
    image: "/box3.jpg",
    groups: [
      {
        group: "Integrated Circuits (digital logic)",
        multiplier: "x2 per kit",
        items: [
          { id: "ic-555",   code: "IC555",   name: "IC 555 (timer)",        qty: 1, unit: "pc", category: "ic", description: "Astable / monostable timer." },
          { id: "ic-7408",  code: "IC7408",  name: "IC 7408 (quad AND)",    qty: 1, unit: "pc", category: "ic", description: "Four 2-input AND gates." },
          { id: "ic-7432",  code: "IC7432",  name: "IC 7432 (quad OR)",     qty: 1, unit: "pc", category: "ic", description: "Four 2-input OR gates." },
          { id: "ic-7404",  code: "IC7404",  name: "IC 7404 (hex NOT)",     qty: 1, unit: "pc", category: "ic", description: "Six inverters." },
          { id: "ic-7400",  code: "IC7400",  name: "IC 7400 (quad NAND)",   qty: 1, unit: "pc", category: "ic", description: "Four 2-input NAND gates." },
          { id: "ic-7402",  code: "IC7402",  name: "IC 7402 (quad NOR)",    qty: 1, unit: "pc", category: "ic", description: "Four 2-input NOR gates." },
          { id: "ic-7486",  code: "IC7486",  name: "IC 7486 (quad XOR)",    qty: 1, unit: "pc", category: "ic", description: "Four 2-input XOR gates." },
          { id: "ic-7426",  code: "IC7426",  name: "IC 7426 (quad NAND-OC)",qty: 1, unit: "pc", category: "ic", description: "Quad open-collector NAND." },
          { id: "ic-74151", code: "IC74151", name: "IC 74151 (8:1 mux)",    qty: 1, unit: "pc", category: "ic", description: "8-to-1 multiplexer." },
          { id: "ic-74138", code: "IC74138", name: "IC 74138 (3:8 demux)",  qty: 1, unit: "pc", category: "ic", description: "3-to-8 line decoder / demux." },
        ],
      },
      {
        group: "PCB carriers & wiring",
        multiplier: "x2 per kit",
        items: [
          { id: "connecting-wire",  code: "CW",       name: "Connecting Wire",       qty: 40, unit: "pcs", category: "wiring", description: "Pre-cut hookup wires." },
          { id: "p21x21-box3",      code: "P21X21",   name: "P21x21 base plate",     qty: 1,  unit: "pc",  category: "structural", description: "21×21-stud plate for breadboard-free electronics." },
          { id: "pcb-7segment",     code: "PCB-7SEG", name: "PCB 7-Segment Display", qty: 1,  unit: "pc",  category: "pcb",    description: "Common-cathode digit display module." },
          { id: "pcb-peripheral",   code: "PCB-PER",  name: "PCB Peripheral IC",     qty: 1,  unit: "pc",  category: "pcb",    description: "Adapter PCB for peripheral ICs." },
          { id: "pcb-switch",       code: "PCB-SW",   name: "PCB Switch",            qty: 1,  unit: "pc",  category: "pcb",    description: "Switch carrier PCB." },
          { id: "pcb-ic-holder",    code: "PCB-ICH",  name: "PCB IC Holder",         qty: 3,  unit: "pcs", category: "pcb",    description: "DIP-IC mounting carrier." },
          { id: "pcb-stencils",     code: "PCB-ST",   name: "PCB Stencils",          qty: 10, unit: "pcs", category: "consumable", description: "Layout overlays mapping ICs to functions." },
        ],
      },
      {
        group: "Boffin Boards (ESP32 + sensors)",
        multiplier: "x1 per kit",
        items: [
          { id: "ir-sensor",    code: "IR-S",   name: "IR Sensor",        qty: 2, unit: "pcs", category: "sensor",   description: "Reflective IR — line / proximity input." },
          { id: "esp32",        code: "ESP32",  name: "ESP32 Board",      qty: 1, unit: "pc",  category: "ic",       description: "WiFi/BT MCU — runs Ardublock, MicroPython & Codeskool." },
          { id: "limit-switch", code: "LS",     name: "Limit Switch",     qty: 1, unit: "pc",  category: "sensor",   description: "Mechanical end-stop input." },
          { id: "led-boffin",   code: "LED-B",  name: "LED (Boffin)",     qty: 1, unit: "pc",  category: "active-electronic", description: "Indicator LED for Boffin circuits." },
          { id: "dc-motor-board", code: "DCMB", name: "DC Motor Board",   qty: 2, unit: "pcs", category: "actuator", description: "H-bridge motor driver board." },
          { id: "servo-motor",  code: "SERVO",  name: "Servo Motor",      qty: 1, unit: "pc",  category: "actuator", description: "Position-controlled servo (0–180°)." },
          { id: "p7x11-box3",   code: "P7X11",  name: "P7x11 base plate", qty: 1, unit: "pc",  category: "structural", description: "7×11-stud baseplate for ESP32 builds." },
          { id: "core-cable-4", code: "CC4",    name: "4-Core Cable",     qty: 6, unit: "pcs", category: "wiring",   description: "Sensor / motor cable." },
          { id: "programming-cable", code: "PC", name: "Programming Cable", qty: 1, unit: "pc", category: "wiring",  description: "USB programmer cable for ESP32." },
        ],
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════════
  {
    box: "Box 4",
    title: "Plastic Construction Parts",
    subtitle: "Pillars, connectors, gears, wheels — 2 sets per kit",
    color: "bg-green-500",
    image: "/box4.jpg",
    groups: [
      {
        group: "Pillars (load-bearing beams)",
        multiplier: "x2 per kit",
        items: [
          { id: "p3",     code: "P3",     name: "Pillar (3 holes)",       qty: 12, unit: "pcs", category: "structural", description: "Short pillar — basic frame element." },
          { id: "p5",     code: "P5",     name: "Pillar (5 holes)",       qty: 18, unit: "pcs", category: "structural", description: "Medium pillar." },
          { id: "p7",     code: "P7",     name: "Pillar (7 holes)",       qty: 12, unit: "pcs", category: "structural", description: "Long pillar." },
          { id: "p11",    code: "P11",    name: "Pillar (11 holes)",      qty: 16, unit: "pcs", category: "structural", description: "Extra-long pillar." },
          { id: "pu5x13", code: "PU5X13", name: "U-pillar (29 holes)",    qty: 5,  unit: "pcs", category: "structural", description: "U-shaped frame for big structures." },
          { id: "pu5x7",  code: "PU5X7",  name: "U-pillar (17 holes)",    qty: 1,  unit: "pc",  category: "structural", description: "Smaller U-frame." },
        ],
      },
      {
        group: "Connectors (joints)",
        items: [
          { id: "ct1x2",  code: "CT1X2",  name: "Tight connector (2 pieces, 1 plane)",   qty: 4,  unit: "pcs", category: "connector", description: "Coplanar tight join." },
          { id: "cl2",    code: "CL2",    name: "Loose connector (2 pieces)",            qty: 20, unit: "pcs", category: "connector", description: "Pivoting loose join." },
          { id: "ch2",    code: "CH2",    name: "Hole connector (2 pieces)",             qty: 32, unit: "pcs", category: "connector", description: "Connector with axle hole." },
          { id: "ct2",    code: "CT2",    name: "Tight connector (2 pieces)",            qty: 50, unit: "pcs", category: "connector", description: "Standard rigid join." },
          { id: "ct3",    code: "CT3",    name: "Tight connector (3 pieces)",            qty: 30, unit: "pcs", category: "connector", description: "Three-piece rigid join." },
        ],
      },
      {
        group: "Shafts & axles",
        items: [
          { id: "sh60",       code: "SH60",   name: "Shaft (6 cm)",   qty: 4,  unit: "pcs", category: "shaft", description: "Short axle." },
          { id: "sh100",      code: "SH100",  name: "Shaft (10 cm)",  qty: 5,  unit: "pcs", category: "shaft", description: "Medium axle." },
          { id: "sh170",      code: "SH170",  name: "Shaft (17 cm)",  qty: 4,  unit: "pcs", category: "shaft", description: "Long axle." },
          { id: "tw1",        code: "TW1",    name: "Tubular Washer (1-hole)", qty: 30, unit: "pcs", category: "connector", description: "Spacer for shafts." },
        ],
      },
      {
        group: "Gears & mechanical drive",
        items: [
          { id: "g20",       code: "G20",      name: "Gear (20 teeth)",    qty: 6,  unit: "pcs", category: "gear",       description: "Small spur gear — driver in reductions." },
          { id: "g20-plus",  code: "G20+",     name: "Gear-Plus (20 teeth)", qty: 6, unit: "pcs", category: "gear",       description: "G20 with hub — locks to motor shaft." },
          { id: "g20-idler", code: "G20-IDL",  name: "Gear Idler (20 teeth)", qty: 6, unit: "pcs", category: "gear",      description: "Free-rotating idler — direction reversal." },
          { id: "g60",       code: "G60",      name: "Gear (60 teeth)",    qty: 3,  unit: "pcs", category: "gear",       description: "Large spur gear — 3:1 ratio with G20." },
          { id: "rack",      code: "RACK",     name: "Rack",               qty: 10, unit: "pcs", category: "gear",       description: "Linear-motion rack — pairs with G20." },
          { id: "suspension",code: "SUSP",     name: "Suspension",         qty: 2,  unit: "pcs", category: "mechanical", description: "Spring suspension — bumpy-terrain bots." },
          { id: "p5-nut",    code: "P5-NUT",   name: "P5-NUT",             qty: 1,  unit: "pc",  category: "connector",  description: "Threaded captive-nut beam." },
          { id: "power-screw", code: "PS",     name: "Power Screw",        qty: 1,  unit: "pc",  category: "mechanical", description: "Lead screw for linear actuators." },
          { id: "remover",   code: "RT",       name: "Remover Tool",       qty: 1,  unit: "pc",  category: "tool",       description: "Pries apart tightly fitted parts." },
        ],
      },
      {
        group: "Body & wheels",
        items: [
          { id: "mud-guard-l", code: "MGL",   name: "Mud Guard (left)",   qty: 3, unit: "pcs", category: "structural", description: "Left-side wheel arch." },
          { id: "mud-guard-r", code: "MGR",   name: "Mud Guard (right)",  qty: 3, unit: "pcs", category: "structural", description: "Right-side wheel arch." },
          { id: "spoiler",     code: "SPL",   name: "Spoiler",            qty: 1, unit: "pc",  category: "structural", description: "Decorative aero element." },
          { id: "steering",    code: "STR",   name: "Steering Wheel",     qty: 1, unit: "pc",  category: "mechanical", description: "Driver-input control wheel." },
          { id: "pulley",      code: "PUL",   name: "Pulley",             qty: 1, unit: "pc",  category: "mechanical", description: "Belt-drive pulley." },
          { id: "p3-plus",     code: "P3+",   name: "Pillar Plus (3 holes)", qty: 6, unit: "pcs", category: "structural", description: "P3 with stud topping." },
          { id: "pc3",         code: "PC3",   name: "Plate Connector (3)",   qty: 8, unit: "pcs", category: "connector", description: "Plate-to-pillar joiner." },
        ],
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════════
  {
    box: "Box 5",
    title: "Accessories",
    subtitle: "Stationery, magnets, motors, batteries — 1 set per kit",
    color: "bg-orange-500",
    image: "/box5.jpg",
    groups: [
      {
        group: "Stationery & consumables",
        multiplier: "x1 per kit",
        items: [
          { id: "pencil",         code: "PNCL",   name: "Pencil",             qty: 2, unit: "pcs", category: "stationery", description: "For sketching designs." },
          { id: "eraser",         code: "ERSR",   name: "Eraser",             qty: 2, unit: "pcs", category: "stationery", description: "For corrections." },
          { id: "black-marker",   code: "MKR",    name: "Black Marker",       qty: 1, unit: "pc",  category: "stationery", description: "For labelling parts and wiring." },
          { id: "rubber-band-acc",code: "RB-A",   name: "Rubber Band",        qty: 4, unit: "pcs", category: "consumable", description: "Drive belts, elastic energy storage." },
          { id: "chart-paper",    code: "CHRT",   name: "Chart Paper",        qty: 1, unit: "pc",  category: "consumable", description: "For posters / circuit diagrams." },
          { id: "straw",          code: "STR",    name: "Straw",              qty: 2, unit: "pcs", category: "consumable", description: "Air friction / aerodynamics tests." },
          { id: "balloon",        code: "BLN",    name: "Balloon",            qty: 2, unit: "pcs", category: "consumable", description: "Pneumatic / propulsion experiments." },
          { id: "insulation-tape",code: "TAPE",   name: "Black Insulation Tape", qty: 1, unit: "pc", category: "consumable", description: "Insulates joints & secures wiring." },
          { id: "copper-wire",    code: "CU",     name: "Copper Wire",        qty: 2, unit: "pcs", category: "wiring",     description: "Bare conductor — coils and electromagnets." },
          { id: "sand-paper",     code: "SP",     name: "Sand Paper",         qty: 1, unit: "pc",  category: "consumable", description: "Surface friction studies." },
          { id: "iron-nail",      code: "FE",     name: "Iron Nail",          qty: 2, unit: "pcs", category: "consumable", description: "Magnetism / electromagnet cores." },
          { id: "foam",           code: "FOAM",   name: "Foam",               qty: 2, unit: "pcs", category: "consumable", description: "Buoyancy and impact-absorption demos." },
        ],
      },
      {
        group: "Mechanisms & magnets",
        items: [
          { id: "fan",            code: "FAN",    name: "Fan",                qty: 2, unit: "pcs", category: "actuator", description: "Propeller for motor outputs." },
          { id: "scissor",        code: "SCSR",   name: "Scissor",            qty: 1, unit: "pc",  category: "tool",     description: "For cutting paper / tape / straws." },
          { id: "donut-magnet",   code: "DM",     name: "Donut Magnet",       qty: 3, unit: "pcs", category: "magnet",   description: "Ring magnet — generators / repulsion demos." },
          { id: "screw-driver",   code: "SD",     name: "Mechanix Screwdriver", qty: 1, unit: "pc", category: "tool",    description: "Tightens captive-nut beams (P5-NUT)." },
          { id: "bar-magnet",     code: "BM",     name: "Bar Magnet",         qty: 2, unit: "pcs", category: "magnet",   description: "Polarised bar magnet — field-line demos." },
        ],
      },
      {
        group: "Power & motors",
        items: [
          { id: "battery-3v",     code: "BB3V",   name: "3 V Battery Box",    qty: 2, unit: "pcs", category: "power",    description: "Powers small DC motors and LEDs." },
          { id: "motor-acc",      code: "M-ACC",  name: "Motor",              qty: 4, unit: "pcs", category: "actuator", description: "Standard DC motor for vehicle builds." },
          { id: "battery-6v",     code: "BB6V",   name: "6 V Battery Box",    qty: 2, unit: "pcs", category: "power",    description: "Higher-voltage supply — geared bots." },
        ],
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════════
  {
    box: "Box 6",
    title: "Big Construction Parts",
    subtitle: "Base plates and wheels — 1 set per kit",
    color: "bg-emerald-500",
    image: "/box6.jpg",
    groups: [
      {
        group: "Plates & wheels",
        multiplier: "x1 per kit",
        items: [
          { id: "p21x21",   code: "P21X21",  name: "P21x21 base plate",  qty: 5,  unit: "pcs", category: "structural", description: "Large 21×21-stud plate — main chassis." },
          { id: "p7x11",    code: "P7X11",   name: "P7x11 base plate",   qty: 8,  unit: "pcs", category: "structural", description: "Medium 7×11-stud plate." },
          { id: "wheel",    code: "W",       name: "Wheel",              qty: 10, unit: "pcs", category: "wheel-tyre", description: "Standard wheel-with-tyre for vehicle drive." },
        ],
      },
    ],
  },
];

// Visual styling per category — used to colour-code component pills
const categoryStyle: Record<ComponentCategory, string> = {
  "logic-block":         "bg-yellow-100 text-yellow-800 border-yellow-200",
  "passive-electronic":  "bg-blue-100 text-blue-800 border-blue-200",
  "active-electronic":   "bg-cyan-100 text-cyan-800 border-cyan-200",
  "ic":                  "bg-violet-100 text-violet-800 border-violet-200",
  "pcb":                 "bg-purple-100 text-purple-800 border-purple-200",
  "sensor":              "bg-pink-100 text-pink-800 border-pink-200",
  "actuator":            "bg-rose-100 text-rose-800 border-rose-200",
  "power":               "bg-red-100 text-red-800 border-red-200",
  "wiring":              "bg-slate-100 text-slate-800 border-slate-200",
  "structural":          "bg-green-100 text-green-800 border-green-200",
  "connector":           "bg-emerald-100 text-emerald-800 border-emerald-200",
  "shaft":               "bg-zinc-100 text-zinc-800 border-zinc-200",
  "gear":                "bg-orange-100 text-orange-800 border-orange-200",
  "wheel-tyre":          "bg-stone-100 text-stone-800 border-stone-200",
  "mechanical":          "bg-amber-100 text-amber-800 border-amber-200",
  "marble-stem":         "bg-sky-100 text-sky-800 border-sky-200",
  "stationery":          "bg-neutral-100 text-neutral-800 border-neutral-200",
  "consumable":          "bg-gray-100 text-gray-800 border-gray-200",
  "magnet":              "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  "tool":                "bg-teal-100 text-teal-800 border-teal-200",
};

// ─── Page ────────────────────────────────────────────────────────────────────
const Curriculum = () => {
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [activeTab, setActiveTab] = useState<"sessions" | "modules" | "tools" | "kit" | "gallery3d">("sessions");
  const [openBox, setOpenBox] = useState<string | null>(null);
  const [galleryAutoRotate, setGalleryAutoRotate] = useState(true);

  const totalSessions = grades.reduce((sum, g) => sum + g.sessionCount, 0);
  const current = grades.find((g) => g.grade === selectedGrade)!;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/10 hover:bg-white/15 text-white border-white/20 px-4 py-1.5">
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Skolverket Lgr22 Aligned · Blix Educator Set
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              AI + AR/VR Robotics{" "}
              <span className="bg-gradient-to-r from-blue-400 via-slate-300 to-orange-400 bg-clip-text text-transparent">
                Curriculum
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Educator sessions mapped by grade — from simple machines in Grade 1 to
              advanced programming &amp; AI in Grade 8. Every session aligned with Sweden's
              Lgr22 curriculum and powered by the Blix Educator Set.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {[
                { icon: <BookOpen className="w-4 h-4" />, value: `${totalSessions}+`, label: "Sessions" },
                { icon: <GraduationCap className="w-4 h-4" />, value: "8", label: "Grades" },
                { icon: <Brain className="w-4 h-4" />, value: "3", label: "Stadiums" },
                { icon: <Bot className="w-4 h-4" />, value: "100%", label: "Lgr22 Aligned" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-orange-400">{s.icon}</span>
                    <span className="text-2xl font-bold">{s.value}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tab navigation */}
      <section className="sticky top-16 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-3 -mx-4 px-4">
            {[
              { id: "sessions", label: "Sessions by Grade", icon: <GraduationCap className="w-4 h-4" /> },
              { id: "modules", label: "Modules Covered", icon: <Layers className="w-4 h-4" /> },
              { id: "tools", label: "Software & Tools", icon: <Monitor className="w-4 h-4" /> },
              { id: "kit", label: "Kit Components", icon: <Package className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        {/* ─── SESSIONS TAB ─────────────────────────────────────────────── */}
        {activeTab === "sessions" && (
          <>
            {/* Grade selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {grades.map((g) => (
                <button
                  key={g.grade}
                  onClick={() => setSelectedGrade(g.grade)}
                  className="flex flex-col items-center group"
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                      selectedGrade === g.grade
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg scale-110"
                        : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/20"
                    }`}
                  >
                    {g.grade}
                  </div>
                  <span
                    className={`text-xs font-medium mt-2 ${
                      selectedGrade === g.grade ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    Grade {g.grade}
                  </span>
                  <span
                    className={`text-[10px] ${
                      selectedGrade === g.grade ? "text-orange-500 font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    ({g.stadium})
                  </span>
                </button>
              ))}
            </div>

            {/* Grade header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                {current.grade}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">Grade {current.grade}</h2>
                <p className="text-sm text-muted-foreground">
                  Stadium {current.stadium} · {current.sessionCount} sessions · Lgr22 aligned
                </p>
              </div>
            </div>

            {/* Session table */}
            {current.sessions.length > 0 ? (
              <div className="border border-border rounded-xl overflow-hidden bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left text-xs font-semibold text-muted-foreground">
                        <th className="px-4 py-3 w-12">#</th>
                        <th className="px-4 py-3">Course Project</th>
                        <th className="px-4 py-3">Concepts</th>
                        <th className="px-4 py-3">Skills Developed</th>
                        <th className="px-4 py-3">Skolverket Alignment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {current.sessions.map((s) => (
                        <tr
                          key={s.n}
                          className={`hover:bg-muted/30 transition-colors ${
                            s.highlight ? "bg-orange-50 dark:bg-orange-950/20 border-l-4 border-l-orange-500" : ""
                          }`}
                        >
                          <td className="px-4 py-4 text-sm font-medium text-muted-foreground">{s.n}</td>
                          <td className="px-4 py-4">
                            <p
                              className={`font-medium text-sm ${
                                s.highlight ? "text-orange-600 dark:text-orange-400" : "text-foreground"
                              }`}
                            >
                              {s.project}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${s.conceptColor}`}>
                              {s.concept}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground max-w-xs">{s.skills}</td>
                          <td className="px-4 py-4 text-xs text-muted-foreground max-w-sm leading-relaxed">
                            {s.skolverket}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Detailed session list for Grade {current.grade} is being finalised — {current.sessionCount} sessions planned.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* ─── MODULES TAB ──────────────────────────────────────────────── */}
        {activeTab === "modules" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Modules Covered</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Twelve hands-on modules built on the Blix Educator Set — from screenless coding in Grade 1 to AI training in Grade 8.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((m) => (
                <Card
                  key={m.topic}
                  className={`bg-gradient-to-br ${m.color} hover:shadow-md transition-shadow`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-lg bg-background/60 flex items-center justify-center text-foreground">
                        {m.icon}
                      </div>
                      <Badge variant="outline" className="bg-background/60 text-xs">
                        Grade {m.grade}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-2 text-foreground">{m.topic}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{m.description}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Quantity per kit: </span>
                      {m.qty}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ─── TOOLS TAB ────────────────────────────────────────────────── */}
        {activeTab === "tools" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Software &amp; Tools</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                As technology becomes more prevalent, students develop 21st-century skills like coding, design thinking, machine
                learning and AI through the following platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((t) => (
                <Card key={t.name} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Grade {t.grade}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          t.level === "Advanced"
                            ? "bg-red-100 text-red-700 hover:bg-red-100"
                            : t.level === "Intermediate"
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-100"
                        }`}
                      >
                        {t.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{t.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.purpose}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Prerequisites */}
            <Card className="mt-8 border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-orange-500" />
                  System Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>• Stable internet connection — minimum 50 Mbps</li>
                  <li>• Processor: Intel i5 5th generation or better</li>
                  <li>• Memory: 8 GB RAM (64-bit)</li>
                  <li>• Operating System: Windows 10 or above</li>
                  <li>• Note: Some applications do not run on Chromebook or macOS</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ─── KIT TAB ──────────────────────────────────────────────────── */}
        {activeTab === "kit" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Kit Components</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                The Blix Educator Set ships in six labelled boxes. Each component below is catalogued with its code, quantity
                and category — ready to be wired up to AR previews and AI-vision recognition in future releases.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <Package className="w-3.5 h-3.5" />
                {componentBoxes.reduce(
                  (sum, b) => sum + b.groups.reduce((s, g) => s + g.items.length, 0),
                  0
                )} unique components catalogued
              </div>
            </div>

            <div className="space-y-3">
              {componentBoxes.map((box) => {
                const isOpen = openBox === box.box;
                const totalParts = box.groups.reduce(
                  (sum, g) => sum + g.items.reduce((s, i) => s + i.qty, 0),
                  0
                );
                const totalUnique = box.groups.reduce((s, g) => s + g.items.length, 0);

                return (
                  <div key={box.box} className="border border-border rounded-xl overflow-hidden bg-card">
                    <button
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors text-left"
                      onClick={() => setOpenBox(isOpen ? null : box.box)}
                    >
                      <div className={`w-3 h-14 rounded ${box.color} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground font-semibold">{box.box}</span>
                          <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {totalUnique} types · {totalParts} pieces
                          </span>
                        </div>
                        <p className="font-semibold text-foreground mt-0.5">{box.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{box.subtitle}</p>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 bg-background border-t border-border space-y-6">
                        {/* Reference photo from leaflet */}
                        <div className="rounded-lg overflow-hidden bg-white border border-border relative">
                          <img
                            src={box.image}
                            alt={`${box.box} – ${box.title}`}
                            loading="lazy"
                            className="w-full h-auto block"
                            onError={(e) => {
                              const img = e.currentTarget;
                              img.style.display = 'none';
                              const ph = img.nextElementSibling as HTMLElement | null;
                              if (ph) ph.style.display = 'flex';
                            }}
                          />
                          <div
                            style={{ display: 'none' }}
                            className="aspect-[16/9] w-full items-center justify-center flex-col gap-2 bg-gradient-to-br from-muted/60 to-muted text-muted-foreground"
                          >
                            <Package className="w-10 h-10 opacity-60" />
                            <span className="text-xs font-medium">{box.box} reference image coming soon</span>
                          </div>
                        </div>

                        {/* Each functional group of components */}
                        {box.groups.map((group) => (
                          <div key={group.group}>
                            <div className="flex items-center gap-2 mb-3">
                              <h3 className="text-sm font-semibold text-foreground">{group.group}</h3>
                              {group.multiplier && (
                                <span className="text-[10px] uppercase tracking-wide font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  {group.multiplier}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {group.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="border border-border rounded-lg p-3 bg-card hover:border-primary/40 hover:shadow-sm transition-all"
                                >
                                  {/* Component thumbnail */}
                                  <div className="mb-2 rounded overflow-hidden bg-white border border-border">
                                    <img
                                      src={`/curriculum/components/${item.id}.jpg`}
                                      alt={item.name}
                                      loading="lazy"
                                      className="w-full h-24 object-contain block"
                                      onError={(e) => {
                                        const img = e.currentTarget;
                                        img.style.display = 'none';
                                        const ph = img.nextElementSibling as HTMLElement | null;
                                        if (ph) ph.style.display = 'flex';
                                      }}
                                    />
                                    <div
                                      style={{ display: 'none' }}
                                      className="h-24 w-full items-center justify-center flex-col gap-1 bg-gradient-to-br from-muted/50 to-muted/80 text-muted-foreground"
                                    >
                                      <Package className="w-6 h-6 opacity-60" />
                                      <span className="font-mono text-[10px] font-semibold">{item.code}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-mono text-[11px] font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded">
                                          {item.code}
                                        </span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${categoryStyle[item.category]}`}>
                                          {item.category}
                                        </span>
                                      </div>
                                      <p className="text-sm font-medium text-foreground mt-1.5 leading-tight">
                                        {item.name}
                                      </p>
                                    </div>
                                    <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap pt-0.5">
                                      ×{item.qty} {item.unit}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Future-feature note */}
            <Card className="mt-8 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Coming next: AR &amp; AI component recognition</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every component above carries a stable <code className="text-xs bg-muted px-1.5 py-0.5 rounded">id</code> and
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded mx-1">category</code>, ready to map to a 3D asset
                      reference and an AI-vision label. Once the model assets land, this same data will drive AR previews,
                      auto-generated build instructions and camera-based piece detection.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lab setup CTA */}
            <Card className="mt-4 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Lab Setup Included</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every Educator Set comes with a recommended lab layout — race track, aviation zone, programming station,
                      multi-board table and three student tables — to maximise hands-on learning.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-12 text-center border-t border-border pt-8">
          <p className="text-sm text-muted-foreground mb-3">
            Want a deeper look at the mechanisms students build during competitions?
          </p>
          <Link to="/creators-guide">
            <Button variant="outline" size="sm">
              View Creator&apos;s Guide →
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Curriculum;
