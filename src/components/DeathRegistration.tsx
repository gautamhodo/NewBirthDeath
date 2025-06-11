import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useToast } from "@/hooks/use-toast";

interface DeathRegistrationProps {
  setActiveSection: (section: string) => void;
}

export function DeathRegistration({ setActiveSection }: DeathRegistrationProps) {
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [dateOfDeath, setDateOfDeath] = useState<Date>();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    idProofType: "",
    idProofNumber: "",
    permanentAddress: "",
    causeOfDeath: "",
    otherCause: "",
    placeOfDeath: "",
    informantName: "",
    informantRelation: "",
    informantAddress: "",
    informantPhone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Get existing death records
    const existingRecords = JSON.parse(localStorage.getItem('deathRecords') || '[]');
    
    // Create new record
    const newRecord = {
      id: Date.now().toString(),
      ...formData,
      dateOfBirth,
      dateOfDeath,
      registrationDate: new Date(),
    };
    
    // Add to records
    const updatedRecords = [...existingRecords, newRecord];
    localStorage.setItem('deathRecords', JSON.stringify(updatedRecords));
    
    toast({
      title: "Death Registration Successful",
      description: "The death has been registered successfully.",
    });
    
    // Reset form
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      idProofType: "",
      idProofNumber: "",
      permanentAddress: "",
      causeOfDeath: "",
      otherCause: "",
      placeOfDeath: "",
      informantName: "",
      informantRelation: "",
      informantAddress: "",
      informantPhone: "",
    });
    setDateOfBirth(undefined);
    setDateOfDeath(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setActiveSection("dashboard")} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Death Registration</h2>
          <p className="text-muted-foreground">Register a death and generate certificate</p>
        </div>
      </div>

      <Card className="form-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary"></span>
            Deceased Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleInputChange("middleName", e.target.value)}
                placeholder="Enter middle name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Date of Birth *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateOfBirth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick birth date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateOfBirth}
                    onSelect={setDateOfBirth}
                    className="pointer-events-auto"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Date of Death *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateOfDeath && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateOfDeath ? format(dateOfDeath, "PPP") : <span>Pick death date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateOfDeath}
                    onSelect={setDateOfDeath}
                    className="pointer-events-auto"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="placeOfDeath">Place of Death *</Label>
              <Input
                id="placeOfDeath"
                value={formData.placeOfDeath}
                onChange={(e) => handleInputChange("placeOfDeath", e.target.value)}
                placeholder="Enter place of death"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="permanentAddress">Permanent Address *</Label>
            <Textarea
              id="permanentAddress"
              value={formData.permanentAddress}
              onChange={(e) => handleInputChange("permanentAddress", e.target.value)}
              placeholder="Enter permanent address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="form-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary"></span>
            ID Proof Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>ID Proof Type *</Label>
              <Select value={formData.idProofType} onValueChange={(value) => handleInputChange("idProofType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ID proof type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                  <SelectItem value="pan">PAN Card</SelectItem>
                  <SelectItem value="driving_license">Driving License</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="voter_id">Voter ID</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="idProofNumber">ID Proof Number *</Label>
              <Input
                id="idProofNumber"
                value={formData.idProofNumber}
                onChange={(e) => handleInputChange("idProofNumber", e.target.value)}
                placeholder="Enter ID proof number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="form-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary"></span>
            Cause of Death
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Cause of Death *</Label>
            <Select value={formData.causeOfDeath} onValueChange={(value) => handleInputChange("causeOfDeath", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select cause of death" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="natural">Natural</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="suicide">Suicide</SelectItem>
                <SelectItem value="pending_investigation">Pending Investigation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.causeOfDeath === "other" && (
            <div>
              <Label htmlFor="otherCause">Please specify other cause</Label>
              <Textarea
                id="otherCause"
                value={formData.otherCause}
                onChange={(e) => handleInputChange("otherCause", e.target.value)}
                placeholder="Please specify the cause of death"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="form-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary"></span>
            Informant Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="informantName">Informant Name *</Label>
              <Input
                id="informantName"
                value={formData.informantName}
                onChange={(e) => handleInputChange("informantName", e.target.value)}
                placeholder="Enter informant's name"
              />
            </div>
            <div>
              <Label htmlFor="informantRelation">Relation to Deceased *</Label>
              <Input
                id="informantRelation"
                value={formData.informantRelation}
                onChange={(e) => handleInputChange("informantRelation", e.target.value)}
                placeholder="Enter relation to deceased"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="informantPhone">Informant Phone *</Label>
              <Input
                id="informantPhone"
                value={formData.informantPhone}
                onChange={(e) => handleInputChange("informantPhone", e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="informantAddress">Informant Address *</Label>
              <Input
                id="informantAddress"
                value={formData.informantAddress}
                onChange={(e) => handleInputChange("informantAddress", e.target.value)}
                placeholder="Enter informant's address"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 py-2">
          Register Death
        </Button>
      </div>
    </div>
  );
}
