import {
  Home,
  FileText,
  Users,
  ScrollText,
  Shield,
  Award,
  Search,
  ArrowRight,
  LucideSquareArrowUpRight,
  ArrowBigRight,
  ArrowRightIcon,
  ArrowRightSquare,
  ChevronRightIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: ChevronRightIcon,
    id: "dashboard",
  },
  {
    title: "Birth Registration",
    icon: ChevronRightIcon,
    id: "birth-registration",
  },
  {
    title: "Death Registration",
    icon: ChevronRightIcon,
    id: "death-registration",
  },
  {
    title: "Birth Records",
    icon: ChevronRightIcon,
    id: "birth-records",
  },
  {
    title: "Death Records",
    icon: ChevronRightIcon,
    id: "death-records",
  },
  {
    title: "Certificates",
    icon: ChevronRightIcon,
    id: "certificates",
  },
];

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMenuItems = menuItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className="border-r border-sidebar-border bg-black">
      <SidebarHeader className="bg-black">
        <div className="position-relative d-inline-block text-center">
          {/* <div className="w-208" style={{marginLeft:"100px"}}>
            <img
              src="/lovable-uploads/c69a8ea2-6100-4c61-8746-ba217b7b62bc.png"
              alt="HODO Hospital Logo"
            />
          </div> */}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white font-bold">
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Search Bar */}
            <div className="relative mb-4 px-3" style={{marginTop:"30px"}}>
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search-Ctrl+..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-black text-black placeholder-black focus:border-[#80def7]"
              />
            </div>

            <SidebarMenu >
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.id} style={{marginTop:"10px" ,height:"40px"}}>
                  <SidebarMenuButton asChild>
                    <button
                     style={{height:"50px"}}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors ${
                        activeSection === item.id
                          ? "bg-[#80def7] text-black"
                          : "text-white hover:bg-[#80def7] hover:text-white "
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-bold">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {filteredMenuItems.length === 0 && searchQuery && (
                <div className="text-gray-400 text-sm p-3">
                  No navigation items found for "{searchQuery}"
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
