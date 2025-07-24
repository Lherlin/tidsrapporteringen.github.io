import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Building2, Clock, Users, Shield, Eye, EyeOff } from "lucide-react";

interface AuthScreenProps {
  onLogin: (userData: { email: string; role: 'admin' | 'employee'; name: string }) => void;
}

export const AuthScreen = ({ onLogin }: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (!isLogin) {
        // Sign up validation
        if (password !== confirmPassword) {
          toast({
            title: "Fel",
            description: "Lösenorden matchar inte",
            variant: "destructive",
          });
          return;
        }
        if (password.length < 6) {
          toast({
            title: "Fel",
            description: "Lösenordet måste vara minst 6 tecken",
            variant: "destructive",
          });
          return;
        }
      }

      // For demo purposes, determine role based on email
      const role: 'admin' | 'employee' = email.includes('admin') ? 'admin' : 'employee';
      const userName = name || email.split('@')[0];

      toast({
        title: isLogin ? "Inloggning lyckades" : "Registrering lyckades",
        description: `Välkommen ${userName}!`,
      });

      onLogin({ 
        email, 
        role, 
        name: userName 
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Något gick fel. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Company branding */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tidrapportering</h1>
            <p className="text-muted-foreground">Byggfirma Nord AB</p>
          </div>
        </div>

        {/* Features highlight */}
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="text-center space-y-2">
            <div className="mx-auto w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Enkel tidsstämpling</p>
          </div>
          <div className="text-center space-y-2">
            <div className="mx-auto w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Projekthantering</p>
          </div>
          <div className="text-center space-y-2">
            <div className="mx-auto w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">GDPR-säker</p>
          </div>
        </div>

        {/* Auth form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>{isLogin ? "Logga in" : "Skapa konto"}</CardTitle>
            <CardDescription>
              {isLogin 
                ? "Välkommen tillbaka! Logga in för att fortsätta." 
                : "Skapa ditt konto för att komma igång."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Namn</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ditt fullständiga namn"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Företag</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Företagsnamn"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="din@email.se"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {!isLogin && (
                  <p className="text-xs text-muted-foreground">
                    Tips: Använd "admin@company.se" för administratörsbehörighet
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Lösenord</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ditt lösenord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Bekräfta ditt lösenord"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Laddar..." : (isLogin ? "Logga in" : "Skapa konto")}
              </Button>
            </form>
            
            <div className="mt-6">
              <Separator />
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Har du inget konto?" : "Har du redan ett konto?"}
                </p>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="p-0 h-auto font-normal"
                >
                  {isLogin ? "Skapa konto här" : "Logga in här"}
                </Button>
              </div>
            </div>
            
            {/* Demo credentials */}
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-2">Demo-inloggningar:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><strong>Admin:</strong> admin@byggfirma.se</p>
                <p><strong>Anställd:</strong> employee@byggfirma.se</p>
                <p><strong>Lösenord:</strong> demo123</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Genom att fortsätta godkänner du våra användarvillkor och integritetspolicy
          </p>
          <p className="text-xs text-muted-foreground">
            © 2024 Byggfirma Nord AB. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </div>
  );
};