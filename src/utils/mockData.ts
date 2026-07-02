import type { 
  Mesa, 
  FilaCliente, 
  Funcionario, 
  ConfiguracoesFila, 
  HistoricoAtendimento,
  Estabelecimento 
} from '../types';

export const initialEstabelecimentos: Estabelecimento[] = [
  {
    id: 'est-1',
    nome: 'Gourmet Prime',
    slug: 'gourmet-prime',
    status: 'ativo',
    criado_em: new Date().toISOString()
  },
  {
    id: 'est-2',
    nome: 'Clinica Vitta',
    slug: 'clinica-vitta',
    status: 'ativo',
    criado_em: new Date().toISOString()
  },
  {
    id: 'est-3',
    nome: 'Burger & Fries',
    slug: 'burger-fries',
    status: 'ativo',
    criado_em: new Date().toISOString()
  }
];

export const initialFuncionarios: Funcionario[] = [
  // Super Admin (SaaS Owner)
  { 
    id: 'f-0', 
    estabelecimento_id: null, 
    nome: 'Dono do Sistema', 
    username: 'superadmin', 
    senha_hash: 'admin123', 
    cargo: 'super_admin', 
    permissao: ['all'] 
  },
  // Gourmet Prime Staff
  { 
    id: 'f-1', 
    estabelecimento_id: 'est-1', 
    nome: 'Clara Santos', 
    username: 'clara', 
    senha_hash: '123456', 
    cargo: 'recepcao', 
    permissao: ['recepcao'] 
  },
  { 
    id: 'f-2', 
    estabelecimento_id: 'est-1', 
    nome: 'Felipe Souza', 
    username: 'felipe', 
    senha_hash: '123456', 
    cargo: 'garcom', 
    permissao: ['garcom'] 
  },
  { 
    id: 'f-3', 
    estabelecimento_id: 'est-1', 
    nome: 'Renato Silva', 
    username: 'renato', 
    senha_hash: '123456', 
    cargo: 'admin', 
    permissao: ['admin'] 
  },
  // Clinica Vitta Staff
  { 
    id: 'f-4', 
    estabelecimento_id: 'est-2', 
    nome: 'Juliana Medeiros', 
    username: 'juliana', 
    senha_hash: '123456', 
    cargo: 'recepcao', 
    permissao: ['recepcao'] 
  },
  { 
    id: 'f-5', 
    estabelecimento_id: 'est-2', 
    nome: 'Dr. Arthur Costa', 
    username: 'arthur', 
    senha_hash: '123456', 
    cargo: 'admin', 
    permissao: ['admin'] 
  }
];

export const initialConfiguracoesFila: ConfiguracoesFila[] = [
  {
    estabelecimento_id: 'est-1',
    permitir2em4: true,
    permitir4em6: true,
    permitir6em8: true,
    diferencaMaximaGrupoMesa: 2,
    tempoToleranciaChamadoMinutos: 5,
  },
  {
    estabelecimento_id: 'est-2',
    permitir2em4: false,
    permitir4em6: true,
    permitir6em8: false,
    diferencaMaximaGrupoMesa: 1,
    tempoToleranciaChamadoMinutos: 10,
  }
];

// Helper for generating relative times in ISO format
const getRelativeTimeISO = (minutesAgo: number): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

