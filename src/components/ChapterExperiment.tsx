import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, CheckCircle2, Zap } from "lucide-react";
import FrictionSimulator from "./FrictionSimulator";

interface Props { chapterId: number; lang?: "en" | "sv"; }

// ── Shared shell ─────────────────────────────────────────────────────────────
const Learned = ({ items }: { items: string[] }) => (
  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
    <p className="text-[11px] font-bold text-green-700 mb-1.5">🌱 What Did You Learn?</p>
    <ul className="space-y-1">
      {items.map((l, i) => (
        <li key={i} className="flex items-start gap-1.5 text-xs text-green-800">
          <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
          {l}
        </li>
      ))}
    </ul>
  </div>
);

const ExpCard = ({ emoji, title, subtitle, children, learned }: {
  emoji: string; title: string; subtitle?: string;
  children: React.ReactNode; learned: string[];
}) => (
  <Card className="mt-4 border-blue-100">
    <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
      <CardTitle className="flex items-center gap-2 text-base">
        <span className="text-xl">{emoji}</span>
        <div>
          <div>{title}</div>
          {subtitle && <div className="text-xs font-normal text-muted-foreground mt-0.5">{subtitle}</div>}
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-4 space-y-4">
      {children}
      <Learned items={learned} />
    </CardContent>
  </Card>
);

