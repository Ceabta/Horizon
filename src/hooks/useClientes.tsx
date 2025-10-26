import { useState, useEffect } from 'react'
import { supabase, type Cliente } from '../lib/supabase'

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
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
    } finally {
      setLoading(false)
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
    refetch: fetchClientes
  }
}