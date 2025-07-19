import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, CheckCircle, Timer, TrendingUp } from "lucide-react";

interface TimeEntry {
  id: string;
  project: string;
  startTime: string;
  endTime?: string;
  duration: string;
  status: 'completed' | 'ongoing';
  date: string;
}

const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    project: 'Villa Södermalm',
    startTime: '08:00',
    endTime: '12:00',
    duration: '4:00',
    status: 'completed',
    date: '2024-01-18'
  },
  {
    id: '2',
    project: 'Villa Södermalm',
    startTime: '13:00',
    endTime: '17:00',
    duration: '4:00',
    status: 'completed',
    date: '2024-01-17'
  },
  {
    id: '3',
    project: 'Kungsgatan 214',
    startTime: '08:00',
    endTime: '16:00',
    duration: '8:00',
    status: 'completed',
    date: '2024-01-16'
  }
];

type PeriodType = 'day' | 'week' | 'month' | 'year';

interface TimeOverviewProps {
  date?: Date;
}

export const TimeOverview = ({ date = new Date() }: TimeOverviewProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('day');

  const calculateTotalHours = (period: PeriodType, entries: TimeEntry[]) => {
    const now = new Date();
    
    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      
      switch (period) {
        case 'day':
          return entryDate.toDateString() === now.toDateString();
        case 'week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return entryDate >= weekStart && entryDate <= weekEnd;
        case 'month':
          return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
        case 'year':
          return entryDate.getFullYear() === now.getFullYear();
        default:
          return false;
      }
    });

    return filteredEntries.reduce((sum, entry) => {
      const [hours, minutes] = entry.duration.split(':').map(Number);
      return sum + hours + minutes / 60;
    }, 0);
  };

  const getPeriodLabel = (period: PeriodType) => {
    switch (period) {
      case 'day': return 'Idag';
      case 'week': return 'Denna vecka';
      case 'month': return 'Denna månad';
      case 'year': return 'Detta år';
    }
  };

  const getPeriodEntries = (period: PeriodType) => {
    const now = new Date();
    
    return mockTimeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      
      switch (period) {
        case 'day':
          return entryDate.toDateString() === now.toDateString();
        case 'week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return entryDate >= weekStart && entryDate <= weekEnd;
        case 'month':
          return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
        case 'year':
          return entryDate.getFullYear() === now.getFullYear();
        default:
          return false;
      }
    });
  };

  const totalHours = calculateTotalHours(selectedPeriod, mockTimeEntries);
  const periodEntries = getPeriodEntries(selectedPeriod);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Tidöversikt
        </CardTitle>
        
        {/* Period selector */}
        <div className="flex gap-2 mt-4">
          {(['day', 'week', 'month', 'year'] as PeriodType[]).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="text-xs"
            >
              {getPeriodLabel(period)}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary stats */}
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
              {periodEntries.length}
            </div>
          </div>
        </div>

        {/* Time entries */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Arbetstider - {getPeriodLabel(selectedPeriod)}</h4>
          {periodEntries.length > 0 ? (
            periodEntries.map((entry) => (
              <div 
                key={entry.id}
                className="flex items-center justify-between p-3 bg-card rounded-lg border border-border shadow-sm"
              >
                <div className="flex-1">
                  <div className="font-medium text-foreground">{entry.project}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString('sv-SE')} • {entry.startTime} - {entry.endTime || 'Pågående'}
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
              <p>Inga arbetstider registrerade för {getPeriodLabel(selectedPeriod).toLowerCase()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};