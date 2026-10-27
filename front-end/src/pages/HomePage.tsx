import { ArrowRight, Clock3, HeartHandshake, MapPinned, ShieldCheck } from 'lucide-react';
import heroUrl from '../../assets/img/vans.jpeg';

interface HomePageProps { onSimulate: () => void }

const benefits = [
  { icon: ShieldCheck, title: 'Segurança de verdade', text: 'Vans credenciadas, revisadas e equipes experientes.' },
  { icon: Clock3, title: 'Rotina pontual', text: 'Rotas organizadas por escola e acompanhamento pelo WhatsApp.' },
  { icon: HeartHandshake, title: 'Cuidado próximo', text: 'Mais de 20 anos acompanhando crianças e suas famílias.' },
];

export function HomePage({ onSimulate }: HomePageProps) {
  return (
    <>
      <section className="overflow-hidden bg-brand-900 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-brand-100"><MapPinned size={16} />Paulicéia e região</span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">O caminho até a escola também precisa ser seguro.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-100">Há mais de 20 anos, cuidamos da rotina escolar com pontualidade, proximidade e atenção em cada embarque.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button className="primary-button !bg-sun-400 !text-brand-900 hover:!bg-sun-500" onClick={onSimulate}>Simular valor <ArrowRight size={19} /></button><a className="secondary-button !border-white/30 !bg-white/10 !text-white hover:!bg-white/20" href="https://wa.me/5511940327711" target="_blank" rel="noreferrer">Conversar no WhatsApp</a></div>
          </div>
          <div className="relative"><div className="absolute -inset-5 rounded-[2.5rem] bg-sun-400/20 blur-2xl" /><img className="relative aspect-[4/3] w-full rounded-[2rem] border border-white/15 object-cover shadow-2xl" src={heroUrl} alt="Vans do Transporte Escolar Paulicéia" /></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[.18em] text-brand-500">Nossa história</p><h2 className="mt-3 text-3xl font-black text-brand-900 sm:text-4xl">Uma relação construída com as famílias</h2><p className="mt-5 text-lg leading-8 text-slate-600">O Transporte Escolar Paulicéia nasceu do compromisso de tornar o trajeto escolar mais tranquilo. São mais de duas décadas unindo experiência, veículos preparados e contato próximo com responsáveis.</p></div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{benefits.map(({ icon: Icon, title, text }) => <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" key={title}><span className="inline-flex rounded-xl bg-brand-50 p-3 text-brand-700"><Icon /></span><h3 className="mt-5 text-xl font-extrabold text-brand-900">{title}</h3><p className="mt-2 leading-7 text-slate-600">{text}</p></article>)}</div>
      </section>
      <section className="mx-4 mb-16 rounded-3xl bg-sun-400 px-6 py-12 text-center sm:mx-6 lg:mx-auto lg:max-w-7xl"><h2 className="text-3xl font-black text-brand-900">Planeje o próximo ano letivo</h2><p className="mx-auto mt-3 max-w-2xl text-brand-900/75">Preencha os dados da rota e veja a simulação usando exatamente as regras atuais do contrato.</p><button className="primary-button mt-7" onClick={onSimulate}>Começar simulação <ArrowRight size={19} /></button></section>
    </>
  );
}
