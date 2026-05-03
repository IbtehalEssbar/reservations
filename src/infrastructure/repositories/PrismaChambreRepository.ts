import { IChambreRepository } from '../../domain/repositories/IChambreRepository';
import { Chambre } from '../../domain/entities/Chambre';
import { StatutChambre } from '../../domain/enums';
import { prisma } from '../../lib/prisma';

export class PrismaChambreRepository implements IChambreRepository {
  private mapToDomain(prismaChambre: any): Chambre {
    return {
      id_ch: prismaChambre.id_ch,
      numero: prismaChambre.numero,
      status: prismaChambre.status as StatutChambre,
      id_type: prismaChambre.id_type,
      type: prismaChambre.type ? {
        id: prismaChambre.type.id,
        libelle: prismaChambre.type.libelle,
        prix: prismaChambre.type.prix
      } : undefined
    };
  }

  async findAll(): Promise<Chambre[]> {
    try {
      const chambres = await prisma.chambre.findMany({
        include: { type: true },
        orderBy: { numero: 'asc' }
      });
      return chambres.map((c: any) => this.mapToDomain(c));
    } catch (error) {
      console.error('Erreur findAll chambres:', error);
      throw new Error('Impossible de récupérer les chambres');
    }
  }

  async findById(id: string): Promise<Chambre | null> {
    try {
      const chambre = await prisma.chambre.findUnique({
        where: { id_ch: id },
        include: { type: true }
      });
      return chambre ? this.mapToDomain(chambre) : null;
    } catch (error) {
      console.error('Erreur findById chambre:', error);
      throw new Error('Impossible de trouver la chambre');
    }
  }

  async findByStatus(status: StatutChambre): Promise<Chambre[]> {
    try {
      const chambres = await prisma.chambre.findMany({
        where: { status },
        include: { type: true }
      });
      return chambres.map((c: any) => this.mapToDomain(c));
    } catch (error) {
      console.error('Erreur findByStatus:', error);
      throw new Error('Impossible de trouver les chambres par statut');
    }
  }

  async create(chambre: Omit<Chambre, 'id_ch'>): Promise<Chambre> {
    try {
      const newChambre = await prisma.chambre.create({
        data: {
          numero: chambre.numero,
          status: chambre.status,
          id_type: chambre.id_type
        },
        include: { type: true }
      });
      return this.mapToDomain(newChambre);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Une chambre avec ce numéro existe déjà');
      }
      throw new Error('Impossible de créer la chambre');
    }
  }

  async update(id: string, data: Partial<Chambre>): Promise<Chambre> {
    try {
      const updatedChambre = await prisma.chambre.update({
        where: { id_ch: id },
        data: {
          numero: data.numero,
          status: data.status,
          id_type: data.id_type
        },
        include: { type: true }
      });
      return this.mapToDomain(updatedChambre);
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('Chambre non trouvée');
      }
      throw new Error('Impossible de mettre à jour la chambre');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.chambre.delete({ where: { id_ch: id } });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('Chambre non trouvée');
      }
      throw new Error('Impossible de supprimer la chambre');
    }
  }

  async updateStatus(id: string, status: StatutChambre): Promise<Chambre> {
    try {
      const updatedChambre = await prisma.chambre.update({
        where: { id_ch: id },
        data: { status },
        include: { type: true }
      });
      return this.mapToDomain(updatedChambre);
    } catch (error: any) {
      throw new Error('Impossible de mettre à jour le statut');
    }
  }
}