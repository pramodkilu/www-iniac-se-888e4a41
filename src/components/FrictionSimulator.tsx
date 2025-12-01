import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, TrendingUp } from "lucide-react";

type Surface = "ice" | "wood" | "carpet" | "rough";

const FrictionSimulator = () => {
  const [selectedSurface, setSelectedSurface] = useState<Surface>("wood");
  const [isRunning, setIsRunning] = useState(false);
  const [distance, setDistance] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [maxVelocity, setMaxVelocity] = useState(0);
  const [pushForce, setPushForce] = useState([50]);
  const [testResults, setTestResults] = useState<Array<{surface: string, distance: number, force: number}>>([]);
  const animationRef = useRef<number>();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cartRef = useRef<THREE.Group | null>(null);

  const surfaces = {
    ice: { name: "Ice", friction: 0.1, color: 0x88ccff, emoji: "🧊" },
    wood: { name: "Wood", friction: 0.4, color: 0xd4a574, emoji: "🪵" },
    carpet: { name: "Carpet", friction: 0.7, color: 0xcc5555, emoji: "🟥" },
    rough: { name: "Rough Ground", friction: 0.9, color: 0x888888, emoji: "⛰️" }
  };

  // Create 3D BLIX cart model
  const createBlixCart = () => {
    const cartGroup = new THREE.Group();

    // Base P7X11 pillar (orange BLIX color)
    const pillarGeom = new THREE.BoxGeometry(0.15, 1.1, 0.15);
    const pillarMat = new THREE.MeshPhongMaterial({ 
      color: 0xff6b35,
      emissive: 0xff6b35,
      emissiveIntensity: 0.3
    });
    const pillar = new THREE.Mesh(pillarGeom, pillarMat);
    cartGroup.add(pillar);

    // CT2 connectors (gray)
    const connectorMat = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const connector1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), connectorMat);
    connector1.position.set(0, -0.4, -0.15);
    const connector2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), connectorMat);
    connector2.position.set(0, -0.4, 0.15);
    cartGroup.add(connector1, connector2);

    // SH170 axle shafts (metallic)
    const axleMat = new THREE.MeshPhongMaterial({ 
      color: 0xaaaaaa,
      shininess: 100,
      specular: 0x444444
    });
    const axle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 16), axleMat);
    axle1.rotation.x = Math.PI / 2;
    axle1.position.set(0, -0.4, -0.15);
    const axle2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 16), axleMat);
    axle2.rotation.x = Math.PI / 2;
    axle2.position.set(0, -0.4, 0.15);
    cartGroup.add(axle1, axle2);

    // Wheels (black with hub)
    const createWheel = (x: number, z: number) => {
      const wheelGroup = new THREE.Group();
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.06, 24),
        new THREE.MeshPhongMaterial({ color: 0x222222 })
      );
      wheel.rotation.z = Math.PI / 2;
      
      // Hub detail
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.08, 8),
        new THREE.MeshPhongMaterial({ color: 0xff6b35 })
      );
      hub.rotation.z = Math.PI / 2;
      
      wheelGroup.add(wheel, hub);
      wheelGroup.position.set(x, -0.55, z);
      return wheelGroup;
    };

    cartGroup.add(
      createWheel(-0.3, -0.15),
      createWheel(0.3, -0.15),
      createWheel(-0.3, 0.15),
      createWheel(0.3, 0.15)
    );

    return cartGroup;
  };

  // Initialize 3D scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, mountRef.current.clientWidth / 300, 0.1, 1000);
    camera.position.set(3, 2, 4);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, 300);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // Ground plane (surface)
    const groundGeom = new THREE.PlaneGeometry(10, 2);
    const groundMat = new THREE.MeshPhongMaterial({ 
      color: surfaces[selectedSurface].color,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -0.7;
    ground.receiveShadow = true;
    scene.add(ground);

    // Track line
    const trackGeom = new THREE.PlaneGeometry(10, 0.05);
    const trackMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const track = new THREE.Mesh(trackGeom, trackMat);
    track.rotation.x = Math.PI / 2;
    track.position.y = -0.69;
    scene.add(track);

    // BLIX Cart
    const cart = createBlixCart();
    cart.position.set(-4, 0, 0);
    cart.castShadow = true;
    cart.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
    scene.add(cart);
    cartRef.current = cart;

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
      camera.aspect = width / 300;
      camera.updateProjectionMatrix();
      renderer.setSize(width, 300);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update surface color when selection changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const ground = sceneRef.current.children.find(
      child => child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry
    ) as THREE.Mesh;
    if (ground && ground.material instanceof THREE.MeshPhongMaterial) {
      ground.material.color.setHex(surfaces[selectedSurface].color);
    }
  }, [selectedSurface]);

  const runSimulation = () => {
    setIsRunning(true);
    const surface = surfaces[selectedSurface];
    
    // Physics constants
    const mass = 0.5; // kg (cart mass)
    const initialVelocity = pushForce[0] / mass; // v = F/m
    const frictionForce = mass * 9.8 * surface.friction; // F = μ * m * g
    const deceleration = frictionForce / mass; // a = F/m
    
    let currentVelocity = initialVelocity;
    let currentDistance = 0;
    let currentMaxVelocity = 0;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000; // seconds
      
      // v = v0 - at (velocity decreases due to friction)
      currentVelocity = Math.max(0, initialVelocity - deceleration * elapsed);
      
      // d = v0*t - 0.5*a*t² (distance with deceleration)
      currentDistance = initialVelocity * elapsed - 0.5 * deceleration * elapsed * elapsed;
      
      currentMaxVelocity = Math.max(currentMaxVelocity, currentVelocity);
      
      setVelocity(currentVelocity);
      setDistance(currentDistance);
      setMaxVelocity(currentMaxVelocity);

      // Update 3D cart position
      if (cartRef.current) {
        const maxDistance = 8; // max distance in 3D units
        const cartPosition = -4 + (currentDistance / 100) * maxDistance;
        cartRef.current.position.x = Math.min(cartPosition, 4);
        
        // Rotate wheels based on distance
        cartRef.current.children.forEach(child => {
          if (child.position.y < -0.5) { // wheels
            child.rotation.y = (currentDistance / 10) * Math.PI;
          }
        });
      }
      
      if (currentVelocity > 0.1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        setVelocity(0);
        // Save result
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
    
    // Reset cart position
    if (cartRef.current) {
      cartRef.current.position.x = -4;
      cartRef.current.children.forEach(child => {
        if (child.position.y < -0.5) {
          child.rotation.y = 0;
        }
      });
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const surface = surfaces[selectedSurface];

  return (
    <div className="space-y-6">
      {/* Simulation Display */}
      <Card className="border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎮 Friction Experiment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 3D Simulation Area */}
          <div 
            ref={mountRef} 
            className="relative rounded-lg border-2 border-border overflow-hidden bg-muted/30"
            style={{ height: '300px' }}
          />

          {/* Results */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-1">Distance</p>
                <p className="text-2xl font-bold text-primary">{Math.round(distance)} cm</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-1">Current Speed</p>
                <p className="text-2xl font-bold text-accent">{velocity.toFixed(1)} m/s</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-1">Max Speed</p>
                <p className="text-2xl font-bold text-success">{maxVelocity.toFixed(1)} m/s</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-1">Friction</p>
                <p className="text-2xl font-bold text-secondary">{(surface.friction * 100).toFixed(0)}%</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg">Experiment Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Surface Selection */}
          <div>
            <label className="text-sm font-semibold mb-3 block">
              Choose Surface:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(surfaces) as Surface[]).map((key) => (
                <Button
                  key={key}
                  variant={selectedSurface === key ? "default" : "outline"}
                  onClick={() => {
                    setSelectedSurface(key);
                    reset();
                  }}
                  className="h-auto py-4 flex flex-col gap-2"
                  disabled={isRunning}
                >
                  <span className="text-2xl">{surfaces[key].emoji}</span>
                  <span className="text-xs">{surfaces[key].name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Push Force Slider */}
          <div>
            <label className="text-sm font-semibold mb-3 block">
              Push Force: <Badge variant="secondary">{pushForce[0]}N</Badge>
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
            <Button
              onClick={runSimulation}
              disabled={isRunning}
              className="flex-1"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              Run Experiment
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results Comparison */}
      {testResults.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Test Results Comparison
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearResults}>
              Clear History
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults.map((result, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{result.surface}</Badge>
                    <span className="text-sm text-muted-foreground">{result.force}N push</span>
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
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            📚 What Did You Learn?
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Different surfaces create different amounts of friction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Smoother surfaces (like ice) have less friction than rough surfaces</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>More push force creates higher initial velocity, making the cart travel farther</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Friction force slows the cart down by opposing its motion (deceleration)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Wheels reduce friction by rolling instead of sliding!</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FrictionSimulator;
