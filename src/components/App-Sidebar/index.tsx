import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Calendar, Home, Users, FileText, Moon, Sun } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "../ui/sidebar";
import { useTheme } from "../../hooks/theme-context";
import Logo from "../../assets/Logo(dark).png";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import style from "./AppSidebar.module.css";

interface AppSidebarProps {
  onToggleTheme: () => void;
}

export function AppSidebar({ onToggleTheme }: AppSidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();
  const { theme } = useTheme();

  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/agendamentos", icon: Calendar, label: "Agendamentos" },
    { path: "/clientes", icon: Users, label: "Clientes" },
    { path: "/os", icon: FileText, label: "Ordem de Serviço" },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-3">
          <div className={`${style.logo} w-10 h-10 rounded-lg flex items-center justify-center`}>
            <img src={Logo} alt="Logo" className={style.logo} />
          </div>
          <div>
            <h2>Horizon</h2>
            <p className="text-muted-foreground text-sm">Sistema de Gestão</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`${isActive ? style.menuOpcoesAtivo : style.menuOpcoes}`}
                >
                  <Link to={item.path}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onToggleTheme}>
              <div className={style.tema}>
                <span>Tema</span>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <div className={style.container}>
        <Button
          className={style.sair}
          onClick={handleLogout}
        >
          <span>Sair</span>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </Sidebar>
  );
}