import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, CheckCircle, Timer } from "lucide-react";

interface TimeEntry {
  id: string;
  project: string;
  startTime: string;
  endTime?: string;
  duration: string;
  status: 'completed' | 'ongoing';
}

const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    project: 'Villa Södermalm',
    startTime: '08:00',
    endTime: '12:00',
    duration: '4:00',
    status: 'completed'
  },
  {
    id: '2',
    project: 'Villa Södermalm',
    startTime: '13:00',
    endTime: undefined,
    duration: '2:30',
    status: 'ongoing'
  }
];

interface DailyOverviewProps {
  date?: Date;
}

export const DailyOverview = ({ date = new Date() }: DailyOverviewProps) => {
  const totalHours = mockTimeEntries.reduce((sum, entry) => {
    const [hours, minutes] = entry.duration.split(':').map(Number);
    return sum + hours + minutes / 60;
  }, 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          {isToday ? 'Idag' : formatDate(date)}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Daily summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Total tid</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {Math.floor(totalHours)}:{String(Math.round((totalHours % 1) * 60)).padStart(2, '0')}
            </div>
          </div>
          
          <div className="bg-success/5 p-4 rounded-lg border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Sessioner</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {mockTimeEntries.length}
            </div>
          </div>
        </div>

        {/* Time entries */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Arbetstider</h4>
          {mockTimeEntries.length > 0 ? (
            mockTimeEntries.map((entry) => (
              <div 
                key={entry.id}
                className="flex items-center justify-between p-3 bg-card rounded-lg border border-border shadow-sm"
              >
                <div className="flex-1">
                  <div className="font-medium text-foreground">{entry.project}</div>
                  <div className="text-sm text-muted-foreground">
                    {entry.startTime} - {entry.endTime || 'Pågående'}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Timer className="w-3 h-3" />
                      {entry.duration}
                    </div>
                  </div>
                  
                  <Badge 
                    variant={entry.status === 'ongoing' ? 'default' : 'secondary'}
                    className={entry.status === 'ongoing' ? 'bg-success text-success-foreground' : ''}
                  >
                    {entry.status === 'ongoing' ? 'Pågående' : 'Avslutad'}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Inga arbetstider registrerade idag</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};