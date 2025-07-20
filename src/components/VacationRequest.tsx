import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plane, Calendar, Clock, Send, AlertCircle, Sun } from "lucide-react";

interface VacationRequest {
  id: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const mockVacationRequests: VacationRequest[] = [
  {
    id: '1',
    startDate: '2024-02-15',
    endDate: '2024-02-19',
    days: 5,
    reason: 'Semester med familjen',
    status: 'approved',
    submittedAt: '2024-01-10T10:00:00'
  },
  {
    id: '2',
    startDate: '2024-03-20',
    endDate: '2024-03-22',
    days: 3,
    reason: 'Påskledighet',
    status: 'pending',
    submittedAt: '2024-01-15T14:30:00'
  }
];

export const VacationRequest = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateWorkDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    let count = 0;
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) { // Skip weekends
        count++;
      }
    }
    
    return count;
  };

  const workDays = calculateWorkDays(startDate, endDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !reason.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Vacation request submitted:', {
        startDate,
        endDate,
        days: workDays,
        reason,
        submittedAt: new Date().toISOString()
      });
      
      // Reset form
      setStartDate("");
      setEndDate("");
      setReason("");
      setIsSubmitting(false);
      
      alert('Ledighetsansökan skickad till admin för godkännande');
    }, 1000);
  };

  const getStatusColor = (status: VacationRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'approved': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
    }
  };

  const getStatusText = (status: VacationRequest['status']) => {
    switch (status) {
      case 'pending': return 'Väntar på godkännande';
      case 'approved': return 'Godkänd';
      case 'rejected': return 'Avvisad';
    }
  };

  return (
    <div className="space-y-6">
      {/* Submit new vacation request */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-primary" />
            Ny ledighetsansökan
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Startdatum *
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Slutdatum *
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            
            {workDays > 0 && (
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Antal arbetsdagar: {workDays} dagar
                  </span>
                </div>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Anledning *
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Beskriv anledningen till ledigheten..."
                rows={3}
                required
              />
            </div>
            
            <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p><strong>Viktigt:</strong> Ansök om ledighet i god tid, helst en månad innan tillfället du ska vara ledig, senast.</p>
                  <p>Ledighetsansökan skickas till din chef för godkännande.</p>
                  <p>Ansök i god tid för att säkerställa godkännande.</p>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || !startDate || !endDate || !reason.trim()}
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Skickar...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Skicka ledighetsansökan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Previous vacation requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Tidigare ledighetsansökningar
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {mockVacationRequests.length > 0 ? (
            <div className="space-y-3">
              {mockVacationRequests.map((request) => (
                <div 
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/50"
                >
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      {new Date(request.startDate).toLocaleDateString('sv-SE')} - {new Date(request.endDate).toLocaleDateString('sv-SE')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {request.reason} ({request.days} dagar)
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Skickad: {new Date(request.submittedAt).toLocaleDateString('sv-SE')}
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusText(request.status)}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Plane className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Inga ledighetsansökningar registrerade</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};