import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { DashboardRelatorios } from '../components/DashboardRelatorios';
import { Sidebar } from '../components/Sidebar';
import type { Mesa } from '../types';
import { 
  BarChart3, 
  LayoutGrid, 
  Users, 
  Sliders, 
  PlusCircle, 
  Trash2, 
  Settings, 
  Edit2, 
  Info,
  LogOut,
  ShieldAlert
} from 'lucide-react';

export const PainelAdmin: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const {
    mesas,
    funcionarios,
    historicoAtendimentos,
    configurarRegrasDeEncaixe,
    adicionarMesa,
    editarMesa,
    excluirMesa,
    adicionarFuncionario,
    excluirFuncionario,
    getEstablishmentBySlug,
    getEstConfig,
    sessionUser,
    logout
  } = useQueue();

  const [activeTab, setActiveTab] = useState<'relatorios' | 'mesas' | 'funcionarios' | 'regras'>('relatorios');

  // Form states
  const [mesaNum, setMesaNum] = useState('');
  const [mesaNome, setMesaNome] = useState('');
  const [mesaCap, setMesaCap] = useState(4);
  const [mesaSetor, setMesaSetor] = useState('Interno');
  const [mesaObs, setMesaObs] = useState('');
  const [editingMesaId, setEditingMesaId] = useState<string | null>(null);

  const [funcNome, setFuncNome] = useState('');
  const [funcUser, setFuncUser] = useState('');
  const [funcSenha, setFuncSenha] = useState('');
  const [funcCargo, setFuncCargo] = useState<'recepcao' | 'garcom' | 'admin'>('garcom');

  const establishment = slug ? getEstablishmentBySlug(slug) : undefined;

  // Matching settings state local copy
  const [p2em4, setP2em4] = useState(true);
  const [p4em6, setP4em6] = useState(true);
  const [p6em8, setP6em8] = useState(true);
  const [diffMax, setDiffMax] = useState(2);
  const [tolerancia, setTolerancia] = useState(5);

  // Sync settings when loaded
  useEffect(() => {
    if (establishment) {
      const config = getEstConfig(establishment.id);
      setP2em4(config.permitir2em4);
      setP4em6(config.permitir4em6);
      setP6em8(config.permitir6em8);
      setDiffMax(config.diferencaMaximaGrupoMesa);
      setTolerancia(config.tempoToleranciaChamadoMinutos);
    }
  }, [establishment]);

  // Authorization barrier check
  useEffect(() => {
    if (!establishment) return;

    if (!sessionUser) {
      navigate(`/r/${slug}/login`);
      return;
    }

    const isStaffOfEst = sessionUser.estabelecimento_id === establishment.id;
    const isAdmin = sessionUser.cargo === 'admin';

    if (!isStaffOfEst || !isAdmin) {
      // Direct unauthorized staff away
      navigate(`/r/${slug}/login`);
    }
  }, [sessionUser, establishment, slug, navigate]);

  if (!establishment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Estabelecimento não encontrado</h2>
          <p className="text-xs text-slate-500">Verifique a URL e tente novamente.</p>
        </div>
      </div>
    );
  }

  if (!sessionUser || sessionUser.estabelecimento_id !== establishment.id || sessionUser.cargo !== 'admin') {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 text-center bg-slate-50 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
          <h2 className="text-xl font-bold text-slate-800">Acesso Restrito ao Administrador</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Seu usuário não possui permissão de Administrador para este estabelecimento.
          </p>
          <button
            onClick={() => {
              logout();
              navigate(`/r/${slug}/login`);
            }}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold animate-pulse"
          >
            Fazer Login com Outro Usuário
          </button>
        </div>
      </div>
    );
  }

  // Filter lists by establishment
  const establishmentMesas = mesas.filter(m => m.estabelecimento_id === establishment.id);
  const establishmentFuncionarios = funcionarios.filter(f => f.estabelecimento_id === establishment.id);
  const establishmentHistorico = historicoAtendimentos.filter(h => h.estabelecimento_id === establishment.id);

  const handleMesaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mesaNum.trim()) return;

    if (editingMesaId) {
      const existing = mesas.find(m => m.id === editingMesaId);
      if (existing) {
        editarMesa({
          ...existing,
          numero_mesa: mesaNum,
          nome_ou_identificacao: mesaNome || `Mesa ${mesaNum}`,
          capacidade_maxima: mesaCap,
          capacidade_ideal: mesaCap,
          setor_ou_area: mesaSetor,
          observacoes: mesaObs,
        });
      }
      setEditingMesaId(null);
    } else {
      adicionarMesa(establishment.id, {
        numero_mesa: mesaNum,
        nome_ou_identificacao: mesaNome || `Mesa ${mesaNum}`,
        capacidade_maxima: mesaCap,
        capacidade_ideal: mesaCap,
        status_atual: 'livre',
        setor_ou_area: mesaSetor,
        observacoes: mesaObs,
      });
    }

    // Reset
    setMesaNum('');
    setMesaNome('');
    setMesaCap(4);
    setMesaSetor('Interno');
    setMesaObs('');
  };

  const handleEditMesaClick = (m: Mesa) => {
    setEditingMesaId(m.id);
    setMesaNum(m.numero_mesa);
    setMesaNome(m.nome_ou_identificacao);
    setMesaCap(m.capacidade_maxima);
    setMesaSetor(m.setor_ou_area);
    setMesaObs(m.observacoes || '');
  };

  const handleFuncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!funcNome.trim() || !funcUser.trim() || !funcSenha.trim()) return;

    adicionarFuncionario(establishment.id, {
      nome: funcNome.trim(),
      username: funcUser.trim().toLowerCase(),
      senha_hash: funcSenha,
      cargo: funcCargo,
      permissao: [funcCargo]
    });

    setFuncNome('');
    setFuncUser('');
    setFuncSenha('');
  };

  const handleSaveRegras = (e: React.FormEvent) => {
    e.preventDefault();
    configurarRegrasDeEncaixe(establishment.id, {
      permitir2em4: p2em4,
      permitir4em6: p4em6,
      permitir6em8: p6em8,
      diferencaMaximaGrupoMesa: diffMax,
      tempoToleranciaChamadoMinutos: tolerancia
    });
    alert('Regras de encaixe salvas com sucesso!');
  };

  const handleLogout = () => {
    logout();
    navigate(`/r/${slug}/login`);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] animate-in fade-in duration-300 font-sans">
      
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Admin Workspace */}
      <main className="flex-1 p-6 space-y-6 bg-slate-50/50">
        
        {/* Admin Header Summary */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 leading-none">
              Painel do Administrador
            </h2>
            <span className="text-[10px] text-rose-600 font-bold block mt-1 uppercase tracking-wider">
              {establishment.nome} • Administrador: {sessionUser.nome}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('relatorios')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'relatorios' ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Métricas & Relatórios
          </button>

          <button
            onClick={() => setActiveTab('mesas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'mesas' ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Gerenciar Mesas
          </button>

          <button
            onClick={() => setActiveTab('funcionarios')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'funcionarios' ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Equipe do Local
          </button>

          <button
            onClick={() => setActiveTab('regras')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'regras' ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Regras de Encaixe
          </button>
        </div>

        {/* Tab Content Rendering */}
        <div className="space-y-6">
          
          {/* Tab 1: Metrics */}
          {activeTab === 'relatorios' && (
            <div className="space-y-6">
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                Desempenho Geral do Estabelecimento
              </h2>
              <DashboardRelatorios historico={establishmentHistorico} />
            </div>
          )}

          {/* Tab 2: Manage Tables */}
          {activeTab === 'mesas' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form card */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs h-fit space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-brand-500" />
                  {editingMesaId ? 'Editar Mesa' : 'Adicionar Nova Mesa'}
                </h3>
                
                <form onSubmit={handleMesaSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Número da Mesa</label>
                    <input
                      type="text"
                      placeholder="Ex: 12"
                      value={mesaNum}
                      onChange={e => setMesaNum(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nome / Identificação</label>
                    <input
                      type="text"
                      placeholder="Ex: Mesa 12 (Janela)"
                      value={mesaNome}
                      onChange={e => setMesaNome(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Capacidade Máxima</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={mesaCap}
                      onChange={e => setMesaCap(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Setor / Área</label>
                    <input
                      type="text"
                      placeholder="Ex: Varanda, Interno, Terraço"
                      value={mesaSetor}
                      onChange={e => setMesaSetor(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Observações (opcional)</label>
                    <input
                      type="text"
                      placeholder="Perto do bar, etc."
                      value={mesaObs}
                      onChange={e => setMesaObs(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    {editingMesaId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMesaId(null);
                          setMesaNum('');
                          setMesaNome('');
                          setMesaCap(4);
                          setMesaSetor('Interno');
                          setMesaObs('');
                        }}
                        className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      {editingMesaId ? 'Salvar' : 'Criar Mesa'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Table List grid */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
                  Lista de Mesas Cadastradas ({establishmentMesas.length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                        <th className="py-3 px-2">Nº</th>
                        <th className="py-3 px-2">Nome</th>
                        <th className="py-3 px-2">Capacidade</th>
                        <th className="py-3 px-2">Setor</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {establishmentMesas.map(m => (
                        <tr key={m.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-2 font-bold text-slate-700">{m.numero_mesa}</td>
                          <td className="py-3.5 px-2 font-medium text-slate-600">{m.nome_ou_identificacao}</td>
                          <td className="py-3.5 px-2 font-bold text-brand-600">{m.capacidade_maxima} lug.</td>
                          <td className="py-3.5 px-2 text-slate-500 font-medium">{m.setor_ou_area}</td>
                          <td className="py-3.5 px-2 uppercase font-bold text-[9px] tracking-wider text-slate-400">{m.status_atual}</td>
                          <td className="py-3.5 px-2 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => handleEditMesaClick(m)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => excluirMesa(m.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Employees */}
          {activeTab === 'funcionarios' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs h-fit space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-brand-500" />
                  Cadastrar Funcionário
                </h3>

                <form onSubmit={handleFuncSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nome do Funcionário</label>
                    <input
                      type="text"
                      placeholder="Ex: Carlos Silva"
                      value={funcNome}
                      onChange={e => setFuncNome(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Usuário de Login (username)</label>
                    <input
                      type="text"
                      placeholder="Ex: carlos"
                      value={funcUser}
                      onChange={e => setFuncUser(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Senha de Acesso</label>
                    <input
                      type="text"
                      placeholder="Ex: 123456"
                      value={funcSenha}
                      onChange={e => setFuncSenha(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Função / Cargo</label>
                    <select
                      value={funcCargo}
                      onChange={e => setFuncCargo(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-hidden text-slate-700"
                    >
                      <option value="recepcao">Recepção (Atendente)</option>
                      <option value="garcom">Garçom</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cadastrar Funcionário
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
                  Equipe Cadastrada ({establishmentFuncionarios.length})
                </h3>

                <div className="divide-y divide-slate-100">
                  {establishmentFuncionarios.map(f => (
                    <div key={f.id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block">{f.nome}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Usuário: <code>{f.username}</code> • Cargo: {f.cargo === 'recepcao' ? 'Recepção' : f.cargo === 'garcom' ? 'Garçom' : 'Administrador'}
                        </span>
                      </div>
                      <button
                        onClick={() => excluirFuncionario(f.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Matching Rules */}
          {activeTab === 'regras' && (
            <div className="max-w-2xl bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-brand-500 animate-spin-slow" />
                  Configurar Regras de Fila e Encaixe Inteligente
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ajuste o comportamento do algoritmo ao cruzar tamanhos de grupos de clientes e capacidades de mesas liberadas.
                </p>
              </div>

              <form onSubmit={handleSaveRegras} className="space-y-6">
                
                {/* Specific tolerances */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Permissões de Tamanho de Grupo
                  </h4>

                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/50 rounded-2xl cursor-pointer hover:bg-slate-100/50 transition-all">
                      <input
                        type="checkbox"
                        checked={p2em4}
                        onChange={e => setP2em4(e.target.checked)}
                        className="w-4.5 h-4.5 text-brand-600 border-slate-300 rounded-md focus:ring-brand-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">Permitir 2 pessoas em mesa de 4</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Se desativado, o algoritmo nunca sugerirá grupos de 2 para mesas de 4 lugares.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/50 rounded-2xl cursor-pointer hover:bg-slate-100/50 transition-all">
                      <input
                        type="checkbox"
                        checked={p4em6}
                        onChange={e => setP4em6(e.target.checked)}
                        className="w-4.5 h-4.5 text-brand-600 border-slate-300 rounded-md focus:ring-brand-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">Permitir 4 pessoas em mesa de 6</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Se desativado, o algoritmo rejeita grupos de 4 em mesas de 6 lugares.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/50 rounded-2xl cursor-pointer hover:bg-slate-100/50 transition-all">
                      <input
                        type="checkbox"
                        checked={p6em8}
                        onChange={e => setP6em8(e.target.checked)}
                        className="w-4.5 h-4.5 text-brand-600 border-slate-300 rounded-md focus:ring-brand-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">Permitir 6 pessoas em mesa de 8</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Se desativado, impede grupos de 6 pessoas em mesas de 8 lugares.</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Quantitative settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Diferença Máxima Fila/Mesa</label>
                    <p className="text-[10px] text-slate-400 leading-tight">Número máximo de assentos vazios permitidos em um encaixe de mesa grande.</p>
                    <input
                      type="number"
                      min="0"
                      max="6"
                      value={diffMax}
                      onChange={e => setDiffMax(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Tolerância Chamada (minutos)</label>
                    <p className="text-[10px] text-slate-400 leading-tight">Tempo estimado para expirar o chamado e poder marcar o cliente como ausente.</p>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={tolerancia}
                      onChange={e => setTolerancia(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700"
                    />
                  </div>

                </div>

                <div className="bg-amber-50 text-amber-800 border border-amber-100 p-4 rounded-2xl text-[10.5px] leading-relaxed flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Impacto em tempo real:</strong> O algoritmo de encaixe priorizará o encaixe mais adequado (menor desperdício de assentos). Essas tolerâncias garantem que mesas de alta capacidade não sejam ocupadas por casais ou grupos muito pequenos, preservando a eficiência do salão.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-brand-500/10 cursor-pointer"
                >
                  Salvar Parâmetros e Atualizar Fila
                </button>

              </form>
            </div>
          )}

        </div>

      </main>

    </div>
  );
};
