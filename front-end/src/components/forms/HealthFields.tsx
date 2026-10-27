import type { HealthInformation } from '../../types/domain';

interface HealthFieldsProps { value: HealthInformation; onChange: (value: HealthInformation) => void }
const labels: Record<keyof HealthInformation, string> = { allergies: 'Alergias', comorbidities: 'Comorbidades', syndromes: 'Síndromes', disorders: 'Transtornos', physicalLimitations: 'Limitações físicas' };

export function HealthFields({ value, onChange }: HealthFieldsProps) {
  return <div className="grid gap-5 sm:grid-cols-2">{(Object.keys(labels) as (keyof HealthInformation)[]).map((key) => <label key={key}><span className="field-label">{labels[key]}</span><textarea className="field-control min-h-24 resize-y" value={value[key]} onChange={(event) => onChange({ ...value, [key]: event.target.value })} placeholder="Não possui" /></label>)}</div>;
}
