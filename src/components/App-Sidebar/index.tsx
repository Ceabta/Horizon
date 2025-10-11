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
import style from './AppSidebar.module.css';
import type { Page } from "../../App";
import Logo from "../../assets/Logo.png"

interface AppSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function AppSidebar({ currentPage, onNavigate, theme, onToggleTheme }: AppSidebarProps) {
  const menuItems = [
    { id: "dashboard" as Page, icon: Home, label: "Dashboard" },
    { id: "agendamentos" as Page, icon: Calendar, label: "Agendamentos" },
    { id: "clientes" as Page, icon: Users, label: "Clientes" },
    { id: "os" as Page, icon: FileText, label: "Ordem de Serviço" },
  ];

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
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => onNavigate(item.id)}
                isActive={currentPage === item.id}
                className={`${currentPage === item.id ? style.menuOpcoesAtivo : style.menuOpcoes}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem >
            <SidebarMenuButton onClick={onToggleTheme}>
              <div className={style.tema}>
                <span>Tema</span>
                {theme === "light" ? (
                  <>
                    <Moon className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <Sun className="w-5 h-5" />
                  </>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}