import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Eye, Database, Clock, Users, Lock } from "lucide-react";

export const PrivacyPolicy = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Integritetspolicy & GDPR
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6 text-sm">
              <section>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Vilka data vi samlar in
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Arbetstider och tidsstämplingar</li>
                  <li>Projektinformation och arbetsanteckningar</li>
                  <li>Platsdata (endast vid tidsstämpling)</li>
                  <li>Bilder kopplade till projekt</li>
                  <li>Sjukanmälningar och ledighetsansökningar</li>
                  <li>Användarens namn, e-post och profilinformation</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Varför vi använder dina data
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Tidsrapportering och lönehantering</li>
                  <li>Projektdokumentation för kunder</li>
                  <li>Schemaläggning och arbetsplanering</li>
                  <li>Säkerhet och arbetsmiljöuppföljning</li>
                  <li>Regelefterlevnad enligt arbetsmiljölagen</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Hur länge vi behåller data
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Arbetstider: 7 år (enligt bokföringslagen)</li>
                  <li>Projektdata: Under projektets livscykel + 3 år</li>
                  <li>Platsdata: 30 dagar (endast för verifiering)</li>
                  <li>Bilder: Under projektets livscykel</li>
                  <li>Sjuk- och ledighetsdata: Enligt kollektivavtal</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Dina rättigheter enligt GDPR
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Rätt till tillgång - be om kopia av dina data</li>
                  <li>Rätt till rättelse - korrigera felaktiga uppgifter</li>
                  <li>Rätt till radering - begära att vi tar bort dina data</li>
                  <li>Rätt till dataportabilitet - få dina data i strukturerat format</li>
                  <li>Rätt att invända mot behandling</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Datasäkerhet
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>All data krypteras vid överföring (TLS/SSL)</li>
                  <li>Säker lagring med regelbundna säkerhetskopior</li>
                  <li>Åtkomstloggning och autentisering</li>
                  <li>Regelbundna säkerhetsuppdateringar</li>
                  <li>Begränsad åtkomst baserat på roller</li>
                </ul>
              </section>

              <section className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Kontakt:</strong> För frågor om integritet eller för att utöva dina rättigheter, 
                  kontakta din företagsadministratör eller systemansvarig.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};