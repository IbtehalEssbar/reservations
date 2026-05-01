import { Role } from '../enums';

export interface Utilisateur {
  id: number;
  clerkUserId: string;
  nom: string | null;
  email: string;
  motdp: string | null;
  role: Role;
  num_tele: string | null;
  CIN: string | null;
}
