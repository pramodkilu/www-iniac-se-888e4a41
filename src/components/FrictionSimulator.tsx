import { useState, useEffect, useRef } from "react";
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

  const surfaces = {
    ice: { name: "Ice", friction: 0.1, color: "bg-cyan-200", emoji: "🧊" },
    wood: { name: "Wood", friction: 0.4, color: "bg-amber-200", emoji: "🪵" },
    carpet: { name: "Carpet", friction: 0.7, color: "bg-red-200", emoji: "🟥" },
    rough: { name: "Rough Ground", friction: 0.9, color: "bg-stone-400", emoji: "⛰️" }
  };

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
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const cartPosition = Math.min((distance / 200) * 100, 90);
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
          {/* Simulation Area */}
          <div className="relative h-40 rounded-lg border-2 border-border overflow-hidden">
            {/* Surface Background */}
            <div className={`absolute inset-0 ${surface.color} opacity-50`}>
              <div className="absolute inset-0 grid grid-cols-20 gap-1 p-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="text-2xl opacity-30">{surface.emoji}</div>
                ))}
              </div>
            </div>
            
            {/* Cart */}
            <div
              className="absolute bottom-8 transition-all duration-100"
              style={{ left: `${cartPosition}%` }}
            >
              <div className="relative">
                {/* Cart Body */}
                <div className="w-16 h-10 bg-primary rounded-t-lg shadow-lg border-2 border-primary-foreground/20" />
                {/* Wheels */}
                <div className="flex justify-between -mt-2 px-1">
                  <div className={`w-5 h-5 rounded-full bg-foreground border-2 border-primary ${isRunning ? 'animate-spin' : ''}`}>
                    <div className="w-1 h-1 bg-background rounded-full mt-2 ml-2" />
                  </div>
                  <div className={`w-5 h-5 rounded-full bg-foreground border-2 border-primary ${isRunning ? 'animate-spin' : ''}`}>
                    <div className="w-1 h-1 bg-background rounded-full mt-2 ml-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Finish Line */}
            <div className="absolute right-4 top-0 bottom-0 w-1 bg-accent opacity-50" />
          </div>

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
