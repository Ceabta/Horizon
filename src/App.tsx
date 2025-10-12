import { useState, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/App-Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Agendamentos } from "./components/Agendamentos";
import { Clientes } from "./components/Clientes";
import { OrdemServico } from "./components/Ordem-Serviço";
import { Toaster } from "./components/ui/sonner";
import { useTheme } from "./hooks/theme-context";

export type Page = "dashboard" | "agendamentos" | "clientes" | "os";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [isPending, setIsPending] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const loadingBarRef = useRef<any>(null);

  const handleNavigate = (page: Page) => {
    if (page === currentPage) return;

    setIsPending(true);
    loadingBarRef.current?.continuousStart();

    const loadTime = 500;

    setTimeout(() => {
      setCurrentPage(page);
      loadingBarRef.current?.complete();
      setIsPending(false);
    }, loadTime);
  };

  const renderPage = () => {
    if (isPending) {
        return null;
    }
    
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;
      case "agendamentos":
        return <Agendamentos />;
      case "clientes":
        return <Clientes />;
      case "os":
        return <OrdemServico />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <SidebarProvider>
      <LoadingBar 
        color='var(--chart-3)' 
        height={3} 
        ref={loadingBarRef}
        shadow={true}
      />
      <div className="flex w-full min-h-screen">
        <AppSidebar 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main className="flex-1 bg-muted/30">
          {renderPage()}
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}