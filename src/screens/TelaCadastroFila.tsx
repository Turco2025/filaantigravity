import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { Users, Phone, User, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';

export const TelaCadastroFila: React.FC = () => {
  const { adicionarClienteNaFila, setActiveRole } = useQueue();
  
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [quantidade, setQuantidade] = useState(2);
  
  // Custom quick observation toggles
  const [comCrianca, setComCrianca] = useState(false);
  const [cadeirante, setCadeirante] = useState(false);
  const [carrinhoBebe, setCarrinhoBebe] = useState(false);
  const [areaExterna, setAreaExterna] = useState(false);
  const [areaInterna, setAreaInterna] = useState(false);
  const [customObs, setCustomObs] = useState('');

  const handleGuestsChange = (value: number) => {
    setQuantidade(Math.max(1, Math.min(15, value)));
  };



  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setWhatsapp(raw.replace(/\D/g, ''));
  };

  const getDisplayWhatsapp = () => {
    if (!whatsapp) return '';
    const clean = whatsapp;
    if (clean.length === 11) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
    }
    if (clean.length === 10) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
    }
    return clean;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !whatsapp.trim()) return;

    // Build notes string from toggles
    const notesArray: string[] = [];
    if (comCrianca) notesArray.push('Precisa de Cadeirão');
    if (cadeirante) notesArray.push('Cadeirante');
    if (carrinhoBebe) notesArray.push('Espaço para Carrinho de bebê');
    if (areaExterna) notesArray.push('Área Externa/Varanda');
    if (areaInterna) notesArray.push('Área Interna');
    if (customObs.trim()) notesArray.push(customObs.trim());

    const finalNotes = notesArray.join(', ');

    adicionarClienteNaFila(nome.trim(), getDisplayWhatsapp(), quantidade, finalNotes);
  };

  return (
    <div className="max-w-md mx-auto py-6 px-4 space-y-6 animate-in fade-in duration-300">
      
      {/* Back button to simulated scanner */}
      <button
        onClick={() => setActiveRole('recepcao')}
        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Voltar ao Portal
      </button>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
        
        {/* Header Title */}
        <div className="space-y-1 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">
            Cadastrar na Fila
          </h2>
          <p className="text-xs text-slate-400">
            Preencha seus dados para receber notificações sobre sua mesa
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Seu Nome
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: João Silva"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-2xl text-sm font-semibold outline-hidden transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: (11) 99999-9999"
                value={getDisplayWhatsapp()}
                onChange={handlePhoneChange}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-2xl text-sm font-semibold outline-hidden transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Quantidade de Pessoas */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Quantidade de Pessoas no Grupo
            </label>
            <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 p-2 rounded-2xl">
              <button
                type="button"
                onClick={() => handleGuestsChange(quantidade - 1)}
                className="w-10 h-10 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-lg font-bold text-slate-700 transition-all flex items-center justify-center cursor-pointer select-none"
              >
                -
              </button>
              <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-base">
                <Users className="w-5 h-5 text-brand-500" />
                <span>{quantidade} {quantidade === 1 ? 'pessoa' : 'pessoas'}</span>
              </div>
              <button
                type="button"
                onClick={() => handleGuestsChange(quantidade + 1)}
                className="w-10 h-10 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-lg font-bold text-slate-700 transition-all flex items-center justify-center cursor-pointer select-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Observações / Necessidades */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Observações / Preferências
            </label>
            
            {/* Quick Option Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setComCrianca(!comCrianca)}
                className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                  comCrianca
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                👶 Com Criança
              </button>

              <button
                type="button"
                onClick={() => setCadeirante(!cadeirante)}
                className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                  cadeirante
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                ♿ Cadeirante
              </button>

              <button
                type="button"
                onClick={() => setCarrinhoBebe(!carrinhoBebe)}
                className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                  carrinhoBebe
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🛒 Carrinho Bebê
              </button>

              <button
                type="button"
                onClick={() => {
                  setAreaExterna(!areaExterna);
                  if (!areaExterna) setAreaInterna(false);
                }}
                className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                  areaExterna
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🌿 Varanda / Externa
              </button>

              <button
                type="button"
                onClick={() => {
                  setAreaInterna(!areaInterna);
                  if (!areaInterna) setAreaExterna(false);
                }}
                className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer col-span-2 ${
                  areaInterna
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🏠 Preferência por Área Interna
              </button>
            </div>

            {/* Custom Notes */}
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: Aniversariante do dia..."
                value={customObs}
                onChange={e => setCustomObs(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl text-xs outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            Entrar na Fila Digital
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
