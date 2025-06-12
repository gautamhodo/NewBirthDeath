import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Search, Download, UserMinus, Edit2, Save, ArrowLeft } from "lucide-react";
import { BirthDetails } from "@/components/BirthDetails";
import * as XLSX from 'xlsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BirthRecord {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  fatherName: string;
  motherName: string;
  registrationDate: Date;
  [key: string]: any;
}

interface BirthRecordsProps {
  setActiveSection: (section: string) => void;
}

export function BirthRecords({ setActiveSection }: BirthRecordsProps) {
  const [records, setRecords] = useState<BirthRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<BirthRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<BirthRecord | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem('birthRecords') || '[]');
    setRecords(savedRecords.map((record: any) => ({
      ...record,
      dateOfBirth: new Date(record.dateOfBirth),
      registrationDate: new Date(record.registrationDate),
    })));
  }, []);

  const filteredRecords = records.filter(record =>
    `${record.firstName} ${record.middleName} ${record.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.motherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    const excelData = filteredRecords.map(record => ({
      'First Name': record.firstName,
      'Middle Name': record.middleName,
      'Last Name': record.lastName,
      'Date of Birth': record.dateOfBirth.toLocaleDateString(),
      'Gender': record.gender,
      'Father Name': record.fatherName,
      'Mother Name': record.motherName,
      'Registration Date': record.registrationDate.toLocaleDateString(),
      'Place of Birth': record.placeOfBirth || '',
      'Weight': record.weight || '',
      'Address': record.address || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Birth Records');
    
    const fileName = `birth_records_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleDischarge = (record: BirthRecord) => {
    // Remove from birth records
    const updatedRecords = records.filter(r => r.id !== record.id);
    setRecords(updatedRecords);
    localStorage.setItem('birthRecords', JSON.stringify(updatedRecords));
    
    toast({
      title: "Patient Discharged",
      description: `${record.firstName} ${record.lastName} has been discharged successfully.`,
    });
  };

  const handleEdit = (record: BirthRecord) => {
    setEditingRecord({ ...record });
  };

  const handleSave = () => {
    if (!editingRecord) return;

    const updatedRecords = records.map(record =>
      record.id === editingRecord.id ? editingRecord : record
    );
    
    setRecords(updatedRecords);
    localStorage.setItem('birthRecords', JSON.stringify(updatedRecords));
    setEditingRecord(null);
    
    toast({
      title: "Record Updated",
      description: "Birth record has been updated successfully.",
    });
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
  };

  const handleEditChange = (field: string, value: any) => {
    if (!editingRecord) return;
    setEditingRecord(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  if (selectedRecord) {
    return <BirthDetails record={selectedRecord} onBack={() => setSelectedRecord(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setActiveSection("dashboard")} className="flex items-center gap-2">
          <ArrowLeft className="w-2 h-2" />
          Back
        </Button>
        </div>
        
        <div>
        <div className="space-y-6">
        <div className="w-100 h-100 bg-secondary p-5  rounded "  
        style={{backgroundColor:"white",borderTop:"5px solid #0d92ae"}}>
          <h2 className="text-2xl font-bold text-foreground mb-2 mx-5">Birth Records</h2>
          <p className="text-muted-foreground mx-5">View and manage birth registration records</p>
        </div>
        </div>
        <br></br>
        <br></br>
        <div className="flex items-center gap-4">
          <Button
            onClick={exportToExcel}
            variant="outline"
            className="flex items-center gap-2"
            disabled={filteredRecords.length === 0}
          >
            <Download className="w-4 h-4" />
            Convert to Excel
          </Button>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Total Records: {records.length}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by child name, father name, or mother name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No records found matching your search." : "No birth records found."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {editingRecord?.id === record.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input
                            value={editingRecord.firstName}
                            onChange={(e) => handleEditChange('firstName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Middle Name</Label>
                          <Input
                            value={editingRecord.middleName}
                            onChange={(e) => handleEditChange('middleName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input
                            value={editingRecord.lastName}
                            onChange={(e) => handleEditChange('lastName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <Select
                            value={editingRecord.gender}
                            onValueChange={(value) => handleEditChange('gender', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date of Birth</Label>
                          <Input
                            type="date"
                            value={editingRecord.dateOfBirth.toISOString().split('T')[0]}
                            onChange={(e) => handleEditChange('dateOfBirth', new Date(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Father's Name</Label>
                          <Input
                            value={editingRecord.fatherName}
                            onChange={(e) => handleEditChange('fatherName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Mother's Name</Label>
                          <Input
                            value={editingRecord.motherName}
                            onChange={(e) => handleEditChange('motherName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Place of Birth</Label>
                          <Input
                            value={editingRecord.placeOfBirth || ''}
                            onChange={(e) => handleEditChange('placeOfBirth', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Weight (kg)</Label>
                          <Input
                            type="number"
                            value={editingRecord.weight || ''}
                            onChange={(e) => handleEditChange('weight', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          className="flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {record.firstName} {record.middleName} {record.lastName}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Date of Birth:</span>{" "}
                            {record.dateOfBirth.toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Gender:</span>{" "}
                            <Badge variant="outline" className="ml-1">
                              {record.gender}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Registration Date:</span>{" "}
                            {record.registrationDate.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Father:</span> {record.fatherName}
                          </div>
                          <div>
                            <span className="font-medium">Mother:</span> {record.motherName}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(record)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(record)}
                          className="flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-300"
                            >
                              <UserMinus className="w-4 h-4" />
                              Discharge
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Discharge Patient</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to discharge {record.firstName} {record.lastName}? This action cannot be undone and will remove the record from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDischarge(record)}>
                                Discharge
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}