import { useState } from "react";
import { Search, Mail, Phone, MapPin, MoreVertical, Edit, History, UserX, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  status: "Ativo" | "Inativo";
  totalOS?: number;
}

interface ListaClientesProps {
  clientes: Cliente[];
  onEdit?: (cliente: Cliente) => void;
  onViewHistory?: (cliente: Cliente) => void;
  onToggleStatus?: (cliente: Cliente) => void;
}

export function ListaClientes({
  clientes,
  onEdit,
  onViewHistory,
  onToggleStatus
}: ListaClientesProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone.includes(searchTerm)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-semibold text-lg">Lista de Clientes</CardTitle>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredClientes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClientes.map((cliente) => (
              <Card key={cliente.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-center text-xs font-medium w-fit ${cliente.status === "Ativo"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-200 dark:bg-red-700 dark:text-red-200"
                          }`}
                      >
                        {cliente.status}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" style={{backgroundColor: "var(--background)"}}>
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(cliente)}>
                            <Edit />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {onViewHistory && (
                          <DropdownMenuItem onClick={() => onViewHistory(cliente)}>
                            <History />
                            Ver Histórico
                          </DropdownMenuItem>
                        )}
                        {onToggleStatus && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onToggleStatus(cliente)}
                          >
                            {cliente.status === "Ativo" ? <UserX /> : <UserCheck />}
                            {cliente.status === "Ativo" ? "Desativar" : "Ativar"}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{cliente.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{cliente.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{cliente.endereco || "Não informado"}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Total de OS: <span className="font-semibold text-foreground">{cliente.totalOS || 0}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}