import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CustomCalendar.module.css';

moment.updateLocale('en', {
  months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  weekdaysMin: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Sx', 'Sa']
});

const localizer = momentLocalizer(moment);

const messages = {
  allDay: 'Dia inteiro',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Não há agendamentos neste período.',
  showMore: (total: any) => `+ ${total} mais`,
};

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: any;
}

interface CustomCalendarProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  getStatusColor: (status: string) => {
    bg: string;
    border: string;
    text: string;
    borderLeft: string;
  };
}

const CustomToolbar = (toolbar: any) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToToday = () => {
    toolbar.onNavigate('TODAY');
  };

  const label = () => {
    const date = toolbar.date;
    return moment(date).format('MMMM YYYY');
  };

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={goToBack}>Anterior</button>
        <button type="button" onClick={goToToday}>Hoje</button>
        <button type="button" onClick={goToNext}>Próximo</button>
      </span>
      <span className="rbc-toolbar-label">{label()}</span>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => toolbar.onView('month')}>Mês</button>
        <button type="button" onClick={() => toolbar.onView('week')}>Semana</button>
        <button type="button" onClick={() => toolbar.onView('day')}>Dia</button>
        <button type="button" onClick={() => toolbar.onView('agenda')}>Agenda</button>
      </span>
    </div>
  );
};

const formats = {
  dayHeaderFormat: (date: Date) => {
    const weekday = moment(date).format('ddd');
    const day = moment(date).format('DD');
    const month = moment(date).format('MMM');
    return `${weekday} - ${day} ${month}.`;
  },
  dayRangeHeaderFormat: ({ start }: any) => {
    const weekday = moment(start).format('ddd');
    const day = moment(start).format('DD');
    const month = moment(start).format('MMM');
    return `${weekday} - ${day} ${month}.`;
  },
};

export function CustomCalendar({ events, onSelectEvent, getStatusColor }: CustomCalendarProps) {
  const CustomEvent = ({ event }: any) => {
    const colors = getStatusColor(event.resource.status);
    return (
      <div style={{
        backgroundColor: colors.bg,
        borderLeft: `4px solid ${colors.border}`,
        padding: '6px 10px',
        borderRadius: '6px',
        color: colors.text,
        border: 'none',
        fontWeight: '500'
      }}>
        <strong>{event.resource.cliente}</strong> - {event.resource.servico}
      </div>
    );
  };

  const eventStyleGetter = (event: { resource: { status: string } }) => {
    const colors = getStatusColor(event.resource.status);
    return {
      style: {
        backgroundColor: colors.bg,
        borderLeft: `4px solid ${colors.border}`,
        color: colors.text,
        border: 'none',
        borderRadius: '4px',
        padding: '2px 6px',
        fontSize: '0.875rem',
        marginBottom: '10px',
      }
    };
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: '100%' }}
      messages={messages}
      eventPropGetter={eventStyleGetter}
      onSelectEvent={onSelectEvent}
      views={['month', 'week', 'day', 'agenda']}
      defaultView="month"
      popup
      formats={formats}
      components={{
        toolbar: CustomToolbar,
        event: CustomEvent
      }}
    />
  );
}