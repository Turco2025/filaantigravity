import React, { useState, useEffect } from 'react';
import type { FilaCliente, Mesa } from '../types';
import { BadgeStatus } from './BadgeStatus';
import { Clock, Users, MessageSquare, Compass, Bell, Check, UserCheck, XCircle, Trash } from 'lucide-react';

interface CardClienteFilaProps {
  cliente: FilaCliente;
  mesasDisponiveis: Mesa[];
  onChamar: (clienteId: string, mesaId: string) => void;
  onChegou: (clienteId: string) => void;
  onSentar: (clienteId: string) => void;
  onRemover: (clienteId: string, statusFinal: 'cancelado' | 'ausente') => void;
}

export const CardClienteFila: React.FC<CardClienteFilaProps> = ({
  cliente,
  mesasDisponiveis,
  onChamar,
  onChegou,
  onSentar,
  onRemover,
}) => {

  const [minutosPassados, setMinutosPassados] = useState(0);
  const [showCallMenu, setShowCallMenu] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const entrada = new Date(cliente.horario_entrada).getTime();
      const agora = Date.now();
      setMinutosPassados(Math.max(0, Math.floor((agora - entrada) / 60000)));
    };

    calculateTime();
    const interval = setInterval(calculateTime, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [cliente.horario_entrada]);

  // Parse notes to render tags
  const tags: string[] = [];
  const notesLower = cliente.observacoes.toLowerCase();
  
  if (notesLower.includes('criança') || notesLower.includes('crianca')) tags.push('Criança');
  if (notesLower.includes('cadeira') || notesLower.includes('cadeirante')) tags.push('Cadeirante');
  if (notesLower.includes('carrinho') || notesLower.includes('bebê') || notesLower.includes('bebe')) tags.push('Carrinho Bebê');
  if (notesLower.includes('varanda') || notesLower.includes('externa')) tags.push('Varanda');
  if (notesLower.includes('interna') || notesLower.includes('interno')) tags.push('Área Interna');

  // Find compatible ready tables for this client
  const mesasProntasCompativeis = mesasDisponiveis.filter(m => {
    if (m.status_atual !== 'pronta') return false;
    if (m.capacidade_maxima < cliente.quantidade_pessoas) return false;
    // Check if this client would be suggested or is compatible
    const diff = m.capacidade_maxima - cliente.quantidade_pessoas;
    if (diff > 2) return false; // Allow at most 2 extra seats for general match in UI
    return true;
  });

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 ${
      cliente.status === 'chamado' 
        ? 'bg-amber-500/5 border-amber-500/30 ring-1 ring-amber-400/20' 
        : cliente.status === 'chegou'
        ? 'bg-indigo-500/5 border-indigo-500/30'
        : 'bg-white border-slate-200/80 shadow-xs hover:shadow-md'
    }`}>
      {/* Top Header info */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <div>
          <h4 className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
            {cliente.nome_cliente}
            <BadgeStatus status={cliente.status} type="cliente" />
          </h4>
          <p className="text-xs text-slate-500 font-mono mt-0.5">WhatsApp: {cliente.whatsapp}</p>
        </div>
        <div className="flex flex-col items-end text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            {minutosPassados} min
          </span>
          <span className="text-[10px] text-slate-400 mt-1">
            Entrou às {new Date(cliente.horario_entrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Main Stats (Guests / Notes) */}
      <div className="flex flex-wrap gap-1.5 items-center my-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-brand-50 text-brand-600 border border-brand-100">
          <Users className="w-3.5 h-3.5 mr-1" />
          {cliente.quantidade_pessoas} {cliente.quantidade_pessoas === 1 ? 'pessoa' : 'pessoas'}
        </span>

        {tags.map((tag, idx) => (
          <span key={idx} className="px-2 py-1 rounded-xl text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            {tag}
          </span>
        ))}
      </div>

      {cliente.observacoes && (
        <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>{cliente.observacoes}</span>
        </div>
      )}

      {/* Destination mesa details if called / arrived */}
      {cliente.mesa_destinada_id && (
        <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between text-xs ${
          cliente.status === 'chegou'
            ? 'bg-indigo-500/10 text-indigo-800 border-indigo-500/20'
            : 'bg-amber-500/10 text-amber-800 border-amber-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 shrink-0" />
            <div>
              <span className="font-semibold">Direcionado para a Mesa {cliente.numero_mesa_destinada}</span>
              <p className="text-[10px] opacity-80">Confirme a mesa após o cliente se sentar.</p>
            </div>
          </div>
        </div>
      )}

      {/* Context Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-between items-center">
        {/* Left cancellation buttons */}
        <div className="flex gap-1.5">
          {cliente.status !== 'sentado' && cliente.status !== 'cancelado' && (
            <>
              <button
                onClick={() => onRemover(cliente.id, 'cancelado')}
                title="Cancelar Fila"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
              >
                <XCircle className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => onRemover(cliente.id, 'ausente')}
                title="Marcar Ausente"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200"
              >
                <Trash className="w-4.5 h-4.5" />
              </button>
            </>
          )}
        </div>

        {/* Right action buttons */}
        <div className="flex gap-2">
          {cliente.status === 'aguardando' && (
            <div className="relative">
              <button
                onClick={() => setShowCallMenu(!showCallMenu)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                Chamar Cliente
              </button>

              {showCallMenu && (
                <div className="absolute right-0 bottom-11 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <p className="text-[10px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Mesas Disponíveis Prontas
                  </p>
                  {mesasProntasCompativeis.length === 0 ? (
                    <p className="text-xs text-slate-500 px-3 py-2">
                      Nenhuma mesa PRONTA compatível.
                    </p>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {mesasProntasCompativeis.map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            onChamar(cliente.id, m.id);
                            setShowCallMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-xl flex items-center justify-between border border-transparent hover:border-slate-100 transition-all"
                        >
                          <div>
                            <span className="font-semibold text-slate-700">Mesa {m.numero_mesa}</span>
                            <span className="text-[10px] text-slate-400 ml-1.5">({m.setor_ou_area})</span>
                          </div>
                          <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            Cap: {m.capacidade_maxima}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Option for manual override call */}
                  <div className="pt-2 border-t border-slate-100 mt-1">
                    <p className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider mb-1">
                      Todas as Mesas Livres
                    </p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {mesasDisponiveis
                        .filter(m => m.status_atual === 'livre')
                        .map(m => (
                          <button
                            key={m.id}
                            onClick={() => {
                              onChamar(cliente.id, m.id);
                              setShowCallMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 rounded-xl flex items-center justify-between border border-transparent hover:border-amber-100 transition-all text-slate-600"
                          >
                            <span>Mesa {m.numero_mesa} ({m.setor_ou_area})</span>
                            <span className="text-[10px] font-bold">Cap: {m.capacidade_maxima}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {cliente.status === 'chamado' && (
            <button
              onClick={() => onChegou(cliente.id)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Cliente Chegou
            </button>
          )}

          {cliente.status === 'chegou' && (
            <button
              onClick={() => onSentar(cliente.id)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Cliente Sentado
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
