import { Calendar, Users, FileText, Clock, TrendingUp, AlertCircle, ChevronUp, ChevronDown, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Calendar as CalendarComponent } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { format, subMonths } from "date-fns";
import { ptBR, se } from "date-fns/locale";
import { useState } from "react";
import { useTheme } from "../../hooks/theme-context";
import type { Page } from "../../App";
import style from './Dashboard.module.css';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { theme } = useTheme();

  const stats = [
    {
      title: "Agendamentos Hoje",
      value: "12",
      icon: Calendar,
      color: "--card1-icon",
      bgColor: "--card1-bg",
    },
    {
      title: "Clientes Ativos",
      value: "248",
      icon: Users,
      color: "--card2-icon",
      bgColor: "--card2-bg",
    },
    {
      title: "OS Pendentes",
      value: "8",
      icon: FileText,
      color: "--card3-icon",
      bgColor: "--card3-bg",
    },
    {
      title: "Atendimentos em Andamento",
      value: "3",
      icon: Clock,
      color: "--card4-icon",
      bgColor: "--card4-bg",
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
        return { backgroundColor: "var(--card1-bg)", color: "var(--card1-icon)" };
      case "Em Andamento":
        return { backgroundColor: "var(--card2-bg)", color: "var(--card2-icon)" };
      case "Pendente":
        return { backgroundColor: "var(--card3-bg)", color: "var(--card3-icon)" };
      default:
        return { backgroundColor: "var(--card4-bg)", color: "var(--card4-icon)" };
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
  const previousMonth = subMonths(selectedDate, 1);

  const formattedMonth = format(selectedDate, "MMMM", { locale: ptBR }).charAt(0).toUpperCase() + format(selectedDate, "MMMM", { locale: ptBR }).slice(1);
  const monthNamePrev = format(previousMonth, "MMMM", { locale: ptBR });
  const formattedPreviousMonth = monthNamePrev.charAt(0).toUpperCase() + monthNamePrev.slice(1);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Dashboard</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Bem-vindo ao Horizon - Sistema de Gestão de Atendimentos</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className={style.cardContainer}>
            <CardContent className={style.card_conteudo}>
              <div className={style.card_icone_container}>
                <div className={`${style.card_icone}`} style={{ backgroundColor: `var(${stat.bgColor})` }}>
                  <stat.icon className="w-6 h-6" style={{ color: `var(${stat.color})` }} />
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
                    <p className = {`text-sm ${theme === "dark" ? "text-gray-300/50" : "text-gray-800/50"}`}>{appointment.servico}</p>
                  </div>
                  <div className="flex-col justify-items-end">
                    <div className="mb-2">
                      <p className="text-sm font-bold">{appointment.horario}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs " style={getStatusColor(appointment.status)}>
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
              <span className={style.dataFiltrada}> {formattedPreviousMonth} </span>
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
                  <UserPlus className="w-5 h-5 text-blue-500" />
                  <div>
                    <p>Taxa de Clientes</p>
                    <p className="text-muted-foreground text-sm">Clientes Novos</p>
                  </div>
                </div>
                <span className="text-blue-500"><b>45%</b></span>
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
              <div className="flex items-start gap-3 p-3  rounded-lg border" style={{ backgroundColor: "var(--card3-bg)", borderColor: "var(--card3-icon)" }}>
                <AlertCircle className="w-5 h-5  mt-0.5" style={{ color: "var(--card3-icon)" }} />
                <div>
                  <p className={`${theme === 'light' ? "text-orange-900" : "text-orange-100"}`}>8 OS pendentes de conclusão</p>
                  <p className="text-sm" style={{ color: "var(--card3-icon)" }}>Requer atenção prioritária</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3  rounded-lg border" style={{ backgroundColor: "var(--card1-bg)", borderColor: "var(--card1-icon)" }}>
                <AlertCircle className="w-5 h-5  mt-0.5" style={{ color: "var(--card1-icon)" }} />
                <div>
                  <p className={`${theme === 'light' ? "text-blue-900" : "text-blue-50"}`}>Contato pendente</p>
                  <p className="text-sm" style={{ color: "var(--card1-icon)" }}>3 clientes aguardando retorno</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}