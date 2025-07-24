import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Rocket } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: 'complete' | 'warning' | 'error';
  priority: 'high' | 'medium' | 'low';
}

const launchChecklist: ChecklistItem[] = [
  {
    id: "gdpr",
    title: "GDPR-efterlevnad",
    description: "Integritetspolicy, cookie-samtycke och datahantering implementerat",
    status: "complete",
    priority: "high"
  },
  {
    id: "responsive",
    title: "Responsiv design",
    description: "Appen fungerar på både mobil och desktop",
    status: "complete",
    priority: "high"
  },
  {
    id: "error-handling",
    title: "Felhantering",
    description: "Robusta try-catch block och användarmeddelanden",
    status: "complete",
    priority: "high"
  },
  {
    id: "profile-setup",
    title: "Profilinställningar",
    description: "Anpassningsbara profiler vid första inloggning",
    status: "complete",
    priority: "medium"
  },
  {
    id: "role-management",
    title: "Rollhantering",
    description: "Admins kan skapa nya admins och hantera användarroller",
    status: "complete",
    priority: "medium"
  },
  {
    id: "time-tracking",
    title: "Tidsrapportering",
    description: "Stämpelklocka, snabbregistrering och projektval",
    status: "complete",
    priority: "high"
  },
  {
    id: "location-verification",
    title: "Platsverifiering",
    description: "GPS-baserad verifiering för tidsstämpling",
    status: "complete",
    priority: "medium"
  },
  {
    id: "notifications",
    title: "Push-notifikationer",
    description: "Påminnelser baserade på schema och arbetstider",
    status: "complete",
    priority: "medium"
  },
  {
    id: "admin-dashboard",
    title: "Admin-dashboard",
    description: "Översikt av personal, tider och godkännanden",
    status: "complete",
    priority: "high"
  },
  {
    id: "sick-vacation",
    title: "Sjuk- och ledighetshantering",
    description: "Ansökningar och godkännanden för frånvaro",
    status: "complete",
    priority: "medium"
  }
];

export const LaunchChecklist = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'success';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const completedCount = launchChecklist.filter(item => item.status === 'complete').length;
  const totalCount = launchChecklist.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Launch Readiness Checklist
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-success">
              {completionPercentage}%
            </div>
            <div className="text-sm text-muted-foreground">
              {completedCount} av {totalCount} uppgifter klara
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {launchChecklist.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(item.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{item.title}</h4>
                    <Badge variant={getPriorityColor(item.priority)} className="text-xs">
                      {item.priority === 'high' ? 'Hög' : item.priority === 'medium' ? 'Medium' : 'Låg'} prioritet
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              <Badge variant={getStatusColor(item.status)}>
                {item.status === 'complete' ? 'Klar' : 
                 item.status === 'warning' ? 'Varning' : 'Fel'}
              </Badge>
            </div>
          ))}

          {completionPercentage === 100 && (
            <div className="text-center p-6 bg-success/10 rounded-lg">
              <Rocket className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-success mb-2">
                Redo för lansering! 🚀
              </h3>
              <p className="text-sm text-muted-foreground">
                Alla kontrollar är genomförda och appen är redo för production.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};