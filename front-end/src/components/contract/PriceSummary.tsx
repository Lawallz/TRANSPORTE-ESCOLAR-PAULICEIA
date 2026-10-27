import { Calculator, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../features/pricing/pricingEngine';
import type { Installments, PriceBreakdown } from '../../types/domain';

interface PriceSummaryProps { price: PriceBreakdown | null; error: string; installments: Installments }

export function PriceSummary({ price, error, installments }: PriceSummaryProps) {
  return <aside className="lg:sticky lg:top-24 lg:self-start"><div className="overflow-hidden rounded-2xl border border-brand-900/10 bg-brand-900 text-white shadow-xl"><div className="border-b border-white/10 p-6"><Calculator className="text-sun-400" /><h2 className="mt-4 text-2xl font-black">Resumo da simulação</h2><p className="mt-2 text-sm leading-6 text-brand-100">Os valores abaixo vêm do motor de cálculo legado, agora isolado da interface.</p></div><div className="p-6">{price ? <><p className="text-sm font-semibold text-brand-100">Valor total</p><p className="mt-1 text-4xl font-black text-white">{formatCurrency(price.total)}</p><p className="mt-2 text-brand-100">{installments}x de <strong className="text-white">{formatCurrency(price.installmentValue)}</strong></p><ul className="mt-6 space-y-3 text-sm text-brand-100"><li className="flex gap-2"><CheckCircle2 className="shrink-0 text-sun-400" size={18} />Mesmas regras e mesma ordem de descontos</li><li className="flex gap-2"><CheckCircle2 className="shrink-0 text-sun-400" size={18} />Valor sujeito à confirmação da rota</li></ul></> : <div className="rounded-xl bg-white/10 p-4 text-sm leading-6 text-brand-100">{error || 'Preencha os bairros para visualizar o valor.'}</div>}</div></div></aside>;
}
