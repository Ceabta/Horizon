import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    cliente: "",
    servico: "",
    data: "",
    horario: "",
    telefone: "",
    observacoes: "",
  });

  const [agendamentos] = useState<Agendamento[]>([
    {
      id: 1,
      cliente: "Maria Silva",
      servico: "Manutenção Preventiva",
      data: new Date(2025, 9, 10),
      horario: "09:00",
      status: "Confirmado",
      telefone: "(11) 98765-4321",
    },
    {
      id: 2,
      cliente: "João Santos",
      servico: "Instalação de Sistema",
      data: new Date(2025, 9, 10),
      horario: "10:30",
      status: "Em Andamento",
      telefone: "(11) 91234-5678",
    },
    {
      id: 3,
      cliente: "Ana Costa",
      servico: "Reparo de Equipamento",
      data: new Date(2025, 9, 10),
      horario: "14:00",
      status: "Confirmado",
      telefone: "(11) 93456-7890",
    },
    {
      id: 4,
      cliente: "Carlos Lima",
      servico: "Consultoria Técnica",
      data: new Date(2025, 9, 11),
      horario: "15:30",
      status: "Pendente",
      telefone: "(11) 92345-6789",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-green-100 text-green-700 border-green-200";
      case "Em Andamento":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pendente":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Cancelado":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredAgendamentos = agendamentos.filter((ag) =>
    ag.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ag.servico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // toast.success("Agendamento criado com sucesso!");
    setDialogOpen(false);
    setFormData({
      cliente: "",
      servico: "",
      data: "",
      horario: "",
      telefone: "",
      observacoes: "",
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Agendamentos</h1>
          <p className="text-muted-foreground">Gerencie os agendamentos de atendimento</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input
                    id="cliente"
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                    placeholder="Nome do cliente"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="servico">Serviço</Label>
                <Select
                  value={formData.servico}
                  onValueChange={(value: any) => setFormData({ ...formData, servico: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manutencao">Manutenção Preventiva</SelectItem>
                    <SelectItem value="instalacao">Instalação de Sistema</SelectItem>
                    <SelectItem value="reparo">Reparo de Equipamento</SelectItem>
                    <SelectItem value="consultoria">Consultoria Técnica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario">Horário</Label>
                  <Input
                    id="horario"
                    type="time"
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Informações adicionais sobre o agendamento"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Agendamento</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lista de Agendamentos</CardTitle>
            <div className="flex gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredAgendamentos.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="p-4 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4>{agendamento.cliente}</h4>
                      <p className="text-muted-foreground text-sm">{agendamento.servico}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(agendamento.status)}`}>
                      {agendamento.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{agendamento.data.toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⏰</span>
                      <span>{agendamento.horario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <span>{agendamento.telefone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
