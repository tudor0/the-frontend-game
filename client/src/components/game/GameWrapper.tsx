import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Clock, Trophy } from "lucide-react";
import { toast } from "sonner"; // Vom instala sonner pt notificări

interface GameWrapperProps {
  gameId: string;
  title: string;
  description: string;
  hintText: string; // Textul hint-ului care apare DOAR după ce apeși butonul
  children: ReactNode;
  onComplete?: () => void;
}

export default function GameWrapper({
  gameId,
  title,
  description,
  hintText,
  children,
  onComplete
}: GameWrapperProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "active" | "solved">(
    "loading"
  );
  const [flag, setFlag] = useState("");
  const [startTime, setStartTime] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      // Curățăm timer-ul când componenta se demontează
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsed(0);
    };
  }, []);

  // 1. Initializare Nivel (Start Timer)
  useEffect(() => {
    const initGame = async () => {
      try {
        const res = await api.post("/games/start", { gameId });
        if (res.data.status === "completed") {
          setStatus("solved");
        } else {
          setStartTime(res.data.startTime);
          if (res.data.hintsUsed) setShowHint(true);
          setStatus("active");
        }
      } catch {
        toast.error("Failed to start game");
      }
    };
    initGame();
  }, [gameId]);

  // 2. Timer Vizual
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (status === "active" && startTime) {
      timerRef.current = setInterval(() => {
        const start = new Date(startTime).getTime();
        setElapsed(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status, startTime]);

  // 3. Submit Flag
  const handleSubmit = async () => {
    if (!flag) return;
    try {
      const res = await api.post("/games/validate", { gameId, userFlag: flag });

      if (res.data.success) {
        toast.success(`Correct! Time: ${res.data.duration}s`);
        setStatus("solved");
        if (onComplete) onComplete();
      } else {
        toast.error("Incorrect Flag. Try again!");
      }
    } catch {
      toast.error("Error validating flag");
    }
  };

  // 4. Use Hint
  const handleUseHint = async () => {
    if (confirm("Using a hint will be marked on your profile. Are you sure?")) {
      try {
        await api.post("/games/hint", { gameId });
        setShowHint(true);
      } catch {
        toast.error("Could not get hint");
      }
    }
  };

  if (status === "loading")
    return <div className="p-10 text-center">Loading Mission...</div>;

  return (
    <div className="max-w-3xl mx-auto my-10">
      <Card className="shadow-lg border-2 border-slate-100">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" /> {elapsed}s
              </Badge>
              {status === "solved" && (
                <Badge className="bg-green-500">SOLVED</Badge>
              )}
            </div>
          </div>
          <p className="text-slate-500">{description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Aici injectăm jocul specific */}
          <div className="bg-slate-50 border rounded-xl p-8 min-h-[200px] flex flex-col justify-center items-center relative">
            {children}
          </div>

          {/* Hint Area */}
          <div className="flex justify-between items-center">
            {!showHint ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUseHint}
                className="text-slate-400 hover:text-amber-500">
                <HelpCircle className="w-4 h-4 mr-2" /> Need a Hint?
              </Button>
            ) : (
              <div className="bg-amber-50 text-amber-800 p-3 rounded text-sm w-full border border-amber-100">
                <strong>HINT:</strong> {hintText}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex gap-4 bg-slate-50/50 p-6">
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
          <Input
            placeholder="Enter Flag (e.g., SECRET_CODE)"
            value={flag}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFlag(e.target.value)
            }
            disabled={status === "solved"}
            className="font-mono uppercase"
          />
          <Button onClick={handleSubmit} disabled={status === "solved"}>
            {status === "solved" ? (
              <Trophy className="w-4 h-4" />
            ) : (
              "Submit Flag"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
