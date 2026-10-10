"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* Copies the absolute public URL of a blog post — the link to paste
   into Instagram DMs when someone comments on a video. */
export function CopyLinkButton({ path }: { path: string }) {
  const { toast } = useToast();

  const copy = async () => {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: url });
    } catch {
      toast({ title: "Copy failed — here is the link", description: url, variant: "destructive" });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={copy}
      aria-label="Copy public link"
      title="Copy public link"
    >
      <Copy size={15} />
    </Button>
  );
}
