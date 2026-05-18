import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { ChevronLeft, ChevronRight, Camera, Maximize2, Ruler, Sparkles, CheckCircle2, RefreshCw, Box, Link2 } from "lucide-react";
import { type Chapter, tr } from "@/data/chapters";
import { useNavigate } from "react-router-dom";
import type { VerifyResult } from "@/hooks/useComponentDetector";
import type { ResearchNavState } from "@/pages/AIResearch";
import { renderStepReferenceImage } from "@/components/ThreeDGallery";

// ─── Component connections ────────────────────────────────────────────────────
type ConnType = "gear" | "drive" | "structural" | "electronic";

interface Conn { effect: string; type: ConnType; emoji: string }

// Each entry: [prefix-A, prefix-B, connection effect]
// Matching is lowercase prefix/includes — first match wins per unique pair
const CONNECTIONS: [string, string, Conn][] = [
  // Mechanical drive
  ["wheel",      "motor",    { effect: "Motor drives the wheel — robot rolls forward",         type: "drive",      emoji: "🚗" }],
  ["wheel",      "sh",       { effect: "Axle shaft links wheel to the frame",                  type: "structural", emoji: "🔗" }],
  ["motor",      "g20",      { effect: "Motor output feeds into gear stage — speed reduced",   type: "gear",       emoji: "⚙️" }],
  ["motor",      "g60",      { effect: "Motor output → large gear, high torque",               type: "gear",       emoji: "⚙️" }],
  ["motor",      "pulley",   { effect: "Motor → belt drive — power over distance",             type: "drive",      emoji: "🔄" }],
  // Gears
  ["g20",        "g60",      { effect: "3 : 1 reduction — 3× more torque, ⅓ speed",           type: "gear",       emoji: "⚙️" }],
  ["g20",        "g20",      { effect: "1 : 1 speed transfer to adjacent shaft",               type: "gear",       emoji: "↔️" }],
  ["g20",        "rack",     { effect: "Rotation → linear slide motion (rack & pinion)",       type: "gear",       emoji: "↕️" }],
  ["g60",        "rack",     { effect: "Slow, powerful linear drive via large gear",           type: "gear",       emoji: "↕️" }],
  ["g20",        "pulley",   { effect: "Gear-to-belt coupling",                                type: "drive",      emoji: "🔄" }],
  // Shafts & bearings
  ["sh",         "g20",      { effect: "Shaft carries small gear rotation through frame",      type: "drive",      emoji: "🔩" }],
  ["sh",         "g60",      { effect: "Shaft carries large gear rotation through frame",      type: "drive",      emoji: "🔩" }],
  ["sh",         "wheel",    { effect: "Axle shaft spins inside wheel hub",                    type: "drive",      emoji: "🔩" }],
  ["tw",         "sh",       { effect: "Twist joint: shaft rotates freely inside connector",   type: "structural", emoji: "🔄" }],
  // Belt drive
  ["pulley",     "thread",   { effect: "Belt drive — transfers spin over distance",            type: "drive",      emoji: "🔄" }],
  // Structural connectors
  ["ct",         "p",        { effect: "T-connector locks beam at 90° joint",                  type: "structural", emoji: "🔩" }],
  ["ch",         "p",        { effect: "Cross connector anchors beams at junction",            type: "structural", emoji: "🔩" }],
  ["cl",         "p",        { effect: "L-connector forms right-angle beam joint",             type: "structural", emoji: "🔩" }],
  ["p7x11",      "ct",       { effect: "Double beam + T-connector = rigid structural frame",   type: "structural", emoji: "🏗️" }],
  ["p21x21",     "p",        { effect: "Base plate anchors the full beam framework",           type: "structural", emoji: "🏗️" }],
  ["pu",         "sh",       { effect: "U-pillar guides shaft between two support walls",      type: "structural", emoji: "🔗" }],
  // Suspension & steering
  ["suspension", "wheel",    { effect: "Spring suspension absorbs wheel shock",                type: "structural", emoji: "🌿" }],
  ["steering",   "sh",       { effect: "Steering shaft translates turn angle to front axle",  type: "drive",      emoji: "🎮" }],
  // Electronics (basic patterns)
  ["esp32",      "motor",    { effect: "ESP32 GPIO signal controls motor driver",             type: "electronic", emoji: "💡" }],
  ["esp32",      "servo",    { effect: "ESP32 PWM output positions servo arm",               type: "electronic", emoji: "💡" }],
  ["esp32",      "sensor",   { effect: "ESP32 reads sensor data via ADC/digital pin",        type: "electronic", emoji: "📡" }],
  ["battery",    "esp32",    { effect: "Battery box powers the ESP32 microcontroller",       type: "electronic", emoji: "🔋" }],
  ["battery",    "motor",    { effect: "Battery drives motor directly through circuit",      type: "electronic", emoji: "🔋" }],
];

