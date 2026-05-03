import { prisma } from "../../../../lib/prisma";
import { IDemandeRepository } from "../../domain/repositories/IDemandeRepository";
export class PrismaDemandeRepository implements IDemandeRepository {
  async findAll() {
    return prisma.demande.findMany({
      include: { reservation: { include: { chambre: true, client: true } } },
      orderBy: { date_crea: "desc" }
    });
  }
  async updateStatus(id: string, status: string) { return prisma.demande.update({ where: { id }, data: { status } }); }
}