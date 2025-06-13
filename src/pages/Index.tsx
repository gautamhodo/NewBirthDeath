import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNavigation } from "@/components/TopNavigation";
import { BirthRegistration } from "@/components/BirthRegistration";
import { DeathRegistration } from "@/components/DeathRegistration";
import { BirthRecords } from "@/components/BirthRecords";
import { DeathRecords } from "@/components/DeathRecords";
import { CertificateGenerator } from "@/components/CertificateGenerator";
import { Dashboard } from "@/components/Dashboard";
import { Settings } from "@/components/Settings";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "birth-registration":
        return <BirthRegistration setActiveSection={setActiveSection} />;
      case "death-registration":
        return <DeathRegistration setActiveSection={setActiveSection} />;
      case "birth-records":
        return <BirthRecords setActiveSection={setActiveSection} />;
      case "death-records":
        return <DeathRecords setActiveSection={setActiveSection} />;
      case "certificates":
        return <CertificateGenerator setActiveSection={setActiveSection} />;
      case "settings":
        return <Settings setActiveSection={setActiveSection} />;
      default:
        return <Dashboard setActiveSection={setActiveSection} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background pt-16">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 overflow-auto">
          <TopNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
