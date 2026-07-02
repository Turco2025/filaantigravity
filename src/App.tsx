import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './screens/LandingPage';
import { LoginSuperAdmin } from './screens/LoginSuperAdmin';
import { PainelSuperAdmin } from './screens/PainelSuperAdmin';
import { LoginFuncionario } from './screens/LoginFuncionario';
import { TelaCadastroFila } from './screens/TelaCadastroFila';
import { TelaAcompanhamentoFila } from './screens/TelaAcompanhamentoFila';
import { PainelRecepcao } from './screens/PainelRecepcao';
import { PainelGarcom } from './screens/PainelGarcom';
import { PainelAdmin } from './screens/PainelAdmin';
import { Header } from './components/Header';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased text-slate-800">
        
        {/* Global Header (Renders dynamically based on route and session) */}
        <Header />
        
        {/* Route switcher */}
        <div className="flex-1">
          <Routes>
            {/* SaaS Home Commercial Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* SaaS Owner Super Admin portal */}
            <Route path="/super-admin/login" element={<LoginSuperAdmin />} />
            <Route path="/super-admin" element={<PainelSuperAdmin />} />

            {/* Tenant Establishment Login portal */}
            <Route path="/r/:slug/login" element={<LoginFuncionario />} />

            {/* Tenant Client Queue portals (QR Code scans) */}
            <Route path="/r/:slug/cadastro" element={<TelaCadastroFila />} />
            <Route path="/r/:slug/fila/:clienteId" element={<TelaAcompanhamentoFila />} />

            {/* Tenant Staff Dashboards */}
            <Route path="/r/:slug/recepcao" element={<PainelRecepcao />} />
            <Route path="/r/:slug/garcom" element={<PainelGarcom />} />
            <Route path="/r/:slug/admin" element={<PainelAdmin />} />

            {/* Fallback redirection */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
};

export default App;
