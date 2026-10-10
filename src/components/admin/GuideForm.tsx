"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save, LoaderCircle, ArrowLeft, FileUp, Trash2, Copy, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Field, setIn, type Path } from "./fields";
import { GUIDE_FIELDS } from "@/lib/admin-sections";
import { saveGuideAction, uploadGuidePdfAction, removeGuidePdfAction } from "@/app/admin/actions";

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
  const [pdfPending, startPdf] = useTransition();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const slug = String(state.slug || "");
  const pdfName = String(initial.pdfName || "");
  const publicPath = slug ? `/blogs/${slug}` : "";

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

  const uploadPdf = () => {
    if (!guideId) {
      toast({
        title: "Save the post first",
        description: "Create the blog post, then attach the PDF.",
        variant: "destructive",
      });
      return;
    }
    if (!pdfFile) {
      toast({
        title: "Choose a file",
        description: "Pick a PDF file (max 25 MB) to attach.",
        variant: "destructive",
      });
      return;
    }
    const fd = new FormData();
    fd.append("pdf", pdfFile);
    startPdf(async () => {
      const result = await uploadGuidePdfAction(guideId, fd);
      toast({
        title: result.ok ? "PDF attached" : "Error",
        description: result.message,
        variant: result.ok ? undefined : "destructive",
      });
      if (result.ok) {
        setPdfFile(null);
        router.refresh();
      }
    });
  };

  const removePdf = () => {
    if (!guideId || !pdfName) return;
    if (!window.confirm(`Remove the PDF "${pdfName}" from this post?`)) return;
    startPdf(async () => {
      const result = await removeGuidePdfAction(guideId);
      toast({
        title: result.ok ? "Removed" : "Error",
        description: result.message,
        variant: result.ok ? undefined : "destructive",
      });
      if (result.ok) router.refresh();
    });
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/blogs/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: url });
    } catch {
      toast({ title: "Could not copy", description: url, variant: "destructive" });
    }
  };

  return (
    <div>
      <a
        href="/admin/guides"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#d02e2e] mb-2"
      >
        <ArrowLeft size={14} /> All blogs
      </a>
      <h1 className="admin-page-title">{guideId ? "Edit blog post" : "New blog post"}</h1>
      <p className="admin-page-desc">
        The slug becomes the URL (<b>/blogs/your-slug</b>) — that is the link you share on
        Instagram. Body sections render in order, each with a heading and paragraphs.
      </p>

      <div className="space-y-5">
        {GUIDE_FIELDS.map((f) => (
          <div key={f.key} className="admin-card">
            <Field def={f} value={state[f.key]} path={[f.key]} onChange={onChange} />
          </div>
        ))}

        {/* ── PDF attachment ── */}
        <div className="admin-card">
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <label className="admin-field-label">PDF download</label>
            {pdfName ? (
              <span className="admin-badge admin-badge--ok">Attached</span>
            ) : (
              <span className="admin-badge admin-badge--off">None</span>
            )}
          </div>
          <p className="admin-field-help">
            Attach a PDF visitors can download from this post — perfect for checklists,
            templates, and lead magnets. Max 25 MB.
          </p>

          {pdfName ? (
            <div className="flex flex-wrap items-center gap-3 mt-3 rounded-md border border-[rgba(47,45,45,0.12)] bg-[#fff] px-4 py-3">
              <FileText size={16} className="text-[#d02e2e] shrink-0" />
              <span className="text-sm font-semibold text-[#2f2d2d] truncate">{pdfName}</span>
              <a
                href={`/api/blogs/${slug}/pdf`}
                target="_blank"
                rel="noopener"
                className="text-xs font-bold uppercase tracking-widest text-[#d02e2e]"
              >
                Open
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={removePdf}
                disabled={pdfPending}
                className="text-red-600 hover:text-red-700 ml-auto"
              >
                <Trash2 size={14} /> Remove
              </Button>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              className="text-sm text-[#2f2d2d] file:mr-3 file:rounded-md file:border-0 file:bg-[#2f2d2d] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#fffae7] hover:file:bg-[#1d1c1c]"
            />
            <Button
              onClick={uploadPdf}
              disabled={pdfPending || !pdfFile || !guideId}
              className="bg-[#d02e2e] hover:bg-[#b62626]"
            >
              {pdfPending ? (
                <>
                  <LoaderCircle size={15} className="spin" /> Uploading…
                </>
              ) : (
                <>
                  <FileUp size={15} /> {pdfName ? "Replace PDF" : "Attach PDF"}
                </>
              )}
            </Button>
          </div>

          {publicPath ? (
            <div className="flex flex-wrap items-center gap-3 mt-4 rounded-md border border-dashed border-[rgba(47,45,45,0.25)] px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[rgba(47,45,45,0.55)]">
                Public link
              </span>
              <code className="text-sm text-[#d02e2e] font-semibold">{publicPath}</code>
              <Button variant="outline" size="sm" onClick={copyLink} className="ml-auto">
                <Copy size={14} /> Copy link
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="admin-form-actions">
        <Button onClick={save} disabled={pending} className="bg-[#d02e2e] hover:bg-[#b62626]">
          {pending ? (
            <>
              <LoaderCircle size={16} className="spin" /> Saving…
            </>
          ) : (
            <>
              <Save size={16} /> {guideId ? "Save post" : "Create post"}
            </>
          )}
        </Button>
        {dirty && <span className="text-xs font-semibold text-[#d02e2e]">Unsaved changes</span>}
      </div>
    </div>
  );
}
