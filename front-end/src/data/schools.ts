import type { School } from '../types/domain';

export const schools: readonly School[] = [
  { id: 'emeb-julio-atlas', name: 'EMEB Escritor Júlio Atlas', category: 'publica' },
  { id: 'emeb-padre-fiorente', name: 'EMEB Padre Fiorente Elena', category: 'publica' },
  { id: 'emeb-caetano-campos', name: 'EMEB Caetano de Campos', category: 'publica' },
  { id: 'emeb-vicente-carvalho', name: 'EMEB Vicente de Carvalho', category: 'publica' },
  { id: 'creche-arlindo-ferreira', name: 'Creche Arlindo Ferreira', category: 'publica' },
  { id: 'ee-fausto-cardoso', name: 'EE Dr. Fausto Cardoso Figueira de Mello', category: 'publica' },
  { id: 'ee-ministro-laudo', name: 'EE Ministro Laudo Ferreira de Camargo', category: 'publica' },
  { id: 'instituto-jesue-frantz', name: 'Instituto Jêsue Frantz', category: 'publica' },
  { id: 'iam', name: 'Instituição Assistencial MeiMei (IAM)', category: 'publica', acceptsAfterSchool: true },
  { id: 'methodus', name: 'Colégio Methodus', category: 'particular' },
  { id: 'educare', name: 'Colégio Educare', category: 'particular' },
  { id: 'vittare', name: 'Colégio Vittare', category: 'particular' },
  { id: 'quintal-status', name: 'Quintal da Status', category: 'particular', acceptsAfterSchool: true },
  { id: 'alegria', name: 'Alegria Espaço Infantil', category: 'particular', acceptsAfterSchool: true },
] as const;

export const afterSchoolOptions = schools.filter((school) => school.acceptsAfterSchool);
