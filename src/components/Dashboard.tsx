import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ScrollText, Users, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { BirthDetails } from "@/components/BirthDetails";
import { DeathDetails } from "@/components/DeathDetails";
import { DashboardStats } from "@/components/DashboardStats";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  setActiveSection: (section: string) => void;
}

export function Dashboard({ setActiveSection }: DashboardProps) {
  const [birthCount, setBirthCount] = useState(0);
  const [deathCount, setDeathCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [showRecordTypeDialog, setShowRecordTypeDialog] = useState(false);

  useEffect(() => {
    // Get actual counts from localStorage
    const birthRecords = JSON.parse(localStorage.getItem('birthRecords') || '[]');
    const deathRecords = JSON.parse(localStorage.getItem('deathRecords') || '[]');
    
    setBirthCount(birthRecords.length);
    setDeathCount(deathRecords.length);

    // Get recent activities (last 5 records)
    const allActivities = [
      ...birthRecords.map((record: any) => ({
        type: 'birth',
        name: `${record.firstName} ${record.lastName}`,
        date: new Date(record.registrationDate),
        icon: FileText,
        color: 'text-blue-600',
        record: record
      })),
      ...deathRecords.map((record: any) => ({
        type: 'death',
        name: `${record.firstName} ${record.lastName}`,
        date: new Date(record.registrationDate),
        icon: ScrollText,
        color: 'text-red-600',
        record: record
      }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    // Apply date filter if set
    const filteredActivities = dateFilter 
      ? allActivities.filter(activity => 
          activity.date.toISOString().split('T')[0] === dateFilter
        )
      : allActivities;

    setRecentActivities(filteredActivities.slice(0, 5));
  }, [dateFilter]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const handleQuickAction = (action: string) => {
    setActiveSection(action);
  };

  const handleActivityClick = (activity: any) => {
    setSelectedRecord(activity.record);
  };

  if (selectedRecord) {
    if (selectedRecord.type === 'birth') {
      return <BirthDetails record={selectedRecord} onBack={() => setSelectedRecord(null)} />;
    } else {
      return <DeathDetails record={selectedRecord} onBack={() => setSelectedRecord(null)} />;
    }
  }

  const stats = [
    {
      title: "Total Birth Count",
      value: birthCount.toString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Death Count",
      value: deathCount.toString(),
      icon: ScrollText,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Records",
      value: (birthCount + deathCount).toString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Certificates Available",
      value: (birthCount + deathCount).toString(),
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="w-100 h-100 bg-secondary p-5  rounded "  style={{backgroundColor:"white",borderTop:"5px solid #0d92ae"}}>
        <h2 className="text-2xl font-bold text-foreground mb-2 mx-5">Dashboard</h2>
        <p className="text-muted-foreground mx-5">Overview of registration system statistics</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Activities</CardTitle>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-48"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleActivityClick(activity)}
                  >
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    <div>
                      <p className="font-medium">
                        {activity.type === 'birth' ? 'New birth registered' : 'New death registered'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.name} - {formatTimeAgo(activity.date)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  {dateFilter ? "No activities found for selected date" : "No recent activities"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleQuickAction("birth-registration")}
                className="p-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <FileText className="w-6 h-6 mb-2 mx-auto" />
                <span className="text-sm font-medium">New Birth Registration</span>
              </button>
              <button 
                onClick={() => handleQuickAction("death-registration")}
                className="p-4 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                <ScrollText className="w-6 h-6 mb-2 mx-auto" />
                <span className="text-sm font-medium">New Death Registration</span>
              </button>
              <Dialog open={showRecordTypeDialog} onOpenChange={setShowRecordTypeDialog}>
                <DialogTrigger asChild>
                  <button 
                    className="p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    <Users className="w-6 h-6 mb-2 mx-auto" />
                    <span className="text-sm font-medium">View Records</span>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Record Type</DialogTitle>
                    <DialogDescription>
                      Choose which type of records you want to view
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button
                      onClick={() => {
                        setShowRecordTypeDialog(false);
                        handleQuickAction("birth-records");
                      }}
                      className="flex flex-col items-center gap-2 p-6"
                    >
                      <FileText className="w-8 h-8" />
                      <span>Birth Records</span>
                    </Button>
                    <Button
                      onClick={() => {
                        setShowRecordTypeDialog(false);
                        handleQuickAction("death-records");
                      }}
                      className="flex flex-col items-center gap-2 p-6"
                    >
                      <ScrollText className="w-8 h-8" />
                      <span>Death Records</span>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <button 
                onClick={() => handleQuickAction("certificates")}
                className="p-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
              >
                <Award className="w-6 h-6 mb-2 mx-auto" />
                <span className="text-sm font-medium">Generate Certificate</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
