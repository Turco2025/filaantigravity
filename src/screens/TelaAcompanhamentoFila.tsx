import React from 'react';
import { useQueue } from '../context/QueueContext';
import { Clock, Users, Bell, Sparkles, XCircle, LogOut } from 'lucide-react';


export const TelaAcompanhamentoFila: React.FC = () => {
  const { 
    activeClient, 
    selectActiveClient,
    filaClientes, 
    calcularTempoEspera, 
    removerClienteDaFila 
  } = useQueue();

  if (!activeClient) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <p className="text-sm text-slate-500">Nenhum cliente ativo selecionado.</p>
        <button
          onClick={() => selectActiveClient(null)}
          className="px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold"
        >
          Voltar
        </button>
      </div>
    );
  }

  // Find fresh copy of client from global state to ensure real-time updates
  const client = filaClientes.find(c => c.id === activeClient.id) || activeClient;

  // Calculate actual position (how many "aguardando" clients are ahead + 1)
  const waitingList = filaClientes.filter(c => c.status === 'aguardando');
  const clientIndex = waitingList.findIndex(c => c.id === client.id);
  const position = clientIndex !== -1 ? clientIndex + 1 : 0;
  
  const estimatedTime = calcularTempoEspera(client.id);

  const getStatusDisplay = () => {
    switch (client.status) {
      case 'aguardando':
        return (
          <div className="space-y-6 text-center">
            <div className="relative inline-flex items-center justify-center p-1 bg-brand-500/10 rounded-full border border-brand-500/20">
              <div className="w-24 h-24 rounded-full bg-brand-500/15 flex items-center justify-center animate-pulse">
                <Clock className="w-10 h-10 text-brand-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-800">Você está na fila!</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Acompanhe sua posição abaixo. Enviaremos uma notificação no seu WhatsApp quando sua mesa estiver pronta.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Sua Posição
                </span>
                <span className="text-3xl font-black text-slate-800 leading-none">
                  {position}º
                </span>
                <span className="text-[9px] text-slate-400 block mt-1">da fila de espera</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Espera Estimada
                </span>
                <span className="text-3xl font-black text-slate-800 leading-none">
                  ~{estimatedTime}
                </span>
                <span className="text-[9px] text-slate-400 block mt-1">minutos restantes</span>
              </div>
            </div>
          </div>
        );

      case 'chamado':
        return (
          <div className="space-y-6 text-center">
            {/* Pulsing bell animation */}
            <div className="relative inline-flex items-center justify-center p-1 bg-amber-500/10 rounded-full border border-amber-500/20">
              <div className="w-24 h-24 rounded-full bg-amber-500/25 flex items-center justify-center animate-bounce">
                <Bell className="w-10 h-10 text-amber-600 animate-pulse-slow" />
              </div>
            </div>

            <div className="space-y-3 bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl">
              <h3 className="text-2xl font-black text-amber-600 uppercase tracking-tight">Mesa Pronta!</h3>
              <p className="text-sm font-bold text-slate-800 leading-snug">
                “Sua mesa está pronta. Dirija-se à recepção.”
              </p>
              {client.numero_mesa_destinada && (
                <div className="bg-white border border-amber-200 rounded-xl py-2 px-3 inline-block">
                  <span className="text-xs font-bold text-amber-700 block uppercase tracking-wider text-[10px]">Mesa destinada:</span>
                  <span className="text-base font-extrabold text-slate-800">Mesa {client.numero_mesa_destinada}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 animate-pulse-slow font-medium">
              Por favor, vá até o balcão de atendimento na entrada.
            </p>
          </div>
        );

      case 'chegou':
        return (
          <div className="space-y-6 text-center">
            <div className="relative inline-flex items-center justify-center p-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              <div className="w-24 h-24 rounded-full bg-indigo-500/15 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-indigo-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-800">Chegada Confirmada!</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Nossa recepção confirmou sua chegada. Um garçom está a caminho para guiar você e seus acompanhantes à <span className="font-bold">Mesa {client.numero_mesa_destinada}</span>.
              </p>
            </div>
          </div>
        );

      case 'sentado':
        return (
          <div className="space-y-6 text-center">
            <div className="relative inline-flex items-center justify-center p-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <div className="w-24 h-24 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <SmileEmoji />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-emerald-600">Bom Apetite!</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Você já está acomodado na <span className="font-bold">Mesa {client.numero_mesa_destinada}</span>. O atendimento foi iniciado. Esperamos que tenha uma ótima experiência!
              </p>
            </div>
          </div>
        );

      case 'cancelado':
      case 'ausente':
        return (
          <div className="space-y-6 text-center">
            <div className="relative inline-flex items-center justify-center p-1 bg-rose-500/10 rounded-full border border-rose-500/20">
              <div className="w-24 h-24 rounded-full bg-rose-500/15 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-rose-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-rose-600">Atendimento Finalizado</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Sua posição na fila foi {client.status === 'cancelado' ? 'cancelada manualmente' : 'removida por ausência na chamada'}. 
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 px-4 space-y-6 animate-in fade-in duration-300">
      
      {/* Top action to simulate closing mobile portal */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>Fila de: {client.nome_cliente} • {client.quantidade_pessoas} pessoas</span>
        </div>
        
        <button
          onClick={() => selectActiveClient(null)}
          className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs font-bold transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sair Celular
        </button>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
        
        {/* Render wait details */}
        {getStatusDisplay()}

        {/* Footer actions for waiting clients */}
        {client.status === 'aguardando' && (
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => removerClienteDaFila(client.id, 'cancelado')}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              Cancelar minha posição
            </button>
          </div>
        )}
      </div>

      {/* Simulator Info Box */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-[11px] text-slate-500 space-y-2">
        <p className="font-bold text-slate-700">💡 Como testar no Simulador:</p>
        <p>
          1. Deixe esta tela de celular aberta.<br />
          2. Abra uma nova aba ou mude o perfil do simulador acima para <span className="font-bold">Recepção</span> ou <span className="font-bold">Garçom</span>.<br />
          3. Libere uma mesa e chame este cliente para ver o status mudar automaticamente.
        </p>
      </div>

    </div>
  );
};

const SmileEmoji = () => (
  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
