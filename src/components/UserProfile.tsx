import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, LogOut, Shield, Phone, Mail, Users, Database } from "lucide-react";
import { CompanyDirectory } from "./CompanyDirectory";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { DataManagement } from "./DataManagement";

interface UserProfileProps {
  user?: {
    name: string;
    email: string;
    phone: string;
    role: string;
    employeeId: string;
    company: string;
  };
}

const defaultUser = {
  name: "Erik Andersson",
  email: "erik.andersson@byggfirma.se",
  phone: "+46 70 123 45 67",
  role: "Byggarbetare",
  employeeId: "BA-2024-001",
  company: "Byggfirma Nord AB"
};

export const UserProfile = ({ user = defaultUser }: UserProfileProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profil
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* User avatar and basic info */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.role}</p>
              <p className="text-xs text-muted-foreground">{user.company}</p>
            </div>
          </div>

          {/* Contact information */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Mail className="w-4 h-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">E-post</div>
                <div className="text-sm font-medium">{user.email}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Phone className="w-4 h-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Telefon</div>
                <div className="text-sm font-medium">{user.phone}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Shield className="w-4 h-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Medarbetar-ID</div>
                <div className="text-sm font-medium">{user.employeeId}</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full justify-start h-12"
            >
              <Settings className="w-5 h-5 mr-3" />
              Inställningar & Notiser
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full justify-start h-12"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logga ut
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="directory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="directory" className="flex items-center gap-1 text-xs">
            <Users className="w-3 h-3" />
            Företagskatalog
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-1 text-xs">
            <Shield className="w-3 h-3" />
            Integritet
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-1 text-xs">
            <Database className="w-3 h-3" />
            Mina data
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="directory" className="mt-4">
          <CompanyDirectory />
        </TabsContent>
        
        <TabsContent value="privacy" className="mt-4">
          <PrivacyPolicy />
        </TabsContent>
        
        <TabsContent value="data" className="mt-4">
          <DataManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};