import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

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

    const exists = await prisma.utilisateur.findUnique({
      where: { clerkUserId: userId },
    });

    console.log("User exists in DB?", exists);
// const exists = false;
    if (!exists) {
      await prisma.utilisateur.create({
        data: {
          clerkUserId: userId,
          email,
          nom: name ?? email,
          motdp: "",
        },
      });
      console.log("User created in DB");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SYNC USER ERROR 👉", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
