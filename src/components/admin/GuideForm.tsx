"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save, LoaderCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Field, setIn, type Path } from "./fields";
import { GUIDE_FIELDS } from "@/lib/admin-sections";
import { saveGuideAction } from "@/app/admin/actions";

export function GuideForm({
  guideId,
  initial,
}: {
  guideId: string | null;
  initial: Record<string, unknown>;
}) {
  const [state, setState] = useState<Record<string, unknown>>(initial);
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const onChange = (path: Path, value: unknown) => {
    setState((prev) => setIn(prev, path, value));
    setDirty(true);
  };

  const jsonString = useMemo(() => JSON.stringify(state), [state]);

  const save = () => {
    start(async () => {
      const result = await saveGuideAction(guideId, jsonString);
      toast({
        title: result.ok ? "Saved" : "Error",
        description: result.message,
        variant: result.ok ? undefined : "destructive",
      });
      if (result.ok) {
        setDirty(false);
        router.push("/admin/guides");
        router.refresh();
      }
    });
  };

  return (
    <div>
      <a
        href="/admin/guides"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#d02e2e] mb-2"
      >
        <ArrowLeft size={14} /> All guides
      </a>
      <h1 className="admin-page-title">{guideId ? "Edit guide" : "New guide"}</h1>
      <p className="admin-page-desc">
        The slug becomes the URL (<b>/guides/your-slug</b>). Body sections render in order —
        each has a heading and paragraphs.
      </p>

      <div className="space-y-5">
        {GUIDE_FIELDS.map((f) => (
          <div key={f.key} className="admin-card">
            <Field def={f} value={state[f.key]} path={[f.key]} onChange={onChange} />
          </div>
        ))}
      </div>

      <div className="admin-form-actions">
        <Button onClick={save} disabled={pending} className="bg-[#d02e2e] hover:bg-[#b62626]">
          {pending ? (
            <>
              <LoaderCircle size={16} className="spin" /> Saving…
            </>
          ) : (
            <>
              <Save size={16} /> {guideId ? "Save guide" : "Create guide"}
            </>
          )}
        </Button>
        {dirty && <span className="text-xs font-semibold text-[#d02e2e]">Unsaved changes</span>}
      </div>
    </div>
  );
}
