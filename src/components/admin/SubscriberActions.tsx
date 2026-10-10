"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Download } from "lucide-react";
import { deleteSubscriberAction } from "@/app/admin/actions";

export function SubscriberRowActions({ id, email }: { id: string; email: string }) {
  const [pending, start] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const remove = () => {
    if (!window.confirm(`Remove ${email} from the waitlist?`)) return;
    start(async () => {
      const result = await deleteSubscriberAction(id);
      toast({ title: result.ok ? "Removed" : "Error", description: result.message, variant: result.ok ? undefined : "destructive" });
      if (result.ok) router.refresh();
    });
  };

  return (
    <Button variant="ghost" size="icon" onClick={remove} disabled={pending} className="text-red-600 hover:text-red-700" aria-label="Remove subscriber" title="Remove">
      <Trash2 size={15} />
    </Button>
  );
}

export function ExportSubscribersButton({
  subscribers,
}: {
  subscribers: { email: string; source: string; createdAt: string }[];
}) {
  const download = () => {
    const header = "email,source,signed_up_at\n";
    const rows = subscribers
      .map((s) => `${s.email},${s.source},${s.createdAt}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" onClick={download} disabled={subscribers.length === 0}>
      <Download size={15} /> Export CSV
    </Button>
  );
}
