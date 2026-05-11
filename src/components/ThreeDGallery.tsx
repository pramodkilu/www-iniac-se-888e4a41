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

/** Square black logic-block tile + coloured top indicator + side connector ports */
function buildLogicBlock(accent: number): THREE.Group {
  const g = new THREE.Group();
  // Main dark body
  g.add(mk(new THREE.BoxGeometry(1.35, 0.7, 1.35), 0x1f2937));
  // Coloured accent top panel
  g.add(at(mk(new THREE.BoxGeometry(0.9, 0.07, 0.9), accent, 0.05, 0.75), 0, 0.38, 0));
  // Silver connector port left side
  const port = mk(new THREE.CylinderGeometry(0.13, 0.13, 0.24, 12), 0x9ca3af, 0.6, 0.3);
  g.add(at(port, -0.8, 0, 0, 0, 0, Math.PI / 2));
  // Silver connector port right side
  const port2 = mk(new THREE.CylinderGeometry(0.13, 0.13, 0.24, 12), 0x9ca3af, 0.6, 0.3);
  g.add(at(port2, 0.8, 0, 0, 0, 0, Math.PI / 2));
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

/** Wheel with tyre: black rubber torus + orange spoked hub */
function buildWheel(withTyre = true): THREE.Group {
  const g = new THREE.Group();
  if (withTyre) {
    g.add(mk(new THREE.TorusGeometry(0.85, 0.32, 16, 32), 0x111111, 0.05, 0.9));
  }
  // Orange spoked hub
  const hub = mk(new THREE.CylinderGeometry(withTyre ? 0.42 : 0.82, withTyre ? 0.42 : 0.82, 0.28, 20), 0xf97316);
  g.add(at(hub, 0, 0, 0, Math.PI / 2));
  // 5 spokes
  for (let i = 0; i < 5; i++) {
    const spoke = mk(new THREE.BoxGeometry(withTyre ? 0.72 : 1.4, 0.07, 0.12), 0xf97316);
    spoke.rotation.set(Math.PI / 2, (i / 5) * Math.PI * 2, 0);
    g.add(spoke);
  }
  // Axle hole (dark centre)
  const axle = mk(new THREE.CylinderGeometry(0.09, 0.09, 0.34, 10), 0x374151, 0.6, 0.3);
  g.add(at(axle, 0, 0, 0, Math.PI / 2));
  return g;
}

/** Gear: flat disc + tooth bumps around edge + cross hub */
function buildGear(color: number, large: boolean): THREE.Group {
  const g = new THREE.Group();
  const r = large ? 0.98 : 0.65;
  const thickness = large ? 0.26 : 0.22;
  const toothCount = large ? 28 : 16;
  // Main disc body
  const disc = mk(new THREE.CylinderGeometry(r, r, thickness, large ? 60 : 32), color);
  g.add(at(disc, 0, 0, 0, Math.PI / 2));
  // Teeth around the rim
  for (let i = 0; i < toothCount; i++) {
    const angle = (i / toothCount) * Math.PI * 2;
    const tooth = mk(new THREE.BoxGeometry(0.12, thickness + 0.02, 0.14), color);
    tooth.position.set(Math.cos(angle) * (r + 0.07), 0, Math.sin(angle) * (r + 0.07));
    tooth.rotation.y = angle;
    g.add(tooth);
  }
  // Cross/plus hub in centre
  const hubR = r * 0.22;
  const hub = mk(new THREE.CylinderGeometry(hubR, hubR, thickness + 0.04, 12), color);
  g.add(at(hub, 0, 0, 0, Math.PI / 2));
  // Plus cross slots (darker)
  [0, Math.PI / 2].forEach(angle => {
    const slot = mk(new THREE.BoxGeometry(r * 0.55, thickness + 0.06, r * 0.14), 0x000000, 0, 1.0);
    slot.rotation.y = angle; slot.position.set(0, 0, 0);
    g.add(slot);
  });
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

/** DC motor: GREEN cylinder body + shaft + red/black wire stubs */
function buildMotor(_color: number): THREE.Group {
  const g = new THREE.Group();
  // Green body (matches real Blix motor)
  g.add(mk(new THREE.CylinderGeometry(0.5, 0.5, 1.15, 20), 0x16a34a, 0.15, 0.6));
  // Silver shaft on top
  g.add(at(mk(new THREE.CylinderGeometry(0.09, 0.09, 0.5, 10), 0x9ca3af, 0.7, 0.25), 0, 0.82, 0));
  // Red wire
  const rw = mk(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 6), 0xef4444, 0.1, 0.9);
  g.add(at(rw, 0.22, -0.82, 0));
  // Black wire
  const bw = mk(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 6), 0x111111, 0.1, 0.9);
  g.add(at(bw, -0.22, -0.82, 0));
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

/** CT2: T-shaped connector with cylindrical through-bore */
function buildConnector(color: number): THREE.Group {
  const g = new THREE.Group();
  // Horizontal arm of T
  g.add(mk(new THREE.BoxGeometry(1.1, 0.42, 0.44), color));
  // Vertical stem of T
  g.add(at(mk(new THREE.BoxGeometry(0.42, 0.62, 0.44), color), 0, -0.48, 0));
  // Cylindrical through-bore on horizontal arm
  const bore = mk(new THREE.CylinderGeometry(0.13, 0.13, 1.15, 12), 0x5a3d00, 0.05, 1.0);
  g.add(at(bore, 0, 0, 0, 0, 0, Math.PI / 2));
  return g;
}

/** CH2: Blue Y/T connector with round port on top */
function buildCH2(): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.BoxGeometry(0.55, 0.55, 0.55), 0x60a5fa));
  // Round barrel port on top
  const port = mk(new THREE.CylinderGeometry(0.18, 0.18, 0.32, 12), 0x3b82f6, 0.2, 0.7);
  g.add(at(port, 0, 0.44, 0));
  // Through-bore inside port
  const bore = mk(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 10), 0x1e3a5f, 0.05, 1.0);
  g.add(at(bore, 0, 0.44, 0));
  // Side pin
  const pin = mk(new THREE.CylinderGeometry(0.07, 0.07, 0.22, 8), 0x93c5fd, 0.4, 0.4);
  g.add(at(pin, 0.38, 0, 0, 0, 0, Math.PI / 2));
  return g;
}

