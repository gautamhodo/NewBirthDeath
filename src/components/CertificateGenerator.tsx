import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Award, ArrowLeft } from "lucide-react";
import { BirthCertificate } from "@/components/BirthCertificate";
import { DeathCertificate } from "@/components/DeathCertificate";
import Footer from "./Footer";

interface CertificateGeneratorProps {
  setActiveSection: (section: string) => void;
}

export function CertificateGenerator({ setActiveSection }: CertificateGeneratorProps) {
  const [certificateType, setCertificateType] = useState<"birth" | "death" | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [birthRecords, setBirthRecords] = useState<any[]>([]);
  const [deathRecords, setDeathRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const savedBirthRecords = JSON.parse(localStorage.getItem('birthRecords') || '[]');
    const savedDeathRecords = JSON.parse(localStorage.getItem('deathRecords') || '[]');
    
    setBirthRecords(savedBirthRecords.map((record: any) => ({
      ...record,
      dateOfBirth: new Date(record.dateOfBirth),
      registrationDate: new Date(record.registrationDate),
    })));
    
    setDeathRecords(savedDeathRecords.map((record: any) => ({
      ...record,
      dateOfBirth: new Date(record.dateOfBirth),
      dateOfDeath: new Date(record.dateOfDeath),
      registrationDate: new Date(record.registrationDate),
    })));
  }, []);

  const getFilteredRecords = () => {
    const records = certificateType === "birth" ? birthRecords : deathRecords;
    return records.filter(record =>
      `${record.firstName} ${record.middleName} ${record.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const generateCertificate = (record: any) => {
    setSelectedRecord(record);
    setShowCertificate(true);
  };

  if (showCertificate && selectedRecord) {
    if (certificateType === "birth") {
      return <BirthCertificate record={selectedRecord} onBack={() => setShowCertificate(false)} />;
    } else {
      return <DeathCertificate record={selectedRecord} onBack={() => setShowCertificate(false)} />;
    }
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setActiveSection("dashboard")} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        </div>
        <div>
        <div className="space-y-6">
        <div className="w-100 h-100 bg-secondary p-5  rounded "  
        style={{backgroundColor:"white",borderTop:"5px solid #0d92ae"}}>
          <h2 className="text-2xl font-bold text-foreground mb-2">Certificate Generator</h2>
          <p className="text-muted-foreground">Generate birth and death certificates</p>
        </div>
      </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Select Certificate Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button
              variant={certificateType === "birth" ? "default" : "outline"}
              onClick={() => setCertificateType("birth")}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Birth Certificate
            </Button>
            <Button
              variant={certificateType === "death" ? "default" : "outline"}
              onClick={() => setCertificateType("death")}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Death Certificate
            </Button>
          </div>

          {certificateType && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={`Search ${certificateType} records by name or ID...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-3">
                {getFilteredRecords().length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm 
                        ? `No ${certificateType} records found matching your search.`
                        : `No ${certificateType} records available.`
                      }
                    </p>
                  </div>
                ) : (
                  getFilteredRecords().map((record) => (
                    <div
                      key={record.id}
                      className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">
                            {record.firstName} {record.middleName} {record.lastName}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">ID:</span>{" "}
                              <Badge variant="outline" className="ml-1">
                                {certificateType === "birth" ? `BR-${record.id}` : `DR-${record.id}`}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium">
                                {certificateType === "birth" ? "Date of Birth" : "Date of Death"}:
                              </span>{" "}
                              {certificateType === "birth" 
                                ? record.dateOfBirth.toLocaleDateString()
                                : record.dateOfDeath.toLocaleDateString()
                              }
                            </div>
                            <div>
                              <span className="font-medium">Registration Date:</span>{" "}
                              {record.registrationDate.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => generateCertificate(record)}
                            className="flex items-center gap-2"
                          >
                            <Award className="w-4 h-4" />
                            Generate Certificate
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    <Footer />
    </>
  );
}
