import { ContentForm } from "@/components/admin/ContentForm";
import { findSection } from "@/lib/admin-sections";
import { loadSection } from "@/lib/content";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ContentSectionPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const section = findSection(key);
  if (!section) notFound();
  const initial = (await loadSection(section.key)) as unknown as Record<string, unknown>;

  return <ContentForm section={section} initial={initial} />;
}
