import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { TimeClockCard } from "@/components/TimeClockCard";
import { ProjectSelector } from "@/components/ProjectSelector";
import { DailyOverview } from "@/components/DailyOverview";
import { UserProfile } from "@/components/UserProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Clock, Users } from "lucide-react";

type TabType = 'clock' | 'overview' | 'profile' | 'reports';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('clock');
  const [isWorking, setIsWorking] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  const [workTime, setWorkTime] = useState("00:00");
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Timer logic for tracking work time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWorking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - startTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setWorkTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorking, startTime]);

  const handleClockIn = () => {
    if (!selectedProject) {
      // Could show a toast here asking to select a project first
      return;
    }
    setIsWorking(true);
    setStartTime(new Date());
  };

  const handleClockOut = () => {
    setIsWorking(false);
    setStartTime(null);
  };

  const handleProjectSelect = (projectId: string, projectName: string) => {
    setSelectedProject(projectId);
    setSelectedProjectName(projectName);
  };

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" />
              Veckotimmar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">42.5h</div>
            <div className="flex items-center gap-1 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              +5% från förra veckan
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary" />
              Aktiva projekt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">3</div>
            <div className="text-sm text-muted-foreground">
              2 projekt aktiva denna vecka
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Projektfördelning denna månad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Villa Södermalm</span>
              <span className="text-sm text-muted-foreground">65h (58%)</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '58%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Kontorskomplex Malmö</span>
              <span className="text-sm text-muted-foreground">35h (31%)</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-accent h-2 rounded-full" style={{ width: '31%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Skola Göteborg</span>
              <span className="text-sm text-muted-foreground">12h (11%)</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '11%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'clock':
        return (
          <div className="space-y-6">
            <ProjectSelector 
              selectedProject={selectedProject}
              onProjectSelect={handleProjectSelect}
            />
            <TimeClockCard
              isWorking={isWorking}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
              currentProject={selectedProjectName || "Inget projekt valt"}
              workTime={workTime}
            />
          </div>
        );
      case 'overview':
        return <DailyOverview />;
      case 'profile':
        return <UserProfile />;
      case 'reports':
        return renderReportsTab();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            Tidrapportering
          </h1>
          <p className="text-sm text-muted-foreground">
            Byggfirma Nord AB
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-20">
        {renderTabContent()}
      </main>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <Navigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default Index;
