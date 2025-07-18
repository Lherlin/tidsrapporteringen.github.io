import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, MapPin, Users } from "lucide-react";

interface Project {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'completed' | 'paused';
}

const mockProjects: Project[] = [
  { id: '1', name: 'Villa Södermalm', location: 'Stockholm', status: 'active' },
  { id: '2', name: 'Kontorskomplex Malmö', location: 'Malmö', status: 'active' },
  { id: '3', name: 'Skola Göteborg', location: 'Göteborg', status: 'active' },
  { id: '4', name: 'Bostäder Växjö', location: 'Växjö', status: 'paused' },
];

interface ProjectSelectorProps {
  selectedProject?: string;
  onProjectSelect: (projectId: string, projectName: string) => void;
}

export const ProjectSelector = ({ selectedProject, onProjectSelect }: ProjectSelectorProps) => {
  const [selectedValue, setSelectedValue] = useState(selectedProject || "");

  const handleProjectChange = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    if (project) {
      setSelectedValue(projectId);
      onProjectSelect(projectId, project.name);
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'completed': return 'text-muted-foreground';
      case 'paused': return 'text-warning';
      default: return 'text-muted-foreground';
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Välj projekt
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Select value={selectedValue} onValueChange={handleProjectChange}>
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Välj ett projekt att arbeta på" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border shadow-lg">
            {mockProjects.map((project) => (
              <SelectItem 
                key={project.id} 
                value={project.id}
                className="py-3 hover:bg-secondary focus:bg-secondary"
              >
                <div className="flex flex-col items-start w-full">
                  <div className="font-medium">{project.name}</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {project.location}
                    </span>
                    <span className={`font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedValue && (
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Users className="w-4 h-4" />
              <span>Valt projekt</span>
            </div>
            {(() => {
              const project = mockProjects.find(p => p.id === selectedValue);
              return project ? (
                <div>
                  <div className="font-semibold text-foreground">{project.name}</div>
                  <div className="text-sm text-muted-foreground">{project.location}</div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};