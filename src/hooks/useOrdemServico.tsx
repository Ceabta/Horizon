import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { storageHelper } from '../lib/storage';
import type { OS } from '../types'

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
                itens: os.itens || [],
                valor: os.valor,
                status: os.status,
                created_at: os.created_at,
                pdf_url: os.pdf_url,
                pdf_path: os.pdf_path,
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

    const addOrdemServico = async (ordemServico: OS) => {
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

    const addOrdemServicoComPDF = async (ordemServico: OS, pdfFile?: File) => {
        try {
            const { data: osData, error } = await supabase
                .from('ordem_servico')
                .insert([{
                    agendamento_id: ordemServico.agendamento_id,
                    nome: ordemServico.nome,
                    descricao: ordemServico.descricao,
                    itens: ordemServico.itens,
                    valor: ordemServico.valor,
                    status: ordemServico.status || 'Pendente',
                    pdf_url: null,
                    pdf_path: null
                }])
                .select()
                .single();

            if (error) {
                console.error('Erro ao criar OS:', error);
                throw error;
            }

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
                    } else {
                    }
                } else {
                    console.error('Erro no upload:', uploadResult.error);
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

    const updateOrdemServico = async (ordemServico: any) => {
        try {
            const { pdfFile, removePDF, ...osData } = ordemServico;

            const { error } = await supabase
                .from('ordem_servico')
                .update({
                    nome: osData.nome,
                    descricao: osData.descricao,
                    itens: osData.itens,
                    valor: osData.valor,
                    status: osData.status,
                    agendamento_id: osData.agendamento_id
                })
                .eq('id', osData.id);

            if (error) throw error;

            if (removePDF) {
                const { data: oldData } = await supabase
                    .from('ordem_servico')
                    .select('pdf_path')
                    .eq('id', osData.id)
                    .single();

                if (oldData?.pdf_path) {
                    await storageHelper.deletePDF(oldData.pdf_path);
                }

                await supabase
                    .from('ordem_servico')
                    .update({ pdf_url: null, pdf_path: null })
                    .eq('id', osData.id);
            }

            if (pdfFile) {
                const { data: oldData } = await supabase
                    .from('ordem_servico')
                    .select('pdf_path')
                    .eq('id', osData.id)
                    .single();

                if (oldData?.pdf_path) {
                    await storageHelper.deletePDF(oldData.pdf_path);
                }

                const uploadResult = await storageHelper.uploadPDF(pdfFile, osData.id);

                if (uploadResult.success) {
                    await supabase
                        .from('ordem_servico')
                        .update({
                            pdf_url: uploadResult.url,
                            pdf_path: uploadResult.path
                        })
                        .eq('id', osData.id);
                }
            }

            await fetchOrdensServico();
            return { success: true };
        } catch (err: any) {
            console.error('Erro ao atualizar ordem de serviço:', err);
            return { success: false, error: err.message };
        }
    };

    const deleteOrdemServico = async (id: number) => {
        try {
            const { data: osData } = await supabase
                .from('ordem_servico')
                .select('agendamento_id, pdf_path')
                .eq('id', id)
                .single();

            if (osData?.pdf_path) {
                const deleteResult = await storageHelper.deletePDF(osData.pdf_path);
                if (!deleteResult.success) {
                    console.error('Erro ao deletar PDF:', deleteResult.error);
                }
            }

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
        addOrdemServicoComPDF,
        updateOrdemServico,
        deleteOrdemServico,
        updateStatus,
        getOsByCliente,
        getOsPendentesByCliente,
        getTotalValorOS,
        getOsByStatus,
        getOsByAgendamento,
        refetch: fetchOrdensServico
    }
}