/** CL2: flat yellow double-tab clip connector */
function buildCL2(): THREE.Group {
  const g = new THREE.Group();
  // Two flat rectangular tabs side by side
  g.add(at(mk(new THREE.BoxGeometry(0.48, 0.22, 0.44), 0xfbbf24), -0.26, 0, 0));
  g.add(at(mk(new THREE.BoxGeometry(0.48, 0.22, 0.44), 0xfbbf24),  0.26, 0, 0));
  // Connecting bridge
  g.add(mk(new THREE.BoxGeometry(1.06, 0.15, 0.44), 0xfbbf24));
  // Through-holes on each tab
  [-0.26, 0.26].forEach(x => {
    const bore = mk(new THREE.CylinderGeometry(0.1, 0.1, 0.48, 10), 0x5a3d00, 0.05, 1.0);
    g.add(at(bore, x, 0, 0, 0, 0, Math.PI / 2));
  });
  return g;
}

/** TW1: short solid BLACK cylinder (axle sleeve bearing — NOT a ring) */
function buildWasher(): THREE.Group {
  const g = new THREE.Group();
  // Solid short cylinder, dark black, matches real TW1 photo
  g.add(mk(new THREE.CylinderGeometry(0.38, 0.38, 0.46, 16), 0x111111, 0.2, 0.8));
  // Thin axle bore (slightly lighter inner hole suggestion)
  g.add(mk(new THREE.CylinderGeometry(0.14, 0.14, 0.5, 10), 0x374151, 0.1, 1.0));
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

/** Queaky: yellow flat rectangle + face + two silver metal ear tabs */
function buildQueaky(): THREE.Group {
  const g = new THREE.Group();
  // Yellow body — wider than tall
  g.add(mk(new THREE.BoxGeometry(1.8, 0.55, 0.9), 0xfde047, 0.05, 0.8));
  // Silver left ear tab
  g.add(at(mk(new THREE.BoxGeometry(0.28, 0.12, 0.3), 0x9ca3af, 0.6, 0.3), -1.04, 0.1, 0));
  // Silver right ear tab
  g.add(at(mk(new THREE.BoxGeometry(0.28, 0.12, 0.3), 0x9ca3af, 0.6, 0.3),  1.04, 0.1, 0));
  // Left eye (white circle + dark pupil)
  g.add(at(mk(new THREE.CylinderGeometry(0.14, 0.14, 0.06, 16), 0xffffff, 0, 1.0), -0.38, 0.3, 0.46));
  g.add(at(mk(new THREE.CylinderGeometry(0.07, 0.07, 0.07, 12), 0x111111, 0, 1.0), -0.38, 0.3, 0.47));
  // Right eye
  g.add(at(mk(new THREE.CylinderGeometry(0.14, 0.14, 0.06, 16), 0xffffff, 0, 1.0), 0.38, 0.3, 0.46));
  g.add(at(mk(new THREE.CylinderGeometry(0.07, 0.07, 0.07, 12), 0x111111, 0, 1.0), 0.38, 0.3, 0.47));
  return g;
}

/** Connecting Tower: thin clear cylinder + black multi-pronged head */
function buildConnectingTower(): THREE.Group {
  const g = new THREE.Group();
  // Clear/white cylindrical base
  g.add(mk(new THREE.CylinderGeometry(0.1, 0.12, 1.1, 10), 0xe5e7eb, 0.05, 0.6));
  // Black head body
  g.add(at(mk(new THREE.CylinderGeometry(0.22, 0.22, 0.28, 10), 0x111111, 0.3, 0.7), 0, 0.69, 0));
  // 4 prongs radiating from head
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const prong = mk(new THREE.BoxGeometry(0.44, 0.1, 0.1), 0x111111, 0.3, 0.7);
    prong.position.set(Math.cos(a) * 0.24, 0.69, Math.sin(a) * 0.24);
    prong.rotation.y = a;
    g.add(prong);
  }
  return g;
}

