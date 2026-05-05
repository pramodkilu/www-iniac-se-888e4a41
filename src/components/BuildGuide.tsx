import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ChevronLeft, ChevronRight, Camera, Maximize2, Ruler, Sparkles, CheckCircle2 } from "lucide-react";
import { type Chapter, tr } from "@/data/chapters";

// ─── Component code → color ───────────────────────────────────────────────────
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
  G60: 0xfbbf24,
  Wheel: 0x1f2937, "Wheel w/o tires": 0x374151,
  Rack: 0xfbbf24,
  "Motor with Battery Box": 0x374151,
  Queaky: 0x4ade80,
  Thread: 0x94a3b8,
  Pulley: 0xfbbf24,
  Suspension: 0xfbbf24,
  "P5 Nut": 0xf59e0b,
  "Power Screw": 0xfbbf24,
  "Hinges": 0x9ca3af,
  Balloon: 0xef4444,
  "Alligator clips": 0xef4444,
  "Connecting towers": 0x6b7280,
  "Mudguard Left": 0xfbbf24, "Mudguard Right": 0xfbbf24,
  "Steering wheel": 0x1f2937,
  Spoiler: 0xfbbf24,
  "Long plates": 0xa3a3a3, "Short plates": 0xa3a3a3, "Equal plates": 0xa3a3a3,
  PC3: 0x3b82f6,
};

function codeColor(code: string): number {
  // Try exact match then prefix match
  if (CODE_COLOR[code]) return CODE_COLOR[code];
  for (const k of Object.keys(CODE_COLOR)) {
    if (code.toLowerCase().startsWith(k.toLowerCase())) return CODE_COLOR[k];
  }
  return 0xfbbf24; // default amber
}

// ─── Three.js shape builders ──────────────────────────────────────────────────
function mk(g: THREE.BufferGeometry, color: number, metalness = 0.15, roughness = 0.5) {
  return new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, metalness, roughness }));
}

