import { Settings, Bell, User, LogOut, Edit2, Save, X, UserMinus, Trash2, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
  const [selectedNotificationProfile, setSelectedNotificationProfile] = useState<any>(null);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [editedProfileData, setEditedProfileData] = useState<any>({});
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

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

    // Load all profiles for search
    const allProfilesForSearch = [
      ...birthRecords.map((record: any) => ({ ...record, type: 'birth' })),
      ...deathRecords.map((record: any) => ({ ...record, type: 'death' }))
    ];
    setAllProfiles(allProfilesForSearch);
  }, []);

  const handleSettingsClick = (setting: string) => {
    console.log(`Opening ${setting} settings`);
    setActiveSection('settings');
    localStorage.setItem('selectedSetting', setting);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
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
    setSelectedNotificationProfile(null);
    setShowSearchResults(false);
    setSearchQuery("");
    console.log('Selected profile:', profile);
    toast({
      title: "Profile Selected",
      description: `Switched to ${profile.firstName} ${profile.lastName}`,
    });
  };

  const handleNotificationClick = (notification: any) => {
    setSelectedNotificationProfile(notification.profile);
    setCurrentProfile(notification.profile);
    console.log('Notification clicked, showing profile:', notification.profile);
  };

  const handleEditProfile = (profile: any) => {
    setEditingProfile(profile);
    setEditedProfileData({ ...profile });
  };

  const handleSaveProfile = () => {
    if (!editingProfile) return;

    // Update the profile in localStorage
    const birthRecords = JSON.parse(localStorage.getItem('birthRecords') || '[]');
    const deathRecords = JSON.parse(localStorage.getItem('deathRecords') || '[]');

    if (editingProfile.type === 'birth') {
      const updatedBirthRecords = birthRecords.map((record: any) => 
        record.id === editingProfile.id ? { ...editedProfileData } : record
      );
      localStorage.setItem('birthRecords', JSON.stringify(updatedBirthRecords));
    } else {
      const updatedDeathRecords = deathRecords.map((record: any) => 
        record.id === editingProfile.id ? { ...editedProfileData } : record
      );
      localStorage.setItem('deathRecords', JSON.stringify(updatedDeathRecords));
    }

    // Update current profile if it's the one being edited
    if (currentProfile?.id === editingProfile.id) {
      setCurrentProfile(editedProfileData);
    }

    // Update all profiles list
    const updatedProfiles = allProfiles.map(profile => 
      profile.id === editingProfile.id ? editedProfileData : profile
    );
    setAllProfiles(updatedProfiles);

    setEditingProfile(null);
    setEditedProfileData({});
    
    toast({
      title: "Profile Updated",
      description: `${editedProfileData.firstName} ${editedProfileData.lastName}'s profile has been saved.`,
    });

    // Refresh the page data
    window.location.reload();
  };

  const handleDischargeProfile = (profile: any) => {
    // Remove from birth records
    const birthRecords = JSON.parse(localStorage.getItem('birthRecords') || '[]');
    const updatedBirthRecords = birthRecords.filter((record: any) => record.id !== profile.id);
    localStorage.setItem('birthRecords', JSON.stringify(updatedBirthRecords));

    // Update profiles list
    const updatedProfiles = allProfiles.filter(p => p.id !== profile.id);
    setAllProfiles(updatedProfiles);

    // Clear current profile if it's the one being discharged
    if (currentProfile?.id === profile.id) {
      setCurrentProfile(null);
    }

    toast({
      title: "Profile Discharged",
      description: `${profile.firstName} ${profile.lastName} has been discharged.`,
    });

    // Refresh the page data
    window.location.reload();
  };

  const handleRemoveProfile = (profile: any) => {
    // Remove from death records
    const deathRecords = JSON.parse(localStorage.getItem('deathRecords') || '[]');
    const updatedDeathRecords = deathRecords.filter((record: any) => record.id !== profile.id);
    localStorage.setItem('deathRecords', JSON.stringify(updatedDeathRecords));

    // Update profiles list
    const updatedProfiles = allProfiles.filter(p => p.id !== profile.id);
    setAllProfiles(updatedProfiles);

    // Clear current profile if it's the one being removed
    if (currentProfile?.id === profile.id) {
      setCurrentProfile(null);
    }

    toast({
      title: "Profile Removed",
      description: `${profile.firstName} ${profile.lastName} has been removed.`,
    });

    // Refresh the page data
    window.location.reload();
  };

  const handleLogout = () => {
    setCurrentProfile(null);
    setSelectedNotificationProfile(null);
    console.log('Logged out from profile');
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

  // Profile Details Display Component
  const ProfileDetails = ({ profile, onClose }: { profile: any, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Profile Details</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-3">
          <div><strong>Name:</strong> {profile.firstName} {profile.middleName} {profile.lastName}</div>
          <div><strong>Type:</strong> {profile.type} record</div>
          {profile.type === 'birth' && (
            <>
              <div><strong>Date of Birth:</strong> {new Date(profile.dateOfBirth).toLocaleDateString()}</div>
              <div><strong>Gender:</strong> {profile.gender}</div>
              <div><strong>Father:</strong> {profile.fatherName}</div>
              <div><strong>Mother:</strong> {profile.motherName}</div>
            </>
          )}
          {profile.type === 'death' && (
            <>
              <div><strong>Date of Birth:</strong> {new Date(profile.dateOfBirth).toLocaleDateString()}</div>
              <div><strong>Date of Death:</strong> {new Date(profile.dateOfDeath).toLocaleDateString()}</div>
              <div><strong>Cause of Death:</strong> {profile.causeOfDeath}</div>
              <div><strong>Gender:</strong> {profile.gender}</div>
            </>
          )}
          <div><strong>Registration Date:</strong> {new Date(profile.registrationDate).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <nav className="bg-black border-b border-gray-800 w-full">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left side - Logo and navigation */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {/* <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <img 
                  src="/lovable-uploads/c69a8ea2-6100-4c61-8746-ba217b7b62bc.png" 
                  alt="HODO Hospital Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div> */}
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
          <div className="flex-1 max-w-md mx-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                    onClick={() => handleProfileSelect(profile)}
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {profile.firstName?.[0]}{profile.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
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
          
          {/* Right side - Notifications, Profile, Settings */}
          <div className="flex items-center gap-2">
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
                      onClick={() => handleNotificationClick(notification)}
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
                    <AvatarImage src={currentProfile?.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {currentProfile ? `${currentProfile.firstName?.[0]}${currentProfile.lastName?.[0]}` : <User className="w-3 h-3" />}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 bg-white border border-gray-200 shadow-lg max-h-96 overflow-y-auto">
                <DropdownMenuLabel>
                  {currentProfile ? `${currentProfile.firstName} ${currentProfile.lastName}` : 'Select Profile'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Edit Profile Section */}
                {editingProfile && (
                  <div className="p-4 border-b max-h-80 overflow-y-auto">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Edit Profile</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">First Name</Label>
                          <Input 
                            value={editedProfileData.firstName || ''} 
                            onChange={(e) => setEditedProfileData({...editedProfileData, firstName: e.target.value})}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Last Name</Label>
                          <Input 
                            value={editedProfileData.lastName || ''} 
                            onChange={(e) => setEditedProfileData({...editedProfileData, lastName: e.target.value})}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Middle Name</Label>
                        <Input 
                          value={editedProfileData.middleName || ''} 
                          onChange={(e) => setEditedProfileData({...editedProfileData, middleName: e.target.value})}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Gender</Label>
                        <Select value={editedProfileData.gender || ''} onValueChange={(value) => setEditedProfileData({...editedProfileData, gender: value})}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {editingProfile.type === 'birth' && (
                        <>
                          <div>
                            <Label className="text-xs">Father Name</Label>
                            <Input 
                              value={editedProfileData.fatherName || ''} 
                              onChange={(e) => setEditedProfileData({...editedProfileData, fatherName: e.target.value})}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Mother Name</Label>
                            <Input 
                              value={editedProfileData.motherName || ''} 
                              onChange={(e) => setEditedProfileData({...editedProfileData, motherName: e.target.value})}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Place of Birth</Label>
                            <Input 
                              value={editedProfileData.placeOfBirth || ''} 
                              onChange={(e) => setEditedProfileData({...editedProfileData, placeOfBirth: e.target.value})}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Weight (kg)</Label>
                            <Input 
                              value={editedProfileData.weight || ''} 
                              onChange={(e) => setEditedProfileData({...editedProfileData, weight: e.target.value})}
                              className="h-8 text-xs"
                            />
                          </div>
                        </>
                      )}
                      {editingProfile.type === 'death' && (
                        <>
                          <div>
                            <Label className="text-xs">Cause of Death</Label>
                            <Input 
                              value={editedProfileData.causeOfDeath || ''} 
                              onChange={(e) => setEditedProfileData({...editedProfileData, causeOfDeath: e.target.value})}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Place of Death</Label>
                            <Input 
                              value={editedProfileData.placeOfDeath || ''} 
                              onChange={(e) => setEditedProfileData({...editedProfileData, placeOfDeath: e.target.value})}
                              className="h-8 text-xs"
                            />
                          </div>
                        </>
                      )}
                      <div>
                        <Label className="text-xs">Address</Label>
                        <Input 
                          value={editedProfileData.address || ''} 
                          onChange={(e) => setEditedProfileData({...editedProfileData, address: e.target.value})}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveProfile} className="flex items-center gap-1">
                          <Save className="w-3 h-3" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingProfile(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {allProfiles.slice(0, 8).map((profile, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50">
                    <div 
                      className="flex items-center gap-2 flex-1 cursor-pointer"
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
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProfile(profile);
                        }}
                        className="p-1"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      {profile.type === 'birth' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="p-1 text-orange-600 hover:text-orange-700">
                              <UserMinus className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Discharge Patient</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to discharge {profile.firstName} {profile.lastName}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDischargeProfile(profile)}>
                                Discharge
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {profile.type === 'death' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="p-1 text-red-600 hover:text-red-700">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Profile</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {profile.firstName} {profile.lastName}'s profile? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemoveProfile(profile)}>
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                ))}
                
                {allProfiles.length === 0 && (
                  <DropdownMenuItem>No profiles available</DropdownMenuItem>
                )}
                
                {currentProfile && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                      <LogOut className="w-4 h-4" />
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

      {/* Profile Details Modal */}
      {selectedNotificationProfile && (
        <ProfileDetails 
          profile={selectedNotificationProfile} 
          onClose={() => setSelectedNotificationProfile(null)} 
        />
      )}
    </>
  );
}