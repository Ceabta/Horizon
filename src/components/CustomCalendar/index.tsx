import React, { useMemo, useState } from "react";
import { Calendar, momentLocalizer, type View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CustomCalendar.module.css";

moment.updateLocale("en", {
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
  const goToBack = () => toolbar.onNavigate('PREV');
  const goToNext = () => toolbar.onNavigate('NEXT');
  const goToToday = () => toolbar.onNavigate('TODAY');
  const label = () => moment(toolbar.date).format('MMMM YYYY');

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
  const [view, setView] = useState<View>('month');

  // Modal state para mostrar todos eventos do dia
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvents, setModalEvents] = useState<CalendarEvent[] | null>(null);
  const [modalDateLabel, setModalDateLabel] = useState<string>("");

  const dayKey = (date: Date) => moment(date).startOf('day').toISOString();

  const displayEvents = useMemo(() => {
    if (view !== 'month') return events;

    const groups: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
      const k = dayKey(ev.start);
      if (!groups[k]) groups[k] = [];
      groups[k].push(ev);
    }

    const result: CalendarEvent[] = [];
    Object.entries(groups).forEach(([k, group]) => {
      // ordenar pelo início (mais cedo primeiro)
      group.sort((a, b) => moment(a.start).valueOf() - moment(b.start).valueOf());

      if (group.length >= 3) { // ou >=3 dependendo da lógica que você quer
        const [first, ...rest] = group;
        const representative: CalendarEvent = {
          ...first,
          resource: {
            ...first.resource,
            hiddenCount: rest.length,
            extraEvents: rest,
            isRepresentative: true,
            dayKey: k
          }
        };
        result.push(representative);
      } else {
        group.forEach(e => result.push(e));
      }
    });

    return result;
  }, [events, view]);


  // Estilo do evento (mantive em TS para compatibilidade)
  // eventStyleGetter — menos padding, sem marginBottom
  const eventStyleGetter = (event: { resource: { status: string } }) => {
    const colors = getStatusColor(event.resource.status);
    return {
      style: {
        backgroundColor: colors.bg,
        // borda esquerda removida conforme você pediu antes
        color: colors.text,
        border: 'none',
        borderRadius: '6px',
        padding: '4px 6px',    // reduzido
        fontSize: '0.82rem',   // reduzido
        marginBottom: '4px',   // bem menor
        boxShadow: 'none',
        whiteSpace: 'normal',  // permite quebra de linha em títulos longos
        overflow: 'visible'
      }
    };
  };


  // Abre modal com todos os eventos do dia
  const openModalWithDay = (dayKeyIso: string, preloadedEvents?: CalendarEvent[]) => {
    const fullDayEvents = preloadedEvents
      ? preloadedEvents.slice() // já devem vir ordenados, mas copia para segurança
      : events.filter(ev => dayKey(ev.start) === dayKeyIso).slice()
        .sort((a, b) => moment(a.start).valueOf() - moment(b.start).valueOf());

    setModalEvents(fullDayEvents);
    setModalDateLabel(moment(dayKeyIso).format('DD [de] MMMM YYYY'));
    setModalOpen(true);
  };

  // Clique no nome (card principal) - agora sempre seleciona o evento
  const handleNameClick = (event: CalendarEvent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onSelectEvent(event);
  };

  // Clicar no evento dentro do modal
  const handleSelectEventInModal = (ev: CalendarEvent) => {
    setModalOpen(false);
    setModalEvents(null);
    onSelectEvent(ev);
  };

  // Card que aparece na célula do mês
  const EventCard = ({ event }: { event: CalendarEvent }) => {
    const colors = getStatusColor(event.resource?.status);
    const isRep = Boolean(event.resource?.isRepresentative);

    // Construir título em uma linha "Nome do cliente - Tarefa"
    const titleLine = `${event.resource?.cliente ?? event.title}${event.resource?.servico ? ' - ' + event.resource.servico : ''}`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} onClick={(e) => e.stopPropagation()}>
        {/* Nome - Tarefa (clique só nele abre seleção) */}
        <div
          onClick={(e) => handleNameClick(event, e)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleNameClick(event); }}
          style={{
            backgroundColor: colors.bg,
            // borderLeft removido
            padding: '6px 8px',
            borderRadius: 6,
            color: colors.text,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 160 // evita quebrar muito na célula
          }}
          title={titleLine}
        >
          <div style={{ fontSize: '0.9rem' }}>{titleLine}</div>
        </div>

        {/* +X agendamentos em linha separada, se for representante */}
        {isRep && typeof event.resource.hiddenCount === 'number' && (
          <div
            onClick={(e) => {
              e.stopPropagation(); // evita disparar clique no calendário / overlay nativo
              if (event.resource?.dayKey) openModalWithDay(event.resource.dayKey, event.resource.extraEvents);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); if (event.resource?.dayKey) openModalWithDay(event.resource.dayKey); } }}
            style={{
              // visual compacto para caber inteiro
              backgroundColor: 'transparent',
              border: `1px solid ${colors.border}`,
              padding: '4px 6px',
              borderRadius: 6,
              color: colors.text,
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              alignSelf: 'flex-start',
              minWidth: 'auto',
              lineHeight: '1rem'
            }}
            title={`+${event.resource.hiddenCount} agendamentos`}
          >
            +{event.resource.hiddenCount} agendamentos
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        events={displayEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        messages={messages}
        eventPropGetter={eventStyleGetter}
        // removi o uso direto de onSelectEvent aqui para evitar conflitos com nossos stopPropagation
        onSelectEvent={(ev: any) => {
          // Só repassamos quando o evento for selecionado fora do mês (week/day) ou se necessário
          // Se quiser, deixar this function como antes; stopPropagation() nos elementos evita duplo disparo
          onSelectEvent(ev);
        }}
        onView={(v: View) => setView(v)}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        popup={false} // importante: desativa overlay nativo que estava abrindo junto com o nosso modal
        formats={formats}
        components={{
          toolbar: CustomToolbar,
          event: ({ event }: any) => {
            if (view === 'month') {
              return <EventCard event={event} />;
            }
            // render simples para week/day/agenda
            const colors = getStatusColor(event.resource?.status);
            const titleLine = `${event.resource?.cliente ?? event.title}${event.resource?.servico ? ' - ' + event.resource.servico : ''}`;
            return (
              <div style={{
                backgroundColor: colors.bg,
                padding: '6px 8px',
                borderRadius: 6,
                color: colors.text,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                <div style={{ fontSize: '0.92rem' }}>{titleLine}</div>
              </div>
            );
          }
        }}
      />

      {/* Modal simples para listar todos os eventos do dia */}
      {modalOpen && modalEvents && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.45)',
            zIndex: 9999
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(720px, 95%)',
              maxHeight: '80vh',
              overflowY: 'auto',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 16,
              boxShadow: '0 6px 18px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <strong style={{ fontSize: '1.05rem' }}>Agendamentos — {modalDateLabel}</strong>
              <button onClick={() => setModalOpen(false)} style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                padding: '6px 10px',
                borderRadius: 6,
                cursor: 'pointer'
              }}>Fechar</button>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              {modalEvents.map(ev => {
                const colors = getStatusColor(ev.resource?.status);
                return (
                  <div
                    key={ev.id}
                    onClick={() => handleSelectEventInModal(ev)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: colors.bg,
                      padding: '10px',
                      borderRadius: 8,
                      color: colors.text,
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{ev.resource?.cliente ?? ev.title}</div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.95 }}>{ev.resource?.servico}</div>
                      <div style={{ fontSize: '0.82rem', opacity: 0.8 }}>{moment(ev.start).format('HH:mm')}</div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 90 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{ev.resource?.status}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
