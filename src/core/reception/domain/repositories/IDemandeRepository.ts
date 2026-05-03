export interface IDemandeRepository {
  findAll(): Promise<any[]>;
  updateStatus(id: string, status: string): Promise<any>;
}