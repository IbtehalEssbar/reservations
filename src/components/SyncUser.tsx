"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function SyncUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    console.log("SyncUser user=", user);
    if (!user) return;

    fetch("/api/users/sync", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        console.log("SyncUser response", res.status, data);
      })
      .catch((error) => {
        console.error("SyncUser fetch error", error);
      });
  }, [user, isLoaded]);

  return null;
}
