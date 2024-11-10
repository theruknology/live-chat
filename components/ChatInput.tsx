"use client";
import React from "react";
import { Input } from "./ui/input";
import { supabaseBrowser } from "@/utils/supabase/client";
import { toast } from "sonner";
import { v4 as uuidV4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";

export default function ChatInput() {
  const user = useUser((state) => state.user);

  const addMessage = useMessage((state) => state.addMessage);
  const supabase = supabaseBrowser();

  const handleSendMessage = async (text: string) => {
    if (text.trim()) {
      const newMessage = {
        id: uuidV4(),
        text,
        send_by: user?.id,
        is_edit: false,
        created_at: new Date().toISOString(),
        users: {
          avatar_url: user?.user_metadata.avatar_url,
          created_at: new Date().toISOString(),
          display_name: user?.user_metadata.user_name,
          id: user?.id,
        },
      };

      // addMessage(newMessage as Imessage);

      //call to supabase
      const { error } = await supabase.from("messages").insert({ text });

      if (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Nope");
    }
  };

  return (
    <div className="p-5">
      <Input
        placeholder="send message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
