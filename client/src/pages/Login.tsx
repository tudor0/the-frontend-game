import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (isLogin) {
        const res = await api.post("/auth/login", { email, password });
        login(res.data.accessToken, res.data.user);
        toast.success("Welcome back!");
        navigate("/");
      } else {
        await api.post("/auth/register", { email, password, name });
        toast.success("Account created! Please login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Google Login Callback
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      // Trimitem token-ul de la Google la backend-ul nostru
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential
      });

      // Backend-ul ne raspunde cu tokenii nostri interni
      login(res.data.accessToken, res.data.user);
      toast.success("Logged in with Google!");
      navigate("/");
    } catch (err) {
      toast.error("Google Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur">
        <CardHeader className="text-center space-y-1 pb-4">
          <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            The Frontend Game
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {isLogin ? "Sign in to continue" : "Create an account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-2">
          {/* SECȚIUNEA GOOGLE */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Login Failed")}
              theme="filled_black"
              shape="pill"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wide">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* FORMULAR CLASIC */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold gap-2">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting
                ? isLogin
                  ? "Signing in…"
                  : "Creating account…"
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 px-6 py-4">
          <Button
            variant="link"
            className="text-slate-700 dark:text-slate-300"
            onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
