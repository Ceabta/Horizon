import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

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