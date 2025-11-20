import { useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Button } from "../../ui/button";
import { X } from "lucide-react";
import { formatarData } from '../../../utils/formatarData';
import styles from "./CustomCalendar.module.css";

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

export function CustomCalendar({ events, onSelectEvent, getStatusColor }: CustomCalendarProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvents, setModalEvents] = useState<CalendarEvent[] | null>(null);
  const [modalDateLabel, setModalDateLabel] = useState<string>("");

  const getTimeValue = (horario: string): number => {
    if (!horario) return 0;
    const [hours, minutes] = horario.split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  };

  const sortedEvents = [...events].sort((a, b) => {
    const horaA = a.resource?.horario || '00:00';
    const horaB = b.resource?.horario || '00:00';
    return getTimeValue(horaA) - getTimeValue(horaB);
  });

  const calendarEvents = sortedEvents.map((ev, index) => {
    const colors = getStatusColor(ev.resource?.status || 'Pendente');

    const startDateStr = typeof ev.start === 'string' ? ev.start : ev.start.toISOString().split('T')[0];
    const [year, month, day] = startDateStr.split('-').map(Number);

    const localStart = new Date(year, month - 1, day);

    const timeValue = getTimeValue(ev.resource?.horario || '00:00');

    return {
      id: String(ev.id),
      title: `${ev.resource?.cliente || ev.title}`,
      start: localStart,
      end: localStart,
      allDay: true,
      order: timeValue,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: colors.text,
      extendedProps: {
        ...ev.resource,
        originalEvent: ev,
        timeValue: timeValue
      }
    };
  });

  const sortEventsByTime = (arr: CalendarEvent[]) => {
    return [...arr].sort((a, b) => {
      const horaA = a.resource?.horario || '00:00';
      const horaB = b.resource?.horario || '00:00';
      return getTimeValue(horaA) - getTimeValue(horaB);
    });
  };

  const handleEventClick = (info: any) => {
    const originalEvent = info.event.extendedProps.originalEvent;
    onSelectEvent(originalEvent);
  };

  const handleDateClick = (info: any) => {
    const [year, month, day] = info.dateStr.split('-').map(Number);
    const clickedDate = new Date(year, month - 1, day);

    const dayEvents = events.filter(ev => {
      const [evYear, evMonth, evDay] = ev.start.toISOString().split('T')[0].split('-').map(Number);
      const evDate = new Date(evYear, evMonth - 1, evDay);
      return (
        evDate.getDate() === clickedDate.getDate() &&
        evDate.getMonth() === clickedDate.getMonth() &&
        evDate.getFullYear() === clickedDate.getFullYear()
      );
    });

    if (dayEvents.length > 0) {
      const sorted = sortEventsByTime(dayEvents);
      setModalEvents(sorted);

      const dataFormatada = formatarData(info.dateStr);
      const [d, m, y] = dataFormatada.split('/');
      const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      const monthName = meses[parseInt(m) - 1];
      const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      setModalDateLabel(`${d} de ${capitalizedMonth} de ${y}`);

      setModalOpen(true);
    }
  };

  const handleSelectEventInModal = (ev: CalendarEvent) => {
    setModalOpen(false);
    setModalEvents(null);
    onSelectEvent(ev);
  };

  return (
    <>
      <div className="fullcalendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={ptBrLocale}
          events={calendarEvents}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="auto"
          aspectRatio={1.8}
          eventOrder="order"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          buttonText={{
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia'
          }}
          dayMaxEvents={2}
          moreLinkText={(num) => `+${num} agendamentos`}
          moreLinkClick={(info) => {
            const dateStr = info.date.toISOString().split('T')[0];
            const [year, month, day] = dateStr.split('-').map(Number);

            const dayEvents = events.filter(ev => {
              const [evYear, evMonth, evDay] = ev.start.toISOString().split('T')[0].split('-').map(Number);
              const evDate = new Date(evYear, evMonth - 1, evDay);
              return evDate.getDate() === day && evDate.getMonth() === month - 1 && evDate.getFullYear() === year;
            });

            const sorted = sortEventsByTime(dayEvents);
            setModalEvents(sorted);

            const dataFormatada = formatarData(dateStr);
            const [d, m, y] = dataFormatada.split('/');
            const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
              'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
            const monthName = meses[parseInt(m) - 1];
            const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
            setModalDateLabel(`${d} de ${capitalizedMonth} de ${y}`);

            setModalOpen(true);
            return 'none';
          }}

          eventContent={(eventInfo) => {
            const bgColor = eventInfo.event.backgroundColor;
            const textColor = eventInfo.event.textColor;
            const servico = eventInfo.event.extendedProps.servico;

            return (
              <div style={{
                backgroundColor: bgColor,
                color: textColor,
                padding: '4px 6px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                {eventInfo.event.title}
                {servico && (
                  <span style={{ opacity: 0.8 }}> - {servico}</span>
                )}
              </div>
            );
          }}
        />
      </div>

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
              <Button onClick={() => setModalOpen(false)}> <X className="text-red-500 size-5" /> </Button>
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
                      <div style={{ fontSize: '0.82rem', opacity: 0.8 }}>
                        {ev.resource?.horario || '00:00'}
                      </div>
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