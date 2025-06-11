import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface SettingsProps {
  setActiveSection: (section: string) => void;
}

export function Settings({ setActiveSection }: SettingsProps) {
  const [selectedSetting, setSelectedSetting] = useState("dashboard");
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    dashboard: {
      showQuickActions: true,
      showRecentActivities: true,
      defaultView: "cards",
      refreshInterval: "30",
      maxRecentItems: "5",
      theme: "light",
    },
    birthRegistration: {
      requireAllFields: true,
      autoGenerateId: true,
      notifyOnRegistration: true,
      defaultHospital: "HODO Hospital",
      autoSaveInterval: "2",
      requiredDocuments: "Birth Certificate, ID Card",
    },
    deathRegistration: {
      requireAllFields: true,
      autoGenerateId: true,
      notifyOnRegistration: true,
      defaultHospital: "HODO Hospital",
      autoSaveInterval: "2",
      requiredDocuments: "Death Certificate, ID Card",
    },
    certificates: {
      includeHospitalLogo: true,
      defaultTemplate: "standard",
      watermark: false,
      qualityLevel: "high",
      autoGenerate: false,
      signatureRequired: true,
    },
    userManagement: {
      allowMultipleUsers: false,
      requireAuthentication: false,
      sessionTimeout: "30",
      maxLoginAttempts: "3",
      passwordComplexity: "medium",
    },
    system: {
      darkMode: false,
      language: "English",
      autoSave: true,
      maintenanceMode: false,
    }
  });

  useEffect(() => {
    const savedSetting = localStorage.getItem('selectedSetting');
    if (savedSetting) {
      setSelectedSetting(savedSetting);
      localStorage.removeItem('selectedSetting');
    }

    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Apply dark mode if enabled
    const currentSettings = savedSettings ? JSON.parse(savedSettings) : settings;
    if (currentSettings.system.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
    console.log('Settings saved:', settings);
  };

  const resetSettings = (category: string) => {
    const defaultSettings = {
      dashboard: {
        showQuickActions: true,
        showRecentActivities: true,
        defaultView: "cards",
        refreshInterval: "30",
        maxRecentItems: "5",
        theme: "light",
      },
      birthRegistration: {
        requireAllFields: true,
        autoGenerateId: true,
        notifyOnRegistration: true,
        defaultHospital: "HODO Hospital",
        autoSaveInterval: "2",
        requiredDocuments: "Birth Certificate, ID Card",
      },
      deathRegistration: {
        requireAllFields: true,
        autoGenerateId: true,
        notifyOnRegistration: true,
        defaultHospital: "HODO Hospital",
        autoSaveInterval: "2",
        requiredDocuments: "Death Certificate, ID Card",
      },
      certificates: {
        includeHospitalLogo: true,
        defaultTemplate: "standard",
        watermark: false,
        qualityLevel: "high",
        autoGenerate: false,
        signatureRequired: true,
      },
      userManagement: {
        allowMultipleUsers: false,
        requireAuthentication: false,
        sessionTimeout: "30",
        maxLoginAttempts: "3",
        passwordComplexity: "medium",
      },
      system: {
        darkMode: false,
        language: "English",
        autoSave: true,
        maintenanceMode: false,
      }
    };
    
    setSettings(prev => ({
      ...prev,
      [category]: defaultSettings[category as keyof typeof defaultSettings]
    }));
    
    toast({
      title: "Settings Reset",
      description: `${category} settings have been reset to defaults.`,
    });
  };

  const toggleDarkMode = (enabled: boolean) => {
    handleSettingChange('system', 'darkMode', enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    toast({
      title: enabled ? "Dark Mode Enabled" : "Light Mode Enabled",
      description: `Switched to ${enabled ? 'dark' : 'light'} mode.`,
    });
  };

  const changeLanguage = (language: string) => {
    handleSettingChange('system', 'language', language);
    
    // Simulate language change by updating some text elements
    const languageMap: { [key: string]: { [key: string]: string } } = {
      'Spanish': {
        'Dashboard': 'Tablero',
        'Birth Records': 'Registros de Nacimiento',
        'Death Records': 'Registros de Defunción',
        'Settings': 'Configuraciones'
      },
      'French': {
        'Dashboard': 'Tableau de bord',
        'Birth Records': 'Dossiers de naissance',
        'Death Records': 'Dossiers de décès',
        'Settings': 'Paramètres'
      },
      'German': {
        'Dashboard': 'Dashboard',
        'Birth Records': 'Geburtsurkunden',
        'Death Records': 'Sterbeurkunden',
        'Settings': 'Einstellungen'
      },
      'English': {
        'Dashboard': 'Dashboard',
        'Birth Records': 'Birth Records',
        'Death Records': 'Death Records',
        'Settings': 'Settings'
      }
    };

    // Store the selected language for future use
    localStorage.setItem('selectedLanguage', language);
    
    toast({
      title: "Language Changed",
      description: `Language changed to ${language}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setActiveSection("dashboard")} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
          <p className="text-muted-foreground">Configure your application settings</p>
        </div>
      </div>

      <Tabs value={selectedSetting} onValueChange={setSelectedSetting}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="birth-registration">Birth Reg</TabsTrigger>
          <TabsTrigger value="death-registration">Death Reg</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="user-management">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-quick-actions">Show Quick Actions</Label>
                <Switch
                  id="show-quick-actions"
                  checked={settings.dashboard.showQuickActions}
                  onCheckedChange={(checked) => handleSettingChange('dashboard', 'showQuickActions', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-recent-activities">Show Recent Activities</Label>
                <Switch
                  id="show-recent-activities"
                  checked={settings.dashboard.showRecentActivities}
                  onCheckedChange={(checked) => handleSettingChange('dashboard', 'showRecentActivities', checked)}
                />
              </div>
              <div>
                <Label htmlFor="default-view">Default View</Label>
                <Select value={settings.dashboard.defaultView} onValueChange={(value) => handleSettingChange('dashboard', 'defaultView', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cards">Cards</SelectItem>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="refresh-interval">Auto Refresh Interval (seconds)</Label>
                <Input
                  id="refresh-interval"
                  type="number"
                  value={settings.dashboard.refreshInterval}
                  onChange={(e) => handleSettingChange('dashboard', 'refreshInterval', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="max-recent-items">Max Recent Items</Label>
                <Input
                  id="max-recent-items"
                  type="number"
                  value={settings.dashboard.maxRecentItems}
                  onChange={(e) => handleSettingChange('dashboard', 'maxRecentItems', e.target.value)}
                />
              </div>
              <Button onClick={() => resetSettings('dashboard')} variant="outline" className="w-full">
                Reset Dashboard Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={settings.system.darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={settings.system.language} onValueChange={changeLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">Auto Save</Label>
                <Switch
                  id="auto-save"
                  checked={settings.system.autoSave}
                  onCheckedChange={(checked) => handleSettingChange('system', 'autoSave', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <Switch
                  id="maintenance-mode"
                  checked={settings.system.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('system', 'maintenanceMode', checked)}
                />
              </div>
              <Button onClick={() => resetSettings('system')} variant="outline" className="w-full">
                Reset System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="birth-registration">
          <Card>
            <CardHeader>
              <CardTitle>Birth Registration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="require-all-fields-birth">Require All Fields</Label>
                <Switch
                  id="require-all-fields-birth"
                  checked={settings.birthRegistration.requireAllFields}
                  onCheckedChange={(checked) => handleSettingChange('birthRegistration', 'requireAllFields', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-generate-id-birth">Auto Generate ID</Label>
                <Switch
                  id="auto-generate-id-birth"
                  checked={settings.birthRegistration.autoGenerateId}
                  onCheckedChange={(checked) => handleSettingChange('birthRegistration', 'autoGenerateId', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-birth">Notify on Registration</Label>
                <Switch
                  id="notify-birth"
                  checked={settings.birthRegistration.notifyOnRegistration}
                  onCheckedChange={(checked) => handleSettingChange('birthRegistration', 'notifyOnRegistration', checked)}
                />
              </div>
              <div>
                <Label htmlFor="default-hospital-birth">Default Hospital</Label>
                <Input
                  id="default-hospital-birth"
                  value={settings.birthRegistration.defaultHospital}
                  onChange={(e) => handleSettingChange('birthRegistration', 'defaultHospital', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="required-documents-birth">Required Documents</Label>
                <Textarea
                  id="required-documents-birth"
                  value={settings.birthRegistration.requiredDocuments}
                  onChange={(e) => handleSettingChange('birthRegistration', 'requiredDocuments', e.target.value)}
                  rows={3}
                />
              </div>
              <Button onClick={() => resetSettings('birthRegistration')} variant="outline" className="w-full">
                Reset Birth Registration Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="death-registration">
          <Card>
            <CardHeader>
              <CardTitle>Death Registration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="require-all-fields-death">Require All Fields</Label>
                <Switch
                  id="require-all-fields-death"
                  checked={settings.deathRegistration.requireAllFields}
                  onCheckedChange={(checked) => handleSettingChange('deathRegistration', 'requireAllFields', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-generate-id-death">Auto Generate ID</Label>
                <Switch
                  id="auto-generate-id-death"
                  checked={settings.deathRegistration.autoGenerateId}
                  onCheckedChange={(checked) => handleSettingChange('deathRegistration', 'autoGenerateId', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-death">Notify on Registration</Label>
                <Switch
                  id="notify-death"
                  checked={settings.deathRegistration.notifyOnRegistration}
                  onCheckedChange={(checked) => handleSettingChange('deathRegistration', 'notifyOnRegistration', checked)}
                />
              </div>
              <div>
                <Label htmlFor="default-hospital-death">Default Hospital</Label>
                <Input
                  id="default-hospital-death"
                  value={settings.deathRegistration.defaultHospital}
                  onChange={(e) => handleSettingChange('deathRegistration', 'defaultHospital', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="required-documents-death">Required Documents</Label>
                <Textarea
                  id="required-documents-death"
                  value={settings.deathRegistration.requiredDocuments}
                  onChange={(e) => handleSettingChange('deathRegistration', 'requiredDocuments', e.target.value)}
                  rows={3}
                />
              </div>
              <Button onClick={() => resetSettings('deathRegistration')} variant="outline" className="w-full">
                Reset Death Registration Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-logo">Include Hospital Logo</Label>
                <Switch
                  id="include-logo"
                  checked={settings.certificates.includeHospitalLogo}
                  onCheckedChange={(checked) => handleSettingChange('certificates', 'includeHospitalLogo', checked)}
                />
              </div>
              <div>
                <Label htmlFor="default-template">Default Template</Label>
                <Select value={settings.certificates.defaultTemplate} onValueChange={(value) => handleSettingChange('certificates', 'defaultTemplate', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="watermark">Enable Watermark</Label>
                <Switch
                  id="watermark"
                  checked={settings.certificates.watermark}
                  onCheckedChange={(checked) => handleSettingChange('certificates', 'watermark', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="signature-required">Signature Required</Label>
                <Switch
                  id="signature-required"
                  checked={settings.certificates.signatureRequired}
                  onCheckedChange={(checked) => handleSettingChange('certificates', 'signatureRequired', checked)}
                />
              </div>
              <Button onClick={() => resetSettings('certificates')} variant="outline" className="w-full">
                Reset Certificate Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-management">
          <Card>
            <CardHeader>
              <CardTitle>User Management Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="multiple-users">Allow Multiple Users</Label>
                <Switch
                  id="multiple-users"
                  checked={settings.userManagement.allowMultipleUsers}
                  onCheckedChange={(checked) => handleSettingChange('userManagement', 'allowMultipleUsers', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="require-auth">Require Authentication</Label>
                <Switch
                  id="require-auth"
                  checked={settings.userManagement.requireAuthentication}
                  onCheckedChange={(checked) => handleSettingChange('userManagement', 'requireAuthentication', checked)}
                />
              </div>
              <div>
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.userManagement.sessionTimeout}
                  onChange={(e) => handleSettingChange('userManagement', 'sessionTimeout', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                <Input
                  id="max-login-attempts"
                  type="number"
                  value={settings.userManagement.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('userManagement', 'maxLoginAttempts', e.target.value)}
                />
              </div>
              <Button onClick={() => resetSettings('userManagement')} variant="outline" className="w-full">
                Reset User Management Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={saveSettings} className="w-full">
        Save All Settings
      </Button>
    </div>
  );
}