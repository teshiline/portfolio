import type { AssetUsage, EngagementType } from "@/lib/constants";

export type SiteSettings = {
  id: number;
  business_name: string;
  person_name: string;
  role_label: string;
  hero_title: string;
  hero_lead: string;
  about_body: string;
  portrait_url: string;
  email: string;
  line_url: string;
  crowdworks_url: string;
  meta_description: string;
};

export type Service = {
  id: string;
  name: string;
  summary: string;
  body: string;
  deliverables: string[];
  sort_order: number;
  published: boolean;
};

export type WorkResult = {
  id: string;
  work_id: string;
  label: string;
  before_value: string;
  after_value: string;
  display_value: string;
  is_primary: boolean;
  sort_order: number;
};

export type WorkAsset = {
  id: string;
  work_id: string;
  image_url: string;
  usage: AssetUsage;
  usage_label: string;
  intent: string;
  is_cover: boolean;
  sort_order: number;
};

export type Work = {
  id: string;
  title: string;
  slug: string;
  client_label: string;
  industry: string;
  period: string;
  engagement_type: EngagementType;
  goals: string[];
  friends_before: string;
  friends_after: string;
  summary: string;
  tools: string[];
  scope_items: string[];
  challenge: string;
  approach: string;
  our_role: string;
  client_role: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  results: WorkResult[];
  assets: WorkAsset[];
};

export type CareerEntry = {
  id: string;
  period: string;
  organization: string;
  title: string;
  description: string;
  sort_order: number;
  published: boolean;
};

export type PricingPlan = {
  id: string;
  name: string;
  price_text: string;
  unit: string;
  description: string;
  includes: string[];
  recommended: boolean;
  sort_order: number;
  published: boolean;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export type PortfolioData = {
  settings: SiteSettings;
  services: Service[];
  works: Work[];
  career: CareerEntry[];
  pricing: PricingPlan[];
  source: "supabase" | "sample";
};
