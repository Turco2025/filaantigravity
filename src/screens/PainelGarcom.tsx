import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { CardMesa } from '../components/CardMesa';
import { Sidebar } from '../components/Sidebar';
import { LayoutGrid, HelpCircle, LogOut, ShieldAlert } from 'lucide-react';

export const PainelGarcom: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { 
    mesas, 
    sugerirClienteCompativel, 
    alterarStatusMesa, 
    marcarMesaPronta,
    chamarCliente,
    confirmarClienteSentado,
    filaClientes,
    getEstablishmentBySlug,
    sessionUser,
    logout
  } = useQueue();

  const [activeSector, setActiveSector] = useState('all');

  const establishment = slug ? getEstablishmentBySlug(slug) : undefined;

  // Authorization barrier check
  useEffect(() => {
    if (!establishment) return;

    if (!sessionUser) {
      navigate(`/r/${slug}/login`);
      return;
    }

    const isStaffOfEst = sessionUser.estabelecimento_id === establishment.id;
    const hasRole = sessionUser.cargo === 'garcom' || sessionUser.cargo === 'admin';

    if (!isStaffOfEst || !hasRole) {
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

  if (!sessionUser || sessionUser.estabelecimento_id !== establishment.id || (sessionUser.cargo !== 'garcom' && sessionUser.cargo !== 'admin')) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 text-center bg-slate-50 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
          <h2 className="text-xl font-bold text-slate-800">Acesso Não Autorizado</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Seu usuário não possui permissão para acessar o Painel do Garçom deste estabelecimento.
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

  // Filter mesas by establishment
  const establishmentMesas = mesas.filter(m => m.estabelecimento_id === establishment.id);

  // Sector filtering
  const setores = ['all', ...Array.from(new Set(establishmentMesas.map(m => m.setor_ou_area).filter(Boolean)))];

  const filteredMesas = establishmentMesas.filter(m => {
    if (activeSector === 'all') return true;
    return m.setor_ou_area === activeSector;
  });

  const handleLogout = () => {
    logout();
    navigate(`/r/${slug}/login`);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] animate-in fade-in duration-300 font-sans">
      
      {/* Sidebar Info */}
      <Sidebar />

      {/* Main Waiter Dashboard */}
      <main className="flex-1 p-6 space-y-6 bg-slate-50/50">
        
        {/* Garcom Header summary */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 leading-none">
              Painel do Garçom (Mapa de Mesas)
            </h2>
            <span className="text-[10px] text-amber-600 font-bold block mt-1 uppercase tracking-wider">
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

        {/* Sector Navigation Filters */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
              Filtrar por Setor:
            </span>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {setores.map((setor) => {
                const isActive = activeSector === setor;
                return (
                  <button
                    key={setor}
                    onClick={() => setActiveSector(setor)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 capitalize cursor-pointer ${
                      isActive
                        ? 'bg-white text-brand-600 shadow-sm border-transparent'
                        : 'text-slate-600 hover:text-slate-800 border-transparent hover:bg-slate-200/50'
                    }`}
                  >
                    {setor === 'all' ? 'Todos os Setores' : setor}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium bg-indigo-50 border border-indigo-100 p-2 rounded-xl flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Mude o status das mesas à medida que limpa ou atende clientes.</span>
          </div>
        </div>

        {/* Tables Grid Layout */}
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <LayoutGrid className="w-4 h-4 text-brand-500" />
            Mapa de Mesas ({filteredMesas.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMesas.map(mesa => (
              <CardMesa
                key={mesa.id}
                mesa={mesa}
                sugerirClienteCompativel={(m) => sugerirClienteCompativel(establishment.id, m)}
                onAlterarStatus={alterarStatusMesa}
                onMarcarPronta={marcarMesaPronta}
                onChamarSugerido={(cId, mId) => chamarCliente(establishment.id, cId, mId)}
                onSentarCliente={confirmarClienteSentado}
                filaClientes={filaClientes}
              />
            ))}
          </div>
        </div>

      </main>

    </div>
  );
};
