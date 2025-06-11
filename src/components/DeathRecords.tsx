import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Search, Download, Trash2, Edit2, Save, ArrowLeft } from "lucide-react";
import { DeathDetails } from "@/components/DeathDetails";
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

interface DeathRecord {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  dateOfDeath: Date;
  gender: string;
  causeOfDeath: string;
  registrationDate: Date;
  [key: string]: any;
}

interface DeathRecordsProps {
  setActiveSection: (section: string) => void;
}

export function DeathRecords({ setActiveSection }: DeathRecordsProps) {
  const [records, setRecords] = useState<DeathRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<DeathRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<DeathRecord | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem('deathRecords') || '[]');
    setRecords(savedRecords.map((record: any) => ({
      ...record,
      dateOfBirth: new Date(record.dateOfBirth),
      dateOfDeath: new Date(record.dateOfDeath),
      registrationDate: new Date(record.registrationDate),
    })));
  }, []);

  const filteredRecords = records.filter(record =>
    `${record.firstName} ${record.middleName} ${record.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.idProofNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    const excelData = filteredRecords.map(record => ({
      'First Name': record.firstName,
      'Middle Name': record.middleName,
      'Last Name': record.lastName,
      'Date of Birth': record.dateOfBirth.toLocaleDateString(),
      'Date of Death': record.dateOfDeath.toLocaleDateString(),
      'Gender': record.gender,
      'Cause of Death': record.causeOfDeath,
      'Registration Date': record.registrationDate.toLocaleDateString(),
      'Place of Death': record.placeOfDeath || '',
      'Address': record.address || '',
      'ID Proof Number': record.idProofNumber || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Death Records');
    
    const fileName = `death_records_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleRemove = (record: DeathRecord) => {
    // Remove from death records
    const updatedRecords = records.filter(r => r.id !== record.id);
    setRecords(updatedRecords);
    localStorage.setItem('deathRecords', JSON.stringify(updatedRecords));
    
    toast({
      title: "Profile Removed",
      description: `${record.firstName} ${record.lastName}'s profile has been removed successfully.`,
    });
  };

  const handleEdit = (record: DeathRecord) => {
    setEditingRecord({ ...record });
  };

  const handleSave = () => {
    if (!editingRecord) return;

    const updatedRecords = records.map(record =>
      record.id === editingRecord.id ? editingRecord : record
    );
    
    setRecords(updatedRecords);
    localStorage.setItem('deathRecords', JSON.stringify(updatedRecords));
    setEditingRecord(null);
    
    toast({
      title: "Record Updated",
      description: "Death record has been updated successfully.",
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
    return <DeathDetails record={selectedRecord} onBack={() => setSelectedRecord(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setActiveSection("dashboard")} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Death Records</h2>
          <p className="text-muted-foreground">View and manage death registration records</p>
        </div>
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
                placeholder="Search by name or ID proof number..."
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
                {searchTerm ? "No records found matching your search." : "No death records found."}
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
                          <Label>Date of Death</Label>
                          <Input
                            type="date"
                            value={editingRecord.dateOfDeath.toISOString().split('T')[0]}
                            onChange={(e) => handleEditChange('dateOfDeath', new Date(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cause of Death</Label>
                          <Input
                            value={editingRecord.causeOfDeath}
                            onChange={(e) => handleEditChange('causeOfDeath', e.target.value)}
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
                            <span className="font-medium">Date of Death:</span>{" "}
                            {record.dateOfDeath.toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Gender:</span>{" "}
                            <Badge variant="outline" className="ml-1">
                              {record.gender}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Cause of Death:</span>{" "}
                            <Badge variant="secondary" className="ml-1">
                              {record.causeOfDeath}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span className="font-medium">Registration Date:</span>{" "}
                          {record.registrationDate.toLocaleDateString()}
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
                              className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Profile</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {record.firstName} {record.lastName}'s profile? This action cannot be undone and will permanently delete the record from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemove(record)}>
                                Remove
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