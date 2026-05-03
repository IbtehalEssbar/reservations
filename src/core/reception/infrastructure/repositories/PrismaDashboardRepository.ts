import { PrismaClient } from "@prisma/client";
import { IDashboardRepository } from "../../domain/repositories/IDashboardRepository";

const prisma = new PrismaClient();

export class PrismaDashboardRepository implements IDashboardRepository {
  async getArrivalsCount(date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.reservation.count({
      where: {
        date_arrivee: { gte: startOfDay, lte: endOfDay },
        statut: { in: ["CONFIRMEE", "EN_ATTENTE"] }
      }
    });
  }

  async getDeparturesCount(date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.reservation.count({
      where: {
        date_depart: { gte: startOfDay, lte: endOfDay },
        statut: "CONFIRMEE"
      }
    });
  }

  async getAvailableRoomsCount(): Promise<number> {
    return prisma.chambre.count({
      where: { status: "DISPONIBLE" }
    });
  }
}
