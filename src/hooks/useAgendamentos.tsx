import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
    try {
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

      toast.success('Agendamento criado com sucesso!', {
        description: `Cliente: ${data.cliente}`,
      });
    } catch (error) {
      toast.error('Erro ao criar agendamento!');
    }
  };

  const updateAgendamento = (data: any) => {
    try {
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

      toast.success('Agendamento atualizado!', {
        description: `Cliente: ${data.cliente}`,
      });
    } catch (error) {
      toast.error('Erro ao atualizar agendamento!');
    }
  };

  const deleteAgendamento = (id: number, nomeCliente: string) => {
    try {
      setAgendamentos(prev => prev.filter(ag => ag.id !== id));
      toast.success('Agendamento excluído!', {
        description: `Cliente: ${nomeCliente}`,
      });
    } catch (error) {
      toast.error('Erro ao excluir agendamento!');
    }
  }

  return {
    agendamentos,
    addAgendamento,
    updateAgendamento,
    deleteAgendamento
  };
}