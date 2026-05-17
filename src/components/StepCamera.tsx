import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, RefreshCw, Sparkles, CheckCircle2, AlertCircle, Loader2, ArrowRight, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  instruction: string;
  pieces: string[];
  detail?: string;
}

interface VerifyResult {
  status: "correct" | "incorrect" | "needs_review";
  confidence: number;
  feedback: string;
  tip: string;
  found?: string[];
  missing?: string[];
}

interface SavedVerdict extends VerifyResult {
  verifiedAt: string;
}

interface StepCameraProps {
  step: Step;
  chapterTitle: string;
  savedVerdict?: SavedVerdict;
  referenceImage?: string | null;
  onVerified?: (v: VerifyResult) => void;
  onAdvance?: () => void;
}

// Convert a public URL to a base64 data-URL so we can send it to the edge function.
async function imageUrlToBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

const StepCamera = ({
  step, chapterTitle, savedVerdict, referenceImage, onVerified, onAdvance,
}: StepCameraProps) => {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOn,  setCameraOn]  = useState(false);
  const [snapshot,  setSnapshot]  = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState<VerifyResult | null>(savedVerdict ?? null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  useEffect(() => {
    setSnapshot(null);
    setResult(savedVerdict ?? null);
    stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.number, savedVerdict?.verifiedAt]);

  useEffect(() => { return () => stopCamera(); }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraOn(true);
      setSnapshot(null);
      setResult(null);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't access the camera. Please allow camera permission.");
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    setSnapshot(canvas.toDataURL("image/jpeg", 0.85));
    setResult(null);
    stopCamera();
  };

  const retake = () => { setSnapshot(null); setResult(null); startCamera(); };
  const tryAgain = () => { setSnapshot(null); setResult(null); startCamera(); };

  const verify = async () => {
    if (!snapshot) return;
    setLoading(true);
    setResult(null);
    try {
      // If referenceImage is already a data URL (procedural 3D render from
      // renderStepReferenceImage), use it directly — no network fetch needed.
      // If it is a public path (e.g. textbook PNG), fetch and convert.
      const referenceBase64 = referenceImage
        ? (referenceImage.startsWith("data:") ? referenceImage : await imageUrlToBase64(referenceImage))
        : null;

      const { data, error } = await supabase.functions.invoke("verify-build-step", {
        body: {
          imageBase64: snapshot,
          ...(referenceBase64 ? { referenceBase64 } : {}),
          stepInstruction: step.instruction,
          stepNumber: step.number,
          pieces: step.pieces,
          chapterTitle,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const verdict = data as VerifyResult;
      setResult(verdict);
      onVerified?.(verdict);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showResult = !!result;
  const isPass = result?.status === "correct";
  const confidencePct = result ? Math.round((result.confidence ?? 0) * 100) : null;

  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Camera className="h-5 w-5 text-primary" />
          AI Step Check — Step {step.number}
          {savedVerdict && !showResult && (
            <Badge variant="outline" className="ml-auto text-xs">Resumed from last session</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Show your current build to the camera. Our AI teacher will check if the step looks right.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Step info */}
        <div className="text-sm">
          <span className="font-medium">Checking: </span>
          <span className="text-muted-foreground">{step.instruction}</span>
          {step.pieces.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {step.pieces.map((p, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* No reference image warning */}
        {!referenceImage && (
          <div className="flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            No 3D reference image found for this step. AI will check instruction and components only.
          </div>
        )}

        {showResult ? (
          <>
            {/* Side-by-side images when result is shown */}
            {(referenceImage || snapshot) && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide text-center">Reference</p>
                  <div className="rounded border bg-muted aspect-video overflow-hidden flex items-center justify-center">
                    {referenceImage
                      ? <img src={referenceImage} alt="Reference" className="w-full h-full object-contain" />
                      : <span className="text-xs text-muted-foreground">No image</span>
                    }
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide text-center">Your Build</p>
                  <div className="rounded border bg-black aspect-video overflow-hidden">
                    {snapshot && <img src={snapshot} alt="Your build" className="w-full h-full object-contain" />}
                  </div>
                </div>
              </div>
            )}

            {/* Result card */}
            {isPass ? (
              <div className="rounded-lg border border-success/40 bg-success/10 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-success/20 p-2 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-success text-sm">Step {step.number} looks correct!</p>
                      {confidencePct !== null && (
                        <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full font-medium">
                          {confidencePct}% confidence
                        </span>
                      )}
                    </div>
                    {result?.feedback && <p className="text-xs text-muted-foreground">{result.feedback}</p>}
                    {result?.found && result.found.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {result.found.map((c) => (
                          <span key={c} className="text-[10px] bg-success/10 text-success border border-success/20 px-1.5 py-0.5 rounded-full font-mono">✓ {c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button onClick={() => onAdvance?.()} className="w-full gap-2 bg-success text-success-foreground hover:bg-success/90 h-8 text-sm">
                  Next Step <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-accent/40 bg-accent/10 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-accent/20 p-2 flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-accent text-sm">Let's fix this</p>
                      {confidencePct !== null && (
                        <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">
                          {confidencePct}% confidence
                        </span>
                      )}
                    </div>
                    {result?.feedback && <p className="text-xs">{result.feedback}</p>}
                    {result?.tip && result.tip !== result.feedback && (
                      <p className="text-xs text-muted-foreground italic">💡 {result.tip}</p>
                    )}
                    {result?.missing && result.missing.length > 0 && (
                      <div className="pt-1">
                        <p className="text-[10px] text-muted-foreground font-semibold mb-1">Still missing:</p>
                        <div className="flex flex-wrap gap-1">
                          {result.missing.map((c) => (
                            <span key={c} className="text-[10px] bg-destructive/10 text-destructive border border-destructive/20 px-1.5 py-0.5 rounded-full font-mono">✗ {c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button onClick={tryAgain} variant="outline" className="w-full gap-2 h-8 text-sm">
                  <RefreshCw className="h-4 w-4" /> Try Again
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Camera / snapshot area */}
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden border">
              {snapshot ? (
                <img src={snapshot} alt="Captured build" className="w-full h-full object-contain bg-black" />
              ) : (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={cn("w-full h-full object-cover", !cameraOn && "hidden")}
                />
              )}
              {!snapshot && !cameraOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Camera className="h-10 w-10" />
                  <p className="text-sm">Start the camera to take a photo of your build</p>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex flex-wrap gap-2">
              {!cameraOn && !snapshot && (
                <Button onClick={startCamera} className="gap-2">
                  <Camera className="h-4 w-4" /> Start Camera
                </Button>
              )}
              {cameraOn && (
                <>
                  <Button onClick={capture} className="gap-2">
                    <Camera className="h-4 w-4" /> Capture
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>Cancel</Button>
                </>
              )}
              {snapshot && (
                <>
                  <Button onClick={verify} disabled={loading} className="gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {loading ? "Checking..." : "Verify with AI"}
                  </Button>
                  <Button variant="outline" onClick={retake} className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Retake
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StepCamera;
