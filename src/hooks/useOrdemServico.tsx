import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { storageHelper } from '../lib/storage';

interface OrdemServico {
    id?: number;
    agendamento_id: number;
    nome: string;
    descricao: string;
    valor: number;
    status: 'Pendente' | 'Concluída' | 'Cancelada';
    created_at?: string;
    agendamento?: {
        data: string;
        horario: string;
        cliente: string;
        telefone: string;
        email: string;
        servico: string;
    };
}

export function useOrdemServico() {
    const [ordensServico, setOrdensServico] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchOrdensServico = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('ordem_servico')
                .select(`
          *,
          agendamentos (
            id,
            data,
            horario,
            clientes!agendamentos_cliente_id_fkey (
              nome,
              telefone,
              email
            ),
            servicos!agendamentos_servico_id_fkey (
              descricao
            )
          )
        `)
                .order('created_at', { ascending: false })

            if (error) throw error

            const formatted = (data || []).map(os => ({
                id: os.id,
                agendamento_id: os.agendamento_id,
                nome: os.nome,
                descricao: os.descricao,
                valor: os.valor,
                status: os.status,
                created_at: os.created_at,
                agendamento: {
                    data: os.agendamentos?.data,
                    horario: os.agendamentos?.horario,
                    cliente: os.agendamentos?.clientes?.nome || 'Cliente não encontrado',
                    telefone: os.agendamentos?.clientes?.telefone || '',
                    email: os.agendamentos?.clientes?.email || '',
                    servico: os.agendamentos?.servicos?.descricao || 'Serviço não encontrado'
                }
            }))

            setOrdensServico(formatted)
        } catch (err: any) {
            setError(err.message)
            console.error('Erro ao buscar ordens de serviço:', err)
        } finally {
            setLoading(false)
        }
    };

    const addOrdemServico = async (ordemServico: OrdemServico) => {
        try {
            const { error } = await supabase
                .from('ordem_servico')
                .insert([{
                    agendamento_id: ordemServico.agendamento_id,
                    nome: ordemServico.nome,
                    descricao: ordemServico.descricao,
                    valor: ordemServico.valor,
                    status: ordemServico.status || 'Pendente'
                }]);

            if (error) throw error;

            if (ordemServico.agendamento_id) {
                const { error: updateError } = await supabase
                    .from('agendamentos')
                    .update({ os_gerada: true })
                    .eq('id', ordemServico.agendamento_id);

                if (updateError) {
                    console.error('Erro ao atualizar os_gerada:', updateError);
                }
            }

            await fetchOrdensServico();
            return { success: true };
        } catch (err: any) {
            console.error('Erro ao adicionar ordem de serviço:', err);
            return { success: false, error: err.message };
        }
    };

    const updateOrdemServico = async (ordemServico: any) => {
        try {
            const { error } = await supabase
                .from('ordem_servico')
                .update({
                    nome: ordemServico.nome,
                    descricao: ordemServico.descricao,
                    valor: ordemServico.valor,
                    status: ordemServico.status,
                })
                .eq('id', ordemServico.id)

            if (error) throw error

            await fetchOrdensServico()
            return { success: true }
        } catch (err: any) {
            console.error('Erro ao atualizar ordem de serviço:', err)
            return { success: false, error: err.message }
        }
    };

    const deleteOrdemServico = async (id: number) => {
        try {
            const { data: osData } = await supabase
                .from('ordem_servico')
                .select('agendamento_id')
                .eq('id', id)
                .single();

            const { error } = await supabase
                .from('ordem_servico')
                .delete()
                .eq('id', id);

            if (error) throw error;

            if (osData?.agendamento_id) {
                const { error: updateError } = await supabase
                    .from('agendamentos')
                    .update({ os_gerada: false })
                    .eq('id', osData.agendamento_id);

                if (updateError) {
                    console.error('Erro ao reverter os_gerada:', updateError);
                }
            }

            await fetchOrdensServico();
            return { success: true };
        } catch (err: any) {
            console.error('Erro ao deletar ordem de serviço:', err);
            return { success: false, error: err.message };
        }
    };

    const updateStatus = async (id: number, novoStatus: string) => {
        try {
            const { error } = await supabase
                .from('ordem_servico')
                .update({
                    status: novoStatus
                })
                .eq('id', id)

            if (error) throw error

            await fetchOrdensServico()
            return { success: true }
        } catch (err: any) {
            console.error('Erro ao atualizar status:', err)
            return { success: false, error: err.message }
        }
    };

    const getOsByAgendamento = (agendamentoID: number) => {
        return ordensServico.filter(os =>
            os.agendamento_id === agendamentoID &&
            os.status !== 'Cancelada'
        ).length > 0
    };

    const getOsByCliente = (clienteNome: string) => {
        return ordensServico.filter(os =>
            os.agendamento?.cliente === clienteNome
        )
    };

    const getOsPendentesByCliente = (clienteNome: string) => {
        return ordensServico.filter(os =>
            os.agendamento?.cliente === clienteNome &&
            os.status !== 'Concluída' &&
            os.status !== 'Cancelada'
        ).length
    };

    const getTotalValorOS = () => {
        return ordensServico.reduce((total, os) => total + (os.valor || 0), 0)
    };

    const getOsByStatus = (status: string) => {
        return ordensServico.filter(os => os.status === status)
    };

    const addOrdemServicoComPDF = async (ordemServico: OrdemServico, pdfFile?: File) => {
        try {
            const { data: osData, error } = await supabase
                .from('ordem_servico')
                .insert([{
                    agendamento_id: ordemServico.agendamento_id,
                    nome: ordemServico.nome,
                    descricao: ordemServico.descricao,
                    valor: ordemServico.valor,
                    status: ordemServico.status || 'Pendente'
                }])
                .select()
                .single();

            if (error) throw error;

            if (pdfFile && osData) {
                const uploadResult = await storageHelper.uploadPDF(pdfFile, osData.id);

                if (uploadResult.success) {
                    const { error: updateError } = await supabase
                        .from('ordem_servico')
                        .update({
                            pdf_url: uploadResult.url,
                            pdf_path: uploadResult.path
                        })
                        .eq('id', osData.id);

                    if (updateError) {
                        console.error('Erro ao atualizar URL do PDF:', updateError);
                    }
                }
            }

            if (ordemServico.agendamento_id) {
                const { error: updateError } = await supabase
                    .from('agendamentos')
                    .update({ os_gerada: true })
                    .eq('id', ordemServico.agendamento_id);

                if (updateError) {
                    console.error('Erro ao atualizar os_gerada:', updateError);
                }
            }

            await fetchOrdensServico();
            return { success: true, osId: osData?.id };
        } catch (err: any) {
            console.error('Erro ao adicionar ordem de serviço:', err);
            return { success: false, error: err.message };
        }
    };

    useEffect(() => {
        fetchOrdensServico()

        const channel = supabase
            .channel('ordem_servico_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'ordem_servico' },
                () => {
                    fetchOrdensServico()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, []);

    return {
        ordensServico,
        loading,
        error,
        addOrdemServico,
        updateOrdemServico,
        deleteOrdemServico,
        updateStatus,
        getOsByCliente,
        getOsPendentesByCliente,
        getTotalValorOS,
        getOsByStatus,
        getOsByAgendamento,
        addOrdemServicoComPDF,
        refetch: fetchOrdensServico
    }
}