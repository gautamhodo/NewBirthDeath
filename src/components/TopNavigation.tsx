import { Settings, Bell, Search, User, Plus, Calendar, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TopNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function TopNavigation({ activeSection, setActiveSection }: TopNavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "birth-records", label: "Birth List" },
    { id: "death-records", label: "Death List" },
  ];

  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Load notifications from localStorage - showing newest registrations first
    const birthRecords = JSON.parse(localStorage.getItem('birthRecords') || '[]');
    const deathRecords = JSON.parse(localStorage.getItem('deathRecords') || '[]');
    
    const allNotifications = [
      ...birthRecords.map((record: any) => ({
        id: record.id,
        type: 'birth',
        message: `New birth registration: ${record.firstName} ${record.lastName}`,
        time: new Date(record.registrationDate),
        profile: record
      })),
      ...deathRecords.map((record: any) => ({
        id: record.id,
        type: 'death',
        message: `New death registration: ${record.firstName} ${record.lastName}`,
        time: new Date(record.registrationDate),
        profile: record
      }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10);

    setNotifications(allNotifications);

    // Load all profiles
    const profiles = [
      ...birthRecords.map((record: any) => ({ ...record, type: 'birth' })),
      ...deathRecords.map((record: any) => ({ ...record, type: 'death' }))
    ];
    setAllProfiles(profiles);

    // Update date and time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSettingsClick = (setting: string) => {
    console.log(`Opening ${setting} settings`);
    setActiveSection('settings');
    localStorage.setItem('selectedSetting', setting);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const birthRecords = JSON.parse(localStorage.getItem('birthRecords') || '[]');
      const deathRecords = JSON.parse(localStorage.getItem('deathRecords') || '[]');
      const allProfiles = [
        ...birthRecords.map((record: any) => ({ ...record, type: 'birth' })),
        ...deathRecords.map((record: any) => ({ ...record, type: 'death' }))
      ];
      
      const results = allProfiles.filter(profile => 
        profile.firstName?.toLowerCase().includes(query.toLowerCase()) ||
        profile.lastName?.toLowerCase().includes(query.toLowerCase()) ||
        profile.id?.toString().includes(query)
      ).slice(0, 5); // Limit to 5 results
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleProfileSelect = (profile: any) => {
    setCurrentProfile(profile);
    setActiveSection(profile.type === 'birth' ? 'birth-records' : 'death-records');
    toast({
      title: "Profile Selected",
      description: `Viewing details for ${profile.firstName} ${profile.lastName}`,
    });
  };

  const handleLogout = () => {
    setCurrentProfile(null);
    toast({
      title: "Logged Out",
      description: "Successfully logged out from profile",
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <>
      <nav className="bg-black border-b border-gray-800 w-full fixed top-0 left-0 z-50 shadow-lg ">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left side - Logo and navigation */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-25 h-10 rounded-lg flex items-center justify-center">
                <img 
                  src="src/assets/hodo.png" 
                  alt="HODO Hospital Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>
            
            {/* Navigation items */}
            <div className="flex items-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors mr-4 ${
                    activeSection === item.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Center - Search Bar */}
          <div className="flex-1 max-w-md relative ml-auto">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-white text-black placeholder-gray-500 focus:border-primary"
                
              />
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50">
                {searchResults.map((profile, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchQuery("");
                      setActiveSection(profile.type === 'birth' ? 'birth-records' : 'death-records');
                    }}
                  >
                    <div>
                      <div className="font-medium text-sm">{profile.firstName} {profile.lastName}</div>
                      <div className="text-xs text-gray-500">
                        {profile.type} record - ID: {profile.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right side - New Register, Notifications, Profile, Settings */}
          <div className="flex items-center gap-2">
            {/* New Register Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-7 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors">
                  <Plus className="w-4 h-4" />
                  New Register
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem onClick={() => setActiveSection("birth-registration")}>
                  Birth Registration
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveSection("death-registration")}>
                  Death Registration
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-gray-300 hover:text-white transition-colors relative">
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                      {notifications.length}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuLabel>Recent Registrations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <DropdownMenuItem 
                      key={index} 
                      className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setActiveSection(notification.type === 'birth' ? 'birth-records' : 'death-records');
                      }}
                    >
                      <span className="font-medium text-sm">{notification.message}</span>
                      <span className="text-xs text-gray-500">{formatTimeAgo(notification.time)}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem>No new registrations</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-gray-300 hover:text-white transition-colors">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {currentProfile ? `${currentProfile.firstName?.[0]}${currentProfile.lastName?.[0]}` : <User className="w-3 h-3" />}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-lg max-h-96 overflow-y-auto">
                <DropdownMenuLabel>
                  {currentProfile ? `${currentProfile.firstName} ${currentProfile.lastName}` : 'Select Profile'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {!currentProfile && allProfiles.slice(0, 8).map((profile, index) => (
                  <DropdownMenuItem 
                    key={index}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleProfileSelect(profile)}
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {profile.firstName?.[0]}{profile.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{profile.firstName} {profile.lastName}</div>
                        <div className="text-xs text-gray-500">{profile.type} record</div>
                      </div>
                  </DropdownMenuItem>
                ))}
                
                {currentProfile && (
                  <>
                    <DropdownMenuItem 
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setActiveSection(currentProfile.type === 'birth' ? 'birth-records' : 'death-records')}
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                      Logout
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-gray-300 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSettingsClick("dashboard")}>
                  Dashboard Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsClick("birth-registration")}>
                  Birth Registration Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsClick("death-registration")}>
                  Death Registration Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsClick("certificates")}>
                  Certificate Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSettingsClick("user-management")}>
                  User Management
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsClick("system")}>
                  System Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      {/* Date and Time Display */}
      <div className="bg-#e5e7eb border-none border-#e5e7eb w-full">
        <div className="flex items-center justify-end gap-4 px-6 py-2">
          <div className="flex items-center gap-2 text-black">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">
              {currentDateTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-black">
            <Clock className="w-5 h-5" />
            <span className="text-sm">
              {currentDateTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
              })}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}