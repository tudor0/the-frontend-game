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

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // Login clasic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg shadow-2xl border border-slate-200/80 bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-1 pb-4">
          <CardTitle className="text-3xl font-bold text-slate-900">
            The Frontend Game
          </CardTitle>
          <CardDescription className="text-slate-600">
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
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wide">
              <span className="bg-white px-3 text-slate-500">
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
                  className="text-sm font-medium text-slate-700">
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
                className="text-sm font-medium text-slate-700">
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
                className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold">
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <Button
            variant="link"
            className="text-slate-700"
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
