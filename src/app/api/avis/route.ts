import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validation
    if (!body.commentaire || body.commentaire.trim().length < 5) {
      return NextResponse.json({ error: 'Le commentaire doit contenir au moins 5 caractères' }, { status: 400 });
    }
    
    if (body.note < 1 || body.note > 5) {
      return NextResponse.json({ error: 'La note doit être entre 1 et 5' }, { status: 400 });
    }

    // Trouver l'utilisateur
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { clerkUserId: userId }
    });

    if (!utilisateur) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Créer l'avis
    const avis = await prisma.avis.create({
      data: {
        clientId: utilisateur.id,
        clientNom: body.clientNom || utilisateur.nom || 'Client',
        note: body.note,
        commentaire: body.commentaire,
        statut: 'EN_ATTENTE'
      }
    });

    console.log('Avis créé:', avis.id);
    return NextResponse.json({ message: 'Avis soumis avec succès', avis }, { status: 201 });
    
  } catch (error: any) {
    console.error('Erreur POST /api/avis:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}