/** Rainbow Disk: flat circle divided into 6 coloured pie segments */
function buildRainbowDisk(): THREE.Group {
  const g = new THREE.Group();
  const colours = [0xef4444, 0xf97316, 0xfde047, 0x22c55e, 0x3b82f6, 0x8b5cf6];
  colours.forEach((col, i) => {
    const seg = mk(
      new THREE.CylinderGeometry(0.9, 0.9, 0.1, 32, 1, false, (i / colours.length) * Math.PI * 2, Math.PI * 2 / colours.length),
      col, 0.05, 0.75
    );
    g.add(seg);
  });
  // White centre dot
  g.add(mk(new THREE.CylinderGeometry(0.12, 0.12, 0.12, 12), 0xffffff, 0, 1.0));
  return g;
}

/** Pulley: BLUE bobbin/spool with flanged edges and groove */
function buildPulley(): THREE.Group {
  const g = new THREE.Group();
  // Central groove (narrow)
  g.add(mk(new THREE.CylinderGeometry(0.45, 0.45, 0.38, 20), 0x2563eb, 0.15, 0.6));
  // Left flange
  g.add(at(mk(new THREE.CylinderGeometry(0.72, 0.72, 0.14, 24), 0x3b82f6, 0.1, 0.7), 0, 0.26, 0));
  // Right flange
  g.add(at(mk(new THREE.CylinderGeometry(0.72, 0.72, 0.14, 24), 0x3b82f6, 0.1, 0.7), 0, -0.26, 0));
  // Axle bore
  g.add(mk(new THREE.CylinderGeometry(0.13, 0.13, 0.7, 10), 0x1e3a5f, 0.1, 1.0));
  return g;
}

