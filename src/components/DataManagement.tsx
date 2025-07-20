import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Download, Trash2, Shield, AlertTriangle, CheckCircle } from "lucide-react";

export const DataManagement = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    
    // Simulate data export
    setTimeout(() => {
      // Create a mock data export
      const userData = {
        profile: {
          name: "Användare",
          email: "user@example.com",
          role: "employee"
        },
        timeEntries: [
          { date: "2024-01-15", hours: 8, project: "Kungsgatan 214" },
          { date: "2024-01-16", hours: 7.5, project: "Storgatan 45" }
        ],
        exportDate: new Date().toISOString(),
        note: "All personlig data enligt GDPR-förfrågan"
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `min-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 2000);
  };

  const handleDeleteData = async () => {
    setIsDeleting(true);
    
    // Simulate data deletion process
    setTimeout(() => {
      alert('Begäran om dataradering har skickats till administratören. Du kommer få bekräftelse via e-post.');
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Hantera mina data (GDPR)
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="w-4 h-4" />
            <AlertDescription>
              Enligt GDPR har du rätt att få en kopia av dina data, korrigera felaktigheter eller begära radering. 
              Vissa data kan behöva behållas enligt arbetsmiljölagen och bokföringslagen.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {/* Export Data */}
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                    <Download className="w-4 h-4 text-primary" />
                    Exportera mina data
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Ladda ned en kopia av all data som sparats om dig i systemet. 
                    Inkluderar arbetstider, projektdata och profilinformation.
                  </p>
                  <Button 
                    onClick={handleExportData}
                    disabled={isExporting}
                    size="sm"
                    variant="outline"
                  >
                    {isExporting ? (
                      <>
                        <Download className="w-3 h-3 mr-1 animate-pulse" />
                        Förbereder export...
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 mr-1" />
                        Ladda ned mina data
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Data Correction */}
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Korrigera mina uppgifter
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Kontakta din chef eller administratör för att korrigera felaktiga arbetstider, 
                    projektinformation eller andra personuppgifter.
                  </p>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => alert('Kontakta din chef via företagskatalogen för att korrigera uppgifter.')}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Begär korrigering
                  </Button>
                </div>
              </div>
            </Card>

            {/* Delete Data */}
            <Card className="p-4 border-destructive/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-2 text-destructive">
                    <Trash2 className="w-4 h-4" />
                    Radera mina data
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Begär radering av dina personuppgifter. Observera att vissa data kan behöva 
                    behållas enligt lag (arbetstider för lönehantering, etc.).
                  </p>
                  
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Begär dataradering
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                          <AlertTriangle className="w-4 h-4" />
                          Bekräfta dataradering
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <Alert>
                          <AlertTriangle className="w-4 h-4" />
                          <AlertDescription>
                            <strong>Viktigt:</strong> Denna åtgärd kommer att:
                            <ul className="list-disc list-inside mt-2 text-xs">
                              <li>Ta bort din profil och kontoinformation</li>
                              <li>Anonymisera dina projektanteckningar</li>
                              <li>Arbetstider behålls enligt lag (7 år)</li>
                              <li>Du förlorar åtkomst till systemet</li>
                            </ul>
                          </AlertDescription>
                        </Alert>
                        
                        <p className="text-xs text-muted-foreground">
                          Din chef kommer få en förfrågan och kontakta dig för att bekräfta 
                          raderingen och hantera eventuella juridiska krav.
                        </p>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="destructive" 
                            onClick={handleDeleteData}
                            disabled={isDeleting}
                            className="flex-1"
                          >
                            {isDeleting ? 'Skickar begäran...' : 'Ja, radera mina data'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowDeleteDialog(false)}
                            className="flex-1"
                          >
                            Avbryt
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Card>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Observera:</strong> Vissa data måste behållas enligt svensk lag:
            </p>
            <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
              <li>Arbetstider: 7 år (bokföringslagen)</li>
              <li>Lönerelaterad data: Enligt kollektivavtal</li>
              <li>Arbetsmiljödata: 5 år efter avslutad anställning</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};