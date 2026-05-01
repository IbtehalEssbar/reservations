import { Utilisateur } from '../entities/Utilisateur';

export interface IUtilisateurRepository {
  findById(id: number): Promise<Utilisateur | null>;
  findByClerkId(clerkId: string): Promise<Utilisateur | null>;
  findByEmail(email: string): Promise<Utilisateur | null>;
  create(user: Omit<Utilisateur, 'id'>): Promise<Utilisateur>;
  update(id: number, user: Partial<Utilisateur>): Promise<Utilisateur>;
}
