export interface IDashboardRepository {
  getArrivalsCount(date: Date): Promise<number>;
  getDeparturesCount(date: Date): Promise<number>;
  getAvailableRoomsCount(): Promise<number>;
}
