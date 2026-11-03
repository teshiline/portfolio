import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import {
  sampleCareer,
  samplePricing,
  sampleServices,
  sampleSettings,
  sampleWorks,
} from "@/lib/sample-data";
import type {
  CareerEntry,
  PortfolioData,
  PricingPlan,
  Service,
  SiteSettings,
  Work,
  WorkAsset,
  WorkResult,
} from "@/lib/types";
import { sortByOrder } from "@/lib/work-display";

type WorkRow = Omit<Work, "results" | "assets"> & {
  work_results: WorkResult[] | null;
  work_assets: WorkAsset[] | null;
};

function published<T extends { published: boolean; sort_order: number }>(items: T[], includeDrafts: boolean) {
  const visible = includeDrafts ? items : items.filter((item) => item.published);
  return sortByOrder(visible);
}

function mapWork(row: WorkRow): Work {
  const { work_results, work_assets, ...work } = row;
  return {
    ...work,
    goals: work.goals ?? [],
    tools: work.tools ?? [],
    scope_items: work.scope_items ?? [],
    results: sortByOrder(work_results ?? []),
    assets: sortByOrder(work_assets ?? []),
  };
}

function samplePortfolio(includeDrafts: boolean): PortfolioData {
  return {
    settings: sampleSettings,
    services: published(sampleServices, includeDrafts),
    works: published(sampleWorks, includeDrafts),
    career: published(sampleCareer, includeDrafts),
    pricing: published(samplePricing, includeDrafts),
    source: "sample",
  };
}

export async function getPortfolio(includeDrafts = false): Promise<PortfolioData> {
  if (!isSupabaseConfigured()) return samplePortfolio(includeDrafts);

  const supabase = await createClient();
  const [settingsResult, servicesResult, worksResult, careerResult, pricingResult] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("works").select("*, work_results(*), work_assets(*)").order("sort_order"),
    supabase.from("career_entries").select("*").order("sort_order"),
    supabase.from("pricing_plans").select("*").order("sort_order"),
  ]);

  const error =
    settingsResult.error ||
    servicesResult.error ||
    worksResult.error ||
    careerResult.error ||
    pricingResult.error;
  if (error) throw new Error(error.message);

  const services = published((servicesResult.data ?? []) as Service[], includeDrafts);
  const works = published(((worksResult.data ?? []) as WorkRow[]).map(mapWork), includeDrafts);
  const career = published((careerResult.data ?? []) as CareerEntry[], includeDrafts);
  const pricing = published((pricingResult.data ?? []) as PricingPlan[], includeDrafts);

  return {
    settings: (settingsResult.data as SiteSettings | null) ?? sampleSettings,
    services,
    works,
    career,
    pricing,
    source: "supabase",
  };
}

export async function getPublishedWork(slug: string) {
  const portfolio = await getPortfolio(false);
  return {
    work: portfolio.works.find((item) => item.slug === slug),
    settings: portfolio.settings,
    source: portfolio.source,
  };
}

export async function getWorkById(id: string) {
  const portfolio = await getPortfolio(true);
  return portfolio.works.find((item) => item.id === id);
}
