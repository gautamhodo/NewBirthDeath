import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Baby, Skull } from "lucide-react";

interface Stats {
  birth: {
    male: number;
    female: number;
    total: number;
  };
  death: {
    male: number;
    female: number;
    other: number;
    total: number;
  };
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    birth: { male: 0, female: 0, total: 0 },
    death: { male: 0, female: 0, other: 0, total: 0 }
  });

  useEffect(() => {
    // Load data from localStorage
    const birthRecords = JSON.parse(localStorage.getItem('birthRecords') || '[]');
    const deathRecords = JSON.parse(localStorage.getItem('deathRecords') || '[]');

    // Calculate birth statistics
    const birthStats = birthRecords.reduce((acc: any, record: any) => {
      if (record.gender === 'Male') acc.male++;
      else if (record.gender === 'Female') acc.female++;
      return acc;
    }, { male: 0, female: 0 });

    // Calculate death statistics
    const deathStats = deathRecords.reduce((acc: any, record: any) => {
      if (record.gender === 'Male') acc.male++;
      else if (record.gender === 'Female') acc.female++;
      else acc.other++;
      return acc;
    }, { male: 0, female: 0, other: 0 });

    setStats({
      birth: {
        ...birthStats,
        total: birthStats.male + birthStats.female
      },
      death: {
        ...deathStats,
        total: deathStats.male + deathStats.female + deathStats.other
      }
    });
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {/* Birth Registration Stats */}
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Birth Registrations</CardTitle>
          <Baby className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stats.birth.total}</p>
              <p className="text-xs text-muted-foreground">Total Births</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xl font-bold text-blue-600">{stats.birth.male}</p>
                <p className="text-xs text-muted-foreground">Male</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-pink-600">{stats.birth.female}</p>
                <p className="text-xs text-muted-foreground">Female</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Death Registration Stats */}
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Death Registrations</CardTitle>
          <Skull className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stats.death.total}</p>
              <p className="text-xs text-muted-foreground">Total Deaths</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-xl font-bold text-blue-600">{stats.death.male}</p>
                <p className="text-xs text-muted-foreground">Male</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-pink-600">{stats.death.female}</p>
                <p className="text-xs text-muted-foreground">Female</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-gray-600">{stats.death.other}</p>
                <p className="text-xs text-muted-foreground">Other</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 