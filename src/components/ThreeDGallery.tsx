import { useEffect, useRef } from "react";
import * as THREE from "three";
import { componentBoxes, categoryStyle, type ComponentCategory, type KitComponent } from "@/data/kitComponents";

// ─── Category fill colours (badge + fill light) ───────────────────────────────

const categoryColor: Record<ComponentCategory, number> = {
  "logic-block":        0xfbbf24,
  "passive-electronic": 0x3b82f6,
  "active-electronic":  0x06b6d4,
  "ic":                 0x374151,
  "pcb":                0x166534,
  "sensor":             0xec4899,
  "actuator":           0xf97316,
  "power":              0xef4444,
  "wiring":             0x94a3b8,
  "structural":         0xfbbf24,
  "connector":          0x10b981,
  "shaft":              0xa3a3a3,
  "gear":               0x60a5fa,
  "wheel-tyre":         0x1f2937,
  "mechanical":         0xf59e0b,
  "marble-stem":        0x60a5fa,
  "stationery":         0xd1d5db,
  "consumable":         0x9ca3af,
  "magnet":             0x6b7280,
  "tool":               0x64748b,
};

const boxAccent: Record<string, string> = {
  "Box 1": "text-yellow-500",
  "Box 2": "text-sky-500",
  "Box 3": "text-violet-500",
  "Box 4": "text-emerald-500",
  "Box 5": "text-orange-500",
  "Box 6": "text-teal-500",
};

// ─── Mini helpers ─────────────────────────────────────────────────────────────

function mk(geom: THREE.BufferGeometry, color: number, metalness = 0.15, roughness = 0.5): THREE.Mesh {
  return new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ color, metalness, roughness }));
}

function at(obj: THREE.Object3D, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0): THREE.Object3D {
  obj.position.set(x, y, z);
  obj.rotation.set(rx, ry, rz);
  return obj;
}

// ─── Compound builders — each returns a THREE.Group ──────────────────────────

/** Square black logic-block tile + coloured top indicator + side connector port */
function buildLogicBlock(accent: number): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.BoxGeometry(1.3, 0.65, 1.3), 0x111827));
  g.add(at(mk(new THREE.BoxGeometry(0.85, 0.06, 0.85), accent, 0.05, 0.7), 0, 0.355, 0));
  const port = mk(new THREE.CylinderGeometry(0.14, 0.14, 0.22, 12), 0x6b7280, 0.4, 0.4);
  g.add(at(port, 0.77, -0.08, 0, 0, 0, Math.PI / 2));
  return g;
}

/** DIP IC: flat dark body + polarity notch + 4 silver pins per long side */
function buildIC(): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.BoxGeometry(1.65, 0.18, 0.72), 0x111111));
  g.add(at(mk(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 8), 0x333333), -0.58, 0.1, 0));
  for (let i = 0; i < 4; i++) {
    const px = -0.5 + i * 0.34;
    [-1, 1].forEach(s =>
      g.add(at(mk(new THREE.BoxGeometry(0.07, 0.14, 0.08), 0xc0c0c0, 0.8, 0.2), px, -0.16, s * 0.44))
    );
  }
  return g;
}

/** Green PCB board + silk-screen surface + dark component bumps */
function buildPCB(): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.BoxGeometry(1.85, 0.1, 1.15), 0x14532d));
  g.add(at(mk(new THREE.BoxGeometry(1.8, 0.03, 1.1), 0x166534, 0.05, 0.85), 0, 0.065, 0));
  [[0.4, 0.1], [-0.25, -0.15], [0.1, -0.3], [-0.55, 0.2]].forEach(([bx, bz]) =>
    g.add(at(mk(new THREE.BoxGeometry(0.22, 0.12, 0.22), 0x1f2937), bx, 0.11, bz))
  );
  return g;
}

/** ESP32 dev board: navy PCB + MCU chip + header pins */
function buildESP32(): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.BoxGeometry(1.5, 0.08, 0.82), 0x1e3a5f));
  g.add(at(mk(new THREE.BoxGeometry(0.55, 0.15, 0.55), 0x0f172a), 0.1, 0.115, 0));
  g.add(at(mk(new THREE.BoxGeometry(0.35, 0.1, 0.2), 0x374151), -0.55, 0.09, 0));
  for (let i = 0; i < 5; i++) {
    const px = -0.55 + i * 0.28;
    [-1, 1].forEach(s =>
      g.add(at(mk(new THREE.BoxGeometry(0.07, 0.18, 0.07), 0xc0c0c0, 0.7, 0.3), px, 0.09, s * 0.45))
    );
  }
  return g;
}

