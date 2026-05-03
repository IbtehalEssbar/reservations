import { prisma } from "../../../../lib/prisma";
import { IReservationRepository } from "../../domain/repositories/IReservationRepository";
import { StatutReservation } from "@prisma/client";
export class PrismaReservationRepository implements IReservationRepository {
  async findById(id: string) { return prisma.reservation.findUnique({ where: { id }, include: { chambre: { include: { type: true } }, client: true, consommations: true } }); }
  async findAll() { return prisma.reservation.findMany({ include: { client: true, chambre: { include: { type: true } } }, orderBy: { createdAt: "desc" } }); }
  async findOverlapping(chambreId: string, arrivee: Date, depart: Date, excludeId?: string) {
    return prisma.reservation.findMany({
      where: { chambreId, id: excludeId ? { not: excludeId } : undefined, statut: { in: ["EN_ATTENTE", "CONFIRMEE"] }, AND: [ { date_arrivee: { lt: depart } }, { date_depart: { gt: arrivee } } ] }
    });
  }
  async create(data: any) { return prisma.reservation.create({ data }); }
  async update(id: string, data: any) { return prisma.reservation.update({ where: { id }, data }); }
  async updateStatusAndPrice(id: string, status: string, price: number) { return prisma.reservation.update({ where: { id }, data: { statut: status as StatutReservation, prix_total: price } }); }
  async createFactureAndFinish(reservationId: string, factureData: any, chambreId: string) {
    return prisma.$transaction([
      prisma.facture.create({ data: factureData }),
      prisma.reservation.update({ where: { id: reservationId }, data: { statut: "TERMINEE" } }),
      prisma.chambre.update({ where: { id_ch: chambreId }, data: { status: "DISPONIBLE" } })
    ]);
  }
  async freeRoom(roomId: string) { return prisma.chambre.update({ where: { id_ch: roomId }, data: { status: "DISPONIBLE" } }); }
}