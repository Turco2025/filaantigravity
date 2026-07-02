import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Mesa, 
  FilaCliente, 
  Chamado, 
  ConfiguracoesFila, 
  HistoricoAtendimento, 
  Restaurante,
  Funcionario,
  StatusMesa
} from '../types';

import { 
  initialMesas, 
  initialFilaClientes, 
  initialConfiguracoesFila, 
  initialHistoricoAtendimentos,
  initialFuncionarios,
  mockRestauranteId
} from '../utils/mockData';

interface QueueContextType {
  restaurante: Restaurante;
  funcionarios: Funcionario[];
  mesas: Mesa[];
  filaClientes: FilaCliente[];
  chamados: Chamado[];
  configuracoesFila: ConfiguracoesFila;
  historicoAtendimentos: HistoricoAtendimento[];
  activeRole: 'cliente' | 'recepcao' | 'garcom' | 'admin';
  activeClient: FilaCliente | null; // For the Client View simulation
  
  // Actions
  setActiveRole: (role: 'cliente' | 'recepcao' | 'garcom' | 'admin') => void;
  selectActiveClient: (client: FilaCliente | null) => void;
  adicionarClienteNaFila: (nome: string, whatsapp: string, quantidade: number, observacoes: string) => FilaCliente;
  calcularTempoEspera: (clienteId: string) => number;
  alterarStatusMesa: (mesaId: string, status: StatusMesa) => void;
  marcarMesaEmPreparo: (mesaId: string) => void;
  marcarMesaPronta: (mesaId: string, numeroMesa: string, capacidadeMax: number, capacidadeIdeal: number, setor: string, observacoes?: string) => void;
  sugerirClienteCompativel: (mesa: Mesa) => FilaCliente | null;
  chamarCliente: (clienteId: string, mesaId: string) => void;
  confirmarChegadaCliente: (clienteId: string) => void;
  confirmarClienteSentado: (clienteId: string) => void;
  removerClienteDaFila: (clienteId: string, statusFinal: 'cancelado' | 'ausente') => void;
  configurarRegrasDeEncaixe: (config: ConfiguracoesFila) => void;
  
