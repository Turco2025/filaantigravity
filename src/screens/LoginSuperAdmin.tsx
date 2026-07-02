import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const LoginSuperAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useQueue();

  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = login(username, senha);
    if (result.success) {
      navigate('/super-admin');
    } else {
      setError(result.error || 'Credenciais de Administrador Geral inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full mx-auto px-4 space-y-6">
        
        {/* Back link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para Home
        </button>

        <div className="bg-slate-800 py-8 px-6 sm:px-10 rounded-3xl border border-slate-700 shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              SaaS Super Admin
            </h2>
            <p className="text-xs text-slate-400">
              Acesso exclusivo do dono do aplicativo
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Username do Administrador
              </label>
              <input
                type="text"
                placeholder="Ex: superadmin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-brand-500 rounded-2xl text-xs font-semibold outline-hidden text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-brand-500 rounded-2xl text-xs font-semibold outline-hidden text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-brand-500/20 cursor-pointer mt-4"
            >
              Entrar no Painel do SaaS
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};
