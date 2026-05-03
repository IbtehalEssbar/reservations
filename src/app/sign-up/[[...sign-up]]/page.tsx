"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-start pl-8">
      <div className="w-full max-w-md p-6">
        <SignUp forceRedirectUrl="/client" />
      </div>
    </main>
  );
}