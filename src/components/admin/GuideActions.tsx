"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { deleteGuideAction, toggleGuidePublishedAction } from "@/app/admin/actions";

export function GuideActions({
  id,
  published,
  title,
}: {
  id: string;
  published: boolean;
  title: string;
}) {
  const [pending, start] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const toggle = () => {
    start(async () => {
      const result = await toggleGuidePublishedAction(id);
      toast({ title: result.ok ? "Updated" : "Error", description: result.message, variant: result.ok ? undefined : "destructive" });
      if (result.ok) router.refresh();
    });
  };

  const remove = () => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    start(async () => {
      const result = await deleteGuideAction(id);
      toast({ title: result.ok ? "Deleted" : "Error", description: result.message, variant: result.ok ? undefined : "destructive" });
      if (result.ok) router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={toggle} disabled={pending} aria-label={published ? "Unpublish" : "Publish"} title={published ? "Unpublish" : "Publish"}>
        {published ? <EyeOff size={15} /> : <Eye size={15} />}
      </Button>
      <Button variant="ghost" size="icon" onClick={remove} disabled={pending} className="text-red-600 hover:text-red-700" aria-label="Delete" title="Delete">
        <Trash2 size={15} />
      </Button>
    </div>
  );
}
