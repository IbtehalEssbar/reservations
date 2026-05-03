import { prisma } from "../../../../lib/prisma";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
export class PrismaClientRepository implements IClientRepository {
  async findAll() {
    return prisma.utilisateur.findMany({
      where: { role: "user" },
      include: {
        reservations: { include: { chambre: { include: { type: true } }, facture: true }, orderBy: { date_arrivee: "desc" } }
      },
      orderBy: { nom: "asc" }
    });
  }
  async findByEmail(email: string) { return prisma.utilisateur.findUnique({ where: { email } }); }
  async create(data: any) { return prisma.utilisateur.create({ data }); }
}