import React from "react";
import ChatHeader from "@/components/ChatHeader";
import { supabaseServer } from "@/utils/supabase/server";
import InitUser from "@/lib/store/initUser";
import ChatInput from "@/components/ChatInput";
import ListMessages from "@/components/ListMessages";
import ChatMessages from "@/components/ChatMessages";

export default async function Page() {
  const supabase = supabaseServer();

  const { data } = await (await supabase).auth.getSession();

  console.log(data.session?.user);

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md flex flex-col">
          <ChatHeader user={data.session?.user} />
          <ChatMessages />
          <ChatInput />
        </div>
      </div>
      <InitUser user={data.session?.user} />
    </>
  );
}
