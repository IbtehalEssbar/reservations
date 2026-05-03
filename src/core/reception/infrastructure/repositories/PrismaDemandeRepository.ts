import { PrismaClient } from "@prisma/client";
import { IDemandeRepository } from "../../domain/repositories/IDemandeRepository";
const prisma = new PrismaClient();
export class PrismaDemandeRepository implements IDemandeRepository {
  async findAll() {
    return prisma.demande.findMany({
      include: { reservation: { include: { chambre: true, client: true } } },
      orderBy: { date_crea: "desc" }
    });
  }
  async updateStatus(id: string, status: string) { return prisma.demande.update({ where: { id }, data: { status } }); }
}