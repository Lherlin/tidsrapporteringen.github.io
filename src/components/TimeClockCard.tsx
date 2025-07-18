import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Play, Square, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimeClockCardProps {
  isWorking: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
  currentProject?: string;
  workTime?: string;
}

export const TimeClockCard = ({ 
  isWorking, 
  onClockIn, 
  onClockOut, 
  currentProject = "Inget projekt valt",
  workTime = "00:00"
}: TimeClockCardProps) => {
  const { toast } = useToast();

  const handleClockAction = () => {
    if (isWorking) {
      onClockOut();
      toast({
        title: "Utstämplad",
        description: "Du har stämplat ut framgångsrikt",
        variant: "default",
      });
    } else {
      onClockIn();
      toast({
        title: "Instämplad",
        description: "Du har stämplat in framgångsrikt",
        variant: "default",
      });
    }
  };

  return (
    <Card className="w-full shadow-lg border-2 border-border/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Clock className="w-8 h-8 text-primary" />
          Tidstämpling
        </CardTitle>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{currentProject}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current time display */}
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground mb-2">
            {new Date().toLocaleTimeString('sv-SE', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
          {isWorking && (
            <div className="text-lg text-primary font-semibold">
              Arbetat idag: {workTime}
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            isWorking 
              ? 'bg-success/10 text-success border border-success/20' 
              : 'bg-muted text-muted-foreground border border-border'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              isWorking ? 'bg-success animate-pulse' : 'bg-muted-foreground'
            }`} />
            <span className="font-medium">
              {isWorking ? 'Arbetar nu' : 'Inte påbörjat'}
            </span>
          </div>
        </div>

        {/* Main action button */}
        <Button
          onClick={handleClockAction}
          variant={isWorking ? "destructive" : "success"}
          size="touch"
          className="w-full"
        >
          {isWorking ? (
            <>
              <Square className="w-6 h-6 mr-2" />
              Stämpla ut
            </>
          ) : (
            <>
              <Play className="w-6 h-6 mr-2" />
              Stämpla in
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};