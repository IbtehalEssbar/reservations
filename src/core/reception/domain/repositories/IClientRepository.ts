export interface IClientRepository {
  findAll(): Promise<any[]>;
  findByEmail(email: string): Promise<any>;
  create(clientData: any): Promise<any>;
}