const CONN_STYLE: Record<ConnType, { bg: string; text: string; border: string; badge: string }> = {
  gear:       { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-700"    },
  drive:      { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", badge: "bg-orange-100 text-orange-700" },
  structural: { bg: "bg-gray-50",   text: "text-gray-700",   border: "border-gray-200",   badge: "bg-gray-100 text-gray-600"    },
  electronic: { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   badge: "bg-teal-100 text-teal-700"    },
};

function findConnections(comps: { code: string; qty: number }[]): { a: string; b: string; conn: Conn }[] {
  const results: { a: string; b: string; conn: Conn }[] = [];
  const seen = new Set<string>();
  for (const [pa, pb, conn] of CONNECTIONS) {
    const aMatch = comps.find(c => c.code.toLowerCase().includes(pa));
    const bMatch = comps.find(c => c.code.toLowerCase().includes(pb));
    if (!aMatch || !bMatch || aMatch.code === bMatch.code) continue;
    const key = [aMatch.code, bMatch.code].sort().join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({ a: aMatch.code, b: bMatch.code, conn });
  }
  return results;
}

// ─── Reference image generator ────────────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function buildReferenceImage(comps: { code: string; qty: number }[]): string {
  const W = 320, H = 240;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  // Background
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, W, H);
  // Header strip
  ctx.fillStyle = "#f97316";
  ctx.fillRect(0, 0, W, 26);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Reference Build", 10, 17);
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "10px system-ui";
  ctx.fillText(`${comps.length} component${comps.length !== 1 ? "s" : ""}`, W - 8, 17);
  ctx.textAlign = "left";

  const cols = Math.min(Math.ceil(Math.sqrt(comps.length * 1.4)), 4);
  const rows = Math.ceil(comps.length / cols);
  const PAD = 8;
  const cellW = (W - PAD * 2) / cols;
  const cellH = (H - 30) / Math.max(rows, 1);

  comps.forEach(({ code, qty }, i) => {
    const col = i % cols; const row = Math.floor(i / cols);
    const x = PAD + col * cellW; const y = 30 + row * cellH;
    const colorHex = "#" + codeColor(code).toString(16).padStart(6, "0");
    ctx.fillStyle = colorHex + "28";
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 1.5;
    roundRect(ctx, x + 3, y + 3, cellW - 6, cellH - 6, 7);
    ctx.fill(); ctx.stroke();
    // Code
    ctx.fillStyle = "#111827";
    const fs = Math.min(12, Math.max(8, 90 / Math.max(code.length, 1)));
    ctx.font = `bold ${fs}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText(code.length > 9 ? code.slice(0, 9) : code, x + cellW / 2, y + cellH / 2 + 1);
    // Qty badge
    ctx.fillStyle = colorHex;
    ctx.font = "bold 9px system-ui";
    ctx.fillText(`×${qty}`, x + cellW / 2, y + cellH / 2 + 13);
    ctx.textAlign = "left";
  });
  return canvas.toDataURL("image/png");
}

// ─── Component code → colour ──────────────────────────────────────────────────
const CODE_COLOR: Record<string, number> = {
  // Structural pillars — orange/amber
  P3: 0xfbbf24, P5: 0xfbbf24, P7: 0xfbbf24, P11: 0xf59e0b,
  "P3+": 0xfbbf24, "P3 Plus": 0xfbbf24, PC3: 0xfbbf24,
  "P7x11": 0xd97706, "P7X11": 0xd97706,
  "P21x21": 0xa3a3a3, "P21X21": 0xa3a3a3,
  "PU5x7": 0xd97706, "PU5x13": 0xd97706, "PU5X7": 0xd97706, "PU5X13": 0xd97706,
  "P5 Nut": 0xf59e0b, "P5-NUT": 0xf59e0b,
  // Connectors — orange / blue
  CT2: 0xfbbf24, CT3: 0x3b82f6, CH2: 0x60a5fa, CL2: 0xfbbf24,
  "CT1X2": 0x3b82f6, "CT(1x2)": 0x3b82f6, TW1: 0x9ca3af, TW2: 0x9ca3af,
  // Shafts — silver
  SH60: 0xc0c0c0, SH100: 0xc0c0c0, SH170: 0xc0c0c0,
  // Gears — blue / amber
  G20: 0x60a5fa, "G20+": 0x60a5fa, "G20 Plus": 0x60a5fa,
  "G20 Idler": 0x93c5fd, "G20-IDL": 0x93c5fd,
  G60: 0xfbbf24, Rack: 0xfbbf24, "Power Screw": 0xfbbf24,
  // Wheels & mechanical
  Wheel: 0x1f2937, "Wheel w/o tires": 0x374151, "W-NT": 0x374151,
  Pulley: 0xfbbf24, Suspension: 0xfbbf24,
  Steering: 0x1f2937, "Steering wheel": 0x1f2937,
  Spoiler: 0xfbbf24, MGL: 0xfbbf24, MGR: 0xfbbf24,
  "Mudguard Left": 0xfbbf24, "Mudguard Right": 0xfbbf24,
  // Motors & power
  "Motor with Battery Box": 0x374151,
  BB: 0x374151, BB3V: 0xef4444, BB6V: 0xdc2626,
  "M-ACC": 0x374151, Fan: 0x93c5fd,
  // Logic blocks — colour-coded
  "POWER-BLK": 0xfde047, "NOT-BLK": 0xf97316,
  "LED-BLK": 0xef4444,   "BUZZER-BLK": 0x22c55e,
  "MOTOR-BLK": 0x3b82f6, "DIST-BLK": 0xa855f7,
  "IR-BLK": 0xec4899,    "SWITCH-BLK": 0xe5e7eb,
  // Electronics
  Queaky: 0x4ade80, Thread: 0x94a3b8, "CT-TWR": 0xfbbf24,
  "AC-R": 0xef4444, "AC-B": 0x1f2937,
  ESP32: 0x2563eb, SERVO: 0x3b82f6, DCMB: 0x16a34a,
  "PCB-7SEG": 0x15803d, "IR-S": 0x374151, LS: 0x6b7280,
  // Magnets
  DM: 0x9ca3af, BM: 0xef4444,
  // Marble stem
  MRS14: 0xf97316, MRB7: 0xf97316, MRH5: 0xf97316,
  MAR: 0x7dd3fc, P3C2: 0xf97316, BCKT: 0xfbbf24,
  // Consumables
  Balloon: 0xef4444, RB: 0xfbbf24,
};
export function codeColor(code: string): number {
  if (CODE_COLOR[code]) return CODE_COLOR[code];
  for (const k of Object.keys(CODE_COLOR))
    if (code.toLowerCase().startsWith(k.toLowerCase())) return CODE_COLOR[k];
  return 0xd97706;
}

// ─── Three.js helpers ─────────────────────────────────────────────────────────
export function mk(g: THREE.BufferGeometry, color: number, metalness = 0.15, roughness = 0.5) {
  return new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, metalness, roughness }));
}
function buildShape(code: string): THREE.Object3D {
  const c = codeColor(code); const g = new THREE.Group(); const lc = code.toLowerCase();

  // ── Base plates (flat rectangular plates with stud holes) ────────────────────
  if (lc.includes("p21x21")) {
    // Large grey square base plate
    g.add(mk(new THREE.BoxGeometry(1.9, 0.1, 1.9), 0xa3a3a3));
    for (let a = -2; a <= 2; a++) for (let b2 = -2; b2 <= 2; b2++) {
      const s = mk(new THREE.CylinderGeometry(0.065, 0.065, 0.09, 8), 0xa3a3a3);
      s.position.set(a * 0.37, 0.09, b2 * 0.37); g.add(s);
    }
  } else if (lc.includes("p7x11")) {
    // Flat rectangular plate (grey) — NOT a U-shape
    const W = 1.6; const D = 1.0;
    g.add(mk(new THREE.BoxGeometry(W, 0.1, D), 0xd1d5db));
    for (let a = 0; a < 3; a++) for (let b2 = 0; b2 < 2; b2++) {
      const s = mk(new THREE.CylinderGeometry(0.055, 0.055, 0.08, 8), 0xd1d5db);
      s.position.set(-0.48 + a * 0.48, 0.09, -0.22 + b2 * 0.44); g.add(s);
    }

  // ── U-pillars (two legs + crosspiece) ────────────────────────────────────────
  } else if (lc.startsWith("pu")) {
    const h = lc.includes("13") ? 2.2 : 1.6;
    [-0.6, 0.6].forEach(x => { const l = mk(new THREE.BoxGeometry(0.3, h, 0.4), c); l.position.x = x; g.add(l); });
    const b2 = mk(new THREE.BoxGeometry(1.5, 0.3, 0.4), c); b2.position.y = -(h / 2) - 0.0; g.add(b2);

  // ── Pillars (yellow rectangular beams with circular holes) ───────────────────
  } else if (lc === "p3+" || lc === "p3 plus" || lc === "p3+") {
    // Short pillar with through holes + stud on top
    g.add(mk(new THREE.BoxGeometry(0.52, 0.44, 0.44), c));
    for (let i = 0; i < 2; i++) {
      const bore = mk(new THREE.CylinderGeometry(0.1, 0.1, 0.48, 10), 0x5a3d00, 0.05, 0.9);
      bore.rotation.z = Math.PI / 2; bore.position.x = -0.13 + i * 0.26; g.add(bore);
    }
  } else if (lc === "pc3") {
    g.add(mk(new THREE.BoxGeometry(1.1, 0.12, 0.38), c));
    const arm = mk(new THREE.BoxGeometry(0.38, 0.12, 0.6), c); arm.position.z = 0.35; g.add(arm);
  } else if (/^p\d+/i.test(code.trim())) {
    const holes = parseInt(code.replace(/\D/g, "")) || 5;
    const w = 0.52; const depth = 0.44;
    const totalW = w * Math.min(holes, 8);
    g.add(mk(new THREE.BoxGeometry(totalW, 0.44, depth), c));
    for (let i = 0; i < Math.min(holes, 8); i++) {
      const bore = mk(new THREE.CylinderGeometry(0.1, 0.1, depth + 0.05, 10), 0x5a3d00, 0.05, 0.9);
      bore.rotation.x = Math.PI / 2;
      bore.position.set(-totalW / 2 + w * 0.5 + i * w, 0, 0); g.add(bore);
    }

  // ── Connectors ──────────────────────────────────────────────────────────────
  } else if (lc === "ch2") {
    // Blue connector with cylindrical barrel port on top
    g.add(mk(new THREE.BoxGeometry(0.55, 0.5, 0.55), 0x60a5fa));
    const port = mk(new THREE.CylinderGeometry(0.18, 0.18, 0.28, 12), 0x3b82f6, 0.2, 0.7);
    port.position.y = 0.39; g.add(port);
    g.add(mk(new THREE.CylinderGeometry(0.09, 0.09, 0.52, 10), 0x1e3a5f, 0.05, 1.0));
  } else if (lc === "cl2") {
    // Flat yellow double-tab clip
    [-0.28, 0.28].forEach(x => {
      g.add(mk(new THREE.BoxGeometry(0.48, 0.22, 0.44), c) as THREE.Mesh).position.x = x;
      const bore = mk(new THREE.CylinderGeometry(0.1, 0.1, 0.48, 10), 0x5a3d00, 0.05, 1.0);
      bore.rotation.z = Math.PI / 2; bore.position.x = x; g.add(bore);
    });
  } else if (lc.startsWith("ct")) {
    // Orange T-shape with through-bore
    g.add(mk(new THREE.BoxGeometry(1.0, 0.42, 0.44), c));
    g.add(mk(new THREE.BoxGeometry(0.42, 0.58, 0.44), c)).position.y = -0.46;
    const bore = mk(new THREE.CylinderGeometry(0.13, 0.13, 1.05, 12), 0x5a3d00, 0.05, 1.0);
    bore.rotation.z = Math.PI / 2; g.add(bore);
  } else if (lc.startsWith("cl")) {
    // L-connector (right-angle)
    g.add(mk(new THREE.BoxGeometry(0.8, 0.4, 0.42), c));
    const arm = mk(new THREE.BoxGeometry(0.4, 0.7, 0.42), c); arm.position.set(-0.2, 0.55, 0); g.add(arm);

  // ── Axle sleeves / washers (short solid cylinders, NOT rings) ────────────────
  } else if (lc.startsWith("tw")) {
    // Short solid black cylinder — matches real TW1 photo
    g.add(mk(new THREE.CylinderGeometry(0.36, 0.36, 0.44, 16), 0x111111, 0.2, 0.8));
    g.add(mk(new THREE.CylinderGeometry(0.13, 0.13, 0.48, 10), 0x374151, 0.1, 1.0));

  // ── Shafts (silver metal rods) ───────────────────────────────────────────────
  } else if (lc.startsWith("sh")) {
    const len = (parseInt(code.replace(/\D/g, "")) || 60) / 60;
    g.add(mk(new THREE.CylinderGeometry(0.07, 0.07, len, 12), 0xc0c0c0, 0.7, 0.3));

  // ── Gears (flat disc with teeth + plus-hub) ──────────────────────────────────
  } else if (lc.startsWith("g20")) {
    const r = 0.62; const thick = 0.22; const teeth = 16;
    g.add(mk(new THREE.CylinderGeometry(r, r, thick, 32), c));
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      const t = mk(new THREE.BoxGeometry(0.12, thick, 0.14), c);
      t.position.set(Math.cos(a) * (r + 0.07), 0, Math.sin(a) * (r + 0.07)); t.rotation.y = a; g.add(t);
    }
    g.add(mk(new THREE.CylinderGeometry(r * 0.22, r * 0.22, thick + 0.04, 12), c));
    [0, Math.PI / 2].forEach(a => {
      const sl = mk(new THREE.BoxGeometry(r * 0.52, thick + 0.06, r * 0.13), 0x000000, 0, 1.0);
      sl.rotation.y = a; g.add(sl);
    });
  } else if (lc === "g60") {
    const r = 0.95; const thick = 0.24; const teeth = 28;
    g.add(mk(new THREE.CylinderGeometry(r, r, thick, 60), 0xfbbf24));
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      const t = mk(new THREE.BoxGeometry(0.13, thick, 0.15), 0xfbbf24);
      t.position.set(Math.cos(a) * (r + 0.075), 0, Math.sin(a) * (r + 0.075)); t.rotation.y = a; g.add(t);
    }
    g.add(mk(new THREE.CylinderGeometry(r * 0.25, r * 0.25, thick + 0.04, 12), 0xfbbf24));
    [0, Math.PI / 2].forEach(a => {
      const sl = mk(new THREE.BoxGeometry(r * 0.5, thick + 0.06, r * 0.13), 0x000000, 0, 1.0);
      sl.rotation.y = a; g.add(sl);
    });
  } else if (lc === "rack") {
    g.add(mk(new THREE.BoxGeometry(1.8, 0.22, 0.36), c));
    for (let i = 0; i < 7; i++) { const t = mk(new THREE.BoxGeometry(0.12, 0.18, 0.38), c); t.position.set(-0.78 + i * 0.26, 0.2, 0); g.add(t); }
  } else if (lc.includes("power screw") || lc.includes("p5-nut") || lc.includes("p5 nut")) {
    g.add(mk(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 12), 0xc0c0c0, 0.7, 0.2));
    for (let i = 0; i < 6; i++) { const t = mk(new THREE.TorusGeometry(0.14, 0.03, 6, 10), 0x888888, 0.5, 0.3); t.rotation.x = Math.PI / 2; t.position.y = -0.5 + i * 0.2; g.add(t); }

  // ── Wheels (orange spoke hub + black tyre torus) ──────────────────────────────
  } else if (lc === "wheel" || lc.includes("w/o") || lc === "w-nt") {
    const withTyre = !lc.includes("w/o") && lc !== "w-nt";
    if (withTyre) g.add(mk(new THREE.TorusGeometry(0.82, 0.3, 16, 32), 0x111111, 0.05, 0.9));
    const hubR = withTyre ? 0.38 : 0.78;
    const hub = mk(new THREE.CylinderGeometry(hubR, hubR, 0.26, 20), 0xf97316);
    hub.rotation.x = Math.PI / 2; g.add(hub);
    for (let i = 0; i < 5; i++) {
      const sp = mk(new THREE.BoxGeometry(hubR * 1.8, 0.07, 0.11), 0xf97316);
      sp.rotation.set(Math.PI / 2, (i / 5) * Math.PI * 2, 0); g.add(sp);
    }
    const axle = mk(new THREE.CylinderGeometry(0.09, 0.09, 0.32, 10), 0x374151, 0.6, 0.3);
    axle.rotation.x = Math.PI / 2; g.add(axle);

  // ── Pulley (blue bobbin/spool with flanged edges) ────────────────────────────
  } else if (lc === "pulley") {
    g.add(mk(new THREE.CylinderGeometry(0.44, 0.44, 0.36, 20), 0x2563eb, 0.15, 0.6));
    const fl = (y: number) => { const f = mk(new THREE.CylinderGeometry(0.7, 0.7, 0.13, 24), 0x3b82f6, 0.1, 0.7); f.position.y = y; g.add(f); };
    fl(0.245); fl(-0.245);
    g.add(mk(new THREE.CylinderGeometry(0.12, 0.12, 0.65, 10), 0x1e3a5f, 0.1, 1.0));

  // ── Suspension (black rod + yellow spring coils + end caps) ──────────────────
  } else if (lc.includes("suspension")) {
    g.add(mk(new THREE.CylinderGeometry(0.07, 0.07, 2.0, 10), 0x111111, 0.5, 0.5));
    for (let i = 0; i < 7; i++) { const ring = mk(new THREE.TorusGeometry(0.26, 0.055, 8, 16), 0xfbbf24, 0.1, 0.8); ring.rotation.x = Math.PI / 2; ring.position.y = -0.55 + i * 0.18; g.add(ring); }
    const cap = mk(new THREE.CylinderGeometry(0.19, 0.19, 0.16, 12), 0x1f2937, 0.3, 0.7); cap.position.y = 0.96; g.add(cap);
    const ring2 = mk(new THREE.TorusGeometry(0.2, 0.07, 8, 16), 0xf97316, 0.1, 0.7); ring2.rotation.x = Math.PI / 2; ring2.position.y = -0.96; g.add(ring2);

  // ── Steering wheel ────────────────────────────────────────────────────────────
  } else if (lc.includes("steering")) {
    g.add(mk(new THREE.TorusGeometry(0.6, 0.07, 8, 24), 0x1f2937));
    const hub = mk(new THREE.CylinderGeometry(0.1, 0.1, 0.14, 10), 0x374151); hub.rotation.x = Math.PI / 2; g.add(hub);
    [0, 1, 2].forEach(i => { const sp = mk(new THREE.BoxGeometry(0.08, 0.5, 0.06), 0x374151); sp.rotation.z = (i / 3) * Math.PI; g.add(sp); });

  // ── Mudguard ──────────────────────────────────────────────────────────────────
  } else if (lc.includes("mudguard") || lc === "mgl" || lc === "mgr") {
    g.add(mk(new THREE.BoxGeometry(0.9, 0.12, 0.55), c));
    const arch = mk(new THREE.TorusGeometry(0.3, 0.06, 8, 12, Math.PI), c); arch.rotation.x = Math.PI / 2; arch.position.y = 0.14; g.add(arch);

  // ── Spoiler ───────────────────────────────────────────────────────────────────
  } else if (lc.includes("spoiler")) {
    g.add(mk(new THREE.BoxGeometry(1.4, 0.08, 0.35), c));
    [-0.6, 0.6].forEach(x => { const post = mk(new THREE.BoxGeometry(0.1, 0.5, 0.1), c); post.position.set(x, 0.29, 0); g.add(post); });

  // ── Motor + battery box (green cylinder + orange box + shaft) ─────────────────
  } else if (lc.includes("motor")) {
    const body = mk(new THREE.CylinderGeometry(0.34, 0.34, 0.78, 20), 0x16a34a, 0.15, 0.6);
    body.rotation.z = Math.PI / 2; g.add(body);
    const bbox = mk(new THREE.BoxGeometry(0.68, 0.48, 0.44), 0xf97316); bbox.position.x = 0.62; g.add(bbox);
    const shaft = mk(new THREE.CylinderGeometry(0.06, 0.06, 0.28, 10), 0x9ca3af, 0.7, 0.2); shaft.rotation.z = Math.PI / 2; shaft.position.x = -0.52; g.add(shaft);

  // ── Battery boxes ─────────────────────────────────────────────────────────────
  } else if (lc.startsWith("bb") || lc.includes("battery")) {
    g.add(mk(new THREE.BoxGeometry(0.9, 0.55, 0.45), 0x374151));
    const wireCol = lc.includes("3v") ? 0xef4444 : 0xdc2626;
    const rw = mk(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6), 0xef4444, 0.2, 0.8); rw.position.set(0.36, 0.47, 0.1); g.add(rw);
    const bw = mk(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6), wireCol === 0xef4444 ? 0x111111 : wireCol, 0.2, 0.8); bw.position.set(0.36, 0.47, -0.1); g.add(bw);

  // ── Fan ───────────────────────────────────────────────────────────────────────
  } else if (lc === "fan" || lc === "m-acc") {
    g.add(mk(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 10), 0x374151, 0.4, 0.6));
    for (let i = 0; i < 3; i++) {
      const pivot = new THREE.Object3D(); pivot.rotation.y = (i / 3) * Math.PI * 2;
      const blade = mk(new THREE.BoxGeometry(0.22, 0.05, 0.62), 0x93c5fd, 0.1, 0.8); blade.position.set(0.33, 0, 0); blade.rotation.z = 0.25;
      pivot.add(blade); g.add(pivot);
    }

  // ── Logic blocks (colour-coded square tiles) ──────────────────────────────────
  } else if (lc.endsWith("-blk") || ["power-blk","not-blk","led-blk","buzzer-blk","motor-blk","dist-blk","ir-blk","switch-blk"].includes(lc)) {
    g.add(mk(new THREE.BoxGeometry(1.3, 0.65, 1.3), 0x1f2937));
    g.add(mk(new THREE.BoxGeometry(0.88, 0.07, 0.88), c, 0.05, 0.75)).position.y = 0.36;
    const pL = mk(new THREE.CylinderGeometry(0.13, 0.13, 0.22, 12), 0x9ca3af, 0.6, 0.3); pL.rotation.z = Math.PI / 2; pL.position.x = -0.78; g.add(pL);
    const pR = mk(new THREE.CylinderGeometry(0.13, 0.13, 0.22, 12), 0x9ca3af, 0.6, 0.3); pR.rotation.z = Math.PI / 2; pR.position.x =  0.78; g.add(pR);

  // ── Queaky (yellow flat device + silver ear tabs + eyes) ──────────────────────
  } else if (lc === "queaky") {
    g.add(mk(new THREE.BoxGeometry(1.7, 0.52, 0.85), 0xfde047, 0.05, 0.8));
    [-0.98, 0.98].forEach(x => { const ear = mk(new THREE.BoxGeometry(0.26, 0.11, 0.28), 0x9ca3af, 0.6, 0.3); ear.position.set(x, 0.1, 0); g.add(ear); });
    [-0.35, 0.35].forEach(x => {
      g.add(mk(new THREE.CylinderGeometry(0.13, 0.13, 0.06, 14), 0xffffff, 0, 1.0)).position.set(x, 0.28, 0.44);
      g.add(mk(new THREE.CylinderGeometry(0.06, 0.06, 0.07, 10), 0x111111, 0, 1.0)).position.set(x, 0.28, 0.45);
    });

  // ── ESP32 ─────────────────────────────────────────────────────────────────────
  } else if (lc === "esp32") {
    g.add(mk(new THREE.BoxGeometry(1.3, 0.06, 0.7), 0x1e3a5f));
    for (let i = 0; i < 8; i++) {
      const p = mk(new THREE.BoxGeometry(0.05, 0.12, 0.05), 0xe5e7eb); p.position.set(-0.55 + i * 0.16, 0.09, 0.32); g.add(p);
      const p2 = mk(new THREE.BoxGeometry(0.05, 0.12, 0.05), 0xe5e7eb); p2.position.set(-0.55 + i * 0.16, 0.09, -0.32); g.add(p2);
    }
    const ant = mk(new THREE.BoxGeometry(0.22, 0.06, 0.16), 0x93c5fd); ant.position.set(0.56, 0.06, 0); g.add(ant);
    const mcu = mk(new THREE.BoxGeometry(0.52, 0.1, 0.52), 0x0f172a); mcu.position.y = 0.08; g.add(mcu);

  // ── Servo ─────────────────────────────────────────────────────────────────────
  } else if (lc === "servo") {
    g.add(mk(new THREE.BoxGeometry(0.7, 0.6, 0.38), 0x374151));
    const horn = mk(new THREE.CylinderGeometry(0.18, 0.18, 0.1, 12), 0xd1d5db); horn.position.set(0, 0.35, 0); g.add(horn);
    const arm = mk(new THREE.BoxGeometry(0.38, 0.07, 0.09), 0xd1d5db); arm.position.set(0.26, 0.35, 0); g.add(arm);

  // ── PCB / 7-segment ───────────────────────────────────────────────────────────
  } else if (lc.includes("pcb") || lc.includes("7seg") || lc === "dcmb") {
    g.add(mk(new THREE.BoxGeometry(0.9, 0.06, 0.65), 0x15803d));
    g.add(mk(new THREE.BoxGeometry(0.32, 0.09, 0.5), 0xef4444)).position.set(0.1, 0.075, 0);

  // ── Connecting tower ──────────────────────────────────────────────────────────
  } else if (lc.includes("ct-twr") || lc.includes("connecting tower")) {
    g.add(mk(new THREE.CylinderGeometry(0.1, 0.12, 1.0, 10), 0xe5e7eb, 0.05, 0.6));
    g.add(mk(new THREE.CylinderGeometry(0.22, 0.22, 0.26, 10), 0x111111, 0.3, 0.7)).position.y = 0.63;
    for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2; const pr = mk(new THREE.BoxGeometry(0.42, 0.09, 0.1), 0x111111, 0.3, 0.7); pr.position.set(Math.cos(a) * 0.22, 0.63, Math.sin(a) * 0.22); pr.rotation.y = a; g.add(pr); }

  // ── IR sensor / limit switch ───────────────────────────────────────────────────
  } else if (lc.includes("ir-s") || lc.includes("ir sensor") || lc === "ls") {
    g.add(mk(new THREE.BoxGeometry(0.55, 0.3, 0.22), 0x374151));
    [-0.1, 0.1].forEach(z => { const eye = mk(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 10), 0x1f2937); eye.rotation.z = Math.PI / 2; eye.position.set(0.32, 0, z); g.add(eye); });

  // ── Magnets ───────────────────────────────────────────────────────────────────
  } else if (lc === "dm" || lc.includes("donut magnet")) {
    g.add(mk(new THREE.TorusGeometry(0.5, 0.18, 12, 28), 0x9ca3af, 0.8, 0.2));
  } else if (lc === "bm" || lc.includes("bar magnet")) {
    g.add(mk(new THREE.BoxGeometry(1.4, 0.3, 0.22), 0x9ca3af, 0.7, 0.2));
    const np = mk(new THREE.BoxGeometry(0.5, 0.3, 0.22), 0x3b82f6); np.position.x = -0.45; g.add(np);
    const sp2 = mk(new THREE.BoxGeometry(0.5, 0.3, 0.22), 0xef4444); sp2.position.x =  0.45; g.add(sp2);

  // ── Marble stem ───────────────────────────────────────────────────────────────
  } else if (lc === "mrs14") {
    // Blue U-channel slide (matches photo)
    g.add(mk(new THREE.BoxGeometry(1.85, 0.09, 0.5), 0x3b82f6));
    [-0.23, 0.23].forEach(z => { const w = mk(new THREE.BoxGeometry(1.85, 0.26, 0.09), 0x2563eb); w.position.set(0, 0.18, z); g.add(w); });
  } else if (lc === "mrb7") {
    g.add(mk(new THREE.TorusGeometry(0.7, 0.14, 8, 18, Math.PI * 0.75), 0x3b82f6));
  } else if (lc === "mrh5") {
    g.add(mk(new THREE.ConeGeometry(0.5, 0.7, 12, 1, true), 0x3b82f6, 0.1, 0.9));
    const rim = mk(new THREE.TorusGeometry(0.5, 0.05, 6, 20), 0x2563eb); rim.position.y = 0.35; g.add(rim);
  } else if (lc === "mar") {
    g.add(mk(new THREE.SphereGeometry(0.25, 16, 16), 0x7dd3fc, 0.1, 0.05));
  } else if (lc === "bckt") {
    g.add(mk(new THREE.CylinderGeometry(0.25, 0.2, 0.4, 12, 1, true), c, 0.1, 0.9));
    const base = mk(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 12), c); base.position.y = -0.2; g.add(base);

  // ── Consumables ───────────────────────────────────────────────────────────────
  } else if (lc === "balloon") {
    g.add(mk(new THREE.SphereGeometry(0.7, 20, 20), 0xef4444, 0.05, 0.05));
    const tie = mk(new THREE.CylinderGeometry(0.04, 0.04, 0.25, 6), 0xdc2626); tie.position.y = -0.72; g.add(tie);
  } else if (lc === "rb" || lc.includes("rubber band")) {
    g.add(mk(new THREE.TorusGeometry(0.38, 0.06, 8, 24), 0xd4a373, 0.0, 0.9));
  } else if (lc === "thread" || lc === "wire") {
    for (let i = 0; i < 4; i++) { const ring = mk(new THREE.TorusGeometry(0.28, 0.03, 6, 16), 0x94a3b8, 0.2, 0.9); ring.rotation.x = Math.PI / 2; ring.position.y = -0.15 + i * 0.1; g.add(ring); }

  // ── Default ───────────────────────────────────────────────────────────────────
  } else {
    g.add(mk(new THREE.BoxGeometry(0.9, 0.9, 0.9), c));
  }
  return g;
}
function parseComps(list: string[]): { code: string; qty: number }[] {
  return list.flatMap(s => {
    const m = s.match(/^(.+?)\s*[xX×](\d+)$/);
    return m ? [{ code: m[1].trim(), qty: parseInt(m[2]) }] : [{ code: s.trim(), qty: 1 }];
  });
}
const EMPTY_COMPONENTS: string[] = [];
function disposeGroup(g: THREE.Group) {
  g.traverse(c => {
    if (c instanceof THREE.Mesh) { c.geometry.dispose(); (c.material as THREE.Material).dispose(); }
  });
  g.clear();
}

// ─── Real book page images — one per chapter ─────────────────────────────────
// Scanned pages from the Blix Grade 1 curriculum book (public/ folder).
// Page numbers come from the book; chapter IDs match chapters.ts (1-30).
const CHAPTER_PAGE_IMAGES: Record<number, string> = {
  1:  "/chapter_page_3.png",
  2:  "/chapter_page_8.png",
  3:  "/chapter_page_13.png",
  4:  "/chapter_page_15.png",
  5:  "/chapter_page_21.png",
  6:  "/chapter_page_23.png",
  7:  "/chapter_page_29.png",
  8:  "/chapter_page_31.png",
  9:  "/chapter_page_37.png",
  10: "/chapter_page_38.png",
  11: "/chapter_page_41.png",
  12: "/chapter_page_45.png",
  13: "/chapter_page_47.png",
  14: "/chapter_page_49.png",
  15: "/chapter_page_51.png",
  16: "/chapter_page_55.png",
  17: "/chapter_page_58.png",
  18: "/chapter_page_62.png",
  19: "/chapter_page_65.png",
  20: "/chapter_page_66.png",
  21: "/chapter_page_70.png",
  22: "/chapter_page_71.png",
  23: "/chapter_page_72.png",
  24: "/chapter_page_75.png",
  25: "/chapter_page_78.png",
  26: "/chapter_page_79.png",
  27: "/chapter_page_82.png",
  28: "/chapter_page_87.png",
  29: "/chapter_page_91.png",
  30: "/chapter_page_95.png",
};

// ─── Final assembled model builders (one per chapter) ────────────────────────
export function buildFinalAssembly(chapterId: number): THREE.Group {
  const g = new THREE.Group();
  const yw = 0xfbbf24; const bl = 0x60a5fa; const wh = 0xe5e7eb;
  const bk = 0x1f2937; const gr = 0x16a34a; const or = 0xf97316;

  // Helper: add a wheel at position (with tyre)
  const wheel = (x: number, y: number, z: number, r = 0) => {
    const wg = new THREE.Group();
    wg.add(mk(new THREE.TorusGeometry(0.82, 0.3, 16, 32), 0x111111, 0.05, 0.9));
    const hub = mk(new THREE.CylinderGeometry(0.38, 0.38, 0.26, 20), or); hub.rotation.x = Math.PI / 2; wg.add(hub);
    for (let i = 0; i < 5; i++) { const sp = mk(new THREE.BoxGeometry(0.65, 0.07, 0.1), or); sp.rotation.set(Math.PI / 2, (i / 5) * Math.PI * 2, 0); wg.add(sp); }
    wg.position.set(x, y, z); wg.rotation.y = r; g.add(wg);
  };
  // Helper: beam
  const beam = (x: number, y: number, z: number, w: number, h: number, d: number, col = yw, rx = 0, ry = 0, rz = 0) => {
    const m = mk(new THREE.BoxGeometry(w, h, d), col); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); g.add(m); return m;
  };
  // Helper: cylinder
  const cyl = (x: number, y: number, z: number, r: number, h: number, col: number, rx = 0, ry = 0, rz = 0) => {
    const m = mk(new THREE.CylinderGeometry(r, r, h, 16), col); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); g.add(m);
  };
  // Helper: sphere
  const sph = (x: number, y: number, z: number, r: number, col: number) => {
    const m = mk(new THREE.SphereGeometry(r, 16, 16), col, 0.1, 0.3); m.position.set(x, y, z); g.add(m);
  };

  switch (chapterId) {
    case 1: { // Wheeling Cart — two beams + 4 wheels + axles
      beam(0, 0, 0.9, 3.2, 0.18, 0.42);   // left chassis beam
      beam(0, 0, -0.9, 3.2, 0.18, 0.42);  // right chassis beam
      beam(0, 0, 0, 1.0, 0.14, 2.2, 0xe5e7eb); // front cross-brace
      beam(1.2, 0, 0, 0.14, 0.14, 2.2, 0xe5e7eb); // rear cross-brace
      cyl(1.1, -0.3, 0, 0.07, 2.2, 0x111111, 0, 0, Math.PI / 2); // rear axle
      cyl(-1.1, -0.3, 0, 0.07, 2.2, 0x111111, 0, 0, Math.PI / 2); // front axle
      wheel(-1.1, -0.3, 1.15); wheel(-1.1, -0.3, -1.15);
      wheel( 1.1, -0.3, 1.15); wheel( 1.1, -0.3, -1.15);
      break;
    }
    case 2: { // Aerodynamics Car — sloped body, 4 wheels, spoiler
      beam(0, 0.1, 0.85, 3.0, 0.16, 0.42);   // chassis left
      beam(0, 0.1, -0.85, 3.0, 0.16, 0.42);  // chassis right
      beam(-0.2, 0.45, 0, 2.2, 0.52, 1.8, 0xf97316); // body
      beam(-0.9, 0.65, 0, 0.8, 0.15, 1.6, 0xfde047); // windscreen slope
      beam(1.3, 0.58, 0, 1.5, 0.08, 1.6, 0xf97316);  // spoiler
      [-0.1, 0.8].forEach(mx => { const p = mk(new THREE.BoxGeometry(0.1, 0.48, 0.08), yw); p.position.set(1.3 + mx * 0.5, 0.82, 0.6); g.add(p); });
      cyl( 1.1, -0.32, 0, 0.07, 2.0, 0x111111, 0, 0, Math.PI / 2);
      cyl(-1.1, -0.32, 0, 0.07, 2.0, 0x111111, 0, 0, Math.PI / 2);
      wheel(-1.1, -0.32, 1.05); wheel(-1.1, -0.32, -1.05);
      wheel( 1.1, -0.32, 1.05); wheel( 1.1, -0.32, -1.05);
      break;
    }
    case 3: case 7: case 9: case 21: case 22: case 25: case 26: case 28: case 29: {
      // Checkpoint chapters — trophy/star visual
      cyl(0, -0.5, 0, 0.15, 1.2, yw);
      cyl(0, -0.9, 0, 0.6, 0.18, yw);
      sph(0, 0.55, 0, 0.55, 0xfde047);
      const star = mk(new THREE.TorusGeometry(0.45, 0.07, 8, 5), 0xfbbf24); star.position.y = 0.55; g.add(star);
      break;
    }
    case 4: { // Trebuchet — A-frame base + arm + counterweight
      // Base frame A-shape
      const ang = Math.PI / 6;
      [1, -1].forEach(s => { const leg = mk(new THREE.BoxGeometry(0.14, 2.2, 0.14), yw); leg.position.set(s * 0.7, 0, 0); leg.rotation.z = s * ang; g.add(leg); });
      beam(0, -1.1, 0, 2.0, 0.14, 0.14); // base crossbar
      beam(0, -0.2, 0.8, 2.0, 0.14, 0.14); // cross brace
      // Pivot post + throwing arm
      cyl(0, 0.9, 0, 0.09, 1.6, wh, 0, 0, Math.PI / 2); // pivot axle
      const arm = mk(new THREE.BoxGeometry(2.8, 0.12, 0.12), yw); arm.position.set(0.3, 0.9, 0); arm.rotation.z = -0.3; g.add(arm);
      sph(-0.9, 1.4, 0, 0.3, bk); // counterweight
      sph(1.5, 0.6, 0, 0.15, 0xfde047); // projectile
      break;
    }
    case 5: { // Sign Boards — post + 3 boards at angles
      beam(0, 0, 0, 0.14, 3.0, 0.14); // post
      [0.8, 0.2, -0.4].forEach((y, i) => {
        const board = mk(new THREE.BoxGeometry(1.2, 0.38, 0.08), [0xef4444, 0x3b82f6, 0x22c55e][i]);
        board.position.set(0.7, y, 0); board.rotation.z = 0.2; g.add(board);
      });
      break;
    }
    case 6: { // Suspension Car — chassis + wheels + suspension + steering
      beam(0, 0.12, 0.9, 3.2, 0.16, 0.42);
      beam(0, 0.12, -0.9, 3.2, 0.16, 0.42);
      beam(0, 0.28, 0, 3.0, 0.55, 1.9, or); // body
      // Suspension springs at each corner
      [[-1.0, 0.9], [-1.0, -0.9], [1.0, 0.9], [1.0, -0.9]].forEach(([x, z]) => {
        const susp = mk(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 10), bk); susp.position.set(x as number, -0.1, z as number); g.add(susp);
        for (let i = 0; i < 3; i++) { const ring = mk(new THREE.TorusGeometry(0.14, 0.03, 6, 12), yw); ring.rotation.x = Math.PI / 2; ring.position.set(x as number, -0.18 + i * 0.12, z as number); g.add(ring); }
      });
      cyl( 1.1, -0.32, 0, 0.07, 2.0, 0x111111, 0, 0, Math.PI / 2);
      cyl(-1.1, -0.32, 0, 0.07, 2.0, 0x111111, 0, 0, Math.PI / 2);
      wheel(-1.1, -0.32, 1.05); wheel(-1.1, -0.32, -1.05);
      wheel( 1.1, -0.32, 1.05); wheel( 1.1, -0.32, -1.05);
      // Steering wheel on top
      const sw = mk(new THREE.TorusGeometry(0.3, 0.05, 8, 20), bk); sw.position.set(-0.6, 0.88, 0.4); sw.rotation.x = Math.PI / 3; g.add(sw);
      break;
    }
    case 8: { // Rack & Pinion Lift — vertical rack + gear + frame
      // Vertical frame
      [-0.6, 0.6].forEach(x => cyl(x, 0, 0, 0.08, 3.0, yw));
      beam(0, 1.3, 0, 1.5, 0.14, 0.14); // top bar
      beam(0, -1.3, 0, 1.5, 0.14, 0.14); // bottom bar
      // Vertical rack
      beam(0, 0, 0, 0.22, 2.8, 0.38, yw);
      for (let i = 0; i < 9; i++) { beam(0.18, -1.2 + i * 0.28, 0, 0.14, 0.16, 0.4, yw); }
      // Gear on rack
      const gear = mk(new THREE.CylinderGeometry(0.55, 0.55, 0.22, 32), bl); gear.rotation.x = Math.PI / 2; gear.position.set(-0.4, 0.2, 0); g.add(gear);
      // Lift platform
      beam(-0.8, 0.8, 0, 1.2, 0.12, 0.8, 0xf97316);
      break;
    }
    case 10: { // Car Jack — scissor mechanism
      // X-crossed beams
      const a1 = mk(new THREE.BoxGeometry(2.8, 0.14, 0.14), yw); a1.rotation.z = 0.45; g.add(a1);
      const a2 = mk(new THREE.BoxGeometry(2.8, 0.14, 0.14), yw); a2.rotation.z = -0.45; g.add(a2);
      // Second X below
      const b1 = mk(new THREE.BoxGeometry(2.2, 0.14, 0.14), yw); b1.position.y = -0.9; b1.rotation.z = 0.55; g.add(b1);
      const b2 = mk(new THREE.BoxGeometry(2.2, 0.14, 0.14), yw); b2.position.y = -0.9; b2.rotation.z = -0.55; g.add(b2);
      // Top platform
      beam(0, 0.78, 0, 1.6, 0.1, 0.4, wh);
      // Screw rod through centre
      cyl(0, -0.4, 0, 0.06, 2.2, 0x9ca3af, 0, 0, Math.PI / 2);
      break;
    }
    case 11: { // Bear Trap — two jaw plates + spring base
      // Lower jaw
      const jaw1 = mk(new THREE.BoxGeometry(1.8, 0.12, 0.8), yw); jaw1.position.set(0, -0.2, 0); jaw1.rotation.x = -0.3; g.add(jaw1);
      // Upper jaw (open)
      const jaw2 = mk(new THREE.BoxGeometry(1.8, 0.12, 0.8), yw); jaw2.position.set(0, 0.55, 0); jaw2.rotation.x = 0.3; g.add(jaw2);
      // Pivot hinge
      cyl(0, 0.18, 0, 0.1, 1.85, bl, 0, 0, Math.PI / 2);
      // Spring
      for (let i = 0; i < 4; i++) { const ring = mk(new THREE.TorusGeometry(0.22, 0.05, 8, 12), or); ring.rotation.x = Math.PI / 2; ring.position.set(0, -0.65 + i * 0.12, 0); g.add(ring); }
      break;
    }
    case 12: { // Pasta Maker — two cylindrical rollers + frame
      // Frame sides
      [-0.9, 0.9].forEach(z => { beam(0, 0, z as number, 0.14, 2.4, 0.14); beam(0, 1.1, z as number, 1.8, 0.14, 0.14); });
      // Two rollers
      cyl(0, 0.25, 0, 0.35, 1.9, yw, 0, 0, Math.PI / 2);
      cyl(0, -0.4, 0, 0.35, 1.9, 0xf97316, 0, 0, Math.PI / 2);
      // Handle crank
      cyl(0, 0.25, 1.2, 0.07, 0.6, 0x9ca3af, 0, 0, Math.PI / 2);
      const crank = mk(new THREE.BoxGeometry(0.1, 0.55, 0.1), yw); crank.position.set(0, 0.55, 1.55); g.add(crank);
      sph(0, 0.85, 1.55, 0.14, or); // handle grip
      break;
    }
    case 13: { // Merry-Go-Round — hub + 4 arms + riders + gears
      // Base platform
      const base = mk(new THREE.CylinderGeometry(1.8, 1.8, 0.15, 32), yw); base.position.y = -0.2; g.add(base);
      // Central shaft
      cyl(0, 0.55, 0, 0.12, 1.5, bl);
      // G60 gear at base
      const gear = mk(new THREE.CylinderGeometry(0.9, 0.9, 0.18, 60), 0xfbbf24); gear.position.y = -0.28; g.add(gear);
      // 4 radial arms
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const arm = mk(new THREE.BoxGeometry(0.1, 0.1, 1.7), yw);
        arm.position.set(Math.cos(a) * 0.85, 0.18, Math.sin(a) * 0.85); arm.rotation.y = a; g.add(arm);
        sph(Math.cos(a) * 1.65, 0.38, Math.sin(a) * 1.65, 0.22, [or, 0xef4444, bl, 0x22c55e][i]);
      }
      break;
    }
    case 14: { // Spinning Top — motor + gears + top disc
      const body = mk(new THREE.CylinderGeometry(0.34, 0.34, 0.78, 20), gr); body.rotation.z = Math.PI / 2; body.position.y = 0.2; g.add(body);
      // G60 large gear (driven)
      const lg = mk(new THREE.CylinderGeometry(0.9, 0.9, 0.2, 60), 0xfbbf24); lg.position.y = -0.4; g.add(lg);
      // G20 small gear (driver)
      const sg = mk(new THREE.CylinderGeometry(0.58, 0.58, 0.2, 32), bl); sg.position.set(-0.95, -0.4, 0); g.add(sg);
      // Spinning top disc
      const top = mk(new THREE.CylinderGeometry(0.7, 0.05, 0.1, 32), yw); top.position.y = -1.0; g.add(top);
      cyl(0, -0.62, 0, 0.08, 0.9, bl);
      break;
    }
    case 15: { // Lock & Key — box with rack slot + gear key
      // Lock body
      beam(0, 0, 0, 2.2, 1.4, 0.9, bk);
      // Rack slot (lighter)
      beam(0.3, 0, 0.46, 1.6, 0.22, 0.06, 0x374151);
      // Key: shaft + gear
      cyl(1.8, 0, 0, 0.09, 1.2, 0x9ca3af, 0, 0, Math.PI / 2);
      const key = mk(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32), bl); key.position.set(2.45, 0, 0); key.rotation.z = Math.PI / 2; g.add(key);
      // Teeth on key gear
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const t = mk(new THREE.BoxGeometry(0.2, 0.1, 0.1), bl); t.position.set(2.45 + Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0); t.rotation.z = a; g.add(t); }
      break;
    }
    case 16: { // Trundle Wheel — long handle + large measuring wheel
      // Handle (P11 beam)
      cyl(0, 1.2, 0, 0.08, 2.6, yw);
      beam(-0.1, 1.1, 0, 0.7, 0.1, 0.1, yw); // grip crossbar
      // Large wheel
      const wr = 1.0;
      g.add(mk(new THREE.TorusGeometry(wr, 0.3, 16, 32), 0x111111));
      const hub = mk(new THREE.CylinderGeometry(wr * 0.38, wr * 0.38, 0.28, 20), or); hub.rotation.x = Math.PI / 2; g.add(hub);
      for (let i = 0; i < 5; i++) { const sp = mk(new THREE.BoxGeometry(wr * 1.7, 0.07, 0.1), or); sp.rotation.set(Math.PI / 2, (i / 5) * Math.PI * 2, 0); g.add(sp); }
      cyl(0, 0, 0, 0.09, 0.35, bk, Math.PI / 2);
      break;
    }
    case 17: { // Zipline — angled cable + pulley rider
      // Angled cable
      cyl(0, 0, 0, 0.04, 3.6, 0x9ca3af, 0, 0, Math.PI / 4);
      // Top anchor
      beam(-1.2, 1.2, 0, 0.14, 0.9, 0.14, bk);
      // Pulley car on cable
      const pc = new THREE.Group();
      pc.position.set(-0.3, 0.5, 0);
      pc.add(mk(new THREE.CylinderGeometry(0.4, 0.4, 0.32, 20), bl)); // pulley wheel
      pc.add(mk(new THREE.BoxGeometry(0.5, 0.3, 0.5), yw)).position.y = -0.45;
      // Rider
      sph(-0.3, 0.15, 0, 0.22, or);
      g.add(pc);
      break;
    }
    case 18: { // Dancing Robot — humanoid linkage body
      sph(0, 1.55, 0, 0.3, or);  // head
      beam(0, 0.9, 0, 0.6, 0.7, 0.45, yw); // torso
      // Arms
      const armL = mk(new THREE.BoxGeometry(0.12, 0.85, 0.12), yw); armL.position.set(-0.5, 0.9, 0); armL.rotation.z = 0.4; g.add(armL);
      const armR = mk(new THREE.BoxGeometry(0.12, 0.85, 0.12), yw); armR.position.set( 0.5, 0.9, 0); armR.rotation.z = -0.4; g.add(armR);
      // Legs
      beam(-0.18, 0.0, 0, 0.12, 0.85, 0.12, yw);
      beam( 0.18, 0.0, 0, 0.12, 0.85, 0.12, yw);
      // Motor at back
      const mot = mk(new THREE.CylinderGeometry(0.28, 0.28, 0.6, 16), gr); mot.rotation.z = Math.PI / 2; mot.position.set(0.7, 0.88, 0); g.add(mot);
      // G60 gear
      const gm = mk(new THREE.CylinderGeometry(0.65, 0.65, 0.18, 60), 0xfbbf24); gm.rotation.z = Math.PI / 2; gm.position.set(0.25, 0.88, 0); g.add(gm);
      break;
    }
    case 19: { // Digital Clock — 7-segment display frame
      beam(0, 0, 0, 2.2, 1.4, 0.12, bk); // PCB board
      // 7-segment digit representation
      const seg = (x: number, y: number, h: boolean) => {
        const s = mk(new THREE.BoxGeometry(h ? 0.38 : 0.08, h ? 0.08 : 0.38, 0.14), or);
        s.position.set(x, y, 0.07); g.add(s);
      };
      seg(-0.2, 0.45, true); seg(-0.2, -0.45, true); seg(-0.2, 0, true); // horizontals
      seg(-0.42, 0.25, false); seg(0.02, 0.25, false); // left/right top verticals
      seg(-0.42, -0.25, false); seg(0.02, -0.25, false); // left/right bottom verticals
      // Frame pillars
      [-0.9, 0.9].forEach(x => { beam(x as number, 0, 0, 0.1, 1.45, 0.12, yw); });
      break;
    }
    case 20: { // Earth-Moon-Sun — orrery
      // Sun
      sph(0, 0, 0, 0.55, 0xfde047);
      // Earth orbit arm
      beam(0.85, 0, 0, 1.7, 0.08, 0.08, 0x9ca3af);
      sph(1.7, 0, 0, 0.25, 0x3b82f6); // Earth
      // Moon orbit arm
      beam(2.1, 0.1, 0, 0.8, 0.06, 0.06, 0xd1d5db);
      sph(2.5, 0.1, 0, 0.14, 0xd1d5db); // Moon
      // Central shaft
      cyl(0, -0.6, 0, 0.1, 1.2, bl);
      // G60 gear at base
      const orrGear = mk(new THREE.CylinderGeometry(0.7, 0.7, 0.16, 60), 0xfbbf24); orrGear.position.y = -1.2; g.add(orrGear);
      break;
    }
    case 23: { // Balance Scale — Y-stand + horizontal beam + two pans
      // Vertical stand
      cyl(0, -0.5, 0, 0.1, 1.5, yw);
      beam(0, -1.22, 0, 1.4, 0.12, 0.5, yw); // base
      // Horizontal beam
      beam(0, 0.55, 0, 3.0, 0.12, 0.12, yw);
      // Strings
      cyl(-1.3, 0.1, 0, 0.03, 0.9, 0x9ca3af);
      cyl( 1.3, 0.1, 0, 0.03, 0.9, 0x9ca3af);
      // Pans
      const panL = mk(new THREE.CylinderGeometry(0.52, 0.52, 0.08, 20), 0xe5e7eb, 0.4, 0.7); panL.position.set(-1.3, -0.35, 0); g.add(panL);
      const panR = mk(new THREE.CylinderGeometry(0.52, 0.52, 0.08, 20), 0xe5e7eb, 0.4, 0.7); panR.position.set( 1.3, -0.35, 0); g.add(panR);
      break;
    }
    case 24: { // Plowing Machine — wheeled chassis + front plow blade
      beam(0, 0.12, 0.7, 2.5, 0.16, 0.42);
      beam(0, 0.12, -0.7, 2.5, 0.16, 0.42);
      beam(0, 0.28, 0, 2.2, 0.5, 1.5, or); // body
      // Plow blade at front
      const plow = mk(new THREE.BoxGeometry(0.12, 0.7, 1.8), 0x374151); plow.position.set(-1.5, 0.2, 0); plow.rotation.z = 0.25; g.add(plow);
      cyl( 1.1, -0.32, 0, 0.07, 1.6, bk, 0, 0, Math.PI / 2);
      cyl(-0.8, -0.32, 0, 0.07, 1.6, bk, 0, 0, Math.PI / 2);
      wheel(-0.8, -0.32, 0.82); wheel(-0.8, -0.32, -0.82);
      wheel( 1.1, -0.32, 0.82); wheel( 1.1, -0.32, -0.82);
      // Motor at back
      const motP = mk(new THREE.CylinderGeometry(0.28, 0.28, 0.55, 16), gr); motP.rotation.z = Math.PI / 2; motP.position.set(1.05, 0.38, 0); g.add(motP);
      break;
    }
    case 27: { // First Circuit — Queaky + connecting towers + wires
      // Queaky device
      const qg = new THREE.Group();
      qg.add(mk(new THREE.BoxGeometry(1.4, 0.45, 0.72), 0xfde047, 0.05, 0.8));
      [-0.78, 0.78].forEach(x => { const ear = mk(new THREE.BoxGeometry(0.22, 0.1, 0.24), 0x9ca3af, 0.6, 0.3); ear.position.set(x, 0.08, 0); qg.add(ear); });
      [[-0.28, 0], [0.28, 0]].forEach(([x, _z]) => {
        qg.add(mk(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 14), wh, 0, 1.0)).position.set(x as number, 0.26, 0.38);
        qg.add(mk(new THREE.CylinderGeometry(0.05, 0.05, 0.07, 10), bk, 0, 1.0)).position.set(x as number, 0.26, 0.39);
      });
      g.add(qg);
      // Connecting towers
      [-1.4, 1.4].forEach(x => {
        cyl(x as number, -0.1, 0.5, 0.1, 0.9, wh, 0, 0, 0);
        const th = mk(new THREE.CylinderGeometry(0.2, 0.2, 0.22, 10), bk); th.position.set(x as number, 0.36, 0.5); g.add(th);
      });
      // Wires connecting
      const wirePath = new THREE.CatmullRomCurve3([new THREE.Vector3(-1.4, 0.36, 0.5), new THREE.Vector3(-0.7, 0.8, 0.3), new THREE.Vector3(-0.7, 0.3, 0), new THREE.Vector3(-0.78, 0.08, 0)]);
      const wGeom = new THREE.TubeGeometry(wirePath, 12, 0.025, 8, false);
      g.add(mk(wGeom, 0x374151, 0.2, 0.9));
      break;
    }
    case 30: { // Balloon Rocket Car — chassis + 4 wheels + balloon
      beam(0, 0.1, 0.75, 2.6, 0.16, 0.42);
      beam(0, 0.1, -0.75, 2.6, 0.16, 0.42);
      beam(0, 0.2, 0, 2.0, 0.18, 1.6, 0x374151); // dark chassis body
      cyl( 0.9, -0.32, 0, 0.07, 1.65, bk, 0, 0, Math.PI / 2);
      cyl(-0.9, -0.32, 0, 0.07, 1.65, bk, 0, 0, Math.PI / 2);
      wheel(-0.9, -0.32, 0.88); wheel(-0.9, -0.32, -0.88);
      wheel( 0.9, -0.32, 0.88); wheel( 0.9, -0.32, -0.88);
      // Balloon mount
      cyl(1.0, 0.45, 0, 0.07, 0.55, yw);
      // Balloon
      sph(1.0, 0.88, 0, 0.55, 0xef4444);
      const tie = mk(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 6), 0xdc2626); tie.position.set(1.0, 0.3, 0); g.add(tie);
      break;
    }
    default: { // Generic final model for unmapped chapters
      // Show all step components from the chapter in a ring layout (fallback)
      const placeholder = mk(new THREE.BoxGeometry(1.8, 0.3, 1.8), yw, 0.1, 0.8); placeholder.position.y = -0.3; g.add(placeholder);
      sph(0, 0.5, 0, 0.55, bl);
      cyl(0, -0.3, 0, 0.1, 0.7, 0x9ca3af);
      break;
    }
  }
  return g;
}

// ─── Offscreen renderer: assembled reference image ───────────────────────────
// Renders buildFinalAssembly() for the chapter using a dedicated WebGL context
// (module-level, reused across steps — one context total).

let _refRenderer: THREE.WebGLRenderer | null = null;
const _refCache = new Map<number, string>();

function renderAssemblyReference(chapterId: number): string | null {
  if (_refCache.has(chapterId)) return _refCache.get(chapterId)!;
  try {
    if (!_refRenderer) {
      _refRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
      _refRenderer.setPixelRatio(1);
      _refRenderer.setSize(480, 340);
      _refRenderer.setClearColor(0xf8f8f8, 1);
    }
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(6, 8, 6); scene.add(key);
    const fill = new THREE.DirectionalLight(0x8888ff, 0.35); fill.position.set(-4, 2, -4); scene.add(fill);
    const grid = new THREE.GridHelper(10, 20, 0xe5e7eb, 0xf3f4f6); grid.position.y = -1.5; scene.add(grid);
    const camera = new THREE.PerspectiveCamera(42, 480 / 340, 0.1, 100);
    camera.position.set(5, 3.5, 5); camera.lookAt(0, 0, 0);

    const assembly = buildFinalAssembly(chapterId);
    assembly.rotation.set(0.1, 0.5, 0);
    scene.add(assembly);
    _refRenderer.render(scene, camera);

    const url = _refRenderer.domElement.toDataURL("image/jpeg", 0.92);
    scene.remove(assembly);
    disposeGroup(assembly);

    _refCache.set(chapterId, url);
    return url;
  } catch {
    return null;
  }
}

// ─── Left: 3-D Viewer ─────────────────────────────────────────────────────────
interface ViewerProps {
  step: { components: string[]; title: { en: string }; stepNumber: number } | null;
  totalSteps: number; stepIdx: number; exploded: boolean;
  chapterId?: number;
  onPrev: () => void; onNext: () => void;
  onSnapshot?: (dataUrl: string) => void;
}
function StepViewer3D({ step, totalSteps, stepIdx, exploded, chapterId, onPrev, onNext, onSnapshot }: ViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group>(new THREE.Group());
  const frameRef = useRef(0);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    const mount = mountRef.current; if (!mount) return;
    const W = mount.clientWidth || 360; const H = 280;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);
    scene.add(groupRef.current);
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(5, 3.5, 5); camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0xfff8f0, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(6, 8, 6); scene.add(key);
    const fill = new THREE.DirectionalLight(0xffe4c0, 0.4); fill.position.set(-4, 3, -4); scene.add(fill);
    const grid = new THREE.GridHelper(10, 20, 0xe5e7eb, 0xf3f4f6); grid.position.y = -1.5; scene.add(grid);
    const cvs = renderer.domElement; cvs.style.cursor = "grab";
    const group = groupRef.current;
    const onDown = (e: PointerEvent) => { dragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; cvs.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => { if (!dragging.current) return; group.rotation.y += (e.clientX - lastPos.current.x) * 0.01; group.rotation.x += (e.clientY - lastPos.current.y) * 0.005; lastPos.current = { x: e.clientX, y: e.clientY }; };
    const onUp = () => { dragging.current = false; };
    cvs.addEventListener("pointerdown", onDown); cvs.addEventListener("pointermove", onMove);
    cvs.addEventListener("pointerup", onUp); cvs.addEventListener("pointercancel", onUp);
    const onResize = () => { if (!mount || !renderer) return; const w = mount.clientWidth; camera.aspect = w / H; camera.updateProjectionMatrix(); renderer.setSize(w, H); };
    window.addEventListener("resize", onResize);
    const animate = () => { frameRef.current = requestAnimationFrame(animate); if (!dragging.current) group.rotation.y += 0.004; renderer.render(scene, camera); };
    animate();
    return () => {
      cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", onResize);
      cvs.removeEventListener("pointerdown", onDown); cvs.removeEventListener("pointermove", onMove);
      cvs.removeEventListener("pointerup", onUp); cvs.removeEventListener("pointercancel", onUp);
      disposeGroup(group); renderer.dispose(); mount.removeChild(renderer.domElement);
    };
  }, []);

  // Load final assembled model
  useEffect(() => {
    if (!showFinal || !chapterId) return;
    const grp = groupRef.current; disposeGroup(grp);
    const assembly = buildFinalAssembly(chapterId);
    assembly.scale.setScalar(0.001); grp.add(assembly);
    grp.rotation.set(0.15, 0.5, 0);
    const start = performance.now();
    const grow = () => { const t = Math.min((performance.now() - start) / 400, 1); assembly.scale.setScalar(1 - Math.pow(1 - t, 3)); if (t < 1) requestAnimationFrame(grow); };
    requestAnimationFrame(grow);
    if (onSnapshot) {
      const timer = setTimeout(() => { if (rendererRef.current) onSnapshot(rendererRef.current.domElement.toDataURL("image/jpeg", 0.9)); }, 500);
      return () => clearTimeout(timer);
    }
  }, [showFinal, chapterId, onSnapshot]);

  // Load step components
  useEffect(() => {
    if (showFinal) return;
    const grp = groupRef.current; disposeGroup(grp);
    if (!step || !step.components.length) return;
    const items = parseComps(step.components);
    const spacing = exploded ? 3.2 : 1.8;
    const cols = Math.ceil(Math.sqrt(items.length));
    let idx = 0;
    for (const { code, qty } of items) {
      for (let q = 0; q < qty && idx < 16; q++, idx++) {
        const obj = buildShape(code);
        const col = idx % cols; const row = Math.floor(idx / cols);
        obj.position.set(col * spacing - ((cols - 1) * spacing) / 2, 0, row * spacing * 0.6);
        obj.scale.setScalar(0.001); grp.add(obj);
        const start = performance.now();
        const grow = () => { const t = Math.min((performance.now() - start) / 300, 1); obj.scale.setScalar(1 - Math.pow(1 - t, 3)); if (t < 1) requestAnimationFrame(grow); };
        requestAnimationFrame(grow);
      }
    }
    grp.rotation.set(0, 0.3, 0);
    if (onSnapshot) {
      const timer = setTimeout(() => { if (rendererRef.current) onSnapshot(rendererRef.current.domElement.toDataURL("image/jpeg", 0.9)); }, 400);
      return () => clearTimeout(timer);
    }
  }, [step, exploded, showFinal, onSnapshot]);

  const comps = step ? parseComps(step.components) : [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-2">
            <span className="text-orange-500">🔧</span>
            <span className="font-bold text-[15px] text-gray-800">Interactive 3D Building Guide</span>
          </div>
          {chapterId && (
            <button
              onClick={() => setShowFinal(f => !f)}
              className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                showFinal
                  ? "bg-orange-500 text-white border-orange-500 shadow"
                  : "bg-white text-orange-600 border-orange-300 hover:bg-orange-50"
              }`}
            >
              📖 {showFinal ? "Book Page" : "View Book Page"}
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {showFinal ? "Official Blix book reference page for this chapter." : "Watch the 3D model as you follow each step."}
        </p>
      </div>

      {/* ── Final picture: real book page — always in DOM, shown via CSS ── */}
      <div className={`mx-4 mb-2 rounded-xl overflow-hidden border border-orange-200 bg-orange-50 ${(!showFinal || !chapterId || !CHAPTER_PAGE_IMAGES[chapterId!]) ? "hidden" : ""}`} style={{ minHeight: 280 }}>
        {chapterId && CHAPTER_PAGE_IMAGES[chapterId] && (
          <>
            <img
              src={CHAPTER_PAGE_IMAGES[chapterId]}
              alt={`Chapter ${chapterId} book page`}
              className="w-full object-contain"
              style={{ maxHeight: 480 }}
            />
            <div className="px-3 py-2 flex items-center gap-2 border-t border-orange-200">
              <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wide">📖 Official Blix Curriculum Book</span>
              <span className="text-[10px] text-orange-500 ml-auto">Chapter {chapterId} reference</span>
            </div>
          </>
        )}
      </div>

      {/* 3D canvas — always mounted so Three.js renderer stays alive */}
      <div className={`flex mx-4 mb-0 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 ${showFinal ? "hidden" : ""}`}>
        {/* Sidebar */}
        <div className="w-[120px] shrink-0 p-3 border-r border-gray-200 bg-white flex flex-col gap-3">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">View Controls</p>
            {[["Exploded View", false], ["Show Measurements", false]].map(([label]) => (
              <label key={label as string} className="flex items-start gap-1.5 mb-2.5 cursor-pointer">
                <div className="w-3.5 h-3.5 mt-0.5 rounded-full border-2 border-gray-300 shrink-0" />
                <span className="text-[11px] text-gray-600 leading-tight">{label as string}</span>
              </label>
            ))}
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Components</p>
            {comps.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-start gap-1 mb-1.5">
                <CheckCircle2 className="w-3 h-3 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-[10px] text-gray-600 font-mono leading-tight">{c.code}{c.qty > 1 ? ` ×${c.qty}` : ""}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <div ref={mountRef} className="w-full" style={{ height: 280 }} />
          <div className="absolute right-2 top-2 flex flex-col gap-1.5">
            {["+", "−", "⟳", "⊞"].map(icon => (
              <button key={icon} className="w-7 h-7 bg-white border border-gray-200 rounded-lg text-xs text-gray-500 shadow-sm hover:bg-gray-50 flex items-center justify-center">
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step footer */}
      <div className="mx-4 mt-2 border border-gray-200 rounded-xl bg-white px-3 py-2.5">
        <div className="flex items-start gap-2 mb-2">
          <span className="shrink-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
            Step {stepIdx + 1} of {totalSteps}
          </span>
          <p className="text-xs font-semibold text-gray-800 leading-snug">
            {step ? step.title.en : "—"}
          </p>
        </div>
        {comps.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {comps.flatMap(c => Array.from({ length: Math.min(c.qty, 4) }, (_, i) => (
              <span key={`${c.code}-${i}`} className="font-mono text-[11px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-semibold">
                {c.code}
              </span>
            )))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <button onClick={onPrev} disabled={stepIdx === 0}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30">
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(totalSteps, 9) }, (_, i) => (
              <div key={i} className={`rounded-full transition-all ${i === stepIdx ? "w-4 h-1.5 bg-orange-500" : "w-1.5 h-1.5 bg-gray-300"}`} />
            ))}
          </div>
          <button onClick={onNext} disabled={stepIdx >= totalSteps - 1}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mx-4 mt-2 mb-4 flex items-center gap-1.5 text-[10px] text-gray-400">
        <div className="w-2 h-2 rounded-full bg-gray-300" />
        Click and drag to rotate • Scroll or use buttons to zoom • Hover over pieces to identify
      </div>
    </div>
  );
}

// ─── Right: Step Details ──────────────────────────────────────────────────────
interface DetailsProps { chapter: Chapter; stepIdx: number; onStepChange: (i: number) => void; }
function StepDetails({ chapter, stepIdx, onStepChange }: DetailsProps) {
  const totalSteps = chapter.build.steps.length || chapter.build.totalSteps;
  const step = chapter.build.steps[stepIdx];
  const stepComponents = step?.components ?? EMPTY_COMPONENTS;
  const comps = useMemo(() => parseComps(stepComponents), [stepComponents]);
  const connections = useMemo(() => findConnections(comps), [comps]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-800">Step {stepIdx + 1} of {totalSteps}</h3>
          <div className="flex gap-1">
            <button onClick={() => onStepChange(Math.max(0, stepIdx - 1))} disabled={stepIdx === 0}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onStepChange(Math.min(totalSteps - 1, stepIdx + 1))} disabled={stepIdx >= totalSteps - 1}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress track */}
        <div className="relative mb-3">
          <div className="h-1.5 bg-gray-100 rounded-full">
            <div className="h-1.5 bg-orange-400 rounded-full transition-all duration-300"
              style={{ width: `${((stepIdx + 1) / totalSteps) * 100}%` }} />
          </div>
          <div className="absolute -top-1 w-4 h-4 bg-white border-2 border-orange-500 rounded-full transition-all duration-300"
            style={{ left: `calc(${((stepIdx + 1) / totalSteps) * 100}% - 8px)` }} />
        </div>

        {/* Step dots */}
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: Math.min(totalSteps, 12) }, (_, i) => (
            <button key={i} onClick={() => onStepChange(i)}
              className={`w-7 h-7 rounded-full text-xs font-semibold transition-all ${
                i === stepIdx ? "bg-orange-500 text-white shadow" : i < stepIdx ? "bg-orange-100 text-orange-700 border border-orange-200" : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
              }`}>
              {i + 1}
            </button>
          ))}
          {totalSteps > 12 && <span className="text-xs text-gray-400 self-center">+{totalSteps - 12}</span>}
        </div>
      </div>

      {/* Step description */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
            {stepIdx + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 mb-1">
              {step ? tr(step.title, "en") : `Step ${stepIdx + 1} — details coming soon.`}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              {step ? tr(step.description, "en") : "The full build sequence will be added here when ready."}
            </p>
            {comps.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {comps.map((c, i) => (
                  <span key={i} className="font-mono text-[11px] bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-semibold">
                    {c.code} ×{c.qty}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── What this step creates (connections) ── */}
      {connections.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Link2 className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">What this step creates</span>
          </div>
          <div className="space-y-1.5">
            {connections.map(({ a, b, conn }, i) => {
              const s = CONN_STYLE[conn.type];
              return (
                <div key={i} className={`${s.bg} border ${s.border} rounded-xl px-3 py-2`}>
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className={`font-mono text-[10px] font-bold ${s.text} bg-white border ${s.border} px-1.5 py-0.5 rounded-full`}>{a}</span>
                    <span className="text-gray-400 text-xs">+</span>
                    <span className={`font-mono text-[10px] font-bold ${s.text} bg-white border ${s.border} px-1.5 py-0.5 rounded-full`}>{b}</span>
                    <span className="text-sm">{conn.emoji}</span>
                    <span className={`ml-auto text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${s.badge}`}>{conn.type}</span>
                  </div>
                  <p className={`text-[11px] ${s.text} leading-snug`}>{conn.effect}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared result card ───────────────────────────────────────────────────────
function ResultCard({ result, label, accent }: {
  result: VerifyResult;
  label: string;
  accent: "blue" | "orange";
}) {
  const a = accent === "blue"
    ? { border: "border-blue-200",  bg: "bg-blue-50",  badge: "bg-blue-100 text-blue-700",  bar: "bg-blue-400"  }
    : { border: "border-orange-200",bg: "bg-orange-50",badge: "bg-orange-100 text-orange-700",bar: "bg-orange-400"};

  return (
    <div className={`border ${a.border} ${a.bg} rounded-xl p-3 space-y-1.5`}>
      {/* Source label */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.badge}`}>{label}</span>
        <span className={`text-[11px] font-bold ${result.correct ? "text-green-600" : "text-red-500"}`}>
          {result.correct ? "✓ Correct" : "✗ Needs fix"}
        </span>
      </div>
      {/* Feedback */}
      <p className="text-[11px] text-gray-700 leading-snug">{result.feedback}</p>
      {result.tip && <p className="text-[11px] text-orange-600 leading-snug">{result.tip}</p>}
      {/* Found / missing pills */}
      {result.found.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {result.found.map(c => (
            <span key={c} className="font-mono text-[10px] bg-green-100 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">✓ {c}</span>
          ))}
        </div>
      )}
      {result.missing.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {result.missing.map(c => (
            <span key={c} className="font-mono text-[10px] bg-red-100 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">✗ {c}</span>
          ))}
        </div>
      )}
      {/* Confidence bar */}
      {result.confidence > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-white rounded-full overflow-hidden border border-gray-200">
            <div className={`h-full rounded-full ${a.bar}`} style={{ width: `${Math.round(result.confidence * 100)}%` }} />
          </div>
          <span className="text-[10px] text-gray-400">{Math.round(result.confidence * 100)}%</span>
        </div>
      )}
    </div>
  );
}

// ─── Right: AI Step Check ─────────────────────────────────────────────────────
type CheckPhase = "idle" | "camera" | "captured" | "done";

interface AICheckProps {
  stepIdx: number;
  step: { title: { en: string }; components: string[] } | null;
  // All steps of the chapter — needed to compute the CUMULATIVE component list.
  // AI reference must show every part accumulated up to and including stepIdx,
  // not just the parts added in the current step.
  allSteps: { components: string[] }[];
  chapterId: string;
  chapterTitle: string;
  referenceSnapshot: string | null;
}

function AIStepCheck({ stepIdx, step, allSteps, chapterId, chapterTitle, referenceSnapshot }: AICheckProps) {
  const navigate  = useNavigate();
  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase,          setPhase]          = useState<CheckPhase>("idle");
  const [capturedImage,  setCapturedImage]  = useState<string | null>(null);
  const [cameraError,    setCameraError]    = useState<string | null>(null);
  const [apiResult,      setApiResult]      = useState<VerifyResult | null>(null);
  const [,               setModelResult]    = useState<VerifyResult | null>(null);
  const [checking,       setChecking]       = useState<"api" | "model" | null>(null);

  // ── Cumulative components — the source of truth for AI reference ─────────────
  // All components the student should have assembled from step 0 up to stepIdx
  // (quantities summed across steps). This is what Gemini checks in the photo.
  // "comps" (current step only) is kept for the step-badge display below.
  const comps = step ? parseComps(step.components) : [];

  const cumulativeComps = useMemo(() => {
    const all = allSteps.slice(0, stepIdx + 1).flatMap(s => parseComps(s.components));
    const totals = new Map<string, number>();
    for (const { code, qty } of all) totals.set(code, (totals.get(code) ?? 0) + qty);
    return Array.from(totals.entries()).map(([code, qty]) => ({ code, qty }));
  }, [allSteps, stepIdx]);

  // ── Per-step reference image ─────────────────────────────────────────────────
  // Generated dynamically from the cumulative component list using the same
  // buildObject geometry as the 3D Gallery. Changes every time stepIdx changes.
  // This is the correct source of truth — NOT textbook pages, NOT chapter-level
  // renders. Each step gets its own reference reflecting the exact build state.
  //
  // Fallback chain:
  //   1. renderStepReferenceImage(cumulativeComps) — per-step, Gallery-quality 3D (primary)
  //   2. referenceSnapshot                         — manual 3D viewer snapshot if taken
  //   3. renderAssemblyReference(chapterIdNum)     — chapter-level final assembly (fallback)
  //   4. buildReferenceImage(comps)                — 2D canvas text grid (last resort)
  const chapterIdNum = chapterId ? Number(chapterId) : 0;
  const stepLabel = `Step ${stepIdx + 1} of ${allSteps.length}${step ? ` — ${step.title.en}` : ""}`;

  const generatedReference = useMemo(
    () => renderStepReferenceImage(cumulativeComps, stepLabel)
       ?? (chapterIdNum > 0 ? renderAssemblyReference(chapterIdNum) : null)
       ?? (comps.length > 0 ? buildReferenceImage(comps) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cumulativeComps.map(c => c.code + c.qty).join(","), stepLabel, chapterIdNum]
  );
  // Manual 3D viewer snapshot supersedes generated reference (it may be rotated/angled better)
  const referenceImage = referenceSnapshot ?? generatedReference;

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setPhase("camera");
    } catch (err) {
      setCameraError(
        err instanceof Error && err.name === "NotAllowedError"
          ? "Camera permission denied. Allow camera access and try again."
          : "Could not start camera. Check your device settings."
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || 320;
    canvas.height = v.videoHeight || 240;
    canvas.getContext("2d")?.drawImage(v, 0, 0);
    setCapturedImage(canvas.toDataURL("image/jpeg", 0.85));
    stopCamera();
    setPhase("captured");
  }, [stopCamera]);

  // ── Navigate to research page with captured image + method ─────────────────
  // Sends cumulativeComps (not just current-step comps) so Gemini checks the
  // full accumulated build state, not only the parts added in this step.
  const goToResearch = useCallback((method: ResearchNavState["method"]) => {
    if (!capturedImage) return;
    // Unified current-check object — single source of truth for AIResearch
    const currentCheck = {
      chapterId: chapterId ?? "unknown",
      chapterTitle: chapterTitle ?? "BLIX Build Guide",
      stepIdx: stepIdx ?? 0,
      stepTitle: step?.title.en ?? `Step ${(stepIdx ?? 0) + 1}`,
      cumulativePieces: cumulativeComps,
      capturedImage,
      referenceImage: referenceImage ?? null,
      createdAt: new Date().toISOString(),
    };
    sessionStorage.setItem("blix_current_check", JSON.stringify(currentCheck));
    // Keep individual keys as fallback
    sessionStorage.setItem("blix_captured_image", capturedImage);
    if (referenceImage) sessionStorage.setItem("blix_reference_image", referenceImage);
    else sessionStorage.removeItem("blix_reference_image");
    sessionStorage.setItem(
      "blix_step_pieces",
      JSON.stringify(cumulativeComps.map(c => `${c.code} ×${c.qty}`))
    );
    const state: ResearchNavState = {
      method, step, stepIdx, chapterId, chapterTitle,
    };
    navigate("/ai-research", { state });
  }, [capturedImage, referenceImage, cumulativeComps, step, stepIdx, chapterId, chapterTitle, navigate]);

  const checkVisionAPI = useCallback(() => goToResearch("api"), [goToResearch]);

  const reset = useCallback(() => {
    setCapturedImage(null);
    setApiResult(null);
    setModelResult(null);
    setChecking(null);
    setPhase("idle");
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);
  useEffect(() => { reset(); }, [stepIdx, reset]);

  const stepTitle = step?.title.en ?? `Step ${stepIdx + 1}`;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="font-bold text-[14px] text-gray-800">AI Step Check</span>
        </div>
        <p className="text-xs text-gray-500">Capture your build and compare with the reference.</p>
      </div>

      <div className="px-3 pb-3 space-y-2">

        {/* ── Phase: idle ── */}
        {phase === "idle" && (
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3">
            <p className="text-[11px] text-gray-700 font-semibold mb-1">
              Checking: {stepTitle}
            </p>
            {cumulativeComps.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {cumulativeComps.map((c, i) => (
                  <span key={i} className="font-mono text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-semibold">
                    {c.code} ×{c.qty}
                  </span>
                ))}
              </div>
            )}
            {cameraError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-2.5 py-2 mb-2">
                <span className="text-red-500 shrink-0 text-xs">⚠</span>
                <p className="text-[11px] text-red-600 leading-snug">{cameraError}</p>
              </div>
            )}
            <button onClick={startCamera}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
              <Camera className="w-3.5 h-3.5" /> {cameraError ? "Try Again" : "Start Camera"}
            </button>
          </div>
        )}

        {/* ── Phase: camera — live video (always mounted so ref stays stable) ── */}
        <div className={phase === "camera" ? "space-y-2" : "hidden"}>
          <div className="rounded-xl overflow-hidden bg-black border border-gray-200 relative" style={{ aspectRatio: "4/3" }}>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                Point at your build and press Capture
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={capturePhoto}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors">
              <Camera className="w-3 h-3" /> Capture Photo
            </button>
            <button onClick={() => { stopCamera(); setPhase("idle"); }}
              className="flex-1 border border-gray-200 text-gray-500 text-[11px] font-semibold py-2 rounded-lg bg-white hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>

        {/* ── Side-by-side: reference vs captured ── */}
        {(phase === "captured" || phase === "done") && capturedImage && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide text-center mb-1">Reference</p>
                <div className="rounded-lg overflow-hidden border-2 border-orange-400 bg-gray-50 relative" style={{ aspectRatio: "4/3" }}>
                  {referenceImage
                    ? <img src={referenceImage} alt="Reference build" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No ref</div>
                  }
                  <div className="absolute top-1 right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow">
                    <span className="text-white text-[8px] font-bold">✓</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide text-center mb-1">Your Build</p>
                <div className="rounded-lg overflow-hidden border-2 border-orange-400 relative" style={{ aspectRatio: "4/3" }}>
                  <img src={capturedImage} alt="Your build" className="w-full h-full object-cover" />
                  {checking && (
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {apiResult?.correct && !checking && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-600 drop-shadow" />
                    </div>
                  )}
                  <div className="absolute top-1 right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow">
                    <Camera className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Verify button ── */}
            <div>
              <button onClick={checkVisionAPI} disabled={checking !== null}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-[12px] font-bold py-2.5 rounded-xl transition-colors">
                {checking === "api"
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Sparkles className="w-4 h-4" />}
                {checking === "api" ? "Checking with AI Vision…" : "Verify with AI Vision"}
              </button>
              <button onClick={() => { setCapturedImage(null); setApiResult(null); setModelResult(null); startCamera(); }}
                className="w-full mt-1.5 text-[10px] text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 py-0.5 transition-colors">
                <RefreshCw className="w-3 h-3" /> Retake photo
              </button>
            </div>

            {/* ── Result ── */}
            {apiResult && <ResultCard result={apiResult} label="☁️ AI Vision (Gemini)" accent="blue" />}

            {/* ── Step done banner ── */}
            {apiResult?.correct && !checking && (
              <div className="bg-orange-500 text-white text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Step {stepIdx + 1} verified ✓
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AR Module ────────────────────────────────────────────────────────────────
// A-Frame 1.5.0 + AR.js pinned via rawgit CDN (jsDelivr path for AR.js returns 404)
const AFRAME_SRC = "https://aframe.io/releases/1.5.0/aframe.min.js";
const ARJS_SRC   = "https://raw.githack.com/AR-js-org/AR.js/3.4.5/aframe/build/aframe-ar.js";
const HIRO_IMG   = "https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png";

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) { resolve(); return; }
    const s = document.createElement("script");
    s.id = id; s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

interface AROverlayProps {
  step: { title: { en: string }; components: string[] } | null;
  stepIdx: number;
  onClose: () => void;
}

function AROverlay({ step, stepIdx, onClose }: AROverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef     = useRef<Element | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [markerFound, setMarkerFound] = useState(false);

  // Load A-Frame + AR.js from CDN once
  useEffect(() => {
    loadScript(AFRAME_SRC, "aframe-js")
      .then(() => loadScript(ARJS_SRC, "arjs-js"))
      .then(() => setLoadState("ready"))
      .catch(() => setLoadState("error"));
  }, []);

  // Build A-Frame scene via DOM (not JSX — A-Frame uses custom elements)
  useEffect(() => {
    if (loadState !== "ready" || !containerRef.current) return;

    // Remove previous scene if any
    if (sceneRef.current && containerRef.current.contains(sceneRef.current)) {
      try { containerRef.current.removeChild(sceneRef.current); } catch { /* ignore */ }
    }
    setMarkerFound(false);

    const comps = step ? parseComps(step.components) : [];

    const scene = document.createElement("a-scene");
    scene.setAttribute("embedded", "");
    scene.setAttribute("arjs", "sourceType: webcam; debugUIEnabled: false;");
    scene.setAttribute("renderer", "logarithmicDepthBuffer: true; precision: medium;");
    scene.setAttribute("vr-mode-ui", "enabled: false");
    scene.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";

    const marker = document.createElement("a-marker");
    marker.setAttribute("preset", "hiro");
    marker.addEventListener("markerFound", () => setMarkerFound(true));
    marker.addEventListener("markerLost",  () => setMarkerFound(false));

    // Ground plane
    const plane = document.createElement("a-plane");
    plane.setAttribute("rotation", "-90 0 0");
    plane.setAttribute("width", "2"); plane.setAttribute("height", "2");
    plane.setAttribute("color", "#f9fafb"); plane.setAttribute("opacity", "0.7");
    marker.appendChild(plane);

    // Step label
    const label = document.createElement("a-text");
    label.setAttribute("value", `Step ${stepIdx + 1}: ${step?.title.en ?? ""}`);
    label.setAttribute("position", "0 1.6 0");
    label.setAttribute("align", "center");
    label.setAttribute("color", "#f97316");
    label.setAttribute("width", "3");
    marker.appendChild(label);

    // Component boxes — one per unique component, laid out in a grid
    const cols = Math.ceil(Math.sqrt(comps.length));
    comps.slice(0, 9).forEach(({ code, qty }, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x   = (col - (cols - 1) / 2) * 0.5;
      const z   = (row - (Math.ceil(comps.length / cols) - 1) / 2) * 0.5;
      const hex = "#" + codeColor(code).toString(16).padStart(6, "0");

      const box = document.createElement("a-box");
      box.setAttribute("position", `${x} 0.15 ${z}`);
      box.setAttribute("scale", "0.28 0.28 0.28");
      box.setAttribute("color", hex);
      box.setAttribute("opacity", "0.92");
      box.setAttribute("animation", "property: rotation; to: 0 360 0; loop: true; dur: 3000; easing: linear;");
      marker.appendChild(box);

      const codeLabel = document.createElement("a-text");
      codeLabel.setAttribute("value", `${code}${qty > 1 ? ` ×${qty}` : ""}`);
      codeLabel.setAttribute("position", `${x} 0.42 ${z}`);
      codeLabel.setAttribute("align", "center");
      codeLabel.setAttribute("color", "#111827");
      codeLabel.setAttribute("width", "1.1");
      marker.appendChild(codeLabel);
    });

    const camera = document.createElement("a-entity");
    camera.setAttribute("camera", "");

    scene.appendChild(marker);
    scene.appendChild(camera);
    const container = containerRef.current;
    if (!container) return;
    container.appendChild(scene);
    sceneRef.current = scene;

    return () => {
      if (sceneRef.current && container.contains(sceneRef.current)) {
        try { container.removeChild(sceneRef.current); } catch { /* ignore */ }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadState, stepIdx, step?.components?.join(",")]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* A-Frame mounts here */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Loading */}
      {loadState === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-3 pointer-events-none">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-sm">Loading AR engine…</p>
        </div>
      )}

      {/* Error */}
      {loadState === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-3">
          <p className="text-red-400 text-sm">Could not load AR engine. Check your connection.</p>
          <button onClick={onClose} className="bg-white text-black text-sm font-bold px-5 py-2 rounded-full">
            Close
          </button>
        </div>
      )}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div>
          <p className="text-[11px] font-bold text-orange-400 uppercase tracking-wide">AR Build Guide</p>
          <p className="text-[11px] text-white/80">Step {stepIdx + 1} — {step?.title.en}</p>
        </div>
        <button onClick={onClose} className="pointer-events-auto w-9 h-9 bg-black/50 border border-white/20 rounded-full flex items-center justify-center text-white text-sm hover:bg-black/70 transition-colors">
          ✕
        </button>
      </div>

      {/* Bottom status + print link */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <div className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all shadow ${
          markerFound
            ? "bg-green-500 text-white shadow-green-500/40"
            : "bg-black/50 text-white border border-white/20"
        }`}>
          {markerFound ? "✓ Marker detected — AR active!" : "Point camera at the Hiro marker"}
        </div>
        <a href={HIRO_IMG} target="_blank" rel="noreferrer"
          className="pointer-events-auto text-[11px] text-white/50 underline underline-offset-2 hover:text-white/80 transition-colors">
          🖨 Download &amp; print Hiro marker
        </a>
      </div>
    </div>
  );
}

// ─── AR Module card (replaces ARBuddyCard) ────────────────────────────────────
interface ARModuleProps {
  step: { title: { en: string }; components: string[] } | null;
  stepIdx: number;
}
function ARModule({ step, stepIdx }: ARModuleProps) {
  const [arOpen, setArOpen] = useState(false);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-[14px] text-gray-800">AR Build Overlay</span>
          </div>
          <span className="text-[10px] bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full tracking-wide">BETA</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
          Print the Hiro marker, place it next to your build, then launch AR to see each step's components floating above your kit in 3D.
        </p>
        <div className="flex gap-2">
          <button onClick={() => setArOpen(true)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
            <Box className="w-3.5 h-3.5" /> Launch AR
          </button>
          <a href={HIRO_IMG} target="_blank" rel="noreferrer"
            className="flex-1 border border-gray-200 text-gray-500 text-xs font-semibold py-2 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors">
            🖨 Print Marker
          </a>
        </div>
      </div>

      {arOpen && (
        <AROverlay step={step} stepIdx={stepIdx} onClose={() => setArOpen(false)} />
      )}
    </>
  );
}

// ─── Ask AI Buddy button ──────────────────────────────────────────────────────
function AskAIBuddy() {
  return (
    <button className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3.5 flex items-center justify-center gap-2 hover:bg-amber-50/50 hover:border-amber-300 transition-colors">
      <Sparkles className="w-4 h-4 text-yellow-500" />
      <span className="font-bold text-[14px] text-gray-800">Ask AI Buddy</span>
    </button>
  );
}

// ─── BuildGuide — 2-column layout ─────────────────────────────────────────────
interface BuildGuideProps { chapter: Chapter }

const BuildGuide = ({ chapter }: BuildGuideProps) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [exploded, setExploded] = useState(false);

  const totalSteps = Math.max(chapter.build.steps.length, chapter.build.totalSteps);
  const step = chapter.build.steps[stepIdx] ?? null;
  const [referenceSnapshot, setReferenceSnapshot] = useState<string | null>(null);

  useEffect(() => { setStepIdx(0); setReferenceSnapshot(null); }, [chapter.id]);
  useEffect(() => { setReferenceSnapshot(null); }, [stepIdx]);

  return (
    <div className="space-y-2">
      {/* Exploded toggle */}
      <div className="flex items-center justify-end gap-3 px-1">
        <button onClick={() => setExploded(v => !v)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
            exploded ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-500 border-gray-300 hover:text-gray-700"
          }`}>
          <Maximize2 className="w-3.5 h-3.5" />
          {exploded ? "Normal View" : "Exploded View"}
        </button>
        <span className="text-[11px] text-gray-400 flex items-center gap-1">
          <Ruler className="w-3 h-3" /> Drag to rotate
        </span>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        {/* Left column */}
        <div className="space-y-3">
          <StepViewer3D
            step={step} totalSteps={totalSteps} stepIdx={stepIdx} exploded={exploded}
            chapterId={chapter.id}
            onPrev={() => setStepIdx(i => Math.max(0, i - 1))}
            onNext={() => setStepIdx(i => Math.min(totalSteps - 1, i + 1))}
            onSnapshot={setReferenceSnapshot}
          />
          <ARModule step={step} stepIdx={stepIdx} />
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <StepDetails chapter={chapter} stepIdx={stepIdx} onStepChange={setStepIdx} />
          <AIStepCheck
            stepIdx={stepIdx}
            step={step}
            allSteps={chapter.build.steps}
            chapterId={String(chapter.id)}
            chapterTitle={tr(chapter.title, "en")}
            referenceSnapshot={referenceSnapshot}
          />
          <AskAIBuddy />
        </div>
      </div>
    </div>
  );
};

export default BuildGuide;
