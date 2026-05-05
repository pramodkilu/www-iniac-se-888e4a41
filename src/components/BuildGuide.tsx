import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { ChevronLeft, ChevronRight, Camera, Maximize2, Ruler, Sparkles, CheckCircle2, RefreshCw, Box, Link2 } from "lucide-react";
import { type Chapter, tr } from "@/data/chapters";

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
}
function StepViewer3D({ step, totalSteps, stepIdx, exploded, onPrev, onNext }: ViewerProps) {
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

// ─── Right: AI Step Check ─────────────────────────────────────────────────────
type CheckPhase = "idle" | "camera" | "captured" | "checking" | "done";

interface AICheckProps {
  stepIdx: number;
  step: { title: { en: string }; components: string[] } | null;
}

function AIStepCheck({ stepIdx, step }: AICheckProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<CheckPhase>("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<"ok" | "retry" | null>(null);

  const comps = step ? parseComps(step.components) : [];

  // Build reference image only when step components change
  const referenceImage = useMemo(
    () => comps.length > 0 ? buildReferenceImage(comps) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comps.map(c => c.code + c.qty).join(",")]
  );

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setPhase("camera");
    } catch { /* camera permission denied */ }
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

  const checkWithAI = useCallback(() => {
    setPhase("checking");
    // TODO: POST capturedImage + referenceImage to Supabase edge function → Claude vision API
    setTimeout(() => {
      setResult(Math.random() > 0.4 ? "ok" : "retry");
      setPhase("done");
    }, 2200);
  }, []);

  const reset = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
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
            <button onClick={startCamera}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
              <Camera className="w-3.5 h-3.5" /> Start Camera
            </button>
          </div>
        )}

        {/* ── Phase: camera — live video ── */}
        {phase === "camera" && (
          <div className="space-y-2">
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
        )}

        {/* Hidden video used only during capture phase; keeps ref alive */}
        {phase !== "camera" && <video ref={videoRef} className="hidden" />}

        {/* ── Phase: captured / checking — side-by-side comparison ── */}
        {(phase === "captured" || phase === "checking" || phase === "done") && capturedImage && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {/* Reference */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide text-center mb-1">Reference</p>
                <div className="rounded-lg overflow-hidden border-2 border-teal-400 bg-gray-50 relative" style={{ aspectRatio: "4/3" }}>
                  {referenceImage
                    ? <img src={referenceImage} alt="Reference build" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No ref</div>
                  }
                  {/* Teal checkmark badge */}
                  <div className="absolute top-1 right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center shadow">
                    <span className="text-white text-[8px] font-bold">✓</span>
                  </div>
                </div>
              </div>
              {/* Your photo */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide text-center mb-1">Your Build</p>
                <div className="rounded-lg overflow-hidden border-2 border-orange-400 relative" style={{ aspectRatio: "4/3" }}>
                  <img src={capturedImage} alt="Your build" className="w-full h-full object-cover" />
                  {phase === "checking" && (
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {phase === "done" && result === "ok" && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-600 drop-shadow" />
                    </div>
                  )}
                  {phase === "done" && result === "retry" && (
                    <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                      <span className="text-2xl drop-shadow">⚠️</span>
                    </div>
                  )}
                  {/* Orange camera badge */}
                  <div className="absolute top-1 right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow">
                    <Camera className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {phase === "captured" && (
              <div className="flex gap-2">
                <button onClick={checkWithAI}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors">
                  <Sparkles className="w-3 h-3" /> Check with AI
                </button>
                <button onClick={() => { setCapturedImage(null); startCamera(); }}
                  className="w-9 border border-gray-200 text-gray-400 py-2 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center"
                  title="Retake">
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            )}

            {phase === "checking" && (
              <p className="text-center text-[11px] text-gray-500 animate-pulse py-1">
                AI is comparing your build to the reference…
              </p>
            )}

            {/* ── Results ── */}
            {phase === "done" && result === "ok" && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2 mb-0.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <p className="text-[12px] text-green-700 font-bold">Step looks correct!</p>
                </div>
                <p className="text-[11px] text-green-600 pl-6">All components appear to be placed correctly. Move to the next step.</p>
              </div>
            )}

            {phase === "done" && result === "retry" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-yellow-500">⚠️</span>
                  <span className="font-bold text-[12px] text-orange-600">Let's fix this</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed mb-2">
                  Some components may not be fully connected. Try zooming out so all pieces are visible in the frame.
                </p>
              </div>
            )}

            {phase === "done" && (
              <div className="flex gap-2">
                <button onClick={reset}
                  className="flex-1 border border-gray-200 text-gray-500 text-[11px] font-semibold py-1.5 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Retake
                </button>
                {result === "ok" && (
                  <div className="flex-1 bg-teal-500 text-white text-[11px] font-bold py-1.5 rounded-lg flex items-center justify-center">
                    ✓ Step {stepIdx + 1} done
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AR & AI Buddy card ───────────────────────────────────────────────────────
function ARBuddyCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <Box className="w-4 h-4 text-orange-500" />
        <span className="font-bold text-[14px] text-gray-800">AR &amp; AI Buddy</span>
      </div>
      <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <span className="text-yellow-500 mt-0.5 shrink-0">💡</span>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            <span className="font-bold text-amber-700">AR locked.</span>{" "}
            Point your camera at your build to unlock AR overlay mode — see virtual connection hints layered on top of your real components.
          </p>
        </div>
      </div>
    </div>
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

  useEffect(() => { setStepIdx(0); }, [chapter.id]);

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
          />
          <ARBuddyCard />
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <StepDetails chapter={chapter} stepIdx={stepIdx} onStepChange={setStepIdx} />
          <AIStepCheck stepIdx={stepIdx} step={step} />
          <AskAIBuddy />
        </div>
      </div>
    </div>
  );
};

export default BuildGuide;
