import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, UserPlus, Shield, Mail, Phone, Building2, Crown, User, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  userRole: 'admin' | 'employee';
  department?: string;
  joinDate: string;
  status: 'active' | 'pending' | 'inactive';
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Erik Andersson",
    email: "erik.andersson@byggfirma.se",
    phone: "+46 70 123 45 67",
    role: "Byggarbetare",
    userRole: "employee",
    department: "Renovering",
    joinDate: "2024-01-15",
    status: "active"
  },
  {
    id: "2",
    name: "Anna Larsson",
    email: "anna.larsson@byggfirma.se",
    phone: "+46 70 234 56 78",
    role: "Projektledare",
    userRole: "admin",
    department: "Nybyggnation",
    joinDate: "2023-06-10",
    status: "active"
  },
  {
    id: "3",
    name: "Magnus Johansson",
    email: "magnus.johansson@byggfirma.se",
    phone: "+46 70 345 67 89",
    role: "Elektriker",
    userRole: "employee",
    department: "Installation",
    joinDate: "2024-03-20",
    status: "pending"
  }
];

export const RoleManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "",
    userRole: "employee" as 'admin' | 'employee',
    department: ""
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (userRole: 'admin' | 'employee') => {
    return userRole === 'admin' ? 'default' : 'secondary';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleInviteEmployee = () => {
    if (!inviteForm.email || !inviteForm.role) {
      toast.error("Fyll i alla obligatoriska fält");
      return;
    }

    // In real app, this would send an invitation email
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: "Väntande användare",
      email: inviteForm.email,
      phone: "",
      role: inviteForm.role,
      userRole: inviteForm.userRole,
      department: inviteForm.department,
      joinDate: new Date().toISOString().split('T')[0],
      status: "pending"
    };

    setEmployees([...employees, newEmployee]);
    setInviteForm({ email: "", role: "", userRole: "employee", department: "" });
    setIsInviteDialogOpen(false);
    toast.success(`Inbjudan skickad till ${inviteForm.email}`);
  };

  const handleRoleChange = (employeeId: string, newUserRole: 'admin' | 'employee') => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, userRole: newUserRole }
        : emp
    ));
    toast.success("Användarroll uppdaterad");
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter(emp => emp.id !== employeeId));
    toast.success("Användare borttagen");
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Användarhantering
            </div>
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Bjud in användare
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bjud in ny användare</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">E-postadress</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="användarens@email.se"
                        className="pl-10"
                        value={inviteForm.email}
                        onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="role">Jobbroll</Label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value) => setInviteForm({...inviteForm, role: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Välj jobbroll" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="byggarbetare">Byggarbetare</SelectItem>
                        <SelectItem value="elektriker">Elektriker</SelectItem>
                        <SelectItem value="rörmokare">Rörmokare</SelectItem>
                        <SelectItem value="målare">Målare</SelectItem>
                        <SelectItem value="snickare">Snickare</SelectItem>
                        <SelectItem value="platschef">Platschef</SelectItem>
                        <SelectItem value="projektledare">Projektledare</SelectItem>
                        <SelectItem value="arbetsledare">Arbetsledare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="userRole">Användarroll</Label>
                    <Select
                      value={inviteForm.userRole}
                      onValueChange={(value: 'admin' | 'employee') => setInviteForm({...inviteForm, userRole: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Välj användarroll" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Anställd</SelectItem>
                        <SelectItem value="admin">Administratör</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department">Avdelning (frivilligt)</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="department"
                        placeholder="t.ex. Renovering, Nybyggnation"
                        className="pl-10"
                        value={inviteForm.department}
                        onChange={(e) => setInviteForm({...inviteForm, department: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)} className="flex-1">
                      Avbryt
                    </Button>
                    <Button onClick={handleInviteEmployee} className="flex-1">
                      Skicka inbjudan
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Sök efter namn, email eller roll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="border border-border/50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(employee.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{employee.name}</h4>
                          <Badge variant={getRoleColor(employee.userRole)}>
                            {employee.userRole === 'admin' ? (
                              <Crown className="w-3 h-3 mr-1" />
                            ) : (
                              <User className="w-3 h-3 mr-1" />
                            )}
                            {employee.userRole === 'admin' ? 'Admin' : 'Anställd'}
                          </Badge>
                          <Badge variant={getStatusColor(employee.status)}>
                            {employee.status === 'active' ? 'Aktiv' : 
                             employee.status === 'pending' ? 'Väntande' : 'Inaktiv'}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <div>{employee.role}</div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {employee.email}
                            </span>
                            {employee.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {employee.phone}
                              </span>
                            )}
                          </div>
                          {employee.department && (
                            <div className="flex items-center gap-1 mt-1">
                              <Building2 className="w-3 h-3" />
                              {employee.department}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={employee.userRole}
                        onValueChange={(value: 'admin' | 'employee') => handleRoleChange(employee.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Anställd</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Ta bort användare</AlertDialogTitle>
                            <AlertDialogDescription>
                              Är du säker på att du vill ta bort {employee.name}? Denna åtgärd kan inte ångras.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Avbryt</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Ta bort
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Inga användare hittades</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};