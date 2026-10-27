import { useState } from 'react';
import { Header } from './components/layout/Header';
import { ContractPage } from './pages/ContractPage';
import { HomePage } from './pages/HomePage';

export type AppPage = 'home' | 'contract';

export function App() {
  const [page, setPage] = useState<AppPage>('home');

  const navigate = (nextPage: AppPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Header currentPage={page} onNavigate={navigate} />
      <main>
        {page === 'home' ? (
          <HomePage onSimulate={() => navigate('contract')} />
        ) : (
          <ContractPage />
        )}
      </main>
    </div>
  );
}