/** Suspension: black rod with yellow spring coil and black end cap */
function buildSuspension(): THREE.Group {
  const g = new THREE.Group();
  // Dark rod through centre
  g.add(mk(new THREE.CylinderGeometry(0.07, 0.07, 2.1, 10), 0x111111, 0.5, 0.5));
  // Yellow spring coil
  for (let i = 0; i < 7; i++) {
    const ring = mk(new THREE.TorusGeometry(0.28, 0.06, 8, 16), 0xfbbf24, 0.1, 0.8);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.6 + i * 0.2;
    g.add(ring);
  }
  // Black end cap top
  g.add(at(mk(new THREE.CylinderGeometry(0.2, 0.2, 0.18, 12), 0x1f2937, 0.3, 0.7), 0, 1.0, 0));
  // Orange ring end bottom
  g.add(at(mk(new THREE.TorusGeometry(0.22, 0.08, 8, 16), 0xf97316, 0.1, 0.7), 0, -1.0, 0, Math.PI / 2, 0, 0));
  return g;
}

/** MRS14 marble chute: BLUE U-channel slide */
function buildMarbleChute(): THREE.Group {
  const g = new THREE.Group();
  // Channel floor
  g.add(mk(new THREE.BoxGeometry(1.9, 0.1, 0.5), 0x3b82f6));
  // Left wall
  g.add(at(mk(new THREE.BoxGeometry(1.9, 0.28, 0.1), 0x2563eb), 0, 0.19, 0.3));
  // Right wall
  g.add(at(mk(new THREE.BoxGeometry(1.9, 0.28, 0.1), 0x2563eb), 0, 0.19, -0.3));
  // Small clip tabs on underside
  [-0.6, 0.6].forEach(x => {
    g.add(at(mk(new THREE.BoxGeometry(0.14, 0.2, 0.1), 0x1d4ed8), x, -0.15, 0));
  });
  return g;
}

/** Push Button: red base + black dome + blue wires */
function buildPushButton(): THREE.Group {
  const g = new THREE.Group();
  // Red base
  g.add(mk(new THREE.BoxGeometry(1.1, 0.28, 0.65), 0xef4444));
  // Black button dome on top
  g.add(at(mk(new THREE.CylinderGeometry(0.16, 0.18, 0.22, 12), 0x111111, 0.3, 0.7), 0, 0.25, 0));
  // Blue wire left
  const lw = mk(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 6), 0x3b82f6, 0.1, 0.9);
  g.add(at(lw, -0.9, 0, 0, 0, 0, Math.PI / 2));
  // Blue wire right
  const rw = mk(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 6), 0x3b82f6, 0.1, 0.9);
  g.add(at(rw, 0.9, 0, 0, 0, 0, Math.PI / 2));
  return g;
}

/** LED: small cylindrical bullet lens + two wire legs */
function buildLED(color: number): THREE.Group {
  const g = new THREE.Group();
  // Domed top (bullet lens)
  g.add(at(mk(new THREE.SphereGeometry(0.25, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), color, 0.05, 0.1), 0, 0.25, 0));
  // Cylinder body
  g.add(mk(new THREE.CylinderGeometry(0.25, 0.25, 0.35, 12), color, 0.1, 0.8));
  // Two wire legs
  [-0.1, 0.1].forEach(x => {
    g.add(at(mk(new THREE.CylinderGeometry(0.03, 0.03, 0.65, 6), 0x9ca3af, 0.6, 0.3), x, -0.5, 0));
  });
  return g;
}

/** Resistor: small cylindrical body with colour bands + two wire leads */
function buildResistor(band1: number, band2: number): THREE.Group {
  const g = new THREE.Group();
  // Beige body
  g.add(mk(new THREE.CylinderGeometry(0.18, 0.18, 0.65, 12), 0xd4b483, 0.05, 0.8));
  // Colour bands
  [[band1, -0.12], [band2, 0.06], [0xd4a520, 0.22]].forEach(([col, y]) => {
    const band = mk(new THREE.CylinderGeometry(0.19, 0.19, 0.08, 12), col as number, 0, 1.0);
    g.add(at(band, 0, y as number, 0));
  });
  // Wire leads
  [-1, 1].forEach(s => {
    g.add(at(mk(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 6), 0x9ca3af, 0.6, 0.3), 0, s * 0.6, 0));
  });
  return g;
}

