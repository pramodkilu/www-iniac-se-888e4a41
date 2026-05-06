import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { ChevronLeft, ChevronRight, Camera, Maximize2, Ruler, Sparkles, CheckCircle2, RefreshCw, Box, Link2, Cpu } from "lucide-react";
import { type Chapter, tr } from "@/data/chapters";
import { useNavigate } from "react-router-dom";
import type { VerifyResult } from "@/hooks/useComponentDetector";
import type { ResearchNavState } from "@/pages/AIResearch";

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
  P3: 0xfbbf24, P5: 0xfbbf24, P7: 0xfbbf24, P11: 0xf59e0b,
  "P3+": 0xfbbf24, "P3 Plus": 0xfbbf24,
  "P7x11": 0xd97706, "P7X11": 0xd97706,
  "P21x21": 0xa3a3a3,
  "PU5x7": 0xd97706, "PU5x13": 0xd97706,
  CT2: 0xfbbf24, CT3: 0x3b82f6, CH2: 0x60a5fa, CL2: 0xfbbf24,
  "CT(1x2)": 0x3b82f6, TW1: 0x9ca3af, TW2: 0x9ca3af,
  SH60: 0xc0c0c0, SH100: 0xc0c0c0, SH170: 0xc0c0c0,
  G20: 0x60a5fa, "G20+": 0x60a5fa, "G20 Plus": 0x60a5fa, "G20 Idler": 0x60a5fa,
  G60: 0xfbbf24, Rack: 0xfbbf24,
  Wheel: 0x1f2937, "Wheel w/o tires": 0x374151,
  "Motor with Battery Box": 0x374151,
  Queaky: 0x4ade80, Thread: 0x94a3b8,
  Pulley: 0xfbbf24, Suspension: 0xfbbf24,
  "P5 Nut": 0xf59e0b, "Power Screw": 0xfbbf24,
  Balloon: 0xef4444,
  "Mudguard Left": 0xfbbf24, "Mudguard Right": 0xfbbf24,
  "Steering wheel": 0x1f2937, Spoiler: 0xfbbf24,
};
function codeColor(code: string): number {
  if (CODE_COLOR[code]) return CODE_COLOR[code];
  for (const k of Object.keys(CODE_COLOR))
    if (code.toLowerCase().startsWith(k.toLowerCase())) return CODE_COLOR[k];
  return 0xd97706;
}

