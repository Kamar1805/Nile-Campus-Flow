import {
  LayoutDashboard,
  DoorOpen,
  Car,
  Users,
  FileText,
  Settings,
  LogOut,
  QrCode,
  Activity,
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const getMenuItems = () => {
    switch (user?.role) {
      case "admin":
        return [
          { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
          { title: "Gates Management", icon: DoorOpen, url: "/gates" },
          { title: "Vehicles", icon: Car, url: "/vehicles" },
          { title: "Users", icon: Users, url: "/users" },
          { title: "Access Logs", icon: Activity, url: "/logs" },
          { title: "Reports", icon: FileText, url: "/reports" },
          { title: "Settings", icon: Settings, url: "/settings" },
        ];
      case "security_officer":
        return [
          { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
          { title: "Gate Monitor", icon: DoorOpen, url: "/gates" },
          { title: "Scan QR Code", icon: QrCode, url: "/scan" },
          { title: "Access Logs", icon: Activity, url: "/logs" },
        ];
      case "student_staff":
        return [
          { title: "My Dashboard", icon: LayoutDashboard, url: "/dashboard" },
          { title: "My Vehicles", icon: Car, url: "/vehicles" },
          { title: "My Access History", icon: Activity, url: "/history" },
          { title: "Get QR Code", icon: QrCode, url: "/qr-code" },
        ];
      case "visitor":
        return [
          { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
          { title: "Pre-Register", icon: QrCode, url: "/register" },
          { title: "My Passes", icon: FileText, url: "/passes" },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-md flex items-center justify-center">
            <DoorOpen className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">CampusFlow</h2>
            <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => setLocation(item.url)}
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="space-y-2">
          <div className="px-3 py-2 rounded-md bg-sidebar-accent">
            <p className="text-sm font-medium text-sidebar-accent-foreground">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} data-testid="button-logout">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
