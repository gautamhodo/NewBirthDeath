
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { BirthCertificate } from "@/components/BirthCertificate";
import { useState } from "react";

interface BirthDetailsProps {
  record: any;
  onBack: () => void;
}

export function BirthDetails({ record, onBack }: BirthDetailsProps) {
  const [showCertificate, setShowCertificate] = useState(false);

  if (showCertificate) {
    return <BirthCertificate record={record} onBack={() => setShowCertificate(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Records
        </Button>
        </div>
        <div>
        <div className="space-y-6">
        <div className="w-100 h-100 bg-secondary p-5  rounded "  
        style={{backgroundColor:"white",borderTop:"5px solid #0d92ae"}}>
          <h2 className="text-2xl font-bold text-foreground">Birth Record Details</h2>
          <p className="text-muted-foreground">Complete information for {record.firstName} {record.lastName}</p>
        </div>
      </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="form-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-primary"></span>
              Child Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-muted-foreground">Full Name:</span>
                <p className="text-foreground">{record.firstName} {record.middleName} {record.lastName}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Gender:</span>
                <Badge variant="outline" className="ml-2">{record.gender}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-muted-foreground">Date of Birth:</span>
                <p className="text-foreground">{new Date(record.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Time of Birth:</span>
                <p className="text-foreground">{record.timeHour}:{record.timeMin}:{record.timeSec}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-muted-foreground">Place of Birth:</span>
                <p className="text-foreground">{record.placeOfBirth}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Locality:</span>
                <p className="text-foreground">{record.locality}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-muted-foreground">Mode of Birth:</span>
                <p className="text-foreground">{record.modeOfBirth}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Parity:</span>
                <p className="text-foreground">{record.parity}</p>
              </div>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Birth Weight:</span>
              <p className="text-foreground">{record.birthWeight} kg</p>
            </div>
          </CardContent>
        </Card>

        <Card className="form-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-primary"></span>
              Parent Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-muted-foreground">Father's Name:</span>
                <p className="text-foreground">{record.fatherName}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Mother's Name:</span>
                <p className="text-foreground">{record.motherName}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-muted-foreground">Father's Occupation:</span>
                <p className="text-foreground">{record.fatherOccupation || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Mother's Occupation:</span>
                <p className="text-foreground">{record.motherOccupation || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Current Address:</span>
              <p className="text-foreground">{record.parentAddress}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Permanent Address:</span>
              <p className="text-foreground">{record.permanentAddress}</p>
            </div>
            {record.guardianName && (
              <>
                <div>
                  <span className="font-medium text-muted-foreground">Guardian's Name:</span>
                  <p className="text-foreground">{record.guardianName}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Guardian's Address:</span>
                  <p className="text-foreground">{record.guardianAddress}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="form-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary"></span>
            Registration Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="font-medium text-muted-foreground">Registration ID:</span>
              <p className="text-foreground font-mono">BR-{record.id}</p>
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
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <FileText className="w-4 h-4" />
          Generate Birth Certificate
        </Button>
      </div>
    </div>
  );
}
