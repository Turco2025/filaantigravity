export interface Restaurante {
  id: string;
  nome: string;
  slug: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  cargo: 'recepcao' | 'garcom' | 'admin';
  permissao: string[];
}

export type StatusMesa = 'livre' | 'ocupada' | 'conta_solicitada' | 'em_pagamento' | 'em_preparo' | 'pronta' | 'reservada';

export interface Mesa {
  id: string;
  restaurante_id: string;
  numero_mesa: string;
  nome_ou_identificacao: string;
  capacidade_maxima: number;
  status_atual: StatusMesa;
  setor_ou_area: string;
  observacoes?: string;
  criado_em: string;
  atualizado_em: string;
  // Campos adicionais do MVP
  capacidade_ideal?: number; 
}

export type StatusCliente = 'aguardando' | 'chamado' | 'chegou' | 'sentado' | 'cancelado' | 'ausente';

export interface FilaCliente {
  id: string;
  restaurante_id: string;
  nome_cliente: string;
  whatsapp: string;
  quantidade_pessoas: number;
  observacoes: string; // ex: 'criança, cadeirante, carrinho de bebê, área externa'
  status: StatusCliente;
  horario_entrada: string;
  horario_chamada?: string;
  horario_chegada_recepcao?: string;
  mesa_destinada_id?: string;
  numero_mesa_destinada?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Chamado {
  id: string;
  cliente_id: string;
  mesa_id: string;
  numero_mesa: string;
  capacidade_mesa: number;
  quantidade_pessoas_cliente: number;
  status_chamado: 'pendente' | 'confirmado' | 'cancelado';
  horario_chamada: string;
  horario_confirmacao?: string;
  funcionario_recepcao_id?: string;
  garcom_id?: string;
}

export interface ConfiguracoesFila {
  permitir2em4: boolean;
  permitir4em6: boolean;
  permitir6em8: boolean;
  diferencaMaximaGrupoMesa: number;
  tempoToleranciaChamadoMinutos: number;
}

export interface HistoricoAtendimento {
  id: string;
  cliente_id: string;
  mesa_id: string;
  numero_mesa: string;
  quantidade_pessoas: number;
  horario_entrada_fila: string;
  horario_chamada: string;
  horario_sentou: string;
  tempo_total_espera: number; // Em minutos
  status_final: 'atendido' | 'cancelado' | 'ausente';
}
