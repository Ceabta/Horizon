import { Clock, FileUser, Phone, Trash2 } from "lucide-react";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import { formatarData } from "../../../utils/formatarData";
import { Tag } from "../../Tag";
import type { Agendamento } from "../../../types";
import { NovaOS } from "../../OS/NovaOS";
import { useOrdemServico } from "../../../hooks/useOrdemServico";
import { useAgendamentos } from "../../../hooks/useAgendamentos";
import { toast } from "sonner";
import style from './ListaAgendamentos.module.css';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'data_asc' | 'data_desc' | 'cliente_asc' | 'cliente_desc'>('data_asc');

  const { nextAgendamentoNumberForCliente, refetch: refetchAgendamentos } = useAgendamentos();
  const { ordensServico, addOrdemServicoComPDF } = useOrdemServico();

  function parseDateOnly(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

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

  const handleSubmit = async (data: any) => {
    const { pdfFile, ...osData } = data;
    const result = await addOrdemServicoComPDF(osData, pdfFile);

    if (result.success) {
      toast.success(pdfFile ? "OS criada e PDF anexado com sucesso!" : "OS criada com sucesso!");

      setDialogOpen(false);
      setSelectedAgendamento(null);

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      toast.error(result.error ?? "Erro ao criar OS");
    }
    return result;
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
                    <span>{formatarData(agendamento.data)} às {agendamento.horario}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{agendamento.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileUser className="w-4 h-4" />
                    OS Gerada?:
                    {agendamento.os_gerada === true ? (
                      <span className="font-medium text-green-600">Sim</span>
                    ) : (
                      <span className="font-medium text-red-600">Não</span>
                    )
                    }
                    {onDelete && agendamento.os_gerada && (
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
                  {!agendamento.os_gerada &&
                    (
                      <div className="flex items-center mt-2">
                        <Button
                          className="botao h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDialogOpen(true);
                            setSelectedAgendamento(agendamento);
                          }}
                        >
                          <HiOutlineDocumentPlus />
                          Gerar OS
                        </Button>
                        {onDelete && !agendamento.os_gerada && (
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
                    )
                  }
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <NovaOS
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        agendamento={agendamentos}
        proximoNumeroOS={nextAgendamentoNumberForCliente}
        agendamentoInicial={selectedAgendamento}
      />
    </Card>
  );
}