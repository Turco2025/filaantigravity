import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { CardClienteFila } from '../components/CardClienteFila';
import { CardMesa } from '../components/CardMesa';
import { FiltrosPorQuantidadePessoas } from '../components/FiltrosPorQuantidadePessoas';
import { Sidebar } from '../components/Sidebar';
import { Users, LayoutGrid, PlusCircle, Sparkles, X, LogOut, ShieldAlert } from 'lucide-react';

export const PainelRecepcao: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const {
    mesas,
    filaClientes,
    sugerirClienteCompativel,
    chamarCliente,
    confirmarChegadaCliente,
    confirmarClienteSentado,
    removerClienteDaFila,
    adicionarClienteNaFila,
    getEstablishmentBySlug,
    sessionUser,
    logout
  } = useQueue();

  const [activeTab, setActiveTab] = useState<'fila' | 'mesas'>('fila');
  const [filterSize, setFilterSize] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Manual add form state
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [quantidade, setQuantidade] = useState(2);
  const [observacoes, setObservacoes] = useState('');

  const establishment = slug ? getEstablishmentBySlug(slug) : undefined;

  // Authorization barrier check
  useEffect(() => {
    if (!establishment) return;
    
    if (!sessionUser) {
      navigate(`/r/${slug}/login`);
      return;
    }

    const isStaffOfEst = sessionUser.estabelecimento_id === establishment.id;
    const hasRole = sessionUser.cargo === 'recepcao' || sessionUser.cargo === 'admin';

    if (!isStaffOfEst || !hasRole) {
      // Not authorized for this view
      // If admin, they have access to everything, but receptionist only has access to reception.
      // If they are a waiter, they can't access reception!
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

  if (!sessionUser || sessionUser.estabelecimento_id !== establishment.id || (sessionUser.cargo !== 'recepcao' && sessionUser.cargo !== 'admin')) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 text-center bg-slate-50 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
          <h2 className="text-xl font-bold text-slate-800">Acesso Não Autorizado</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Seu usuário não possui permissão para acessar o Painel da Recepção deste estabelecimento.
          </p>
          <button
            onClick={() => {
              logout();
              navigate(`/r/${slug}/login`);
            }}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
          >
            Fazer Login com Outro Usuário
          </button>
        </div>
      </div>
    );
  }

  // Filter queue clients (segregated by establishment)
  const activeFila = filaClientes.filter(
    c => c.estabelecimento_id === establishment.id && 
         (c.status === 'aguardando' || c.status === 'chamado' || c.status === 'chegou')
  );

  const filteredFila = activeFila.filter(c => {
    if (filterSize === 'all') return true;
    const size = c.quantidade_pessoas;
    if (filterSize === '1-2') return size >= 1 && size <= 2;
    if (filterSize === '3-4') return size >= 3 && size <= 4;
    if (filterSize === '5-6') return size >= 5 && size <= 6;
    if (filterSize === '7+') return size >= 7;
    return true;
  });

  // Filter mesas (segregated by establishment)
  const establishmentMesas = mesas.filter(m => m.estabelecimento_id === establishment.id);

  const mesasDisponiveis = establishmentMesas.filter(
    m => m.status_atual === 'livre' || m.status_atual === 'pronta'
  );

  // Find tables marked as pronta
  const mesasProntas = establishmentMesas.filter(m => m.status_atual === 'pronta');

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !whatsapp.trim()) return;

    adicionarClienteNaFila(establishment.id, nome.trim(), whatsapp.trim(), quantidade, observacoes.trim());
    
    // Clear
    setNome('');
    setWhatsapp('');
    setQuantidade(2);
    setObservacoes('');
    setShowAddForm(false);
  };

  const handleLogout = () => {
    logout();
    navigate(`/r/${slug}/login`);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] animate-in fade-in duration-300 font-sans">
      
      {/* Sidebar Info */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 space-y-6 bg-slate-50/50">
        
        {/* Reception Header summary */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 leading-none">
              Painel da Recepção
            </h2>
            <span className="text-[10px] text-indigo-600 font-bold block mt-1 uppercase tracking-wider">
              {establishment.nome} • Colaborador: {sessionUser.nome}
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

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <FiltrosPorQuantidadePessoas 
            selectedFilter={filterSize}
            onFilterChange={setFilterSize}
          />

          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-brand-500/10 cursor-pointer w-full sm:w-auto justify-center"
          >
            <PlusCircle className="w-4 h-4" />
            Encaixe Manual
          </button>
        </div>

        {/* Smart Matches recommendations */}
        {mesasProntas.length > 0 && (
          <div className="p-5 bg-gradient-to-r from-indigo-500/10 to-brand-500/5 rounded-3xl border border-indigo-500/20 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-indigo-900 flex items-center gap-2 uppercase tracking-wider">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse-slow" />
              Mesas Prontas para Ocupação ({mesasProntas.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mesasProntas.map(m => {
                const suggestion = sugerirClienteCompativel(establishment.id, m);
                return (
                  <div key={m.id} className="bg-white p-4 rounded-2xl border border-indigo-100 flex flex-col justify-between gap-3 shadow-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Mesa {m.numero_mesa} ({m.setor_ou_area})
                        </span>
                        <p className="text-xs text-slate-600 font-semibold mt-0.5">
                          Liberada para {m.capacidade_ideal || m.capacidade_maxima} pessoas (Cap: {m.capacidade_maxima})
                        </p>
                      </div>
                      <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-extrabold px-2 py-0.5 rounded-lg uppercase">
                        Pronta
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-4">
                      {suggestion ? (
                        <>
                          <div className="text-xs">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Cliente Ideal:</span>
                            <span className="font-extrabold text-slate-800">{suggestion.nome_cliente}</span>
                            <span className="text-slate-500 ml-1.5">({suggestion.quantidade_pessoas}p)</span>
                          </div>
                          <button
                            onClick={() => chamarCliente(establishment.id, suggestion.id, m.id)}
                            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-indigo-600/10 cursor-pointer"
                          >
                            Chamar Cliente
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic py-1">
                          Nenhum cliente compatível aguardando na fila.
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile View tabs */}
        <div className="lg:hidden flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('fila')}
            className={`flex-1 py-3 text-center text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'fila' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500'
            }`}
          >
            <Users className="w-4 h-4" />
            Fila ({filteredFila.length})
          </button>
          <button
            onClick={() => setActiveTab('mesas')}
            className={`flex-1 py-3 text-center text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'mesas' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Mesas ({establishmentMesas.length})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Fila Column */}
          <section className={`lg:col-span-7 space-y-4 ${activeTab === 'fila' ? 'block' : 'hidden lg:block'}`}>
            <div className="flex justify-between items-center px-1">
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-500" />
                Clientes na Fila ({filteredFila.length})
              </h2>
            </div>

            {filteredFila.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center text-slate-400">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">Nenhum cliente na fila</p>
                <p className="text-xs text-slate-400 mt-1">
                  Use o botão de "Encaixe Manual" para adicionar um.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredFila.map(cliente => (
                  <CardClienteFila
                    key={cliente.id}
                    cliente={cliente}
                    mesasDisponiveis={mesasDisponiveis}
                    onChamar={(cId, mId) => chamarCliente(establishment.id, cId, mId)}
                    onChegou={confirmarChegadaCliente}
                    onSentar={confirmarClienteSentado}
                    onRemover={removerClienteDaFila}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Mesas Column */}
          <section className={`lg:col-span-5 space-y-4 ${activeTab === 'mesas' ? 'block' : 'hidden lg:block'}`}>
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <LayoutGrid className="w-4 h-4 text-indigo-500" />
              Visão das Mesas ({establishmentMesas.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {establishmentMesas.map(mesa => (
                <CardMesa
                  key={mesa.id}
                  mesa={mesa}
                  sugerirClienteCompativel={(m) => sugerirClienteCompativel(establishment.id, m)}
                  onAlterarStatus={() => {}} // Reception only views
                  onMarcarPronta={() => {}}
                  onChamarSugerido={(cId, mId) => chamarCliente(establishment.id, cId, mId)}
                  onSentarCliente={confirmarClienteSentado}
                  filaClientes={filaClientes}
                />
              ))}
            </div>
          </section>

        </div>

      </main>

      {/* Manual Insertion Drawer */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-1.5">
              <PlusCircle className="w-5 h-5 text-brand-500" />
              Encaixar Cliente Manualmente
            </h3>

            <form onSubmit={handleManualAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nome do Cliente</label>
                <input
                  type="text"
                  placeholder="Ex: Carlos Santos"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">WhatsApp</label>
                <input
                  type="text"
                  placeholder="Ex: (11) 98888-7777"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quantidade de Pessoas</label>
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                    className="w-8 h-8 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-slate-700">{quantidade} pessoas</span>
                  <button
                    type="button"
                    onClick={() => setQuantidade(quantidade + 1)}
                    className="w-8 h-8 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Observações</label>
                <input
                  type="text"
                  placeholder="Ex: Precisa de cadeirão, prefere varanda"
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/10 cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                Adicionar à Fila
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
