import { Calendar as CalendarIcon, ChevronUp, ChevronDown, TrendingUp, UserPlus, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { useTheme } from "../../hooks/theme-context";
import style from './AgendamentosDashboard.module.css';

interface Appointment {
  id: number;
  cliente: string;
  servico: string;
  horario: string;
  status: string;
}

interface AgendamentosDashboardProps {
  appointments: Appointment[];
  onVerTodos: () => void;
}

export function AgendamentosDashboard({ appointments, onVerTodos }: AgendamentosDashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { theme } = useTheme();

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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Agendamentos de:
              <span className={style.dataFiltrada}> {formattedDate}</span>
            </CardTitle>
            <Button className={style.botao} variant="outline" size="sm" onClick={onVerTodos}>
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`${style.itenAgendamento} flex items-center justify-between p-4 rounded-lg`}
                >
                  <div className="flex-1">
                    <p style={{ color: 'var(--foreground)' }}>{appointment.cliente}</p>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-300/50" : "text-gray-800/50"}`}>
                      {appointment.servico}
                    </p>
                  </div>
                  <div className="flex-col justify-items-end">
                    <div className="mb-2">
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                        {appointment.horario}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs" style={getStatusColor(appointment.status)}>
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
                <Calendar
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
                    <p style={{ color: 'var(--foreground)' }}>Taxa de Conclusão</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Atendimentos finalizados
                    </p>
                  </div>
                </div>
                <span className="text-green-600"><b>92%</b></span>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-blue-500" />
                  <div>
                    <p style={{ color: 'var(--foreground)' }}>Taxa de Clientes</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Clientes Novos
                    </p>
                  </div>
                </div>
                <span className="text-blue-500"><b>45%</b></span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Alertas até:
              <span className={style.dataFiltrada}> {formattedDate}</span>  
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg border" style={{ backgroundColor: "var(--card3-bg)", borderColor: "var(--card3-icon)" }}>
                <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: "var(--card3-icon)" }} />
                <div>
                  <p className={`${theme === 'light' ? "text-orange-900" : "text-orange-100"}`}>
                    8 OS pendentes de conclusão
                  </p>
                  <p className="text-sm" style={{ color: "var(--card3-icon)" }}>
                    Requer atenção prioritária
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border" style={{ backgroundColor: "var(--card1-bg)", borderColor: "var(--card1-icon)" }}>
                <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: "var(--card1-icon)" }} />
                <div>
                  <p className={`${theme === 'light' ? "text-blue-900" : "text-blue-50"}`}>
                    Contato pendente
                  </p>
                  <p className="text-sm" style={{ color: "var(--card1-icon)" }}>
                    3 clientes aguardando retorno
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}