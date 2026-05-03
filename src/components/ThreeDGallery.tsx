import { useEffect, useRef } from "react";
import * as THREE from "three";

interface GalleryItem {
  id: string;
  name: string;
  color: number;
  shape: "box" | "cylinder" | "sphere" | "torus" | "cone" | "pillar";
}

interface BoxGroup {
  title: string;
  accent: string; // tailwind text color class
  items: GalleryItem[];
}

const BOXES: BoxGroup[] = [
  {
    title: "Box 1 · Logic Blocks & Electronics",
    accent: "text-blue-500",
    items: [
      { id: "power-block", name: "Power Block", color: 0x3b82f6, shape: "box" },
      { id: "not-block", name: "Not Block", color: 0x8b5cf6, shape: "box" },
      { id: "led-block", name: "LED Block", color: 0xef4444, shape: "box" },
      { id: "buzzer-block", name: "Buzzer Block", color: 0xf59e0b, shape: "cylinder" },
      { id: "motor-block", name: "Motor Block", color: 0x10b981, shape: "box" },
      { id: "distance-block", name: "Distance Block", color: 0x06b6d4, shape: "box" },
      { id: "ir-block", name: "IR Block", color: 0x6366f1, shape: "box" },
      { id: "switch-block", name: "Switch Block", color: 0x84cc16, shape: "box" },
    ],
  },
  {
    title: "Box 2 · Marble Stem",
    accent: "text-sky-500",
    items: [
      { id: "marbles", name: "Marbles", color: 0x3b82f6, shape: "sphere" },
      { id: "p3-marble", name: "P3 Pillar", color: 0xfbbf24, shape: "pillar" },
      { id: "mrs14", name: "MRS14 Chute", color: 0xfcd34d, shape: "box" },
      { id: "mrb7", name: "MRB7 Curved", color: 0xfde047, shape: "torus" },
      { id: "bucket", name: "Bucket", color: 0xfbbf24, shape: "cone" },
    ],
  },
  {
    title: "Box 3 · ICs & Boffin",
    accent: "text-violet-500",
    items: [
      { id: "ic-555", name: "IC 555 Timer", color: 0x1f2937, shape: "box" },
      { id: "ic-7408", name: "IC 7408 AND", color: 0x1f2937, shape: "box" },
      { id: "esp32", name: "ESP32 Board", color: 0x374151, shape: "box" },
      { id: "ir-sensor", name: "IR Sensor", color: 0x4b5563, shape: "cylinder" },
      { id: "servo-motor", name: "Servo Motor", color: 0x111827, shape: "box" },
    ],
  },
  {
    title: "Box 4 · Plastic Construction",
    accent: "text-emerald-500",
    items: [
      { id: "p3", name: "P3 Pillar (3-hole)", color: 0xfbbf24, shape: "pillar" },
      { id: "p5", name: "P5 Pillar (5-hole)", color: 0xfbbf24, shape: "pillar" },
      { id: "p7", name: "P7 Pillar (7-hole)", color: 0xfbbf24, shape: "pillar" },
      { id: "p11", name: "P11 Pillar (11-hole)", color: 0xf59e0b, shape: "pillar" },
      { id: "g20", name: "G20 Gear", color: 0x60a5fa, shape: "torus" },
      { id: "g60", name: "G60 Gear", color: 0xfbbf24, shape: "torus" },
      { id: "wheel", name: "Wheel", color: 0x1f2937, shape: "torus" },
      { id: "suspension", name: "Suspension", color: 0xfbbf24, shape: "cylinder" },
    ],
  },
  {
    title: "Box 5 · Accessories",
    accent: "text-orange-500",
    items: [
      { id: "pencil", name: "Pencil", color: 0xfde047, shape: "cylinder" },
      { id: "eraser", name: "Eraser", color: 0xf472b6, shape: "box" },
      { id: "scissor", name: "Scissors", color: 0x6b7280, shape: "box" },
      { id: "bar-magnet", name: "Bar Magnet", color: 0x6b7280, shape: "box" },
    ],
  },
  {
    title: "Box 6 · Big Construction Parts",
    accent: "text-emerald-600",
    items: [
      { id: "p21x21", name: "P21x21 Base Plate", color: 0xa3a3a3, shape: "box" },
      { id: "p7x11", name: "P7x11 Base Plate", color: 0xa3a3a3, shape: "box" },
      { id: "wheel-big", name: "Big Wheel", color: 0x1f2937, shape: "torus" },
    ],
  },
];

function buildMesh(item: GalleryItem) {
  const mat = new THREE.MeshStandardMaterial({
    color: item.color,
    roughness: 0.4,
    metalness: 0.2,
  });
  let geom: THREE.BufferGeometry;
  switch (item.shape) {
    case "cylinder":
      geom = new THREE.CylinderGeometry(0.6, 0.6, 1.6, 32);
      break;
    case "sphere":
      geom = new THREE.SphereGeometry(0.9, 32, 32);
      break;
    case "torus":
      geom = new THREE.TorusGeometry(0.8, 0.28, 16, 48);
      break;
    case "cone":
      geom = new THREE.ConeGeometry(0.8, 1.4, 32);
      break;
    case "pillar":
      geom = new THREE.BoxGeometry(0.4, 2, 0.4);
      break;
    default:
      geom = new THREE.BoxGeometry(1.4, 1.4, 1.4);
  }
  const mesh = new THREE.Mesh(geom, mat);
  return mesh;
}

interface CardProps {
  item: GalleryItem;
  autoRotate: boolean;
}

const ModelCard = ({ item, autoRotate }: CardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef(autoRotate);

  useEffect(() => {
    rotRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(3, 2.5, 3.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1);
    key.position.set(5, 5, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(item.color, 0.4);
    fill.position.set(-3, 3, -3);
    scene.add(fill);

    const mesh = buildMesh(item);
    scene.add(mesh);

    let frame = 0;
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
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      mesh.rotation.y += dx * 0.01;
      mesh.rotation.x += dy * 0.01;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const canvas = renderer.domElement;
    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (rotRef.current && !dragging) {
        mesh.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [item]);

  return (
    <div className="rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all p-4 group">
      <div
        ref={containerRef}
        className="w-full h-[200px] rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 mb-3 overflow-hidden"
      />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-foreground text-sm truncate">{item.name}</div>
          <div className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">
            {item.id}
          </div>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium whitespace-nowrap">
          3D
        </span>
      </div>
    </div>
  );
};

interface ThreeDGalleryProps {
  autoRotate: boolean;
}

const ThreeDGallery = ({ autoRotate }: ThreeDGalleryProps) => {
  return (
    <div className="space-y-12">
      {BOXES.map((box) => (
        <section key={box.title}>
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border">
            <h3 className={`text-xl font-bold ${box.accent}`}>{box.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {box.items.length} models
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {box.items.map((item) => (
              <ModelCard key={`${box.title}-${item.id}`} item={item} autoRotate={autoRotate} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ThreeDGallery;
