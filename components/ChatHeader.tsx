"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function ChatHeader({ user }: { user: User | undefined }) {
  const router = useRouter();
  const handleLoginWithGithub = () => {
    const supabase = supabaseBrowser();

    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();

    router.refresh();
  };

  return (
    <div className="h-20">
      <div className="p-5 h-full border-b flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Weekly Chat</h1>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
            <h1 className="text-sm text-gray-400">2 Online</h1>
          </div>
        </div>

        {user ? (
          <Button className="bg-green-600" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button className="bg-green-600" onClick={handleLoginWithGithub}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
}
