import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, RefreshCw, Sparkles, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
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
}

interface SavedVerdict extends VerifyResult {
  verifiedAt: string;
}

interface StepCameraProps {
  step: Step;
  chapterTitle: string;
  savedVerdict?: SavedVerdict;
  onVerified?: (v: VerifyResult) => void;
  onAdvance?: () => void;
}

const StepCamera = ({ step, chapterTitle, savedVerdict, onVerified, onAdvance }: StepCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(savedVerdict ?? null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  useEffect(() => {
    // hydrate from saved verdict when step or saved value changes
    setSnapshot(null);
    setResult(savedVerdict ?? null);
    stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.number, savedVerdict?.verifiedAt]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

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
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setSnapshot(dataUrl);
    setResult(null);
    stopCamera();
  };

  const retake = () => {
    setSnapshot(null);
    setResult(null);
    startCamera();
  };

  const verify = async () => {
    if (!snapshot) return;
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("verify-build-step", {
        body: {
          imageBase64: snapshot,
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

  const tryAgain = () => {
    setSnapshot(null);
    setResult(null);
    startCamera();
  };

  const showResult = !!result;
  const isPass = result?.status === "correct";

  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Camera className="h-5 w-5 text-primary" />
          AI Step Check — Step {step.number}
          {savedVerdict && !showResult && (
            <Badge variant="outline" className="ml-auto text-xs">
              Resumed from last session
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Show your current build to the camera. Our AI teacher will check if the step looks right.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
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

        {showResult ? (
          isPass ? (
            <div className="rounded-lg border border-success/40 bg-success/10 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-success/20 p-2">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-success">
                    Step {step.number} looks correct! You can move to Step {step.number + 1}.
                  </p>
                  {result?.feedback && (
                    <p className="text-sm text-muted-foreground">{result.feedback}</p>
                  )}
                </div>
              </div>
              <Button
                onClick={() => onAdvance?.()}
                className="w-full gap-2 bg-success text-success-foreground hover:bg-success/90"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-accent/40 bg-accent/10 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-accent/20 p-2">
                  <AlertCircle className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-accent">Let's fix this</p>
                  <p className="text-sm">
                    {result?.tip || result?.feedback || "Re-check the orientation of the highlighted pieces and try again."}
                  </p>
                </div>
              </div>
              <Button onClick={tryAgain} variant="outline" className="w-full gap-2">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
            </div>
          )
        ) : (
          <>
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden border">
              {snapshot ? (
                // eslint-disable-next-line @next/next/no-img-element
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
