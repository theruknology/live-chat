"use client";
import React, { useRef } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Imessage, useMessage } from "@/lib/store/messages";
import { supabaseBrowser } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export const DeleteAlert = () => {
  const optimisticDeleteMesssage = useMessage(
    (state) => state.optimisticDeleteMessage
  );
  const actionMessage = useMessage((state) => state.actionMessage);

  const handleDelete = async () => {
    const supabase = supabaseBrowser();
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", actionMessage?.id!);
    if (error) {
      toast.error(error.message);
    } else {
      optimisticDeleteMesssage(actionMessage?.id!);
      toast.success("Successfully deleted the message");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="delete-trigger"></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the message: {actionMessage?.text}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const EditAlert = () => {
  const actionMessage = useMessage((state) => state.actionMessage);

  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const optimisticUpdateMessage = useMessage(
    (state) => state.optimisticUpdateMessage
  );

  const handleEdit = async () => {
    const supabase = supabaseBrowser();
    const text = inputRef.current.value.trim();

    if (text) {
      const { error } = await supabase
        .from("messages")
        .update({ text, is_edit: true })
        .eq("id", actionMessage?.id!);

      if (error) {
        toast.error(error.message);
      } else {
        optimisticUpdateMessage({
          ...actionMessage,
          text,
          is_edit: true,
        } as Imessage);
        toast.success("Update Successful");
      }
      document.getElementById("edit-trigger")?.click();
    } else {

      document.getElementById("edit-trigger")?.click();
      document.getElementById("delete-trigger")?.click();
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="edit-trigger"></button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription>
            Make changes to your sent message.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              ref={inputRef}
              defaultValue={actionMessage?.text}
              className="col-span-4"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleEdit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