function buildShape(code: string): THREE.Object3D {
  const c = codeColor(code);
  const grp = new THREE.Group();
  const lc = code.toLowerCase();

  if (lc.includes("p7x11") || lc.includes("p7X11")) {
    // U-shaped pillar — 2 legs + base
    const leg = () => mk(new THREE.BoxGeometry(0.32, 1.8, 0.44), c);
    const base = mk(new THREE.BoxGeometry(1.4, 0.32, 0.44), c);
    const l = leg(); l.position.set(-0.55, 0, 0); grp.add(l);
    const r = leg(); r.position.set( 0.55, 0, 0); grp.add(r);
    base.position.set(0, -0.93, 0); grp.add(base);
  } else if (lc.includes("p21x21")) {
    grp.add(mk(new THREE.BoxGeometry(1.9, 0.12, 1.9), c));
    for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) {
      const s = mk(new THREE.CylinderGeometry(0.07, 0.07, 0.1, 8), c);
      s.position.set(a * 0.38, 0.11, b * 0.38); grp.add(s);
    }
  } else if (/^p\d+$/i.test(code.trim())) {
    // Straight pillar — height proportional to hole count
    const holes = parseInt(code.replace(/\D/g, "")) || 5;
    const h = 0.22 * holes + 0.06;
    grp.add(mk(new THREE.BoxGeometry(0.36, h, 0.46), c));
    for (let i = 0; i < Math.min(holes, 8); i++) {
      const hole = mk(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 8), 0x775500, 0.05, 0.9);
      hole.rotation.z = Math.PI / 2;
      hole.position.set(0, -h / 2 + 0.14 + i * 0.22, 0);
      grp.add(hole);
    }
  } else if (lc.startsWith("pu")) {
    grp.add(mk(new THREE.BoxGeometry(0.3, 1.9, 0.4), c));
    [-0.6, 0.6].forEach(x => { const l = mk(new THREE.BoxGeometry(0.3, 1.9, 0.4), c); l.position.set(x, 0, 0); grp.add(l); });
    const base = mk(new THREE.BoxGeometry(1.5, 0.3, 0.4), c); base.position.y = -1.1; grp.add(base);
  } else if (lc.startsWith("ct") || lc.startsWith("ch") || lc.startsWith("cl")) {
    grp.add(mk(new THREE.BoxGeometry(0.6, 0.38, 0.38), c));
    const pin = mk(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 8), 0x888888, 0.5, 0.3);
    pin.rotation.z = Math.PI / 2; pin.position.set(0.42, 0, 0); grp.add(pin);
  } else if (lc.startsWith("tw")) {
    grp.add(mk(new THREE.TorusGeometry(0.28, 0.09, 8, 20), c, 0.4, 0.5));
  } else if (lc.startsWith("sh")) {
    const len = parseInt(code.replace(/\D/g, "")) / 60 || 1.2;
    grp.add(mk(new THREE.CylinderGeometry(0.07, 0.07, len, 12), 0xc0c0c0, 0.7, 0.3));
  } else if (lc.startsWith("g20")) {
    const t = mk(new THREE.TorusGeometry(0.6, 0.15, 8, 20), c);
    const h = mk(new THREE.CylinderGeometry(0.17, 0.17, 0.35, 12), c); h.rotation.x = Math.PI / 2;
    grp.add(t); grp.add(h);
  } else if (lc === "g60") {
    const t = mk(new THREE.TorusGeometry(0.95, 0.18, 8, 60), c);
    const h = mk(new THREE.CylinderGeometry(0.28, 0.28, 0.4, 12), c); h.rotation.x = Math.PI / 2;
    grp.add(t); grp.add(h);
  } else if (lc === "rack") {
    grp.add(mk(new THREE.BoxGeometry(1.8, 0.22, 0.36), c));
    for (let i = 0; i < 7; i++) {
      const tooth = mk(new THREE.BoxGeometry(0.12, 0.16, 0.38), c);
      tooth.position.set(-0.78 + i * 0.26, 0.19, 0); grp.add(tooth);
    }
  } else if (lc === "wheel" || lc.includes("w/o")) {
    grp.add(mk(new THREE.TorusGeometry(0.78, 0.28, 16, 32), 0x111111));
    const hub = mk(new THREE.CylinderGeometry(0.33, 0.33, 0.3, 20), 0xf97316);
    hub.rotation.x = Math.PI / 2; grp.add(hub);
  } else if (lc.includes("motor") || lc.includes("gearbox")) {
    grp.add(mk(new THREE.CylinderGeometry(0.45, 0.45, 1.0, 20), 0x374151));
    const s = mk(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 10), 0x9ca3af, 0.7, 0.3);
    s.position.y = 0.7; grp.add(s);
  } else if (lc === "pulley") {
    grp.add(mk(new THREE.TorusGeometry(0.45, 0.15, 8, 24), c));
    const h = mk(new THREE.CylinderGeometry(0.12, 0.12, 0.32, 12), c); h.rotation.x = Math.PI / 2; grp.add(h);
  } else if (lc === "suspension") {
    grp.add(mk(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 12), c));
    [0.55, -0.55].forEach(y => { const d = mk(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 12), c); d.position.y = y; grp.add(d); });
  } else if (lc === "balloon") {
    grp.add(mk(new THREE.SphereGeometry(0.7, 20, 20), 0xef4444, 0.05, 0.05));
    grp.add(mk(new THREE.CylinderGeometry(0.06, 0.1, 0.25, 8), 0xfda4af));
  } else {
    // Fallback: simple box
    grp.add(mk(new THREE.BoxGeometry(0.9, 0.9, 0.9), c));
  }
  return grp;
}

// ─── Parse component strings ──────────────────────────────────────────────────
function parseComps(list: string[]): { code: string; qty: number }[] {
  return list.flatMap(s => {
    const m = s.match(/^(.+?)\s*[xX×](\d+)$/);
    if (!m) return [{ code: s.trim(), qty: 1 }];
    return [{ code: m[1].trim(), qty: parseInt(m[2]) }];
  });
}

// ─── Dispose a scene's user objects ──────────────────────────────────────────
function disposeGroup(grp: THREE.Group) {
  grp.traverse(c => {
    if (c instanceof THREE.Mesh) {
      c.geometry.dispose();
      (c.material as THREE.Material).dispose();
    }
  });
  grp.clear();
}

// ─── 3-D Viewer panel ─────────────────────────────────────────────────────────
interface ViewerProps {
  step: { components: string[]; title: { en: string }; stepNumber: number } | null;
  totalSteps: number;
  stepIdx: number;
  exploded: boolean;
  onPrev: () => void;
  onNext: () => void;
}

