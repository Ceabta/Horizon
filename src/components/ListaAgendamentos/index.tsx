import { Clock, Phone, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import { format } from 'date-fns';
import style from './ListaAgendamentos.module.css';
import { Tag } from "../Tag";

interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  data: Date | string;
  horario: string;
  status: string;
  telefone: string;
  observacoes?: string;
}

interface ListaAgendamentosProps {
  agendamentos: Agendamento[];
  onSelectAgendamento: (agendamento: Agendamento) => void;
  getStatusColor: (status: string) => {
    bg: string;
    border: string;
    text: string;
    borderLeft: string;
  };
  onDelete?: (agendamento: Agendamento) => void;
}

export function ListaAgendamentos({
  agendamentos,
  onSelectAgendamento,
  getStatusColor,
  onDelete
}: ListaAgendamentosProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'data_asc' | 'data_desc' | 'cliente_asc' | 'cliente_desc'>('data_asc');

  function parseDateOnly(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  const formatarData = (dataString: string | Date) => {
    try {
      let data: Date;

      if (typeof dataString === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dataString)) {
          data = parseDateOnly(dataString);
        } else {
          data = new Date(dataString);
        }
      } else {
        data = dataString;
      }

      if (isNaN(data.getTime())) return 'Data inválida';

      return format(data, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Erro ao formatar data:', error, dataString);
      return 'Data inválida';
    }
  };

  const filteredAgendamentos = agendamentos.filter((ag) =>
    ag.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ag.servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ag.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAndSortedAgendamentos = filteredAgendamentos
    .filter((ag) => {
      if (!startDate && !endDate) return true;

      const agDate = new Date(ag.data);
      const agTime = new Date(agDate.getFullYear(), agDate.getMonth(), agDate.getDate()).getTime();

      if (startDate) {
        const s = new Date(startDate);
        const sTime = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
        if (agTime < sTime) return false;
      }

      if (endDate) {
        const e = new Date(endDate);
        const eTime = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
        if (agTime > eTime) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'data_asc':
          return new Date(a.data).getTime() - new Date(b.data).getTime();
        case 'data_desc':
          return new Date(b.data).getTime() - new Date(a.data).getTime();
        case 'cliente_asc':
          return a.cliente.localeCompare(b.cliente);
        case 'cliente_desc':
          return b.cliente.localeCompare(a.cliente);
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSortBy('data_asc');
    setShowFilter(false);
  };

  const applyFilters = () => {
    setShowFilter(false);
  };

  return (
    <Card className="flex-1 overflow-y-auto p-2" style={{ maxHeight: '100vh', minHeight: '100vh' }}>
      <CardHeader className="border-b">
        <CardTitle>Próximos Agendamentos</CardTitle>
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
                <div className="space-y-2">
                  <div>
                    <label className="text-sm block mb-1" style={{ color: 'var(--muted-foreground)' }}>Data início</label>
                    <input
                      type="date"
                      value={startDate ?? ''}
                      onChange={(e) => setStartDate(e.target.value || null)}
                      className="w-full p-2 rounded border"
                    />
                  </div>

                  <div>
                    <label className="text-sm block mb-1" style={{ color: 'var(--muted-foreground)' }}>Data fim</label>
                    <input
                      type="date"
                      value={endDate ?? ''}
                      onChange={(e) => setEndDate(e.target.value || null)}
                      className="w-full p-2 rounded border"
                    />
                  </div>

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
                      <option value="cliente_asc">Cliente (A → Z)</option>
                      <option value="cliente_desc">Cliente (Z → A)</option>
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
      </CardHeader>

      <CardContent className={`flex-1 overflow-y-auto p-4 ${style.scrollAgendamentos}`}>
        <div className="space-y-3">
          {filteredAndSortedAgendamentos.map((agendamento) => {
            const colors = getStatusColor(agendamento.status);
            return (
              <div
                key={agendamento.id}
                className="itemAgendamento"
                style={{
                  borderLeft: `4px solid ${colors.borderLeft}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 12px ${colors.borderLeft}66`;
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                onClick={() => onSelectAgendamento({
                  ...agendamento,
                  data: typeof agendamento.data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(agendamento.data)
                    ? parseDateOnly(agendamento.data)
                    : new Date(agendamento.data)
                })}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      {agendamento.cliente}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {agendamento.servico}
                    </p>
                  </div>
                  <Tag status={agendamento.status} />
                </div>
                <div className="flex flex-col gap-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatarData(String(agendamento.data))} às {agendamento.horario}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{agendamento.telefone}</span>
                    {onDelete && (
                      <div
                        className="right-0 ml-auto bg-red-400 hover:bg-red-500 p-1 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(agendamento);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-800 cursor-pointer" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}