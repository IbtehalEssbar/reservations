import { prisma } from '@/lib/prisma';

export class GetAvisValidatesUseCase {
  async execute() {
    const avis = await prisma.avis.findMany({
      where: {
        statut: 'VALIDE'
      },
      orderBy: {
        datePublication: 'desc'
      },
      take: 10  // Limiter aux 10 derniers
    });

    return avis;
  }
}