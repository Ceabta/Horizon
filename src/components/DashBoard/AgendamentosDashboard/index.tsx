import { ChevronUp, ChevronDown, TrendingUp, UserPlus, AlertCircle, Clock, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { useTheme } from "../../../hooks/theme-context";
import { useAgendamentos } from "../../../hooks/useAgendamentos";
import { getStatusColor } from "../../../utils/getStatusColor";
import { formatarData } from '../../../utils/formatarData';
import style from './AgendamentosDashboard.module.css';
import { Tag } from "../../Tag";

interface AgendamentosDashboardProps {
  onVerTodos: () => void;
}

export function AgendamentosDashboard({ onVerTodos }: AgendamentosDashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { agendamentos } = useAgendamentos();

  const { theme } = useTheme();

  const selectedDateString = selectedDate.toISOString().split('T')[0];

  const filteredAgendamentos = agendamentos.filter((ag) =>
    ag.data.includes(selectedDateString)
  );

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
            <CardTitle className="font-semibold">
              Agendamentos de:
              <span className={style.dataFiltrada}> {formattedDate}</span>
            </CardTitle>
            <Button className="botao" variant="outline" size="sm" onClick={onVerTodos}>
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAgendamentos.length > 0 ? (
                filteredAgendamentos.map((agendamento) => {
                  const colors = getStatusColor(agendamento.status);
                  return (
                    <div
                      key={agendamento.id}
                      className="itemAgendamento"
                      style={{
                        borderLeft: `4px solid ${colors.borderLeft}`,
                        transition: 'all 0.3s ease'
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
                        <Tag status={agendamento.status}/>
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
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`text-center mt-7 font-semibold ${style.itemAgendamento}`}><h1>Não há agendamentos para hoje.</h1></div>
              )}
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