"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Demo users mapping
    const emailMap: { [key: string]: string } = {
      "IDI_Jose_J._Lider": "lider@banda.com",
      "IDI_Gerard_R.": "dirigente@banda.com",
    };
    const passwordMap: { [key: string]: string } = {
        "IDI_Jose_J._Lider": "578990", // Firebase requires 6+ char passwords
        "IDI_Gerard_R.": "180511",
      };

    const firebaseEmail = emailMap[email] || email;
    const firebasePassword = passwordMap[email] || password;


    try {
      await signInWithEmailAndPassword(auth, firebaseEmail, firebasePassword);
      router.push("/loading");
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            setError("Usuario o contraseña incorrectos.");
            break;
          default:
            setError("Ocurrió un error. Por favor, inténtalo de nuevo.");
            break;
        }
      } else {
        setError("Ocurrió un error inesperado.");
      }
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "Usuario o contraseña incorrectos.",
      });
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-sm">
        <Logo className="mb-4" />
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Usuario</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Ej: IDI_Jose_J._Lider"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Acceder
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
