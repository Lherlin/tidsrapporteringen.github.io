import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Wifi, WifiOff, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface LocationConfig {
  projectId: string;
  projectName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

const mockLocationConfigs: LocationConfig[] = [
  {
    projectId: 'project1',
    projectName: 'Kungsgatan 214',
    latitude: 59.3293,
    longitude: 18.0686,
    radiusMeters: 50
  },
  {
    projectId: 'project2',
    projectName: 'Villa Södermalm',
    latitude: 59.3157,
    longitude: 18.0647,
    radiusMeters: 100
  }
];

interface LocationTimeEntryProps {
  selectedProject: string;
  selectedProjectName: string;
  onLocationVerified: (verified: boolean) => void;
  isRequired?: boolean;
}

export const LocationTimeEntry = ({ 
  selectedProject, 
  selectedProjectName, 
  onLocationVerified,
  isRequired = false 
}: LocationTimeEntryProps) => {
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [isWithinRange, setIsWithinRange] = useState<boolean>(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);

  const projectConfig = mockLocationConfigs.find(config => config.projectId === selectedProject);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const checkLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Platstjänster stöds inte av din enhet");
      onLocationVerified(false);
      return;
    }

    setIsCheckingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation(position);
        
        if (projectConfig) {
          const distance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            projectConfig.latitude,
            projectConfig.longitude
          );
          
          const withinRange = distance <= projectConfig.radiusMeters;
          setIsWithinRange(withinRange);
          onLocationVerified(withinRange);
          
          if (!withinRange) {
            setLocationError(`Du är ${Math.round(distance)}m från projektet. Du måste vara inom ${projectConfig.radiusMeters}m för att stämpla.`);
          }
        }
        
        setIsCheckingLocation(false);
      },
      (error) => {
        let errorMessage = "Kunde inte hämta din position";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Platstjänster nekades. Aktivera platsåtkomst i inställningar.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Positionsinformation är inte tillgänglig.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tidsgräns uppnådd för att hämta position.";
            break;
        }
        
        setLocationError(errorMessage);
        setIsCheckingLocation(false);
        onLocationVerified(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  useEffect(() => {
    if (isRequired && projectConfig) {
      checkLocation();
    } else if (!isRequired) {
      onLocationVerified(true);
    }
  }, [selectedProject, isRequired]);

  if (!isRequired || !projectConfig) {
    return null;
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-primary" />
          Platsverifiering
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
          <div>
            <div className="font-medium text-foreground">{selectedProjectName}</div>
            <div className="text-sm text-muted-foreground">
              Kräver {projectConfig.radiusMeters}m närhet
            </div>
          </div>
          
          <Badge 
            variant={isWithinRange ? "success" : locationError ? "destructive" : "secondary"}
            className="flex items-center gap-1"
          >
            {isCheckingLocation ? (
              <>
                <Clock className="w-3 h-3 animate-spin" />
                Kontrollerar...
              </>
            ) : isWithinRange ? (
              <>
                <CheckCircle className="w-3 h-3" />
                Godkänd plats
              </>
            ) : locationError ? (
              <>
                <AlertTriangle className="w-3 h-3" />
                Fel plats
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3" />
                Väntar
              </>
            )}
          </Badge>
        </div>

        {locationError && (
          <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
              <div>
                <div className="text-sm font-medium text-destructive">Platsfel</div>
                <div className="text-xs text-destructive/80">{locationError}</div>
              </div>
            </div>
          </div>
        )}

        {currentLocation && isWithinRange && (
          <div className="bg-success/10 p-3 rounded-lg border border-success/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <div className="text-sm font-medium text-success">
                Platsverifiering genomförd
              </div>
            </div>
            <div className="text-xs text-success/80 mt-1">
              Du befinner dig på rätt plats för {selectedProjectName}
            </div>
          </div>
        )}

        <Button 
          onClick={checkLocation}
          disabled={isCheckingLocation}
          variant="outline"
          className="w-full"
        >
          {isCheckingLocation ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Kontrollerar position...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              Kontrollera position igen
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};