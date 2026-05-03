export interface IChambreRepository {
  findAll(): Promise<any[]>;
  findAvailable(nbPersonnes: number): Promise<any[]>;
  updateStatus(id: string, status: string): Promise<any>;
}