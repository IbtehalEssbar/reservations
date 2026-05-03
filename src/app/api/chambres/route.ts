import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaChambreRepository } from '@/infrastructure/repositories/PrismaChambreRepository';
import { GetAllChambresUseCase } from '@/application/use-cases/chambre/GetAllChambresUseCase';
import { CreateChambreUseCase } from '@/application/use-cases/chambre/CreateChambreUseCase';

const chambreRepository = new PrismaChambreRepository();

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const getAllChambres = new GetAllChambresUseCase(chambreRepository);
    const chambres = await getAllChambres.execute();
    
    return NextResponse.json(chambres);
  } catch (error) {
    console.error('GET /api/chambres error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const createChambre = new CreateChambreUseCase(chambreRepository);
    const chambre = await createChambre.execute(body);
    
    return NextResponse.json(chambre, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}