export const initialMesas: Mesa[] = [
  // Gourmet Prime (Mesa 1 to 10)
  {
    id: 'm-1',
    estabelecimento_id: 'est-1',
    numero_mesa: '1',
    nome_ou_identificacao: 'Mesa 1',
    capacidade_maxima: 2,
    capacidade_ideal: 2,
    status_atual: 'livre',
    setor_ou_area: 'Interno',
    observacoes: 'Perto da janela',
    criado_em: getRelativeTimeISO(200),
    atualizado_em: getRelativeTimeISO(10),
  },
  {
    id: 'm-2',
    estabelecimento_id: 'est-1',
    numero_mesa: '2',
    nome_ou_identificacao: 'Mesa 2',
    capacidade_maxima: 2,
    capacidade_ideal: 2,
    status_atual: 'ocupada',
    setor_ou_area: 'Interno',
    observacoes: '',
    criado_em: getRelativeTimeISO(200),
    atualizado_em: getRelativeTimeISO(45),
  },
  {
    id: 'm-3',
    estabelecimento_id: 'est-1',
    numero_mesa: '3',
    nome_ou_identificacao: 'Mesa 3',
    capacidade_maxima: 4,
    capacidade_ideal: 4,
    status_atual: 'livre',
    setor_ou_area: 'Varanda',
    observacoes: 'Vista para a praça',
    criado_em: getRelativeTimeISO(200),
    atualizado_em: getRelativeTimeISO(15),
  },
  {
    id: 'm-4',
    estabelecimento_id: 'est-1',
    numero_mesa: '4',
    nome_ou_identificacao: 'Mesa 4',
    capacidade_maxima: 4,
    capacidade_ideal: 4,
    status_atual: 'ocupada',
    setor_ou_area: 'Interno',
    observacoes: '',
    criado_em: getRelativeTimeISO(200),
    atualizado_em: getRelativeTimeISO(80),
  },
  {
    id: 'm-5',
    estabelecimento_id: 'est-1',
    numero_mesa: '5',
    nome_ou_identificacao: 'Mesa 5',
    capacidade_maxima: 4,
    capacidade_ideal: 4,
    status_atual: 'conta_solicitada',
    setor_ou_area: 'Varanda',
    observacoes: '',
    criado_em: getRelativeTimeISO(200),
    atualizado_em: getRelativeTimeISO(5),
  },
  {
    id: 'm-6',
    estabelecimento_id: 'est-1',
    numero_mesa: '6',
    nome_ou_identificacao: 'Mesa 6',
    capacidade_maxima: 6,
    capacidade_ideal: 6,
    status_atual: 'em_pagamento',
    setor_ou_area: 'Terraço',
    observacoes: 'Sofá grande',
    criado_em: getRelativeTimeISO(200),
    atualizado_em: getRelativeTimeISO(5),
  },
  {
    id: 'm-7',
    estabelecimento_id: 'est-1',
    numero_mesa: '7',
    nome_ou_identificacao: 'Mesa 7',
    capacidade_maxima: 6,
    capacidade_ideal: 6,
    status_atual: 'em_preparo',
    setor_ou_area: 'Terraço',
    observacoes: 'Precisa limpar banco',
    criado_em: getRelativeTimeISO(200),
    atualizado_em: getRelativeTimeISO(2),
  },
  {
    id: 'm-8',
    estabelecimento_id: 'est-1',
    numero_mesa: '8',
    nome_ou_identificacao: 'Mesa 8',
    capacidade_maxima: 8,
    capacidade_ideal: 8,
    status_atual: 'livre',
    setor_ou_area: 'Interno',
    observacoes: 'Mesa Família',
    criado_em: getRelativeTimeISO(200),
    atualizado_em: getRelativeTimeISO(30),
  },
  {
    id: 'm-9',
    estabelecimento_id: 'est-1',
    numero_mesa: '9',
    nome_ou_identificacao: 'Mesa 9',
    capacidade_maxima: 2,
    capacidade_ideal: 2,
    status_atual: 'reservada',
    setor_ou_area: 'Varanda',
    observacoes: 'Reserva para as 20h',
    criado_em: getRelativeTimeISO(200),
    atualizado_em: getRelativeTimeISO(120),
  },
  {
    id: 'm-10',
    estabelecimento_id: 'est-1',
    numero_mesa: '10',
    nome_ou_identificacao: 'Mesa 10',
    capacidade_maxima: 4,
    capacidade_ideal: 4,
    status_atual: 'pronta',
    setor_ou_area: 'Interno',
    observacoes: 'Recém limpa e organizada',
    criado_em: getRelativeTimeISO(200),
    atualizado_em: getRelativeTimeISO(1),
  },

  // Clinica Vitta (Consultório 1 to 3)
  {
    id: 'm-201',
    estabelecimento_id: 'est-2',
    numero_mesa: '1',
    nome_ou_identificacao: 'Consultório 1',
    capacidade_maxima: 2,
    capacidade_ideal: 1,
    status_atual: 'livre',
    setor_ou_area: 'Pediatria',
    observacoes: '',
    criado_em: getRelativeTimeISO(100),
    atualizado_em: getRelativeTimeISO(20),
  },
  {
    id: 'm-202',
    estabelecimento_id: 'est-2',
    numero_mesa: '2',
    nome_ou_identificacao: 'Consultório 2',
    capacidade_maxima: 2,
    capacidade_ideal: 1,
    status_atual: 'ocupada',
    setor_ou_area: 'Geral',
    observacoes: '',
    criado_em: getRelativeTimeISO(100),
    atualizado_em: getRelativeTimeISO(10),
  }
];

