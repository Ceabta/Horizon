import { useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/App-Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Agendamentos } from "./pages/Agendamentos";
import { Clientes } from "./pages/Clientes";
import { OrdemServico } from "./pages/Ordem-Serviço";
import { Toaster } from "./components/ui/sonner";
import { useTheme } from "./hooks/theme-context";

export default function App() {
  const loadingBarRef = useRef<any>(null);
  const { toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <SidebarProvider>
        <LoadingBar color="var(--chart-3)" height={3} ref={loadingBarRef} shadow />
        <div className="flex w-full min-h-screen">
          <AppSidebar onToggleTheme={toggleTheme} />

          <main className="flex-1 bg-muted/30 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agendamentos" element={<Agendamentos />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/os" element={<OrdemServico />} />
              <Route path="*" element={<h1>Página não encontrada</h1>} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
    </BrowserRouter>
  );
}