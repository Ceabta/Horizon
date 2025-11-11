export interface Cliente {
  id: number;
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
}

export interface Agendamento {
  id: number;
  data: Date | string;
  horario: string;
  cliente_id: number;
  cliente: string;
  telefone: string;
  email: string;
  servico: string;
  status: string;
  observacoes?: string;
  os_gerada?: boolean;
}

export interface OSItem {
  id: string;
  descricao: string;
  valor: number;
}

export interface OS {
  id: number;
  agendamento_id: number;
  nome: string;
  descricao: string;
  itens: OSItem[];
  valor: number;
  status: string;
  created_at?: string;
  pdf_url?: string;
  pdf_path?: string;
  agendamento: Agendamento;
}