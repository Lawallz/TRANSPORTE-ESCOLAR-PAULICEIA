import { describe, expect, it } from 'vitest';
import { annualRoutePrices } from '../../data/neighborhoods';
import type { PricingInput } from '../../types/domain';
import { calculateContractPrice } from './pricingEngine';

const baseInput: PricingInput = {
  routeType: 'diurna', serviceType: 'ida_volta', outboundNeighborhoodId: 'Pauliceia',
  returnNeighborhoodId: 'VilaAlice', studentCount: 1, sameSchool: 'sim',
  afterSchoolId: '', installments: 12,
};

describe('compatibilidade com o cálculo legado', () => {
  it('congela a tabela anual vigente', () => {
    expect(annualRoutePrices).toEqual({
      diurna: {
        Pauliceia: 2880, VilaAlice: 3000, VilaOriental: 3000, Canhema: 3000,
        SantaCruz: 3000, JdTakebe: 3000, JdABC: 3000, VilaFlorida: 3000,
        Borborema: 3000, TaboaoDiadema: 3120, TaboaoSBC: 3240, Nacoes: 3360,
        VilaSantaLuzia: 3240,
      },
      fausto: {
        Pauliceia: 3720, Canhema: 3840, JdABC: 3960, JdTakebe: 3960,
        VilaFlorida: 4080, Borborema: 4080, TaboaoDiadema: 4080,
      },
    });
  });

  it('mantém a regra 50% ida + 50% volta', () => {
    expect(calculateContractPrice(baseInput).total).toBe(2940);
  });
  it('mantém 70% do bairro para somente ida', () => {
    expect(calculateContractPrice({ ...baseInput, serviceType: 'so_ida' }).total).toBeCloseTo(2016);
  });
  it('mantém 10% para irmãos na mesma escola/horário', () => {
    expect(calculateContractPrice({ ...baseInput, studentCount: 2 }).total).toBe(5292);
  });
  it('mantém 5% para irmãos em escolas/horários diferentes', () => {
    expect(calculateContractPrice({ ...baseInput, studentCount: 2, sameSchool: 'nao' }).total).toBe(5586);
  });
  it('mantém a ordem do adicional e desconto de contraturno', () => {
    expect(calculateContractPrice({ ...baseInput, serviceType: 'contra_turno', afterSchoolId: 'iam' }).total).toBe(4503);
  });
  it('aplica o desconto à vista somente no final', () => {
    expect(calculateContractPrice({ ...baseInput, serviceType: 'contra_turno', afterSchoolId: 'iam', installments: 1 }).total).toBeCloseTo(4277.85);
  });
});
