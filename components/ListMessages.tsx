"use client";
import { Imessage, useMessage } from "@/lib/store/messages";
import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { DeleteAlert, EditAlert } from "./MessageActions";
import { supabaseBrowser } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function ListMessages() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const addMessage = useMessage((state) => state.addMessage);
  const messages = useMessage((state) => state.messages);

  const supabase = supabaseBrowser();
  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          console.log("Change received!", payload);
          const { error, data } = await supabase
            .from("users")
            .select("*")
            .eq("id", payload.new.send_by)
            .single();
          if (error) {
            toast.error(error.message);
          } else {
            addMessage({ ...payload.new, users: data } as Imessage);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [messages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 flex flex-col p-5 h-full overflow-y-auto"
    >
      <div className="flex-1"></div>

      <div className="space-y-7">
        {messages.map((value, index) => {
          return <Message key={index} message={value} />;
        })}
      </div>
      <DeleteAlert />
      <EditAlert />
    </div>
  );
}
