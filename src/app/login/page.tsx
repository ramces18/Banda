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
import { useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (!authLoading && user) {
      router.replace("/dashboard/home");
    }
  }, [user, authLoading, router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // NOTE: Firebase Auth expects an email. We will append a dummy domain.
    const firebaseEmail = email.includes('@') ? email : `${email}@banda.com`;

    try {
      await signInWithEmailAndPassword(auth, firebaseEmail, password);
      // The redirection is now handled by the useEffect above and the layout.
    } catch (err) {
      let errorMessage = "Ocurrió un error inesperado.";
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            errorMessage = "Usuario o contraseña incorrectos.";
            break;
          default:
             errorMessage = "Ocurrió un error. Por favor, inténtalo de nuevo.";
            break;
        }
      }
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: errorMessage,
      });
      setLoading(false);
    }
  };
  
  // Muestra un loader si se está determinando el estado de auth
  if (authLoading) {
      return (
         <div className="flex h-screen w-full flex-col items-center justify-center space-y-6">
          <Logo />
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Cargando...</p>
          </div>
        </div>
      )
  }
  
  // Si no está autenticado, muestra el login
  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
         <div className="w-full max-w-md mx-auto">
          <Link href="/" className="flex justify-center mb-8">
            <Logo />
          </Link>
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Bienvenido</CardTitle>
              <CardDescription>
                Ingresa tus credenciales para acceder al panel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Usuario</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Tu nombre de usuario"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="text-base"
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
                     className="text-base"
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full !mt-6" disabled={loading}>
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

  // Si ya está logueado, se muestra el loader de redirección al dashboard
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-6">
      <Logo />
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Redirigiendo al panel...</p>
      </div>
    </div>
  )
}
