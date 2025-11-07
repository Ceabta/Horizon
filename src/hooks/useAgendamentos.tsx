import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgendamentos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes!agendamentos_cliente_id_fkey (nome, telefone),
          servicos!agendamentos_servico_id_fkey (descricao)
        `)
        .order('data', { ascending: true })
        .order('horario', { ascending: true })

      if (error) throw error

      const formatted = (data || []).map(ag => {
        const [year, month, day] = ag.data.split('-');
        const dataCorreta = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        return {
          id: ag.id,
          cliente_id: ag.cliente_id || 0,
          cliente: ag.clientes?.nome || 'Cliente não encontrado',
          servico: ag.servicos?.descricao || 'Serviço não encontrado',
          data: dataCorreta.toISOString().split('T')[0],
          horario: ag.horario ? ag.horario.substring(0, 5) : '00:00',
          status: ag.status,
          telefone: ag.clientes?.telefone || '',
          observacoes: ag.observacoes,
          os_gerada: ag.os_gerada
        }
      })

      setAgendamentos(formatted)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar agendamentos:', err)
    } finally {
      setLoading(false)
    }
  };

  const addAgendamento = async (agendamento: any) => {
    try {
      let clienteId
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id')
        .eq('nome', agendamento.cliente)
        .single()

      if (clienteExistente) {
        clienteId = clienteExistente.id
      } else {
        const { data: novoCliente, error } = await supabase
          .from('clientes')
          .insert([{
            nome: agendamento.cliente,
            telefone: agendamento.telefone,
            email: agendamento.email || '',
            status: 'Ativo'
          }])
          .select()
          .single()

        if (error) throw error
        clienteId = novoCliente.id
      }

      const { data: servico } = await supabase
        .from('servicos')
        .select('id')
        .eq('descricao', agendamento.servico)
        .single()

      if (!servico) throw new Error('Serviço não encontrado')

      const { error } = await supabase
        .from('agendamentos')
        .insert([{
          cliente_id: clienteId,
          servico_id: servico.id,
          data: agendamento.data.toISOString().split('T')[0],
          horario: agendamento.horario,
          status: agendamento.status || 'Em Andamento',
          observacoes: agendamento.observacoes
        }])

      if (error) throw error

      await fetchAgendamentos()
      return { success: true }
    } catch (err: any) {
      console.error('Erro ao adicionar agendamento:', err)
      return { success: false, error: err.message }
    }
  };

  const updateAgendamento = async (agendamento: any) => {
    try {
      let clienteId = agendamento.cliente_id;

      const { data: cliente } = await supabase
        .from('clientes')
        .select('id')
        .eq('nome', agendamento.cliente)
        .single();

      if (cliente) {
        clienteId = cliente.id;
      }

      const { data: servico } = await supabase
        .from('servicos')
        .select('id')
        .eq('descricao', agendamento.servico)
        .single();

      if (!servico) throw new Error('Serviço não encontrado');

      const { error } = await supabase
        .from('agendamentos')
        .update({
          cliente_id: clienteId,
          servico_id: servico.id,
          data: agendamento.data.toISOString().split('T')[0],
          horario: agendamento.horario,
          status: agendamento.status,
          observacoes: agendamento.observacoes
        })
        .eq('id', agendamento.id);

      if (error) throw error;

      await fetchAgendamentos();
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao atualizar agendamento:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteAgendamento = async (id: number, clienteName: string) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchAgendamentos()
      return { success: true }
    } catch (err: any) {
      console.error('Erro ao deletar agendamento:', err)
      return { success: false, error: err.message }
    }
  };

  const countAgendamentosByCliente = async (clienteId: number): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('agendamentos')
        .select('id', { count: 'exact', head: true })
        .eq('cliente_id', clienteId);

      if (error) {
        console.warn('Erro ao contar agendamentos do cliente:', error);
        return 0;
      }

      return count ?? 0;
    } catch (err) {
      console.error('Erro ao contar agendamentos:', err);
      return 0;
    }
  };

  const nextAgendamentoNumberForCliente = async (clienteId: number): Promise<number> => {
    const count = await countAgendamentosByCliente(clienteId);
    return count + 1;
  };

  const updateOsGerada = async (agendamentoId: number, osGerada: boolean) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ os_gerada: osGerada })
        .eq('id', agendamentoId);

      if (error) throw error;

      await fetchAgendamentos();
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao atualizar os_gerada:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchAgendamentos()

    const channel = supabase
      .channel('agendamentos_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'agendamentos' },
        () => {
          fetchAgendamentos()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, []);

  return {
    agendamentos,
    loading,
    error,
    addAgendamento,
    updateAgendamento,
    deleteAgendamento,
    refetch: fetchAgendamentos,
    countAgendamentosByCliente,
    nextAgendamentoNumberForCliente,
    updateOsGerada
  }
}