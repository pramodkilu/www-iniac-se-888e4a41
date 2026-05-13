import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as THREE from "three";
import { Loader2, Smartphone, Maximize2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { buildFinalAssembly } from "@/components/BuildGuide";

// model-viewer is loaded via CDN to avoid Three.js version conflicts.
// The script is injected once and the custom element registers itself.
function loadModelViewer() {
  const id = "model-viewer-script";
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.type = "module";
  s.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
  document.head.appendChild(s);
}

interface ARPose {
  matrix: number[];
  savedAt: string;
}

interface ARViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  chapterId?: number;
  modelUrl?: string | null;
  savedPose?: ARPose | null;
  onSavePose?: (matrix: number[]) => void;
  onClearPose?: () => void;
}

// ── Reticle ring geometry used in WebXR hit-test ───────────────────────────────
function makeReticle() {
  const mesh = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0xff6b35, side: THREE.DoubleSide }),
  );
  mesh.matrixAutoUpdate = false;
  mesh.visible = false;
  return mesh;
}

const ARViewer = ({
  open, onOpenChange, title, chapterId = 1, modelUrl,
  savedPose, onSavePose, onClearPose,
}: ARViewerProps) => {
  const mountRef   = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef    = useRef<THREE.Scene | null>(null);
  const cameraRef   = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef    = useRef<THREE.Group | null>(null);
  const frameRef    = useRef<number>(0);
  const cleanupRef  = useRef<() => void>(() => {});

  // Orbit state
  const drag = useRef({ active: false, x: 0, y: 0, rotX: 0.3, rotY: 0.5, dist: 5 });

  const [xrSupported, setXrSupported] = useState<boolean | null>(null);
  const [xrRunning,   setXrRunning]   = useState(false);
  const [autoRotate,  setAutoRotate]  = useState(true);

  // ── Build / tear down the Three.js preview scene ──────────────────────────────
  useEffect(() => {
    if (!open) {
      cancelAnimationFrame(frameRef.current);
      cleanupRef.current();
      cleanupRef.current = () => {};
      rendererRef.current?.dispose();
      rendererRef.current = null;
      return;
    }

    loadModelViewer();

    // Defer one tick so the Dialog finishes painting — without this,
    // mountRef.current.clientWidth is 0 and the canvas renders invisible.
    let cancelled = false;
    const timerId = setTimeout(() => {
      if (cancelled) return;
      const container = mountRef.current;
      if (!container) return;

      const W = container.clientWidth  || 560;
      const H = container.clientHeight || 340;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);
      sceneRef.current = scene;

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const sun = new THREE.DirectionalLight(0xffffff, 1.2);
      sun.position.set(4, 8, 4); scene.add(sun);
      const fill = new THREE.DirectionalLight(0x7dd3fc, 0.4);
      fill.position.set(-4, 2, -4); scene.add(fill);

      const grid = new THREE.GridHelper(8, 16, 0x334155, 0x1e293b);
      grid.position.y = -2; scene.add(grid);

      // Chapter model — centred and scaled to fit viewport
      const model = buildFinalAssembly(chapterId);
      const bbox  = new THREE.Box3().setFromObject(model);
      const centre = bbox.getCenter(new THREE.Vector3());
      const size   = bbox.getSize(new THREE.Vector3()).length();
      model.position.sub(centre);
      model.scale.setScalar(3 / Math.max(size, 0.01));
      scene.add(model);
      modelRef.current = model;

      // Camera
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.01, 100);
      camera.position.set(0, 1.5, drag.current.dist);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Animation loop
      let rotY = drag.current.rotY;
      const animate = () => {
        frameRef.current = requestAnimationFrame(animate);
        if (autoRotate && !drag.current.active) {
          rotY += 0.004;
          model.rotation.y = rotY;
          drag.current.rotY = rotY;
        } else {
          model.rotation.x = drag.current.rotX;
          model.rotation.y = drag.current.rotY;
          rotY = drag.current.rotY;
        }
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        const w2 = container.clientWidth;
        const h2 = container.clientHeight || 340;
        camera.aspect = w2 / h2;
        camera.updateProjectionMatrix();
        renderer.setSize(w2, h2);
      };
      window.addEventListener("resize", onResize);

      cleanupRef.current = () => {
        cancelAnimationFrame(frameRef.current);
        window.removeEventListener("resize", onResize);
        renderer.setAnimationLoop(null);
        renderer.dispose();
        if (renderer.domElement.parentNode)
          renderer.domElement.parentNode.removeChild(renderer.domElement);
      };

      // Check WebXR
      const nav = navigator as any;
      if (nav.xr?.isSessionSupported) {
        nav.xr.isSessionSupported("immersive-ar")
          .then((ok: boolean) => setXrSupported(ok))
          .catch(() => setXrSupported(false));
      } else {
        setXrSupported(false);
      }
    }, 50);

    return () => {
      cancelled = true;
      clearTimeout(timerId);
      cleanupRef.current();
      cleanupRef.current = () => {};
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, chapterId]);

  // ── Mouse / touch orbit ───────────────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current.active = true;
    drag.current.x = e.clientX;
    drag.current.y = e.clientY;
    setAutoRotate(false);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current.rotY += dx * 0.008;
    drag.current.rotX += dy * 0.008;
    drag.current.rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, drag.current.rotX));
    drag.current.x = e.clientX;
    drag.current.y = e.clientY;
  };
  const onPointerUp = () => { drag.current.active = false; };

  const onWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    drag.current.dist = Math.max(2, Math.min(12, drag.current.dist + e.deltaY * 0.01));
    cameraRef.current.position.setLength(drag.current.dist);
  };

  // ── WebXR session ─────────────────────────────────────────────────────────────
  const startXR = async () => {
    const renderer = rendererRef.current;
    const scene    = sceneRef.current;
    const model    = modelRef.current;
    if (!renderer || !scene || !model) return;
    try {
      renderer.xr.enabled = true;
      const session = await (navigator as any).xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test"],
      });
      renderer.xr.setReferenceSpaceType("local");
      await renderer.xr.setSession(session);

      const reticle = makeReticle();
      scene.add(reticle);

      let hitTestSource: any = null;
      const viewerSpace = await session.requestReferenceSpace("viewer");
      hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
      const refSpace = await session.requestReferenceSpace("local");

      model.visible = !!savedPose;

      const onSelect = () => {
        if (reticle.visible) {
          model.position.setFromMatrixPosition(reticle.matrix);
          model.visible = true;
          const arr = Array.from(reticle.matrix.elements) as number[];
          onSavePose?.(arr);
        }
      };
      session.addEventListener("select", onSelect);

      renderer.setAnimationLoop((_t: number, frame: any) => {
        if (frame && hitTestSource) {
          const hits = frame.getHitTestResults(hitTestSource);
          if (hits.length > 0) {
            const pose = hits[0].getPose(refSpace);
            if (pose) { reticle.visible = true; reticle.matrix.fromArray(pose.transform.matrix); }
          } else {
            reticle.visible = false;
          }
        }
        renderer.render(scene, cameraRef.current!);
      });

      setXrRunning(true);

      const endXR = () => {
        try { session.removeEventListener("select", onSelect); } catch {}
        try { session.end(); } catch {}
        renderer.setAnimationLoop(null);
        renderer.xr.enabled = false;
        scene.remove(reticle);
        model.visible = true;
        setXrRunning(false);
        onOpenChange(false);
      };
      session.addEventListener("end", endXR);
      cleanupRef.current = endXR;
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Couldn't start AR session");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-slate-900 border-slate-700">
        <DialogHeader className="px-5 pt-4 pb-2">
          <DialogTitle className="text-white text-base font-bold">
            3D Preview — {title}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Drag to rotate · Scroll to zoom · Tap "Enter AR" on a supported device to place in the real world
          </DialogDescription>
        </DialogHeader>

        {/* Viewer — model-viewer (GLB) when available, Three.js canvas otherwise */}
        {modelUrl ? (
          <div className="w-full bg-slate-950" style={{ height: 360 }}>
            <model-viewer
              src={modelUrl}
              alt={`3D model — ${title}`}
              camera-controls
              auto-rotate
              ar
              ar-modes="webxr scene-viewer quick-look"
              shadow-intensity="1"
              style={{ width: "100%", height: "100%", background: "transparent" }}
            />
          </div>
        ) : (
          /* Three.js procedural fallback — uses buildFinalAssembly() */
          <div
            ref={mountRef}
            className="w-full bg-slate-950 cursor-grab active:cursor-grabbing select-none"
            style={{ height: 340 }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onWheel={onWheel}
          />
        )}

        {/* Controls bar */}
        <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          {/* Left: AR status */}
          <div className="flex items-center gap-2">
            {/* model-viewer handles its own AR button — show note instead */}
            {modelUrl ? (
              <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-full px-3 py-1">
                <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs text-slate-300">
                  Tap the AR button inside the viewer on Android / iOS
                </span>
              </div>
            ) : (
              <>
                {xrSupported === null && (
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking AR support…
                  </span>
                )}
                {xrSupported === false && (
                  <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-full px-3 py-1">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400">
                      Full WebXR AR works on Android Chrome — preview above
                    </span>
                  </div>
                )}
                {xrSupported && !xrRunning && (
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-8" onClick={startXR}>
                    <Maximize2 className="w-3.5 h-3.5 mr-1.5" /> Enter AR
                  </Button>
                )}
                {xrRunning && (
                  <span className="text-xs text-green-400 font-semibold">AR running — tap a surface to place</span>
                )}
              </>
            )}
          </div>

          {/* Right: Three.js orbit controls (only relevant without GLB) */}
          {!modelUrl && (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="h-8 text-xs text-slate-400 hover:text-white"
                onClick={() => {
                  drag.current.rotX = 0.3; drag.current.rotY = 0.5; drag.current.dist = 5;
                  if (cameraRef.current) cameraRef.current.position.setLength(5);
                }}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
              <Button size="sm" variant="ghost"
                className={`h-8 text-xs ${autoRotate ? "text-orange-400" : "text-slate-400"} hover:text-white`}
                onClick={() => setAutoRotate(v => !v)}>
                {autoRotate ? "Auto-rotate on" : "Auto-rotate off"}
              </Button>
              {savedPose && (
                <Button size="sm" variant="ghost" className="h-8 text-xs text-slate-400 hover:text-red-400"
                  onClick={() => onClearPose?.()}>Clear pose</Button>
              )}
            </div>
          )}
        </div>

        {/* Info banner */}
        <div className="px-4 pb-3">
          {modelUrl ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2.5 flex items-start gap-3">
              <span className="text-lg">📦</span>
              <div>
                <p className="text-green-300 text-xs font-bold">3D model preview available</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  AR works best on Android Chrome or iOS Quick Look compatible devices.
                  Use the built-in AR button in the viewer above.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-2.5 flex items-start gap-3">
              <span className="text-lg">🚀</span>
              <div>
                <p className="text-orange-300 text-xs font-bold">No AR model linked for this step yet</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Showing procedural 3D preview. GLB models are being added — check back soon.
                  Full AR on Android Chrome with ARCore will be enabled automatically once available.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ARViewer;
