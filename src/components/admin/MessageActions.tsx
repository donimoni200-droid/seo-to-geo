"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, MailOpen, Mail } from "lucide-react";
import { toggleMessageReadAction, deleteMessageAction } from "@/app/admin/actions";

export function MessageActions({ id, read }: { id: string; read: boolean }) {
  const [pending, start] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const toggle = () => {
    start(async () => {
      const result = await toggleMessageReadAction(id);
      toast({ title: result.ok ? "Updated" : "Error", description: result.message, variant: result.ok ? undefined : "destructive" });
      if (result.ok) router.refresh();
    });
  };

  const remove = () => {
    if (!window.confirm("Delete this message permanently?")) return;
    start(async () => {
      const result = await deleteMessageAction(id);
      toast({ title: result.ok ? "Deleted" : "Error", description: result.message, variant: result.ok ? undefined : "destructive" });
      if (result.ok) router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={toggle} disabled={pending} aria-label={read ? "Mark unread" : "Mark read"} title={read ? "Mark as unread" : "Mark as read"}>
        {read ? <MailOpen size={15} /> : <Mail size={15} />}
      </Button>
      <Button variant="ghost" size="icon" onClick={remove} disabled={pending} className="text-red-600 hover:text-red-700" aria-label="Delete" title="Delete">
        <Trash2 size={15} />
      </Button>
    </div>
  );
}
