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
import ThreeDGallery from "@/components/ThreeDGallery";
import { componentBoxes, categoryStyle } from "@/data/kitComponents";

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

// ─── Grade data — all 240 sessions sourced from the Blix Educator Set leaflet ─

// Concept-colour shorthands
const cJR  = "bg-orange-100 text-orange-700";   // Junior Robotics
const cJE  = "bg-yellow-100 text-yellow-800";   // Junior Electronics / Electricity
const cJA  = "bg-sky-100 text-sky-700";         // Junior Aviation
const cDM  = "bg-blue-100 text-blue-700";       // Discovering Motion
const cDEC = "bg-amber-100 text-amber-800";     // Discovering Electricity
const cMB  = "bg-cyan-100 text-cyan-700";       // Marble STEM
const cLB  = "bg-purple-100 text-purple-700";   // Logic Blocks
const cDE  = "bg-violet-100 text-violet-700";   // Discovering Electronics
const cESP = "bg-indigo-100 text-indigo-700";   // ESP32 / Boffin
const cAI  = "bg-pink-100 text-pink-700";       // Artificial Intelligence
const cTC  = "bg-emerald-100 text-emerald-700"; // Tinkercad / VR / 3-D
const cPY  = "bg-green-100 text-green-700";     // Python Block Coding
const cDS  = "bg-rose-100 text-rose-700";       // Data Science
const cCP  = "bg-red-100 text-red-700";         // Checkpoint (+ highlight)
const cEC  = "bg-slate-100 text-slate-700";     // Electronics Circuits

// Skills shorthands
const sJR  = "Scientific literacy, Problem Solving";
const sJE  = "Scientific literacy, Investigation";
const sJA  = "Scientific literacy, Creativity";
const sDM  = "Scientific literacy, Problem Solving, Critical Thinking";
const sDEC = "Scientific literacy, Investigation, Critical Thinking";
const sLB  = "Computational thinking, Problem Solving";
const sDE  = "Scientific literacy, Computational thinking, Critical Thinking";
const sESP = "Computational thinking, Programming, Problem Solving";
const sAI  = "Computational thinking, Critical Thinking, Data literacy";
const sPY  = "Computational thinking, Programming";
const sDS  = "Data literacy, Mathematical thinking, Critical Thinking";
const sMB  = "Scientific literacy, Problem Solving, Design thinking";
const sCP  = "Problem solving, Creativity, Initiative";
const sTC  = "Creativity, Design thinking, Digital literacy";
const sHAI = "Computational thinking, Programming, Critical Thinking";

// Lgr22 shorthands
const lg13JR  = "Lgr22 1–3: Teknik – Mekanismer & konstruktioner";
const lg13JE  = "Lgr22 1–3: Fysik – Elektricitet & magnetism";
const lg13JA  = "Lgr22 1–3: Fysik – Kraft & rörelse";
const lg13CP  = "Lgr22 1–3: Tvärvetenskapligt arbetsområde";
const lg46DM  = "Lgr22 4–6: Teknik – Mekanismer; Fysik – Kraft & rörelse";
const lg46DEC = "Lgr22 4–6: Fysik – Elektricitet; Teknik – Elektronik";
const lg46LB  = "Lgr22 4–6: Programmering – Algoritmer & digitala system";
const lg46MB  = "Lgr22 4–6: Teknik – Konstruktion & mekanismer";
const lg46TC  = "Lgr22 4–6: Digital kompetens – AR/VR & 3D-design";
const lg46CP  = "Lgr22 4–6: Tvärvetenskapligt arbetsområde";
const lg79DE  = "Lgr22 7–9: Teknik – Elektronik & digitala system";
const lg79ESP = "Lgr22 7–9: Programmering – Inbyggda system & IoT";
const lg79AI  = "Lgr22 7–9: Digital kompetens – AI & maskininlärning";
const lg79PY  = "Lgr22 7–9: Matematik & programmering – Python";
const lg79DS  = "Lgr22 7–9: Matematik – Statistik & dataanalys";
const lg79HAI = "Lgr22 7–9: Digital kompetens – AI-hårdvara & robotik";
const lg79CP  = "Lgr22 7–9: Tvärvetenskapligt arbetsområde";

