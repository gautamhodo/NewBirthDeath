
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText } from "lucide-react";
import { DeathCertificate } from "@/components/DeathCertificate";
import { useState } from "react";

interface DeathDetailsProps {
  record: any;
  onBack: () => void;
}

export function DeathDetails({ record, onBack }: DeathDetailsProps) {
  const [showCertificate, setShowCertificate] = useState(false);

  if (showCertificate) {
    return <DeathCertificate record={record} onBack={() => setShowCertificate(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Records
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Death Record Details</h2>
          <p className="text-muted-foreground">Complete information for {record.firstName} {record.lastName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="form-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-primary">📋</span>
              Deceased Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-medium text-muted-foreground">Full Name:</span>
              <p className="text-foreground text-lg font-semibold">{record.firstName} {record.middleName} {record.lastName}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-muted-foreground">Gender:</span>
                <Badge variant="outline" className="ml-2">{record.gender}</Badge>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Date of Birth:</span>
                <p className="text-foreground">{new Date(record.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-muted-foreground">Date of Death:</span>
                <p className="text-foreground">{new Date(record.dateOfDeath).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Place of Death:</span>
                <p className="text-foreground">{record.placeOfDeath}</p>
              </div>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Permanent Address:</span>
              <p className="text-foreground">{record.permanentAddress}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="form-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-primary">🆔</span>
              ID Proof & Death Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-muted-foreground">ID Proof Type:</span>
                <p className="text-foreground capitalize">{record.idProofType?.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">ID Proof Number:</span>
                <p className="text-foreground font-mono">{record.idProofNumber}</p>
              </div>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Cause of Death:</span>
              <Badge variant="secondary" className="ml-2 capitalize">{record.causeOfDeath?.replace('_', ' ')}</Badge>
            </div>
            {record.otherCause && (
              <div>
                <span className="font-medium text-muted-foreground">Other Cause Details:</span>
                <p className="text-foreground">{record.otherCause}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="form-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">👤</span>
            Informant Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-muted-foreground">Informant Name:</span>
              <p className="text-foreground">{record.informantName}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Relation to Deceased:</span>
              <p className="text-foreground">{record.informantRelation}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Phone Number:</span>
              <p className="text-foreground">{record.informantPhone}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Address:</span>
              <p className="text-foreground">{record.informantAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="form-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">📋</span>
            Registration Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="font-medium text-muted-foreground">Registration ID:</span>
              <p className="text-foreground font-mono">DR-{record.id}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Registration Date:</span>
              <p className="text-foreground">{new Date(record.registrationDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Status:</span>
              <Badge variant="default" className="ml-2">Registered</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          onClick={() => setShowCertificate(true)}
          className="flex items-center gap-2 bg-destructive hover:bg-destructive/90"
        >
          <FileText className="w-4 h-4" />
          Generate Death Certificate
        </Button>
      </div>
    </div>
  );
}
