import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, FileQuestion, SearchX } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center text-center max-w-md space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
          <div className="relative bg-background border rounded-full p-8">
            <SearchX className="w-16 h-16 text-muted-foreground" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl text-primary/20">404</h1>
          <h2 className="text-foreground">Página não encontrada</h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida para outro local.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            className="botao flex-1"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir para o Dashboard
          </Button>
        </div>

        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-3">
            Ou navegue para:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate('/agendamentos')}
            >
              Agendamentos
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate('/clientes')}
            >
              Clientes
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate('/os')}
            >
              Ordens de Serviço
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}