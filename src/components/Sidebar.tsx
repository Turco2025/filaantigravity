import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { 
  Users, 
  Layers, 
  CheckCircle, 
  Coffee, 
  Activity,
  UserCheck, 
  ChefHat, 
  ShieldAlert 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { filaClientes, mesas, sessionUser, getEstablishmentBySlug } = useQueue();

  const establishment = slug ? getEstablishmentBySlug(slug) : undefined;
  const estId = establishment?.id || '';

  // Segregate counters by establishment ID
  const totalAguardando = filaClientes.filter(
    c => c.estabelecimento_id === estId && c.status === 'aguardando'
  ).length;
  
  const totalChamados = filaClientes.filter(
    c => c.estabelecimento_id === estId && (c.status === 'chamado' || c.status === 'chegou')
  ).length;

  const totalMesasProntas = mesas.filter(
    m => m.estabelecimento_id === estId && m.status_atual === 'pronta'
  ).length;

  const totalMesasOcupadas = mesas.filter(
    m => m.estabelecimento_id === estId && m.status_atual === 'ocupada'
  ).length;

  const totalMesasPreparo = mesas.filter(
    m => m.estabelecimento_id === estId && m.status_atual === 'em_preparo'
  ).length;

  const getRoleHeader = () => {
    if (!sessionUser) {
      return { title: 'Acesso Restrito', desc: 'Faça login para acessar', icon: Activity, bg: 'from-slate-650 to-slate-800' };
    }
    switch (sessionUser.cargo) {
      case 'recepcao':
        return { title: 'Fila & Atendimento', desc: 'Painel da Recepção', icon: UserCheck, bg: 'from-indigo-600 to-blue-500' };
      case 'garcom':
        return { title: 'Mapa de Mesas', desc: 'Painel do Garçom', icon: ChefHat, bg: 'from-amber-600 to-orange-500' };
      case 'admin':
        return { title: 'Gestão Geral', desc: 'Administração do Local', icon: ShieldAlert, bg: 'from-rose-600 to-red-500' };
      default:
        return { title: 'Painel Geral', desc: 'Visão de Equipe', icon: Activity, bg: 'from-slate-600 to-slate-800' };
    }
  };

  const currentRole = getRoleHeader();
  const Icon = currentRole.icon;

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200/80 p-5 flex flex-col justify-between gap-6 font-sans">
      <div className="space-y-6">
        
        {/* Profile Card Header */}
        <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentRole.bg} text-white shadow-md`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold leading-none">{currentRole.title}</h2>
              <span className="text-[10px] text-white/70 block mt-1 font-medium">{currentRole.desc}</span>
            </div>
          </div>
        </div>

        {/* Live Counters */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Status Operacional (Hoje)
          </h3>
          
          <div className="grid grid-cols-1 gap-2.5">
            <div className="bg-slate-50 border border-slate-200/50 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold">Fila de Espera</span>
              </div>
              <span className="bg-slate-200 text-slate-800 text-xs font-extrabold px-2 py-0.5 rounded-lg">
                {totalAguardando}
              </span>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800">
                <Layers className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold">Chamados Ativos</span>
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-2 py-0.5 rounded-lg">
                {totalChamados}
              </span>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-800">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold">Mesas Prontas</span>
              </div>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-extrabold px-2 py-0.5 rounded-lg">
                {totalMesasProntas}
              </span>
            </div>

            <div className="bg-rose-50/40 border border-rose-100/50 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-800">
                <Coffee className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-semibold">Mesas Ocupadas</span>
              </div>
              <span className="bg-rose-100 text-rose-800 text-xs font-extrabold px-2 py-0.5 rounded-lg">
                {totalMesasOcupadas}
              </span>
            </div>

            <div className="bg-yellow-50/40 border border-yellow-100/50 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-yellow-800">
                <Activity className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-semibold">Em Limpeza</span>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-extrabold px-2 py-0.5 rounded-lg">
                {totalMesasPreparo}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Navigation shortcuts inside sidebar */}
      {sessionUser && sessionUser.cargo === 'admin' && (
        <div className="space-y-2 border-t border-slate-100 pt-4 mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Permissões Admin</span>
          <button
            onClick={() => navigate(`/r/${slug}/recepcao`)}
            className="w-full text-left py-2 px-3 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-lg text-xs font-semibold transition-all cursor-pointer block border border-transparent hover:border-slate-200"
          >
            Acessar Recepção
          </button>
          <button
            onClick={() => navigate(`/r/${slug}/garcom`)}
            className="w-full text-left py-2 px-3 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-lg text-xs font-semibold transition-all cursor-pointer block border border-transparent hover:border-slate-200"
          >
            Acessar Garçom
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="text-[10px] text-slate-400 font-medium border-t border-slate-100 pt-4 flex flex-col gap-1 px-1">
        <p className="flex justify-between">
          <span>Estabelecimento ID:</span>
          <span className="font-mono text-slate-600">{establishment?.id || 'N/A'}</span>
        </p>
        <p className="flex justify-between">
          <span>Modo de Operação:</span>
          <span className="text-emerald-600 font-bold">SaaS Separado</span>
        </p>
      </div>
    </aside>
  );
};
