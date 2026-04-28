import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as THREE from "three";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ARPose {
  matrix: number[];
  savedAt: string;
}

interface ARViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  savedPose?: ARPose | null;
  onSavePose?: (matrix: number[]) => void;
  onClearPose?: () => void;
}

// Minimal WebXR AR overlay that places a simple BLIX-cart proxy in the real world.
const ARViewer = ({ open, onOpenChange, title, savedPose, onSavePose, onClearPose }: ARViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [running, setRunning] = useState(false);
  const cleanupRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!open) return;
    const anyNav = navigator as any;
    if (!anyNav.xr?.isSessionSupported) {
      setSupported(false);
      return;
    }
    anyNav.xr.isSessionSupported("immersive-ar").then((ok: boolean) => setSupported(ok)).catch(() => setSupported(false));
  }, [open]);

  useEffect(() => {
    if (!open) {
      cleanupRef.current();
      cleanupRef.current = () => {};
      setRunning(false);
    }
  }, [open]);

  const startAR = async () => {
    if (!containerRef.current) return;
    try {
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      containerRef.current.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

      const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
      scene.add(light);
      const dir = new THREE.DirectionalLight(0xffffff, 0.8);
      dir.position.set(1, 2, 1);
      scene.add(dir);

      // Build a small BLIX-cart proxy
      const cart = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.05, 0.12),
        new THREE.MeshStandardMaterial({ color: 0xff6b35 }),
      );
      body.position.y = 0.04;
      cart.add(body);
      const wheelGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 24);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
      const wheelPositions: [number, number, number][] = [
        [-0.08, 0.03, 0.06],
        [0.08, 0.03, 0.06],
        [-0.08, 0.03, -0.06],
        [0.08, 0.03, -0.06],
      ];
      wheelPositions.forEach(([x, y, z]) => {
        const w = new THREE.Mesh(wheelGeom, wheelMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(x, y, z);
        cart.add(w);
      });
      cart.visible = false;
      scene.add(cart);

      // If a saved pose exists, restore the cart to that position from the start.
      if (savedPose?.matrix && savedPose.matrix.length === 16) {
        const m = new THREE.Matrix4().fromArray(savedPose.matrix);
        cart.position.setFromMatrixPosition(m);
        cart.visible = true;
      }

      // Reticle
      const reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xff6b35 }),
      );
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);

      const session = await (navigator as any).xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test"],
      });
      renderer.xr.setReferenceSpaceType("local");
      await renderer.xr.setSession(session);

      const viewerSpace = await session.requestReferenceSpace("viewer");
      const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
      const refSpace = await session.requestReferenceSpace("local");

      const onSelect = () => {
        if (reticle.visible) {
          cart.position.setFromMatrixPosition(reticle.matrix);
          cart.visible = true;
          // Persist the placement so it resumes next time.
          const arr = Array.from(reticle.matrix.elements);
          onSavePose?.(arr);
        }
      };
      session.addEventListener("select", onSelect);

      renderer.setAnimationLoop((_t, frame) => {
        if (frame) {
          const hits = frame.getHitTestResults(hitTestSource);
          if (hits.length > 0) {
            const pose = hits[0].getPose(refSpace);
            if (pose) {
              reticle.visible = true;
              reticle.matrix.fromArray(pose.transform.matrix);
            }
          } else {
            reticle.visible = false;
          }
        }
        renderer.render(scene, camera);
      });

      setRunning(true);

      const cleanup = () => {
        try { session.removeEventListener("select", onSelect); } catch {}
        try { session.end(); } catch {}
        renderer.setAnimationLoop(null);
        renderer.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        setRunning(false);
      };
      session.addEventListener("end", () => {
        cleanup();
        onOpenChange(false);
      });
      cleanupRef.current = cleanup;
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Couldn't start AR session");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>AR View — {title}</DialogTitle>
          <DialogDescription>
            Place your build in the real world and walk around it.
          </DialogDescription>
        </DialogHeader>

        <div ref={containerRef} />

        {supported === null && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Checking AR support...
          </div>
        )}
        {supported === false && (
          <div className="space-y-2 text-sm">
            <p className="text-destructive font-medium">AR isn't supported on this device/browser.</p>
            <p className="text-muted-foreground">
              Try on a recent Android phone in Chrome, or an ARKit-enabled iOS device using a WebXR-compatible browser (e.g. WebXR Viewer).
            </p>
          </div>
        )}
        {supported && !running && (
          <Button onClick={startAR} className="w-full">Start AR Session</Button>
        )}
        {running && (
          <p className="text-sm text-muted-foreground">
            Point at a flat surface, then tap to place your BLIX cart. Close this dialog to exit.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ARViewer;
