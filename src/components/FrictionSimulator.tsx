import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, TrendingUp, Camera } from "lucide-react";
import { 
  createBlixMaterials, 
  createBlixCartAssembly, 
  setupStudioLighting, 
  createSurface 
} from "./3d/BlixMaterials";

type Surface = "ice" | "wood" | "carpet" | "rough";

const FrictionSimulator = () => {
  const [selectedSurface, setSelectedSurface] = useState<Surface>("wood");
  const [isRunning, setIsRunning] = useState(false);
  const [distance, setDistance] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [maxVelocity, setMaxVelocity] = useState(0);
  const [pushForce, setPushForce] = useState([50]);
  const [testResults, setTestResults] = useState<Array<{surface: string, distance: number, force: number}>>([]);
  const [cameraPreset, setCameraPreset] = useState<'default' | 'side' | 'top' | 'close'>('default');
  
  const animationRef = useRef<number>();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cartRef = useRef<THREE.Group | null>(null);
  const surfaceMeshRef = useRef<THREE.Mesh | null>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);

  const surfaces = {
    ice: { name: "Ice", friction: 0.1, color: 0x88ccff, emoji: "🧊" },
    wood: { name: "Wood", friction: 0.4, color: 0xd4a574, emoji: "🪵" },
    carpet: { name: "Carpet", friction: 0.7, color: 0xcc5555, emoji: "🟥" },
    rough: { name: "Rough Ground", friction: 0.9, color: 0x888888, emoji: "⛰️" }
  };

  const cameraPositions = {
    default: { pos: new THREE.Vector3(4, 3, 5), target: new THREE.Vector3(0, 0, 0) },
    side: { pos: new THREE.Vector3(6, 1, 0), target: new THREE.Vector3(0, 0, 0) },
    top: { pos: new THREE.Vector3(0, 8, 0.1), target: new THREE.Vector3(0, 0, 0) },
    close: { pos: new THREE.Vector3(2, 1.5, 2), target: new THREE.Vector3(-1, 0, 0) },
  };

  // Initialize 3D scene with realistic BLIX components
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f4f8);
    scene.fog = new THREE.Fog(0xf0f4f8, 10, 25);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / 350, 0.1, 1000);
    camera.position.copy(cameraPositions.default.pos);
    camera.lookAt(cameraPositions.default.target);
    cameraRef.current = camera;

    // Renderer with better quality
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, 350);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Professional lighting
    setupStudioLighting(scene);

    // Camera control state
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let spherical = { 
      theta: Math.atan2(camera.position.x, camera.position.z), 
      phi: Math.acos(camera.position.y / camera.position.length()), 
      radius: camera.position.length() 
    };
    const target = new THREE.Vector3(0, 0, 0);

    const updateCameraPosition = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(target);
    };

    // Mouse controls
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      spherical.theta -= deltaX * 0.01;
      spherical.phi = Math.max(0.3, Math.min(Math.PI - 0.3, spherical.phi + deltaY * 0.01));
      
      updateCameraPosition();
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(3, Math.min(15, spherical.radius + e.deltaY * 0.01));
      updateCameraPosition();
    };

    // Touch controls
    let touchStart = { x: 0, y: 0 };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStart.x;
      const deltaY = e.touches[0].clientY - touchStart.y;
      
      spherical.theta -= deltaX * 0.01;
      spherical.phi = Math.max(0.3, Math.min(Math.PI - 0.3, spherical.phi + deltaY * 0.01));
      
      updateCameraPosition();
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => { isDragging = false; };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.addEventListener('touchstart', onTouchStart);
    renderer.domElement.addEventListener('touchmove', onTouchMove);
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    // Ground surface with shadow
    const { surface, material: surfaceMaterial } = createSurface(selectedSurface);
    surface.position.y = -1.2;
    scene.add(surface);
    surfaceMeshRef.current = surface;

    // Track markers for distance reference
    const trackGroup = new THREE.Group();
    for (let i = -5; i <= 5; i++) {
      const marker = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.01, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
      );
      marker.position.set(i, -1.19, 0);
      trackGroup.add(marker);
      
      // Distance labels every meter
      if (i % 1 === 0 && i !== 0) {
        const labelMarker = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.01, 0.08),
          new THREE.MeshStandardMaterial({ color: 0xff6b35 })
        );
        labelMarker.position.set(i, -1.18, 0.25);
        trackGroup.add(labelMarker);
      }
    }
    scene.add(trackGroup);

    // Create realistic BLIX cart
    const { cartGroup } = createBlixCartAssembly();
    cartGroup.position.set(-4, -0.5, 0);
    cartGroup.scale.setScalar(0.8);
    scene.add(cartGroup);
    cartRef.current = cartGroup;

    // Store wheel references for rotation animation
    wheelsRef.current = [];
    cartGroup.traverse((child) => {
      if (child.name?.includes('wheel') || 
          (child instanceof THREE.Group && child.children.some(c => 
            c instanceof THREE.Mesh && c.geometry instanceof THREE.TorusGeometry))) {
        wheelsRef.current.push(child as THREE.Group);
      }
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      const width = mountRef.current.clientWidth;
      camera.aspect = width / 350;
      camera.updateProjectionMatrix();
      renderer.setSize(width, 350);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update surface appearance when selection changes
  useEffect(() => {
    if (!surfaceMeshRef.current) return;
    const config = {
      ice: { color: 0x88ccff, roughness: 0.1, metalness: 0.3 },
      wood: { color: 0xd4a574, roughness: 0.6, metalness: 0.0 },
      carpet: { color: 0xcc5555, roughness: 0.95, metalness: 0.0 },
      rough: { color: 0x888888, roughness: 0.9, metalness: 0.1 },
    };
    const surfaceConfig = config[selectedSurface];
    const mat = surfaceMeshRef.current.material as THREE.MeshStandardMaterial;
    mat.color.setHex(surfaceConfig.color);
    mat.roughness = surfaceConfig.roughness;
    mat.metalness = surfaceConfig.metalness;
    mat.needsUpdate = true;
  }, [selectedSurface]);

  // Camera preset handler
  const setCameraView = (preset: keyof typeof cameraPositions) => {
    if (!cameraRef.current) return;
    setCameraPreset(preset);
    const { pos, target } = cameraPositions[preset];
    cameraRef.current.position.copy(pos);
    cameraRef.current.lookAt(target);
  };

  const runSimulation = () => {
    setIsRunning(true);
    const surface = surfaces[selectedSurface];
    
    const mass = 0.5;
    const initialVelocity = pushForce[0] / mass;
    const frictionForce = mass * 9.8 * surface.friction;
    const deceleration = frictionForce / mass;
    
    let currentVelocity = initialVelocity;
    let currentDistance = 0;
    let currentMaxVelocity = 0;
    const startTime = Date.now();
    let wheelRotation = 0;
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      currentVelocity = Math.max(0, initialVelocity - deceleration * elapsed);
      currentDistance = initialVelocity * elapsed - 0.5 * deceleration * elapsed * elapsed;
      currentMaxVelocity = Math.max(currentMaxVelocity, currentVelocity);
      
      setVelocity(currentVelocity);
      setDistance(currentDistance);
      setMaxVelocity(currentMaxVelocity);

      // Update cart position
      if (cartRef.current) {
        const maxDistance = 8;
        const cartPosition = -4 + (currentDistance / 100) * maxDistance;
        cartRef.current.position.x = Math.min(cartPosition, 4);
        
        // Rotate all wheels
        wheelRotation += currentVelocity * 0.1;
        cartRef.current.traverse((child) => {
          if (child instanceof THREE.Group || child instanceof THREE.Mesh) {
            // Check if it's a wheel component by looking for torus geometry
            const hasTorusChild = child instanceof THREE.Group && 
              child.children.some(c => c instanceof THREE.Mesh && 
                (c.geometry instanceof THREE.TorusGeometry || c.geometry instanceof THREE.CylinderGeometry));
            
            if (hasTorusChild || (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry)) {
              child.rotation.x = wheelRotation;
            }
          }
        });
      }
      
      if (currentVelocity > 0.1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        setVelocity(0);
        setTestResults(prev => [...prev, {
          surface: surface.name,
          distance: Math.round(currentDistance),
          force: pushForce[0]
        }]);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setDistance(0);
    setVelocity(0);
    setMaxVelocity(0);
    setIsRunning(false);
    
    if (cartRef.current) {
      cartRef.current.position.x = -4;
      cartRef.current.traverse((child) => {
        if (child instanceof THREE.Group || child instanceof THREE.Mesh) {
          const hasTorusChild = child instanceof THREE.Group && 
            child.children.some(c => c instanceof THREE.Mesh && 
              (c.geometry instanceof THREE.TorusGeometry || c.geometry instanceof THREE.CylinderGeometry));
          if (hasTorusChild || (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry)) {
            child.rotation.x = 0;
          }
        }
      });
    }
  };

  const clearResults = () => setTestResults([]);

  const surface = surfaces[selectedSurface];

  return (
    <div className="space-y-6">
      {/* Simulation Display */}
      <Card className="border-secondary/20 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">🎮 Friction Experiment</span>
            <div className="flex gap-1">
              {(['default', 'side', 'top', 'close'] as const).map((preset) => (
                <Button
                  key={preset}
                  variant={cameraPreset === preset ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCameraView(preset)}
                  className="h-7 px-2 text-xs"
                >
                  <Camera className="h-3 w-3 mr-1" />
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </Button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 3D Simulation Area */}
          <div className="relative">
            <div 
              ref={mountRef} 
              className="relative rounded-lg border-2 border-border overflow-hidden bg-gradient-to-b from-muted/30 to-muted/60 cursor-grab active:cursor-grabbing"
              style={{ height: '350px' }}
            />
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                {surface.emoji} {surface.name} Surface
              </Badge>
              <p className="text-xs text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded">
                Drag to rotate • Scroll to zoom
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-3 pb-3">
                <p className="text-xs text-muted-foreground mb-0.5">Distance</p>
                <p className="text-xl font-bold text-primary">{Math.round(distance)} cm</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="pt-3 pb-3">
                <p className="text-xs text-muted-foreground mb-0.5">Current Speed</p>
                <p className="text-xl font-bold text-accent">{velocity.toFixed(1)} m/s</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="pt-3 pb-3">
                <p className="text-xs text-muted-foreground mb-0.5">Max Speed</p>
                <p className="text-xl font-bold text-green-600">{maxVelocity.toFixed(1)} m/s</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
              <CardContent className="pt-3 pb-3">
                <p className="text-xs text-muted-foreground mb-0.5">Friction</p>
                <p className="text-xl font-bold text-secondary-foreground">{(surface.friction * 100).toFixed(0)}%</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Experiment Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Surface Selection */}
          <div>
            <label className="text-sm font-semibold mb-3 block">Choose Surface:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(Object.keys(surfaces) as Surface[]).map((key) => (
                <Button
                  key={key}
                  variant={selectedSurface === key ? "default" : "outline"}
                  onClick={() => { setSelectedSurface(key); reset(); }}
                  className="h-auto py-3 flex flex-col gap-1.5"
                  disabled={isRunning}
                >
                  <span className="text-2xl">{surfaces[key].emoji}</span>
                  <span className="text-xs font-medium">{surfaces[key].name}</span>
                  <span className="text-[10px] text-muted-foreground">μ = {surfaces[key].friction}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Push Force Slider */}
          <div>
            <label className="text-sm font-semibold mb-3 block">
              Push Force: <Badge variant="secondary" className="ml-2">{pushForce[0]}N</Badge>
            </label>
            <Slider
              value={pushForce}
              onValueChange={setPushForce}
              max={100}
              min={10}
              step={5}
              disabled={isRunning}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={runSimulation} disabled={isRunning} className="flex-1" size="lg">
              <Play className="mr-2 h-4 w-4" />
              Run Experiment
            </Button>
            <Button onClick={reset} variant="outline" size="lg">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Test Results
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearResults}>Clear</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults.slice(-5).map((result, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{result.surface}</Badge>
                    <span className="text-sm text-muted-foreground">{result.force}N</span>
                  </div>
                  <div className="text-lg font-bold text-primary">{result.distance} cm</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Notes */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="pt-5">
          <h4 className="font-semibold mb-3 flex items-center gap-2">📚 What Did You Learn?</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Different surfaces create different amounts of friction (μ coefficient)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Ice (μ=0.1) has low friction - cart travels far!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Carpet (μ=0.7) has high friction - cart stops quickly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>More push force = higher initial velocity = longer distance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>BLIX wheels reduce friction by rolling instead of sliding!</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FrictionSimulator;
