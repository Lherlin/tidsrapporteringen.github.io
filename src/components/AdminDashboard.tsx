import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Calendar, 
  Download, 
  Mail, 
  Printer,
  Filter,
  Clock,
  AlertTriangle,
  Search
} from "lucide-react";

interface TimeEntry {
  id: string;
  employeeName: string;
  project: string;
  date: string;
  hours: number;
  notes: string;
  deviations?: string;
  status: 'submitted' | 'approved' | 'rejected';
}

const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    employeeName: 'Erik Andersson',
    project: 'Kungsgatan 214',
    date: '2024-01-18',
    hours: 8,
    notes: 'Färdigställt grundmur på våning 2, påbörjat eldragning',
    deviations: 'Leverans av material försenad 2 timmar',
    status: 'submitted'
  },
  {
    id: '2',
    employeeName: 'Maria Lindberg',
    project: 'Villa Södermalm', 
    date: '2024-01-18',
    hours: 7.5,
    notes: 'Målning av fasad, första skiktet klart',
    status: 'approved'
  },
  {
    id: '3',
    employeeName: 'Johan Svensson',
    project: 'Kungsgatan 214',
    date: '2024-01-18', 
    hours: 6,
    notes: 'VVS-installation badrum våning 1',
    deviations: 'Fel dimension på rör, behövde beställa nya',
    status: 'submitted'
  }
];

interface AdminDashboardProps {
  selectedProject?: string;
}

export const AdminDashboard = ({ selectedProject }: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'approved' | 'rejected'>('all');

  const filteredEntries = mockTimeEntries.filter(entry => {
    const matchesProject = !selectedProject || entry.project === selectedProject;
    const matchesSearch = !searchTerm || 
      entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || entry.date === selectedDate;
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    
    return matchesProject && matchesSearch && matchesDate && matchesStatus;
  });

  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalDeviations = filteredEntries.filter(entry => entry.deviations).length;

  const getStatusColor = (status: TimeEntry['status']) => {
    switch (status) {
      case 'submitted': return 'bg-warning text-warning-foreground';
      case 'approved': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: TimeEntry['status']) => {
    switch (status) {
      case 'submitted': return 'Inlämnad';
      case 'approved': return 'Godkänd';
      case 'rejected': return 'Avvisad';
      default: return 'Okänd';
    }
  };

  const handleExport = (type: 'email' | 'print') => {
    // Mock export functionality
    if (type === 'email') {
      alert('Export till e-post funktionalitet kommer snart');
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" />
              Total tid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalHours}h</div>
            <div className="text-sm text-muted-foreground">
              {filteredEntries.length} rapporter
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary" />
              Medarbetare
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {new Set(filteredEntries.map(e => e.employeeName)).size}
            </div>
            <div className="text-sm text-muted-foreground">
              Aktiva idag
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Avvikelser
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalDeviations}</div>
            <div className="text-sm text-muted-foreground">
              Rapporterade idag
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tidsrapporter</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('email')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Skicka mail
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('print')}
              >
                <Printer className="w-4 h-4 mr-2" />
                Skriv ut
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Sök medarbetare eller anteckningar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">Alla statusar</option>
              <option value="submitted">Inlämnad</option>
              <option value="approved">Godkänd</option>
              <option value="rejected">Avvisad</option>
            </select>
          </div>

          {/* Time entries list */}
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="border border-border/50">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{entry.employeeName}</h4>
                      <p className="text-sm text-muted-foreground">{entry.project}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">{entry.hours}h</div>
                      <Badge className={getStatusColor(entry.status)}>
                        {getStatusText(entry.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-foreground">Anteckningar:</span>
                      <p className="text-sm text-muted-foreground">{entry.notes}</p>
                    </div>
                    
                    {entry.deviations && (
                      <div className="bg-warning/10 p-3 rounded border border-warning/20">
                        <span className="text-sm font-medium text-warning flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Avvikelse:
                        </span>
                        <p className="text-sm text-foreground">{entry.deviations}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('sv-SE', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    
                    {entry.status === 'submitted' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Avvisa
                        </Button>
                        <Button size="sm" variant="success">
                          Godkänn
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};