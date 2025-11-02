export interface Agendamento {
  data: string;
  horario: string;
  cliente: string;
  telefone: string;
  email: string;
  servico: string;
}

export interface OS {
  id: number;
  agendamento_id: number;
  nome: string;
  descricao: string;
  valor: number;
  status: string;
  created_at?: string;
  agendamento: Agendamento;
}
