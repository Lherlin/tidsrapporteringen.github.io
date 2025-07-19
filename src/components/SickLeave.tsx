import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Clock, Send, AlertCircle } from "lucide-react";

interface SickLeaveEntry {
  id: string;
  startDate: string;
  endDate?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const mockSickLeaves: SickLeaveEntry[] = [
  {
    id: '1',
    startDate: '2024-01-15',
    endDate: '2024-01-16',
    reason: 'Feber och huvudvärk',
    status: 'approved',
    submittedAt: '2024-01-15T08:00:00'
  },
  {
    id: '2',
    startDate: '2024-01-10',
    reason: 'Magsjuka',
    status: 'pending',
    submittedAt: '2024-01-10T07:30:00'
  }
];

export const SickLeave = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !reason.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Sick leave submitted:', {
        startDate,
        endDate: endDate || startDate,
        reason,
        submittedAt: new Date().toISOString()
      });
      
      // Reset form
      setStartDate("");
      setEndDate("");
      setReason("");
      setIsSubmitting(false);
      
      alert('Sjukanmälan skickad till admin för godkännande');
    }, 1000);
  };

  const getStatusColor = (status: SickLeaveEntry['status']) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'approved': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
    }
  };

  const getStatusText = (status: SickLeaveEntry['status']) => {
    switch (status) {
      case 'pending': return 'Väntar på godkännande';
      case 'approved': return 'Godkänd';
      case 'rejected': return 'Avvisad';
    }
  };

  return (
    <div className="space-y-6">
      {/* Submit new sick leave */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Ny sjukanmälan
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
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Slutdatum (valfritt)
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Anledning *
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Beskriv kort anledningen till sjukfrånvaron..."
                rows={3}
                required
              />
            </div>
            
            <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p>Sjukanmälan skickas till din chef för godkännande.</p>
                  <p>Du kommer att få en bekräftelse via push-notis när beslut är fattat.</p>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || !startDate || !reason.trim()}
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Skickar...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Skicka sjukanmälan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Previous sick leaves */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Tidigare sjukanmälningar
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {mockSickLeaves.length > 0 ? (
            <div className="space-y-3">
              {mockSickLeaves.map((sickLeave) => (
                <div 
                  key={sickLeave.id}
                  className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/50"
                >
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      {new Date(sickLeave.startDate).toLocaleDateString('sv-SE')}
                      {sickLeave.endDate && sickLeave.endDate !== sickLeave.startDate && (
                        ` - ${new Date(sickLeave.endDate).toLocaleDateString('sv-SE')}`
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{sickLeave.reason}</div>
                    <div className="text-xs text-muted-foreground">
                      Skickad: {new Date(sickLeave.submittedAt).toLocaleDateString('sv-SE')}
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(sickLeave.status)}>
                    {getStatusText(sickLeave.status)}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Inga sjukanmälningar registrerade</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};