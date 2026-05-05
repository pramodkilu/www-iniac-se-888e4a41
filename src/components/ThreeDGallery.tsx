import { useEffect, useRef } from "react";
import * as THREE from "three";
import { componentBoxes, categoryStyle, type ComponentCategory, type KitComponent } from "@/data/kitComponents";

// ─── Shape & colour mappings ──────────────────────────────────────────────────

type Shape = "box" | "cylinder" | "sphere" | "torus" | "pillar" | "flatbox";

const categoryShape: Record<ComponentCategory, Shape> = {
  "logic-block":        "box",
  "passive-electronic": "cylinder",
  "active-electronic":  "box",
  "ic":                 "flatbox",
  "pcb":                "flatbox",
  "sensor":             "box",
  "actuator":           "cylinder",
  "power":              "box",
  "wiring":             "cylinder",
  "structural":         "pillar",
  "connector":          "sphere",
  "shaft":              "pillar",
  "gear":               "torus",
  "wheel-tyre":         "torus",
  "mechanical":         "box",
  "marble-stem":        "sphere",
  "stationery":         "cylinder",
  "consumable":         "box",
  "magnet":             "box",
  "tool":               "box",
};

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

// per-id overrides for items that need a more specific appearance
const idShape: Partial<Record<string, Shape>> = {
  "marbles":          "sphere",
  "donut-magnet":     "torus",
  "rubber-band":      "torus",
  "rubber-band-acc":  "torus",
  "wheel":            "torus",
  "wheel-no-tyre":    "torus",
  "wheel-big":        "torus",
  "g20":              "torus",
  "g20-plus":         "torus",
  "g20-idler":        "torus",
  "g60":              "torus",
  "rack":             "pillar",
  "pencil":           "cylinder",
  "straw":            "cylinder",
};

const idColor: Partial<Record<string, number>> = {
  "marbles":          0x93c5fd,
  "donut-magnet":     0xef4444,
  "bar-magnet":       0x9ca3af,
  "led-green":        0x4ade80,
  "led-red":          0xf87171,
  "led-boffin":       0xf59e0b,
  "led-block":        0xef4444,
  "buzzer-block":     0xf59e0b,
  "motor-block":      0x10b981,
  "distance-block":   0x06b6d4,
  "ir-block":         0x6366f1,
  "not-block":        0x8b5cf6,
  "power-block":      0x3b82f6,
  "switch-block":     0x84cc16,
  "esp32":            0x374151,
  "pcb-7segment":     0x166534,
  "pcb-peripheral":   0x166534,
  "pcb-switch":       0x166534,
  "pcb-ic-holder":    0x166534,
  "pencil":           0xfde047,
  "eraser":           0xfda4af,
  "black-marker":     0x1f2937,
  "battery-3v":       0xef4444,
  "battery-6v":       0xef4444,
  "battery-box":      0xef4444,
  "p21x21":           0xa3a3a3,
  "p21x21-box3":      0xa3a3a3,
  "p7x11":            0xa3a3a3,
  "p7x11-box3":       0xa3a3a3,
};

const boxAccent: Record<string, string> = {
  "Box 1": "text-yellow-500",
  "Box 2": "text-sky-500",
  "Box 3": "text-violet-500",
  "Box 4": "text-emerald-500",
  "Box 5": "text-orange-500",
  "Box 6": "text-teal-500",
};

// ─── Three.js mesh builder ────────────────────────────────────────────────────

function buildMesh(item: KitComponent): THREE.Mesh {
  const shape: Shape = idShape[item.id] ?? categoryShape[item.category];
  const color: number = idColor[item.id] ?? categoryColor[item.category];

  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.25 });
  let geom: THREE.BufferGeometry;

  switch (shape) {
    case "cylinder": geom = new THREE.CylinderGeometry(0.55, 0.55, 1.5, 32); break;
    case "sphere":   geom = new THREE.SphereGeometry(0.9, 32, 32); break;
    case "torus":    geom = new THREE.TorusGeometry(0.8, 0.28, 16, 48); break;
    case "pillar":   geom = new THREE.BoxGeometry(0.4, 2.0, 0.4); break;
    case "flatbox":  geom = new THREE.BoxGeometry(1.8, 0.3, 1.2); break;
    default:         geom = new THREE.BoxGeometry(1.4, 1.4, 1.4);
  }

  return new THREE.Mesh(geom, mat);
}

// ─── ModelCard ────────────────────────────────────────────────────────────────

interface CardProps {
  item: KitComponent;
  autoRotate: boolean;
}

const ModelCard = ({ item, autoRotate }: CardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef(autoRotate);
  const visibleRef = useRef(false);

  useEffect(() => { rotRef.current = autoRotate; }, [autoRotate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth || 200;
    const H = 160;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(3, 2, 3.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(5, 5, 5);
    scene.add(key);
    const fillColor = idColor[item.id] ?? categoryColor[item.category];
    const fill = new THREE.DirectionalLight(fillColor, 0.35);
    fill.position.set(-3, 3, -3);
    scene.add(fill);

    const mesh = buildMesh(item);
    scene.add(mesh);

    // drag-to-rotate
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      mesh.rotation.y += (e.clientX - lastX) * 0.01;
      mesh.rotation.x += (e.clientY - lastY) * 0.01;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    };

    const canvas = renderer.domElement;
    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    // only render + animate when in viewport
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(container);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!visibleRef.current) return;
      if (rotRef.current && !dragging) mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / H;
      camera.updateProjectionMatrix();
      renderer.setSize(w, H);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      renderer.dispose();
      canvas.parentNode?.removeChild(canvas);
    };
  }, [item]);

  const catStyle = categoryStyle[item.category];

  return (
    <div className="rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all p-3 group">
      <div
        ref={containerRef}
        className="w-full h-[160px] rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 mb-3 overflow-hidden"
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
        <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full border ${catStyle}`}>
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
