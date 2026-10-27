import { annualRoutePrices } from '../../data/neighborhoods';
import type { NeighborhoodId, PriceBreakdown, PricingInput } from '../../types/domain';

export const AFTER_SCHOOL_ADDITION = 1800;

export class PricingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PricingError';
  }
}

function getPrice(input: PricingInput, neighborhoodId: NeighborhoodId | ''): number {
  if (!neighborhoodId) throw new PricingError('Selecione o bairro necessário para esta rota.');
  const routePrices: Partial<Record<NeighborhoodId, number>> = annualRoutePrices[input.routeType];
  const value = routePrices[neighborhoodId];
  if (!value) throw new PricingError('Valor do bairro não encontrado para a rota selecionada.');
  return value;
}

export function calculateContractPrice(input: PricingInput): PriceBreakdown {
  if (input.studentCount < 1 || input.studentCount > 3) {
    throw new PricingError('Informe de 1 a 3 crianças.');
  }

  const baseService = input.serviceType === 'contra_turno' ? 'ida_volta' : input.serviceType;
  let routeBase = 0;

  if (baseService === 'ida_volta') {
    routeBase = getPrice(input, input.outboundNeighborhoodId) * 0.5
      + getPrice(input, input.returnNeighborhoodId) * 0.5;
  }
  if (baseService === 'so_ida') routeBase = getPrice(input, input.outboundNeighborhoodId) * 0.7;
  if (baseService === 'so_volta') routeBase = getPrice(input, input.returnNeighborhoodId) * 0.7;

  const subtotalForStudents = routeBase * input.studentCount;
  const siblingDiscountRate = input.studentCount >= 2
    ? (input.sameSchool === 'sim' ? 0.1 : 0.05)
    : 0;
  let total = subtotalForStudents * (1 - siblingDiscountRate);

  const hasAfterSchool = input.serviceType === 'contra_turno';
  if (hasAfterSchool && !input.afterSchoolId) throw new PricingError('Selecione a escola do contra turno.');

  const afterSchoolAddition = hasAfterSchool ? AFTER_SCHOOL_ADDITION : 0;
  const afterSchoolDiscountRate = hasAfterSchool ? 0.05 : 0;
  if (hasAfterSchool) {
    total += AFTER_SCHOOL_ADDITION;
    total *= 0.95;
  }

  const cashDiscountRate = input.installments === 1 ? 0.05 : 0;
  if (input.installments === 1) total *= 0.95;

  return {
    routeBase, subtotalForStudents, siblingDiscountRate, afterSchoolAddition,
    afterSchoolDiscountRate, cashDiscountRate, total,
    installmentValue: total / input.installments,
  };
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
