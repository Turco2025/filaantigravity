import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { ChefHat, Smartphone, Bell, BarChart3, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { estabelecimentos } = useQueue();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Hero Header */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <ChefHat className="w-5.5 h-5.5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white">FilaDigital SaaS</span>
        </div>
        <button
          onClick={() => navigate('/super-admin/login')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
        >
          Portal do Dono (Super Admin)
        </button>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-6 py-20 text-center space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          Sistema SaaS Completo para Estabelecimentos
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
          Gerenciamento Inteligente de Filas por <span className="text-indigo-400">QR Code</span>
        </h1>
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Permita que seus clientes entrem na fila de forma autônoma sem baixar nada. Reduza o tempo de espera ocioso, aumente o giro de mesas e otimize seu atendimento com nosso algoritmo inteligente de encaixe.
        </p>
      </header>

      {/* Product Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Sem Downloads</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            O cliente escaneia o QR Code na entrada, cadastra-se em 30 segundos no navegador e acompanha sua posição em tempo real no próprio celular.
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Encaixe Inteligente</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            O algoritmo cruza a capacidade ideal de mesas limpas com os grupos da fila, sugerindo o melhor encaixe para otimizar o salão.
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Métricas de Faturamento</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Painel administrativo detalhado com tempo médio de espera, clientes atendidos, ausentes e horários de maior fluxo de pessoas.
          </p>
        </div>
      </section>

      {/* Active Restaurants List */}
      <section className="max-w-3xl mx-auto px-6 py-12 space-y-6">
        <h2 className="text-xl font-extrabold text-white text-center">
          Testar Estabelecimentos Ativos no SaaS
        </h2>
        <p className="text-xs text-slate-400 text-center max-w-lg mx-auto">
          Selecione um estabelecimento abaixo para testar as telas de clientes ou acessar o portal de login dos funcionários do estabelecimento.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {estabelecimentos.map(est => (
            <div 
              key={est.id} 
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-base font-bold text-white">{est.nome}</h4>
                <p className="text-xs text-indigo-400 font-mono">Slug: /r/{est.slug}</p>
                <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  est.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {est.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => navigate(`/r/${est.slug}/cadastro`)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  Entrada (QR Code)
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate(`/r/${est.slug}/login`)}
                  className="px-3.5 py-2 bg-slate-700 hover:bg-slate-650 text-slate-100 rounded-xl text-xs font-bold transition-all border border-slate-600 cursor-pointer"
                >
                  Portal Equipe
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo helper */}
      <footer className="bg-slate-950/80 border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© 2026 FilaDigital SaaS System. Desenvolvido para Alta Escalabilidade.</p>
        <p className="mt-1 flex items-center justify-center gap-1">
          <HelpCircle className="w-4 h-4 text-slate-600" />
          <span>Credenciais Padrão: <code>clara / 123456</code> (Recepção) • <code>felipe / 123456</code> (Garçom) • <code>renato / 123456</code> (Admin)</span>
        </p>
      </footer>

    </div>
  );
};
