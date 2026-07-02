import React, { useState } from 'react';
import type { Mesa, FilaCliente, StatusMesa } from '../types';
import { BadgeStatus } from './BadgeStatus';
import { Sparkles, Trash2, Edit2, Check, RefreshCw, Users, LogIn } from 'lucide-react';


interface CardMesaProps {
  mesa: Mesa;
  sugerirClienteCompativel: (mesa: Mesa) => FilaCliente | null;
  onAlterarStatus: (mesaId: string, status: StatusMesa) => void;
  onMarcarPronta: (
    mesaId: string, 
    numeroMesa: string, 
    capacidadeMax: number, 
    capacidadeIdeal: number, 
    setor: string,
    observacoes?: string
  ) => void;
  onChamarSugerido: (clienteId: string, mesaId: string) => void;
  onSentarCliente: (clienteId: string) => void;
  filaClientes: FilaCliente[];
  showAdminActions?: boolean;
  onEditMesa?: (mesa: Mesa) => void;
  onDeleteMesa?: (mesaId: string) => void;
}

export const CardMesa: React.FC<CardMesaProps> = ({
  mesa,
  sugerirClienteCompativel,
  onAlterarStatus,
  onMarcarPronta,
  onChamarSugerido,
  onSentarCliente,
  filaClientes,
  showAdminActions = false,
  onEditMesa,
  onDeleteMesa,
}) => {
  // Inline edit state when waiter marks "pronta"
  const [isMarkingReady, setIsMarkingReady] = useState(false);
  const [numeroMesa, setNumeroMesa] = useState(mesa.numero_mesa);
  const [capMax, setCapMax] = useState(mesa.capacidade_maxima);
  const [capIdeal, setCapIdeal] = useState(mesa.capacidade_ideal || mesa.capacidade_maxima);
  const [setor, setSetor] = useState(mesa.setor_ou_area);
  const [obs, setObs] = useState(mesa.observacoes || '');

  const suggestion = sugerirClienteCompativel(mesa);

  // Find who is currently occupying or called for this table
  const clienteReservado = filaClientes.find(
    c => c.mesa_destinada_id === mesa.id && (c.status === 'chamado' || c.status === 'chegou')
  );
  
  const clienteOcupando = filaClientes.find(
    c => c.mesa_destinada_id === mesa.id && c.status === 'sentado'
  );

  const getStatusColor = () => {
    switch (mesa.status_atual) {
      case 'livre':
        return 'border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/40';
      case 'ocupada':
        return 'border-rose-200 bg-rose-50/10';
      case 'conta_solicitada':
        return 'border-amber-200 bg-amber-50/20';
      case 'em_pagamento':
        return 'border-blue-200 bg-blue-50/20';
      case 'em_preparo':
        return 'border-yellow-300 bg-yellow-50/20';
      case 'pronta':
        return 'border-indigo-400 bg-indigo-50/30 ring-2 ring-indigo-500/20';
      case 'reservada':
        return 'border-purple-200 bg-purple-50/15';
      default:
        return 'border-slate-200 bg-white';
    }
  };

  const handleSaveReady = (e: React.FormEvent) => {
    e.preventDefault();
    onMarcarPronta(mesa.id, numeroMesa, capMax, capIdeal, setor, obs);
    setIsMarkingReady(false);
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 ${getStatusColor()}`}>
      
      {/* Header Info */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            {setor || 'Sem Setor'}
          </span>
          <h3 className="text-xl font-bold text-slate-800">
            Mesa {mesa.numero_mesa}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <BadgeStatus status={mesa.status_atual} type="mesa" />
          <span className="text-[10px] text-slate-400 font-medium">
            Cap: {mesa.capacidade_ideal || mesa.capacidade_maxima} / {mesa.capacidade_maxima} lug.
          </span>
        </div>
      </div>

      {/* Table details (Notes or Current Customer) */}
      <div className="my-3 space-y-1.5 min-h-[36px]">
        {clienteOcupando && (
          <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-100/50">
            <span className="font-bold">Ocupada por:</span> {clienteOcupando.nome_cliente}
            <span className="block text-[10px] opacity-75">{clienteOcupando.quantidade_pessoas} pessoas</span>
          </div>
        )}

        {clienteReservado && (
          <div className="text-xs text-purple-700 bg-purple-50 p-2.5 rounded-xl border border-purple-100/50">
            <span className="font-bold">{clienteReservado.status === 'chegou' ? 'Aguardando sentar:' : 'Reservado para:'}</span> {clienteReservado.nome_cliente}
            <span className="block text-[10px] opacity-75">{clienteReservado.quantidade_pessoas} pessoas • Status: {clienteReservado.status === 'chegou' ? 'Recepção' : 'Chamado'}</span>
          </div>
        )}

        {!clienteOcupando && !clienteReservado && mesa.observacoes && (
          <p className="text-xs text-slate-500 italic">“{mesa.observacoes}”</p>
        )}
      </div>

      {/* Sugestão Inteligente (Apenas se a mesa estiver PRONTA) */}
      {mesa.status_atual === 'pronta' && !isMarkingReady && (
        <div className="my-4 p-3 bg-indigo-600/5 rounded-xl border border-indigo-500/20">
          <div className="flex items-center gap-1 text-indigo-700 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse-slow" />
            <span>Sugestão Inteligente de Fila:</span>
          </div>
          {suggestion ? (
            <div className="flex items-center justify-between gap-2 mt-1">
              <div>
                <p className="text-xs font-bold text-slate-800">{suggestion.nome_cliente}</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Users className="w-3 h-3" />
                  {suggestion.quantidade_pessoas} pessoas • Fila: {Math.max(1, Math.round((Date.now() - new Date(suggestion.horario_entrada).getTime()) / 60000))} min
                </p>
              </div>
              <button
                onClick={() => onChamarSugerido(suggestion.id, mesa.id)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Chamar
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 italic">
              Nenhum cliente compatível aguardando na fila.
            </p>
          )}
        </div>
      )}

      {/* Edit Form for Waiter marking Ready */}
      {isMarkingReady && (
        <form onSubmit={handleSaveReady} className="mt-4 pt-3 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold text-slate-700">Configurar Mesa para Liberar</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Mesa Nº</label>
              <input
                type="text"
                value={numeroMesa}
                onChange={e => setNumeroMesa(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Setor</label>
              <input
                type="text"
                value={setor}
                onChange={e => setSetor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Cap. Máxima</label>
              <input
                type="number"
                min="1"
                max="20"
                value={capMax}
                onChange={e => setCapMax(Number(e.target.value))}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Cap. Ideal</label>
              <input
                type="number"
                min="1"
                max="20"
                value={capIdeal}
                onChange={e => setCapIdeal(Number(e.target.value))}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">Observações / Notas</label>
            <input
              type="text"
              value={obs}
              onChange={e => setObs(e.target.value)}
              placeholder="Ex: Perto do bar, recém limpa"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs"
            />
          </div>

          <div className="flex gap-2 pt-1.5">
            <button
              type="button"
              onClick={() => setIsMarkingReady(false)}
              className="flex-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Liberar
            </button>
          </div>
        </form>
      )}

      {/* Button Actions for employees */}
      {!isMarkingReady && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between gap-1 flex-wrap">
          {/* Admin editing/deleting */}
          {showAdminActions && (
            <div className="flex gap-1.5 w-full justify-end mb-2">
              <button
                onClick={() => onEditMesa?.(mesa)}
                className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-all"
                title="Editar Mesa"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteMesa?.(mesa.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                title="Excluir Mesa"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Waiter workflow actions */}
          <div className="flex gap-1.5 w-full">
            {mesa.status_atual === 'ocupada' && (
              <button
                onClick={() => onAlterarStatus(mesa.id, 'conta_solicitada')}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-amber-500/10 cursor-pointer"
              >
                Pedir Conta
              </button>
            )}

            {mesa.status_atual === 'conta_solicitada' && (
              <button
                onClick={() => onAlterarStatus(mesa.id, 'em_pagamento')}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-500/10 cursor-pointer"
              >
                Registrar Pagamento
              </button>
            )}

            {mesa.status_atual === 'em_pagamento' && (
              <button
                onClick={() => onAlterarStatus(mesa.id, 'em_preparo')}
                className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 text-xs font-bold rounded-xl transition-all shadow-sm shadow-yellow-500/10 cursor-pointer flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Mesa em Preparo
              </button>
            )}

            {mesa.status_atual === 'em_preparo' && (
              <button
                type="button"
                onClick={() => {
                  setNumeroMesa(mesa.numero_mesa);
                  setCapMax(mesa.capacidade_maxima);
                  setCapIdeal(mesa.capacidade_ideal || mesa.capacidade_maxima);
                  setSetor(mesa.setor_ou_area);
                  setObs(mesa.observacoes || '');
                  setIsMarkingReady(true);
                }}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-indigo-600/15 cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Marcar Pronta
              </button>
            )}

            {mesa.status_atual === 'reservada' && clienteReservado && clienteReservado.status === 'chegou' && (
              <button
                onClick={() => onSentarCliente(clienteReservado.id)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-emerald-600/15 cursor-pointer flex items-center justify-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                Cliente Sentou
              </button>
            )}

            {mesa.status_atual === 'livre' && (
              <button
                onClick={() => onAlterarStatus(mesa.id, 'em_preparo')}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Preparar Mesa
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
