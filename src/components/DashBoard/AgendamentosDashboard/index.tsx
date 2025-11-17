import { ChevronUp, ChevronDown, Clock, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { getStatusColor } from "../../../utils/getStatusColor";
import { formatarData, obterDataLocal } from '../../../utils/formatarData';
import { Tag } from "../../Tag";
import { useAgendamentos } from "../../../hooks/useAgendamentos";
import { useOrdemServico } from "../../../hooks/useOrdemServico";
import { DesempenhoMensal } from "../DesempenhoMensal";
import { AlertasDashboard } from "../AlertasDashboard";
import style from './AgendamentosDashboard.module.css';
import { useClientes } from "../../../hooks/useClientes";

function toStartOfLocalDayFromAny(dateInput?: string | Date): Date | null {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    const d = new Date(dateInput);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  const s = String(dateInput);
  if (s.includes('T')) {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  }
  const parts = s.split('-');
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
  return new Date(y, m - 1, d);
}

export function AgendamentosDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { agendamentos } = useAgendamentos();
  const { clientes } = useClientes();
  const { ordensServico } = useOrdemServico();

  const selectedDateString = obterDataLocal(selectedDate);

  const selectedDateStart = new Date(selectedDate);
  selectedDateStart.setHours(0, 0, 0, 0);

  const currentMonthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const currentMonthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59);

  const previousMonthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
  const previousMonthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0, 23, 59, 59);

  const clientesMesAtual = clientes.filter(cliente => {
    if (!cliente.created_at) return false;
    const clienteDate = new Date(cliente.created_at);
    return clienteDate >= currentMonthStart && clienteDate <= currentMonthEnd;
  }).length;

  const clientesMesAnterior = clientes.filter(cliente => {
    if (!cliente.created_at) return false;
    const clienteDate = new Date(cliente.created_at);
    return clienteDate >= previousMonthStart && clienteDate <= previousMonthEnd;
  }).length;

  const diferencaClientes = clientesMesAtual - clientesMesAnterior;
  const percentualCliente = clientesMesAnterior > 0
    ? ((diferencaClientes / clientesMesAnterior) * 100).toFixed(2)
    : clientesMesAtual > 0 ? 100 : 0;

  const OSMesAtual = ordensServico.filter(os => {
    if (!os.agendamento?.data) return false;

    const agendamentoDate = new Date(os.agendamento.data);

    return agendamentoDate >= currentMonthStart && agendamentoDate <= currentMonthEnd && os.status === 'Concluída';
  }).length;

  const OSMesAnterior = ordensServico.filter(os => {
    if (!os.agendamento?.data) return false;

    const agendamentoDate = new Date(os.agendamento.data);

    return agendamentoDate >= previousMonthStart && agendamentoDate <= previousMonthEnd && os.status === 'Concluída';
  }).length;

  const diferencaOS = OSMesAtual - OSMesAnterior;
  const percentualOS = OSMesAnterior > 0
    ? ((diferencaOS / OSMesAnterior) * 100).toFixed(2)
    : OSMesAtual > 0 ? 100 : 0;

  const osPendentes = ordensServico.filter(os => {
    if (os.status !== 'Pendente') return false;
    const agDataStr = os.agendamento?.data;
    if (!agDataStr) return false;
    const agDate = toStartOfLocalDayFromAny(agDataStr);
    if (!agDate) return false;
    return agDate.getTime() <= selectedDateStart.getTime();
  }).length;

  const filteredAgendamentos = agendamentos.filter((ag) =>
    ag.data === selectedDateString
  );

  const OSValorMesAtual = ordensServico.filter(os => {
    if (!os.agendamento?.data) return false;

    const agendamentoDate = new Date(os.agendamento.data);

    return agendamentoDate >= currentMonthStart && agendamentoDate <= currentMonthEnd;
  }).reduce((acc, item) => acc + item.valor, 0);

  const OSValorMesAnterior = ordensServico.filter(os => {
    if (!os.agendamento?.data) return false;

    const agendamentoDate = new Date(os.agendamento.data);

    return agendamentoDate >= previousMonthStart && agendamentoDate <= previousMonthEnd;
  }).reduce((acc, item) => acc + item.valor, 0);

  const diferencaValorOS = OSValorMesAtual - OSValorMesAnterior;
  const percentualValorOS = OSValorMesAnterior > 0
    ? ((diferencaValorOS / OSValorMesAnterior) * 100).toFixed(2)
    : OSValorMesAtual > 0 ? 100 : 0;

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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-semibold">
              Agendamentos de:
              <span className={style.dataFiltrada}> {formattedDate}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
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
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`text-center mt-7 font-semibold ${style.itemAgendamento}`}>
                  <h1>Não há agendamentos para esta data.</h1>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader>
            <CardTitle className={style.titulo}>Selecione a Data</CardTitle>
          </CardHeader>
          <CardContent className={style.container_conteudo}>
            <div className={style.controles_data}>
              <Button
                className={style.alterarData_lateral}
                variant="outline"
                onClick={() => handleDateChange(-1)}
              >
                <ChevronDown className={style.seta} />
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
                    defaultMonth={selectedDate}
                    modifiers={{
                      today: new Date()
                    }}
                    modifiersStyles={{
                      today: {
                        backgroundColor: 'var(--chart-3)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '50%'
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>

              <Button
                className={style.alterarData_lateral}
                variant="outline"
                onClick={() => handleDateChange(1)}
              >
                <ChevronUp className={style.seta} />
              </Button>
            </div>

            <Button
              className={style.btnHoje}
              variant="outline"
              onClick={() => setSelectedDate(new Date())}
            >
              Hoje
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <DesempenhoMensal
          selectedDate={selectedDate}
          percentualCliente={Number(percentualCliente)}
          percentualOS={Number(percentualOS)}
          percentualValorOS={Number(percentualValorOS)}
          clientesMesAtual={clientesMesAtual}
          clientesMesAnterior={clientesMesAnterior}
          OSMesAtual={OSMesAtual}
          OSMesAnterior={OSMesAnterior}
          OSValorMesAtual={OSValorMesAtual}
          OSValorMesAnterior={OSValorMesAnterior}
        />
        <AlertasDashboard
          formattedDate={formattedDate}
          osPendentes={osPendentes}
        />
      </div>
    </>
  );
}