// ─── Three.js helpers ─────────────────────────────────────────────────────────
function mk(g: THREE.BufferGeometry, color: number, metalness = 0.15, roughness = 0.5) {
  return new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, metalness, roughness }));
}
function buildShape(code: string): THREE.Object3D {
  const c = codeColor(code); const g = new THREE.Group(); const lc = code.toLowerCase();
  if (lc.includes("p7x11") || lc.includes("p7X11")) {
    const leg = () => mk(new THREE.BoxGeometry(0.3, 1.8, 0.42), c);
    const l = leg(); l.position.set(-0.55, 0, 0); g.add(l);
    const r = leg(); r.position.set( 0.55, 0, 0); g.add(r);
    const b = mk(new THREE.BoxGeometry(1.4, 0.3, 0.42), c); b.position.y = -0.9; g.add(b);
  } else if (lc.includes("p21x21")) {
    g.add(mk(new THREE.BoxGeometry(1.9, 0.1, 1.9), c));
    for (let a = -2; a <= 2; a++) for (let b2 = -2; b2 <= 2; b2++) {
      const s = mk(new THREE.CylinderGeometry(0.065, 0.065, 0.09, 8), c);
      s.position.set(a * 0.37, 0.09, b2 * 0.37); g.add(s);
    }
  } else if (/^p\d+$/i.test(code.trim())) {
    const holes = parseInt(code.replace(/\D/g, "")) || 5;
    const h = 0.22 * holes + 0.06;
    g.add(mk(new THREE.BoxGeometry(0.36, h, 0.46), c));
    for (let i = 0; i < Math.min(holes, 8); i++) {
      const hole = mk(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 8), 0x775500, 0.05, 0.9);
      hole.rotation.z = Math.PI / 2; hole.position.set(0, -h / 2 + 0.14 + i * 0.22, 0); g.add(hole);
    }
  } else if (lc.startsWith("pu")) {
    [-0.6, 0.6].forEach(x => { const l = mk(new THREE.BoxGeometry(0.3, 1.9, 0.4), c); l.position.x = x; g.add(l); });
    const b2 = mk(new THREE.BoxGeometry(1.5, 0.3, 0.4), c); b2.position.y = -1.1; g.add(b2);
  } else if (lc.startsWith("ct") || lc.startsWith("ch") || lc.startsWith("cl")) {
    g.add(mk(new THREE.BoxGeometry(0.6, 0.38, 0.38), c));
    const pin = mk(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 8), 0x888888, 0.5, 0.3);
    pin.rotation.z = Math.PI / 2; pin.position.x = 0.42; g.add(pin);
  } else if (lc.startsWith("tw")) {
    g.add(mk(new THREE.TorusGeometry(0.28, 0.09, 8, 20), c, 0.4, 0.5));
  } else if (lc.startsWith("sh")) {
    const len = (parseInt(code.replace(/\D/g, "")) || 60) / 60;
    g.add(mk(new THREE.CylinderGeometry(0.07, 0.07, len, 12), 0xc0c0c0, 0.7, 0.3));
  } else if (lc.startsWith("g20")) {
    g.add(mk(new THREE.TorusGeometry(0.6, 0.15, 8, 20), c));
    const h = mk(new THREE.CylinderGeometry(0.17, 0.17, 0.35, 12), c); h.rotation.x = Math.PI / 2; g.add(h);
  } else if (lc === "g60") {
    g.add(mk(new THREE.TorusGeometry(0.95, 0.18, 8, 60), c));
    const h = mk(new THREE.CylinderGeometry(0.28, 0.28, 0.4, 12), c); h.rotation.x = Math.PI / 2; g.add(h);
  } else if (lc === "rack") {
    g.add(mk(new THREE.BoxGeometry(1.8, 0.22, 0.36), c));
    for (let i = 0; i < 7; i++) { const t = mk(new THREE.BoxGeometry(0.12, 0.16, 0.38), c); t.position.set(-0.78 + i * 0.26, 0.19, 0); g.add(t); }
  } else if (lc === "wheel" || lc.includes("w/o")) {
    g.add(mk(new THREE.TorusGeometry(0.78, 0.28, 16, 32), 0x111111));
    const h = mk(new THREE.CylinderGeometry(0.33, 0.33, 0.3, 20), 0xf97316); h.rotation.x = Math.PI / 2; g.add(h);
  } else if (lc.includes("motor") || lc.includes("gearbox")) {
    g.add(mk(new THREE.CylinderGeometry(0.45, 0.45, 1.0, 20), 0x374151));
    const s = mk(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 10), 0x9ca3af, 0.7, 0.3); s.position.y = 0.7; g.add(s);
  } else if (lc === "pulley") {
    g.add(mk(new THREE.TorusGeometry(0.45, 0.15, 8, 24), c));
    const h = mk(new THREE.CylinderGeometry(0.12, 0.12, 0.32, 12), c); h.rotation.x = Math.PI / 2; g.add(h);
  } else if (lc === "balloon") {
    g.add(mk(new THREE.SphereGeometry(0.7, 20, 20), 0xef4444, 0.05, 0.05));
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
function disposeGroup(g: THREE.Group) {
  g.traverse(c => {
    if (c instanceof THREE.Mesh) { c.geometry.dispose(); (c.material as THREE.Material).dispose(); }
  });
  g.clear();
}

// ─── Left: 3-D Viewer ─────────────────────────────────────────────────────────
interface ViewerProps {
  step: { components: string[]; title: { en: string }; stepNumber: number } | null;
  totalSteps: number; stepIdx: number; exploded: boolean;
  onPrev: () => void; onNext: () => void;
  onSnapshot?: (dataUrl: string) => void;
}
function StepViewer3D({ step, totalSteps, stepIdx, exploded, onPrev, onNext, onSnapshot }: ViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group>(new THREE.Group());
  const frameRef = useRef(0);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current; if (!mount) return;
    const W = mount.clientWidth || 360; const H = 280;
    const scene = new THREE.Scene();
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
    const onDown = (e: PointerEvent) => { dragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; cvs.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => { if (!dragging.current) return; groupRef.current.rotation.y += (e.clientX - lastPos.current.x) * 0.01; groupRef.current.rotation.x += (e.clientY - lastPos.current.y) * 0.005; lastPos.current = { x: e.clientX, y: e.clientY }; };
    const onUp = () => { dragging.current = false; };
    cvs.addEventListener("pointerdown", onDown); cvs.addEventListener("pointermove", onMove);
    cvs.addEventListener("pointerup", onUp); cvs.addEventListener("pointercancel", onUp);
    const onResize = () => { if (!mount || !renderer) return; const w = mount.clientWidth; camera.aspect = w / H; camera.updateProjectionMatrix(); renderer.setSize(w, H); };
    window.addEventListener("resize", onResize);
    const animate = () => { frameRef.current = requestAnimationFrame(animate); if (!dragging.current) groupRef.current.rotation.y += 0.004; renderer.render(scene, camera); };
    animate();
    return () => {
      cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", onResize);
      cvs.removeEventListener("pointerdown", onDown); cvs.removeEventListener("pointermove", onMove);
      cvs.removeEventListener("pointerup", onUp); cvs.removeEventListener("pointercancel", onUp);
      disposeGroup(groupRef.current); renderer.dispose(); mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
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

    // Capture a snapshot after the grow animation settles (~350ms)
    if (onSnapshot) {
      const timer = setTimeout(() => {
        if (rendererRef.current) {
          onSnapshot(rendererRef.current.domElement.toDataURL("image/jpeg", 0.9));
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [step, exploded]);

  const comps = step ? parseComps(step.components) : [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-orange-500">🔧</span>
          <span className="font-bold text-[15px] text-gray-800">Interactive 3D Building Guide</span>
        </div>
        <p className="text-xs text-gray-500">Watch the 3D model as you follow each step.</p>
      </div>

      <div className="flex mx-4 mb-0 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
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
              <span key={`${c.code}-${i}`} className="font-mono text-[11px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-semibold">
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
  const comps = step ? parseComps(step.components) : [];
  const connections = useMemo(() => findConnections(comps), [comps.map(c => c.code).join(",")]);

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
            <div className="h-1.5 bg-teal-400 rounded-full transition-all duration-300"
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
                i === stepIdx ? "bg-orange-500 text-white shadow" : i < stepIdx ? "bg-teal-100 text-teal-700 border border-teal-200" : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
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
                  <span key={i} className="font-mono text-[11px] bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full font-semibold">
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
  chapterId: string;
  chapterTitle: string;
  referenceSnapshot: string | null;
}

function AIStepCheck({ stepIdx, step, chapterId, chapterTitle, referenceSnapshot }: AICheckProps) {
  const navigate  = useNavigate();
  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase,          setPhase]          = useState<CheckPhase>("idle");
  const [capturedImage,  setCapturedImage]  = useState<string | null>(null);
  const [cameraError,    setCameraError]    = useState<string | null>(null);
  // Separate results per method so both can be shown simultaneously
  const [apiResult,      setApiResult]      = useState<VerifyResult | null>(null);
  const [modelResult,    setModelResult]    = useState<VerifyResult | null>(null);
  const [checking,       setChecking]       = useState<"api" | "model" | null>(null);

  // Model loads on the research page — no pre-load here to avoid WebGL conflict with Three.js
  const modelStatus = "idle" as const;
  const modelMode   = "none"  as const;

  const comps = step ? parseComps(step.components) : [];
  // Generated canvas fallback (used only when 3D snapshot not yet ready)
  const generatedReference = useMemo(
    () => comps.length > 0 ? buildReferenceImage(comps) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comps.map(c => c.code + c.qty).join(",")]
  );
  // Prefer the actual 3D render snapshot over the generated canvas grid
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
  const goToResearch = useCallback((method: ResearchNavState["method"]) => {
    if (!capturedImage) return;
    sessionStorage.setItem("blix_captured_image", capturedImage);
    // Store the 3D snapshot so the research page can show it as reference
    if (referenceImage) sessionStorage.setItem("blix_reference_image", referenceImage);
    const state: ResearchNavState = {
      method, step, stepIdx, chapterId, chapterTitle,
    };
    navigate("/ai-research", { state });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturedImage, step, stepIdx, chapterId, chapterTitle]);

  const checkVisionAPI = useCallback(() => goToResearch("api"),  [goToResearch]);
  const checkMLModel   = useCallback(() => goToResearch("model"), [goToResearch]);

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
            {comps.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {comps.map((c, i) => (
                  <span key={i} className="font-mono text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full font-semibold">
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
                <div className="rounded-lg overflow-hidden border-2 border-teal-400 bg-gray-50 relative" style={{ aspectRatio: "4/3" }}>
                  {referenceImage
                    ? <img src={referenceImage} alt="Reference build" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No ref</div>
                  }
                  <div className="absolute top-1 right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center shadow">
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
                  {(apiResult?.correct || modelResult?.correct) && !checking && (
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

            {/* ── Two check buttons ── */}
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Choose verification method</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={checkVisionAPI} disabled={checking !== null}
                  className="flex flex-col items-center gap-0.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-[11px] font-bold py-2.5 px-2 rounded-xl transition-colors">
                  {checking === "api"
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mb-0.5" />
                    : <Sparkles className="w-4 h-4 mb-0.5" />}
                  <span>{checking === "api" ? "Checking…" : "Claude Vision"}</span>
                  <span className="text-[9px] font-normal opacity-75">AI Vision API</span>
                </button>
                <button onClick={checkMLModel} disabled={checking !== null}
                  className="flex flex-col items-center gap-0.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-[11px] font-bold py-2.5 px-2 rounded-xl transition-colors">
                  {checking === "model"
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mb-0.5" />
                    : <Cpu className="w-4 h-4 mb-0.5" />}
                  <span>{checking === "model" ? "Running…" : "INIAC-ML"}</span>
                  <span className="text-[9px] font-normal opacity-75">
                    {modelMode === "custom" ? "Custom Model" : "COCO-SSD Demo"}
                  </span>
                </button>
              </div>
              <button onClick={() => { setCapturedImage(null); setApiResult(null); setModelResult(null); startCamera(); }}
                className="w-full mt-1.5 text-[10px] text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 py-0.5 transition-colors">
                <RefreshCw className="w-3 h-3" /> Retake photo
              </button>
            </div>

            {/* ── Individual results ── */}
            {apiResult && <ResultCard result={apiResult} label="☁️ Claude Vision API" accent="blue" />}
            {modelResult && (
              <ResultCard
                result={modelResult}
                label={modelMode === "custom" ? "🤖 INIAC-ML (Custom)" : "🤖 INIAC-ML (Demo)"}
                accent="orange"
              />
            )}

            {/* ── Comparison card — thesis highlight ── */}
            {apiResult && modelResult && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                <p className="text-[11px] font-bold text-purple-700 mb-2">📊 Model Comparison</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-white rounded-lg p-2 border border-blue-100 text-center">
                    <p className="text-[10px] text-blue-600 font-bold mb-0.5">Claude Vision</p>
                    <p className={`text-[13px] font-bold ${apiResult.correct ? "text-green-600" : "text-red-500"}`}>
                      {apiResult.correct ? "✓ Pass" : "✗ Fail"}
                    </p>
                    <p className="text-[10px] text-gray-400">{Math.round(apiResult.confidence * 100)}% conf.</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-orange-100 text-center">
                    <p className="text-[10px] text-orange-600 font-bold mb-0.5">
                      INIAC-ML
                    </p>
                    <p className={`text-[13px] font-bold ${modelResult.correct ? "text-green-600" : "text-red-500"}`}>
                      {modelResult.correct ? "✓ Pass" : "✗ Fail"}
                    </p>
                    <p className="text-[10px] text-gray-400">{Math.round(modelResult.confidence * 100)}% conf.</p>
                  </div>
                </div>
                <div className={`text-[11px] font-semibold rounded-lg px-2.5 py-1.5 text-center ${
                  apiResult.correct === modelResult.correct
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {apiResult.correct === modelResult.correct
                    ? "✓ Both models agree"
                    : "⚠ Models disagree — human review recommended"}
                </div>
              </div>
            )}

            {/* ── Step done banner ── */}
            {(apiResult?.correct || modelResult?.correct) && !checking && (
              <div className="bg-teal-500 text-white text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1.5">
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
// aframe.io CDN is authoritative — jsDelivr 1.4.0 returns 404
const AFRAME_SRC = "https://aframe.io/releases/1.4.0/aframe.min.js";
const ARJS_SRC   = "https://cdn.jsdelivr.net/npm/@ar-js-org/ar.js@3.4.5/aframe/build/aframe-ar.js";
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
    containerRef.current.appendChild(scene);
    sceneRef.current = scene;

    return () => {
      if (sceneRef.current && containerRef.current?.contains(sceneRef.current)) {
        try { containerRef.current.removeChild(sceneRef.current); } catch { /* ignore */ }
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
            onPrev={() => setStepIdx(i => Math.max(0, i - 1))}
            onNext={() => setStepIdx(i => Math.min(totalSteps - 1, i + 1))}
            onSnapshot={setReferenceSnapshot}
          />
          <ARModule step={step} stepIdx={stepIdx} />
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <StepDetails chapter={chapter} stepIdx={stepIdx} onStepChange={setStepIdx} />
          <AIStepCheck stepIdx={stepIdx} step={step} chapterId={String(chapter.id)} chapterTitle={tr(chapter.title, "en")} referenceSnapshot={referenceSnapshot} />
          <AskAIBuddy />
        </div>
      </div>
    </div>
  );
};

export default BuildGuide;
