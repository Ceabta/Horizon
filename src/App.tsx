import { useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/App-Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Agendamentos } from "./pages/Agendamentos";
import { Clientes } from "./pages/Clientes";
import { OrdemServico } from "./pages/Ordem-Serviço";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import { useTheme } from "./hooks/theme-context";
import { AuthProvider } from "./hooks/useAuth";

export default function App() {
  const loadingBarRef = useRef<any>(null);
  const { toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <AuthProvider>
        <LoadingBar color="var(--chart-3)" height={3} ref={loadingBarRef} shadow />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/*" element={
            <ProtectedRoute>
              <SidebarProvider>
                <div className="flex w-full min-h-screen flex-col pt-0">
                  <div className="flex flex-1">
                    <AppSidebar onToggleTheme={toggleTheme} />

                    <div className="flex-1 flex flex-col">
                      <main className="flex-1 bg-muted/30 overflow-auto">
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/agendamentos" element={<Agendamentos />} />
                          <Route path="/clientes" element={<Clientes />} />
                          <Route path="/os" element={<OrdemServico />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>

                      <footer className="border-t text-center text-sm text-white py-3" style={{ backgroundColor: 'var(--chart-3)' }}>
                        © {new Date().getFullYear()}
                        <a
                          href="https://github.com/Ceabta"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold border-b border-transparent hover:border-current"
                        > Leonardo Cesário. </a>
                        Todos os direitos reservados.
                      </footer>
                    </div>
                  </div>
                </div>
              </SidebarProvider>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}