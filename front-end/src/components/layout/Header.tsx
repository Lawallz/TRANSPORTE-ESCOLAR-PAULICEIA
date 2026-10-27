import { Menu, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import type { AppPage } from '../../App';
import logoUrl from '../../../assets/img/logo-escolar.jpeg';

interface HeaderProps { currentPage: AppPage; onNavigate: (page: AppPage) => void }

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const go = (page: AppPage) => { onNavigate(page); setOpen(false); };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button className="flex items-center gap-3 text-left" onClick={() => go('home')} aria-label="Ir para o início">
          <img className="size-11 rounded-xl object-cover" src={logoUrl} alt="" />
          <span><span className="block text-sm font-extrabold text-brand-900">Transporte Escolar</span><span className="block text-xs font-semibold text-brand-500">Paulicéia</span></span>
        </button>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
          <button className={currentPage === 'home' ? 'font-bold text-brand-700' : 'font-semibold text-slate-600'} onClick={() => go('home')}>Início</button>
          <button className="primary-button !min-h-10 !px-4 !py-2" onClick={() => go('contract')}><ShieldCheck size={18} />Simular valor</button>
        </nav>
        <button className="rounded-lg p-2 text-brand-900 md:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Abrir menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? <nav className="grid gap-2 border-t border-slate-200 bg-white p-4 md:hidden" aria-label="Navegação móvel"><button className="secondary-button" onClick={() => go('home')}>Início</button><button className="primary-button" onClick={() => go('contract')}>Simular valor</button></nav> : null}
    </header>
  );
}
