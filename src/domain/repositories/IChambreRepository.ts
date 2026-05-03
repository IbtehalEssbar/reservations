import { Chambre } from '../entities/Chambre';
import { StatutChambre } from '../enums';

export interface IChambreRepository {
  findAll(): Promise<Chambre[]>;
  findById(id: string): Promise<Chambre | null>;
  findByStatus(status: StatutChambre): Promise<Chambre[]>;
  create(chambre: Omit<Chambre, 'id_ch'>): Promise<Chambre>;
  update(id: string, data: Partial<Chambre>): Promise<Chambre>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: StatutChambre): Promise<Chambre>;
}