  // Admin Operations
  adicionarMesa: (mesa: Omit<Mesa, 'id' | 'restaurante_id' | 'criado_em' | 'atualizado_em'>) => void;
  editarMesa: (mesa: Mesa) => void;
  excluirMesa: (mesaId: string) => void;
  adicionarFuncionario: (func: Omit<Funcionario, 'id'>) => void;
  excluirFuncionario: (funcId: string) => void;
  resetarSistema: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurante] = useState<Restaurante>({ id: mockRestauranteId, nome: 'Gourmet Prime', slug: 'gourmet-prime' });
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(() => {
    const saved = localStorage.getItem('queue_funcionarios');
    return saved ? JSON.parse(saved) : initialFuncionarios;
  });
  const [mesas, setMesas] = useState<Mesa[]>(() => {
    const saved = localStorage.getItem('queue_mesas');
    return saved ? JSON.parse(saved) : initialMesas;
  });
  const [filaClientes, setFilaClientes] = useState<FilaCliente[]>(() => {
    const saved = localStorage.getItem('queue_fila_clientes');
    return saved ? JSON.parse(saved) : initialFilaClientes;
  });
  const [chamados, setChamados] = useState<Chamado[]>(() => {
    const saved = localStorage.getItem('queue_chamados');
    return saved ? JSON.parse(saved) : [];
  });
  const [configuracoesFila, setConfiguracoesFila] = useState<ConfiguracoesFila>(() => {
    const saved = localStorage.getItem('queue_configuracoes');
    return saved ? JSON.parse(saved) : initialConfiguracoesFila;
  });
  const [historicoAtendimentos, setHistoricoAtendimentos] = useState<HistoricoAtendimento[]>(() => {
    const saved = localStorage.getItem('queue_historico');
    return saved ? JSON.parse(saved) : initialHistoricoAtendimentos;
  });
  
  // Active Role and simulated Active Client for UI testing
  const [activeRole, setActiveRole] = useState<'cliente' | 'recepcao' | 'garcom' | 'admin'>('recepcao');
  const [activeClient, setActiveClient] = useState<FilaCliente | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('queue_funcionarios', JSON.stringify(funcionarios));
  }, [funcionarios]);

  useEffect(() => {
    localStorage.setItem('queue_mesas', JSON.stringify(mesas));
  }, [mesas]);

  useEffect(() => {
    localStorage.setItem('queue_fila_clientes', JSON.stringify(filaClientes));
  }, [filaClientes]);

  useEffect(() => {
    localStorage.setItem('queue_chamados', JSON.stringify(chamados));
  }, [chamados]);

  useEffect(() => {
    localStorage.setItem('queue_configuracoes', JSON.stringify(configuracoesFila));
  }, [configuracoesFila]);

  useEffect(() => {
    localStorage.setItem('queue_historico', JSON.stringify(historicoAtendimentos));
  }, [historicoAtendimentos]);

  const selectActiveClient = (client: FilaCliente | null) => {
    setActiveClient(client);
    if (client) {
      setActiveRole('cliente');
    }
  };

  // 1. adicionarClienteNaFila
  const adicionarClienteNaFila = (nome: string, whatsapp: string, quantidade: number, observacoes: string) => {
    const newClient: FilaCliente = {
      id: `c-${Date.now()}`,
      restaurante_id: restaurante.id,
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
    setActiveClient(newClient); // Automatically direct to follow status view
    return newClient;
  };

  // 2. calcularTempoEspera (Simulated in minutes)
  const calcularTempoEspera = (clienteId: string): number => {
    const index = filaClientes
      .filter(c => c.status === 'aguardando')
      .findIndex(c => c.id === clienteId);
      
    if (index === -1) return 0;
    
    // Average wait time per group in line: ~8 minutes
    return (index + 1) * 8;
  };

  // 3. alterarStatusMesa
  const alterarStatusMesa = (mesaId: string, status: StatusMesa) => {
    setMesas(prev => prev.map(m => m.id === mesaId ? {
      ...m,
      status_atual: status,
      atualizado_em: new Date().toISOString()
    } : m));
  };

  // 4. marcarMesaEmPreparo
  const marcarMesaEmPreparo = (mesaId: string) => {
    alterarStatusMesa(mesaId, 'em_preparo');
  };

  // 5. marcarMesaPronta
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

  // 6. sugerirClienteCompativel (Smart queue logic)
  const sugerirClienteCompativel = (mesa: Mesa): FilaCliente | null => {
    const aguardando = filaClientes.filter(c => c.status === 'aguardando');
    if (aguardando.length === 0) return null;

    const compativeis = aguardando.filter(cliente => {
      const size = cliente.quantidade_pessoas;
      const maxCap = mesa.capacidade_maxima;

      if (size > maxCap) return false;
      if (size === maxCap) return true;

      // Check difference tolerance
      const diff = maxCap - size;
      if (diff > configuracoesFila.diferencaMaximaGrupoMesa) return false;

      // Specific rules from admin
      if (maxCap === 4 && size === 2 && !configuracoesFila.permitir2em4) return false;
      if (maxCap === 6 && size === 4 && !configuracoesFila.permitir4em6) return false;
      if (maxCap === 8 && size === 6 && !configuracoesFila.permitir6em8) return false;

      return true;
    });

    if (compativeis.length === 0) return null;

    // Rank candidates
    return compativeis.reduce((best, current) => {
      const bestDiff = mesa.capacidade_maxima - best.quantidade_pessoas;
      const currDiff = mesa.capacidade_maxima - current.quantidade_pessoas;

      if (currDiff < bestDiff) {
        // Less seat wastage
        return current;
      } else if (currDiff === bestDiff) {
        // Tie-breaker: FIFO (First In First Out)
        return new Date(current.horario_entrada).getTime() < new Date(best.horario_entrada).getTime() ? current : best;
      }
      return best;
    }, compativeis[0]);
  };

  // 7. chamarCliente
  const chamarCliente = (clienteId: string, mesaId: string) => {
    const mesa = mesas.find(m => m.id === mesaId);
    if (!mesa) return;

    // Create Call record
    const novoChamado: Chamado = {
      id: `ch-${Date.now()}`,
      cliente_id: clienteId,
      mesa_id: mesaId,
      numero_mesa: mesa.numero_mesa,
      capacidade_mesa: mesa.capacidade_maxima,
      quantidade_pessoas_cliente: filaClientes.find(c => c.id === clienteId)?.quantidade_pessoas || 0,
      status_chamado: 'pendente',
      horario_chamada: new Date().toISOString(),
      funcionario_recepcao_id: 'f-1', // Clara (Receptionist)
      garcom_id: 'f-2' // Felipe (Waiter)
    };

    // Update client status to called
    setFilaClientes(prev => prev.map(c => c.id === clienteId ? {
      ...c,
      status: 'chamado',
      horario_chamada: new Date().toISOString(),
      mesa_destinada_id: mesaId,
      numero_mesa_destinada: mesa.numero_mesa,
      atualizado_em: new Date().toISOString()
    } : c));

    // Update table status to reserved for that client
    setMesas(prev => prev.map(m => m.id === mesaId ? {
      ...m,
      status_atual: 'reservada',
      atualizado_em: new Date().toISOString()
    } : m));

    setChamados(prev => [...prev, novoChamado]);

    // If the simulated active client is this client, sync their view state
    if (activeClient && activeClient.id === clienteId) {
      setActiveClient(prev => prev ? {
        ...prev,
        status: 'chamado',
        horario_chamada: new Date().toISOString(),
        mesa_destinada_id: mesaId,
        numero_mesa_destinada: mesa.numero_mesa
      } : null);
    }
  };

  // 8. confirmarChegadaCliente
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

    if (activeClient && activeClient.id === clienteId) {
      setActiveClient(prev => prev ? {
        ...prev,
        status: 'chegou',
        horario_chegada_recepcao: new Date().toISOString()
      } : null);
    }
  };

  // 9. confirmarClienteSentado
  const confirmarClienteSentado = (clienteId: string) => {
    const cliente = filaClientes.find(c => c.id === clienteId);
    if (!cliente || !cliente.mesa_destinada_id) return;

    const mesaId = cliente.mesa_destinada_id;
    const mesa = mesas.find(m => m.id === mesaId);

    // Update table status to occupied
    setMesas(prev => prev.map(m => m.id === mesaId ? {
      ...m,
      status_atual: 'ocupada',
      atualizado_em: new Date().toISOString()
    } : m));

    // Remove client from active list (update status to sentado)
    setFilaClientes(prev => prev.map(c => c.id === clienteId ? {
      ...c,
      status: 'sentado',
      atualizado_em: new Date().toISOString()
    } : c));

    // Register inside service history
    const entradaDate = new Date(cliente.horario_entrada).getTime();
    const sentouDate = Date.now();
    const waitTimeMinutes = Math.round((sentouDate - entradaDate) / 60000);

    const novoHistorico: HistoricoAtendimento = {
      id: `h-${Date.now()}`,
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

    if (activeClient && activeClient.id === clienteId) {
      setActiveClient(prev => prev ? {
        ...prev,
        status: 'sentado'
      } : null);
    }
  };

  // 10. removerClienteDaFila
  const removerClienteDaFila = (clienteId: string, statusFinal: 'cancelado' | 'ausente') => {
    const cliente = filaClientes.find(c => c.id === clienteId);
    if (!cliente) return;

    // If client had a mesa destined, release the mesa
    if (cliente.mesa_destinada_id) {
      alterarStatusMesa(cliente.mesa_destinada_id, 'livre');
    }

    setFilaClientes(prev => prev.map(c => c.id === clienteId ? {
      ...c,
      status: statusFinal,
      atualizado_em: new Date().toISOString()
    } : c));

    // Register inside service history
    const entradaDate = new Date(cliente.horario_entrada).getTime();
    const finalDate = Date.now();
    const waitTimeMinutes = Math.round((finalDate - entradaDate) / 60000);

    const novoHistorico: HistoricoAtendimento = {
      id: `h-${Date.now()}`,
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

    if (activeClient && activeClient.id === clienteId) {
      setActiveClient(prev => prev ? {
        ...prev,
        status: statusFinal
      } : null);
    }
  };

  // 11. configurarRegrasDeEncaixe
  const configurarRegrasDeEncaixe = (config: ConfiguracoesFila) => {
    setConfiguracoesFila(config);
  };

  // ADMIN OPERATIONS
  const adicionarMesa = (mesa: Omit<Mesa, 'id' | 'restaurante_id' | 'criado_em' | 'atualizado_em'>) => {
    const novaMesa: Mesa = {
      ...mesa,
      id: `m-${Date.now()}`,
      restaurante_id: restaurante.id,
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

  const adicionarFuncionario = (func: Omit<Funcionario, 'id'>) => {
    const novoFuncionario: Funcionario = {
      ...func,
      id: `f-${Date.now()}`
    };
    setFuncionarios(prev => [...prev, novoFuncionario]);
  };

  const excluirFuncionario = (funcId: string) => {
    setFuncionarios(prev => prev.filter(f => f.id !== funcId));
  };

  const resetarSistema = () => {
    localStorage.removeItem('queue_funcionarios');
    localStorage.removeItem('queue_mesas');
    localStorage.removeItem('queue_fila_clientes');
    localStorage.removeItem('queue_chamados');
    localStorage.removeItem('queue_configuracoes');
    localStorage.removeItem('queue_historico');
    
    setFuncionarios(initialFuncionarios);
    setMesas(initialMesas);
    setFilaClientes(initialFilaClientes);
    setChamados([]);
    setConfiguracoesFila(initialConfiguracoesFila);
    setHistoricoAtendimentos(initialHistoricoAtendimentos);
    setActiveClient(null);
  };

  return (
    <QueueContext.Provider value={{
      restaurante,
      funcionarios,
      mesas,
      filaClientes,
      chamados,
      configuracoesFila,
      historicoAtendimentos,
      activeRole,
      activeClient,
      setActiveRole,
      selectActiveClient,
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
