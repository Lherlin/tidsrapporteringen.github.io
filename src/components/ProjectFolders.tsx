import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  Building2, 
  MapPin, 
  Calendar,
  Users,
  Clock,
  Plus
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  location: string;
  startDate: string;
  status: 'active' | 'completed' | 'paused';
  totalHours: number;
  teamSize: number;
  description: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Kungsgatan 214',
    location: 'Stockholm',
    startDate: '2024-01-15',
    status: 'active',
    totalHours: 245,
    teamSize: 6,
    description: 'Renovering av kontorsbyggnad, 4 våningar'
  },
  {
    id: '2', 
    name: 'Villa Södermalm',
    location: 'Stockholm',
    startDate: '2024-02-01',
    status: 'active',
    totalHours: 156,
    teamSize: 3,
    description: 'Nybyggnad villa med källare och garage'
  },
  {
    id: '3',
    name: 'Malmö Centrum',
    location: 'Malmö',
    startDate: '2024-01-20',
    status: 'active', 
    totalHours: 320,
    teamSize: 8,
    description: 'Byggnad av kontorskomplex'
  },
  {
    id: '4',
    name: 'Skola Göteborg',
    location: 'Göteborg',
    startDate: '2023-11-01',
    status: 'completed',
    totalHours: 580,
    teamSize: 12,
    description: 'Ny grundskola med idrottshall'
  }
];

interface ProjectFoldersProps {
  selectedProject?: string;
  onProjectSelect: (projectId: string, projectName: string) => void;
  userRole: 'admin' | 'employee';
}

export const ProjectFolders = ({ 
  selectedProject, 
  onProjectSelect, 
  userRole 
}: ProjectFoldersProps) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'completed': return 'bg-primary text-primary-foreground';
      case 'paused': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'completed': return 'Avslutad';
      case 'paused': return 'Pausad';
      default: return 'Okänd';
    }
  };

  const activeProjects = mockProjects.filter(p => p.status === 'active');
  const otherProjects = mockProjects.filter(p => p.status !== 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Projektpärmar</h2>
        </div>
        
        {userRole === 'admin' && (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nytt projekt
          </Button>
        )}
      </div>

      {/* Active projects */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Aktiva projekt</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeProjects.map((project) => (
            <Card 
              key={project.id}
              className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                selectedProject === project.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onProjectSelect(project.id, project.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.startDate).toLocaleDateString('sv-SE')}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-primary">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{project.totalHours}h</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <Users className="w-3 h-3" />
                      <span className="font-medium">{project.teamSize} personer</span>
                    </div>
                  </div>
                  
                  {selectedProject === project.id && (
                    <Badge variant="outline" className="text-xs">
                      Valt
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Other projects */}
      {userRole === 'admin' && otherProjects.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Övriga projekt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherProjects.map((project) => (
              <Card 
                key={project.id}
                className="cursor-pointer transition-all hover:shadow-md opacity-75 hover:opacity-100"
                onClick={() => onProjectSelect(project.id, project.name)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {project.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {project.totalHours}h
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
