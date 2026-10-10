import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { GuideForm } from "@/components/admin/GuideForm";

export const dynamic = "force-dynamic";

export default async function GuideEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return (
      <GuideForm
        guideId={null}
        initial={{
          slug: "",
          tag: "Fundamentals",
          title: "",
          desc: "",
          readTime: "6 min",
          published: true,
          order: 0,
          body: [],
          pdfName: "",
        }}
      />
    );
  }

  let guide: Awaited<ReturnType<typeof db.guide.findUnique>> = null;
  try {
    guide = await db.guide.findUnique({ where: { id } });
  } catch {
    guide = null;
  }
  if (!guide) notFound();

  let body: { heading: string; paras: string[] }[] = [];
  try {
    const parsed = JSON.parse(guide.body);
    if (Array.isArray(parsed)) body = parsed;
  } catch {
    body = [];
  }

  return (
    <GuideForm
      guideId={guide.id}
      initial={{
        slug: guide.slug,
        tag: guide.tag,
        title: guide.title,
        desc: guide.desc,
        readTime: guide.readTime,
        published: guide.published,
        order: guide.order,
        body,
        pdfName: guide.pdfName ?? "",
      }}
    />
  );
}
