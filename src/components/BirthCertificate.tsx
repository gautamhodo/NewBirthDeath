import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";

interface BirthCertificateProps {
  record: any;
  onBack: () => void;
}

export function BirthCertificate({ record, onBack }: BirthCertificateProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real application, this would generate a PDF
    alert("PDF download functionality would be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Details
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print Certificate
          </Button>
        </div>
      </div>

      <Card className="certificate-bg mx-auto max-w-4xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="mb-4 flex items-center justify-center gap-4">
              <img 
                src="/lovable-uploads/12c6194e-62ec-41bd-b897-85e0b51f1515.png" 
                alt="Official Logo" 
                className="h-16 w-auto"
              />
              <div>
                <div className="text-2xl font-bold text-primary mb-2">GOVERNMENT OF [STATE]</div>
                <div className="text-xl font-semibold text-foreground">OFFICE OF THE REGISTRAR</div>
                <div className="text-lg text-muted-foreground">Birth and Death Registration</div>
              </div>
            </div>
            <div className="border-t-2 border-primary pt-4">
              <h1 className="text-3xl font-bold text-primary">BIRTH CERTIFICATE</h1>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">Certificate No: BC-{record.id}</p>
              <p className="text-sm text-muted-foreground">Registration Date: {new Date(record.registrationDate).toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="border border-border p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-4">CHILD INFORMATION</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>
                    <p className="text-lg font-semibold">{record.firstName} {record.middleName} {record.lastName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Gender:</span>
                    <p className="capitalize">{record.gender}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date of Birth:</span>
                    <p>{new Date(record.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Time of Birth:</span>
                    <p>{record.timeHour}:{record.timeMin}:{record.timeSec}</p>
                  </div>
                  <div>
                    <span className="font-medium">Place of Birth:</span>
                    <p>{record.placeOfBirth}</p>
                  </div>
                  <div>
                    <span className="font-medium">Birth Weight:</span>
                    <p>{record.birthWeight} kg</p>
                  </div>
                </div>
              </div>

              <div className="border border-border p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-4">PARENT INFORMATION</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Father's Name:</span>
                    <p>{record.fatherName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Mother's Name:</span>
                    <p>{record.motherName}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Address:</span>
                    <p>{record.permanentAddress}</p>
                  </div>
                </div>
              </div>

              <div className="border border-border p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-4">REGISTRATION DETAILS</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Registration No:</span>
                    <p>BR-{record.id}</p>
                  </div>
                  <div>
                    <span className="font-medium">Locality:</span>
                    <p className="capitalize">{record.locality}</p>
                  </div>
                  <div>
                    <span className="font-medium">Mode of Birth:</span>
                    <p className="capitalize">{record.modeOfBirth}</p>
                  </div>
                  <div>
                    <span className="font-medium">Registration Date:</span>
                    <p>{new Date(record.registrationDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex justify-between items-end">
                <div className="text-center">
                  <div className="border-t border-foreground w-48 mb-2"></div>
                  <p className="text-sm font-medium">Registrar's Signature</p>
                  <p className="text-xs text-muted-foreground">Birth & Death Registration Office</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 border-2 border-dashed border-muted-foreground flex items-center justify-center mb-2">
                    <span className="text-xs text-muted-foreground">SEAL</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Official Seal</p>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground mt-6">
              <p>This is a computer generated certificate and does not require signature.</p>
              <p>For verification, visit: www.birthdeathregistry.gov.in</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
