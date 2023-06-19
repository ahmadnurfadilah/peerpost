"use client";

import { useUserStore } from "@/utils/store";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  if (!user?.loggedIn) {
    return router.push("/");
  }

  return <div>Dashboard</div>;
}
