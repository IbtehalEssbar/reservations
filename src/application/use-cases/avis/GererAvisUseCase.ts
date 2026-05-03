import { prisma } from '@/lib/prisma';

export class GererAvisUseCase {
  async valider(id: string) {
    const avis = await prisma.avis.update({
      where: { id },
      data: {
        statut: 'VALIDE',
        datePublication: new Date()
      }
    });
    return avis;
  }

  async rejeter(id: string) {
    const avis = await prisma.avis.update({
      where: { id },
      data: { statut: 'REJETE' }
    });
    return avis;
  }

  async getAllEnAttente() {
    const avis = await prisma.avis.findMany({
      where: { statut: 'EN_ATTENTE' },
      include: {
        client: {
          select: { email: true, nom: true }
        }
      },
      orderBy: { dateCreation: 'desc' }
    });
    return avis;
  }

  async getAll() {
    const avis = await prisma.avis.findMany({
      include: {
        client: {
          select: { email: true, nom: true }
        }
      },
      orderBy: { dateCreation: 'desc' }
    });
    return avis;
  }
}