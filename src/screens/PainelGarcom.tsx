import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { CardMesa } from '../components/CardMesa';
import { Sidebar } from '../components/Sidebar';
import { LayoutGrid, HelpCircle } from 'lucide-react';


export const PainelGarcom: React.FC = () => {
  const { 
    mesas, 
    sugerirClienteCompativel, 
    alterarStatusMesa, 
    marcarMesaPronta,
    chamarCliente,
    confirmarClienteSentado,
    filaClientes
  } = useQueue();

  const [activeSector, setActiveSector] = useState('all');

  // Sector filtering
  const setores = ['all', ...Array.from(new Set(mesas.map(m => m.setor_ou_area).filter(Boolean)))];

  const filteredMesas = mesas.filter(m => {
    if (activeSector === 'all') return true;
    return m.setor_ou_area === activeSector;
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] animate-in fade-in duration-300">
      
      {/* Sidebar Info */}
      <Sidebar />

      {/* Main Waiter Dashboard */}
      <main className="flex-1 p-6 space-y-6">
        
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
                sugerirClienteCompativel={sugerirClienteCompativel}
                onAlterarStatus={alterarStatusMesa}
                onMarcarPronta={marcarMesaPronta}
                onChamarSugerido={chamarCliente}
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
