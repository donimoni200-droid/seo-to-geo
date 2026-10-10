"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";
import type { FieldDef } from "@/lib/admin-sections";

/* ============================================================
   GENERIC FIELD ENGINE — renders any FieldDef tree and reports
   changes as immutable (path, value) updates.
   ============================================================ */

export type Path = (string | number)[];

export function getIn(obj: unknown, path: Path): unknown {
  let cur: unknown = obj;
  for (const seg of path) {
    if (cur === null || cur === undefined) return undefined;
    if (typeof seg === "number") {
      cur = (cur as unknown[])[seg];
    } else {
      cur = (cur as Record<string, unknown>)[seg];
    }
  }
  return cur;
}

export function setIn<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  if (typeof head === "number") {
    const arr = Array.isArray(obj) ? [...(obj as unknown[])] : [];
    arr[head] = setIn(arr[head] ?? null, rest, value);
    return arr as unknown as T;
  }
  const record = { ...(obj as Record<string, unknown>) };
  record[head] = setIn(record[head] ?? null, rest, value);
  return record as unknown as T;
}

export function emptyValueFor(fields: FieldDef[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    switch (f.type) {
      case "number":
        out[f.key] = 0;
        break;
      case "boolean":
        out[f.key] = false;
        break;
      case "stringList":
      case "list":
        out[f.key] = [];
        break;
      case "group":
        out[f.key] = emptyValueFor(f.fields);
        break;
      default:
        out[f.key] = "";
    }
  }
  return out;
}

function itemTitle(value: unknown, titleKey: string): string {
  if (titleKey === "__none") return "";
  const v = (value as Record<string, unknown>)?.[titleKey];
  return typeof v === "string" && v ? v : "Untitled";
}

/* ── List of plain strings ── */
function StringListField({
  field,
  value,
  path,
  onChange,
}: {
  field: Extract<FieldDef, { type: "stringList" }>;
  value: string[];
  path: Path;
  onChange: (path: Path, value: unknown) => void;
}) {
  const items = Array.isArray(value) ? value : [];
  const setItems = (next: string[]) => onChange(path, next);
  const label = field.itemLabel || "Item";

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start group/item">
          {field.textarea ? (
            <Textarea
              value={item}
              rows={3}
              onChange={(e) => setItems(items.map((v, j) => (j === i ? e.target.value : v)))}
              aria-label={`${label} ${i + 1}`}
            />
          ) : (
            <Input
              value={item}
              onChange={(e) => setItems(items.map((v, j) => (j === i ? e.target.value : v)))}
              aria-label={`${label} ${i + 1}`}
            />
          )}
          <div className="flex flex-col gap-1 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                if (i === 0) return;
                const next = [...items];
                [next[i - 1], next[i]] = [next[i], next[i - 1]];
                setItems(next);
              }}
              aria-label="Move up"
            >
              <ChevronUp size={14} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-600 hover:text-red-700"
              onClick={() => setItems(items.filter((_, j) => j !== i))}
              aria-label="Remove"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setItems([...items, ""])}
      >
        <Plus size={14} /> Add {label.toLowerCase()}
      </Button>
    </div>
  );
}

