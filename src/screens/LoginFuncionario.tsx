import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { Key, User, ArrowLeft, ChefHat } from 'lucide-react';

export const LoginFuncionario: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { login, getEstablishmentBySlug } = useQueue();

  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);

  const establishment = slug ? getEstablishmentBySlug(slug) : undefined;

  if (!establishment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Estabelecimento não encontrado</h2>
          <p className="text-xs text-slate-500">Verifique a URL e tente novamente.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold"
          >
            Ir para Home
          </button>
        </div>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = login(username, senha, slug);
    if (result.success) {
      // Find the logged user cargo to redirect correctly
      // We will read the active user from localStorage or sync
      const savedUser = localStorage.getItem('saas_session_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.cargo === 'recepcao') {
          navigate(`/r/${slug}/recepcao`);
        } else if (user.cargo === 'garcom') {
          navigate(`/r/${slug}/garcom`);
        } else if (user.cargo === 'admin') {
          navigate(`/r/${slug}/admin`);
        } else {
          navigate('/');
        }
      }
    } else {
      setError(result.error || 'Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full mx-auto px-4 space-y-6">
        
        {/* Back link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para Home
        </button>

        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/80 shadow-lg space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <ChefHat className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800">
              Portal do Colaborador
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {establishment.nome}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Usuário / Login
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ex: clara"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-2xl text-xs font-semibold outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-2xl text-xs font-semibold outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-brand-500/10 cursor-pointer mt-4"
            >
              Entrar no Painel
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};
