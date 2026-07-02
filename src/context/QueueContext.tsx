import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Mesa, 
  FilaCliente, 
  Chamado, 
  ConfiguracoesFila, 
  HistoricoAtendimento, 
  Estabelecimento,
  Funcionario,
  StatusMesa
} from '../types';
import { 
  initialMesas, 
  initialFilaClientes, 
  initialConfiguracoesFila, 
  initialHistoricoAtendimentos,
  initialFuncionarios,
  initialEstabelecimentos
} from '../utils/mockData';

interface QueueContextType {
  estabelecimentos: Estabelecimento[];
  funcionarios: Funcionario[];
  mesas: Mesa[];
  filaClientes: FilaCliente[];
  chamados: Chamado[];
  configuracoesFila: ConfiguracoesFila[];
  historicoAtendimentos: HistoricoAtendimento[];
  sessionUser: Funcionario | null;
  
  // Actions
  login: (username: string, senha: string, slug?: string) => { success: boolean; error?: string };
  logout: () => void;
  getEstablishmentBySlug: (slug: string) => Estabelecimento | undefined;
  getEstConfig: (estId: string) => ConfiguracoesFila;
  
  // Operations (all segregated by establishment ID)
  adicionarClienteNaFila: (estId: string, nome: string, whatsapp: string, quantidade: number, observacoes: string) => FilaCliente;
  calcularTempoEspera: (estId: string, clienteId: string) => number;
  alterarStatusMesa: (mesaId: string, status: StatusMesa) => void;
  marcarMesaEmPreparo: (mesaId: string) => void;
  marcarMesaPronta: (mesaId: string, numeroMesa: string, capacidadeMax: number, capacidadeIdeal: number, setor: string, observacoes?: string) => void;
  sugerirClienteCompativel: (estId: string, mesa: Mesa) => FilaCliente | null;
  chamarCliente: (estId: string, clienteId: string, mesaId: string) => void;
  confirmarChegadaCliente: (clienteId: string) => void;
  confirmarClienteSentado: (clienteId: string) => void;
  removerClienteDaFila: (clienteId: string, statusFinal: 'cancelado' | 'ausente') => void;
  configurarRegrasDeEncaixe: (estId: string, config: Omit<ConfiguracoesFila, 'estabelecimento_id'>) => void;
  
  // Admin Operations
  adicionarMesa: (estId: string, mesa: Omit<Mesa, 'id' | 'estabelecimento_id' | 'criado_em' | 'atualizado_em'>) => void;
  editarMesa: (mesa: Mesa) => void;
  excluirMesa: (mesaId: string) => void;
  adicionarFuncionario: (estId: string, func: Omit<Funcionario, 'id' | 'estabelecimento_id'>) => void;
  excluirFuncionario: (funcId: string) => void;
  
  // Super Admin Operations
  adicionarEstabelecimento: (nome: string, slug: string) => { success: boolean; error?: string };
  resetarSistema: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // DB States
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>(() => {
    const saved = localStorage.getItem('saas_estabelecimentos');
    return saved ? JSON.parse(saved) : initialEstabelecimentos;
  });
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(() => {
    const saved = localStorage.getItem('saas_funcionarios');
    return saved ? JSON.parse(saved) : initialFuncionarios;
  });
  const [mesas, setMesas] = useState<Mesa[]>(() => {
    const saved = localStorage.getItem('saas_mesas');
    return saved ? JSON.parse(saved) : initialMesas;
  });
  const [filaClientes, setFilaClientes] = useState<FilaCliente[]>(() => {
    const saved = localStorage.getItem('saas_fila_clientes');
    return saved ? JSON.parse(saved) : initialFilaClientes;
  });
  const [chamados, setChamados] = useState<Chamado[]>(() => {
    const saved = localStorage.getItem('saas_chamados');
    return saved ? JSON.parse(saved) : [];
  });
  const [configuracoesFila, setConfiguracoesFila] = useState<ConfiguracoesFila[]>(() => {
    const saved = localStorage.getItem('saas_configuracoes');
    return saved ? JSON.parse(saved) : initialConfiguracoesFila;
  });
  const [historicoAtendimentos, setHistoricoAtendimentos] = useState<HistoricoAtendimento[]>(() => {
    const saved = localStorage.getItem('saas_historico');
    return saved ? JSON.parse(saved) : initialHistoricoAtendimentos;
  });

