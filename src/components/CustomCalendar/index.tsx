import { useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import "./CustomCalendar.module.css";
import { Button } from "../ui/button";
import { X } from "lucide-react";

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

  const calendarEvents = events.map(ev => {
    const colors = getStatusColor(ev.resource?.status || 'Pendente');
    return {
      id: String(ev.id),
      title: `${ev.resource?.cliente || ev.title}`,
      start: ev.start,
      end: ev.end,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: colors.text,
      extendedProps: {
        ...ev.resource,
        originalEvent: ev
      }
    };
  });

  const sortEventsByTime = (arr: CalendarEvent[]) => {
    return [...arr].sort((a, b) => {
      const at = new Date(a.start).getTime();
      const bt = new Date(b.start).getTime();
      return at - bt;
    });
  };

  const handleEventClick = (info: any) => {
    const originalEvent = info.event.extendedProps.originalEvent;
    onSelectEvent(originalEvent);
  };

  const handleDateClick = (info: any) => {
    const clickedDate = new Date(info.dateStr + 'T00:00:00');
    const dayEvents = events.filter(ev => {
      const evDate = new Date(ev.start);
      return (
        evDate.getDate() === clickedDate.getDate() &&
        evDate.getMonth() === clickedDate.getMonth() &&
        evDate.getFullYear() === clickedDate.getFullYear()
      );
    });

    if (dayEvents.length > 0) {
      const sorted = sortEventsByTime(dayEvents);
      setModalEvents(sorted);
      setModalDateLabel(clickedDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }));
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
              const evDate = new Date(ev.start);
              const evDay = evDate.getDate();
              const evMonth = evDate.getMonth() + 1; // 1-12
              const evYear = evDate.getFullYear();
              return evDay === day && evMonth === month && evYear === year;
            });

            const clickedDate = new Date(year, month - 1, day);

            const sorted = sortEventsByTime(dayEvents);
            setModalEvents(sorted);
            setModalDateLabel(clickedDate.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            }));
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
                        {new Date(ev.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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