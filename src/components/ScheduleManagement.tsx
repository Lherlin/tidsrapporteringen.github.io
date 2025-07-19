import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Plus, Edit, Trash2, Coffee } from "lucide-react";

interface Schedule {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  project?: string;
}

const mockSchedules: Schedule[] = [
  {
    id: '1',
    employeeId: 'emp1',
    employeeName: 'Erik Andersson',
    date: '2024-01-19',
    startTime: '08:00',
    endTime: '16:00',
    breakMinutes: 60,
    project: 'Kungsgatan 214'
  },
  {
    id: '2',
    employeeId: 'emp2',
    employeeName: 'Maria Lindberg',
    date: '2024-01-19',
    startTime: '07:30',
    endTime: '15:30',
    breakMinutes: 30,
    project: 'Villa Södermalm'
  }
];

const employees = [
  { id: 'emp1', name: 'Erik Andersson' },
  { id: 'emp2', name: 'Maria Lindberg' },
  { id: 'emp3', name: 'Johan Svensson' },
  { id: 'emp4', name: 'Anna Karlsson' }
];

export const ScheduleManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    employeeId: '',
    startTime: '08:00',
    endTime: '16:00',
    breakMinutes: 60,
    project: ''
  });

  const filteredSchedules = mockSchedules.filter(schedule => schedule.date === selectedDate);

  const calculateWorkHours = (startTime: string, endTime: string, breakMinutes: number) => {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60) - breakMinutes;
    return totalMinutes / 60;
  };

  const handleAddSchedule = () => {
    if (!newSchedule.employeeId || !newSchedule.startTime || !newSchedule.endTime) {
      return;
    }

    const employee = employees.find(emp => emp.id === newSchedule.employeeId);
    if (!employee) return;

    console.log('Adding schedule:', {
      ...newSchedule,
      employeeName: employee.name,
      date: selectedDate,
      id: `schedule_${Date.now()}`
    });

    // Reset form
    setNewSchedule({
      employeeId: '',
      startTime: '08:00',
      endTime: '16:00',
      breakMinutes: 60,
      project: ''
    });
    setIsAddingSchedule(false);
    
    alert('Schema tillagt!');
  };

  const handleQuickBreak = () => {
    setNewSchedule(prev => ({ ...prev, breakMinutes: 60 }));
  };

  return (
    <div className="space-y-6">
      {/* Date selector and add button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Schemahantering
            </div>
            <Button 
              size="sm" 
              onClick={() => setIsAddingSchedule(!isAddingSchedule)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Lägg till schema
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Välj datum
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>

          {/* Add new schedule form */}
          {isAddingSchedule && (
            <Card className="border border-primary/20 bg-primary/5">
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Medarbetare
                      </label>
                      <select
                        value={newSchedule.employeeId}
                        onChange={(e) => setNewSchedule(prev => ({ ...prev, employeeId: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="">Välj medarbetare...</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Projekt (valfritt)
                      </label>
                      <Input
                        value={newSchedule.project}
                        onChange={(e) => setNewSchedule(prev => ({ ...prev, project: e.target.value }))}
                        placeholder="Projektnamn..."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Starttid
                      </label>
                      <Input
                        type="time"
                        value={newSchedule.startTime}
                        onChange={(e) => setNewSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Sluttid
                      </label>
                      <Input
                        type="time"
                        value={newSchedule.endTime}
                        onChange={(e) => setNewSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Rast (minuter)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="120"
                          value={newSchedule.breakMinutes}
                          onChange={(e) => setNewSchedule(prev => ({ ...prev, breakMinutes: parseInt(e.target.value) || 0 }))}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleQuickBreak}
                          title="60 min standardrast"
                        >
                          <Coffee className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleAddSchedule} className="flex-1">
                      Lägg till schema
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddingSchedule(false)}
                    >
                      Avbryt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Schedule list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Schema för {new Date(selectedDate).toLocaleDateString('sv-SE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {filteredSchedules.length > 0 ? (
            <div className="space-y-3">
              {filteredSchedules.map((schedule) => {
                const workHours = calculateWorkHours(schedule.startTime, schedule.endTime, schedule.breakMinutes);
                
                return (
                  <Card key={schedule.id} className="border border-border/50">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-primary" />
                              <span className="font-semibold text-foreground">{schedule.employeeName}</span>
                            </div>
                            {schedule.project && (
                              <Badge variant="outline">{schedule.project}</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Coffee className="w-3 h-3" />
                              {schedule.breakMinutes} min rast
                            </div>
                            <Badge variant="secondary">
                              {workHours.toFixed(1)}h arbete
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Inget schema planerat för detta datum</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};