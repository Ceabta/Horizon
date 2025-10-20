import { useState, useEffect } from 'react';
import agendamentosData from '../data/agendamentos.json';

interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  data: string;
  horario: string;
  status: string;
  telefone: string;
  observacoes?: string;
}

export function useAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('agendamentos');
    if (stored) {
      setAgendamentos(JSON.parse(stored));
    } else {
      setAgendamentos(agendamentosData);
    }
  }, []);

  useEffect(() => {
    if (agendamentos.length > 0) {
      localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    }
  }, [agendamentos]);

  const addAgendamento = (data: any) => {
    const novoId = Math.max(...agendamentos.map(ag => ag.id), 0) + 1;
    const novoAgendamento = {
      id: novoId,
      cliente: data.cliente,
      servico: data.servico,
      data: data.data + 'T' + data.horario,
      horario: data.horario,
      telefone: data.telefone,
      status: data.status,
      observacoes: data.observacoes || ''
    };
    setAgendamentos(prev => [...prev, novoAgendamento]);
  };

  const updateAgendamento = (data: any) => {
    setAgendamentos(prev => prev.map(ag =>
      ag.id === data.id
        ? {
            ...ag,
            cliente: data.cliente,
            servico: data.servico,
            data: data.data + 'T' + data.horario,
            horario: data.horario,
            telefone: data.telefone,
            status: data.status,
            observacoes: data.observacoes || ''
          }
        : ag
    ));
  };

  const deleteAgendamento = (id: number) => {
    setAgendamentos(prev => prev.filter(ag => ag.id !== id));
  };

  return {
    agendamentos,
    addAgendamento,
    updateAgendamento,
    deleteAgendamento
  };
}