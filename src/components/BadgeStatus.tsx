import React from 'react';
import type { StatusMesa, StatusCliente } from '../types';


interface BadgeStatusProps {
  status: StatusMesa | StatusCliente;
  type: 'mesa' | 'cliente';
}

export const BadgeStatus: React.FC<BadgeStatusProps> = ({ status, type }) => {
  const getStyles = () => {
    if (type === 'mesa') {
      switch (status) {
        case 'livre':
          return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
        case 'ocupada':
          return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
        case 'conta_solicitada':
          return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
        case 'em_pagamento':
          return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
        case 'em_preparo':
          return 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20';
        case 'pronta':
          return 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 animate-pulse';
        case 'reservada':
          return 'bg-purple-500/10 text-purple-600 border border-purple-500/20';
        default:
          return 'bg-slate-500/10 text-slate-600 border border-slate-500/20';
      }
    } else {
      switch (status) {
        case 'aguardando':
          return 'bg-slate-100 text-slate-700 border border-slate-200';
        case 'chamado':
          return 'bg-amber-500 text-white border border-amber-600 animate-bounce';
        case 'chegou':
          return 'bg-indigo-500 text-white border border-indigo-600';
        case 'sentado':
          return 'bg-emerald-500 text-white border border-emerald-600';
        case 'cancelado':
          return 'bg-rose-100 text-rose-700 border border-rose-200';
        case 'ausente':
          return 'bg-gray-100 text-gray-500 border border-gray-200';
        default:
          return 'bg-slate-100 text-slate-600 border border-slate-200';
      }
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'livre': return 'Livre';
      case 'ocupada': return 'Ocupada';
      case 'conta_solicitada': return 'Conta Solicitada';
      case 'em_pagamento': return 'Em Pagamento';
      case 'em_preparo': return 'Em Preparo (Limpeza)';
      case 'pronta': return 'Pronta / Liberada';
      case 'reservada': return 'Reservada';
      case 'aguardando': return 'Aguardando';
      case 'chamado': return 'Chamado!';
      case 'chegou': return 'Chegou na Recepção';
      case 'sentado': return 'Sentado / Atendido';
      case 'cancelado': return 'Cancelado';
      case 'ausente': return 'Ausente';
      default: return status;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide shadow-xs transition-all ${getStyles()}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'pronta' || status === 'chamado' ? 'bg-current animate-ping' : 'bg-current'
      }`}></span>
      {getLabel()}
    </span>
  );
};