const StatBox = ({ label, value, unit, color = "blue" }: { label: string; value: string; unit?: string; color?: string }) => (
  <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-3`}>
    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
    <p className={`text-lg font-bold text-${color}-700`}>{value}<span className="text-xs ml-1 text-gray-500">{unit}</span></p>
  </div>
);

// ── Ch2: Aerodynamics ────────────────────────────────────────────────────────
const AerodynamicsExp = () => {
  type Shape = "cube" | "sphere" | "tear";
  const [shape, setShape] = useState<Shape>("cube");
  const [speed, setSpeed] = useState([40]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const tRef = useRef(0);
  const coeffs: Record<Shape, number> = { cube: 1.05, sphere: 0.47, tear: 0.04 };
  const names: Record<Shape, string> = { cube: "Brick", sphere: "Ball", tear: "Streamlined" };
  const drag = (coeffs[shape] * 1.2 * speed[0] ** 2 * 0.04).toFixed(1);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#e8f4ff"; ctx.fillRect(0, 0, W, H);
      const v = speed[0];
      for (let i = 0; i < 10; i++) {
        const y = H * (i + 0.5) / 10;
        const x = ((tRef.current * v * 0.8 + i * 60) % (W + 80)) - 80;
        const alpha = 0.2 + (i % 3) * 0.15;
        ctx.strokeStyle = `rgba(99,102,241,${alpha})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 50, y); ctx.stroke();
        ctx.fillStyle = `rgba(99,102,241,${alpha})`;
        ctx.beginPath(); ctx.moveTo(x+50,y); ctx.lineTo(x+42,y-3); ctx.lineTo(x+42,y+3); ctx.fill();
      }
      const cx = W * 0.62, cy = H * 0.5;
      ctx.fillStyle = "#1e40af";
      if (shape === "cube") { ctx.fillRect(cx-28,cy-28,56,56); }
      else if (shape === "sphere") { ctx.beginPath(); ctx.arc(cx,cy,32,0,Math.PI*2); ctx.fill(); }
      else {
        ctx.beginPath(); ctx.moveTo(cx+45,cy);
        ctx.bezierCurveTo(cx+45,cy-20,cx-35,cy-16,cx-50,cy);
        ctx.bezierCurveTo(cx-35,cy+16,cx+45,cy+20,cx+45,cy);
        ctx.fill();
      }
      const dlen = Math.min(parseFloat(drag) * 8, 120);
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx+52,cy); ctx.lineTo(cx+52+dlen,cy); ctx.stroke();
      ctx.fillStyle="#ef4444"; ctx.beginPath();
      ctx.moveTo(cx+52+dlen,cy); ctx.lineTo(cx+44+dlen,cy-5); ctx.lineTo(cx+44+dlen,cy+5); ctx.fill();
      ctx.fillStyle="#ef4444"; ctx.font="bold 11px sans-serif";
      ctx.fillText(`${drag} N`, cx+56, cy-10);
      tRef.current += 0.02;
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [shape, speed[0]]);

  return (
    <ExpCard emoji="💨" title="Aerodynamics Experiment" subtitle="How shape affects air drag"
      learned={["Streamlined shapes reduce drag by up to 26×","Higher speed = much more drag (speed²)","Round shapes have about half the drag of flat ones"]}>
      <canvas ref={canvasRef} width={520} height={200} className="w-full rounded-xl border border-blue-100" />
      <div className="grid grid-cols-3 gap-2">
        {(["cube","sphere","tear"] as Shape[]).map(s => (
          <button key={s} onClick={() => setShape(s)}
            className={`py-2 rounded-lg border text-xs font-semibold transition-colors ${shape===s?"bg-orange-500 text-white border-orange-500":"bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
            {names[s]}<br/><span className="text-[10px] font-normal opacity-75">Cd={coeffs[s]}</span>
          </button>
        ))}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-600 mb-1">Wind Speed: {speed[0]} km/h</p>
        <Slider value={speed} min={10} max={120} step={5} onValueChange={setSpeed} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 uppercase">Drag Force</p>
          <p className="text-lg font-bold text-red-600">{drag} <span className="text-xs text-gray-500">N</span></p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 uppercase">Drag Coefficient</p>
          <p className="text-lg font-bold text-blue-600">{coeffs[shape]}</p>
        </div>
      </div>
    </ExpCard>
  );
};

// ── Ch3: Sequencing (Piece Puzzle) ────────────────────────────────────────────
const SequencingExp = () => {
  const pieces = [
    { id: "P3", holes: 3, color: "#3b82f6" },
    { id: "P5", holes: 5, color: "#8b5cf6" },
    { id: "P7", holes: 7, color: "#ec4899" },
    { id: "P11", holes: 11, color: "#f59e0b" },
  ];
  const [selected, setSelected] = useState<string[]>([]);
  const total = selected.reduce((s, id) => s + (pieces.find(p=>p.id===id)?.holes??0), 0);
  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  return (
    <ExpCard emoji="🔢" title="Sequence Puzzle" subtitle="Find combinations that total exactly 18 holes"
      learned={["P3+P5+P11=19, P3+P7+P11=21... try all combos","Decoding means breaking a goal into smaller parts","Checkpoint chapters test your systematic thinking"]}>
      <div className="bg-gray-50 rounded-xl p-4 border">
        <p className="text-xs font-medium text-gray-500 mb-3">Select BLIX pieces to build the ladder:</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {pieces.map(p => (
            <button key={p.id} onClick={() => toggle(p.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 font-bold text-sm transition-all ${selected.includes(p.id)?"border-orange-500 text-orange-700 bg-orange-50":"border-gray-200 text-gray-600 bg-white hover:border-gray-300"}`}>
              <span className="text-xs px-1.5 py-0.5 rounded text-white font-mono" style={{background: p.color}}>{p.holes}</span>
              {p.id}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-3">
          {selected.length > 0 ? selected.map(id => {
            const p = pieces.find(x=>x.id===id)!;
            return (
              <div key={id} className="flex gap-0.5">
                {Array.from({length: p.holes}).map((_,i) => (
                  <div key={i} className="w-3 h-5 rounded-sm" style={{background: p.color}} />
                ))}
              </div>
            );
          }) : <p className="text-xs text-gray-400 italic">No pieces selected yet…</p>}
        </div>
        <div className={`text-center py-3 rounded-lg font-bold text-sm transition-colors ${total===18?"bg-green-100 text-green-700 border border-green-300":total>18?"bg-red-100 text-red-700 border border-red-300":"bg-blue-50 text-blue-700 border border-blue-200"}`}>
          Total: {total} holes {total===18?"✅ Perfect! 18 holes!":total>18?"❌ Too long!":"← Need "+(18-total)+" more holes"}
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={() => setSelected([])} className="gap-1.5"><RotateCcw className="w-3 h-3" />Reset</Button>
    </ExpCard>
  );
};

// ── Ch4: Lever (Trebuchet) ────────────────────────────────────────────────────
const LeverExp = () => {
  const [leftArm, setLeftArm] = useState([3]);
  const [rightArm, setRightArm] = useState([1]);
  const [leftWeight, setLeftWeight] = useState([5]);
  const torqueL = leftArm[0] * leftWeight[0];
  const torqueR = rightArm[0] * 1;
  const diff = torqueL - torqueR;
  const angle = Math.max(-35, Math.min(35, diff * 2));

  return (
    <ExpCard emoji="⚖️" title="Lever Experiment" subtitle="Balance torques to launch the trebuchet arm"
      learned={["Torque = force × distance from fulcrum","Longer arm = more leverage with same force","Trebuchets use this to fling heavy objects far"]}>
      <div className="bg-gray-50 rounded-xl border p-4 flex flex-col items-center" style={{height:200}}>
        <div className="relative w-full flex-1 flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-700 rounded-full" style={{marginBottom: -4}} />
          <div style={{
            width: 280, height: 8,
            background: "linear-gradient(to right,#92400e,#b45309)",
            borderRadius: 4,
            transform: `rotate(${angle}deg)`,
            transformOrigin: "center center",
            transition: "transform 0.3s ease",
            position: "absolute"
          }} />
          <div style={{
            position:"absolute", left:"calc(50% - 140px + " + (leftArm[0]*20) + "px)",
            transform:`rotate(${angle}deg) translateY(-30px)`,
            transformOrigin: "center bottom",
            transition:"all 0.3s ease"
          }}>
            <div className="w-6 h-6 rounded bg-blue-500 border-2 border-blue-700 flex items-center justify-center text-white text-[9px] font-bold">{leftWeight[0]}kg</div>
          </div>
          <div style={{
            position:"absolute", right:"calc(50% - 140px + " + (rightArm[0]*20) + "px)",
            transform:`rotate(${angle}deg) translateY(-30px)`,
            transformOrigin:"center bottom",
            transition:"all 0.3s ease"
          }}>
            <div className="w-6 h-6 rounded bg-orange-400 border-2 border-orange-600 flex items-center justify-center text-white text-[9px] font-bold">1kg</div>
          </div>
        </div>
        <p className="text-center text-xs mt-2 font-medium text-gray-600">
          {Math.abs(diff) < 1 ? "⚖️ Balanced!" : diff > 0 ? "⬅️ Left side heavier" : "➡️ Right side heavier"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><p className="text-xs font-medium mb-1">Left arm: {leftArm[0]}m</p><Slider value={leftArm} min={1} max={7} step={1} onValueChange={setLeftArm} /></div>
        <div><p className="text-xs font-medium mb-1">Right arm: {rightArm[0]}m</p><Slider value={rightArm} min={1} max={7} step={1} onValueChange={setRightArm} /></div>
        <div><p className="text-xs font-medium mb-1">Left weight: {leftWeight[0]} kg</p><Slider value={leftWeight} min={1} max={10} step={1} onValueChange={setLeftWeight} /></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">Left Torque</p><p className="font-bold text-blue-600">{torqueL} Nm</p></div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">Right Torque</p><p className="font-bold text-orange-600">{torqueR} Nm</p></div>
      </div>
    </ExpCard>
  );
};

// ── Ch5: Signals (Binary) ─────────────────────────────────────────────────────
const SignalsExp = () => {
  const alphabet: Record<string,string> = {A:"01000001",B:"01000010",C:"01000011",D:"01000100",E:"01000101",F:"01000110",G:"01000111",H:"01001000",I:"01001001",J:"01001010",K:"01001011",L:"01001100",M:"01001101",N:"01001110",O:"01001111",P:"01010000",Q:"01010001",R:"01010010",S:"01010011",T:"01010100",U:"01010101",V:"01010110",W:"01010111",X:"01011000",Y:"01011001",Z:"01011010"};
  const [letter, setLetter] = useState("B");
  const bits = alphabet[letter] || "00000000";
  return (
    <ExpCard emoji="💡" title="Binary Signal Encoder" subtitle="How computers send letters using 0s and 1s"
      learned={["Every letter has a unique 8-bit binary code","Bit 1 = light ON, Bit 0 = light OFF","Computers use this to send all data signals"]}>
      <div className="bg-gray-900 rounded-xl p-4 flex flex-col items-center gap-3">
        <div className="text-4xl font-bold text-white tracking-widest">{letter}</div>
        <div className="flex gap-2">
          {bits.split("").map((b, i) => (
            <div key={i} className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${b==="1"?"bg-yellow-300 border-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/50":"bg-gray-700 border-gray-600 text-gray-400"}`}>{b}</div>
          ))}
        </div>
        <p className="text-gray-400 text-xs font-mono">{bits} = {parseInt(bits,2)}</p>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => (
          <button key={l} onClick={() => setLetter(l)}
            className={`w-8 h-8 rounded text-xs font-bold transition-colors ${letter===l?"bg-orange-500 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{l}</button>
        ))}
      </div>
    </ExpCard>
  );
};

// ── Ch6: Suspension ──────────────────────────────────────────────────────────
const SuspensionExp = () => {
  const [bumpSize, setBumpSize] = useState([40]);
  const [hasSuspension, setHasSuspension] = useState(true);
  const [running, setRunning] = useState(false);
  const [carY, setCarY] = useState(0);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setT(prev => prev + 0.15);
      setCarY(prev => {
        const bump = Math.sin(t) * bumpSize[0];
        const damped = hasSuspension ? bump * 0.25 : bump;
        return damped;
      });
    }, 16);
    return () => clearInterval(id);
  }, [running, t, bumpSize[0], hasSuspension]);

  return (
    <ExpCard emoji="🚗" title="Suspension Experiment" subtitle="How springs absorb road bumps"
      learned={["Suspension springs reduce bumps by ~75%","Stiffer = less travel but harsher ride","Terrain engineering matches suspension to terrain"]}>
      <div className="bg-gray-50 rounded-xl border p-4" style={{height:180}}>
        <div className="relative w-full h-full">
          <div className="absolute bottom-6 left-0 right-0 h-2 bg-amber-700 rounded" style={{
            clipPath: `polygon(0 100%, 30% 100%, 32% 0%, 36% 0%, 38% 100%, 62% 100%, 64% 0%, 68% 0%, 70% 100%, 100% 100%, 100% 100%, 0 100%)`
          }} />
          <div className="absolute w-16 h-8 bg-blue-600 rounded-t-lg border-2 border-blue-700 flex items-center justify-center text-white text-[10px] font-bold transition-all"
            style={{ bottom: `${52 - carY}px`, left: "calc(50% - 32px)" }}>
            BLIX 🚗
            {hasSuspension && (
              <div className="absolute -bottom-3 left-2 w-1 bg-orange-400" style={{height: Math.abs(carY)*0.5+4, minHeight:4}} />
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><p className="text-xs font-medium mb-1">Bump size: {bumpSize[0]}mm</p><Slider value={bumpSize} min={5} max={80} step={5} onValueChange={setBumpSize} /></div>
        <div className="flex flex-col gap-2">
          <button onClick={() => setHasSuspension(s=>!s)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${hasSuspension?"bg-orange-500 text-white":"bg-gray-200 text-gray-600"}`}>
            {hasSuspension ? "✅ Suspension ON" : "❌ No Suspension"}
          </button>
          <Button size="sm" onClick={() => { setRunning(r=>!r); setT(0); }} className="gap-1">
            {running ? <><RotateCcw className="w-3 h-3"/>Stop</> : <><Play className="w-3 h-3"/>Run</>}
          </Button>
        </div>
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center text-sm font-bold text-orange-700">
        Body bounce: {hasSuspension ? (bumpSize[0]*0.25).toFixed(0) : bumpSize[0]} mm {hasSuspension?"(damped)":"(full impact)"}
      </div>
    </ExpCard>
  );
};

// ── Ch7: Structural Stability ─────────────────────────────────────────────────
const StabilityExp = () => {
  const [height, setHeight] = useState([3]);
  const [base, setBase] = useState([4]);
  const ratio = base[0] / height[0];
  const stable = ratio >= 0.5;
  const veryStable = ratio >= 0.8;

  return (
    <ExpCard emoji="🏗️" title="Stability Experiment" subtitle="How base vs height determines if a structure stands"
      learned={["Wider base = much more stable structure","Height > 2× base = likely to tip over","Real buildings use wide foundations for stability"]}>
      <div className="bg-gray-50 rounded-xl border p-4 flex items-end justify-center gap-4" style={{height:200}}>
        <div style={{display:"flex",flexDirection:"column-reverse",alignItems:"center",gap:2}}>
          {Array.from({length:height[0]}).map((_,i)=>(
            <div key={i} className={`border-2 rounded transition-colors ${veryStable?"border-green-500 bg-green-100":stable?"border-yellow-500 bg-yellow-100":"border-red-400 bg-red-100"}`}
              style={{width: base[0]*12, height:14}} />
          ))}
        </div>
        <div className="text-3xl" style={{transform: !stable?`rotate(${Math.min(45,(1/ratio-1)*20)}deg)`:"rotate(0deg)", transition:"transform 0.4s", transformOrigin:"bottom center", marginBottom:4}}>
          {veryStable ? "🏠" : stable ? "🤔" : "💥"}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><p className="text-xs font-medium mb-1">Height: {height[0]} blocks</p><Slider value={height} min={1} max={10} step={1} onValueChange={setHeight} /></div>
        <div><p className="text-xs font-medium mb-1">Base width: {base[0]} blocks</p><Slider value={base} min={1} max={8} step={1} onValueChange={setBase} /></div>
      </div>
      <div className={`p-3 rounded-lg text-center text-sm font-bold transition-colors ${veryStable?"bg-green-100 text-green-700":stable?"bg-yellow-100 text-yellow-700":"bg-red-100 text-red-700"}`}>
        {veryStable ? "✅ Very Stable" : stable ? "⚠️ Marginally Stable" : "❌ Will Tip Over"} — Ratio: {ratio.toFixed(2)}
      </div>
    </ExpCard>
  );
};

// ── Ch8: Rack & Pinion ────────────────────────────────────────────────────────
const RackPinionExp = () => {
  const [running, setRunning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [rackPos, setRackPos] = useState(0);
  const [speed, setSpeed] = useState([2]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const stateRef = useRef({ angle: 0, rackPos: 0, running: false, speed: 2 });
  stateRef.current = { angle, rackPos, running, speed: speed[0] };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const R = 35, cx = 100, cy = H/2;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#f8fafc"; ctx.fillRect(0,0,W,H);
      const s = stateRef.current;
      if (s.running) {
        const newAngle = s.angle + s.speed * 0.04;
        const newRack = (s.rackPos + s.speed * 0.04 * R * 0.4) % (W - 80);
        setAngle(newAngle); setRackPos(newRack);
      }
      const a = s.angle, rp = s.rackPos;
      // Gear
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
      ctx.fillStyle = "#1e40af";
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI*2); ctx.fill();
      const nTeeth = 12;
      for (let i = 0; i < nTeeth; i++) {
        const ta = (i / nTeeth) * Math.PI * 2;
        ctx.save(); ctx.rotate(ta);
        ctx.fillStyle = "#1e40af";
        ctx.fillRect(-4, -R-10, 8, 10);
        ctx.restore();
      }
      ctx.fillStyle = "#93c5fd"; ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.fill();
      ctx.restore();
      // Rack
      const rackY = cy + R + 12, rackH = 18, rackW = W - 40;
      ctx.fillStyle = "#374151"; ctx.fillRect(20, rackY, rackW, rackH);
      for (let i = 0; i < 28; i++) {
        const tx = 20 + i * 18 - rp % 18;
        if (tx > 18 && tx < rackW + 20) {
          ctx.fillStyle = "#6b7280";
          ctx.fillRect(tx, rackY - 8, 8, 10);
        }
      }
      ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(cx + rp % 150 - 75, rackY - 2, 5, 0, Math.PI*2); ctx.fill();
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running]);

  return (
    <ExpCard emoji="⚙️" title="Rack & Pinion Mechanism" subtitle="Converting rotation into linear movement"
      learned={["Pinion (round gear) rotates → rack slides linearly","Used in steering systems, elevators, CNC machines","Linear distance = gear radius × rotation angle"]}>
      <canvas ref={canvasRef} width={480} height={160} className="w-full rounded-xl border" />
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={() => setRunning(r => !r)} className="gap-1.5 w-28">
          {running ? <><RotateCcw className="w-3 h-3"/>Stop</> : <><Play className="w-3 h-3"/>Run</>}
        </Button>
        <div className="flex-1"><p className="text-xs font-medium mb-1">Speed: {speed[0]}x</p><Slider value={speed} min={1} max={5} step={1} onValueChange={setSpeed} /></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">Rotation</p><p className="font-bold text-blue-600">{(angle * 180 / Math.PI % 360).toFixed(0)}°</p></div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">Rack Position</p><p className="font-bold text-orange-600">{rackPos.toFixed(0)} mm</p></div>
      </div>
    </ExpCard>
  );
};

// ── Ch9: Data Sorting ─────────────────────────────────────────────────────────
const SortingExp = () => {
  const initial = [8,3,6,1,9,4,7,2,5];
  const [items, setItems] = useState([...initial]);
  const [sorted, setSorted] = useState(false);
  const [steps, setSteps] = useState(0);
  const swap = (i: number) => {
    if (items[i] > items[i+1]) {
      const next = [...items]; [next[i],next[i+1]] = [next[i+1],next[i]];
      setItems(next); setSteps(s=>s+1);
      setSorted(next.join(",") === [...initial].sort((a,b)=>a-b).join(","));
    }
  };
  const colors = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899","#14b8a6","#f59e0b"];
  return (
    <ExpCard emoji="📊" title="Bubble Sort" subtitle="Sort data by comparing neighbours"
      learned={["Bubble sort compares adjacent items and swaps if needed","After N passes, the largest N items are in place","Computers sort millions of records using similar logic"]}>
      <div className="bg-gray-50 rounded-xl border p-4">
        <p className="text-xs text-gray-500 mb-3">Click between two items to swap them if they're in wrong order:</p>
        <div className="flex items-end justify-center gap-1 h-24">
          {items.map((v,i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-gray-600">{v}</span>
              <div className="rounded-sm transition-all duration-300" style={{width:28, height: v*9, background: colors[v-1]}} />
              {i < items.length-1 && (
                <button onClick={() => swap(i)} className="text-[10px] px-1 rounded bg-gray-200 hover:bg-orange-200 mt-1">⇄</button>
              )}
            </div>
          ))}
        </div>
        {sorted && <p className="text-center text-green-600 font-bold text-sm mt-2">✅ Sorted in {steps} swaps!</p>}
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => { setItems([...initial]); setSorted(false); setSteps(0); }} className="gap-1"><RotateCcw className="w-3 h-3"/>Reset</Button>
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 flex items-center"><span className="text-xs text-blue-700 font-medium">Swaps: {steps}</span></div>
      </div>
    </ExpCard>
  );
};

// ── Ch10: Screw ───────────────────────────────────────────────────────────────
const ScrewExp = () => {
  const [turns, setTurns] = useState(0);
  const [pitch, setPitch] = useState([2]);
  const advance = (turns * pitch[0]).toFixed(1);
  return (
    <ExpCard emoji="🔩" title="Screw Experiment" subtitle="How rotation converts to linear force"
      learned={["Screw pitch = linear advance per 1 full turn","Finer pitch = more force but slower advance","Screws are inclined planes wrapped in a spiral"]}>
      <div className="bg-gray-50 rounded-xl border p-6 flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-8 h-32 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full relative overflow-hidden" style={{transform:`translateY(${-parseFloat(advance)*1.5}px)`, transition:"transform 0.3s"}}>
            {Array.from({length:12}).map((_,i)=>(
              <div key={i} className="absolute w-full h-0.5 bg-gray-300 opacity-60" style={{top:`${i*10+((turns*36)%10)}px`, transform:"rotate(-30deg)"}} />
            ))}
          </div>
          <div className="absolute -right-24 text-center">
            <div className="text-2xl font-bold text-orange-600">{advance}mm</div>
            <div className="text-xs text-gray-500">advance</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={()=>setTurns(t=>t-0.5)} className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-bold text-lg hover:bg-gray-300">↶</button>
          <div className="text-center"><div className="text-lg font-bold">{turns}</div><div className="text-xs text-gray-500">turns</div></div>
          <button onClick={()=>setTurns(t=>t+0.5)} className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-lg hover:bg-orange-600">↷</button>
        </div>
      </div>
      <div><p className="text-xs font-medium mb-1">Thread pitch: {pitch[0]}mm per turn</p><Slider value={pitch} min={1} max={5} step={1} onValueChange={setPitch} /></div>
    </ExpCard>
  );
};

// ── Ch11: Spring Oscillator ───────────────────────────────────────────────────
const SpringExp = () => {
  const [running, setRunning] = useState(false);
  const [stiffness, setStiffness] = useState([3]);
  const [mass, setMass] = useState([2]);
  const [y, setY] = useState(0);
  const [vy, setVy] = useState(0);
  const period = (2 * Math.PI * Math.sqrt(mass[0] / stiffness[0])).toFixed(2);
  const animRef = useRef<number>();
  const stateRef = useRef({ y: 0, vy: 0, k: 3, m: 2, running: false });

  useEffect(() => {
    stateRef.current = { y, vy, k: stiffness[0], m: mass[0], running };
  }, [y, vy, stiffness[0], mass[0], running]);

  useEffect(() => {
    if (!running) return;
    setY(80); setVy(0);
    const step = () => {
      const { y: cy, vy: cvy, k, m } = stateRef.current;
      const ay = (-k * cy - 0.3 * cvy) / m;
      const nvy = cvy + ay * 0.05;
      const ny = cy + nvy * 0.05;
      setY(ny); setVy(nvy);
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running]);

  const coils = 10;
  return (
    <ExpCard emoji="🌀" title="Spring Oscillator" subtitle="Elastic energy ↔ kinetic energy"
      learned={[`Period = 2π√(mass/stiffness) = ${period}s`,"Heavier mass → slower oscillation","Stiffer spring → faster oscillation"]}>
      <div className="bg-gray-50 rounded-xl border p-4 flex flex-col items-center" style={{height:220}}>
        <div className="w-8 h-4 bg-gray-400 rounded mb-0" />
        <svg width="32" height={120 + y} viewBox={`0 0 32 ${120+y}`} style={{transition: running?"none":"all 0.3s"}}>
          {Array.from({length:coils}).map((_,i)=>{
            const segH = (100+y)/coils;
            const yOff = i * segH;
            return <path key={i} d={`M 16 ${yOff} Q ${i%2===0?28:4} ${yOff+segH/2} 16 ${yOff+segH}`} fill="none" stroke="#f97316" strokeWidth="3" />;
          })}
        </svg>
        <div className="w-12 h-12 rounded-lg bg-blue-500 border-2 border-blue-700 flex items-center justify-center text-white text-[10px] font-bold shadow-lg"
          style={{transition:running?"none":"all 0.3s"}}>{mass[0]}kg</div>
        <div className="text-xs text-gray-500 mt-2">Extension: {Math.max(0,y).toFixed(0)}px</div>
      </div>
      <div className="flex gap-3">
        <Button size="sm" onClick={() => setRunning(r => !r)} className="gap-1 w-24">
          {running ? <><RotateCcw className="w-3 h-3"/>Stop</> : <><Play className="w-3 h-3"/>Bounce!</>}
        </Button>
        <div className="flex-1 space-y-2">
          <div><p className="text-[10px] font-medium">Stiffness k={stiffness[0]}</p><Slider value={stiffness} min={1} max={8} step={1} onValueChange={v=>{setStiffness(v);setRunning(false);}} /></div>
          <div><p className="text-[10px] font-medium">Mass m={mass[0]}kg</p><Slider value={mass} min={1} max={6} step={1} onValueChange={v=>{setMass(v);setRunning(false);}} /></div>
        </div>
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center"><span className="text-xs font-bold text-orange-600">Period T = {period} s</span></div>
    </ExpCard>
  );
};

// ── Ch12: Gear Ratios ─────────────────────────────────────────────────────────
const GearRatioExp = () => {
  const [teeth1, setTeeth1] = useState([12]);
  const [teeth2, setTeeth2] = useState([36]);
  const ratio = (teeth2[0] / teeth1[0]).toFixed(2);
  const speedUp = (teeth1[0] / teeth2[0] * 100).toFixed(0);
  const [angle, setAngle] = useState(0);
  const animRef = useRef<number>();
  useEffect(() => {
    const step = () => { setAngle(a => a + 0.03); animRef.current = requestAnimationFrame(step); };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const Gear = ({ r, x, y, teeth, dir, color }: { r:number;x:number;y:number;teeth:number;dir:number;color:string }) => {
    const a = dir * angle * (dir > 0 ? 1 : teeth1[0]/teeth2[0]);
    const toothH = r * 0.18;
    const pts = Array.from({length:teeth*2}).map((_,i) => {
      const ang = (i/teeth/2)*Math.PI*2 + a;
      const rr = i%2===0 ? r : r+toothH;
      return `${x+Math.cos(ang)*rr},${y+Math.sin(ang)*rr}`;
    }).join(" ");
    return <polygon points={pts} fill={color} stroke="#fff" strokeWidth="1" />;
  };

  return (
    <ExpCard emoji="⚙️" title="Gear Ratio Simulator" subtitle="How gear sizes control speed and torque"
      learned={[`Ratio ${ratio}:1 means output turns ${speedUp}% speed of input`,"Bigger driven gear = more torque but slower speed","Gear ratio = teeth of driven / teeth of driver"]}>
      <svg width="100%" viewBox="0 0 400 180" className="rounded-xl bg-gray-50 border">
        <Gear r={teeth1[0]*2.2} x={120} y={90} teeth={teeth1[0]} dir={1} color="#1e40af" />
        <Gear r={teeth2[0]*2.2} x={280} y={90} teeth={teeth2[0]} dir={-1} color="#dc2626" />
        <text x="120" y="170" textAnchor="middle" fontSize="11" fill="#374151">Driver: {teeth1[0]}T</text>
        <text x="280" y="170" textAnchor="middle" fontSize="11" fill="#374151">Driven: {teeth2[0]}T</text>
        <text x="200" y="95" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#f97316">{ratio}:1</text>
      </svg>
      <div className="grid grid-cols-2 gap-3">
        <div><p className="text-xs font-medium mb-1">Driver teeth: {teeth1[0]}</p><Slider value={teeth1} min={8} max={40} step={4} onValueChange={setTeeth1} /></div>
        <div><p className="text-xs font-medium mb-1">Driven teeth: {teeth2[0]}</p><Slider value={teeth2} min={8} max={60} step={4} onValueChange={setTeeth2} /></div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">Ratio</p><p className="font-bold text-blue-600">{ratio}:1</p></div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">Output Speed</p><p className="font-bold text-green-600">{speedUp}%</p></div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">Torque ×</p><p className="font-bold text-purple-600">{ratio}×</p></div>
      </div>
    </ExpCard>
  );
};

// ── Ch13: Rotation & Gear Train ───────────────────────────────────────────────
const GearTrainExp = () => {
  const [angle, setAngle] = useState(0);
  const sizes = [20, 36, 16];
  const ratio01 = sizes[1]/sizes[0];
  const ratio12 = sizes[2]/sizes[1];
  const animRef = useRef<number>();
  useEffect(() => {
    const step = () => { setAngle(a => a + 0.02); animRef.current = requestAnimationFrame(step); };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  return (
    <ExpCard emoji="🔧" title="3-Gear Train" subtitle="How rotation and speed change through a gear chain"
      learned={["Each gear reverses rotation direction of the next","Final speed = input speed / (ratio1 × ratio2)","Compound gear trains can achieve very high ratios"]}>
      <svg width="100%" viewBox="0 0 480 200" className="rounded-xl bg-gray-50 border">
        {[{ x:80,  y:100, r:sizes[0]*2.5, teeth:sizes[0], dir:1,  color:"#1e40af", label:"Input" },
          { x:230, y:100, r:sizes[1]*2.5, teeth:sizes[1], dir:-1, color:"#dc2626", label:"Middle" },
          { x:340, y:100, r:sizes[2]*2.5, teeth:sizes[2], dir:1,  color:"#16a34a", label:"Output" }
        ].map(({x,y,r,teeth,dir,label,color},gi)=>{
          const a = angle * dir * (gi===0?1:gi===1?sizes[0]/sizes[1]:sizes[0]/sizes[2]);
          const pts = Array.from({length:teeth*2}).map((_,i)=>{
            const ang = (i/teeth/2)*Math.PI*2 + a;
            const rr = i%2===0 ? r : r+r*0.18;
            return `${x+Math.cos(ang)*rr},${y+Math.sin(ang)*rr}`;
          }).join(" ");
          return (
            <g key={gi}>
              <polygon points={pts} fill={color} stroke="#fff" strokeWidth="1.5" />
              <circle cx={x} cy={y} r={r*0.2} fill="white" />
              <text x={x} y={y+r+18} textAnchor="middle" fontSize="10" fill="#374151">{label}</text>
            </g>
          );
        })}
        <text x={240} y={185} textAnchor="middle" fontSize="11" fill="#f97316" fontWeight="bold">
          Final ratio: {(sizes[1]/sizes[0] * sizes[2]/sizes[1]).toFixed(2)}:1 (same teeth ratio as {sizes[0]}:{sizes[2]})
        </text>
      </svg>
      <div className="grid grid-cols-3 gap-2">
        {["Input (20T)", "Middle (36T)", "Output (16T)"].map((l,i)=>{
          const speeds = [100, (100*sizes[0]/sizes[1]).toFixed(0), (100*sizes[0]/sizes[2]).toFixed(0)];
          const colors = ["blue","red","green"];
          return (
            <div key={i} className={`bg-${colors[i]}-50 border border-${colors[i]}-200 rounded-lg p-2 text-center`}>
              <p className="text-[10px] text-gray-500">{l}</p>
              <p className={`font-bold text-${colors[i]}-600 text-sm`}>{speeds[i]} rpm</p>
            </div>
          );
        })}
      </div>
    </ExpCard>
  );
};

// ── Ch14: Angular Momentum ────────────────────────────────────────────────────
const AngularMomentumExp = () => {
  const [radius, setRadius] = useState([3]);
  const [rpm, setRpm] = useState([60]);
  const [angle, setAngle] = useState(0);
  const momentum = ((radius[0]**2 * rpm[0] * 0.1)).toFixed(1);
  const animRef = useRef<number>();
  useEffect(() => {
    const step = () => { setAngle(a => a + rpm[0] * 0.001); animRef.current = requestAnimationFrame(step); };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [rpm[0]]);

  return (
    <ExpCard emoji="🌀" title="Angular Momentum" subtitle="How spinning mass stores energy"
      learned={["Angular momentum = moment of inertia × angular velocity","Larger radius = much more momentum (radius²)","Gyroscopes and flywheels use this to store energy"]}>
      <svg width="100%" viewBox="0 0 400 180" className="rounded-xl bg-gray-50 border">
        <circle cx={200} cy={90} r={radius[0]*18} fill="#bfdbfe" stroke="#1e40af" strokeWidth="2" />
        <circle cx={200} cy={90} r={6} fill="#1e40af" />
        <circle cx={200 + Math.cos(angle)*radius[0]*18} cy={90 + Math.sin(angle)*radius[0]*18} r={8} fill="#ef4444" />
        <line x1={200} y1={90} x2={200+Math.cos(angle)*radius[0]*18} y2={90+Math.sin(angle)*radius[0]*18} stroke="#1e40af" strokeWidth="2" />
        <text x={200} y={170} textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">L = {momentum} kg·m²/s</text>
      </svg>
      <div className="grid grid-cols-2 gap-3">
        <div><p className="text-xs font-medium mb-1">Radius: {radius[0]}m</p><Slider value={radius} min={1} max={6} step={1} onValueChange={setRadius} /></div>
        <div><p className="text-xs font-medium mb-1">Speed: {rpm[0]} rpm</p><Slider value={rpm} min={10} max={120} step={10} onValueChange={setRpm} /></div>
      </div>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
        <span className="font-bold text-purple-700 text-sm">Angular Momentum = {momentum} kg·m²/s</span>
        <p className="text-xs text-purple-500 mt-1">L = I × ω = mr² × (2π×rpm/60)</p>
      </div>
    </ExpCard>
  );
};

// ── Ch15: Meshing Gears Locking ───────────────────────────────────────────────
const LockingGearExp = () => {
  const [locked, setLocked] = useState(false);
  const [wormTurns, setWormTurns] = useState(0);
  const advance = wormTurns / 20;
  return (
    <ExpCard emoji="🔐" title="Locking Gear Mechanism" subtitle="How gears create self-locking systems"
      learned={["Worm gears: worm rotates wheel, wheel cannot rotate worm","This creates a mechanical lock — self-locking!","Used in guitar tuners, lifts, conveyor belts"]}>
      <div className="bg-gray-50 rounded-xl border p-4 flex flex-col items-center gap-3">
        <svg viewBox="0 0 300 150" className="w-full">
          <ellipse cx={150} cy={75} rx={60} ry={60} fill="#bfdbfe" stroke="#1e40af" strokeWidth="2" />
          {Array.from({length:20}).map((_,i) => {
            const a = (i/20)*Math.PI*2 + advance*Math.PI*2;
            return <rect key={i} x={150+Math.cos(a)*56-3} y={75+Math.sin(a)*56-3} width="6" height="6" fill="#1e40af" transform={`rotate(${a*180/Math.PI},${150+Math.cos(a)*56},{75+Math.sin(a)*56})`} />;
          })}
          <rect x={20} y={65} width={100} height={20} rx={4} fill="#f97316" />
          {Array.from({length:8}).map((_,i) => (
            <rect key={i} x={22+i*13} y={60} width="8" height="12" rx={2} fill="#ea580c" />
          ))}
          <text x={150} y={140} textAnchor="middle" fontSize="11" fill="#374151">
            {locked ? "🔒 Locked — Gear cannot back-drive" : "🔓 Turn worm to advance gear"}
          </text>
        </svg>
        <div className="flex items-center gap-4">
          <button onClick={() => setWormTurns(t => t - 1)} disabled={locked} className="w-10 h-10 rounded-full bg-gray-200 disabled:opacity-40 font-bold text-lg hover:bg-gray-300">←</button>
          <span className="text-sm font-medium">{wormTurns} turns</span>
          <button onClick={() => setWormTurns(t => t + 1)} disabled={locked} className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-lg disabled:opacity-40 hover:bg-orange-600">→</button>
          <button onClick={() => setLocked(l => !l)} className={`px-4 py-2 rounded-lg text-sm font-bold ${locked?"bg-red-500 text-white":"bg-green-100 text-green-700"}`}>
            {locked ? "🔒 Locked" : "🔓 Unlock"}
          </button>
        </div>
      </div>
    </ExpCard>
  );
};

// ── Ch16: Circumference ───────────────────────────────────────────────────────
const CircumferenceExp = () => {
  const [diameter, setDiameter] = useState([10]);
  const [angle, setAngle] = useState(0);
  const [rolling, setRolling] = useState(false);
  const animRef = useRef<number>();
  const circ = (Math.PI * diameter[0]).toFixed(1);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    if (!rolling) return;
    const step = () => {
      setAngle(a => a + 0.05);
      setDist(d => d + Math.PI * diameter[0] * 0.05 / (Math.PI * 2));
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [rolling, diameter[0]]);

  const rollPos = dist % 200;
  return (
    <ExpCard emoji="⭕" title="Circumference & Rolling" subtitle="Distance a wheel travels per rotation"
      learned={[`Circumference = π × diameter = π × ${diameter[0]} = ${circ}cm`,"One full rotation = exactly one circumference of distance","Odometers count wheel rotations to measure distance"]}>
      <svg width="100%" viewBox="0 0 480 140" className="rounded-xl bg-gray-50 border">
        <line x1={20} y1={110} x2={460} y2={110} stroke="#374151" strokeWidth="3" />
        {Array.from({length:20}).map((_,i) => (
          <line key={i} x1={20+i*22} y1={106} x2={20+i*22} y2={118} stroke="#374151" strokeWidth="1.5" />
        ))}
        <g transform={`translate(${80 + rollPos}, 110) rotate(${angle * 180 / Math.PI})`}>
          <circle r={diameter[0]*2.5} fill="#bfdbfe" stroke="#1e40af" strokeWidth="2" />
          <line x1={0} y1={0} x2={0} y2={-diameter[0]*2.5} stroke="#ef4444" strokeWidth="2" />
          <circle r={4} fill="#1e40af" />
        </g>
        <text x={240} y={135} textAnchor="middle" fontSize="11" fill="#374151">Distance: {dist.toFixed(1)} cm</text>
      </svg>
      <div><p className="text-xs font-medium mb-1">Wheel diameter: {diameter[0]} cm</p>
        <Slider value={diameter} min={4} max={20} step={2} onValueChange={v => { setDiameter(v); setDist(0); setAngle(0); }} />
      </div>
      <div className="flex gap-3">
        <Button size="sm" onClick={() => { setRolling(r => !r); }} className="gap-1">
          {rolling ? <><RotateCcw className="w-3 h-3"/>Stop</> : <><Play className="w-3 h-3"/>Roll!</>}
        </Button>
        <div className="bg-orange-50 border border-orange-200 rounded-lg flex-1 flex items-center justify-center">
          <span className="text-xs font-bold text-orange-700">C = π × {diameter[0]} = {circ} cm</span>
        </div>
      </div>
    </ExpCard>
  );
};

// ── Ch17: Pulley ──────────────────────────────────────────────────────────────
const PulleyExp = () => {
  const [pulleys, setPulleys] = useState(1);
  const [load, setLoad] = useState([10]);
  const force = (load[0] / pulleys).toFixed(1);
  const ropeLen = (load[0] / pulleys * 2).toFixed(1);
  return (
    <ExpCard emoji="🏋️" title="Pulley System" subtitle="Using wheels and rope to lift heavy loads"
      learned={[`${pulleys} pulley(s) = lift ${load[0]}kg with only ${force}kg force`,"More pulleys = less force BUT more rope needed","Mechanical advantage = number of rope segments"]}>
      <div className="bg-gray-50 rounded-xl border p-4">
        <div className="flex justify-center gap-8">
          {Array.from({length:pulleys}).map((_,i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-2 h-4 bg-gray-400 rounded-full" />
              <div className="w-10 h-10 rounded-full border-4 border-blue-600 bg-blue-100 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-800" />
              </div>
              <div className="w-0.5 h-12 bg-gray-500" />
              <div className="w-12 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-[10px] font-bold">{load[0]}kg</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {[1,2,3,4].map(n => (
          <button key={n} onClick={() => setPulleys(n)}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${pulleys===n?"bg-orange-500 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {n} Pulley{n>1?"s":""}
          </button>
        ))}
      </div>
      <div><p className="text-xs font-medium mb-1">Load weight: {load[0]} kg</p><Slider value={load} min={2} max={50} step={2} onValueChange={setLoad} /></div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">Load</p><p className="font-bold text-red-600">{load[0]} kg</p></div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">Force needed</p><p className="font-bold text-green-600">{force} kg</p></div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">Rope pulled</p><p className="font-bold text-blue-600">{ropeLen} m</p></div>
      </div>
    </ExpCard>
  );
};

// ── Ch18: Crank-Slider ────────────────────────────────────────────────────────
const CrankSliderExp = () => {
  const [running, setRunning] = useState(false);
  const [crank, setCrank] = useState([60]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const angleRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const cx = 180, cy = H/2, R = crank[0]*0.5, L = R * 2.5;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#f8fafc"; ctx.fillRect(0,0,W,H);
      if (running) angleRef.current += 0.04;
      const a = angleRef.current;
      const ex = cx + R * Math.cos(a), ey = cy + R * Math.sin(a);
      const px = ex + Math.sqrt(L*L - (ey-cy)*(ey-cy));
      // Crank
      ctx.strokeStyle = "#1e40af"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(ex,ey); ctx.stroke();
      // Connecting rod
      ctx.strokeStyle = "#f97316"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(ex,ey); ctx.lineTo(px,cy); ctx.stroke();
      // Piston
      ctx.fillStyle = "#374151"; ctx.fillRect(px-4, cy-16, 32, 32);
      // Rail
      ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 2; ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(px, cy-20); ctx.lineTo(W-20, cy-20);
      ctx.moveTo(px, cy+20); ctx.lineTo(W-20, cy+20); ctx.stroke(); ctx.setLineDash([]);
      // Pivot
      ctx.fillStyle = "#1e40af"; ctx.beginPath(); ctx.arc(cx,cy,8,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.arc(ex,ey,5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = "#374151"; ctx.font="11px sans-serif";
      ctx.fillText(`Stroke: ${(px-cx).toFixed(0)}px`, 10, H-10);
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running, crank[0]]);

  return (
    <ExpCard emoji="🔄" title="Crank-Slider Mechanism" subtitle="Rotation → linear motion (like a car engine)"
      learned={["Crank rotation → piston slides back and forth","Stroke length = 2 × crank radius","Car engines use 4+ cylinders for smooth power delivery"]}>
      <canvas ref={canvasRef} width={460} height={160} className="w-full rounded-xl border" />
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={() => setRunning(r => !r)} className="gap-1.5 w-28">
          {running ? <><RotateCcw className="w-3 h-3"/>Stop</> : <><Play className="w-3 h-3"/>Animate</>}
        </Button>
        <div className="flex-1"><p className="text-xs font-medium mb-1">Crank length: {crank[0]}px</p><Slider value={crank} min={30} max={80} step={5} onValueChange={v=>{setCrank(v);angleRef.current=0;}} /></div>
      </div>
    </ExpCard>
  );
};

// ── Ch19: 7-Segment Display ────────────────────────────────────────────────────
const SevenSegmentExp = () => {
  const [digit, setDigit] = useState(8);
  const segs: Record<number, boolean[]> = {
    0:[1,1,1,1,1,1,0], 1:[0,1,1,0,0,0,0], 2:[1,1,0,1,1,0,1],
    3:[1,1,1,1,0,0,1], 4:[0,1,1,0,0,1,1], 5:[1,0,1,1,0,1,1],
    6:[1,0,1,1,1,1,1], 7:[1,1,1,0,0,0,0], 8:[1,1,1,1,1,1,1], 9:[1,1,1,1,0,1,1]
  };
  const labels = ["Top","Top-R","Bot-R","Bottom","Bot-L","Top-L","Middle"];
  const s = segs[digit];
  return (
    <ExpCard emoji="🔢" title="7-Segment Display" subtitle="How digital numbers are made from 7 LED segments"
      learned={["Every digit 0-9 uses a unique combination of 7 segments","LED ON/OFF pattern is stored as 7 bits in memory","Clocks, calculators and scoreboard use this display"]}>
      <div className="flex items-center gap-6 justify-center">
        <svg viewBox="0 0 80 120" width={120} height={180}>
          {/* Top */}
          <rect x={10} y={5} width={60} height={10} rx={4} fill={s[0]?"#ef4444":"#fecaca"} />
          {/* Top-Right */}
          <rect x={70} y={10} width={10} height={50} rx={4} fill={s[1]?"#ef4444":"#fecaca"} />
          {/* Bot-Right */}
          <rect x={70} y={65} width={10} height={50} rx={4} fill={s[2]?"#ef4444":"#fecaca"} />
          {/* Bottom */}
          <rect x={10} y={110} width={60} height={10} rx={4} fill={s[3]?"#ef4444":"#fecaca"} />
          {/* Bot-Left */}
          <rect x={0} y={65} width={10} height={50} rx={4} fill={s[4]?"#ef4444":"#fecaca"} />
          {/* Top-Left */}
          <rect x={0} y={10} width={10} height={50} rx={4} fill={s[5]?"#ef4444":"#fecaca"} />
          {/* Middle */}
          <rect x={10} y={57} width={60} height={10} rx={4} fill={s[6]?"#ef4444":"#fecaca"} />
        </svg>
        <div className="flex flex-col gap-1.5">
          {labels.map((l, i) => (
            <div key={i} className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${s[i]?"bg-red-100 text-red-700 font-bold":"bg-gray-100 text-gray-400"}`}>
              <div className={`w-3 h-3 rounded-full ${s[i]?"bg-red-500":"bg-gray-300"}`} />
              {l}: {s[i]?"ON":"off"}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 justify-center">
        {[0,1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => setDigit(n)}
            className={`w-9 h-9 rounded-lg text-sm font-bold ${digit===n?"bg-orange-500 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{n}</button>
        ))}
      </div>
    </ExpCard>
  );
};

// ── Ch20: Orbit ────────────────────────────────────────────────────────────────
const OrbitExp = () => {
  const [speed, setSpeed] = useState([1]);
  const [dist, setDist] = useState([80]);
  const [angle, setAngle] = useState(0);
  const animRef = useRef<number>();
  useEffect(() => {
    const step = () => { setAngle(a => a + speed[0] * 0.015); animRef.current = requestAnimationFrame(step); };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [speed[0]]);
  const ex = 200 + dist[0] * Math.cos(angle), ey = 95 + dist[0] * 0.4 * Math.sin(angle);
  return (
    <ExpCard emoji="🌍" title="Orbital Motion" subtitle="How planets orbit stars due to gravity"
      learned={["Orbit happens when gravity balances forward velocity","Closer orbit = faster speed (Kepler's 3rd law)","Earth completes one orbit every 365.25 days"]}>
      <svg width="100%" viewBox="0 0 400 190" className="rounded-xl bg-gray-900 border border-gray-700">
        <defs><radialGradient id="sun"><stop offset="0%" stopColor="#fef08a"/><stop offset="100%" stopColor="#f97316"/></radialGradient></defs>
        <ellipse cx={200} cy={95} rx={dist[0]} ry={dist[0]*0.4} fill="none" stroke="#ffffff22" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx={200} cy={95} r={22} fill="url(#sun)" />
        <text x={200} y={100} textAnchor="middle" fontSize="16">☀️</text>
        <circle cx={ex} cy={ey} r={12} fill="#3b82f6" />
        <text x={ex} y={ey+4} textAnchor="middle" fontSize="10">🌍</text>
        <text x={200} y={185} textAnchor="middle" fontSize="11" fill="#9ca3af">
          Orbit radius: {dist[0]}M km · Speed: {speed[0]}× · Day: {(angle/(2*Math.PI)*365).toFixed(0)}
        </text>
      </svg>
      <div className="grid grid-cols-2 gap-3">
        <div><p className="text-xs font-medium mb-1">Orbit speed: {speed[0]}×</p><Slider value={speed} min={1} max={5} step={1} onValueChange={setSpeed} /></div>
        <div><p className="text-xs font-medium mb-1">Distance: {dist[0]} M km</p><Slider value={dist} min={40} max={140} step={10} onValueChange={setDist} /></div>
      </div>
    </ExpCard>
  );
};

// ── Ch21: Number Sequences ────────────────────────────────────────────────────
const SequenceExp21 = () => {
  const sequences = [
    { pattern: "×2", seq: [1,2,4,8,16], answer: 32, hint: "Each number doubles!" },
    { pattern: "+3", seq: [2,5,8,11,14], answer: 17, hint: "Adding 3 each time" },
    { pattern: "Fibonacci", seq: [1,1,2,3,5], answer: 8, hint: "Add the two previous numbers" },
    { pattern: "Squares", seq: [1,4,9,16,25], answer: 36, hint: "1²=1, 2²=4, 3²=9..." },
  ];
  const [qi, setQi] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct"|"wrong"|null>(null);
  const q = sequences[qi];
  const check = () => setResult(parseInt(input) === q.answer ? "correct" : "wrong");
  return (
    <ExpCard emoji="📐" title="Number Sequences" subtitle="Find the pattern and predict the next number"
      learned={["Sequences follow mathematical rules","Fibonacci appears in nature: sunflowers, shells","Recognising patterns is a key coding skill"]}>
      <div className="bg-gray-50 rounded-xl border p-4">
        <div className="flex items-center gap-2 justify-center mb-4">
          {q.seq.map((n,i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-10 h-10 rounded-lg bg-blue-100 border-2 border-blue-300 flex items-center justify-center font-bold text-blue-700">{n}</div>
              {i < q.seq.length - 1 && <span className="text-gray-400">→</span>}
            </div>
          ))}
          <span className="text-gray-400">→</span>
          <div className="w-10 h-10 rounded-lg border-2 border-dashed border-orange-400 bg-orange-50 flex items-center justify-center font-bold text-orange-600 text-xl">?</div>
        </div>
        <p className="text-xs text-center text-gray-500 mb-3">Pattern: <strong>{q.pattern}</strong> — {q.hint}</p>
        <div className="flex gap-2 justify-center">
          <input type="number" value={input} onChange={e => { setInput(e.target.value); setResult(null); }}
            className="w-20 text-center border-2 rounded-lg p-2 font-bold text-lg focus:border-orange-400 outline-none" placeholder="?" />
          <Button onClick={check} size="sm">Check!</Button>
        </div>
        {result && <p className={`text-center font-bold mt-2 ${result==="correct"?"text-green-600":"text-red-500"}`}>{result==="correct"?"🎉 Correct! The answer is "+q.answer:"❌ Try again!"}</p>}
      </div>
      <div className="flex gap-2 justify-center">
        {sequences.map((_,i) => (
          <button key={i} onClick={() => { setQi(i); setInput(""); setResult(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${qi===i?"bg-orange-500 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Q{i+1}</button>
        ))}
      </div>
    </ExpCard>
  );
};

// ── Ch22: Measurement ─────────────────────────────────────────────────────────
const MeasurementExp = () => {
  const [unit, setUnit] = useState<"mm"|"cm"|"m">("cm");
  const [value, setValue] = useState([15]);
  const conversions: Record<string, number[]> = {
    mm: [value[0], value[0]/10, value[0]/1000],
    cm: [value[0]*10, value[0], value[0]/100],
    m: [value[0]*1000, value[0]*100, value[0]],
  };
  return (
    <ExpCard emoji="📏" title="Standard Measurement" subtitle="Convert between mm, cm and metres"
      learned={["10mm = 1cm, 100cm = 1m","BLIX pieces: P3=3 holes=24mm, P11=11 holes=88mm","Engineers use standard units to share measurements globally"]}>
      <div className="bg-gray-50 rounded-xl border p-4">
        <div className="flex items-end justify-start h-16 relative mb-2">
          <div className="h-full border-l-2 border-gray-400 relative flex items-end" style={{width: Math.min(value[0] * (unit==="mm"?1:unit==="cm"?10:100) * 0.3, 400)}}>
            <div className="h-4 bg-orange-400 w-full" />
            <div className="absolute top-0 right-0 border-r-2 border-gray-400 h-full" />
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mb-3">
          {Array.from({length:11}).map((_,i) => <span key={i}>{i*10}</span>)}
        </div>
        <div className="flex gap-2 mb-3">
          {(["mm","cm","m"] as const).map(u => (
            <button key={u} onClick={() => setUnit(u)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${unit===u?"bg-orange-500 text-white":"bg-gray-200 text-gray-600"}`}>{u}</button>
          ))}
        </div>
        <p className="text-xs font-medium mb-1">Length: {value[0]} {unit}</p>
        <Slider value={value} min={1} max={100} step={1} onValueChange={setValue} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(["mm","cm","m"] as const).map((u,i) => (
          <div key={u} className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-500">{u}</p>
            <p className="font-bold text-blue-600 text-sm">{conversions[unit][i].toFixed(u==="mm"?0:u==="cm"?1:3)}</p>
          </div>
        ))}
      </div>
    </ExpCard>
  );
};

