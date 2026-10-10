"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Field, setIn, type Path } from "./fields";
import type { AdminSection } from "@/lib/admin-sections";
import { saveContentAction, resetContentAction } from "@/app/admin/actions";

export function ContentForm({
  section,
  initial,
}: {
  section: AdminSection;
  initial: Record<string, unknown>;
}) {
  const [state, setState] = useState<Record<string, unknown>>(initial);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const [resetting, startReset] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const onChange = (path: Path, value: unknown) => {
    setState((prev) => setIn(prev, path, value));
    setDirty(true);
  };

  const jsonString = useMemo(() => JSON.stringify(state), [state]);

  const save = () => {
    startTransition(async () => {
      const result = await saveContentAction(section.key, jsonString);
      toast({
        title: result.ok ? "Saved" : "Error",
        description: result.message,
        variant: result.ok ? undefined : "destructive",
      });
      if (result.ok) {
        setDirty(false);
        router.refresh();
      }
    });
  };

  const reset = () => {
    startReset(async () => {
      const result = await resetContentAction(section.key);
      toast({
        title: result.ok ? "Reset" : "Error",
        description: result.message,
        variant: result.ok ? undefined : "destructive",
      });
      if (result.ok) router.refresh();
    });
  };

  return (
    <div>
      <h1 className="admin-page-title">{section.title}</h1>
      <p className="admin-page-desc">{section.description}</p>

      <div className="space-y-5">
        {section.fields.map((f) => (
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
              <Save size={16} /> {dirty ? "Save changes" : "Save"}
            </>
          )}
        </Button>
        <Button variant="outline" onClick={reset} disabled={resetting}>
          <RotateCcw size={15} /> Reset to defaults
        </Button>
        {dirty && (
          <span className="text-xs font-semibold text-[#d02e2e]">
            Unsaved changes
          </span>
        )}
      </div>
    </div>
  );
}
