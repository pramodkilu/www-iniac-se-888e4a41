import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut, Maximize2, Ruler, Share2, Download } from "lucide-react";
import { toast } from "sonner";

interface BuildStep {
  number: number;
  instruction: string;
  pieces: string[];
  addPieces: (scene: THREE.Scene) => THREE.Group;
}

interface PieceMetadata {
  name: string;
  color: string;
  stepNumber: number;
}

interface BlixCartViewerProps {
  chapterId?: number;
  activeStep?: number; // 1-indexed step from parent, used as key for camera persistence
}

interface SavedView {
  rotX: number;
  rotY: number;
  camDist: number;
  autoRotate: boolean;
}

const BlixCartViewer = ({ chapterId, activeStep }: BlixCartViewerProps = {}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cartGroupRef = useRef<THREE.Group | null>(null);
  const currentStepPiecesRef = useRef<THREE.Group[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [shareDialog, setShareDialog] = useState<{ open: boolean; mode: "export" | "import"; code: string }>({
    open: false,
    mode: "export",
    code: "",
  });
  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [hoveredPiece, setHoveredPiece] = useState<THREE.Object3D | null>(null);
  const [visibleComponents, setVisibleComponents] = useState<Record<string, boolean>>({});
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const measurementLinesRef = useRef<THREE.Group | null>(null);

  // Track which step's camera view is currently shown so we can save it before switching
  const persistedStepRef = useRef<number | null>(null);
  const isRotatingRef = useRef(isRotating);
  useEffect(() => { isRotatingRef.current = isRotating; }, [isRotating]);

  const viewStorageKey = (step: number) =>
    `blix-cart-view:${chapterId ?? "default"}:${step}`;

  const saveCurrentView = (step: number) => {
    const cart = cartGroupRef.current;
    const cam = cameraRef.current;
    if (!cart || !cam) return;
    const view: SavedView = {
      rotX: cart.rotation.x,
      rotY: cart.rotation.y,
      camDist: cam.position.length(),
      autoRotate: isRotatingRef.current,
    };
    try {
      localStorage.setItem(viewStorageKey(step), JSON.stringify(view));
    } catch {}
  };

  const restoreView = (step: number) => {
    const cart = cartGroupRef.current;
    const cam = cameraRef.current;
    if (!cart || !cam) return false;
    try {
      const raw = localStorage.getItem(viewStorageKey(step));
      if (!raw) return false;
      const view = JSON.parse(raw) as SavedView;
      cart.rotation.x = view.rotX;
      cart.rotation.y = view.rotY;
      // Preserve current camera direction; just rescale to saved distance
      const dir = cam.position.clone().normalize();
      cam.position.copy(dir.multiplyScalar(view.camDist));
      cam.lookAt(0, 0, 0);
      // If user had paused rotation when they verified, keep it paused on return
      setIsRotating(view.autoRotate);
      return true;
    } catch {
      return false;
    }
  };


  // Define build steps with REAL BLIX components from PDF
  const buildSteps: BuildStep[] = [
    {
      number: 1,
      instruction: "Place two P7X11 U-shaped pillars (17 holes each)",
      pieces: ["P7X11", "P7X11"],
      addPieces: (scene) => {
        const group = new THREE.Group();
        
        // Helper to create U-shaped pillar with visible holes
        const createPillar = (xPos: number) => {
          const pillarGroup = new THREE.Group();
          
          // P7X11 - U-shaped structure (orange - BLIX primary color)
          const leftArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 1.4, 0.15),
            new THREE.MeshPhongMaterial({ 
              color: 0xff6b35,
              emissive: 0xff6b35,
              emissiveIntensity: 0.2
            })
          );
          leftArm.position.set(-0.175, 0, 0);
          
          const rightArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 1.4, 0.15),
            new THREE.MeshPhongMaterial({ 
              color: 0xff6b35,
              emissive: 0xff6b35,
              emissiveIntensity: 0.2
            })
          );
          rightArm.position.set(0.175, 0, 0);
          
          const base = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.15, 0.15),
            new THREE.MeshPhongMaterial({ 
              color: 0xff6b35,
              emissive: 0xff6b35,
              emissiveIntensity: 0.2
            })
          );
          base.position.set(0, -0.625, 0);
          
          // Add visible holes (8 holes on each side)
          for (let i = 0; i < 8; i++) {
            const holeY = -0.5 + (i * 0.15);
            const holeGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.17, 8);
            const hole = new THREE.Mesh(
              holeGeom,
              new THREE.MeshPhongMaterial({ color: 0x000000 })
            );
            hole.position.set(-0.175, holeY, 0);
            hole.rotation.z = Math.PI / 2;
            pillarGroup.add(hole);
          }
          
          pillarGroup.add(leftArm, rightArm, base);
          pillarGroup.position.x = xPos;
          pillarGroup.userData = { 
            name: `P7X11 Pillar (${xPos < 0 ? 'Left' : 'Right'})`, 
            color: "Orange", 
            stepNumber: 1 
          } as PieceMetadata;
          
          return pillarGroup;
        };
        
        group.add(createPillar(-1.5));
        group.add(createPillar(1.5));
        
        return group;
      }
    },
    {
      number: 2,
      instruction: "Add CT2 tight connectors at the base",
      pieces: ["CT2", "CT2"],
      addPieces: (scene) => {
        const group = new THREE.Group();
        
        // CT2 connectors (teal - secondary color)
        const connectorGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 12);
        const connectorMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x4ecdc4,
          emissive: 0x4ecdc4,
          emissiveIntensity: 0.2
        });
        
        const connector1 = new THREE.Mesh(connectorGeometry, connectorMaterial);
        connector1.position.set(-1.5, -0.9, 0);
        connector1.userData = { name: "CT2 Connector Left", color: "Teal", stepNumber: 2 } as PieceMetadata;
        group.add(connector1);
        
        const connector2 = new THREE.Mesh(connectorGeometry, connectorMaterial);
        connector2.position.set(1.5, -0.9, 0);
        connector2.userData = { name: "CT2 Connector Right", color: "Teal", stepNumber: 2 } as PieceMetadata;
        group.add(connector2);
        
        return group;
      }
    },
    {
      number: 3,
      instruction: "Connect pillars with horizontal beam",
      pieces: ["Beam"],
      addPieces: (scene) => {
        const group = new THREE.Group();
        
        // Connecting beam (orange to match pillars)
        const beam = new THREE.Mesh(
          new THREE.BoxGeometry(3.5, 0.15, 0.15),
          new THREE.MeshPhongMaterial({ 
            color: 0xff6b35,
            emissive: 0xff6b35,
            emissiveIntensity: 0.2
          })
        );
        beam.position.set(0, -0.9, 0);
        beam.userData = { name: "Connecting Beam", color: "Orange", stepNumber: 3 } as PieceMetadata;
        group.add(beam);
        
        return group;
      }
    },
    {
      number: 4,
      instruction: "Insert SH170 shafts (17cm) through holders",
      pieces: ["SH170", "SH170"],
      addPieces: (scene) => {
        const group = new THREE.Group();
        
        // SH170 shafts (gray metallic)
        const shaftGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16);
        const shaftMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x95a5a6,
          emissive: 0x95a5a6,
          emissiveIntensity: 0.1,
          metalness: 0.8
        });
        
        const shaft1 = new THREE.Mesh(shaftGeometry, shaftMaterial);
        shaft1.position.set(-1.5, -0.9, 0);
        shaft1.rotation.z = Math.PI / 2;
        shaft1.userData = { name: "SH170 Front Shaft", color: "Gray", stepNumber: 4 } as PieceMetadata;
        group.add(shaft1);
        
        const shaft2 = new THREE.Mesh(shaftGeometry, shaftMaterial);
        shaft2.position.set(1.5, -0.9, 0);
        shaft2.rotation.z = Math.PI / 2;
        shaft2.userData = { name: "SH170 Rear Shaft", color: "Gray", stepNumber: 4 } as PieceMetadata;
        group.add(shaft2);
        
        return group;
      }
    },
    {
      number: 5,
      instruction: "Attach 4 BLIX wheels to complete your cart!",
      pieces: ["Wheel", "Wheel", "Wheel", "Wheel"],
      addPieces: (scene) => {
        const group = new THREE.Group();
        
        // BLIX Wheels - realistic design
        const createWheel = (x: number, z: number, label: string) => {
          const wheelGroup = new THREE.Group();
          
          // Tire (dark rubber)
          const tireGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.25, 32);
          const tire = new THREE.Mesh(
            tireGeometry,
            new THREE.MeshPhongMaterial({ 
              color: 0x2c3e50,
              emissive: 0x2c3e50,
              emissiveIntensity: 0.1
            })
          );
          tire.rotation.z = Math.PI / 2;
          wheelGroup.add(tire);
          
          // Hub (lighter center)
          const hubGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.27, 16);
          const hub = new THREE.Mesh(
            hubGeometry,
            new THREE.MeshPhongMaterial({ 
              color: 0x34495e,
              emissive: 0x34495e,
              emissiveIntensity: 0.2
            })
          );
          hub.rotation.z = Math.PI / 2;
          wheelGroup.add(hub);
          
          // Tread lines (for detail)
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const treadGeometry = new THREE.BoxGeometry(0.1, 0.02, 0.26);
            const tread = new THREE.Mesh(
              treadGeometry,
              new THREE.MeshPhongMaterial({ color: 0x1a1a1a })
            );
            tread.position.set(
              Math.cos(angle) * 0.48,
              Math.sin(angle) * 0.48,
              0
            );
            tread.rotation.z = angle;
            wheelGroup.add(tread);
          }
          
          wheelGroup.position.set(x, -0.9, z);
          wheelGroup.rotation.y = Math.PI / 2;
          wheelGroup.userData = { 
            name: `BLIX Wheel ${label}`, 
            color: "Black", 
            stepNumber: 5 
          } as PieceMetadata;
          
          return wheelGroup;
        };
        
        group.add(createWheel(-1.5, -0.95, "Front Left"));
        group.add(createWheel(-1.5, 0.95, "Front Right"));
        group.add(createWheel(1.5, -0.95, "Rear Left"));
        group.add(createWheel(1.5, 0.95, "Rear Right"));
        
        return group;
      }
    }
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(8, 5, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 10, 5);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xe0e0e0);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Create cart group
    const cartGroup = new THREE.Group();
    scene.add(cartGroup);
    cartGroupRef.current = cartGroup;

    // Create measurement lines group
    const measurementGroup = new THREE.Group();
    scene.add(measurementGroup);
    measurementLinesRef.current = measurementGroup;

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotating && !isDragging && cartGroupRef.current) {
        cartGroupRef.current.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [isRotating, isDragging]);

  // Create measurement lines
  useEffect(() => {
    if (!measurementLinesRef.current || !cartGroupRef.current) return;

    // Clear existing measurements
    measurementLinesRef.current.clear();

    if (!showMeasurements) return;

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff, linewidth: 2 });
    const textColor = 0xff00ff;

    // Measurement: Base beam length
    const points1 = [new THREE.Vector3(-2.5, 0.2, 0), new THREE.Vector3(2.5, 0.2, 0)];
    const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
    const line1 = new THREE.Line(geometry1, lineMaterial);
    measurementLinesRef.current.add(line1);

    // Measurement: Wheel spacing
    const points2 = [new THREE.Vector3(-2, -0.7, -1.5), new THREE.Vector3(2, -0.7, -1.5)];
    const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
    const line2 = new THREE.Line(geometry2, lineMaterial);
    measurementLinesRef.current.add(line2);

    // Measurement: Cart width
    const points3 = [new THREE.Vector3(-2, -0.7, -1.2), new THREE.Vector3(-2, -0.7, 1.2)];
    const geometry3 = new THREE.BufferGeometry().setFromPoints(points3);
    const line3 = new THREE.Line(geometry3, lineMaterial);
    measurementLinesRef.current.add(line3);
  }, [showMeasurements, currentStep]);

  // Handle exploded view
  useEffect(() => {
    if (!cartGroupRef.current) return;

    cartGroupRef.current.children.forEach((stepGroup, stepIndex) => {
      stepGroup.children.forEach((piece) => {
        const originalPos = piece.userData.originalPosition || piece.position.clone();
        piece.userData.originalPosition = originalPos;

        if (isExploded) {
          const offset = new THREE.Vector3(
            originalPos.x * 0.3,
            stepIndex * 0.5,
            originalPos.z * 0.3
          );
          piece.position.copy(originalPos).add(offset);
        } else {
          piece.position.copy(originalPos);
        }
      });
    });
  }, [isExploded, currentStep]);

  // Initialize visibility state
  useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    buildSteps.forEach((_, index) => {
      initialVisibility[`step-${index}`] = true;
    });
    setVisibleComponents(initialVisibility);
  }, []);

  // Sync internal step with parent's activeStep, and persist/restore camera per step.
  // activeStep from parent is 1-indexed; internal currentStep is 0-indexed.
  useEffect(() => {
    if (activeStep == null) return;
    const targetIdx = Math.max(0, Math.min(buildSteps.length - 1, activeStep - 1));
    if (targetIdx === currentStep && persistedStepRef.current === targetIdx) return;

    // Save the view of the step we're leaving (after refs are ready)
    if (persistedStepRef.current != null && cartGroupRef.current && cameraRef.current) {
      saveCurrentView(persistedStepRef.current);
    }

    setCurrentStep(targetIdx);

    // Defer restore until after the step's pieces re-render
    requestAnimationFrame(() => {
      const restored = restoreView(targetIdx);
      persistedStepRef.current = targetIdx;
      // If nothing saved yet, leave default camera/rotation untouched
      void restored;
    });
  }, [activeStep]);

  // Persist current view on unmount
  useEffect(() => {
    return () => {
      if (persistedStepRef.current != null) {
        saveCurrentView(persistedStepRef.current);
      }
    };
  }, []);


  // Update cart based on current step
  useEffect(() => {
    if (!sceneRef.current || !cartGroupRef.current) return;

    // Clear current step pieces
    currentStepPiecesRef.current.forEach(group => {
      cartGroupRef.current?.remove(group);
    });
    currentStepPiecesRef.current = [];

    // Add pieces up to current step
    for (let i = 0; i <= currentStep; i++) {
      const stepGroup = buildSteps[i].addPieces(sceneRef.current);
      stepGroup.visible = visibleComponents[`step-${i}`] !== false;
      cartGroupRef.current.add(stepGroup);
      
      // Only highlight the current step pieces
      if (i === currentStep) {
        stepGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Store original material
            const originalEmissive = child.material.emissive.getHex();
            const originalIntensity = child.material.emissiveIntensity;
            
            // Pulse animation for current step
            let pulseValue = 0;
            const pulseInterval = setInterval(() => {
              pulseValue += 0.1;
              child.material.emissiveIntensity = originalIntensity + Math.sin(pulseValue) * 0.3;
            }, 50);

            // Clean up after 3 seconds
            setTimeout(() => {
              clearInterval(pulseInterval);
              child.material.emissiveIntensity = originalIntensity;
            }, 3000);
          }
        });
      }
      
      currentStepPiecesRef.current.push(stepGroup);
    }
  }, [currentStep, visibleComponents]);

  // Mouse controls
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsRotating(false);
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !cartGroupRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    cartGroupRef.current.rotation.y += deltaX * 0.01;
    cartGroupRef.current.rotation.x += deltaY * 0.01;

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseHover = (e: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !cartGroupRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    const intersects = raycaster.current.intersectObjects(cartGroupRef.current.children, true);

    // Reset previous hover
    if (hoveredPiece && hoveredPiece instanceof THREE.Mesh) {
      const originalEmissive = hoveredPiece.userData.originalEmissive || 0x000000;
      hoveredPiece.material.emissive.setHex(originalEmissive);
      hoveredPiece.material.emissiveIntensity = hoveredPiece.userData.originalIntensity || 0.3;
    }

    if (intersects.length > 0) {
      const piece = intersects[0].object;
      if (piece instanceof THREE.Mesh) {
        setHoveredPiece(piece);
        piece.userData.originalEmissive = piece.material.emissive.getHex();
        piece.userData.originalIntensity = piece.material.emissiveIntensity;
        piece.material.emissive.setHex(0xffffff);
        piece.material.emissiveIntensity = 0.6;
      }
    } else {
      setHoveredPiece(null);
    }
  };

  // Control functions
  const handlePrevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleNextStep = () => {
    if (currentStep < buildSteps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleReset = () => {
    if (cartGroupRef.current) {
      cartGroupRef.current.rotation.set(0, 0, 0);
    }
    setIsRotating(true);
  };

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.9);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.1);
    }
  };

  // Export current step's view as a shareable base64 code
  const handleShareView = async () => {
    const cart = cartGroupRef.current;
    const cam = cameraRef.current;
    if (!cart || !cam) return;
    const payload = {
      v: 1,
      c: chapterId ?? null,
      s: currentStep + 1,
      rotX: Number(cart.rotation.x.toFixed(4)),
      rotY: Number(cart.rotation.y.toFixed(4)),
      camDist: Number(cam.position.length().toFixed(4)),
      autoRotate: isRotatingRef.current,
    };
    let code = "";
    try {
      code = btoa(JSON.stringify(payload));
    } catch {
      code = JSON.stringify(payload);
    }
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`View for Step ${currentStep + 1} copied to clipboard`);
    } catch {
      // Clipboard blocked — fall through to dialog so user can copy manually
    }
    setShareDialog({ open: true, mode: "export", code });
  };

  const handleImportView = () => {
    setShareDialog({ open: true, mode: "import", code: "" });
  };

  const applyImportedCode = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      toast.error("Paste a view code first");
      return;
    }
    let parsed: any;
    try {
      parsed = JSON.parse(atob(trimmed));
    } catch {
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        toast.error("That doesn't look like a valid view code");
        return;
      }
    }
    const cart = cartGroupRef.current;
    const cam = cameraRef.current;
    if (!cart || !cam) return;
    if (typeof parsed.rotX !== "number" || typeof parsed.rotY !== "number" || typeof parsed.camDist !== "number") {
      toast.error("View code is missing required fields");
      return;
    }
    // If the code targets a different step, jump to it (within bounds)
    const targetStep = typeof parsed.s === "number" ? Math.max(1, Math.min(buildSteps.length, parsed.s)) : currentStep + 1;
    if (targetStep - 1 !== currentStep) {
      setCurrentStep(targetStep - 1);
    }
    requestAnimationFrame(() => {
      cart.rotation.x = parsed.rotX;
      cart.rotation.y = parsed.rotY;
      const dir = cam.position.clone().normalize();
      if (dir.lengthSq() === 0) dir.set(1, 0.6, 1).normalize();
      cam.position.copy(dir.multiplyScalar(parsed.camDist));
      cam.lookAt(0, 0, 0);
      setIsRotating(!!parsed.autoRotate);
      // Persist as the saved view for this step
      try {
        localStorage.setItem(viewStorageKey(targetStep - 1), JSON.stringify({
          rotX: parsed.rotX,
          rotY: parsed.rotY,
          camDist: parsed.camDist,
          autoRotate: !!parsed.autoRotate,
        }));
      } catch {}
      persistedStepRef.current = targetStep - 1;
      toast.success(`Loaded view for Step ${targetStep}`);
      setShareDialog((s) => ({ ...s, open: false }));
    });
  };

  const toggleComponentVisibility = (stepIndex: number) => {
    setVisibleComponents(prev => ({
      ...prev,
      [`step-${stepIndex}`]: !prev[`step-${stepIndex}`]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Component Visibility Panel */}
        <Card className="lg:col-span-1 p-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-3 text-sm">View Controls</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exploded"
                  checked={isExploded}
                  onCheckedChange={(checked) => setIsExploded(checked as boolean)}
                />
                <Label htmlFor="exploded" className="text-sm cursor-pointer flex items-center gap-1">
                  <Maximize2 className="h-3 w-3" />
                  Exploded View
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="measurements"
                  checked={showMeasurements}
                  onCheckedChange={(checked) => setShowMeasurements(checked as boolean)}
                />
                <Label htmlFor="measurements" className="text-sm cursor-pointer flex items-center gap-1">
                  <Ruler className="h-3 w-3" />
                  Show Measurements
                </Label>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 text-sm">Components</h3>
            <div className="space-y-2">
              {buildSteps.slice(0, currentStep + 1).map((step, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Checkbox
                    id={`step-${idx}`}
                    checked={visibleComponents[`step-${idx}`] !== false}
                    onCheckedChange={() => toggleComponentVisibility(idx)}
                  />
                  <Label htmlFor={`step-${idx}`} className="text-xs cursor-pointer">
                    Step {idx + 1}: {step.pieces.join(", ")}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {hoveredPiece?.userData && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2 text-sm">Hovered Piece</h3>
              <div className="text-xs space-y-1">
                <p className="font-medium">{hoveredPiece.userData.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {hoveredPiece.userData.color}
                </Badge>
                <p className="text-muted-foreground">
                  Step {hoveredPiece.userData.stepNumber}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* 3D Viewer */}
        <Card className="lg:col-span-3 overflow-hidden border-primary/20 relative">
          <div 
            ref={mountRef} 
            className="w-full h-[500px] cursor-grab active:cursor-grabbing bg-gradient-to-br from-muted/30 to-muted/10"
            onMouseDown={handleMouseDown}
            onMouseMove={(e) => {
              handleMouseMove(e);
              if (!isDragging) handleMouseHover(e);
            }}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {/* Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomIn}
              className="shadow-lg bg-card"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomOut}
              className="shadow-lg bg-card"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleReset}
              className="shadow-lg bg-card"
              title="Reset rotation"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleShareView}
              className="shadow-lg bg-card"
              title={`Share Step ${currentStep + 1} view`}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleImportView}
              className="shadow-lg bg-card"
              title="Import shared view"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Step Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="p-4 bg-card/95 backdrop-blur-sm shadow-xl border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground">
                    Step {currentStep + 1} of {buildSteps.length}
                  </Badge>
                  <span className="text-sm font-semibold">
                    {buildSteps[currentStep].instruction}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {buildSteps[currentStep].pieces.map((piece, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {piece}
                  </Badge>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                {/* Progress dots */}
                <div className="flex gap-1">
                  {buildSteps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-2 rounded-full transition-all ${
                        idx === currentStep
                          ? 'bg-primary w-6'
                          : idx < currentStep
                          ? 'bg-success'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNextStep}
                  disabled={currentStep === buildSteps.length - 1}
                  variant="outline"
                  size="sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </Card>
          </div>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="p-4 bg-muted/30">
        <p className="text-sm text-muted-foreground text-center">
          🖱️ Click and drag to rotate • Scroll or use buttons to zoom • Hover over pieces to identify • Use controls to explore
        </p>
      </Card>
    </div>
  );
};

export default BlixCartViewer;
