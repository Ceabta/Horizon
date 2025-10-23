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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Agendamento | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agendamentoToDelete, setAgendamentoToDelete] = useState<Agendamento | null>(null);

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

  const formatarData = (dataString: string | Date) => {
    try {
      let data: Date;

      if (typeof dataString === 'string') {
        data = new Date(dataString);
      } else if (dataString instanceof Date) {
        data = dataString;
      } else {
        return 'Data inválida';
      }

      if (isNaN(data.getTime())) {
        return 'Data inválida';
      }

      return data.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

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
        <Card className="lg:col-span-2 flex flex-col" style={{
          backgroundColor: 'var(--card)',
          color: 'var(--card-foreground)'
        }}>
          <CardContent className="flex-1 p-4">
            <CustomCalendar
              events={events}
              onSelectEvent={(event) => setSelectedEvent(event.resource)}
              getStatusColor={getStatusColor}
            />
          </CardContent>
        </Card>

        <ListaAgendamentos
          agendamentos={agendamentos}
          onSelectAgendamento={setSelectedEvent}
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
        data={agendamentoToDelete?.data ? formatarData(String(agendamentoToDelete.data)) : ""}
        horario={agendamentoToDelete?.horario || ""}
      />
    </div>
  );
}