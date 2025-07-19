import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Phone, Mail, MapPin, Clock } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  isOnline: boolean;
  currentProject?: string;
  avatar?: string;
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Erik Andersson',
    role: 'Byggarbetare',
    email: 'erik.andersson@byggfirma.se',
    phone: '+46 70 123 45 67',
    department: 'Byggnation',
    isOnline: true,
    currentProject: 'Kungsgatan 214'
  },
  {
    id: '2',
    name: 'Maria Lindberg',
    role: 'Projektledare',
    email: 'maria.lindberg@byggfirma.se',
    phone: '+46 70 234 56 78',
    department: 'Projektledning',
    isOnline: true,
    currentProject: 'Villa Södermalm'
  },
  {
    id: '3',
    name: 'Johan Svensson',
    role: 'Elektriker',
    email: 'johan.svensson@byggfirma.se',
    phone: '+46 70 345 67 89',
    department: 'El & VVS',
    isOnline: false
  },
  {
    id: '4',
    name: 'Anna Karlsson',
    role: 'Administratör',
    email: 'anna.karlsson@byggfirma.se',
    phone: '+46 70 456 78 90',
    department: 'Administration',
    isOnline: true
  },
  {
    id: '5',
    name: 'Peter Nilsson',
    role: 'VVS-tekniker',
    email: 'peter.nilsson@byggfirma.se',
    phone: '+46 70 567 89 01',
    department: 'El & VVS',
    isOnline: true,
    currentProject: 'Kungsgatan 214'
  }
];

export const CompanyDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const departments = Array.from(new Set(mockEmployees.map(emp => emp.department)));

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = !searchTerm || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Företagskatalog
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Byggfirma Nord AB - {mockEmployees.length} medarbetare
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Sök efter namn, roll eller avdelning..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background min-w-[180px]"
          >
            <option value="all">Alla avdelningar</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Employee list */}
        <div className="space-y-3">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="border border-border/50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  {/* Avatar and online status */}
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                      employee.isOnline ? 'bg-success' : 'bg-muted-foreground'
                    }`} />
                  </div>
                  
                  {/* Employee info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.role}</p>
                        <p className="text-xs text-muted-foreground">{employee.department}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {employee.isOnline && (
                          <Badge variant="success" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Online
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Current project */}
                    {employee.currentProject && (
                      <div className="flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="text-xs text-primary font-medium">
                          {employee.currentProject}
                        </span>
                      </div>
                    )}
                    
                    {/* Contact buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCall(employee.phone)}
                        className="flex-1"
                      >
                        <Phone className="w-3 h-3 mr-2" />
                        Ring
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEmail(employee.email)}
                        className="flex-1"
                      >
                        <Mail className="w-3 h-3 mr-2" />
                        Maila
                      </Button>
                    </div>
                    
                    {/* Contact info */}
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {employee.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {employee.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredEmployees.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Inga medarbetare hittades</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};