import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dpnbmmbqgppfhjkmamyi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbmJtbWJxZ3BwZmhqa21hbXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0ODIzNDcsImV4cCI6MjA3NzA1ODM0N30.ceoW-4GSUhAUlmi6jUQWLCRvgQQhTzh8dIVxKHDhM5o'

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface Cliente {
  id: number
  nome: string
  telefone: string | null
  email: string | null
  endereco: string | null
  created_at: string
}

export interface Servico {
  id: number
  nome: string
  descricao: string | null
  created_at: string
}

export interface Agendamento {
  id: number
  cliente_id: number
  servico_id: number
  data: string
  horario: string
  status: 'Em Andamento' | 'Concluído' | 'Cancelado'
  observacoes: string | null
  created_at: string

  clientes?: Cliente
  servicos?: Servico
}

export interface OrdemServico {
  id: number
  agendamento_id: number
  descricao: string | null
  valor: number | null
  status: 'Em Andamento' | 'Concluída' | 'Cancelada'
  data_inicio: string | null
  data_conclusao: string | null
  created_at: string

  agendamentos?: Agendamento
}