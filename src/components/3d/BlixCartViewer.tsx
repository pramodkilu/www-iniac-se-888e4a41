import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface BuildStep {
  number: number;
  instruction: string;
  pieces: string[];
  addPieces: (scene: THREE.Scene) => THREE.Group;
}

const BlixCartViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cartGroupRef = useRef<THREE.Group | null>(null);
  const currentStepPiecesRef = useRef<THREE.Group[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  // Define build steps with 3D piece creation
  const buildSteps: BuildStep[] = [
    {
      number: 1,
      instruction: "Start with the base beam (P11)",
      pieces: ["P11"],
      addPieces: (scene) => {
        const group = new THREE.Group();
        
        // P11 beam (long rectangular beam)
        const beamGeometry = new THREE.BoxGeometry(5, 0.3, 0.5);
        const beamMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x2196F3, // Blue
          emissive: 0x2196F3,
          emissiveIntensity: 0.3,
        });
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.y = 0;
        group.add(beam);
        
        return group;
      }
    },
    {
      number: 2,
      instruction: "Attach two CT2 connectors to the base",
      pieces: ["CT2", "CT2"],
      addPieces: (scene) => {
        const group = new THREE.Group();
        
        // CT2 connectors (small cubic connectors)
        const connectorGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const connectorMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xFF5722, // Orange-red
          emissive: 0xFF5722,
          emissiveIntensity: 0.3,
        });
        
        // Left connector
        const connector1 = new THREE.Mesh(connectorGeometry, connectorMaterial);
        connector1.position.set(-2, -0.3, 0);
        group.add(connector1);
        
        // Right connector
        const connector2 = new THREE.Mesh(connectorGeometry, connectorMaterial);
        connector2.position.set(2, -0.3, 0);
        group.add(connector2);
        
        return group;
      }
    },
    {
      number: 3,
      instruction: "Add CT3 connectors for the axles",
      pieces: ["CT3", "CT3"],
      addPieces: (scene) => {
        const group = new THREE.Group();
        
        // CT3 connectors (cylindrical holders)
        const axleHolderGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16);
        const axleHolderMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x4CAF50, // Green
          emissive: 0x4CAF50,
          emissiveIntensity: 0.3,
        });
        
        // Front axle holder
        const holder1 = new THREE.Mesh(axleHolderGeometry, axleHolderMaterial);
        holder1.position.set(-2, -0.7, 0);
        holder1.rotation.z = Math.PI / 2;
        group.add(holder1);
        
        // Rear axle holder
        const holder2 = new THREE.Mesh(axleHolderGeometry, axleHolderMaterial);
        holder2.position.set(2, -0.7, 0);
        holder2.rotation.z = Math.PI / 2;
        group.add(holder2);
        
        return group;
      }
    },
    {
      number: 4,
      instruction: "Insert axle shafts through the holders",
      pieces: ["Shaft x2"],
      addPieces: (scene) => {
        const group = new THREE.Group();
        
        // Axle shafts (thin cylinders)
        const shaftGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 16);
        const shaftMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x9E9E9E, // Gray
          emissive: 0x9E9E9E,
          emissiveIntensity: 0.3,
          metalness: 0.8,
        });
        
        // Front shaft
        const shaft1 = new THREE.Mesh(shaftGeometry, shaftMaterial);
        shaft1.position.set(-2, -0.7, 0);
        shaft1.rotation.z = Math.PI / 2;
        group.add(shaft1);
        
        // Rear shaft
        const shaft2 = new THREE.Mesh(shaftGeometry, shaftMaterial);
        shaft2.position.set(2, -0.7, 0);
        shaft2.rotation.z = Math.PI / 2;
        group.add(shaft2);
        
        return group;
      }
    },
    {
      number: 5,
      instruction: "Attach four wheels to complete your cart!",
      pieces: ["Wheel x4"],
      addPieces: (scene) => {
        const group = new THREE.Group();
        
        // Wheels (torus + circle for tire look)
        const createWheel = (x: number, z: number) => {
          const wheelGroup = new THREE.Group();
          
          // Tire (torus)
          const tireGeometry = new THREE.TorusGeometry(0.5, 0.15, 16, 32);
          const tireMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x212121, // Dark gray/black
            emissive: 0x212121,
            emissiveIntensity: 0.2,
          });
          const tire = new THREE.Mesh(tireGeometry, tireMaterial);
          tire.rotation.y = Math.PI / 2;
          wheelGroup.add(tire);
          
          // Hub (circle)
          const hubGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.15, 16);
          const hubMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFC107, // Yellow
            emissive: 0xFFC107,
            emissiveIntensity: 0.3,
          });
          const hub = new THREE.Mesh(hubGeometry, hubMaterial);
          hub.rotation.z = Math.PI / 2;
          wheelGroup.add(hub);
          
          wheelGroup.position.set(x, -0.7, z);
          return wheelGroup;
        };
        
        // Four wheels
        group.add(createWheel(-2, -1.2));  // Front left
        group.add(createWheel(-2, 1.2));   // Front right
        group.add(createWheel(2, -1.2));   // Rear left
        group.add(createWheel(2, 1.2));    // Rear right
        
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
  }, [currentStep]);

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

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-primary/20">
        {/* 3D Viewer */}
        <div 
          ref={mountRef} 
          className="w-full h-[500px] cursor-grab active:cursor-grabbing bg-gradient-to-br from-muted/30 to-muted/10"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
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
          >
            <RotateCcw className="h-4 w-4" />
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

      {/* Instructions */}
      <Card className="p-4 bg-muted/30">
        <p className="text-sm text-muted-foreground text-center">
          🖱️ Click and drag to rotate • Scroll or use buttons to zoom • Watch pieces pulse when added
        </p>
      </Card>
    </div>
  );
};

export default BlixCartViewer;
