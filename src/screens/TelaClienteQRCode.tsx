import React from 'react';
import { useQueue } from '../context/QueueContext';
import { QrCode, Smartphone, Users, ChevronRight, Info } from 'lucide-react';

export const TelaClienteQRCode: React.FC = () => {
  const { filaClientes, selectActiveClient, setActiveRole } = useQueue();

  const activeClientsInQueue = filaClientes.filter(
    c => c.status === 'aguardando' || c.status === 'chamado' || c.status === 'chegou'
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      
      {/* Introduction Card */}
      <div className="bg-gradient-to-tr from-brand-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-lg text-center md:text-left">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Portal de Entrada
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Sem baixar nada, entre na fila digital!
          </h2>
          <p className="text-sm text-indigo-100 leading-relaxed">
            Ao chegar ao restaurante, o cliente escaneia o QR Code com a câmera do celular e acessa diretamente o painel para se cadastrar na fila.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-lg shrink-0 flex flex-col items-center gap-2">
          {/* Simulated QR Code using SVG */}
          <div className="w-40 h-40 bg-slate-50 flex items-center justify-center rounded-xl border border-slate-100 p-2 relative group">
            <QrCode className="w-full h-full text-slate-800" />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <span className="bg-white text-brand-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                Escanea-me
              </span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            QR Code de Entrada
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration Quick Start */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-brand-500" />
            Simulador de Celular
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Clique no botão abaixo para abrir a tela de cadastro e simular o fluxo completo de entrada na fila digital como um novo cliente.
          </p>
          <button
            onClick={() => {
              selectActiveClient(null);
              setActiveRole('cliente');
            }}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-brand-500/10 cursor-pointer flex items-center justify-center gap-2"
          >
            Acessar Tela de Cadastro
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Existing line simulation devices */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Simular Dispositivos Ativos ({activeClientsInQueue.length})
          </h3>
          
          {activeClientsInQueue.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-slate-400">
              <Info className="w-8 h-8 text-slate-300 mb-1" />
              <p className="text-xs">Não há clientes na fila ativa no momento.</p>
              <p className="text-[10px] opacity-75">Use o painel de cadastro ao lado para adicionar um.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto max-h-[160px] space-y-1.5 pr-1">
              {activeClientsInQueue.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectActiveClient(c)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all flex items-center justify-between text-xs font-medium text-slate-700 group cursor-pointer"
                >
                  <div>
                    <span className="font-semibold block">{c.nome_cliente}</span>
                    <span className="text-[10px] text-slate-400">Grupo: {c.quantidade_pessoas} pessoas • {c.status}</span>
                  </div>
                  <span className="text-[10px] text-indigo-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Ver Celular
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
