import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface BirthRegistrationProps {
  setActiveSection: (section: string) => void;
}

export function BirthRegistration({ setActiveSection }: BirthRegistrationProps) {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    timeHour: "",
    timeMin: "",
    timeSec: "",
    gender: "",
    placeOfBirth: "",
    locality: "",
    modeOfBirth: "",
    parity: "",
    birthWeight: "",
    fatherName: "",
    motherName: "",
    parentAddress: "",
    permanentAddress: "",
    guardianName: "",
    guardianAddress: "",
    fatherOccupation: "",
    motherOccupation: "",
    fatherContact: "",
    motherContact: "",
    guardianContact: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Get existing birth records
    const existingRecords = JSON.parse(localStorage.getItem('birthRecords') || '[]');
    
    // Create new record
    const newRecord = {
      id: Date.now().toString(),
      ...formData,
      dateOfBirth: date,
      registrationDate: new Date(),
    };
    
    // Add to records
    const updatedRecords = [...existingRecords, newRecord];
    localStorage.setItem('birthRecords', JSON.stringify(updatedRecords));
    
    toast({
      title: "Birth Registration Successful",
      description: "The birth has been registered successfully.",
    });
    
    // Reset form
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      timeHour: "",
      timeMin: "",
      timeSec: "",
      gender: "",
      placeOfBirth: "",
      locality: "",
      modeOfBirth: "",
      parity: "",
      birthWeight: "",
      fatherName: "",
      motherName: "",
      parentAddress: "",
      permanentAddress: "",
      guardianName: "",
      guardianAddress: "",
      fatherOccupation: "",
      motherOccupation: "",
      fatherContact: "",
      motherContact: "",
      guardianContact: "",
    });
    setDate(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setActiveSection("dashboard")} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Birth Registration</h2>
          <p className="text-muted-foreground">Register a new birth and generate certificate</p>
        </div>
      </div>

      <Card className="form-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary"></span>
            Child Information
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
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="pointer-events-auto"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Time of Birth *</Label>
              <div className="flex gap-2">
                <Select value={formData.timeHour} onValueChange={(value) => handleInputChange("timeHour", value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={formData.timeMin} onValueChange={(value) => handleInputChange("timeMin", value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={formData.timeSec} onValueChange={(value) => handleInputChange("timeSec", value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sec" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <Label htmlFor="placeOfBirth">Place of Birth *</Label>
              <Input
                id="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                placeholder="Enter place of birth"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Locality *</Label>
              <Select value={formData.locality} onValueChange={(value) => handleInputChange("locality", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select locality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="panchayath">Panchayath</SelectItem>
                  <SelectItem value="municipality">Municipality</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mode of Birth *</Label>
              <Select value={formData.modeOfBirth} onValueChange={(value) => handleInputChange("modeOfBirth", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="cesarean">Cesarean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Parity *</Label>
              <Select value={formData.parity} onValueChange={(value) => handleInputChange("parity", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Child</SelectItem>
                  <SelectItem value="twins">Twins</SelectItem>
                  <SelectItem value="triplets">Triplets</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="birthWeight">Birth Weight (kg) *</Label>
            <Input
              id="birthWeight"
              type="number"
              step="0.01"
              value={formData.birthWeight}
              onChange={(e) => handleInputChange("birthWeight", e.target.value)}
              placeholder="Enter birth weight in kg"
            />
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
              <Label htmlFor="fatherName">Father's Name *</Label>
              <Input
                id="fatherName"
                value={formData.fatherName}
                onChange={(e) => handleInputChange("fatherName", e.target.value)}
                placeholder="Enter father's full name"
              />
            </div>
            <div>
              <Label htmlFor="motherName">Mother's Name *</Label>
              <Input
                id="motherName"
                value={formData.motherName}
                onChange={(e) => handleInputChange("motherName", e.target.value)}
                placeholder="Enter mother's full name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fatherContact">Father's Contact Number</Label>
              <Input
                id="fatherContact"
                value={formData.fatherContact}
                onChange={(e) => handleInputChange("fatherContact", e.target.value)}
                placeholder="Enter father's contact number"
              />
            </div>
            <div>
              <Label htmlFor="motherContact">Mother's Contact Number</Label>
              <Input
                id="motherContact"
                value={formData.motherContact}
                onChange={(e) => handleInputChange("motherContact", e.target.value)}
                placeholder="Enter mother's contact number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fatherOccupation">Father's Occupation</Label>
              <Input
                id="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={(e) => handleInputChange("fatherOccupation", e.target.value)}
                placeholder="Enter father's occupation"
              />
            </div>
            <div>
              <Label htmlFor="motherOccupation">Mother's Occupation</Label>
              <Input
                id="motherOccupation"
                value={formData.motherOccupation}
                onChange={(e) => handleInputChange("motherOccupation", e.target.value)}
                placeholder="Enter mother's occupation"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="parentAddress">Current Address *</Label>
            <Input
              id="parentAddress"
              value={formData.parentAddress}
              onChange={(e) => handleInputChange("parentAddress", e.target.value)}
              placeholder="Enter current address"
            />
          </div>

          <div>
            <Label htmlFor="permanentAddress">Permanent Address *</Label>
            <Input
              id="permanentAddress"
              value={formData.permanentAddress}
              onChange={(e) => handleInputChange("permanentAddress", e.target.value)}
              placeholder="Enter permanent address"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="form-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary"></span>
            Guardian Information (if applicable)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="guardianName">Guardian's Name</Label>
            <Input
              id="guardianName"
              value={formData.guardianName}
              onChange={(e) => handleInputChange("guardianName", e.target.value)}
              placeholder="Enter guardian's full name"
            />
          </div>

          <div>
            <Label htmlFor="guardianContact">Guardian's Contact Number</Label>
            <Input
              id="guardianContact"
              value={formData.guardianContact}
              onChange={(e) => handleInputChange("guardianContact", e.target.value)}
              placeholder="Enter guardian's contact number"
            />
          </div>

          <div>
            <Label htmlFor="guardianAddress">Guardian's Address</Label>
            <Input
              id="guardianAddress"
              value={formData.guardianAddress}
              onChange={(e) => handleInputChange("guardianAddress", e.target.value)}
              placeholder="Enter guardian's address"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2">
          Register Birth
        </Button>
      </div>
    </div>
  );
}
