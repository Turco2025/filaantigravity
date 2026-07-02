import React from 'react';

interface FiltrosPorQuantidadePessoasProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FiltrosPorQuantidadePessoas: React.FC<FiltrosPorQuantidadePessoasProps> = ({
  selectedFilter,
  onFilterChange
}) => {
  const options = [
    { value: 'all', label: 'Todos os Grupos' },
    { value: '1-2', label: '1 - 2 Pessoas' },
    { value: '3-4', label: '3 - 4 Pessoas' },
    { value: '5-6', label: '5 - 6 Pessoas' },
    { value: '7+', label: '7+ Pessoas' },
  ];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium text-slate-500 mr-1">Filtrar por Tamanho:</span>
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        {options.map((option) => {
          const isActive = selectedFilter === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-brand-600 shadow-sm border-transparent'
                  : 'text-slate-600 hover:text-slate-800 border-transparent hover:bg-slate-200/50'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
