import type { Metadata } from "next";
import Link from "next/link";
import SyncUser from "../components/SyncUser";
import {
  ClerkProvider,
  Show,
  // SignedIn,
  // SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReservHotel - Réservations Hôteliers",
  description: "Trouvez et réservez les meilleurs hôtels partout en France",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <ClerkProvider
     signInUrl="/sign-in"
      signUpUrl="/sign-up">
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         {/* <SignedIn> */}
         <Show when="signed-in">
  <SyncUser />
  </Show>
{/* </SignedIn> */}
        <header className="flex justify-between items-center p-4 h-16">
          <div className="flex items-center gap-3">
            <Link href="/">
                    <button className="text-xl font-semibold cursor-pointer">ReservHotel</button>
            </Link>
          </div>

          <Navbar/>

          </header>

        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
