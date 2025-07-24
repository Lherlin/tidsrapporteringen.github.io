import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, Camera, Building2, Phone, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().min(10, "Telefonnummer måste vara minst 10 siffror"),
  role: z.string().min(1, "Välj en roll"),
  department: z.string().optional(),
  company: z.string().min(1, "Företagsnamn krävs"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileSetupProps {
  onComplete: (profileData: ProfileFormData) => void;
  isFirstTime?: boolean;
}

export const ProfileSetup = ({ onComplete, isFirstTime = true }: ProfileSetupProps) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      company: "Byggfirma Nord AB",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    toast.success("Profil skapad framgångsrikt!");
    onComplete(data);
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {form.watch("name") ? getInitials(form.watch("name")) : <User className="w-8 h-8" />}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Lägg till profilbild
              </Button>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fullständigt namn</FormLabel>
                  <FormControl>
                    <Input placeholder="Ange ditt fullständiga namn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj din roll" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="byggarbetare">Byggarbetare</SelectItem>
                      <SelectItem value="elektriker">Elektriker</SelectItem>
                      <SelectItem value="rörmokare">Rörmokare</SelectItem>
                      <SelectItem value="målare">Målare</SelectItem>
                      <SelectItem value="snickare">Snickare</SelectItem>
                      <SelectItem value="platschef">Platschef</SelectItem>
                      <SelectItem value="projektledare">Projektledare</SelectItem>
                      <SelectItem value="arbetsledare">Arbetsledare</SelectItem>
                      <SelectItem value="administratör">Administratör</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avdelning (frivilligt)</FormLabel>
                  <FormControl>
                    <Input placeholder="t.ex. Renovering, Nybyggnation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-postadress</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="din.email@företag.se" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefonnummer</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="+46 70 123 45 67" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Företag</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Företagsnamn" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-success-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Granska din profil</h3>
              <p className="text-sm text-muted-foreground">
                Kontrollera att all information är korrekt innan du slutför
              </p>
            </div>

            <Card className="bg-secondary/30">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(form.watch("name"))}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{form.watch("name")}</div>
                    <div className="text-sm text-muted-foreground">{form.watch("role")}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div><strong>E-post:</strong> {form.watch("email")}</div>
                  <div><strong>Telefon:</strong> {form.watch("phone")}</div>
                  <div><strong>Företag:</strong> {form.watch("company")}</div>
                  {form.watch("department") && (
                    <div><strong>Avdelning:</strong> {form.watch("department")}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <User className="w-6 h-6 text-primary" />
            {isFirstTime ? "Välkommen!" : "Uppdatera profil"}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {isFirstTime ? "Låt oss sätta upp din profil" : "Redigera din profilinformation"}
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i + 1 <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}

              <div className="flex gap-3">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    Föregående
                  </Button>
                )}
                
                {step < totalSteps ? (
                  <Button 
                    type="button" 
                    onClick={nextStep} 
                    className="flex-1"
                    disabled={
                      (step === 1 && (!form.watch("name") || !form.watch("role"))) ||
                      (step === 2 && (!form.watch("email") || !form.watch("phone") || !form.watch("company")))
                    }
                  >
                    Nästa
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1">
                    {isFirstTime ? "Slutför profil" : "Spara ändringar"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};