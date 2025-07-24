import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { TimeClockCard } from "@/components/TimeClockCard";
import { ProjectSelector } from "@/components/ProjectSelector";
import { ProjectFolders } from "@/components/ProjectFolders";
import { QuickTimeEntry } from "@/components/QuickTimeEntry";
import { TimeOverview } from "@/components/TimeOverview";
import { UserProfile } from "@/components/UserProfile";
import { AdminDashboard } from "@/components/AdminDashboard";
import { PushNotifications } from "@/components/PushNotifications";
import { SickLeave } from "@/components/SickLeave";
import { VacationRequest } from "@/components/VacationRequest";
import { CompanyDirectory } from "@/components/CompanyDirectory";
import { ScheduleManagement } from "@/components/ScheduleManagement";
import { LocationTimeEntry } from "@/components/LocationTimeEntry";
import { CookieConsent } from "@/components/CookieConsent";
import { ProfileSetup } from "@/components/ProfileSetup";
import { RoleManagement } from "@/components/RoleManagement";
import { DailyOverview } from "@/components/DailyOverview";
import { AuthScreen } from "@/components/AuthScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Settings, 
  Shield, 
  Plus, 
  Mail, 
  MapPin, 
  User 
} from "lucide-react";

type TabType = 'clock' | 'projects' | 'overview' | 'admin' | 'profile' | 'sick-leave' | 'vacation';
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
  const [locationVerified, setLocationVerified] = useState(false);
  const [requireLocation, setRequireLocation] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'settings' | 'profile' | 'dashboard' | 'schedules' | 'approvals' | 'roles' | 'overview'>('directory');
  const [showProfileSetup, setShowProfileSetup] = useState(false); // For first-time login
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; role: 'admin' | 'employee'; name: string } | null>(null);

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
    try {
      if (!selectedProject) {
        alert('Välj ett projekt först');
        return;
      }
      
      if (requireLocation && !locationVerified) {
        alert('Du måste vara på rätt plats för att stämpla in');
        return;
      }
      
      setIsWorking(true);
      setStartTime(new Date());
    } catch (error) {
      console.error('Error clocking in:', error);
      alert('Ett fel uppstod vid instämpling');
    }
  };

  const handleClockOut = () => {
    try {
      setIsWorking(false);
      setStartTime(null);
      setWorkTime("00:00");
    } catch (error) {
      console.error('Error clocking out:', error);
      alert('Ett fel uppstod vid utstämpling');
    }
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

                {/* Location verification */}
                {selectedProject && requireLocation && (
                  <LocationTimeEntry
                    selectedProject={selectedProject}
                    selectedProjectName={selectedProjectName}
                    onLocationVerified={setLocationVerified}
                    isRequired={requireLocation}
                  />
                )}

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
          return <TimeOverview />;
        }
      
      case 'admin':
        return userRole === 'admin' ? (
          <div className="space-y-6">
            <div className="flex gap-2 mb-4">
              <Button
                variant={activeSubTab === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setActiveSubTab('dashboard' as any)}
                size="sm"
              >
                Dashboard
              </Button>
              <Button
                variant={activeSubTab === 'schedules' ? 'default' : 'outline'}
                onClick={() => setActiveSubTab('schedules' as any)}
                size="sm"
              >
                Schema
              </Button>
              <Button
                variant={activeSubTab === 'approvals' ? 'default' : 'outline'}
                onClick={() => setActiveSubTab('approvals' as any)}
                size="sm"
              >
                Godkännanden
              </Button>
              <Button
                variant={activeSubTab === 'roles' ? 'default' : 'outline'}
                onClick={() => setActiveSubTab('roles' as any)}
                size="sm"
              >
                Roller
              </Button>
              <Button
                variant={activeSubTab === 'overview' ? 'default' : 'outline'}
                onClick={() => setActiveSubTab('overview' as any)}
                size="sm"
              >
                Personal
              </Button>
            </div>
            
            {activeSubTab === 'schedules' ? (
              <ScheduleManagement />
            ) : activeSubTab === 'approvals' ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Väntande godkännanden</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Sjukanmälningar och ledighetsansökningar som väntar på godkännande visas här.</p>
                  </CardContent>
                </Card>
              </div>
            ) : activeSubTab === 'roles' ? (
              <RoleManagement />
            ) : activeSubTab === 'overview' ? (
              <DailyOverview />
            ) : (
              <AdminDashboard selectedProject={selectedProject} />
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Åtkomst nekad</p>
          </div>
        );
      
      case 'sick-leave':
        return <SickLeave />;
      
      case 'vacation':
        return <VacationRequest />;
      
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex gap-2 mb-4">
              <Button
                variant={activeSubTab === 'profile' ? 'default' : 'outline'}
                onClick={() => setActiveSubTab('profile' as any)}
                size="sm"
              >
                Profil
              </Button>
              <Button
                variant={activeSubTab === 'directory' ? 'default' : 'outline'}
                onClick={() => setActiveSubTab('directory')}
                size="sm"
              >
                Företagskatalog
              </Button>
              <Button
                variant={activeSubTab === 'settings' ? 'default' : 'outline'}
                onClick={() => setActiveSubTab('settings')}
                size="sm"
              >
                Inställningar
              </Button>
            </div>
            
            {activeSubTab === 'directory' ? (
              <CompanyDirectory />
            ) : activeSubTab === 'settings' ? (
              <div className="space-y-6">
                <PushNotifications userRole={userRole} />
                
                {userRole === 'admin' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Platsinställningar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Kräv platsverifiering</div>
                          <div className="text-sm text-muted-foreground">
                            Tvinga anställda att vara på rätt plats för tidsstämpling
                          </div>
                        </div>
                        <Button
                          variant={requireLocation ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setRequireLocation(!requireLocation)}
                        >
                          {requireLocation ? 'På' : 'Av'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <UserProfile />
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Handle authentication
  const handleLogin = (userData: { email: string; role: 'admin' | 'employee'; name: string }) => {
    setCurrentUser(userData);
    setUserRole(userData.role);
    setIsAuthenticated(true);
    
    // Show profile setup for new users
    if (!userProfile) {
      setShowProfileSetup(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserProfile(null);
    setShowProfileSetup(false);
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // Show profile setup for first-time users
  if (showProfileSetup) {
    return (
      <ProfileSetup 
        onComplete={(profileData) => {
          setUserProfile(profileData);
          setShowProfileSetup(false);
        }} 
        isFirstTime={true}
      />
    );
  }

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
              
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {currentUser?.name || currentUser?.email}
              </span>
              
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
                onClick={() => setShowProfileSetup(true)}
                title="Redigera profil"
              >
                <User className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                title="Logga ut"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-20 mobile-optimized">
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
      
      <CookieConsent />
    </div>
  );
};

export default Index;
