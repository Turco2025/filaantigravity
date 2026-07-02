import React from 'react';
import { useQueue } from '../context/QueueContext';
import { ChefHat, UserCheck, ShieldAlert, Smartphone, RotateCcw } from 'lucide-react';


export const Header: React.FC = () => {
  const { activeRole, setActiveRole, resetarSistema, restaurante } = useQueue();

  const roles = [
    { value: 'cliente', label: 'Cliente (QR Code)', icon: Smartphone, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { value: 'recepcao', label: 'Recepção', icon: UserCheck, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { value: 'garcom', label: 'Garçom', icon: ChefHat, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { value: 'admin', label: 'Administrador', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Brand logo & info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <ChefHat className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-800 tracking-tight leading-none">
              {restaurante.nome}
            </h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
              Fila Digital Inteligente
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Switcher */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200/60 p-1.5 rounded-2xl">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
          Simulador:
        </span>
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.value;
            return (
              <button
                key={role.value}
                onClick={() => setActiveRole(role.value as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-800 shadow-sm border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-700 border-transparent hover:bg-slate-200/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                {role.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={resetarSistema}
          title="Resetar Simulação para Dados Originais"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100/50"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