/** Capacitor: silver/blue cylindrical can with stripe */
function buildCapacitor(): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.CylinderGeometry(0.28, 0.28, 0.75, 16), 0x6b7280, 0.5, 0.4));
  // Stripe on side
  g.add(at(mk(new THREE.CylinderGeometry(0.285, 0.285, 0.18, 16, 1, true), 0xe5e7eb, 0, 0.9), 0, 0.2, 0));
  // Two leads
  [-0.09, 0.09].forEach(x => {
    g.add(at(mk(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 6), 0x9ca3af, 0.6, 0.3), x, -0.65, 0));
  });
  return g;
}

/** LDR: flat disc with zigzag serpentine pattern */
function buildLDR(): THREE.Group {
  const g = new THREE.Group();
  // Clear/white flat disc body
  g.add(mk(new THREE.CylinderGeometry(0.42, 0.42, 0.1, 16), 0xe5e7eb, 0, 0.9));
  // Serpentine gold traces on top
  for (let i = 0; i < 4; i++) {
    const seg = mk(new THREE.BoxGeometry(0.06, 0.12, 0.52), 0xd4a520, 0, 0.9);
    seg.position.set(-0.24 + i * 0.16, 0.11, 0);
    g.add(seg);
  }
  // Two wire leads
  [-0.1, 0.1].forEach(x => {
    g.add(at(mk(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 6), 0x9ca3af, 0.6, 0.3), x, -0.32, 0));
  });
  return g;
}

