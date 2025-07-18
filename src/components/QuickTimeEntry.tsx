import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, Save, AlertTriangle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickTimeEntryProps {
  selectedProject?: string;
  onTimeSubmit: (timeData: {
    hours: number;
    notes: string;
    deviations: string;
    project: string;
  }) => void;
}

const quickHours = [1, 2, 3, 4, 5, 6, 7, 8];

export const QuickTimeEntry = ({ selectedProject, onTimeSubmit }: QuickTimeEntryProps) => {
  const [selectedHours, setSelectedHours] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [deviations, setDeviations] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedProject) {
      toast({
        title: "Fel",
        description: "Välj ett projekt först",
        variant: "destructive",
      });
      return;
    }

    if (!selectedHours) {
      toast({
        title: "Fel", 
        description: "Välj antal timmar",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onTimeSubmit({
        hours: selectedHours,
        notes,
        deviations,
        project: selectedProject
      });
      
      toast({
        title: "Sparat!",
        description: `${selectedHours}h registrerat för ${selectedProject}`,
        variant: "default",
      });
      
      // Reset form
      setSelectedHours(null);
      setNotes("");
      setDeviations("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Snabb tidsregistrering
        </CardTitle>
        {selectedProject && (
          <Badge variant="outline" className="w-fit">
            {selectedProject}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick hour selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Välj antal timmar
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickHours.map((hour) => (
              <Button
                key={hour}
                variant={selectedHours === hour ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedHours(hour)}
                className="h-12 text-lg font-bold"
              >
                {hour}h
              </Button>
            ))}
          </div>
          
          {/* Custom hours input */}
          <div className="mt-3">
            <Input
              type="number"
              placeholder="Ange egna timmar..."
              min="0.5"
              max="24"
              step="0.5"
              value={selectedHours && !quickHours.includes(selectedHours) ? selectedHours : ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setSelectedHours(value);
                }
              }}
              className="h-12"
            />
          </div>
        </div>

        {/* Work notes */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Anteckningar om dagens arbete
          </label>
          <Textarea
            placeholder="Beskriv vad som gjordes idag..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Deviations */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Avvikelser och oplanerade händelser
          </label>
          <Textarea
            placeholder="Rapportera problem, förseningar eller andra avvikelser..."
            value={deviations}
            onChange={(e) => setDeviations(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            T.ex. väderproblem, leveransförseningar, skador på utrustning
          </p>
        </div>

        {/* Submit button */}
        <Button
          onClick={handleSubmit}
          disabled={!selectedProject || !selectedHours || isSubmitting}
          size="touch"
          variant="success"
          className="w-full"
        >
          <Save className="w-5 h-5 mr-2" />
          {isSubmitting ? "Sparar..." : "Spara arbetstid"}
        </Button>
      </CardContent>
    </Card>
  );
};