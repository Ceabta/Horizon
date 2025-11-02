import { useState } from "react";
import { Search, Filter, Eye, Printer, Download, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Tag } from "../../Tag";
import { formatarData } from "../../../utils/formatarData";
import style from "./ListaOS.module.css";

interface OS {
  id: number;
  agendamento_id: number;
  nome: string;
  descricao: string;
  valor: number;
  status: string;
  created_at?: string;
  agendamento: {
    data: string;
    horario: string;
    cliente: string;
    telefone: string;
    email: string;
    servico: string;
  };
}

interface ListaOSProps {
  ordemServico: OS[];
  onEdit?: (os: OS) => void;
  onDelete?: (os: OS) => void;
  onView?: (os: OS) => void;
  onPrint?: (os: OS) => void;
  onDownloadPDF?: (os: OS) => void;
}

export function ListaOS({
  ordemServico,
  onEdit,
  onDelete,
  onView,
  onPrint,
  onDownloadPDF
}: ListaOSProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'data_asc' | 'data_desc'>('data_asc');

  const filteredOS = ordemServico.filter((os) => {
    const searchLower = searchTerm.toLowerCase();
    const nome = (os.nome || '').toLowerCase();
    const descricao = (os.descricao || '').toLowerCase();
    const status = (os.status || '').toLowerCase();
    const cliente = (os.agendamento?.cliente || '').toLowerCase();

    const matchSearch = nome.includes(searchLower) ||
      descricao.includes(searchLower) ||
      status.includes(searchLower) ||
      cliente.includes(searchLower);

    return matchSearch;
  });

  const sortedOS = [...filteredOS].sort((a, b) => {
    switch (sortBy) {
      case 'data_asc':
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      case 'data_desc':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSortBy('data_asc');
    setShowFilter(false);
  };

  const applyFilters = () => {
    setShowFilter(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-semibold text-lg">Lista de OS</CardTitle>
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
                        <option value="data_asc">Data (mais antiga → mais nova)</option>
                        <option value="data_desc">Data (mais nova → mais antiga)</option>
                      </select>
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
        {sortedOS.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhuma OS encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOS.map((os) => (
              <Card
                key={os.id}
                className="hover:shadow-lg transition-all duration-300"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-xl">{os.nome}</h3>
                      <Tag status={os.status} />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: 'var(--chart-3)' }}>
                        R$ {os.valor?.toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatarData(os.agendamento.data)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="text-base font-semibold">{os.agendamento.cliente}</p>
                    <p className="text-sm text-muted-foreground">{os.agendamento.servico}</p>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-border">
                    {onView && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(os)}
                        className="botao"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                    )}
                    {onPrint && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPrint(os)}
                        className="botao"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimir
                      </Button>
                    )}
                    {onDownloadPDF && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownloadPDF(os)}
                        className="botao"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar PDF
                      </Button>
                    )}
                    <div className="flex items-center justify-end ml-auto">
                      {onDelete && (
                        <Trash2 className="w-5 h-5 text-red-700 cursor-pointer" onClick={() => onDelete(os)} />
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