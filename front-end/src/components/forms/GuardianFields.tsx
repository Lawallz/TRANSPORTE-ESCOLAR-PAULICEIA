import type { Guardian } from '../../types/domain';

interface GuardianFieldsProps { value: Guardian; onChange: (value: Guardian) => void }

export function GuardianFields({ value, onChange }: GuardianFieldsProps) {
  const field = (key: keyof Guardian, next: string) => onChange({ ...value, [key]: next });
  return <div className="grid gap-5 sm:grid-cols-2"><label><span className="field-label">Nome completo</span><input className="field-control" value={value.name} onChange={(event) => field('name', event.target.value)} autoComplete="name" /></label><label><span className="field-label">CPF</span><input className="field-control" value={value.cpf} onChange={(event) => field('cpf', event.target.value)} inputMode="numeric" placeholder="000.000.000-00" /></label><label><span className="field-label">Telefone</span><input className="field-control" value={value.phone} onChange={(event) => field('phone', event.target.value)} type="tel" autoComplete="tel" /></label><label><span className="field-label">Endereço</span><input className="field-control" value={value.address} onChange={(event) => field('address', event.target.value)} autoComplete="street-address" /></label></div>;
}
