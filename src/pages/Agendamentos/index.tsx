import { useState } from "react";
import { Search, Filter, Phone, Clock, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { CustomCalendar } from '../../components/CustomCalendar';
import { NovoAgendamento } from '../../components/NovoAgendamento';
import style from './Agendamentos.module.css';

interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  data: Date;
  horario: string;
  status: string;
  telefone: string;
  observacoes?: string;
}

export function Agendamentos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Agendamento | null>(null);
  const [formData, setFormData] = useState({
    cliente: "",
    servico: "",
    data: "",
    horario: "",
    telefone: "",
    status: "Em Andamento",
    observacoes: "",
  });

  const [agendamentos] = useState<Agendamento[]>([
    {
      id: 1,
      cliente: "Maria Silva",
      servico: "Manutenção Preventiva",
      data: new Date(2025, 9, 10, 9, 0),
      horario: "09:00",
      status: "Concluido",
      telefone: "(11) 98765-4321",
    },
    {
      id: 2,
      cliente: "João Santos",
      servico: "Instalação de Sistema",
      data: new Date(2025, 9, 10, 10, 30),
      horario: "10:30",
      status: "Em Andamento",
      telefone: "(11) 91234-5678",
    },
    {
      id: 3,
      cliente: "Ana Costa",
      servico: "Reparo de Equipamento",
      data: new Date(2025, 9, 10, 14, 0),
      horario: "14:00",
      status: "Concluido",
      telefone: "(11) 93456-7890",
    },
    {
      id: 4,
      cliente: "Carlos Lima",
      servico: "Consultoria Técnica",
      data: new Date(2025, 9, 11, 15, 30),
      horario: "15:30",
      status: "Cancelado",
      telefone: "(11) 92345-6789",
    },
    {
      id: 5,
      cliente: "Carlos Lima",
      servico: "Consultoria Técnica",
      data: new Date(2025, 8, 11, 15, 30),
      horario: "15:30",
      status: "Concluido",
      telefone: "(11) 92345-6789",
    },
    {
      id: 6,
      cliente: "João Santos",
      servico: "Instalação de Sistema",
      data: new Date(2025, 9, 10, 10, 30),
      horario: "10:30",
      status: "Cancelado",
      telefone: "(11) 91234-5678",
    },
    {
      id: 7,
      cliente: "João Santos",
      servico: "Instalação de Sistema",
      data: new Date(2025, 9, 11, 10, 30),
      horario: "10:30",
      status: "Em Andamento",
      telefone: "(11) 91234-5678",
    },
  ]);

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
    start: ag.data,
    end: new Date(ag.data.getTime() + 60 * 60 * 1000),
    resource: ag,
  }));

  const filteredAgendamentos = agendamentos.filter((ag) =>
    ag.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ag.servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ag.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    setDialogOpen(false);
    setFormData({
      cliente: "",
      servico: "",
      data: "",
      horario: "",
      telefone: "",
      status: "Em Andamento",
      observacoes: "",
    });
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
          formData={formData}
          setFormData={setFormData}
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

        {/* Lista de Agendamentos */}
        <Card className="flex-1 overflow-y-auto p-2" style={{ maxHeight: '100vh', minHeight: '100vh' }}>
          <CardHeader className="border-b">
            <CardTitle>Próximos Agendamentos</CardTitle>
            <div className="flex gap-3 mt-4">
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
              <Button size="icon" className={style.botao}>
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className={`flex-1 overflow-y-auto p-4 ${style.scrollAgendamentos}`}>
            <div className="space-y-3">
              {filteredAgendamentos.map((agendamento) => {
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
                        <span>{agendamento.data.toLocaleDateString('pt-BR')} às {agendamento.horario}</span>
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

      {/* Modal de detalhes do evento selecionado */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)} >
          <DialogContent style={{ background: 'var(--background)' }}>
            <DialogHeader >
              <DialogTitle className="border-b pb-4">Detalhes do Agendamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label style={{ color: 'var(--foreground)' }}>Cliente</Label>
                <p className="text-lg font-semibold" style={{ color: 'var(--chart-3)' }}>{selectedEvent.cliente}</p>
              </div>
              <div>
                <Label style={{ color: 'var(--foreground)' }}>Serviço</Label>
                <p style={{ color: 'var(--chart-3)' }}>{selectedEvent.servico}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label style={{ color: 'var(--foreground)' }}>Data</Label>
                  <p style={{ color: 'var(--chart-3)' }}>{selectedEvent.data.toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <Label style={{ color: 'var(--foreground)' }}>Horário</Label>
                  <p style={{ color: 'var(--chart-3)' }}>{selectedEvent.horario}</p>
                </div>
              </div>
              <div>
                <Label style={{ color: 'var(--foreground)' }}>Telefone</Label>
                <p style={{ color: 'var(--chart-3)' }}>{selectedEvent.telefone}</p>
              </div>
              <div>
                <Label style={{ color: 'var(--foreground)' }}>Status</Label>
                <p className="font-bold" style={{ color: getStatusColor(selectedEvent.status).borderLeft }}>{selectedEvent.status}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}