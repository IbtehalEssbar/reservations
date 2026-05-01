import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaUtilisateurRepository } from "@/infrastructure/repositories/PrismaUtilisateurRepository";
import { SyncUserUseCase } from "@/application/use-cases/SyncUserUseCase";

// Initialisation des dépendances
const userRepository = new PrismaUtilisateurRepository();
const syncUserUseCase = new SyncUserUseCase(userRepository);

export async function POST() {
   console.log("sync called!");
   console.log("NEXT_RUNTIME:", (process.env.NEXT_RUNTIME || "nodejs"));
   
   const { userId } = await auth();
   console.log("Authenticated userId:", userId);
   
   if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

   try {
     const user = await currentUser();
     if (!user) {
       return NextResponse.json({ error: "User not found" }, { status: 404 });
     }
     
     const email = user.emailAddresses?.[0]?.emailAddress ?? null;
     const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null;

     if (!email) {
       console.error("SYNC USER ERROR 👉 email missing from Clerk user", user);
       return NextResponse.json(
         { error: "Email address is required to create a user" },
         { status: 400 }
       );
     }

     // Utilisation de la Clean Architecture via le Use Case
     await syncUserUseCase.execute({
       clerkUserId: userId,
       email,
       nom: name,
     });

     return NextResponse.json({ success: true });
   } catch (error: any) {
     console.error("SYNC USER ERROR 👉", error);
     return NextResponse.json(
       { error: error.message || "Internal Server Error" },
       { status: 500 }
     );
   }
}
