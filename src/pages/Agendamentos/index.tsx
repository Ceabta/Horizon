import React, { useState } from "react";
import { Search, Filter, Phone, Clock, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { CustomCalendar } from '../../components/CustomCalendar';
import { NovoAgendamento } from '../../components/NovoAgendamento';
import { EditarAgendamento } from '../../components/EditarAgendamento';
import { useAgendamentos } from '../../hooks/useAgendamentos';
import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog';
import style from './Agendamentos.module.css';

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

export function Agendamentos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Agendamento | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agendamentoToDelete, setAgendamentoToDelete] = useState<Agendamento | null>(null);

  // filtros / ordenação (NOVO)
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'data_asc' | 'data_desc' | 'cliente_asc' | 'cliente_desc'>('data_asc');

  const { agendamentos, addAgendamento, updateAgendamento, deleteAgendamento } = useAgendamentos();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluido":
        return {
          bg: "var(--card2-bg)",
          border: "var(--card2-icon)",
          text: "var(--card2-icon)",
          borderLeft: "rgb(22,163,74)"
        };
      case "Em Andamento":
        return {
          bg: "var(--card1-bg)",
          border: "var(--card1-icon)",
          text: "var(--card1-icon)",
          borderLeft: "rgb(37, 99, 235)"
        };
      case "Cancelado":
        return {
          bg: "var(--card3-bg)",
          border: "var(--card3-icon)",
          text: "var(--card3-icon)",
          borderLeft: "rgb(234, 88, 12)"
        };
      default:
        return {
          bg: "var(--card4-bg)",
          border: "var(--card4-icon)",
          text: "var(--card4-icon)",
          borderLeft: "rgb(147, 51, 234)"
        };
    }
  };

  const events = agendamentos.map(ag => ({
    id: ag.id,
    title: `${ag.cliente} - ${ag.servico}`,
    start: new Date(ag.data),
    end: new Date(new Date(ag.data).getTime() + 60 * 60 * 1000),
    resource: { ...ag, data: new Date(ag.data) },
  }));

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const filteredAgendamentos = agendamentos.filter((ag) =>
    ag.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ag.servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ag.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // aplica filtro por intervalo e ordenação
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

  const handleSubmit = (data: any) => {
    addAgendamento(data);
    setDialogOpen(false);
  };

  const handleUpdate = (data: any) => {
    updateAgendamento(data);
    setSelectedEvent(null);
  };

  const handleDeleteClick = (agendamento: Agendamento) => {
    setAgendamentoToDelete(agendamento);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (agendamentoToDelete) {
      deleteAgendamento(agendamentoToDelete.id, agendamentoToDelete.cliente);
      setDeleteDialogOpen(false);
      setAgendamentoToDelete(null);
      setSelectedEvent(null);
    }
  };

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
    <div className="p-8" style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Agendamentos</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Gerencie os agendamentos de atendimento</p>
        </div>
        <Button
          className={style.botao}
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>

        <NovoAgendamento
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          agendamento={null}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '600px' }}>
        <Card className="lg:col-span-2 flex flex-col" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
          <CardContent className="flex-1 min-h-0 p-4">
            <div className="h-full">
              <CustomCalendar
                events={events}
                onSelectEvent={(event) => setSelectedEvent(event.resource)}
                getStatusColor={getStatusColor}
              />
            </div>
          </CardContent>
        </Card>

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
                  className={style.botao}
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
                          style={{backgroundColor: "var(--background)"}}
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
                          className={`px-3 py-1 rounded ${style.botao}`}
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
                    className={style.itemAgendamento}
                    style={{
                      borderLeft: `4px solid ${colors.borderLeft}`
                    }}
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
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`
                        }}
                      >
                        {agendamento.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatarData(new Date(agendamento.data).toISOString())} às {agendamento.horario}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{agendamento.telefone}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedEvent && (
        <EditarAgendamento
          open={!!selectedEvent}
          onOpenChange={() => setSelectedEvent(null)}
          agendamento={selectedEvent}
          onSave={handleUpdate}
          onDelete={() => handleDeleteClick(selectedEvent)}
        />
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        clienteName={agendamentoToDelete?.cliente || ""}
        servico={agendamentoToDelete?.servico || ""}
        data={agendamentoToDelete?.data ? formatarData(new Date(agendamentoToDelete.data).toISOString()) : ""}
        horario={agendamentoToDelete?.horario || ""}
      />
    </div>
  );
}