export const initialFilaClientes: FilaCliente[] = [
  // Gourmet Prime Waitlist
  {
    id: 'c-1',
    estabelecimento_id: 'est-1',
    nome_cliente: 'João Silva',
    whatsapp: '11999998888',
    quantidade_pessoas: 4,
    observacoes: 'Cadeirante, área interna',
    status: 'aguardando',
    horario_entrada: getRelativeTimeISO(35),
    criado_em: getRelativeTimeISO(35),
    atualizado_em: getRelativeTimeISO(35),
  },
  {
    id: 'c-2',
    estabelecimento_id: 'est-1',
    nome_cliente: 'Maria Souza',
    whatsapp: '11988887777',
    quantidade_pessoas: 2,
    observacoes: 'Criança (precisa de cadeirão), varanda',
    status: 'aguardando',
    horario_entrada: getRelativeTimeISO(25),
    criado_em: getRelativeTimeISO(25),
    atualizado_em: getRelativeTimeISO(25),
  },
  {
    id: 'c-3',
    estabelecimento_id: 'est-1',
    nome_cliente: 'Pedro Santos',
    whatsapp: '11977776666',
    quantidade_pessoas: 6,
    observacoes: 'Área externa/Varanda preferencialmente',
    status: 'aguardando',
    horario_entrada: getRelativeTimeISO(15),
    criado_em: getRelativeTimeISO(15),
    atualizado_em: getRelativeTimeISO(15),
  },
  {
    id: 'c-4',
    estabelecimento_id: 'est-1',
    nome_cliente: 'Ana Oliveira',
    whatsapp: '11966665555',
    quantidade_pessoas: 2,
    observacoes: 'Preferência interna',
    status: 'chamado',
    horario_entrada: getRelativeTimeISO(45),
    horario_chamada: getRelativeTimeISO(4),
    mesa_destinada_id: 'm-10',
    numero_mesa_destinada: '10',
    criado_em: getRelativeTimeISO(45),
    atualizado_em: getRelativeTimeISO(4),
  },
  
  // Clinica Vitta Queue
  {
    id: 'c-201',
    estabelecimento_id: 'est-2',
    nome_cliente: 'Alice Nogueira',
    whatsapp: '11955551111',
    quantidade_pessoas: 1,
    observacoes: 'Consulta com Pediatra',
    status: 'aguardando',
    horario_entrada: getRelativeTimeISO(10),
    criado_em: getRelativeTimeISO(10),
    atualizado_em: getRelativeTimeISO(10),
  }
];

export const initialHistoricoAtendimentos: HistoricoAtendimento[] = [
  {
    id: 'h-1',
    estabelecimento_id: 'est-1',
    cliente_id: 'c-101',
    mesa_id: 'm-1',
    numero_mesa: '1',
    quantidade_pessoas: 2,
    horario_entrada_fila: getRelativeTimeISO(120),
    horario_chamada: getRelativeTimeISO(100),
    horario_sentou: getRelativeTimeISO(95),
    tempo_total_espera: 25,
    status_final: 'atendido',
  },
  {
    id: 'h-2',
    estabelecimento_id: 'est-1',
    cliente_id: 'c-102',
    mesa_id: 'm-4',
    numero_mesa: '4',
    quantidade_pessoas: 4,
    horario_entrada_fila: getRelativeTimeISO(180),
    horario_chamada: getRelativeTimeISO(140),
    horario_sentou: getRelativeTimeISO(138),
    tempo_total_espera: 42,
    status_final: 'atendido',
  }
];
