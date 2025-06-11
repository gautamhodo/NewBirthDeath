import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ScrollText, Users, Award } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardProps {
  setActiveSection: (section: string) => void;
}

export function Dashboard({ setActiveSection }: DashboardProps) {
  const [birthCount, setBirthCount] = useState(0);
  const [deathCount, setDeathCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

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
        color: 'text-blue-600'
      })),
      ...deathRecords.map((record: any) => ({
        type: 'death',
        name: `${record.firstName} ${record.lastName}`,
        date: new Date(record.registrationDate),
        icon: ScrollText,
        color: 'text-red-600'
      }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

    setRecentActivities(allActivities);
  }, []);

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

  const stats = [
    {
      title: "Birth Registrations",
      value: birthCount.toString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Death Registrations",
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
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Overview of registration system statistics</p>
      </div>
      
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
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
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
                <p className="text-muted-foreground text-center py-4">No recent activities</p>
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
              <button 
                onClick={() => handleQuickAction("birth-records")}
                className="p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                <Users className="w-6 h-6 mb-2 mx-auto" />
                <span className="text-sm font-medium">View Records</span>
              </button>
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