const grades: GradeData[] = [
  // ── Grade 1 ───────────────────────────────────────────────────────────────
  {
    grade: 1, stadium: "1–3", sessionCount: 30,
    sessions: [
      { n:  1, project: "Cart with wheel & axle",                      concept: "Simple Machines",            conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n:  2, project: "Aerodynamics Car",                            concept: "Air Friction",               conceptColor: cJR,  skills: sDM,  skolverket: lg13JA },
      { n:  3, project: "Challenge: Ladder (Checkpoint-1)",            concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
      { n:  4, project: "Trebuchet",                                   concept: "Action & Reactions",         conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n:  5, project: "Sign Board",                                  concept: "Coding & Decoding",          conceptColor: cJR,  skills: sLB,  skolverket: lg13CP },
      { n:  6, project: "Single Suspension Car",                       concept: "Construction Skill",         conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n:  7, project: "Cart with wheel & axle",                      concept: "Structure & Base",           conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n:  8, project: "Most Stable Tower",                           concept: "Construction Skill",         conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n:  9, project: "Lift",                                        concept: "Counting",                   conceptColor: cJR,  skills: "Numeracy, Problem Solving", skolverket: lg13JR },
      { n: 10, project: "Money",                                       concept: "Power",                      conceptColor: cJR,  skills: "Scientific literacy, Numeracy", skolverket: lg13JR },
      { n: 11, project: "Bear Trap",                                   concept: "Elasticity",                 conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n: 12, project: "Challenge: Pasta Maker (Checkpoint-2)",       concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
      { n: 13, project: "Merry Go Round",                              concept: "Rotation",                   conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 14, project: "Spinning Top",                                concept: "Energy Transfer",            conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 15, project: "Lock & Key",                                  concept: "Meshing of Gears",           conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 16, project: "Trundle Wheel",                               concept: "Motion Conversion",          conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 17, project: "Zipline Ride",                                concept: "Gravity",                    conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n: 18, project: "Dancing Robot",                               concept: "Types of Movements",         conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 19, project: "Digital Clock",                               concept: "Display",                    conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n: 20, project: "Earth, Moon & Sun",                           concept: "Orbit",                      conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n: 21, project: "Find the Path",                               concept: "Sequence",                   conceptColor: cJR,  skills: sLB,  skolverket: lg13CP },
      { n: 22, project: "Challenge: Foldable Scale (Checkpoint-3)",    concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
      { n: 23, project: "Weight Measuring Device",                     concept: "Balance",                    conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n: 24, project: "Ploughing Machine",                           concept: "Motor",                      conceptColor: cJR,  skills: sJR,  skolverket: lg13JE },
      { n: 25, project: "Challenge: Goalkeeper & Kicker (Checkpoint-4)", concept: "Checkpoint",               conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
      { n: 26, project: "Launcher",                                    concept: "Time",                       conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n: 27, project: "Make your First Circuit",                     concept: "Intro to Electricity",       conceptColor: cJE,  skills: sJE,  skolverket: lg13JE },
      { n: 28, project: "Conductors & Insulators",                     concept: "Loops",                      conceptColor: cJE,  skills: sJE,  skolverket: lg13JE },
      { n: 29, project: "Balloon Rockets",                             concept: "Thrust",                     conceptColor: cJA,  skills: sJA,  skolverket: lg13JA },
      { n: 30, project: "Paper Plane",                                 concept: "Forces on Plane",            conceptColor: cJA,  skills: sJA,  skolverket: lg13JA },
    ],
  },
  // ── Grade 2 ───────────────────────────────────────────────────────────────
  {
    grade: 2, stadium: "1–3", sessionCount: 30,
    sessions: [
      { n:  1, project: "Cart with wheel & axle",                      concept: "Simple Machines",            conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n:  2, project: "Car",                                         concept: "Structure & Base",           conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n:  3, project: "Scarecrow",                                   concept: "Links",                      conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n:  4, project: "Double Suspension Car",                       concept: "Shock",                      conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n:  5, project: "Challenge: Bridge (Checkpoint-1)",            concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
      { n:  6, project: "Maze",                                        concept: "Directions",                 conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n:  7, project: "Single Suspension Car",                       concept: "Shock & Impact",             conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n:  8, project: "Challenge: Tower (Checkpoint-2)",             concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
      { n:  9, project: "Scissor Arm",                                 concept: "Pivot",                      conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n: 10, project: "Coding & Decoding",                           concept: "Intro to Binary",            conceptColor: cJR,  skills: sLB,  skolverket: lg13CP },
      { n: 11, project: "Dancing Bird",                                concept: "Bevel Gear",                 conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 12, project: "Transport Trolley",                           concept: "Application of Rack Gear",   conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 13, project: "Fishing Rod",                                 concept: "Arm & Lever",                conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 14, project: "Coin Bank",                                   concept: "Conveyor Belt",              conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 15, project: "Challenge: X-RAY Baggage Scanner (Checkpoint-3)", concept: "Checkpoint",            conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
      { n: 16, project: "Pencil Sharpener",                            concept: "Circular Motion",            conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 17, project: "The Fun Ride",                                concept: "Construction",               conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n: 18, project: "Bow and Arrow",                               concept: "Elasticity",                 conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n: 19, project: "Tool Kit",                                    concept: "Symmetry",                   conceptColor: cJR,  skills: sJR,  skolverket: lg13JR },
      { n: 20, project: "Challenge: Candy Box (Checkpoint-4)",         concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
      { n: 21, project: "Movable Bridge",                              concept: "Pulley",                     conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 22, project: "Shovel and Wheelbarrow",                      concept: "Application of Gears",       conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 23, project: "Cleaning Device",                             concept: "Application of Circular Motion", conceptColor: cJR, skills: sDM, skolverket: lg13JR },
      { n: 24, project: "Well",                                        concept: "Pulley System",              conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 25, project: "Gripper",                                     concept: "Joint & Pivot",              conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 26, project: "Skipping Man",                                concept: "Frictionless Connector",     conceptColor: cJR,  skills: sDM,  skolverket: lg13JR },
      { n: 27, project: "Stirrer Machine",                             concept: "Rotational Motion",          conceptColor: cJE,  skills: sJE,  skolverket: lg13JE },
      { n: 28, project: "Crawler",                                     concept: "Synchronous Walking Mechanism", conceptColor: cJE, skills: sJE, skolverket: lg13JE },
      { n: 29, project: "Airplane",                                    concept: "Construction with Symmetry", conceptColor: cJA,  skills: sJA,  skolverket: lg13JA },
      { n: 30, project: "Challenge: Motorbike (Checkpoint-5)",         concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
    ],
  },
  // ── Grade 3 ───────────────────────────────────────────────────────────────
  {
    grade: 3, stadium: "1–3", sessionCount: 30,
    sessions: [
      { n:  1, project: "Counter Balance Model",                       concept: "Lever",                      conceptColor: cDM,  skills: sDM,  skolverket: lg13JR },
      { n:  2, project: "Ramp Working Model",                          concept: "Inclined Plane",             conceptColor: cDM,  skills: sDM,  skolverket: lg13JR },
      { n:  3, project: "Pulley System",                               concept: "Pulley",                     conceptColor: cDM,  skills: sDM,  skolverket: lg13JR },
      { n:  4, project: "Power Press Machine",                         concept: "Screw",                      conceptColor: cDM,  skills: sDM,  skolverket: lg13JR },
      { n:  5, project: "Basic Car",                                   concept: "Wheels & Axles",             conceptColor: cDM,  skills: sDM,  skolverket: lg13JR },
      { n:  6, project: "Trebuchet",                                   concept: "Energy Conversion",          conceptColor: cDM,  skills: sDM,  skolverket: lg13JR },
      { n:  7, project: "Challenge: Finding the Range (Checkpoint-1)", concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
      { n:  8, project: "Launcher",                                    concept: "Elastic Properties",         conceptColor: cDM,  skills: sDM,  skolverket: lg13JR },
      { n:  9, project: "Locomotive Coach",                            concept: "Joints & Pull",              conceptColor: cDM,  skills: sDM,  skolverket: lg13JR },
      { n: 10, project: "Giant Wheel",                                 concept: "Rotation & Revolution",      conceptColor: cDM,  skills: sDM,  skolverket: lg13JR },
      { n: 11, project: "Mono Rail",                                   concept: "Rack Gear",                  conceptColor: cDM,  skills: sDM,  skolverket: lg13JR },
      { n: 12, project: "Merry Go Round",                              concept: "Application of Motion",      conceptColor: cDM,  skills: sDM,  skolverket: lg13JR },
      { n: 13, project: "Crazy Bot with Vibration",                    concept: "Randomness",                 conceptColor: cDM,  skills: sDM,  skolverket: lg13JR },
      { n: 14, project: "Balance Scale",                               concept: "Counterweight",              conceptColor: cDM,  skills: sDM,  skolverket: lg13JR },
      { n: 15, project: "Challenge: Grabber (Checkpoint-2)",           concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
      { n: 16, project: "Basic Circuits",                              concept: "Atom & Electrons",           conceptColor: cDEC, skills: sDEC, skolverket: lg13JE },
      { n: 17, project: "Conductors & Insulators",                     concept: "Properties of Material",     conceptColor: cDEC, skills: sDEC, skolverket: lg13JE },
      { n: 18, project: "Water Overflow Alarm",                        concept: "Closed & Open Loop",         conceptColor: cDEC, skills: sDEC, skolverket: lg13JE },
      { n: 19, project: "Polarity",                                    concept: "Uni & Bidirectional",        conceptColor: cDEC, skills: sDEC, skolverket: lg13JE },
      { n: 20, project: "Challenge: Party Doorbell (Checkpoint-3)",    concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
      { n: 21, project: "Piezo-electricity",                           concept: "Energy Transformation",      conceptColor: cDEC, skills: sDEC, skolverket: lg13JE },
      { n: 22, project: "Challenge: House Supply System (Checkpoint-4)", concept: "Checkpoint",               conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
      { n: 23, project: "First Marble Track",                          concept: "Structure & Planning",       conceptColor: cMB,  skills: sMB,  skolverket: lg13JR },
      { n: 24, project: "Fastest & Slowest Tracks",                    concept: "Construction Techniques",    conceptColor: cMB,  skills: sMB,  skolverket: lg13JR },
      { n: 25, project: "Path Finder",                                 concept: "Possibilities",              conceptColor: cMB,  skills: sMB,  skolverket: lg13JR },
      { n: 26, project: "Series & Parallel Circuits",                  concept: "Human Circuits",             conceptColor: cJE,  skills: sJE,  skolverket: lg13JE },
      { n: 27, project: "Buzz Wire Loop Game",                         concept: "Continuity Testing",         conceptColor: cJE,  skills: sJE,  skolverket: lg13JE },
      { n: 28, project: "Tone Generator Box",                          concept: "Resistances",                conceptColor: cJE,  skills: sJE,  skolverket: lg13JE },
      { n: 29, project: "Biggest Conductor Ever",                      concept: "Earth's Conducting Property", conceptColor: cJE, skills: sJE,  skolverket: lg13JE },
      { n: 30, project: "Challenge: Make an Instrument (Checkpoint-5)", concept: "Checkpoint",                conceptColor: cCP,  skills: sCP,  skolverket: lg13CP, highlight: true },
    ],
  },
  // ── Grade 4 ───────────────────────────────────────────────────────────────
  {
    grade: 4, stadium: "4–6", sessionCount: 30,
    sessions: [
      { n:  1, project: "Balloon Powered Car",                         concept: "Thrust",                     conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n:  2, project: "Swing",                                       concept: "Periodic Motion",            conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n:  3, project: "Power Press Machine",                         concept: "Crank & Slider",             conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n:  4, project: "4-wheel Drive Car",                           concept: "Introduction to Gears",      conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n:  5, project: "Make Me Fast, Make Me Slow",                  concept: "Change of Gear",             conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n:  6, project: "Spinning Top",                                concept: "Applications of Gears",      conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n:  7, project: "Challenge: Fastest Car (Checkpoint-1)",       concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg46CP, highlight: true },
      { n:  8, project: "Follower Car",                                concept: "Reflection",                 conceptColor: cLB,  skills: sLB,  skolverket: lg46LB },
      { n:  9, project: "Automatic Dispenser",                         concept: "Sensors & Actuators",        conceptColor: cLB,  skills: sLB,  skolverket: lg46LB },
      { n: 10, project: "Challenge: Shy Robot (Checkpoint-2)",         concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg46CP, highlight: true },
      { n: 11, project: "Stroboscopic Effect",                         concept: "Frequency",                  conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 12, project: "Voltage & Current",                           concept: "Potential Difference",       conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 13, project: "Series & Parallel Circuit",                   concept: "Current & Voltage",          conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 14, project: "Secret Morse Codes",                          concept: "Binary Codes",               conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 15, project: "OHM's Law",                                   concept: "Resistance",                 conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 16, project: "Short Not Circuit",                           concept: "Short Circuit",              conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 17, project: "AND & OR Gates",                              concept: "Gates",                      conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 18, project: "Universal Gates",                             concept: "NAND & NOR",                 conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 19, project: "Tone Generator Card (Checkpoint-1)",          concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg46CP, highlight: true },
      { n: 20, project: "Resistance in Series & Parallel",             concept: "Total Resistance",           conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 21, project: "Magnetic Compass",                            concept: "Magnetism & Polarity",       conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 22, project: "Dynamo",                                      concept: "Motor & Its Features",       conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 23, project: "Super Vibrator",                              concept: "Lever",                      conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 24, project: "Big Bulley the Small",                        concept: "Current Bypass",             conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 25, project: "Fuse",                                        concept: "Electrical Safety",          conceptColor: cEC,  skills: sDEC, skolverket: lg46DEC },
      { n: 26, project: "First Marble Track",                          concept: "Structure & Planning",       conceptColor: cMB,  skills: sMB,  skolverket: lg46MB },
      { n: 27, project: "Propulsion Mechanism",                        concept: "Newton's Cradle",            conceptColor: cMB,  skills: sMB,  skolverket: lg46MB },
      { n: 28, project: "Alternating Switch",                          concept: "Mechanical Switch",          conceptColor: cMB,  skills: sMB,  skolverket: lg46MB },
      { n: 29, project: "Lifting Mechanism-1",                         concept: "Impact",                     conceptColor: cMB,  skills: sMB,  skolverket: lg46MB },
      { n: 30, project: "Concentric Circle Track",                     concept: "Infinite Loop",              conceptColor: cMB,  skills: sMB,  skolverket: lg46MB },
    ],
  },
  // ── Grade 5 ───────────────────────────────────────────────────────────────
  {
    grade: 5, stadium: "4–6", sessionCount: 30,
    sessions: [
      { n:  1, project: "Waving Robot",                                concept: "Link & Joint Mechanism",     conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n:  2, project: "Power Press Machine",                         concept: "Cam & Follower",             conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n:  3, project: "Scissor Lift",                                concept: "Power & Velocity",           conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n:  4, project: "Rack & Pinion Lift",                          concept: "Mechanical Advantage",       conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n:  5, project: "Kicker Robot",                                concept: "Digital Circuits",           conceptColor: cLB,  skills: sLB,  skolverket: lg46LB },
      { n:  6, project: "Challenge: Guard Robot (Checkpoint-1)",       concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg46CP, highlight: true },
      { n:  7, project: "Make Me Fast / Make Me Slow",                 concept: "Gears",                      conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n:  8, project: "Speed Multiplier",                            concept: "Torque vs Speed-1",          conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n:  9, project: "Speed Reduction",                             concept: "Torque vs Speed-2",          conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n: 10, project: "Gear Changing Car",                           concept: "Three Speed Car",            conceptColor: cDM,  skills: sDM,  skolverket: lg46DM },
      { n: 11, project: "AC vs DC",                                    concept: "Intro to Electricity",       conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 12, project: "ON & Fadeeee",                                concept: "Intro to Capacitors",        conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 13, project: "Capacitance in Series & Parallel",            concept: "Total Capacitance",          conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 14, project: "Sound Effects",                               concept: "Components & Its Effects",   conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 15, project: "LDR Operated LED",                            concept: "Light Spectrum",             conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 16, project: "Voltage Divider",                             concept: "Circuit Application",        conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 17, project: "Potentiometer",                               concept: "Variable Voltage",           conceptColor: cDEC, skills: sDEC, skolverket: lg46DEC },
      { n: 18, project: "Monorail",                                    concept: "Switch Block",               conceptColor: cLB,  skills: sLB,  skolverket: lg46LB },
      { n: 19, project: "Sliding Bed",                                 concept: "Rack Gear",                  conceptColor: cLB,  skills: sLB,  skolverket: lg46LB },
      { n: 20, project: "Refrigerator",                                concept: "Light Spectrum",             conceptColor: cLB,  skills: sLB,  skolverket: lg46LB },
      { n: 21, project: "Smart Box",                                   concept: "Application of Infrared",    conceptColor: cLB,  skills: sLB,  skolverket: lg46LB },
      { n: 22, project: "Autonomous Car",                              concept: "Not Gate",                   conceptColor: cLB,  skills: sLB,  skolverket: lg46LB },
      { n: 23, project: "Musical Robot",                               concept: "Truth Table",                conceptColor: cLB,  skills: sLB,  skolverket: lg46LB },
      { n: 24, project: "Challenge: Obstacle Avoider (Checkpoint-2)",  concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg46CP, highlight: true },
      { n: 25, project: "Line Follower Robot",                         concept: "Infrared Decision Making",   conceptColor: cLB,  skills: sLB,  skolverket: lg46LB },
      { n: 26, project: "Wheel Sorting Machine",                       concept: "Design Thinking",            conceptColor: cLB,  skills: sLB,  skolverket: lg46LB },
      { n: 27, project: "Harry Potter's Owl",                          concept: "Hollow & Grouping",          conceptColor: cTC,  skills: sTC,  skolverket: lg46TC },
      { n: 28, project: "Challenge: Design Your Avatar",               concept: "Orbital Camera",             conceptColor: cTC,  skills: sTC,  skolverket: lg46TC },
      { n: 29, project: "Intro to AR/VR",                              concept: "Motion & Alignment",         conceptColor: cTC,  skills: sTC,  skolverket: lg46TC },
      { n: 30, project: "Hogwarts Calling",                            concept: "Motion & Alignment",         conceptColor: cTC,  skills: sTC,  skolverket: lg46TC },
    ],
  },
  // ── Grade 6 ───────────────────────────────────────────────────────────────
  {
    grade: 6, stadium: "4–6", sessionCount: 30,
    sessions: [
      { n:  1, project: "AND Gate",                                    concept: "Truth Table",                conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n:  2, project: "OR Gate",                                     concept: "Truth Table",                conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n:  3, project: "NOT Gate",                                    concept: "Truth Table",                conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n:  4, project: "NAND Gate",                                   concept: "Truth Table",                conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n:  5, project: "NOR Gate",                                    concept: "Truth Table",                conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n:  6, project: "XOR Gate",                                    concept: "Truth Table",                conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n:  7, project: "XNOR Gate",                                   concept: "Truth Table",                conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n:  8, project: "SOP Circuit",                                 concept: "Deduction of Logical Functions", conceptColor: cDE, skills: sDE, skolverket: lg79DE },
      { n:  9, project: "Introduction to Boffin v2",                   concept: "Controllers",                conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 10, project: "Blinky Bot",                                  concept: "Events & Time Sleep",        conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 11, project: "What if you press a button",                  concept: "Input Controlled Output",    conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 12, project: "ON & OFF Switch Using IR",                    concept: "IR Sensor",                  conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 13, project: "Giant Wheel with Speed Control",              concept: "PWM & Duty Cycle",           conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 14, project: "Giant Wheel with Counter",                    concept: "Variables",                  conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 15, project: "Roll a Dice",                                 concept: "Serial Monitor",             conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 16, project: "Challenge: Game of Housie (Checkpoint)",      concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg79CP, highlight: true },
      { n: 17, project: "Line Follower Bot",                           concept: "Calibration & Reflection",   conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 18, project: "Advance Line Follower Bot",                   concept: "Two IR Sensors",             conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 19, project: "Swing Controller",                            concept: "Conveyor Belt",              conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 20, project: "Automatic Hand Sanitizer",                    concept: "Conveyor Belt",              conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 21, project: "Living and Non-living Things",                concept: "Sound Recognition",          conceptColor: cAI,  skills: sAI,  skolverket: lg79AI },
      { n: 22, project: "Home Automation",                             concept: "Sound Recognition",          conceptColor: cAI,  skills: sAI,  skolverket: lg79AI },
      { n: 23, project: "Covid Battle",                                concept: "Sound Recognition",          conceptColor: cAI,  skills: sAI,  skolverket: lg79AI },
      { n: 24, project: "Sign Language",                               concept: "Gesture Recognition",        conceptColor: cAI,  skills: sAI,  skolverket: lg79AI },
      { n: 25, project: "Phone Security App",                          concept: "Face Recognition",           conceptColor: cAI,  skills: sAI,  skolverket: lg79AI },
      { n: 26, project: "Mood Oriented Playlist",                      concept: "Face Recognition",           conceptColor: cAI,  skills: sAI,  skolverket: lg79AI },
      { n: 27, project: "Introduction to AR/VR",                       concept: "Angular Displacement",       conceptColor: cTC,  skills: sTC,  skolverket: lg46TC },
      { n: 28, project: "Harry Potter Owl Designing",                  concept: "Vertical Alignment",         conceptColor: cTC,  skills: sTC,  skolverket: lg46TC },
      { n: 29, project: "Hogwarts Calling",                            concept: "Camera as Sprite",           conceptColor: cTC,  skills: sTC,  skolverket: lg46TC },
      { n: 30, project: "Design Your Avatar",                          concept: "Lateral Displacement",       conceptColor: cTC,  skills: sTC,  skolverket: lg46TC },
    ],
  },
  // ── Grade 7 ───────────────────────────────────────────────────────────────
  {
    grade: 7, stadium: "7–9", sessionCount: 30,
    sessions: [
      { n:  1, project: "Introduction to Turtle Programming",          concept: "List and Tuples",            conceptColor: cPY,  skills: sPY,  skolverket: lg79PY },
      { n:  2, project: "Snowflakes",                                  concept: "Input & Data Types",         conceptColor: cPY,  skills: sPY,  skolverket: lg79PY },
      { n:  3, project: "Investment Returns",                          concept: "Power & Velocity",           conceptColor: cPY,  skills: sPY,  skolverket: lg79PY },
      { n:  4, project: "Guess the Word",                              concept: "List and Tuples",            conceptColor: cPY,  skills: sPY,  skolverket: lg79PY },
      { n:  5, project: "Locate Me",                                   concept: "Functions",                  conceptColor: cPY,  skills: sPY,  skolverket: lg79PY },
      { n:  6, project: "Challenge: Make a Calculator (Checkpoint-1)", concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg79CP, highlight: true },
      { n:  7, project: "Introduction to Basic Gates",                 concept: "Logic Operations",           conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n:  8, project: "Introduction to Universal Gates",             concept: "Logic Operations",           conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n:  9, project: "Introduction to Ex-OR and Ex-NOR",            concept: "Logic Operations",           conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 10, project: "Multiplexers",                                concept: "Logic Operations",           conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 11, project: "Demultiplexers",                              concept: "Logic Operations",           conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 12, project: "Introduction to Statistics",                  concept: "Data Collection",            conceptColor: cDS,  skills: sDS,  skolverket: lg79DS },
      { n: 13, project: "Descriptive and Inferential Statistics",       concept: "Data Representation",        conceptColor: cDS,  skills: sDS,  skolverket: lg79DS },
      { n: 14, project: "Central Tendency",                            concept: "Inferences",                 conceptColor: cDS,  skills: sDS,  skolverket: lg79DS },
      { n: 15, project: "Measure of Dispersion",                       concept: "Outliers",                   conceptColor: cDS,  skills: sDS,  skolverket: lg79DS },
      { n: 16, project: "SOP Circuit",                                 concept: "Combinational Circuit-1",    conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 17, project: "POS Circuit",                                 concept: "Combinational Circuit-2",    conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 18, project: "SOP using Universal Gates",                   concept: "Implementation of Circuits-1", conceptColor: cDE, skills: sDE, skolverket: lg79DE },
      { n: 19, project: "POS using Universal Gates",                   concept: "Implementation of Circuits-2", conceptColor: cDE, skills: sDE, skolverket: lg79DE },
      { n: 20, project: "Covariance and Correlation",                  concept: "Data Dependencies",          conceptColor: cDS,  skills: sDS,  skolverket: lg79DS },
      { n: 21, project: "Interquartile Range",                         concept: "Maximum Density of Data",    conceptColor: cDS,  skills: sDS,  skolverket: lg79DS },
      { n: 22, project: "Probability Theory-1",                        concept: "Chances & Occurrences-1",    conceptColor: cDS,  skills: sDS,  skolverket: lg79DS },
      { n: 23, project: "Probability Theory-2",                        concept: "Chances & Occurrences-2",    conceptColor: cDS,  skills: sDS,  skolverket: lg79DS },
      { n: 24, project: "K-map Reduction",                             concept: "Graphical Representation",   conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 25, project: "K-map Reduction (SOP)",                       concept: "Graphical Rep. – Maxterms",  conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 26, project: "K-map Reduction (POS)",                       concept: "Graphical Rep. – Maxterms",  conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 27, project: "Challenge-1 (Checkpoint-2)",                  concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg79CP, highlight: true },
      { n: 28, project: "Combinational Circuits Using MUX",            concept: "Interconversion of Circuits", conceptColor: cDE, skills: sDE,  skolverket: lg79DE },
      { n: 29, project: "555 Timer",                                   concept: "Time Constant, Frequency",   conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 30, project: "Challenge-2 (Checkpoint-3)",                  concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg79CP, highlight: true },
    ],
  },
  // ── Grade 8 ───────────────────────────────────────────────────────────────
  {
    grade: 8, stadium: "7–9", sessionCount: 30,
    sessions: [
      { n:  1, project: "Introduction to Interface",                   concept: "Controllers",                conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n:  2, project: "Blinking LED",                                concept: "Events & Time Sleep",        conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n:  3, project: "What if you press a Button?",                 concept: "Input Controlled Output",    conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n:  4, project: "Giant Wheel with Speed Control",              concept: "IR Sensor",                  conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n:  5, project: "Introduction to Basic Gates",                 concept: "Logic Operations",           conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n:  6, project: "Introduction to Universal Gates",             concept: "NAND & NOR",                 conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n:  7, project: "Introduction to Ex-OR and Ex-NOR",            concept: "Boolean Expression of Gates", conceptColor: cDE, skills: sDE,  skolverket: lg79DE },
      { n:  8, project: "Multiplexer",                                 concept: "Multiple Inputs to Output",  conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n:  9, project: "Demultiplexer",                               concept: "Single Input to Multiple Channels", conceptColor: cDE, skills: sDE, skolverket: lg79DE },
      { n: 10, project: "Introduction to Codeskool",                   concept: "AI Interface",               conceptColor: cAI,  skills: sHAI, skolverket: lg79HAI },
      { n: 11, project: "Face Controlled Toll Booth",                  concept: "Web-based Recognition",      conceptColor: cAI,  skills: sHAI, skolverket: lg79HAI },
      { n: 12, project: "Food Dispenser Using Image Recognition",       concept: "Servo Motor",                conceptColor: cAI,  skills: sHAI, skolverket: lg79HAI },
      { n: 13, project: "Rock, Paper and Scissor",                     concept: "Gesture Recognition",        conceptColor: cAI,  skills: sHAI, skolverket: lg79HAI },
      { n: 14, project: "Voice Controlled Car",                        concept: "Voice Detection",            conceptColor: cAI,  skills: sHAI, skolverket: lg79HAI },
      { n: 15, project: "Gesture Control Arm",                         concept: "Gesture Recognition",        conceptColor: cAI,  skills: sHAI, skolverket: lg79HAI },
      { n: 16, project: "Challenge: Hardware AI (Checkpoint-1)",       concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg79CP, highlight: true },
      { n: 17, project: "555 Timer",                                   concept: "Time Constant, Frequency",   conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 18, project: "Astable Multivibrator",                       concept: "Timer Mode-1",               conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 19, project: "Monostable Multivibrator",                    concept: "Timer Mode-2",               conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 20, project: "Bistable Multivibrator",                      concept: "Timer Mode-3",               conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 21, project: "K-map Reduction",                             concept: "Graphical Representation",   conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 22, project: "7 Segment Display",                           concept: "Common Cathode & Common Anode", conceptColor: cDE, skills: sDE, skolverket: lg79DE },
      { n: 23, project: "Challenge: 7 Segment Display (Checkpoint-2)", concept: "Checkpoint",                 conceptColor: cCP,  skills: sCP,  skolverket: lg79CP, highlight: true },
      { n: 24, project: "Half Adder",                                  concept: "Binary Addition",            conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 25, project: "Full Adder",                                  concept: "Binary Addition with Carry", conceptColor: cDE,  skills: sDE,  skolverket: lg79DE },
      { n: 26, project: "Introduction to Thonny",                      concept: "IOT – Intro to Interface",   conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 27, project: "Motor Controls",                              concept: "MicroPython using Hardware",  conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 28, project: "WiFi Connection",                             concept: "Setting up of Network",      conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 29, project: "Create a Webpage",                            concept: "IOT – HTML & CSS",           conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
      { n: 30, project: "Wifi Controlled LED",                         concept: "IOT – Wireless Connection",  conceptColor: cESP, skills: sESP, skolverket: lg79ESP },
    ],
  },
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
              { id: "gallery3d", label: "3D Gallery", icon: <Boxes className="w-4 h-4" /> },
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

        {/* ─── 3D GALLERY TAB ───────────────────────────────────────────── */}
        {activeTab === "gallery3d" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Interactive 3D Gallery</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Explore Blix kit components in 3D. Drag any model to rotate, or toggle auto-rotate.
                A live preview of every part across the six boxes.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 bg-muted/50 rounded-full p-1">
                <button
                  onClick={() => setGalleryAutoRotate(true)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    galleryAutoRotate ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Auto-Rotate
                </button>
                <button
                  onClick={() => setGalleryAutoRotate(false)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    !galleryAutoRotate ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Manual
                </button>
              </div>
            </div>
            <ThreeDGallery autoRotate={galleryAutoRotate} />
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
