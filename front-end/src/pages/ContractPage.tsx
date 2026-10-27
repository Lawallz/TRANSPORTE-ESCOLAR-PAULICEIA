import { useMemo, useState } from 'react';
import { FileCheck2 } from 'lucide-react';
import { PriceSummary } from '../components/contract/PriceSummary';
import { FormSection } from '../components/forms/FormSection';
import { GuardianFields } from '../components/forms/GuardianFields';
import { HealthFields } from '../components/forms/HealthFields';
import { RouteFields } from '../components/forms/RouteFields';
import { StudentFields } from '../components/forms/StudentFields';
import { calculateContractPrice } from '../features/pricing/pricingEngine';
import type { ContractFormData } from '../types/domain';

const initialForm: ContractFormData = {
  guardian: { name: '', cpf: '', phone: '', address: '' },
  students: [{ id: 'student-1', name: '', cpf: '', schoolId: '' }],
  sameSchool: 'sim',
  route: { routeType: 'diurna', serviceType: 'ida_volta', shift: 'manha', outboundNeighborhoodId: '', returnNeighborhoodId: '', afterSchoolId: '' },
  health: { allergies: '', comorbidities: '', syndromes: '', disorders: '', physicalLimitations: '' },
  serviceStartDate: '', signature: '', installments: 12, objections: '',
};

export function ContractPage() {
  const [form, setForm] = useState<ContractFormData>(initialForm);
  const pricing = useMemo(() => {
    try {
      return { price: calculateContractPrice({ routeType: form.route.routeType, serviceType: form.route.serviceType, outboundNeighborhoodId: form.route.outboundNeighborhoodId, returnNeighborhoodId: form.route.returnNeighborhoodId, studentCount: form.students.length, sameSchool: form.sameSchool, afterSchoolId: form.route.afterSchoolId, installments: form.installments }), error: '' };
    } catch (error) {
      return { price: null, error: error instanceof Error ? error.message : 'Não foi possível calcular.' };
    }
  }, [form.installments, form.route, form.sameSchool, form.students.length]);

  return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="mb-9 max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700"><FileCheck2 size={17} />Simulação e contrato</span><h1 className="mt-4 text-3xl font-black tracking-tight text-brand-900 sm:text-5xl">Organize os dados da rota em poucos passos</h1><p className="mt-4 text-lg leading-8 text-slate-600">A interface mudou. As regras de preço não: o cálculo foi isolado e protegido por testes de compatibilidade.</p></div><div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]"><form className="space-y-6" onSubmit={(event) => event.preventDefault()}><FormSection number={1} title="Responsável" description="Dados de contato e identificação"><GuardianFields value={form.guardian} onChange={(guardian) => setForm((current) => ({ ...current, guardian }))} /></FormSection><FormSection number={2} title="Alunos e escolas" description="Cadastre de uma a três crianças"><StudentFields students={form.students} sameSchool={form.sameSchool} onStudentsChange={(students) => setForm((current) => ({ ...current, students }))} onSameSchoolChange={(sameSchool) => setForm((current) => ({ ...current, sameSchool }))} /></FormSection><FormSection number={3} title="Rota e pagamento" description="Os mesmos bairros, turnos e serviços atuais"><RouteFields route={form.route} installments={form.installments} onRouteChange={(route) => setForm((current) => ({ ...current, route }))} onInstallmentsChange={(installments) => setForm((current) => ({ ...current, installments }))} /></FormSection><FormSection number={4} title="Saúde e consentimento" description="Informações usadas exclusivamente para a segurança do aluno"><HealthFields value={form.health} onChange={(health) => setForm((current) => ({ ...current, health }))} /><div className="mt-5 grid gap-5 sm:grid-cols-2"><label><span className="field-label">Início do serviço</span><input className="field-control" type="date" value={form.serviceStartDate} onChange={(event) => setForm((current) => ({ ...current, serviceStartDate: event.target.value }))} /></label><label><span className="field-label">Assinatura do responsável</span><input className="field-control" value={form.signature} onChange={(event) => setForm((current) => ({ ...current, signature: event.target.value }))} /></label><label className="sm:col-span-2"><span className="field-label">Observações ou contestações</span><textarea className="field-control min-h-24" value={form.objections} onChange={(event) => setForm((current) => ({ ...current, objections: event.target.value }))} /></label></div><button className="primary-button mt-6 w-full" type="submit" disabled={!pricing.price}>Gerar prévia do contrato</button></FormSection></form><PriceSummary price={pricing.price} error={pricing.error} installments={form.installments} /></div></div>;
}
