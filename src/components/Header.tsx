import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { ChefHat, LogOut, User, ShieldAlert } from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();
  const { sessionUser, logout, getEstablishmentBySlug } = useQueue();

  const isSuperAdminPath = location.pathname.startsWith('/super-admin');
  const establishment = slug ? getEstablishmentBySlug(slug) : undefined;

  const handleLogout = () => {
    logout();
    if (isSuperAdminPath) {
      navigate('/super-admin/login');
    } else if (slug) {
      navigate(`/r/${slug}/login`);
    } else {
      navigate('/');
    }
  };

  // If on public client registration or landing page, keep it clean
  const isClientView = location.pathname.includes('/cadastro') || location.pathname.includes('/fila/');
  const isLanding = location.pathname === '/';

  // Do not show the login/session details header if we are on landing, or public client views
  if (isLanding) return null;

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between font-sans">
      {/* Brand logo & info */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
          <ChefHat className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-extrabold text-slate-800 tracking-tight leading-none">
            {isSuperAdminPath ? 'SaaS Super Admin' : (establishment?.nome || 'FilaDigital')}
          </h1>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
            {isSuperAdminPath ? 'Controle Geral' : 'Painel de Atendimento'}
          </span>
        </div>
      </div>

      {/* User Session Info */}
      {sessionUser && !isClientView && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              {sessionUser.cargo === 'super_admin' ? (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <User className="w-3.5 h-3.5 text-slate-400" />
              )}
              {sessionUser.nome}
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              {sessionUser.cargo === 'super_admin' 
                ? 'Proprietário SaaS' 
                : sessionUser.cargo === 'admin' 
                ? 'Administrador do Local' 
                : sessionUser.cargo === 'recepcao' 
                ? 'Recepção' 
                : 'Garçom'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Sair da Conta"
            className="p-2 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100/50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