/** Potentiometer: blue square body + round adjustment knob on top */
function buildPotentiometer(): THREE.Group {
  const g = new THREE.Group();
  g.add(mk(new THREE.BoxGeometry(0.75, 0.55, 0.75), 0x1e3a5f, 0.2, 0.7));
  // Rotary knob
  g.add(at(mk(new THREE.CylinderGeometry(0.22, 0.24, 0.28, 14), 0x374151, 0.4, 0.6), 0, 0.415, 0));
  // Indicator line on knob
  g.add(at(mk(new THREE.BoxGeometry(0.05, 0.3, 0.04), 0xe5e7eb, 0, 1.0), 0, 0.43, 0.18));
  // Three wire leads
  [-0.22, 0, 0.22].forEach(x => {
    g.add(at(mk(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 6), 0x9ca3af, 0.6, 0.3), x, -0.55, 0));
  });
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
    // ── Logic blocks (colour-coded) ────────────────────────────────────────────
    case "power-block":    return buildLogicBlock(0xfde047); // yellow
    case "not-block":      return buildLogicBlock(0xf97316); // orange
    case "led-block":      return buildLogicBlock(0xef4444); // red
    case "buzzer-block":   return buildLogicBlock(0x22c55e); // green
    case "motor-block":    return buildLogicBlock(0x3b82f6); // blue
    case "distance-block": return buildLogicBlock(0xa855f7); // purple
    case "ir-block":       return buildLogicBlock(0xec4899); // pink
    case "switch-block":   return buildLogicBlock(0xe5e7eb); // white

    // ── ICs ───────────────────────────────────────────────────────────────────
    case "ic-555": case "ic-7408": case "ic-7432": case "ic-7404":
    case "ic-7400": case "ic-7402": case "ic-7486": case "ic-7426":
    case "ic-74151": case "ic-74138": return buildIC();

    // ── PCBs ──────────────────────────────────────────────────────────────────
    case "pcb-7segment": case "pcb-peripheral":
    case "pcb-switch": case "pcb-ic-holder": return buildPCB();

    // ── Boards ────────────────────────────────────────────────────────────────
    case "esp32":       return buildESP32();
    case "servo-motor": return buildServo();
    case "dc-motor-board": return buildMotor(0x16a34a);

    // ── Wheels ────────────────────────────────────────────────────────────────
    case "wheel":         return buildWheel(true);
    case "wheel-no-tyre": return buildWheel(false);

    // ── Gears ─────────────────────────────────────────────────────────────────
    case "g20":        return buildGear(0x60a5fa, false);
    case "g20-plus":   return buildGear(0x3b82f6, false);
    case "g20-idler":  return buildGear(0x93c5fd, false);
    case "g60":        return buildGear(0xfbbf24, true);
    case "rack":       return buildRack(0xfbbf24);

    // ── Structural pillars ────────────────────────────────────────────────────
    case "p3": case "p3-marble": return buildPillar(0xfde047, 3);
    case "p3-plus":  return buildPillar(0xfbbf24, 3);
    case "p5":       return buildPillar(0xfbbf24, 5);
    case "p7":       return buildPillar(0xfbbf24, 7);
    case "p11":      return buildPillar(0xf59e0b, 11);
    case "pu5x13":   return buildUPillar(0xfbbf24);
    case "pu5x7":    return buildUPillar(0xfbbf24);

    // ── Base plates ───────────────────────────────────────────────────────────
    case "p21x21":      return buildBasePlate(0xa3a3a3, true);
    case "p21x21-box3": return buildBasePlate(0x4ade80, true);
    case "p7x11":       return buildBasePlate(0xd1d5db, false); // grey, matches photo
    case "p7x11-box3":  return buildBasePlate(0x4ade80, false); // green box3 variant

    // ── Connectors ────────────────────────────────────────────────────────────
    case "ct2":              return buildConnector(0xf97316); // orange
    case "ct3":              return buildConnector(0xf97316); // orange chunky
    case "ct1x2":
    case "ct1x2-marble":     return buildConnector(0x3b82f6); // blue
    case "ch2":              return buildCH2();
    case "cl2":              return buildCL2();

    // ── Washers / axle sleeves ────────────────────────────────────────────────
    case "tw1":  return buildWasher();          // short black cylinder
    case "tw2":  return buildWasher();

    // ── Shafts ────────────────────────────────────────────────────────────────
    case "sh60":  return buildShaft(0.9);
    case "sh100": return buildShaft(1.35);
    case "sh170": return buildShaft(1.95);

    // ── Motors & batteries ────────────────────────────────────────────────────
    case "motor": case "motor-acc": return buildMotor(0x16a34a); // green
    case "battery-box":  return buildBatteryBox(0x374151); // dark box
    case "battery-3v":   return buildBatteryBox(0xef4444); // red
    case "battery-6v":   return buildBatteryBox(0xdc2626); // deep red

    // ── Mechanical ────────────────────────────────────────────────────────────
    case "pulley":     return buildPulley();
    case "suspension": return buildSuspension();

    // ── Marble stem ───────────────────────────────────────────────────────────
    case "mrs14":             return buildMarbleChute();
    case "mrb7": case "mrh5": return buildMarble(0x60a5fa);
    case "marbles":           return buildMarble(0x93c5fd);
    case "bucket":            return buildMarble(0xf97316); // orange bucket
    case "p3c2-marble":       return buildPillar(0xf97316, 3);

    // ── Electronics ───────────────────────────────────────────────────────────
    case "queaky":          return buildQueaky();
    case "connecting-tower":return buildConnectingTower();
    case "rainbow-disk":    return buildRainbowDisk();
    case "push-button":     return buildPushButton();
    case "led-green":       return buildLED(0x22c55e);
    case "led-red":
    case "led-boffin":      return buildLED(0xef4444);
    case "capacitor":       return buildCapacitor();
    case "resistor-10k":    return buildResistor(0x4b0082, 0x111111);
    case "resistor-20k":    return buildResistor(0xef4444, 0x111111);
    case "resistor-3k3":    return buildResistor(0xf97316, 0x111111);
    case "potentiometer":   return buildPotentiometer();
    case "ldr":             return buildLDR();
    case "buzzer":          return buildBox(0x111111);
    case "slide-switch":    return buildBox(0x374151);
    case "ir-sensor":       return buildPCB();
    case "limit-switch":    return buildBox(0x374151);

    // ── Magnets ───────────────────────────────────────────────────────────────
    case "donut-magnet": return buildDonutMagnet();
    case "bar-magnet":   return buildBarMagnet();

    // ── Consumables / stationery ──────────────────────────────────────────────
    case "rubber-band": case "rubber-band-acc": return buildRubberBand();
    case "pencil":        return buildPencil();
    case "fan":           return buildFan();
    case "balloon":       return buildMarble(0xef4444);

    // ── Wiring ────────────────────────────────────────────────────────────────
    case "alligator-red":   return buildWire(0xef4444);
    case "alligator-black": return buildWire(0x111111);
    case "jumper-wire":     return buildWire(0x3b82f6);
    case "connecting-wire": return buildWire(0x9ca3af);
    case "ir-relimate":
    case "core-cable-4":
    case "programming-cable": return buildWire(0x374151);
  }

  // ── Category fallback ─────────────────────────────────────────────────────
  const col = categoryColor[item.category];
  switch (item.category) {
    case "logic-block":    return buildLogicBlock(col);
    case "ic":             return buildIC();
    case "pcb":            return buildPCB();
    case "wheel-tyre":     return buildWheel(true);
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
    case "sensor":         return buildPCB();
    default:               return buildBox(col);
  }
}

