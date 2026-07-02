import React from 'react';
import type { HistoricoAtendimento } from '../types';
import { Clock, CheckCircle2, UserX, BarChart2, Calendar, Smile } from 'lucide-react';

interface DashboardRelatoriosProps {
  historico: HistoricoAtendimento[];
}

export const DashboardRelatorios: React.FC<DashboardRelatoriosProps> = ({ historico }) => {
  // Calculations
  const atendidos = historico.filter(h => h.status_final === 'atendido');
  const ausentes = historico.filter(h => h.status_final === 'ausente');

  
  const tempoMedioEspera = atendidos.length 
    ? Math.round(atendidos.reduce((sum, h) => sum + h.tempo_total_espera, 0) / atendidos.length) 
    : 0;

  // Most used tables calculation
  const mesaFrequencia: Record<string, number> = {};
  historico.forEach(h => {
    if (h.numero_mesa) {
      mesaFrequencia[h.numero_mesa] = (mesaFrequencia[h.numero_mesa] || 0) + 1;
    }
  });

  const mesasMaisUtilizadas = Object.entries(mesaFrequencia)
    .map(([numero, count]) => ({ numero, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxTableUsage = mesasMaisUtilizadas.length ? Math.max(...mesasMaisUtilizadas.map(m => m.count)) : 1;

  // Mock peak hours (grouped by typical times)
  const peakHours = [
    { hour: '12h - 13h', count: 18, color: 'bg-indigo-500' },
    { hour: '13h - 14h', count: 24, color: 'bg-indigo-600' },
    { hour: '14h - 15h', count: 12, color: 'bg-indigo-400' },
    { hour: '19h - 20h', count: 32, color: 'bg-brand-600' },
    { hour: '20h - 21h', count: 40, color: 'bg-brand-600 animate-pulse' },
    { hour: '21h - 22h', count: 28, color: 'bg-indigo-500' },
  ];
  
  const maxHourCount = Math.max(...peakHours.map(h => h.count));

  return (
    <div className="space-y-6">
      
      {/* Row 1: Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Avg Wait Time */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Tempo Médio Espera
            </span>
            <span className="text-2xl font-extrabold text-slate-800">
              {tempoMedioEspera} min
            </span>
          </div>
        </div>

        {/* Metric 2: Seated / Attended */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Atendidos
            </span>
            <span className="text-2xl font-extrabold text-slate-800">
              {atendidos.length} grupos
            </span>
          </div>
        </div>

        {/* Metric 3: Absent */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Clientes Ausentes
            </span>
            <span className="text-2xl font-extrabold text-slate-800">
              {ausentes.length}
            </span>
          </div>
        </div>

        {/* Metric 4: Satisfaction / Conversion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Taxa Conclusão
            </span>
            <span className="text-2xl font-extrabold text-slate-800">
              {historico.length 
                ? Math.round((atendidos.length / historico.length) * 100) 
                : 100}%
            </span>
          </div>
        </div>

      </div>

      {/* Row 2: Charts and Tables usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Peak Hours Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-6 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-brand-600" />
            Horários de Maior Movimento
          </h3>
          
          <div className="flex justify-between items-end h-48 pt-4 gap-2">
            {peakHours.map((h, i) => {
              const heightPercent = Math.max(8, Math.round((h.count / maxHourCount) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500">{h.count}</span>
                  <div 
                    style={{ height: `${heightPercent}%` }} 
                    className={`w-full rounded-t-lg transition-all duration-500 shadow-xs ${h.color}`}
                  ></div>
                  <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                    {h.hour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Used Tables */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-6 uppercase tracking-wider">
            <BarChart2 className="w-4 h-4 text-indigo-600" />
            Mesas Mais Utilizadas
          </h3>

          <div className="space-y-4">
            {mesasMaisUtilizadas.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">
                Sem dados de mesas suficientes.
              </p>
            ) : (
              mesasMaisUtilizadas.map((table, idx) => {
                const percent = Math.round((table.count / maxTableUsage) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Mesa {table.numero}</span>
                      <span>{table.count} atendimentos</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${percent}%` }}
                        className="h-full bg-gradient-to-r from-brand-500 to-indigo-600 rounded-full transition-all duration-500"
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
