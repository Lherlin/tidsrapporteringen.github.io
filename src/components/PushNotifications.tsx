import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Clock, 
  Settings, 
  Smartphone,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettings {
  enabled: boolean;
  beforeWorkStart: number; // minutes before
  afterWorkStart: number; // minutes after
  beforeWorkEnd: number; // minutes before  
  afterWorkEnd: number; // minutes after
  workStartTime: string;
  workEndTime: string;
  workDays: number[]; // 0-6 (Sunday-Saturday)
}

interface PushNotificationsProps {
  userRole: 'admin' | 'employee';
}

export const PushNotifications = ({ userRole }: PushNotificationsProps) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    beforeWorkStart: 30,
    afterWorkStart: 15,
    beforeWorkEnd: 10,
    afterWorkEnd: 5,
    workStartTime: "07:00",
    workEndTime: "16:00",
    workDays: [1, 2, 3, 4, 5] // Monday-Friday
  });
  
  const [hasPermission, setHasPermission] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === 'granted');
      
      if (permission === 'granted') {
        toast({
          title: "Notifikationer aktiverade",
          description: "Du får nu påminnelser om tidsrapportering",
        });
      }
    }
  };

  const sendTestNotification = () => {
    if (hasPermission) {
      new Notification('Tidrapportering - Test', {
        body: 'Detta är en testnotifikation för att kontrollera att allt fungerar',
        icon: '/favicon.ico'
      });
    }
  };

  const updateSettings = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Inställningar sparade",
      description: "Notifikationsinställningarna har uppdaterats",
    });
  };

  const getNextNotifications = () => {
    const now = new Date();
    const today = now.getDay();
    
    if (!settings.workDays.includes(today)) {
      return "Inga notifikationer idag (helgdag)";
    }

    const workStart = new Date();
    const [startHour, startMin] = settings.workStartTime.split(':').map(Number);
    workStart.setHours(startHour, startMin, 0, 0);

    const workEnd = new Date();
    const [endHour, endMin] = settings.workEndTime.split(':').map(Number);
    workEnd.setHours(endHour, endMin, 0, 0);

    const notifications = [];
    
    // Before work start
    const beforeStart = new Date(workStart);
    beforeStart.setMinutes(beforeStart.getMinutes() - settings.beforeWorkStart);
    if (beforeStart > now) {
      notifications.push(`${beforeStart.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })} - Påminnelse: Arbete börjar snart`);
    }

    // After work start
    const afterStart = new Date(workStart);
    afterStart.setMinutes(afterStart.getMinutes() + settings.afterWorkStart);
    if (afterStart > now) {
      notifications.push(`${afterStart.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })} - Glöm inte stämpla in`);
    }

    return notifications.length > 0 ? notifications : ["Alla påminnelser för idag har skickats"];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Push-notifikationer
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Permission status */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Notifikationsbehörighet</div>
                <div className="text-sm text-muted-foreground">
                  {hasPermission ? 'Aktiverad' : 'Behöver aktiveras'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {hasPermission ? (
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Aktiverad
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Inaktiv
                </Badge>
              )}
              
              {!hasPermission && (
                <Button onClick={requestPermission} size="sm">
                  Aktivera
                </Button>
              )}
            </div>
          </div>

          {/* Main toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Aktivera påminnelser</div>
              <div className="text-sm text-muted-foreground">
                Få notifikationer om tidsrapportering
              </div>
            </div>
            <Switch
              checked={settings.enabled && hasPermission}
              onCheckedChange={(checked) => updateSettings('enabled', checked)}
              disabled={!hasPermission}
            />
          </div>

          {/* Work schedule */}
          {settings.enabled && hasPermission && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Arbetstid start
                  </label>
                  <input
                    type="time"
                    value={settings.workStartTime}
                    onChange={(e) => updateSettings('workStartTime', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Arbetstid slut
                  </label>
                  <input
                    type="time"
                    value={settings.workEndTime}
                    onChange={(e) => updateSettings('workEndTime', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
              </div>

              {/* Notification timing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Påminnelse före arbetsstart (min)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={settings.beforeWorkStart}
                    onChange={(e) => updateSettings('beforeWorkStart', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Påminnelse efter arbetsstart (min)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={settings.afterWorkStart}
                    onChange={(e) => updateSettings('afterWorkStart', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
              </div>

              {/* Next notifications preview */}
              <div className="bg-secondary/30 p-4 rounded-lg border border-border/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Nästa påminnelser idag
                </h4>
                <div className="space-y-1">
                  {Array.isArray(getNextNotifications()) ? (
                    (getNextNotifications() as string[]).map((notification, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {notification}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {getNextNotifications()}
                    </div>
                  )}
                </div>
              </div>

              {/* Test button */}
              <Button
                onClick={sendTestNotification}
                variant="outline"
                className="w-full"
                disabled={!hasPermission}
              >
                Skicka testnotifikation
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};