import { Calendar, Users, FileText, Clock, TrendingUp, AlertCircle, ChevronUp, ChevronDown, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import type { Page } from "../../App";
import style from './Dashboard.module.css';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const stats = [
    {
      title: "Agendamentos Hoje",
      value: "12",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Clientes Ativos",
      value: "248",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "OS Pendentes",
      value: "8",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Atendimentos em Andamento",
      value: "3",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const recentAppointments = [
    { id: 1, cliente: "Maria Silva", servico: "Manutenção", horario: "09:00", status: "Confirmado" },
    { id: 2, cliente: "João Santos", servico: "Instalação", horario: "10:30", status: "Em Andamento" },
    { id: 3, cliente: "Ana Costa", servico: "Reparo", horario: "14:00", status: "Confirmado" },
    { id: 4, cliente: "Carlos Lima", servico: "Consultoria", horario: "15:30", status: "Pendente" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-green-100 text-green-700";
      case "Em Andamento":
        return "bg-blue-100 text-blue-700";
      case "Pendente":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
    }
  };

  const formattedDate = format(selectedDate, "dd/MM/yyyy", { locale: ptBR });
  const formattedMonth = format(selectedDate, "MMMM", { locale: ptBR }).charAt(0).toUpperCase() + format(selectedDate, "MMMM", { locale: ptBR }).slice(1);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao Horizon - Sistema de Gestão de Atendimentos</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className={style.cardContainer}>
            <CardContent className={style.card_conteudo}>
              <div className={style.card_icone_container}>
                <div className={`${stat.bgColor} ${style.card_icone}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className={style.card_info}>
                <p className={style.card_texto}>{stat.title}</p>
                <h2 className={style.card_valor}>{stat.value}</h2>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Agendamentos de:
              <span className={style.dataFiltrada}> {formattedDate}</span>
            </CardTitle>
            <Button className={style.botao} variant="outline" size="sm" onClick={() => onNavigate("agendamentos")}>
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`${style.itenAgendamento} flex items-center justify-between p-4 rounded-lg`}
                >
                  <div className="flex-1">
                    <p>{appointment.cliente}</p>
                    <p className="text-muted-foreground text-sm">{appointment.servico}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm">{appointment.horario}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader>
            <CardTitle className={style.titulo}>Selecione a Data</CardTitle>
          </CardHeader>
          <CardContent className={style.container_conteudo}>
            <Button
              className={style.alterarData}
              variant="outline"
              onClick={() => handleDateChange(1)}
            >
              <ChevronUp className={style.seta} />
            </Button>

            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <button className={style.data}>
                  {formattedDate}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleCalendarSelect}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>

            <Button
              className={style.alterarData}
              variant="outline"
              onClick={() => handleDateChange(-1)}
            >
              <ChevronDown className={style.seta} />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Desempenho de
              <span className={style.dataFiltrada}> {formattedMonth} </span>
              em relação a
              <span className={style.dataFiltrada}> {formattedMonth} </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-10">
              <div className="flex items-center justify-between pt-5">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <p>Taxa de Conclusão</p>
                    <p className="text-muted-foreground text-sm">Atendimentos finalizados</p>
                  </div>
                </div>
                <span className="text-green-600"><b>92%</b></span>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <div>
                    <p>Taxa de Clientes</p>
                    <p className="text-muted-foreground text-sm">Clientes Novos</p>
                  </div>
                </div>
                <span className="text-blue-600"><b>45%</b></span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-orange-900">8 OS pendentes de conclusão</p>
                  <p className="text-orange-700 text-sm">Requer atenção prioritária</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-900">3 clientes aguardando retorno</p>
                  <p className="text-blue-700 text-sm">Contato pendente</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}