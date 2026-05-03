import { prisma } from "../../../../lib/prisma";
import { IChambreRepository } from "../../domain/repositories/IChambreRepository";
export class PrismaChambreRepository implements IChambreRepository {
  async findAll() { return prisma.chambre.findMany({ include: { type: true } }); }
  async findAvailable(nbPersonnes: number) {
    return prisma.chambre.findMany({
      where: { capacite: { gte: nbPersonnes } },
      include: { type: true, reservations: { where: { statut: { in: ["CONFIRMEE", "EN_ATTENTE"] } } } }
    });
  }
  async updateStatus(id: string, status: string) {
    return prisma.chambre.update({ where: { id_ch: id }, data: { status } });
  }
}