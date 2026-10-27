export type RouteType = 'diurna' | 'fausto';
export type ServiceType = 'ida_volta' | 'so_ida' | 'so_volta' | 'contra_turno';
export type SchoolShift = 'manha' | 'tarde' | 'integral';
export type Installments = 1 | 2 | 4 | 6 | 12;
export type SameSchool = 'sim' | 'nao';
export type City = 'Diadema' | 'São Bernardo do Campo';

export type NeighborhoodId =
  | 'Canhema' | 'TaboaoDiadema' | 'Nacoes' | 'VilaOriental' | 'VilaAlice'
  | 'SantaCruz' | 'JdABC' | 'JdTakebe' | 'VilaFlorida' | 'Borborema'
  | 'Pauliceia' | 'VilaSantaLuzia' | 'TaboaoSBC';

export interface Neighborhood { id: NeighborhoodId; name: string; city: City }
export interface School { id: string; name: string; category: 'publica' | 'particular'; acceptsAfterSchool?: boolean }
export interface Student { id: string; name: string; cpf?: string; schoolId: string }
export interface Guardian { name: string; cpf: string; phone: string; address: string }

export interface HealthInformation {
  allergies: string;
  comorbidities: string;
  syndromes: string;
  disorders: string;
  physicalLimitations: string;
}

export interface RouteSelection {
  routeType: RouteType;
  serviceType: ServiceType;
  shift: SchoolShift;
  outboundNeighborhoodId: NeighborhoodId | '';
  returnNeighborhoodId: NeighborhoodId | '';
  afterSchoolId: string;
}

export interface ContractFormData {
  guardian: Guardian;
  students: Student[];
  sameSchool: SameSchool;
  route: RouteSelection;
  health: HealthInformation;
  serviceStartDate: string;
  signature: string;
  installments: Installments;
  objections: string;
}

export interface PricingInput {
  routeType: RouteType;
  serviceType: ServiceType;
  outboundNeighborhoodId: NeighborhoodId | '';
  returnNeighborhoodId: NeighborhoodId | '';
  studentCount: number;
  sameSchool: SameSchool;
  afterSchoolId: string;
  installments: Installments;
}

export interface PriceBreakdown {
  routeBase: number;
  subtotalForStudents: number;
  siblingDiscountRate: 0 | 0.05 | 0.1;
  afterSchoolAddition: number;
  afterSchoolDiscountRate: 0 | 0.05;
  cashDiscountRate: 0 | 0.05;
  total: number;
  installmentValue: number;
}

export interface ContractDocument {
  form: ContractFormData;
  price: PriceBreakdown;
  generatedAt: string;
  consentAccepted: boolean;
}
