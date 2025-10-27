import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CustomCalendar } from '../../components/CustomCalendar';
import { ListaAgendamentos } from '../../components/ListaAgendamentos';
import { NovoAgendamento } from '../../components/NovoAgendamento';
import { EditarAgendamento } from '../../components/EditarAgendamento';
import { useAgendamentos } from '../../hooks/useAgendamentos';
import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog';
import { TituloPagina } from "../../components/TituloPagina";
import { getStatusColor } from "../../utils/getStatusColor";
import { formatarData } from '../../utils/formatarData';
import style from './Agendamentos.module.css';
import { toast } from "sonner";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Agendamento | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agendamentoToDelete, setAgendamentoToDelete] = useState<Agendamento | null>(null);

  const { agendamentos, addAgendamento, updateAgendamento, deleteAgendamento } = useAgendamentos();

  const events = agendamentos.map(ag => ({
    id: ag.id,
    title: `${ag.cliente} - ${ag.servico}`,
    start: new Date(ag.data),
    end: new Date(new Date(ag.data).getTime() + 60 * 60 * 1000),
    resource: { ...ag, data: new Date(ag.data) },
  }));

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
      toast.success("Agendamento deletado com sucesso!");
    }
  };

  const handleSelectEvent = (event: any) => {
    const agendamento = {
      ...event.resource,
      data: typeof event.resource.data === 'string'
        ? event.resource.data
        : event.resource.data.toISOString().split('T')[0]
    };
    setSelectedEvent(agendamento);
  };

  return (
    <div className="p-8" style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <TituloPagina
            titulo="Agendamentos"
            subtitulo="Gerencie os agendamentos de atendimento"
          />
        </div>
        <Button
          className="botao"
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
        <Card className="lg:col-span-2 flex flex-col" style={{
          backgroundColor: 'var(--card)',
          color: 'var(--card-foreground)'
        }}>
          <CardContent className="flex-1 p-4">
            <CustomCalendar
              events={events}
              onSelectEvent={handleSelectEvent}
              getStatusColor={getStatusColor}
            />
          </CardContent>
        </Card>

        <ListaAgendamentos
          agendamentos={agendamentos}
          onSelectAgendamento={(ag) => {
            const agendamento = {
              ...ag,
              data: typeof ag.data === 'string' ? ag.data : ag.data
            };
            setSelectedEvent(agendamento);
          }}
          getStatusColor={getStatusColor}
        />
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
        data={agendamentoToDelete?.data ? formatarData(agendamentoToDelete.data) : ""}
        horario={agendamentoToDelete?.horario || ""}
      />
    </div>
  );
}