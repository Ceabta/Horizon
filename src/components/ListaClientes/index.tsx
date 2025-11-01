import { useState } from "react";
import { Search, Mail, Phone, MapPin, MoreVertical, Edit, History, UserX, UserCheck, Filter, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Button } from "../ui/button";
import style from "./ListaClientes.module.css"
import { Tag } from "../Tag";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  status: "Ativo" | "Inativo";
  totalOS?: number;
  created_at?: string;
}

interface ListaClientesProps {
  clientes: Cliente[];
  onEdit?: (cliente: Cliente) => void;
  onViewHistory?: (cliente: Cliente) => void;
  onToggleStatus?: (cliente: Cliente) => void;
  onDelete?: (cliente: Cliente) => void;
}

export function ListaClientes({
  clientes,
  onEdit,
  onViewHistory,
  onToggleStatus,
  onDelete
}: ListaClientesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'data_asc' | 'data_desc' | 'cliente_asc' | 'cliente_desc'>('cliente_asc');
  const [somenteAtivos, setSomenteAtivos] = useState(false);

  const filteredClientes = clientes.filter((cliente) => {
    const searchLower = searchTerm.toLowerCase();
    const nome = (cliente.nome || '').toLowerCase();
    const email = (cliente.email || '').toLowerCase();
    const telefone = cliente.telefone || '';

    const matchSearch = nome.includes(searchLower) ||
      email.includes(searchLower) ||
      telefone.includes(searchTerm);

    const matchStatus = !somenteAtivos || cliente.status === 'Ativo';

    return matchSearch && matchStatus;
  });

  const sortedClientes = [...filteredClientes].sort((a, b) => {
    switch (sortBy) {
      case 'cliente_asc':
        return (a.nome || '').localeCompare(b.nome || '');
      case 'cliente_desc':
        return (b.nome || '').localeCompare(a.nome || '');
      case 'data_asc':
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      case 'data_desc':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSortBy('cliente_asc');
    setSomenteAtivos(false);
    setShowFilter(false);
  };

  const applyFilters = () => {
    setShowFilter(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-semibold text-lg">Lista de Clientes</CardTitle>
          <div className="flex gap-3 mt-4 items-start">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-gray-400"
                style={{ color: 'var(--foreground)' }}
              />
            </div>
            <div className="relative">
              <Button
                size="icon"
                className="botao"
                onClick={() => setShowFilter((s) => !s)}
                aria-expanded={showFilter}
                aria-haspopup="dialog"
              >
                <Filter className="w-4 h-4" />
              </Button>

              {showFilter && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-md shadow-lg z-40"
                  style={{ background: 'var(--card)', padding: '0.75rem', border: '1px solid var(--border)' }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm block mb-1" style={{ color: 'var(--muted-foreground)' }}>Ordenar por</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full p-2 rounded border"
                        style={{ backgroundColor: "var(--background)" }}
                      >
                        <option value="cliente_asc">Cliente (A → Z)</option>
                        <option value="cliente_desc">Cliente (Z → A)</option>
                        <option value="data_asc">Data (mais antiga → mais nova)</option>
                        <option value="data_desc">Data (mais nova → mais antiga)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm block mb-2" style={{ color: 'var(--muted-foreground)' }}>
                        Somente clientes ativos?
                      </label>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={somenteAtivos}
                        onClick={() => setSomenteAtivos(!somenteAtivos)}
                        className={`relative inline-flex h-9 w-24 items-center rounded-full transition-colors ${somenteAtivos ? 'bg-green-900' : 'bg-gray-300'
                          }`}
                      >
                        <span className={`absolute right-2 text-xs font-semibold transition-opacity ${!somenteAtivos ? 'opacity-100 text-gray-700' : 'opacity-0'
                          }`}>
                          Não
                        </span>

                        <span className={`absolute left-2 text-xs font-semibold transition-opacity ${somenteAtivos ? 'opacity-100 text-white' : 'opacity-0'
                          }`}>
                          Sim
                        </span>

                        <span
                          className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-md transition-transform ${somenteAtivos ? 'translate-x-16' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>

                    <div className="flex gap-6 justify-end mt-7">
                      <button
                        className="px-3 py-1 rounded border"
                        onClick={clearFilters}
                        type="button"
                      >
                        Limpar
                      </button>
                      <button
                        className="px-3 py-1 rounded botao"
                        onClick={() => applyFilters()}
                        type="button"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedClientes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedClientes.map((cliente) => (
              <Card key={cliente.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                      <Tag status={cliente.status} />
                    </div>
                    <DropdownMenu >
                      <DropdownMenuTrigger className="cursor-pointer" asChild >
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" style={{ backgroundColor: "var(--background)" }}>
                        {onEdit && (
                          <DropdownMenuItem className={style.opcoes} onClick={() => onEdit(cliente)}>
                            <Edit />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {onViewHistory && (
                          <DropdownMenuItem className={style.opcoes} onClick={() => onViewHistory(cliente)}>
                            <History />
                            Ver Histórico
                          </DropdownMenuItem>
                        )}
                        {onToggleStatus && (
                          <DropdownMenuItem
                            className={style.opcoes}
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
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Total de OS: <span className="font-semibold text-foreground">{cliente.totalOS || 0}</span>
                      </p>
                      {onDelete && (
                        <Trash2 className="w-5 h-5 text-red-700 cursor-pointer" onClick={() => onDelete(cliente)}/>
                      )}
                    </div>
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