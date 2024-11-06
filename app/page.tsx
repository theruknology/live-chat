import React from "react";
import { Button } from "@/components/ui/button";
import ChatHeader from "@/components/ChatHeader";
import { supabaseServer } from "@/utils/supabase/server";
import InitUser from "@/lib/store/initUser";
import { Input } from "@/components/ui/input";

export default async function Page() {
  const supabase = supabaseServer();

  const { data } = await (await supabase).auth.getSession();

  console.log(data.session?.user);

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md flex flex-col">
          <ChatHeader user={data.session?.user} />
          <div className="flex-1 flex flex-col p-5">
            <div className="flex-1"></div>

            <div>
              <div className="flex gap-2">
                <div className="h-10 w-10 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold">Rukn</h1>
                    <h1 className="text-sm text-gray-400">{new Date().toDateString()}</h1>
                  </div>
                  <p className="text-gray-300">Some Message here and more more more hahaha lol here goes the message, from the screen to the ring to pen to the king, wheres my crown thats my bling always drama when i ring, see i believe that if i see it in my heart, smash through the sealing cuz im reaching for the stars, oooh ooh oohh</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5">
            <Input
              className="selection:border-4 selection:border-blue-500"
              placeholder="send message"
            />
          </div>
        </div>
      </div>
      <InitUser user={data.session?.user} />
    </>
  );
}