  // Auth Session State
  const [sessionUser, setSessionUser] = useState<Funcionario | null>(() => {
    const saved = localStorage.getItem('saas_session_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('saas_estabelecimentos', JSON.stringify(estabelecimentos));
  }, [estabelecimentos]);

  useEffect(() => {
    localStorage.setItem('saas_funcionarios', JSON.stringify(funcionarios));
  }, [funcionarios]);

  useEffect(() => {
    localStorage.setItem('saas_mesas', JSON.stringify(mesas));
  }, [mesas]);

  useEffect(() => {
    localStorage.setItem('saas_fila_clientes', JSON.stringify(filaClientes));
  }, [filaClientes]);

  useEffect(() => {
    localStorage.setItem('saas_chamados', JSON.stringify(chamados));
  }, [chamados]);

  useEffect(() => {
    localStorage.setItem('saas_configuracoes', JSON.stringify(configuracoesFila));
  }, [configuracoesFila]);

  useEffect(() => {
    localStorage.setItem('saas_historico', JSON.stringify(historicoAtendimentos));
  }, [historicoAtendimentos]);

  useEffect(() => {
    if (sessionUser) {
      localStorage.setItem('saas_session_user', JSON.stringify(sessionUser));
    } else {
      localStorage.removeItem('saas_session_user');
    }
  }, [sessionUser]);

  // Auth operations
  const login = (username: string, senha: string, slug?: string) => {
    if (!slug) {
      // Super Admin Login
      const user = funcionarios.find(
        f => f.username.toLowerCase() === username.toLowerCase() && f.cargo === 'super_admin'
      );
      if (user && user.senha_hash === senha) {
        setSessionUser(user);
        return { success: true };
      }
      return { success: false, error: 'Credenciais de Administrador Geral incorretas.' };
    } else {
      // Restaurant Staff Login
      const est = estabelecimentos.find(e => e.slug === slug);
      if (!est) {
        return { success: false, error: 'Estabelecimento não encontrado.' };
      }
      if (est.status !== 'ativo') {
        return { success: false, error: 'Este estabelecimento está inativo.' };
      }

      const user = funcionarios.find(
        f => f.username.toLowerCase() === username.toLowerCase() && 
             f.estabelecimento_id === est.id
      );

      if (user && user.senha_hash === senha) {
        setSessionUser(user);
        return { success: true };
      }
      return { success: false, error: 'Usuário ou senha incorretos para este estabelecimento.' };
    }
  };

  const logout = () => {
    setSessionUser(null);
  };

  const getEstablishmentBySlug = (slug: string) => {
    return estabelecimentos.find(e => e.slug === slug);
  };

  const getEstConfig = (estId: string): ConfiguracoesFila => {
    const config = configuracoesFila.find(c => c.estabelecimento_id === estId);
    if (config) return config;

    // Fallback default config if missing
    return {
      estabelecimento_id: estId,
      permitir2em4: true,
      permitir4em6: true,
      permitir6em8: true,
      diferencaMaximaGrupoMesa: 2,
      tempoToleranciaChamadoMinutos: 5
    };
  };

  // SaaS Operations
  const adicionarClienteNaFila = (estId: string, nome: string, whatsapp: string, quantidade: number, observacoes: string) => {
    const newClient: FilaCliente = {
      id: `c-${Date.now()}`,
      estabelecimento_id: estId,
      nome_cliente: nome,
      whatsapp,
      quantidade_pessoas: quantidade,
      observacoes,
      status: 'aguardando',
      horario_entrada: new Date().toISOString(),
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };
    
    setFilaClientes(prev => [...prev, newClient]);
    return newClient;
  };

  const calcularTempoEspera = (estId: string, clienteId: string): number => {
    const activeQueue = filaClientes.filter(c => c.estabelecimento_id === estId && c.status === 'aguardando');
    const index = activeQueue.findIndex(c => c.id === clienteId);
    if (index === -1) return 0;
    return (index + 1) * 8;
  };

  const alterarStatusMesa = (mesaId: string, status: StatusMesa) => {
    setMesas(prev => prev.map(m => m.id === mesaId ? {
      ...m,
      status_atual: status,
      atualizado_em: new Date().toISOString()
    } : m));
  };

  const marcarMesaEmPreparo = (mesaId: string) => {
    alterarStatusMesa(mesaId, 'em_preparo');
  };

  const marcarMesaPronta = (
    mesaId: string, 
    numeroMesa: string, 
    capacidadeMax: number, 
    capacidadeIdeal: number, 
    setor: string,
    observacoes?: string
  ) => {
    setMesas(prev => prev.map(m => m.id === mesaId ? {
      ...m,
      numero_mesa: numeroMesa,
      capacidade_maxima: capacidadeMax,
      capacidade_ideal: capacidadeIdeal,
      setor_ou_area: setor,
      status_atual: 'pronta',
      observacoes: observacoes ?? m.observacoes,
      atualizado_em: new Date().toISOString()
    } : m));
  };

  const sugerirClienteCompativel = (estId: string, mesa: Mesa): FilaCliente | null => {
    const aguardando = filaClientes.filter(c => c.estabelecimento_id === estId && c.status === 'aguardando');
    if (aguardando.length === 0) return null;

    const config = getEstConfig(estId);

    const compativeis = aguardando.filter(cliente => {
      const size = cliente.quantidade_pessoas;
      const maxCap = mesa.capacidade_maxima;

      if (size > maxCap) return false;
      if (size === maxCap) return true;

      // Check difference tolerance
      const diff = maxCap - size;
      if (diff > config.diferencaMaximaGrupoMesa) return false;

      // Specific rules
      if (maxCap === 4 && size === 2 && !config.permitir2em4) return false;
      if (maxCap === 6 && size === 4 && !config.permitir4em6) return false;
      if (maxCap === 8 && size === 6 && !config.permitir6em8) return false;

      return true;
    });

    if (compativeis.length === 0) return null;

    // Rank candidates: minimal wastage, then FIFO
    return compativeis.reduce((best, current) => {
      const bestDiff = mesa.capacidade_maxima - best.quantidade_pessoas;
      const currDiff = mesa.capacidade_maxima - current.quantidade_pessoas;

      if (currDiff < bestDiff) {
        return current;
      } else if (currDiff === bestDiff) {
        return new Date(current.horario_entrada).getTime() < new Date(best.horario_entrada).getTime() ? current : best;
      }
      return best;
    }, compativeis[0]);
  };

  const chamarCliente = (estId: string, clienteId: string, mesaId: string) => {
    const mesa = mesas.find(m => m.id === mesaId);
    if (!mesa) return;

    const novoChamado: Chamado = {
      id: `ch-${Date.now()}`,
      estabelecimento_id: estId,
      cliente_id: clienteId,
      mesa_id: mesaId,
      numero_mesa: mesa.numero_mesa,
      capacidade_mesa: mesa.capacidade_maxima,
      quantidade_pessoas_cliente: filaClientes.find(c => c.id === clienteId)?.quantidade_pessoas || 0,
      status_chamado: 'pendente',
      horario_chamada: new Date().toISOString(),
      funcionario_recepcao_id: sessionUser?.id || undefined
    };

    // Update client status
    setFilaClientes(prev => prev.map(c => c.id === clienteId ? {
      ...c,
      status: 'chamado',
      horario_chamada: new Date().toISOString(),
      mesa_destinada_id: mesaId,
      numero_mesa_destinada: mesa.numero_mesa,
      atualizado_em: new Date().toISOString()
    } : c));

    // Reserve table
    setMesas(prev => prev.map(m => m.id === mesaId ? {
      ...m,
      status_atual: 'reservada',
      atualizado_em: new Date().toISOString()
    } : m));

    setChamados(prev => [...prev, novoChamado]);
  };

  const confirmarChegadaCliente = (clienteId: string) => {
    setFilaClientes(prev => prev.map(c => c.id === clienteId ? {
      ...c,
      status: 'chegou',
      horario_chegada_recepcao: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    } : c));

    setChamados(prev => prev.map(ch => ch.cliente_id === clienteId && ch.status_chamado === 'pendente' ? {
      ...ch,
      status_chamado: 'confirmado',
      horario_confirmacao: new Date().toISOString()
    } : ch));
  };

  const confirmarClienteSentado = (clienteId: string) => {
    const cliente = filaClientes.find(c => c.id === clienteId);
    if (!cliente || !cliente.mesa_destinada_id) return;

    const mesaId = cliente.mesa_destinada_id;
    const mesa = mesas.find(m => m.id === mesaId);

    // Update table status
    setMesas(prev => prev.map(m => m.id === mesaId ? {
      ...m,
      status_atual: 'ocupada',
      atualizado_em: new Date().toISOString()
    } : m));

    // Remove client from active queue list
    setFilaClientes(prev => prev.map(c => c.id === clienteId ? {
      ...c,
      status: 'sentado',
      atualizado_em: new Date().toISOString()
    } : c));

    // Service History register
    const entradaDate = new Date(cliente.horario_entrada).getTime();
    const sentouDate = Date.now();
    const waitTimeMinutes = Math.round((sentouDate - entradaDate) / 60000);

    const novoHistorico: HistoricoAtendimento = {
      id: `h-${Date.now()}`,
      estabelecimento_id: cliente.estabelecimento_id,
      cliente_id: clienteId,
      mesa_id: mesaId,
      numero_mesa: mesa?.numero_mesa || '',
      quantidade_pessoas: cliente.quantidade_pessoas,
      horario_entrada_fila: cliente.horario_entrada,
      horario_chamada: cliente.horario_chamada || new Date().toISOString(),
      horario_sentou: new Date().toISOString(),
      tempo_total_espera: waitTimeMinutes,
      status_final: 'atendido'
    };

    setHistoricoAtendimentos(prev => [...prev, novoHistorico]);
  };

  const removerClienteDaFila = (clienteId: string, statusFinal: 'cancelado' | 'ausente') => {
    const cliente = filaClientes.find(c => c.id === clienteId);
    if (!cliente) return;

    if (cliente.mesa_destinada_id) {
      alterarStatusMesa(cliente.mesa_destinada_id, 'livre');
    }

    setFilaClientes(prev => prev.map(c => c.id === clienteId ? {
      ...c,
      status: statusFinal,
      atualizado_em: new Date().toISOString()
    } : c));

    // History register
    const entradaDate = new Date(cliente.horario_entrada).getTime();
    const finalDate = Date.now();
    const waitTimeMinutes = Math.round((finalDate - entradaDate) / 60000);

    const novoHistorico: HistoricoAtendimento = {
      id: `h-${Date.now()}`,
      estabelecimento_id: cliente.estabelecimento_id,
      cliente_id: clienteId,
      mesa_id: cliente.mesa_destinada_id || '',
      numero_mesa: cliente.numero_mesa_destinada || '',
      quantidade_pessoas: cliente.quantidade_pessoas,
      horario_entrada_fila: cliente.horario_entrada,
      horario_chamada: cliente.horario_chamada || '',
      horario_sentou: '',
      tempo_total_espera: waitTimeMinutes,
      status_final: statusFinal === 'cancelado' ? 'cancelado' : 'ausente'
    };

    setHistoricoAtendimentos(prev => [...prev, novoHistorico]);
  };

  const configurarRegrasDeEncaixe = (estId: string, config: Omit<ConfiguracoesFila, 'estabelecimento_id'>) => {
    setConfiguracoesFila(prev => prev.map(c => c.estabelecimento_id === estId ? {
      ...c,
      ...config
    } : c));
  };

  // ADMIN OPERATIONS
  const adicionarMesa = (estId: string, mesa: Omit<Mesa, 'id' | 'estabelecimento_id' | 'criado_em' | 'atualizado_em'>) => {
    const novaMesa: Mesa = {
      ...mesa,
      id: `m-${Date.now()}`,
      estabelecimento_id: estId,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };
    setMesas(prev => [...prev, novaMesa]);
  };

  const editarMesa = (mesa: Mesa) => {
    setMesas(prev => prev.map(m => m.id === mesa.id ? {
      ...mesa,
      atualizado_em: new Date().toISOString()
    } : m));
  };

  const excluirMesa = (mesaId: string) => {
    setMesas(prev => prev.filter(m => m.id !== mesaId));
  };

  const adicionarFuncionario = (estId: string, func: Omit<Funcionario, 'id' | 'estabelecimento_id'>) => {
    const novoFuncionario: Funcionario = {
      ...func,
      id: `f-${Date.now()}`,
      estabelecimento_id: estId
    };
    setFuncionarios(prev => [...prev, novoFuncionario]);
  };

  const excluirFuncionario = (funcId: string) => {
    setFuncionarios(prev => prev.filter(f => f.id !== funcId));
  };

  // SUPER ADMIN OPERATIONS
  const adicionarEstabelecimento = (nome: string, slug: string) => {
    const cleanedSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    const exists = estabelecimentos.some(e => e.slug === cleanedSlug);
    if (exists) {
      return { success: false, error: 'Já existe um estabelecimento com esta URL slug.' };
    }

    const newId = `est-${Date.now()}`;
    const newEst: Estabelecimento = {
      id: newId,
      nome,
      slug: cleanedSlug,
      status: 'ativo',
      criado_em: new Date().toISOString()
    };

    const newConfig: ConfiguracoesFila = {
      estabelecimento_id: newId,
      permitir2em4: true,
      permitir4em6: true,
      permitir6em8: true,
      diferencaMaximaGrupoMesa: 2,
      tempoToleranciaChamadoMinutos: 5
    };

    setEstabelecimentos(prev => [...prev, newEst]);
    setConfiguracoesFila(prev => [...prev, newConfig]);
    return { success: true };
  };

  const resetarSistema = () => {
    localStorage.clear();
    setEstabelecimentos(initialEstabelecimentos);
    setFuncionarios(initialFuncionarios);
    setMesas(initialMesas);
    setFilaClientes(initialFilaClientes);
    setChamados([]);
    setConfiguracoesFila(initialConfiguracoesFila);
    setHistoricoAtendimentos(initialHistoricoAtendimentos);
    setSessionUser(null);
  };

  return (
    <QueueContext.Provider value={{
      estabelecimentos,
      funcionarios,
      mesas,
      filaClientes,
      chamados,
      configuracoesFila,
      historicoAtendimentos,
      sessionUser,
      login,
      logout,
      getEstablishmentBySlug,
      getEstConfig,
      adicionarClienteNaFila,
      calcularTempoEspera,
      alterarStatusMesa,
      marcarMesaEmPreparo,
      marcarMesaPronta,
      sugerirClienteCompativel,
      chamarCliente,
      confirmarChegadaCliente,
      confirmarClienteSentado,
      removerClienteDaFila,
      configurarRegrasDeEncaixe,
      adicionarMesa,
      editarMesa,
      excluirMesa,
      adicionarFuncionario,
      excluirFuncionario,
      adicionarEstabelecimento,
      resetarSistema
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