// ─── ModelCard ────────────────────────────────────────────────────────────────
// Uses ONE shared offscreen WebGL renderer to produce a static PNG thumbnail per
// card. Avoids browser WebGL context cap (~16) entirely.

const CANVAS_H = 160;
const THUMB_W = 320;
const THUMB_H = CANVAS_H * 2;

let sharedRenderer: THREE.WebGLRenderer | null = null;
let sharedScene: THREE.Scene | null = null;
let sharedCamera: THREE.PerspectiveCamera | null = null;

function getSharedRenderer(): { renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera } | null {
  if (sharedRenderer && sharedScene && sharedCamera) {
    return { renderer: sharedRenderer, scene: sharedScene, camera: sharedCamera };
  }
  try {
    sharedRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  } catch {
    return null;
  }
  sharedRenderer.setPixelRatio(1);
  sharedRenderer.setSize(THUMB_W, THUMB_H);

  sharedScene = new THREE.Scene();
  sharedScene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(5, 6, 5);
  sharedScene.add(key);
  const fill = new THREE.DirectionalLight(0x8888ff, 0.35);
  fill.position.set(-4, 2, -4);
  sharedScene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.3);
  rim.position.set(0, -4, -4);
  sharedScene.add(rim);

  sharedCamera = new THREE.PerspectiveCamera(48, THUMB_W / THUMB_H, 0.1, 100);
  sharedCamera.position.set(2.8, 1.8, 3.2);
  sharedCamera.lookAt(0, 0, 0);

  return { renderer: sharedRenderer, scene: sharedScene, camera: sharedCamera };
}

const thumbCache = new Map<string, string>();

function renderThumbnail(item: KitComponent): string | null {
  if (thumbCache.has(item.id)) return thumbCache.get(item.id)!;
  const ctx = getSharedRenderer();
  if (!ctx) return null;
  const { renderer, scene, camera } = ctx;
  const obj = buildObject(item);
  scene.add(obj);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/png");
  scene.remove(obj);
  disposeObject(obj);
  thumbCache.set(item.id, url);
  return url;
}

interface CardProps {
  item: KitComponent;
  autoRotate: boolean;
}

const ModelCard = ({ item }: CardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    let rendered = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !rendered) {
          const url = renderThumbnail(item);
          if (url) {
            img.src = url;
            rendered = true;
          }
        }
      },
      { threshold: 0, rootMargin: "200px" }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [item]);

  return (
    <div className="rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all p-3">
      <div
        ref={containerRef}
        className="w-full h-[160px] rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 mb-3 overflow-hidden flex items-center justify-center"
      >
        <img ref={imgRef} alt={item.name} className="w-full h-full object-contain" />
      </div>
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
