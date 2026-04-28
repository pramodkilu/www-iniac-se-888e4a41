import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, RefreshCw, Sparkles, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
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

interface StepCameraProps {
  step: Step;
  chapterTitle: string;
}

const StepCamera = ({ step, chapterTitle }: StepCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  useEffect(() => {
    // reset when step changes
    setSnapshot(null);
    setResult(null);
    stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.number]);

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
      setResult(data as VerifyResult);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusMeta = result
    ? result.status === "correct"
      ? { color: "text-success", bg: "bg-success/10 border-success/30", icon: CheckCircle2, label: "Great job!" }
      : result.status === "incorrect"
      ? { color: "text-destructive", bg: "bg-destructive/10 border-destructive/30", icon: XCircle, label: "Not quite" }
      : { color: "text-accent", bg: "bg-accent/10 border-accent/30", icon: AlertCircle, label: "Let's double-check" }
    : null;

  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Camera className="h-5 w-5 text-primary" />
          AI Step Check — Step {step.number}
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

        {result && statusMeta && (
          <div className={cn("border rounded-lg p-4 flex gap-3", statusMeta.bg)}>
            <statusMeta.icon className={cn("h-6 w-6 flex-shrink-0", statusMeta.color)} />
            <div className="flex-1 space-y-1">
              <p className={cn("font-semibold", statusMeta.color)}>
                {statusMeta.label} <span className="text-xs text-muted-foreground font-normal">
                  ({Math.round(result.confidence * 100)}% confident)
                </span>
              </p>
              <p className="text-sm">{result.feedback}</p>
              {result.tip && (
                <p className="text-sm text-muted-foreground"><strong>Tip:</strong> {result.tip}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StepCamera;
