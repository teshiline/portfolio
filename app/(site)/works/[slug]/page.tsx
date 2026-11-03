import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkDetail } from "@/components/WorkDetail";
import { getPublishedWork } from "@/lib/data";
import { coverAsset } from "@/lib/work-display";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { work, settings } = await getPublishedWork(slug);
  if (!work) return { title: "実績" };
  const cover = coverAsset(work);
  const description = work.summary || settings.meta_description;
  return {
    title: work.title,
    description,
    openGraph: {
      title: work.title,
      description,
      images: cover ? [{ url: cover.image_url, alt: work.title }] : undefined,
    },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { work } = await getPublishedWork(slug);
  if (!work) notFound();
  return <WorkDetail work={work} />;
}