/** Wheel: black tyre torus + orange hub disc + silver axle */
function buildWheel(large = false): THREE.Group {
  const g = new THREE.Group();
  const r = large ? 1.05 : 0.82;
  const tube = large ? 0.38 : 0.3;
  g.add(mk(new THREE.TorusGeometry(r, tube, 16, 32), 0x111111));
  const hub = mk(new THREE.CylinderGeometry(r * 0.42, r * 0.42, tube * 0.75, 20), 0xf97316);
  g.add(at(hub, 0, 0, 0, Math.PI / 2));
  g.add(at(mk(new THREE.CylinderGeometry(0.08, 0.08, tube * 1.3, 10), 0x9ca3af, 0.7, 0.3), 0, 0, 0, Math.PI / 2));
  return g;
}

/** Gear: coloured torus ring + centre hub cylinder */
function buildGear(color: number, large: boolean): THREE.Group {
  const g = new THREE.Group();
  const r = large ? 0.98 : 0.62;
  const tube = large ? 0.19 : 0.16;
  g.add(mk(new THREE.TorusGeometry(r, tube, 8, large ? 60 : 20), color));
  const hub = mk(new THREE.CylinderGeometry(r * 0.28, r * 0.28, tube * 2.2, 12), color);
  g.add(at(hub, 0, 0, 0, Math.PI / 2));
  return g;
}

/** Structural pillar: yellow rectangular bar + hole markers */
function buildPillar(color: number, holes: number): THREE.Group {
  const g = new THREE.Group();
  const h = 0.24 * holes + 0.06;
  g.add(mk(new THREE.BoxGeometry(0.38, h, 0.52), color));
  const show = Math.min(holes, 7);
  for (let i = 0; i < show; i++) {
    const hole = mk(new THREE.CylinderGeometry(0.076, 0.076, 0.55, 8), 0x5a5000, 0.05, 0.9);
    g.add(at(hole, 0, -h / 2 + 0.15 + i * 0.24, 0, 0, 0, Math.PI / 2));
  }
  return g;
}

/** U-shaped pillar: two legs + base cross-piece */
function buildUPillar(color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(at(mk(new THREE.BoxGeometry(0.35, 2.0, 0.5), color), -0.65, 0, 0));
  g.add(at(mk(new THREE.BoxGeometry(0.35, 2.0, 0.5), color),  0.65, 0, 0));
  g.add(at(mk(new THREE.BoxGeometry(1.65, 0.35, 0.5), color), 0, -1.17, 0));
  return g;
}

/** Battery box: coloured box body + two terminal posts */
function buildBatteryBox(color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.BoxGeometry(1.45, 0.8, 0.9), color));
  [-0.38, 0.38].forEach(x =>
    g.add(at(mk(new THREE.CylinderGeometry(0.1, 0.1, 0.22, 10), 0x9ca3af, 0.6, 0.3), x, 0.51, 0))
  );
  return g;
}

/** DC motor: cylinder body + silver shaft stub */
function buildMotor(color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.CylinderGeometry(0.5, 0.5, 1.1, 20), color));
  g.add(at(mk(new THREE.CylinderGeometry(0.09, 0.09, 0.48, 10), 0x9ca3af, 0.7, 0.25), 0, 0.79, 0));
  return g;
}

/** Servo motor: boxy body + output horn on side + cable */
function buildServo(): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.BoxGeometry(0.9, 1.1, 0.6), 0x374151));
  g.add(at(mk(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 12), 0xd1d5db), 0.56, 0.2, 0, 0, 0, Math.PI / 2));
  g.add(at(mk(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8), 0x1f2937), 0, -0.8, 0));
  return g;
}

