import { prisma } from '@/lib/prisma';

export interface CreateAvisDTO {
  clerkUserId: string;
  clientNom: string;
  note: number;
  commentaire: string;
}

export class CreateAvisUseCase {
  async execute(data: CreateAvisDTO) {
    // Validation
    if (data.note < 1 || data.note > 5) {
      throw new Error('La note doit être entre 1 et 5');
    }
    
    if (!data.commentaire || data.commentaire.trim().length < 5) {
      throw new Error('Le commentaire doit contenir au moins 5 caractères');
    }

    // Trouver l'utilisateur
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { clerkUserId: data.clerkUserId }
    });

    if (!utilisateur) {
      throw new Error('Utilisateur non trouvé');
    }

    // Créer l'avis
    const avis = await prisma.avis.create({
      data: {
        clientId: utilisateur.id,
        clientNom: data.clientNom,
        note: data.note,
        commentaire: data.commentaire,
        statut: 'EN_ATTENTE'
      }
    });

    return avis;
  }
}