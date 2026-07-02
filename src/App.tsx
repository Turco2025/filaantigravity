import React from 'react';
import { useQueue } from './context/QueueContext';
import { Header } from './components/Header';
import { TelaClienteQRCode } from './screens/TelaClienteQRCode';
import { TelaCadastroFila } from './screens/TelaCadastroFila';
import { TelaAcompanhamentoFila } from './screens/TelaAcompanhamentoFila';
import { PainelRecepcao } from './screens/PainelRecepcao';
import { PainelGarcom } from './screens/PainelGarcom';
import { PainelAdmin } from './screens/PainelAdmin';

const App: React.FC = () => {
  const { activeRole, activeClient } = useQueue();

  const renderContent = () => {
    switch (activeRole) {
      case 'cliente':
        // If they scanning QR Code and have not signed up, show signup. Otherwise tracking view.
        if (activeClient) {
          return <TelaAcompanhamentoFila />;
        }
        return <TelaCadastroFila />;
        
      case 'recepcao':
        return <PainelRecepcao />;
        
      case 'garcom':
        return <PainelGarcom />;
        
      case 'admin':
        return <PainelAdmin />;
        
      default:
        return <TelaClienteQRCode />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased text-slate-800">
      {/* Global Header with Profile Switcher */}
      <Header />
      
      {/* Dynamic Screen Workspace */}
      <div className="flex-1">
        {renderContent()}
      </div>

      {/* Floating Info / simulator helper */}
      <div className="fixed bottom-4 right-4 z-50 max-w-xs bg-white border border-slate-200 shadow-xl rounded-2xl p-4 hidden md:block">
        <h4 className="text-xs font-bold text-slate-800 mb-1">🚀 Guia Rápido do Simulador</h4>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Você pode simular toda a jornada. Clique nas abas no topo da tela para alterar entre perfis. Adicione clientes, limpe mesas como garçom e defina regras de tolerância como admin!
        </p>
      </div>
    </div>
  );
};

export default App;
