import type { Neighborhood, NeighborhoodId, RouteType } from '../types/domain';

export const neighborhoods: readonly Neighborhood[] = [
  { id: 'Canhema', name: 'Canhema', city: 'Diadema' },
  { id: 'TaboaoDiadema', name: 'Taboão', city: 'Diadema' },
  { id: 'Nacoes', name: 'Nações', city: 'Diadema' },
  { id: 'VilaOriental', name: 'Vila Oriental', city: 'Diadema' },
  { id: 'VilaAlice', name: 'Vila Alice', city: 'Diadema' },
  { id: 'SantaCruz', name: 'Santa Cruz', city: 'Diadema' },
  { id: 'JdABC', name: 'Jardim ABC', city: 'Diadema' },
  { id: 'JdTakebe', name: 'Jardim Takebe', city: 'Diadema' },
  { id: 'VilaFlorida', name: 'Vila Flórida', city: 'São Bernardo do Campo' },
  { id: 'Borborema', name: 'Borborema', city: 'São Bernardo do Campo' },
  { id: 'Pauliceia', name: 'Paulicéia', city: 'São Bernardo do Campo' },
  { id: 'VilaSantaLuzia', name: 'Vila Santa Luzia', city: 'São Bernardo do Campo' },
  { id: 'TaboaoSBC', name: 'Taboão (SBC)', city: 'São Bernardo do Campo' },
] as const;

// Fonte de verdade copiada sem alteração de assets/js/app.js.
export const annualRoutePrices = {
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
} as const satisfies Record<RouteType, Partial<Record<NeighborhoodId, number>>>;