/** Flat base plate with representative stud grid */
function buildBasePlate(color: number, wide: boolean): THREE.Group {
  const g = new THREE.Group();
  const W = wide ? 2.05 : 1.65;
  const D = wide ? 2.05 : 1.15;
  g.add(mk(new THREE.BoxGeometry(W, 0.12, D), color));
  const cols = wide ? 4 : 3;
  const rows = wide ? 4 : 2;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const stud = mk(new THREE.CylinderGeometry(0.07, 0.07, 0.1, 8), color);
      at(stud,
        -(W / 2 - 0.3) + c * ((W - 0.6) / Math.max(cols - 1, 1)),
        0.11,
        -(D / 2 - 0.3) + r * ((D - 0.6) / Math.max(rows - 1, 1))
      );
      g.add(stud);
    }
  }
  return g;
}

/** Marble: glossy sphere */
function buildMarble(color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.SphereGeometry(0.88, 32, 32), color, 0.1, 0.05));
  return g;
}

/** Donut / ring magnet: thick red torus */
function buildDonutMagnet(): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.TorusGeometry(0.72, 0.38, 16, 32), 0xef4444, 0.2, 0.5));
  return g;
}

/** Bar magnet: silver body + red N-pole end */
function buildBarMagnet(): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.BoxGeometry(1.85, 0.42, 0.52), 0x9ca3af));
  g.add(at(mk(new THREE.BoxGeometry(0.47, 0.44, 0.54), 0xef4444), -0.7, 0, 0));
  return g;
}

/** Rubber band: thin flat torus */
function buildRubberBand(): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.TorusGeometry(0.7, 0.07, 8, 32), 0xd4a373, 0.0, 0.9));
  return g;
}

/** Small connector block with a pin nub */
function buildConnector(color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.BoxGeometry(0.65, 0.42, 0.42), color));
  const pin = mk(new THREE.CylinderGeometry(0.07, 0.07, 0.22, 8), 0x888888, 0.5, 0.3);
  g.add(at(pin, 0.44, 0, 0, 0, 0, Math.PI / 2));
  return g;
}

/** Thin washer ring */
function buildWasher(): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.TorusGeometry(0.3, 0.1, 8, 20), 0x6b7280, 0.4, 0.5));
  return g;
}

/** Metallic shaft: thin cylinder, length varies */
function buildShaft(len: number): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.CylinderGeometry(0.07, 0.07, len, 12), 0xa3a3a3, 0.7, 0.3));
  return g;
}

/** Gear rack: flat bar + tooth bumps */
function buildRack(color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.BoxGeometry(2.0, 0.25, 0.4), color));
  for (let i = 0; i < 7; i++)
    g.add(at(mk(new THREE.BoxGeometry(0.14, 0.18, 0.42), color), -0.84 + i * 0.28, 0.21, 0));
  return g;
}

/** Hexagonal pencil + tip */
function buildPencil(): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.CylinderGeometry(0.12, 0.12, 1.85, 6), 0xfde047));
  g.add(at(mk(new THREE.ConeGeometry(0.12, 0.28, 6), 0xfcd34d), 0, -1.06, 0));
  g.add(at(mk(new THREE.CylinderGeometry(0.13, 0.13, 0.18, 6), 0xfda4af), 0, 1.01, 0));
  return g;
}

/** 3-blade fan propeller */
function buildFan(): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.CylinderGeometry(0.15, 0.15, 0.25, 12), 0x374151));
  for (let i = 0; i < 3; i++) {
    const blade = mk(new THREE.BoxGeometry(0.22, 0.06, 0.7), 0x4ade80, 0.05, 0.7);
    blade.position.set(0.42, 0, 0);
    blade.rotation.z = 0.3;
    const pivot = new THREE.Object3D();
    pivot.rotation.y = (i * 2 * Math.PI) / 3;
    pivot.add(blade);
    g.add(pivot);
  }
  return g;
}

/** Wire / cable: cylinder + connector block */
function buildWire(color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.CylinderGeometry(0.06, 0.06, 1.9, 8), color));
  g.add(at(mk(new THREE.BoxGeometry(0.2, 0.2, 0.18), 0x1f2937), 0, 1.04, 0));
  return g;
}

/** Generic coloured box fallback */
function buildBox(color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.BoxGeometry(1.4, 1.4, 1.4), color));
  return g;
}

// ─── Dispose all geometries & materials in an Object3D tree ──────────────────

function disposeObject(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
      else (child.material as THREE.Material).dispose();
    }
  });
}

