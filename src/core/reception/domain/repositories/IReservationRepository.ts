export interface IReservationRepository {
  findById(id: string): Promise<any>;
  findAll(): Promise<any[]>;
  findOverlapping(chambreId: string, arrivee: Date, depart: Date, excludeId?: string): Promise<any[]>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  updateStatusAndPrice(id: string, status: string, price: number): Promise<any>;
  createFactureAndFinish(reservationId: string, factureData: any, chambreId: string): Promise<any>;
  freeRoom(roomId: string): Promise<any>;
}