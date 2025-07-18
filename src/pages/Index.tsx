import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { TimeClockCard } from "@/components/TimeClockCard";
import { ProjectSelector } from "@/components/ProjectSelector";
import { ProjectFolders } from "@/components/ProjectFolders";
import { QuickTimeEntry } from "@/components/QuickTimeEntry";
import { DailyOverview } from "@/components/DailyOverview";
import { UserProfile } from "@/components/UserProfile";
import { AdminDashboard } from "@/components/AdminDashboard";
import { PushNotifications } from "@/components/PushNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Clock, Users, Settings, Shield, Plus, Mail } from "lucide-react";

type TabType = 'clock' | 'projects' | 'overview' | 'admin' | 'profile' | 'notifications';
type UserRole = 'admin' | 'employee';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('clock');
  const [userRole, setUserRole] = useState<UserRole>('employee'); // In real app, this would come from authentication
  const [isWorking, setIsWorking] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  const [workTime, setWorkTime] = useState("00:00");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeEntryMode, setTimeEntryMode] = useState<'clock' | 'quick'>('clock');

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

  const handleTimeSubmit = (timeData: {
    hours: number;
    notes: string;
    deviations: string;
    project: string;
  }) => {
    // In real app, this would submit to backend
    console.log('Time entry submitted:', timeData);
  };

  const handleProjectSelect = (projectId: string, projectName: string) => {
    setSelectedProject(projectId);
    setSelectedProjectName(projectName);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'clock':
        return (
          <div className="space-y-6">
            {!selectedProject && (
              <ProjectFolders 
                selectedProject={selectedProject}
                onProjectSelect={handleProjectSelect}
                userRole={userRole}
              />
            )}
            
            {selectedProject && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Aktuellt projekt</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedProject("");
                          setSelectedProjectName("");
                        }}
                      >
                        Byt projekt
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {selectedProjectName}
                    </Badge>
                  </CardContent>
                </Card>

                <div className="flex gap-2 mb-4">
                  <Button
                    variant={timeEntryMode === 'clock' ? 'default' : 'outline'}
                    onClick={() => setTimeEntryMode('clock')}
                    size="sm"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Stämpelklocka
                  </Button>
                  <Button
                    variant={timeEntryMode === 'quick' ? 'default' : 'outline'}
                    onClick={() => setTimeEntryMode('quick')}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Snabbregistrering
                  </Button>
                </div>

                {timeEntryMode === 'clock' ? (
                  <TimeClockCard
                    isWorking={isWorking}
                    onClockIn={handleClockIn}
                    onClockOut={handleClockOut}
                    currentProject={selectedProjectName}
                    workTime={workTime}
                  />
                ) : (
                  <QuickTimeEntry
                    selectedProject={selectedProjectName}
                    onTimeSubmit={handleTimeSubmit}
                  />
                )}
              </>
            )}
          </div>
        );
      
      case 'projects':
        return (
          <ProjectFolders 
            selectedProject={selectedProject}
            onProjectSelect={handleProjectSelect}
            userRole={userRole}
          />
        );
      
      case 'overview':
        if (userRole === 'admin') {
          return (
            <AdminDashboard selectedProject={selectedProject} />
          );
        } else {
          return <DailyOverview />;
        }
      
      case 'admin':
        return userRole === 'admin' ? (
          <AdminDashboard selectedProject={selectedProject} />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Åtkomst nekad</p>
          </div>
        );
      
      case 'notifications':
        return <PushNotifications userRole={userRole} />;
      
      case 'profile':
        return <UserProfile />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Tidrapportering
              </h1>
              <p className="text-sm text-muted-foreground">
                Byggfirma Nord AB
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={userRole === 'admin' ? 'default' : 'secondary'}
                className="px-3 py-1"
              >
                <Shield className="w-3 h-3 mr-1" />
                {userRole === 'admin' ? 'Administratör' : 'Anställd'}
              </Badge>
              
              {userRole === 'admin' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {/* In real app: invite employee */}}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Bjud in
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setUserRole(userRole === 'admin' ? 'employee' : 'admin')}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
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
          userRole={userRole}
        />
      </div>
    </div>
  );
};

export default Index;