// ─── Main dispatch: choose compound shape per item ────────────────────────────

function buildObject(item: KitComponent): THREE.Object3D {
  switch (item.id) {
    // Logic blocks
    case "power-block":    return buildLogicBlock(0x3b82f6);
    case "not-block":      return buildLogicBlock(0x8b5cf6);
    case "led-block":      return buildLogicBlock(0xef4444);
    case "buzzer-block":   return buildLogicBlock(0xf59e0b);
    case "motor-block":    return buildLogicBlock(0x10b981);
    case "distance-block": return buildLogicBlock(0x06b6d4);
    case "ir-block":       return buildLogicBlock(0x6366f1);
    case "switch-block":   return buildLogicBlock(0x84cc16);
    // ICs
    case "ic-555": case "ic-7408": case "ic-7432": case "ic-7404":
    case "ic-7400": case "ic-7402": case "ic-7486": case "ic-7426":
    case "ic-74151": case "ic-74138": return buildIC();
    // PCBs
    case "pcb-7segment": case "pcb-peripheral":
    case "pcb-switch": case "pcb-ic-holder": return buildPCB();
    // Boards
    case "esp32": return buildESP32();
    case "servo-motor": return buildServo();
    // Wheels
    case "wheel": case "wheel-no-tyre": return buildWheel(false);
    case "wheel-big": return buildWheel(true);
    // Gears
    case "g20": case "g20-plus": case "g20-idler": return buildGear(0x60a5fa, false);
    case "g60": return buildGear(0xfbbf24, true);
    case "rack": return buildRack(0xfbbf24);
    // Pillars
    case "p3": case "p3-marble": case "p3-plus": return buildPillar(0xfbbf24, 3);
    case "p5":     return buildPillar(0xfbbf24, 5);
    case "p7":     return buildPillar(0xfbbf24, 7);
    case "p11":    return buildPillar(0xf59e0b, 11);
    case "pu5x13": case "pu5x7": return buildUPillar(0xfbbf24);
    // Base plates
    case "p21x21": case "p21x21-box3": return buildBasePlate(0xa3a3a3, true);
    case "p7x11":  case "p7x11-box3":  return buildBasePlate(0x4ade80, false);
    // Batteries
    case "battery-box": case "battery-3v": return buildBatteryBox(0xef4444);
    case "battery-6v":  return buildBatteryBox(0xdc2626);
    // Motors
    case "motor": case "motor-acc": return buildMotor(0x374151);
    case "dc-motor-board": return buildMotor(0x1f2937);
    // Marbles
    case "marbles": return buildMarble(0x93c5fd);
    // Magnets
    case "donut-magnet": return buildDonutMagnet();
    case "bar-magnet":   return buildBarMagnet();
    // Rubber bands
    case "rubber-band": case "rubber-band-acc": return buildRubberBand();
    // Washers
    case "tw1": case "tw2": return buildWasher();
    // Pencil
    case "pencil": return buildPencil();
    // Fan
    case "fan": return buildFan();
    // Shafts
    case "sh60":  return buildShaft(0.9);
    case "sh100": return buildShaft(1.35);
    case "sh170": return buildShaft(1.95);
    // Connectors
    case "ct1x2": case "ct1x2-marble": return buildConnector(0x3b82f6);
    case "cl2":   return buildConnector(0xfbbf24);
    case "ch2":   return buildConnector(0x60a5fa);
    case "ct2":   return buildConnector(0xfbbf24);
    case "ct3":   return buildConnector(0x3b82f6);
  }

  // Category fallback
  const col = categoryColor[item.category];
  switch (item.category) {
    case "logic-block":    return buildLogicBlock(col);
    case "ic":             return buildIC();
    case "pcb":            return buildPCB();
    case "wheel-tyre":     return buildWheel(false);
    case "gear":           return buildGear(col, false);
    case "structural":     return buildPillar(col, 5);
    case "power":          return buildBatteryBox(col);
    case "actuator":       return buildMotor(col);
    case "magnet":         return buildBarMagnet();
    case "marble-stem":    return buildMarble(col);
    case "connector":      return buildConnector(col);
    case "shaft":          return buildShaft(1.2);
    case "wiring":         return buildWire(col);
    case "stationery":     return buildPencil();
    default:               return buildBox(col);
  }
}

