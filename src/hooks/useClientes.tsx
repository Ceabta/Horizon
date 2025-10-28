import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  cidade?: string;
  status?: "Ativo" | "Inativo";
}

export function useClientes() {
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClientes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome', { ascending: true })

      if (error) throw error
      setClientes(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar clientes:', err)
    } finally {
      setLoading(false)
    }
  }

  const addCliente = async (cliente: Cliente) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .insert([{
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone,
          endereco: cliente.endereco || '',
          status: cliente.status || 'Ativo'
        }])

      if (error) throw error

      await fetchClientes()
      return { success: true }
    } catch (err: any) {
      console.error('Erro ao adicionar cliente:', err)
      return { success: false, error: err.message }
    }
  }

  const updateCliente = async (cliente: any) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .update({
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone,
          endereco: cliente.endereco || '',
          status: cliente.status
        })
        .eq('id', cliente.id)

      if (error) throw error

      await fetchClientes()
      return { success: true }
    } catch (err: any) {
      console.error('Erro ao atualizar cliente:', err)
      return { success: false, error: err.message }
    }
  }

  const deleteCliente = async (id: number) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchClientes()
      return { success: true }
    } catch (err: any) {
      console.error('Erro ao deletar cliente:', err)
      return { success: false, error: err.message }
    }
  }

  const toggleStatus = async (cliente: any) => {
    try {
      const novoStatus = cliente.status === 'Ativo' ? 'Inativo' : 'Ativo'
      
      const { error } = await supabase
        .from('clientes')
        .update({ status: novoStatus })
        .eq('id', cliente.id)

      if (error) throw error

      await fetchClientes()
      return { success: true }
    } catch (err: any) {
      console.error('Erro ao alterar status:', err)
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchClientes()

    const channel = supabase
      .channel('clientes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clientes' },
        () => {
          fetchClientes()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    clientes,
    loading,
    error,
    addCliente,
    updateCliente,
    deleteCliente,
    toggleStatus,
    refetch: fetchClientes
  }
}