// ── Ch23: Balance ─────────────────────────────────────────────────────────────
const BalanceExp = () => {
  const [leftWeights, setLeftWeights] = useState<number[]>([]);
  const [rightWeights, setRightWeights] = useState<number[]>([]);
  const options = [1,5,10,50];
  const sumL = leftWeights.reduce((a,b)=>a+b,0);
  const sumR = rightWeights.reduce((a,b)=>a+b,0);
  const diff = sumL - sumR;
  const tilt = Math.max(-30, Math.min(30, diff * 0.5));
  return (
    <ExpCard emoji="⚖️" title="Balance Scale" subtitle="Compare and measure mass"
      learned={["Equal mass on both sides = balanced","Mass is measured by comparing to known weights","Used in laboratories and markets worldwide"]}>
      <div className="bg-gray-50 rounded-xl border p-4 flex flex-col items-center" style={{height:180}}>
        <div className="w-2 h-6 bg-gray-500 rounded" />
        <div className="relative flex items-center justify-center" style={{width:280,height:16}}>
          <div className="w-full h-3 bg-amber-700 rounded absolute" style={{transform:`rotate(${tilt}deg)`,transition:"transform 0.4s"}} />
        </div>
        <div className="flex justify-between w-64 mt-1">
          <div className={`w-20 min-h-12 border-2 rounded-lg p-1.5 text-center ${Math.abs(tilt)<3?"border-green-400 bg-green-50":"border-blue-300 bg-blue-50"}`} style={{transform:`rotate(${-tilt*0.5}deg)`,transition:"transform 0.4s"}}>
            <p className="text-[10px] text-gray-500">Left: {sumL}g</p>
            <div className="flex flex-wrap gap-0.5 justify-center">{leftWeights.map((w,i)=><span key={i} className="text-[9px] bg-blue-300 text-white px-1 rounded">{w}g</span>)}</div>
          </div>
          <div className={`w-20 min-h-12 border-2 rounded-lg p-1.5 text-center ${Math.abs(tilt)<3?"border-green-400 bg-green-50":"border-orange-300 bg-orange-50"}`} style={{transform:`rotate(${tilt*0.5}deg)`,transition:"transform 0.4s"}}>
            <p className="text-[10px] text-gray-500">Right: {sumR}g</p>
            <div className="flex flex-wrap gap-0.5 justify-center">{rightWeights.map((w,i)=><span key={i} className="text-[9px] bg-orange-300 text-white px-1 rounded">{w}g</span>)}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-medium mb-1">Add to LEFT:</p>
          <div className="flex gap-1 flex-wrap">
            {options.map(w => <button key={w} onClick={() => setLeftWeights(p=>[...p,w])} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-bold hover:bg-blue-200">+{w}g</button>)}
            {leftWeights.length>0 && <button onClick={()=>setLeftWeights(p=>p.slice(0,-1))} className="px-2 py-1 bg-gray-200 text-xs rounded">−</button>}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium mb-1">Add to RIGHT:</p>
          <div className="flex gap-1 flex-wrap">
            {options.map(w => <button key={w} onClick={() => setRightWeights(p=>[...p,w])} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-bold hover:bg-orange-200">+{w}g</button>)}
            {rightWeights.length>0 && <button onClick={()=>setRightWeights(p=>p.slice(0,-1))} className="px-2 py-1 bg-gray-200 text-xs rounded">−</button>}
          </div>
        </div>
      </div>
      <div className={`p-2 rounded-lg text-center text-sm font-bold ${Math.abs(diff)<1?"bg-green-100 text-green-700":diff>0?"bg-blue-100 text-blue-700":"bg-orange-100 text-orange-700"}`}>
        {Math.abs(diff)<1?"⚖️ Balanced!":diff>0?`Left is ${diff}g heavier →`:`← Right is ${-diff}g heavier`}
      </div>
    </ExpCard>
  );
};

// ── Ch24: Electric Motor ──────────────────────────────────────────────────────
const MotorExp = () => {
  const [voltage, setVoltage] = useState([6]);
  const [load, setLoad] = useState([2]);
  const rpm = Math.max(0, ((voltage[0] * 180) / load[0]).toFixed(0));
  const [angle, setAngle] = useState(0);
  const animRef = useRef<number>();
  useEffect(() => {
    const step = () => { setAngle(a => a + parseFloat(rpm as string) * 0.002); animRef.current = requestAnimationFrame(step); };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [rpm]);

  return (
    <ExpCard emoji="⚡" title="Electric Motor" subtitle="How voltage and load control motor speed"
      learned={["More voltage = faster rotation","Heavier load = slower motor (more current drawn)","Motors convert electrical energy → mechanical energy"]}>
      <div className="bg-gray-900 rounded-xl p-4 flex flex-col items-center">
        <svg viewBox="0 0 200 140" width="200" height="140">
          <rect x={50} y={20} width={100} height={80} rx={10} fill="#16a34a" stroke="#14532d" strokeWidth="2" />
          <circle cx={100} cy={60} r={25} fill="#166534" />
          <line x1={100} y1={60} x2={100+25*Math.cos(angle)} y2={60+25*Math.sin(angle)} stroke="#fbbf24" strokeWidth="3" />
          <circle cx={100} cy={60} r={5} fill="#fbbf24" />
          <rect x={95} y={100} width={10} height={30} fill="#6b7280" />
          <text x={100} y={135} textAnchor="middle" fontSize="10" fill="white">{rpm} RPM</text>
        </svg>
        <div className="flex gap-4 text-center">
          <div><p className="text-gray-400 text-xs">Voltage</p><p className="text-yellow-400 font-bold">{voltage[0]}V</p></div>
          <div><Zap className="w-5 h-5 text-yellow-400 mx-auto" /></div>
          <div><p className="text-gray-400 text-xs">Speed</p><p className="text-green-400 font-bold">{rpm} RPM</p></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><p className="text-xs font-medium mb-1">Voltage: {voltage[0]}V</p><Slider value={voltage} min={1} max={12} step={1} onValueChange={setVoltage} /></div>
        <div><p className="text-xs font-medium mb-1">Load: {load[0]}× (friction)</p><Slider value={load} min={1} max={5} step={1} onValueChange={setLoad} /></div>
      </div>
    </ExpCard>
  );
};

// ── Ch25: Design Thinking (Checkpoint) ────────────────────────────────────────
const DesignThinkingExp = () => {
  const steps = [
    { icon:"🔍", title:"Empathise", desc:"Understand the user's problem" },
    { icon:"📝", title:"Define", desc:"Clearly state the problem" },
    { icon:"💡", title:"Ideate", desc:"Brainstorm many solutions" },
    { icon:"🔨", title:"Prototype", desc:"Build a quick model" },
    { icon:"🧪", title:"Test", desc:"Try it and get feedback" },
  ];
  const [done, setDone] = useState<number[]>([]);
  return (
    <ExpCard emoji="🎯" title="Design Thinking Process" subtitle="The 5 steps engineers use to solve problems"
      learned={["Design thinking is iterative — go back when needed","Prototyping fast reveals problems early","Real engineers test before launching products"]}>
      <div className="space-y-2">
        {steps.map((s, i) => (
          <button key={i} onClick={() => setDone(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev, i])}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${done.includes(i)?"border-green-400 bg-green-50":"border-gray-200 bg-white hover:border-orange-300"}`}>
            <span className="text-xl">{done.includes(i)?"✅":s.icon}</span>
            <div>
              <p className={`text-sm font-bold ${done.includes(i)?"text-green-700":"text-gray-800"}`}>{s.title}</p>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
            {done.includes(i) && <Badge className="ml-auto bg-green-100 text-green-700 text-[10px]">Done</Badge>}
          </button>
        ))}
      </div>
      <div className={`p-3 rounded-xl text-center font-bold ${done.length===5?"bg-green-100 text-green-700":"bg-gray-100 text-gray-600"}`}>
        {done.length}/5 steps completed {done.length===5?"🎉 Design process complete!":""}
      </div>
    </ExpCard>
  );
};

// ── Ch26: Clock ────────────────────────────────────────────────────────────────
const ClockExp = () => {
  const [hours, setHours] = useState([10]);
  const [minutes, setMinutes] = useState([30]);
  const hAngle = (hours[0] % 12 + minutes[0]/60) / 12 * Math.PI * 2 - Math.PI/2;
  const mAngle = minutes[0] / 60 * Math.PI * 2 - Math.PI/2;
  const period = (hours[0] % 12 === 0 && minutes[0] < 30) || hours[0] < 12 ? "AM" : "PM";
  return (
    <ExpCard emoji="🕐" title="Clock Mechanics" subtitle="How gears inside a clock track time"
      learned={["Hour hand moves 1/12 as fast as minute hand","Minute hand: 1 full rotation = 60 minutes","Clock gear ratios: 60:1 from seconds to minutes to hours"]}>
      <div className="flex gap-6 items-center justify-center">
        <svg viewBox="0 0 200 200" width={180} height={180}>
          <circle cx={100} cy={100} r={90} fill="white" stroke="#e5e7eb" strokeWidth="4" />
          {Array.from({length:12}).map((_,i) => {
            const a = (i/12)*Math.PI*2 - Math.PI/2;
            return (
              <g key={i}>
                <line x1={100+Math.cos(a)*75} y1={100+Math.sin(a)*75} x2={100+Math.cos(a)*85} y2={100+Math.sin(a)*85} stroke="#374151" strokeWidth={i%3===0?3:1.5} />
                {i%3===0 && <text x={100+Math.cos(a)*60} y={100+Math.sin(a)*60+4} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#374151">{i===0?12:i}</text>}
              </g>
            );
          })}
          <line x1={100} y1={100} x2={100+Math.cos(hAngle)*45} y2={100+Math.sin(hAngle)*45} stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
          <line x1={100} y1={100} x2={100+Math.cos(mAngle)*65} y2={100+Math.sin(mAngle)*65} stroke="#374151" strokeWidth="3" strokeLinecap="round" />
          <circle cx={100} cy={100} r={5} fill="#ef4444" />
        </svg>
        <div className="space-y-3">
          <div className="text-2xl font-bold text-center">{String(hours[0]).padStart(2,"0")}:{String(minutes[0]).padStart(2,"0")} {period}</div>
          <div><p className="text-xs font-medium mb-1">Hours: {hours[0]}</p><Slider value={hours} min={1} max={12} step={1} onValueChange={setHours} /></div>
          <div><p className="text-xs font-medium mb-1">Minutes: {minutes[0]}</p><Slider value={minutes} min={0} max={59} step={1} onValueChange={setMinutes} /></div>
        </div>
      </div>
    </ExpCard>
  );
};

// ── Ch27: Circuit Builder ─────────────────────────────────────────────────────
const CircuitExp = () => {
  const [sw, setSw] = useState(false);
  const [bulbs, setBulbs] = useState([true, true]);
  const allOn = sw && bulbs.every(b => b);
  return (
    <ExpCard emoji="💡" title="Open & Closed Circuits" subtitle="When does electricity flow?"
      learned={["Closed circuit = electrons can flow all the way round","One open switch or broken wire stops all current","Series circuit: one broken bulb stops all (like old Xmas lights)"]}>
      <div className="bg-gray-900 rounded-xl p-6 flex flex-col items-center gap-4">
        <svg viewBox="0 0 360 160" className="w-full">
          {/* Wires */}
          <path d="M 30 80 L 30 30 L 180 30 L 180 50" stroke={allOn?"#fbbf24":"#374151"} strokeWidth="3" fill="none" />
          <path d="M 30 80 L 30 130 L 330 130 L 330 80" stroke={allOn?"#fbbf24":"#374151"} strokeWidth="3" fill="none" />
          <path d="M 180 110 L 180 130" stroke={allOn?"#fbbf24":"#374151"} strokeWidth="3" fill="none" />
          <path d="M 270 80 L 330 80" stroke={allOn?"#fbbf24":"#374151"} strokeWidth="3" fill="none" />
          {/* Battery */}
          <rect x={15} y={60} width={30} height={40} rx={4} fill="#374151" />
          <text x={30} y={85} textAnchor="middle" fontSize="9" fill="white">🔋</text>
          {/* Switch */}
          <circle cx={180} cy={50} r={8} fill={sw?"#22c55e":"#6b7280"} style={{cursor:"pointer"}} onClick={()=>setSw(s=>!s)} />
          <text x={180} y={38} textAnchor="middle" fontSize="9" fill="white">{sw?"ON":"OFF"}</text>
          {sw ? <line x1={172} y1={50} x2={188} y2={50} stroke="#22c55e" strokeWidth="3" /> : <line x1={172} y1={50} x2={184} y2={42} stroke="#9ca3af" strokeWidth="3" />}
          {/* Bulb 1 */}
          <circle cx={220} cy={80} r={20} fill={allOn&&bulbs[0]?"#fef08a":"#374151"} stroke={allOn&&bulbs[0]?"#fbbf24":"#6b7280"} strokeWidth="2" style={{cursor:"pointer"}} onClick={()=>setBulbs(p=>[!p[0],p[1]])} />
          <text x={220} y={86} textAnchor="middle" fontSize="16">{allOn&&bulbs[0]?"💡":"⚫"}</text>
          {/* Bulb 2 */}
          <circle cx={290} cy={80} r={20} fill={allOn&&bulbs[1]?"#fef08a":"#374151"} stroke={allOn&&bulbs[1]?"#fbbf24":"#6b7280"} strokeWidth="2" style={{cursor:"pointer"}} onClick={()=>setBulbs(p=>[p[0],!p[1]])} />
          <text x={290} y={86} textAnchor="middle" fontSize="16">{allOn&&bulbs[1]?"💡":"⚫"}</text>
        </svg>
        <div className="flex gap-3 text-center text-xs text-gray-400">
          <span>Click switch to open/close</span>
          <span>•</span>
          <span>Click bulbs to unscrew them</span>
        </div>
      </div>
      <div className={`p-3 rounded-lg text-center font-bold text-sm ${allOn?"bg-yellow-100 text-yellow-700":"bg-gray-100 text-gray-600"}`}>
        {!sw?"🔓 Switch open — circuit broken"
          :!bulbs[0]||!bulbs[1]?"💡 Bulb unscrewed — circuit broken"
          :"✅ Closed circuit — current flows!"}
      </div>
    </ExpCard>
  );
};

// ── Ch28: Conductors & Insulators ─────────────────────────────────────────────
const ConductorsExp = () => {
  const materials = [
    { name:"Copper wire", emoji:"🔶", conducts:true, why:"Free electrons flow easily" },
    { name:"Steel rod",   emoji:"⬛", conducts:true, why:"Metal — many free electrons" },
    { name:"Rubber band", emoji:"🟡", conducts:false, why:"Electrons are tightly bound" },
    { name:"Water",       emoji:"💧", conducts:true, why:"Ions carry charge (not pure water!)" },
    { name:"Wood",        emoji:"🪵", conducts:false, why:"No free electrons to move" },
    { name:"Glass",       emoji:"🔷", conducts:false, why:"Crystalline — no free electrons" },
    { name:"Graphite",    emoji:"✏️", conducts:true, why:"Delocalised electrons" },
    { name:"Plastic",     emoji:"🟦", conducts:false, why:"Polymers bind electrons tightly" },
  ];
  const [selected, setSelected] = useState<number|null>(null);
  const m = selected !== null ? materials[selected] : null;
  return (
    <ExpCard emoji="⚡" title="Conductors vs Insulators" subtitle="Which materials allow electricity to flow?"
      learned={["Conductors have free electrons that can move","Insulators have tightly bound electrons","Graphite is an unusual non-metal conductor"]}>
      <div className="grid grid-cols-4 gap-2">
        {materials.map((mat,i) => (
          <button key={i} onClick={() => setSelected(i===selected?null:i)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${selected===i?"border-orange-500 bg-orange-50":"border-gray-200 bg-white hover:border-gray-300"}`}>
            <span className="text-2xl">{mat.emoji}</span>
            <span className="text-[9px] text-center text-gray-600 leading-tight">{mat.name}</span>
          </button>
        ))}
      </div>
      {m && (
        <div className={`p-3 rounded-xl border-2 ${m.conducts?"border-green-400 bg-green-50":"border-red-300 bg-red-50"}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{m.emoji}</span>
            <div>
              <p className={`font-bold text-sm ${m.conducts?"text-green-700":"text-red-600"}`}>
                {m.name} — {m.conducts?"✅ CONDUCTOR":"❌ INSULATOR"}
              </p>
              <p className="text-xs text-gray-600">{m.why}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2 items-center text-xs">
            <span className={`px-2 py-0.5 rounded-full font-bold ${m.conducts?"bg-green-200 text-green-800":"bg-gray-200 text-gray-600"}`}>
              {m.conducts?"Current flows 💡":"No current 🔌"}
            </span>
          </div>
        </div>
      )}
    </ExpCard>
  );
};

// ── Ch29: Lift & Aeronautics ──────────────────────────────────────────────────
const LiftExp = () => {
  const [angle, setAngle] = useState([8]);
  const [speed, setSpeed] = useState([50]);
  const lift = Math.max(0, (speed[0]**2 * Math.sin(angle[0] * Math.PI/180) * 0.8)).toFixed(0);
  const drag = (speed[0]**2 * (0.02 + angle[0]*0.005)).toFixed(0);
  const liftDragRatio = (parseInt(lift)/Math.max(1,parseFloat(drag))).toFixed(1);
  return (
    <ExpCard emoji="✈️" title="Wing Lift Experiment" subtitle="How wing angle and speed create lift"
      learned={["Lift = ½ × ρ × v² × A × CL (lift coefficient)","More angle of attack = more lift (until stall!","Faster airspeed = much more lift (speed squared)"]}>
      <div className="bg-gradient-to-b from-sky-200 to-sky-50 rounded-xl border p-6 relative" style={{height:180}}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div style={{ transform: `rotate(${-angle[0]}deg)`, transition: "transform 0.3s", width: 200, height: 50, position:"relative" }}>
            <svg viewBox="0 0 200 50" width={200} height={50}>
              <path d="M 0 30 Q 50 5 200 25 Q 120 32 0 35 Z" fill="#1e40af" />
              <path d="M 0 30 Q 50 5 200 25" stroke="#93c5fd" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
          <div className="flex items-center gap-1"><div className="w-8 h-0.5 bg-green-500" /><span className="text-[10px] text-green-600 font-bold">Lift ↑</span></div>
          <div className="flex items-center gap-1"><div className="w-8 h-0.5 bg-red-400" /><span className="text-[10px] text-red-600 font-bold">Drag ←</span></div>
        </div>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {Array.from({length:10}).map((_,i) => (
            <div key={i} className="text-blue-400 text-xs" style={{opacity: 0.4 + i*0.06}}>→</div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><p className="text-xs font-medium mb-1">Angle of attack: {angle[0]}°</p><Slider value={angle} min={0} max={20} step={1} onValueChange={setAngle} /></div>
        <div><p className="text-xs font-medium mb-1">Airspeed: {speed[0]} km/h</p><Slider value={speed} min={20} max={200} step={10} onValueChange={setSpeed} /></div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">Lift</p><p className="font-bold text-green-600">{lift} N</p></div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">Drag</p><p className="font-bold text-red-600">{drag} N</p></div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">L/D Ratio</p><p className="font-bold text-blue-600">{liftDragRatio}</p></div>
      </div>
    </ExpCard>
  );
};

// ── Ch30: Newton's 3rd Law ────────────────────────────────────────────────────
const NewtonsThirdExp = () => {
  const [force, setForce] = useState([50]);
  const [launched, setLaunched] = useState(false);
  const [rocketY, setRocketY] = useState(0);
  const [gasY, setGasY] = useState(0);
  const animRef = useRef<number>();
  const velRef = useRef(0);

  useEffect(() => {
    if (!launched) { setRocketY(0); setGasY(0); velRef.current = 0; return; }
    const step = () => {
      velRef.current += force[0] * 0.0008;
      setRocketY(y => { const ny = y - velRef.current; return ny < -120 ? ny : ny; });
      setGasY(y => y + velRef.current * 1.5);
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [launched, force[0]]);

  return (
    <ExpCard emoji="🚀" title="Newton's 3rd Law" subtitle="Every action has an equal and opposite reaction"
      learned={["For every force, there is an equal force in the opposite direction","Rocket: gas pushed DOWN → rocket pushed UP","Swimming: hand pushes water back → you go forward"]}>
      <div className="bg-gray-900 rounded-xl p-4 flex flex-col items-center" style={{height:220, overflow:"hidden", position:"relative"}}>
        <div style={{position:"absolute", top:`calc(50% + ${rocketY}px)`, transition: launched?"none":"all 0.5s", display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div className="text-4xl">🚀</div>
          <div className="flex gap-1 mt-1 text-xs text-orange-400 font-bold">↑ {force[0]}N</div>
        </div>
        {launched && (
          <div style={{position:"absolute", top:`calc(55% + ${gasY}px)`, display:"flex",flexDirection:"column",alignItems:"center",opacity:Math.max(0,1-gasY/100)}}>
            <div className="text-2xl">🔥💨</div>
            <div className="text-xs text-orange-400">↓ {force[0]}N</div>
          </div>
        )}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-6 text-xs text-gray-400">
          <span>↑ Thrust ({force[0]}N)</span>
          <span>=</span>
          <span>↓ Exhaust ({force[0]}N)</span>
        </div>
      </div>
      <div><p className="text-xs font-medium mb-1">Thrust force: {force[0]} N</p><Slider value={force} min={10} max={100} step={5} onValueChange={v=>{setForce(v);setLaunched(false);}} /></div>
      <Button onClick={() => { setLaunched(false); setTimeout(()=>setLaunched(true),50); }} className="w-full gap-2 bg-orange-500 hover:bg-orange-600">
        <Zap className="w-4 h-4" />🚀 Launch! ({force[0]}N thrust)
      </Button>
    </ExpCard>
  );
};

// ── Main dispatcher ──────────────────────────────────────────────────────────
const ChapterExperiment = ({ chapterId }: Props) => {
  if (chapterId === 1) return <FrictionSimulator />;
  if (chapterId === 2) return <AerodynamicsExp />;
  if (chapterId === 3) return <SequencingExp />;
  if (chapterId === 4) return <LeverExp />;
  if (chapterId === 5) return <SignalsExp />;
  if (chapterId === 6) return <SuspensionExp />;
  if (chapterId === 7) return <StabilityExp />;
  if (chapterId === 8) return <RackPinionExp />;
  if (chapterId === 9) return <SortingExp />;
  if (chapterId === 10) return <ScrewExp />;
  if (chapterId === 11) return <SpringExp />;
  if (chapterId === 12) return <GearRatioExp />;
  if (chapterId === 13) return <GearTrainExp />;
  if (chapterId === 14) return <AngularMomentumExp />;
  if (chapterId === 15) return <LockingGearExp />;
  if (chapterId === 16) return <CircumferenceExp />;
  if (chapterId === 17) return <PulleyExp />;
  if (chapterId === 18) return <CrankSliderExp />;
  if (chapterId === 19) return <SevenSegmentExp />;
  if (chapterId === 20) return <OrbitExp />;
  if (chapterId === 21) return <SequenceExp21 />;
  if (chapterId === 22) return <MeasurementExp />;
  if (chapterId === 23) return <BalanceExp />;
  if (chapterId === 24) return <MotorExp />;
  if (chapterId === 25) return <DesignThinkingExp />;
  if (chapterId === 26) return <ClockExp />;
  if (chapterId === 27) return <CircuitExp />;
  if (chapterId === 28) return <ConductorsExp />;
  if (chapterId === 29) return <LiftExp />;
  if (chapterId === 30) return <NewtonsThirdExp />;
  return null;
};

export default ChapterExperiment;
