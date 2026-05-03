import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les avis (admin uniquement)
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    // Vérifier si l'utilisateur est admin dans votre base de données
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { clerkUserId: userId }
    });

    if (!utilisateur || utilisateur.role !== 'ADMINISTRATEUR') {
      return NextResponse.json({ error: 'Accès refusé - Admin uniquement' }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const filtre = searchParams.get('filtre');
    
    let avis;
    if (filtre === 'en-attente') {
      avis = await prisma.avis.findMany({
        where: { statut: 'EN_ATTENTE' },
        include: {
          client: {
            select: { email: true, nom: true }
          }
        },
        orderBy: { dateCreation: 'desc' }
      });
    } else {
      avis = await prisma.avis.findMany({
        include: {
          client: {
            select: { email: true, nom: true }
          }
        },
        orderBy: { dateCreation: 'desc' }
      });
    }
    
    return NextResponse.json(avis);
  } catch (error: any) {
    console.error('Erreur GET admin/avis:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Valider ou rejeter un avis
export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    // Vérifier si l'utilisateur est admin dans votre base de données
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { clerkUserId: userId }
    });

    if (!utilisateur || utilisateur.role !== 'ADMINISTRATEUR') {
      return NextResponse.json({ error: 'Accès refusé - Admin uniquement' }, { status: 403 });
    }

    const body = await req.json();
    const { id, action } = body; // action: 'valider' ou 'rejeter'
    
    let avis;
    if (action === 'valider') {
      avis = await prisma.avis.update({
        where: { id },
        data: {
          statut: 'VALIDE',
          datePublication: new Date()
        }
      });
    } else if (action === 'rejeter') {
      avis = await prisma.avis.update({
        where: { id },
        data: { statut: 'REJETE' }
      });
    } else {
      return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
    }
    
    return NextResponse.json(avis);
  } catch (error: any) {
    console.error('Erreur PUT admin/avis:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}