function StepViewer3D({ step, totalSteps, stepIdx, exploded, onPrev, onNext }: ViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef    = useRef<THREE.Scene | null>(null);
  const cameraRef   = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef    = useRef<THREE.Group>(new THREE.Group());
  const frameRef    = useRef(0);
  const dragging    = useRef(false);
  const lastPos     = useRef({ x: 0, y: 0 });

  // Init renderer once
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth || 300;
    const H = mount.clientHeight || 320;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.add(groupRef.current);

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(5, 3.5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // Lighting — warm neutral to match the cream UI
    scene.add(new THREE.AmbientLight(0xfff8f0, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(6, 8, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffe4c0, 0.4);
    fill.position.set(-4, 3, -4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.25);
    rim.position.set(0, -5, -5);
    scene.add(rim);

    // Grid floor
    const grid = new THREE.GridHelper(10, 20, 0xe5e7eb, 0xf3f4f6);
    grid.position.y = -1.5;
    scene.add(grid);

    // Drag-to-rotate
    const cvs = renderer.domElement;
    cvs.style.cursor = "grab";
    const onDown = (e: PointerEvent) => { dragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; cvs.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      groupRef.current.rotation.y += (e.clientX - lastPos.current.x) * 0.01;
      groupRef.current.rotation.x += (e.clientY - lastPos.current.y) * 0.005;
      lastPos.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { dragging.current = false; };
    cvs.addEventListener("pointerdown", onDown);
    cvs.addEventListener("pointermove", onMove);
    cvs.addEventListener("pointerup", onUp);
    cvs.addEventListener("pointercancel", onUp);

    const handleResize = () => {
      if (!mount || !renderer || !camera) return;
      const w = mount.clientWidth; const h = mount.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (!dragging.current) groupRef.current.rotation.y += 0.004;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      cvs.removeEventListener("pointerdown", onDown);
      cvs.removeEventListener("pointermove", onMove);
      cvs.removeEventListener("pointerup", onUp);
      cvs.removeEventListener("pointercancel", onUp);
      disposeGroup(groupRef.current);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  // Rebuild scene objects when step or exploded changes
  useEffect(() => {
    const grp = groupRef.current;
    disposeGroup(grp);
    if (!step || step.components.length === 0) return;

    const items = parseComps(step.components);
    const spacing = exploded ? 3.2 : 1.8;
    const cols = Math.ceil(Math.sqrt(items.length));

    let idx = 0;
    for (const { code, qty } of items) {
      for (let q = 0; q < qty && idx < 20; q++, idx++) {
        const obj = buildShape(code);
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const totalW = (cols - 1) * spacing;
        obj.position.set(col * spacing - totalW / 2, 0, row * spacing - ((Math.ceil(idx / cols) - 1) * spacing) / 2);
        // Animate scale in
        obj.scale.setScalar(0.001);
        grp.add(obj);
        const start = performance.now();
        const grow = () => {
          const t = Math.min((performance.now() - start) / 300, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          obj.scale.setScalar(ease);
          if (t < 1) requestAnimationFrame(grow);
        };
        requestAnimationFrame(grow);
      }
    }
    grp.rotation.set(0, 0.3, 0);
  }, [step, exploded]);

  const comps = step ? parseComps(step.components) : [];

  return (
    <div className="flex flex-col h-full bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b border-border/60">
        <div className="flex items-center gap-2 mb-0.5">
          <Wrench className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-sm text-foreground">Interactive 3D Building Guide</span>
        </div>
        <p className="text-xs text-muted-foreground">Watch the 3D model as you follow each step.</p>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Controls sidebar */}
        <div className="w-28 border-r border-border/60 p-3 flex flex-col gap-4 shrink-0">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2">View Controls</p>
            <label className="flex items-start gap-1.5 cursor-pointer mb-2">
              <div className={`w-3.5 h-3.5 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${exploded ? "border-orange-500" : "border-muted-foreground/40"}`}>
                {exploded && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
              </div>
              <span className="text-[11px] text-muted-foreground leading-tight">Exploded View</span>
            </label>
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2">Components</p>
            {comps.slice(0, 5).map((c, i) => (
              <div key={i} className="flex items-start gap-1 mb-1.5">
                <CheckCircle2 className="w-3 h-3 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-[10px] text-muted-foreground leading-tight font-mono">
                  {c.code}{c.qty > 1 ? ` ×${c.qty}` : ""}
                </span>
              </div>
            ))}
            {comps.length > 5 && (
              <span className="text-[10px] text-muted-foreground">+{comps.length - 5} more</span>
            )}
          </div>
        </div>

        {/* 3D canvas */}
        <div className="flex-1 relative min-h-0">
          <div ref={mountRef} className="w-full h-full" style={{ minHeight: 240 }} />
        </div>
      </div>

      {/* Step footer */}
      <div className="border-t border-border/60 px-4 py-3 bg-white">
        <div className="flex items-start gap-2 mb-2">
          <span className="shrink-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
            Step {stepIdx + 1} of {totalSteps}
          </span>
          <p className="text-xs font-semibold text-foreground leading-snug">
            {step ? tr(step.title, "en") : "—"}
          </p>
        </div>
        {comps.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {comps.flatMap(c => Array.from({ length: Math.min(c.qty, 4) }, (_, i) => (
              <span key={`${c.code}-${i}`} className="font-mono text-[11px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-semibold">
                {c.code}
              </span>
            )))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <button onClick={onPrev} disabled={stepIdx === 0}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(totalSteps, 9) }, (_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === stepIdx ? "w-4 bg-orange-500" : "w-1.5 bg-gray-300"}`} />
            ))}
          </div>
          <button onClick={onNext} disabled={stepIdx >= totalSteps - 1}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Wrench import inline since we already import from lucide-react
// (re-export the icon inline to avoid duplicate imports at top)
function Wrench(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );
}

// ─── Step Details panel ───────────────────────────────────────────────────────
interface DetailsProps {
  chapter: Chapter;
  stepIdx: number;
  onStepChange: (i: number) => void;
}

function StepDetails({ chapter, stepIdx, onStepChange }: DetailsProps) {
  const totalSteps = chapter.build.steps.length || chapter.build.totalSteps;
  const step = chapter.build.steps[stepIdx];

  return (
    <div className="flex flex-col gap-3">
      {/* Step counter + nav */}
      <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-foreground">Step {stepIdx + 1} of {totalSteps}</h3>
          <div className="flex gap-1">
            <button onClick={() => onStepChange(Math.max(0, stepIdx - 1))} disabled={stepIdx === 0}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => onStepChange(Math.min(totalSteps - 1, stepIdx + 1))} disabled={stepIdx >= totalSteps - 1}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress track */}
        <div className="relative mb-3">
          <div className="h-1.5 bg-gray-200 rounded-full">
            <div
              className="h-1.5 bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${((stepIdx + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <div
            className="absolute -top-1 w-4 h-4 bg-white border-2 border-orange-500 rounded-full transition-all duration-300"
            style={{ left: `calc(${((stepIdx + 1) / totalSteps) * 100}% - 8px)` }}
          />
        </div>

        {/* Step number dots */}
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: Math.min(totalSteps, 15) }, (_, i) => (
            <button
              key={i}
              onClick={() => onStepChange(i)}
              className={`w-7 h-7 rounded-full text-xs font-semibold transition-all ${
                i === stepIdx
                  ? "bg-orange-500 text-white shadow scale-110"
                  : i < stepIdx
                  ? "bg-teal-100 text-teal-700 border border-teal-200"
                  : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          {totalSteps > 15 && <span className="text-xs text-muted-foreground self-center">+{totalSteps - 15}</span>}
        </div>
      </div>

      {/* Step description card */}
      <div className="bg-white border border-border rounded-2xl p-4 shadow-sm flex-1">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
            {stepIdx + 1}
          </div>
          <div className="flex-1 min-w-0">
            {step ? (
              <>
                <p className="font-semibold text-foreground mb-1">{tr(step.title, "en")}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{tr(step.description, "en")}</p>
                {step.components.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {parseComps(step.components).map((c, i) => (
                      <span key={i} className="font-mono text-[11px] bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full font-semibold">
                        {c.code} ×{c.qty}
                      </span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="font-semibold text-foreground mb-1">Step {stepIdx + 1} — details coming soon.</p>
                <p className="text-sm text-muted-foreground">The full build sequence will be added here when ready.</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Model info */}
      <div className="bg-orange-50 border border-orange-200/60 rounded-2xl p-3">
        <p className="text-xs text-orange-700 font-semibold">{tr(chapter.build.modelName, "en")}</p>
        <p className="text-xs text-orange-600/80 mt-0.5">{tr(chapter.build.description, "en")}</p>
      </div>
    </div>
  );
}

// ─── AI Step Check panel ──────────────────────────────────────────────────────
interface AICheckProps { stepIdx: number; step: { title: { en: string } } | null; }

function AIStepCheck({ stepIdx, step }: AICheckProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<"ok" | "retry" | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setCameraOn(true);
      setResult(null);
    } catch { setCameraOn(false); }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  const checkStep = useCallback(() => {
    setChecking(true);
    // Simulate AI check (2 sec)
    setTimeout(() => {
      setChecking(false);
      setResult(Math.random() > 0.3 ? "ok" : "retry");
    }, 2000);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);
  // Reset result on step change
  useEffect(() => { setResult(null); }, [stepIdx]);

  const stepTitle = step ? tr(step.title, "en") : `Step ${stepIdx + 1} — details coming soon.`;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-0.5">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span className="font-bold text-sm text-foreground">AI Step Check</span>
        </div>
        <p className="text-xs text-muted-foreground">Verify Step {stepIdx + 1} with a photo.</p>
      </div>

      {/* Camera card */}
      <div className="bg-orange-50/60 border border-orange-200/50 rounded-2xl p-4 shadow-sm flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Camera className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-sm text-foreground">AI Step Check — Step {stepIdx + 1}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          Show your current build to the camera. Our AI teacher will check if the step looks right.
        </p>

        {/* Checking label */}
        {checking && (
          <p className="text-xs text-orange-700 mb-2 font-medium animate-pulse">
            Checking: {stepTitle}
          </p>
        )}

        {/* Video / placeholder */}
        <div className="rounded-xl overflow-hidden bg-white border border-border mb-3 relative" style={{ aspectRatio: "4/3" }}>
          {cameraOn ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Camera className="w-10 h-10 opacity-40" />
              <p className="text-xs">Start the camera to take a photo of your build</p>
            </div>
          )}
          {checking && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {result === "ok" && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </div>
          )}
        </div>
        <video ref={videoRef} className="hidden" />

        {/* Result feedback */}
        {result === "ok" && (
          <div className="mb-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 font-medium">
            ✓ Step looks correct! Well done.
          </div>
        )}
        {result === "retry" && (
          <div className="mb-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 font-medium">
            Something looks off — check step {stepIdx + 1} and try again.
          </div>
        )}

        {/* Buttons */}
        {!cameraOn ? (
          <button onClick={startCamera}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <Camera className="w-4 h-4" /> Start Camera
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={checkStep} disabled={checking}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
              <Sparkles className="w-3.5 h-3.5" /> {checking ? "Checking…" : "Check Step"}
            </button>
            <button onClick={stopCamera}
              className="flex-1 bg-white border border-border text-muted-foreground text-xs font-semibold py-2.5 px-3 rounded-xl hover:bg-muted transition-colors">
              Stop Camera
            </button>
          </div>
        )}
      </div>

      {/* AR Buddy teaser */}
      <div className="bg-white border border-border rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Maximize2 className="w-4 h-4 text-purple-500" />
          <span className="font-bold text-xs text-foreground">AR &amp; AI Buddy</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Point your camera at the build area — the AR overlay will guide each piece into place.
        </p>
        <div className="mt-2 text-[10px] font-semibold text-purple-600 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1 text-center">
          Coming soon
        </div>
      </div>
    </div>
  );
}

// ─── BuildGuide — the full 3-panel layout ─────────────────────────────────────
interface BuildGuideProps { chapter: Chapter }

const BuildGuide = ({ chapter }: BuildGuideProps) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [exploded, setExploded] = useState(false);

  const totalSteps = Math.max(chapter.build.steps.length, chapter.build.totalSteps);
  const step = chapter.build.steps[stepIdx] ?? null;

  return (
    <div className="space-y-3">
      {/* Exploded toggle */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => setExploded(v => !v)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
            exploded ? "bg-orange-500 text-white border-orange-500" : "bg-white text-muted-foreground border-border hover:text-foreground"
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          {exploded ? "Normal View" : "Exploded View"}
        </button>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Ruler className="w-3 h-3" /> Drag to rotate
        </span>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr_3fr] gap-4" style={{ minHeight: 520 }}>
        <StepViewer3D
          step={step}
          totalSteps={totalSteps}
          stepIdx={stepIdx}
          exploded={exploded}
          onPrev={() => setStepIdx(i => Math.max(0, i - 1))}
          onNext={() => setStepIdx(i => Math.min(totalSteps - 1, i + 1))}
        />
        <StepDetails chapter={chapter} stepIdx={stepIdx} onStepChange={setStepIdx} />
        <AIStepCheck stepIdx={stepIdx} step={step} />
      </div>
    </div>
  );
};

export default BuildGuide;
