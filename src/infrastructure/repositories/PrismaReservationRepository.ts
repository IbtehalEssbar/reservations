import { IReservationRepository } from '../../domain/repositories/IReservationRepository';
import { Reservation } from '../../domain/entities/Reservation';
import { StatutReservation } from '../../domain/enums';
import { prisma } from '../../lib/prisma';
import { StatutReservation as PrismaStatutReservation } from '../../generated/prisma/client';

export class PrismaReservationRepository implements IReservationRepository {
  private mapToDomain(prismaRes: any): Reservation {
    return {
      id: prismaRes.id,
      date_arrivee: prismaRes.date_arrivee,
      date_depart: prismaRes.date_depart,
      statut: prismaRes.statut as StatutReservation,
      clientId: prismaRes.clientId,
      chambreId: prismaRes.chambreId,
      promotionId: prismaRes.promotionId,
    };
  }

  async findById(id: string): Promise<Reservation | null> {
    const res = await prisma.reservation.findUnique({ where: { id } });
    return res ? this.mapToDomain(res) : null;
  }

  async findAllByUserId(userId: number): Promise<Reservation[]> {
    const res = await prisma.reservation.findMany({ where: { clientId: userId } });
    return res.map((r: any) => this.mapToDomain(r));
  }

  async create(reservation: Omit<Reservation, 'id'>): Promise<Reservation> {
    const res = await prisma.reservation.create({
      data: {
        date_arrivee: reservation.date_arrivee,
        date_depart: reservation.date_depart,
        statut: reservation.statut as PrismaStatutReservation,
        clientId: reservation.clientId,
        chambreId: reservation.chambreId,
        promotionId: reservation.promotionId,
      },
    });
    return this.mapToDomain(res);
  }

  async updateStatus(id: string, statut: StatutReservation): Promise<Reservation> {
    const res = await prisma.reservation.update({
      where: { id },
      data: { statut: statut as PrismaStatutReservation },
    });
    return this.mapToDomain(res);
  }
}