/* ── One field (or nested structure) ── */
export function Field({
  def,
  value,
  path,
  onChange,
  compact = false,
}: {
  def: FieldDef;
  value: unknown;
  path: Path;
  onChange: (path: Path, value: unknown) => void;
  compact?: boolean;
}) {
  const handleChange = useCallback(
    (v: unknown) => onChange(path, v),
    [path, onChange]
  );

  switch (def.type) {
    case "text":
      return (
        <div className={compact ? "space-y-1" : "space-y-1.5"}>
          <Label htmlFor={path.join(".")}>{def.label}</Label>
          <Input
            id={path.join(".")}
            value={typeof value === "string" ? value : ""}
            placeholder={def.placeholder}
            onChange={(e) => handleChange(e.target.value)}
          />
          {def.help && <p className="text-xs text-muted-foreground">{def.help}</p>}
        </div>
      );
    case "textarea":
      return (
        <div className={compact ? "space-y-1" : "space-y-1.5"}>
          <Label htmlFor={path.join(".")}>{def.label}</Label>
          <Textarea
            id={path.join(".")}
            rows={4}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => handleChange(e.target.value)}
          />
          {def.help && <p className="text-xs text-muted-foreground">{def.help}</p>}
        </div>
      );
    case "number":
      return (
        <div className={compact ? "space-y-1" : "space-y-1.5"}>
          <Label htmlFor={path.join(".")}>{def.label}</Label>
          <Input
            id={path.join(".")}
            type="number"
            value={typeof value === "number" ? value : 0}
            onChange={(e) => handleChange(Number(e.target.value) || 0)}
          />
          {def.help && <p className="text-xs text-muted-foreground">{def.help}</p>}
        </div>
      );
    case "boolean":
      return (
        <div className="flex items-center justify-between rounded-md border bg-white px-3 py-2.5">
          <div>
            <Label htmlFor={path.join(".")}>{def.label}</Label>
            {def.help && <p className="text-xs text-muted-foreground">{def.help}</p>}
          </div>
          <Switch
            id={path.join(".")}
            checked={value === true}
            onCheckedChange={(checked) => handleChange(checked)}
          />
        </div>
      );
    case "stringList":
      return (
        <div className="space-y-1.5">
          <Label>{def.label}</Label>
          {def.help && <p className="text-xs text-muted-foreground">{def.help}</p>}
          <StringListField field={def} value={value as string[]} path={path} onChange={onChange} />
        </div>
      );
    case "group":
      return (
        <div className="rounded-lg border bg-neutral-50 p-4 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-700">
            {def.label}
          </p>
          {def.fields.map((f) => (
            <Field
              key={f.key}
              def={f}
              value={(value as Record<string, unknown>)?.[f.key]}
              path={[...path, f.key]}
              onChange={onChange}
              compact
            />
          ))}
        </div>
      );
    case "list":
      return (
        <div className="space-y-1.5">
          <Label>{def.label}</Label>
          {def.help && <p className="text-xs text-muted-foreground">{def.help}</p>}
          <div className="space-y-3">
            {(Array.isArray(value) ? value : []).map((item, i) => (
              <div key={i} className="rounded-lg border bg-white p-4 space-y-4 relative">
                <div className="flex items-center justify-between gap-2 pb-2 border-b">
                  <p className="text-sm font-bold text-red-700 truncate">
                    {def.titleKey && def.titleKey !== "__none"
                      ? itemTitle(item, def.titleKey)
                      : `Item ${i + 1}`}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={i === 0}
                      onClick={() => {
                        const arr = [...(value as unknown[])];
                        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                        handleChange(arr);
                      }}
                      aria-label="Move up"
                    >
                      <ChevronUp size={15} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={i === (value as unknown[]).length - 1}
                      onClick={() => {
                        const arr = [...(value as unknown[])];
                        [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
                        handleChange(arr);
                      }}
                      aria-label="Move down"
                    >
                      <ChevronDown size={15} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-600 hover:text-red-700"
                      onClick={() =>
                        handleChange((value as unknown[]).filter((_, j) => j !== i))
                      }
                      aria-label="Remove"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
                {def.fields.map((f) => (
                  <Field
                    key={f.key}
                    def={f}
                    value={(item as Record<string, unknown>)?.[f.key]}
                    path={[...path, i, f.key]}
                    onChange={onChange}
                    compact
                  />
                ))}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                handleChange([...(Array.isArray(value) ? value : []), emptyValueFor(def.fields)])
              }
            >
              <Plus size={15} /> {def.addLabel || "Add item"}
            </Button>
          </div>
        </div>
      );
  }
}
