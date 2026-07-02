import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { 
  ShieldAlert, 
  PlusCircle, 
  Building2, 
  LogOut, 
  Users, 
  Layers, 
  CheckCircle, 
  XCircle
} from 'lucide-react';

export const PainelSuperAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { 
    sessionUser, 
    logout, 
    estabelecimentos, 
    adicionarEstabelecimento,
    mesas,
    filaClientes,
    resetarSistema
  } = useQueue();

  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Authorization barrier check
  useEffect(() => {
    if (!sessionUser || sessionUser.cargo !== 'super_admin') {
      navigate('/super-admin/login');
    }
  }, [sessionUser, navigate]);

  if (!sessionUser || sessionUser.cargo !== 'super_admin') {
    return null;
  }

  const handleRegisterEst = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const result = adicionarEstabelecimento(nome, slug);
    if (result.success) {
      setSuccess(`Estabelecimento "${nome}" cadastrado com sucesso!`);
      setNome('');
      setSlug('');
    } else {
      setError(result.error || 'Erro ao registrar.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/super-admin/login');
  };

  // SaaS Global Stats
  const activeQueues = filaClientes.filter(c => c.status === 'aguardando').length;
  const totalTables = mesas.length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* Super Admin Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20">
            <ShieldAlert className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white leading-none">
              Super Admin SaaS Dashboard
            </h1>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
              Controle Geral da Plataforma
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-800 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout Geral
        </button>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Row 1: Global metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Estabelecimentos
              </span>
              <span className="text-2xl font-black text-white">
                {estabelecimentos.length} clientes B2B
              </span>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Clientes em Fila Global
              </span>
              <span className="text-2xl font-black text-white">
                {activeQueues} aguardando
              </span>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Mesas Cadastradas
              </span>
              <span className="text-2xl font-black text-white">
                {totalTables} mesas ativas
              </span>
            </div>
          </div>

        </div>

        {/* Row 2: Add and Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Add Establishment Form */}
          <div className="lg:col-span-4 bg-slate-850 p-6 rounded-3xl border border-slate-800 h-fit space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
              <PlusCircle className="w-4 h-4 text-brand-400" />
              Cadastrar Estabelecimento
            </h3>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleRegisterEst} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Nome do Estabelecimento
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pizzaria Forno de Ouro"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-brand-500 rounded-xl text-xs outline-hidden text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  URL Slug (Identificador Único)
                </label>
                <input
                  type="text"
                  placeholder="Ex: forno-de-ouro"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-brand-500 rounded-xl text-xs outline-hidden text-white"
                />
                <span className="text-[9px] text-slate-500 block leading-snug">
                  Será usado nas rotas. Ex: <code>/r/forno-de-ouro</code>
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20 cursor-pointer"
              >
                Registrar Estabelecimento
              </button>

            </form>
          </div>

          {/* List of active establishments */}
          <div className="lg:col-span-8 bg-slate-850 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Estabelecimentos Cadastrados ({estabelecimentos.length})
              </h3>
              
              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja apagar todas as modificações locais do SaaS e restaurar os dados originais?')) {
                    resetarSistema();
                    alert('Dados restaurados com sucesso!');
                  }
                }}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold underline cursor-pointer"
              >
                Resetar Banco de Dados SaaS
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-2">Nome</th>
                    <th className="py-3 px-2">URL Slug</th>
                    <th className="py-3 px-2">Mesas</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Data Adesão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {estabelecimentos.map(est => {
                    const estMesasCount = mesas.filter(m => m.estabelecimento_id === est.id).length;
                    return (
                      <tr key={est.id} className="hover:bg-slate-800/40">
                        <td className="py-3.5 px-2 font-bold text-white">{est.nome}</td>
                        <td className="py-3.5 px-2 font-mono text-indigo-400">/r/{est.slug}</td>
                        <td className="py-3.5 px-2 text-slate-300 font-semibold">{estMesasCount} mesas</td>
                        <td className="py-3.5 px-2">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            est.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {est.status === 'ativo' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {est.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-slate-500 font-medium">
                          {new Date(est.criado_em).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
};
