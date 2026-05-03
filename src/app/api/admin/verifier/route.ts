import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ isAdmin: false });
    }
    
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { clerkUserId: userId }
    });
    
    const isAdmin = utilisateur?.role === 'ADMINISTRATEUR';
    
    return NextResponse.json({ isAdmin });
  } catch (error) {
    return NextResponse.json({ isAdmin: false });
  }
}