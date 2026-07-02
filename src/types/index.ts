export interface Estabelecimento {
  id: string;
  nome: string;
  slug: string; // ex: 'gourmet-prime', 'burgers-place'
  status: 'ativo' | 'inativo';
  criado_em: string;
}

export type CargoFuncionario = 'recepcao' | 'garcom' | 'admin' | 'super_admin';

export interface Funcionario {
  id: string;
  estabelecimento_id: string | null; // null se cargo for super_admin
  nome: string;
  username: string; // Login do funcionário
  senha_hash: string; // Senha (simulada em texto para teste local)
  cargo: CargoFuncionario;
  permissao: string[];
}

export type StatusMesa = 'livre' | 'ocupada' | 'conta_solicitada' | 'em_pagamento' | 'em_preparo' | 'pronta' | 'reservada';

export interface Mesa {
  id: string;
  estabelecimento_id: string; // SaaS tenant identification
  numero_mesa: string;
  nome_ou_identificacao: string;
  capacidade_maxima: number;
  status_atual: StatusMesa;
  setor_ou_area: string;
  observacoes?: string;
  criado_em: string;
  atualizado_em: string;
  capacidade_ideal?: number; 
}

export type StatusCliente = 'aguardando' | 'chamado' | 'chegou' | 'sentado' | 'cancelado' | 'ausente';

export interface FilaCliente {
  id: string;
  estabelecimento_id: string; // SaaS tenant identification
  nome_cliente: string;
  whatsapp: string;
  quantidade_pessoas: number;
  observacoes: string; // ex: 'cadeirante, varanda'
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
  estabelecimento_id: string; // SaaS tenant identification
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
  estabelecimento_id: string; // SaaS tenant identification
  permitir2em4: boolean;
  permitir4em6: boolean;
  permitir6em8: boolean;
  diferencaMaximaGrupoMesa: number;
  tempoToleranciaChamadoMinutos: number;
}

export interface HistoricoAtendimento {
  id: string;
  estabelecimento_id: string; // SaaS tenant identification
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