// ─── ModelCard ────────────────────────────────────────────────────────────────

const CANVAS_H = 160;

interface CardProps {
  item: KitComponent;
  autoRotate: boolean;
}

const ModelCard = ({ item, autoRotate }: CardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef(autoRotate);

  useEffect(() => { rotRef.current = autoRotate; }, [autoRotate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let object: THREE.Object3D | null = null;
    let dragging = false, lastX = 0, lastY = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || !object) return;
      object.rotation.y += (e.clientX - lastX) * 0.01;
      object.rotation.x += (e.clientY - lastY) * 0.01;
      lastX = e.clientX; lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    };

    // Lazy-init: only create a WebGL context when the card enters the viewport.
    // Browsers cap contexts at ~16 — creating 70+ at once causes silent failures.
    const initRenderer = () => {
      if (renderer) return;
      const W = Math.max(container.clientWidth, 1);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, W / CANVAS_H, 0.1, 100);
      camera.position.set(2.8, 1.8, 3.2);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, CANVAS_H);

      const canvas = renderer.domElement;
      canvas.style.cursor = "grab";
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);
      container.appendChild(canvas);

      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      key.position.set(5, 6, 5);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x8888ff, 0.35);
      fill.position.set(-4, 2, -4);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffffff, 0.3);
      rim.position.set(0, -4, -4);
      scene.add(rim);

      object = buildObject(item);
      scene.add(object);

      const handleResize = () => {
        if (!renderer || !container) return;
        const w = Math.max(container.clientWidth, 1);
        camera.aspect = w / CANVAS_H;
        camera.updateProjectionMatrix();
        renderer.setSize(w, CANVAS_H);
      };
      window.addEventListener("resize", handleResize);
      (renderer as THREE.WebGLRenderer & { _resize?: () => void })._resize = handleResize;

      const animate = () => {
        frame = requestAnimationFrame(animate);
        if (!renderer) return;
        if (rotRef.current && !dragging && object) object.rotation.y += 0.008;
        renderer.render(scene, camera);
      };
      animate();
    };

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) initRenderer(); },
      { threshold: 0, rootMargin: "60px" }
    );
    observer.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      if (renderer) {
        const r = renderer as THREE.WebGLRenderer & { _resize?: () => void };
        if (r._resize) window.removeEventListener("resize", r._resize);
        const canvas = r.domElement;
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
        canvas.parentNode?.removeChild(canvas);
        if (object) disposeObject(object);
        r.dispose();
        renderer = null;
        object = null;
      }
    };
  }, [item]);

  return (
    <div className="rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all p-3">
      <div
        ref={containerRef}
        className="w-full h-[160px] rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 mb-3 overflow-hidden"
      />
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-1">
          <span className="font-mono text-[11px] font-bold bg-muted px-1.5 py-0.5 rounded text-foreground">
            {item.code}
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground whitespace-nowrap">
            ×{item.qty} {item.unit}
          </span>
        </div>
        <p className="font-semibold text-foreground text-sm leading-tight line-clamp-2">{item.name}</p>
        <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full border ${categoryStyle[item.category]}`}>
          {item.category}
        </span>
      </div>
    </div>
  );
};

// ─── ThreeDGallery ────────────────────────────────────────────────────────────

interface ThreeDGalleryProps {
  autoRotate: boolean;
}

const ThreeDGallery = ({ autoRotate }: ThreeDGalleryProps) => (
  <div className="space-y-14">
    {componentBoxes.map((box) => {
      const totalModels = box.groups.reduce((s, g) => s + g.items.length, 0);
      return (
        <section key={box.box}>
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
            <h3 className={`text-xl font-bold ${boxAccent[box.box] ?? "text-foreground"}`}>
              {box.box} · {box.title}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
              {totalModels} models
            </span>
          </div>
          <div className="space-y-8">
            {box.groups.map((group) => (
              <div key={group.group}>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-sm font-semibold text-muted-foreground">{group.group}</h4>
                  {group.multiplier && (
                    <span className="text-[10px] uppercase tracking-wide font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {group.multiplier}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {group.items.map((item) => (
                    <ModelCard key={item.id} item={item} autoRotate={autoRotate} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    })}
  </div>
);

export default ThreeDGallery;
