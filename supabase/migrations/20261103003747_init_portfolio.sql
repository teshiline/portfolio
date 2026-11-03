-- Portfolio content, row level security, and the public media bucket.

create type public.engagement_type as enum ('new_build', 'operation', 'improvement');
create type public.asset_usage as enum (
  'rich_menu',
  'greeting',
  'message_image',
  'rich_message',
  'flex',
  'shop_card',
  'other'
);

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

create table public.site_settings (
  id integer primary key default 1 check (id = 1),
  business_name text not null default '',
  person_name text not null default '',
  role_label text not null default '',
  hero_title text not null default '',
  hero_lead text not null default '',
  about_body text not null default '',
  portrait_url text not null default '',
  email text not null default '',
  line_url text not null default '',
  crowdworks_url text not null default '',
  meta_description text not null default '',
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  summary text not null default '',
  body text not null default '',
  deliverables text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  client_label text not null default '',
  industry text not null default '',
  period text not null default '',
  engagement_type public.engagement_type not null,
  goals text[] not null default '{}',
  friends_before text not null default '',
  friends_after text not null default '',
  summary text not null default '',
  tools text[] not null default '{}',
  scope_items text[] not null default '{}',
  challenge text not null default '',
  approach text not null default '',
  our_role text not null default '',
  client_role text not null default '',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index works_tools_idx on public.works using gin (tools);
create index works_sort_idx on public.works (sort_order);

create table public.work_results (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works (id) on delete cascade,
  label text not null,
  before_value text not null default '',
  after_value text not null default '',
  display_value text not null default '',
  is_primary boolean not null default false,
  sort_order integer not null default 0
);

create table public.work_assets (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works (id) on delete cascade,
  image_url text not null,
  usage public.asset_usage not null,
  usage_label text not null default '',
  intent text not null,
  is_cover boolean not null default false,
  sort_order integer not null default 0,
  constraint work_assets_intent_present check (length(btrim(intent)) > 0),
  constraint work_assets_other_label check (usage <> 'other' or length(btrim(usage_label)) > 0)
);

create table public.career_entries (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  organization text not null,
  title text not null,
  description text not null default '',
  sort_order integer not null default 0,
  published boolean not null default false
);

create table public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_text text not null,
  unit text not null default '',
  description text not null default '',
  includes text[] not null default '{}',
  recommended boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default false
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  constraint inquiries_name_length check (char_length(name) between 1 and 80),
  constraint inquiries_email_length check (char_length(email) between 3 and 200),
  constraint inquiries_message_length check (char_length(message) between 1 and 4000)
);

alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.works enable row level security;
alter table public.work_results enable row level security;
alter table public.work_assets enable row level security;
alter table public.career_entries enable row level security;
alter table public.pricing_plans enable row level security;
alter table public.inquiries enable row level security;

create policy site_settings_select on public.site_settings
  for select to anon, authenticated using (true);
create policy site_settings_write on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy services_select on public.services
  for select to anon, authenticated using (published or public.is_admin());
create policy services_insert on public.services
  for insert to authenticated with check (public.is_admin());
create policy services_update on public.services
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy services_delete on public.services
  for delete to authenticated using (public.is_admin());

create policy works_select on public.works
  for select to anon, authenticated using (published or public.is_admin());
create policy works_insert on public.works
  for insert to authenticated with check (public.is_admin());
create policy works_update on public.works
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy works_delete on public.works
  for delete to authenticated using (public.is_admin());

create policy work_results_select on public.work_results
  for select to anon, authenticated
  using (
    public.is_admin()
    or exists (select 1 from public.works where works.id = work_results.work_id and works.published)
  );
create policy work_results_insert on public.work_results
  for insert to authenticated with check (public.is_admin());
create policy work_results_update on public.work_results
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy work_results_delete on public.work_results
  for delete to authenticated using (public.is_admin());

create policy work_assets_select on public.work_assets
  for select to anon, authenticated
  using (
    public.is_admin()
    or exists (select 1 from public.works where works.id = work_assets.work_id and works.published)
  );
create policy work_assets_insert on public.work_assets
  for insert to authenticated with check (public.is_admin());
create policy work_assets_update on public.work_assets
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy work_assets_delete on public.work_assets
  for delete to authenticated using (public.is_admin());

create policy career_select on public.career_entries
  for select to anon, authenticated using (published or public.is_admin());
create policy career_insert on public.career_entries
  for insert to authenticated with check (public.is_admin());
create policy career_update on public.career_entries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy career_delete on public.career_entries
  for delete to authenticated using (public.is_admin());

create policy pricing_select on public.pricing_plans
  for select to anon, authenticated using (published or public.is_admin());
create policy pricing_insert on public.pricing_plans
  for insert to authenticated with check (public.is_admin());
create policy pricing_update on public.pricing_plans
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy pricing_delete on public.pricing_plans
  for delete to authenticated using (public.is_admin());

create policy inquiries_insert on public.inquiries
  for insert to anon, authenticated
  with check (position('@' in email) > 1);
create policy inquiries_select on public.inquiries
  for select to authenticated using (public.is_admin());
create policy inquiries_delete on public.inquiries
  for delete to authenticated using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.site_settings, public.services, public.works, public.work_results, public.work_assets, public.career_entries, public.pricing_plans to anon, authenticated;
grant insert, update, delete on public.site_settings, public.services, public.works, public.work_results, public.work_assets, public.career_entries, public.pricing_plans to authenticated;
grant insert on public.inquiries to anon, authenticated;
grant select, delete on public.inquiries to authenticated;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

create policy media_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');
create policy media_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
create policy media_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
create policy media_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

insert into public.site_settings (
  id, business_name, person_name, role_label, hero_title, hero_lead, about_body, portrait_url, email, meta_description
) values (
  1,
  'LINE構築・運用',
  '氏名（サンプル）',
  'LINE公式アカウントの構築・運用',
  E'友だち追加のあとまで設計する\nLINE公式アカウント',
  'リッチメニュー、配信、計測までを一つの導線として組み立てます。業種と規模が近い実績から、依頼範囲を確認できます。掲載内容はサンプルです。',
  '個人事業として、LINE公式アカウントの新規構築、既存アカウントの改善、月次の配信運用を行っています。この文章はサンプルです。管理画面のサイト設定から差し替えてください。',
  '/samples/portrait.svg',
  'contact@example.com',
  'LINE公式アカウントの構築と運用の実績、料金、経歴をまとめたポートフォリオです。'
);

insert into public.services (id, name, summary, body, deliverables, sort_order, published) values
(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  'アカウント構築',
  'あいさつ、リッチメニュー、タグ、初期のステップ配信までを一式で設計します。',
  '新規開設と、既存アカウントの土台の作り直しに対応します。目的（予約、来店、購入）に合わせて、追加直後の導線を先に決めます。',
  array['アカウント設計', 'リッチメニュー', 'あいさつメッセージ', 'タグ設計'],
  1, true
),
(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
  '配信・運用代行',
  '月次の配信計画、原稿、セグメント、数値の振り返りを継続して担当します。',
  '配信して終わりにせず、開封とクリックを見て翌月のテーマを変えます。ツールはLステップ、エルメ、LINE公式アカウントの標準機能から選びます。',
  array['配信カレンダー', 'メッセージ原稿', 'セグメント配信', '月次レポート'],
  2, true
),
(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
  '計測と改善',
  'Google Analytics 4 とLINE側の数値を突き合わせ、導線のどこで落ちているかを特定します。',
  'リッチメニューのタップ先、予約フォーム、購入ページのどこで止まっているかを見たうえで、メニュー構成か配信文のどちらを直すかを決めます。',
  array['計測設計', 'Looker Studio または表計算のレポート', '改善案'],
  3, true
);

insert into public.works (
  id, title, slug, client_label, industry, period, engagement_type, goals,
  friends_before, friends_after, summary, tools, scope_items, challenge, approach,
  our_role, client_role, featured, published, sort_order
) values
(
  '11111111-1111-4111-8111-111111111111',
  '美容サロンの予約導線をリッチメニューから組み直した',
  'beauty-salon-reservation',
  '都内の美容サロン（匿名）',
  '美容',
  '2025年4月–6月',
  'improvement',
  array['予約'],
  '約2,400人',
  '約3,100人',
  'クーポンが前面に出ていたメニューを、予約・メニュー・アクセスの3導線に整理し、追加直後のステップで来店前の不安を潰しました。数値はサンプルです。',
  array['LINE公式アカウント', 'Lステップ', 'Google Analytics 4'],
  array['リッチメニュー', 'あいさつメッセージ', 'ステップ配信', 'タグ設計', '数値レポート'],
  '友だちは増えていた一方で、リッチメニューの主ボタンがクーポンになっており、予約ページへの遷移が月間で一桁台でした。配信は全員に同じ文面を送っていました。',
  '追加直後に来店目的を聞く1問を置き、新規と再来でステップを分けました。リッチメニューは予約を最上段にし、料金とアクセスは下段にまとめました。配信後のクリックはGoogle Analytics 4の予約完了と突き合わせています。',
  '導線設計、リッチメニュー、ステップ配信、タグ、月次の数値確認。',
  '施術写真、メニュー価格、予約ページのURL、配信文の最終確認。',
  true, true, 1
),
(
  '22222222-2222-4222-8222-222222222222',
  '飲食店の友だち追加から来店案内までを新規に構築した',
  'restaurant-visit-flow',
  '郊外の飲食店（匿名）',
  '飲食',
  '2025年1月–3月',
  'new_build',
  array['来店'],
  '0人',
  '約1,200人',
  '公式アカウント開設、店頭QR、エルメのあいさつとリッチメニューを同時に用意し、追加した人が営業時間と席の空きをその場で確認できるようにしました。数値はサンプルです。',
  array['LINE公式アカウント', 'エルメ'],
  array['リッチメニュー', 'あいさつメッセージ', 'ショップカード', '応答メッセージ'],
  'アカウントがなく、来店前の問い合わせが電話に集中していました。SNSの投稿からは営業時間が分かりにくい状態でした。',
  '店頭ポップのQRをあいさつメッセージに直結し、リッチメニューには営業時間、メニュー、地図、予約電話を置きました。雨天と貸切の連絡だけ応答メッセージで定型化しています。',
  '開設手順の案内、リッチメニュー、あいさつ、ショップカード、店頭QRの入稿データ。',
  '店舗写真、メニューPDF、営業時間、LINE公式アカウントの本人確認。',
  true, true, 2
);

insert into public.work_results (id, work_id, label, before_value, after_value, display_value, is_primary, sort_order) values
('33333333-3333-4333-8333-333333333331', '11111111-1111-4111-8111-111111111111', '予約ページ遷移率', '6%', '14%', '予約ページ遷移率 6% → 14%', true, 1),
('33333333-3333-4333-8333-333333333332', '11111111-1111-4111-8111-111111111111', '配信のクリック率', '4%', '9%', 'クリック率 4% → 9%', false, 2),
('33333333-3333-4333-8333-333333333333', '22222222-2222-4222-8222-222222222222', '友だち数', '0人', '約1,200人', '友だち数 0人 → 約1,200人', true, 1),
('33333333-3333-4333-8333-333333333334', '22222222-2222-4222-8222-222222222222', '営業時間のタップ', '計測なし', '月180回', '営業時間タップ 月180回', false, 2);

insert into public.work_assets (id, work_id, image_url, usage, intent, is_cover, sort_order) values
('44444444-4444-4444-8444-444444444441', '11111111-1111-4111-8111-111111111111', '/samples/salon-rich-menu.svg', 'rich_menu', '予約を最上段の全面ボタンにし、クーポンは下段へ下げた。', true, 1),
('44444444-4444-4444-8444-444444444442', '11111111-1111-4111-8111-111111111111', '/samples/salon-greeting.svg', 'greeting', '追加直後に、新規か再来かを選ばせてステップを分岐した。', false, 2),
('44444444-4444-4444-8444-444444444443', '11111111-1111-4111-8111-111111111111', '/samples/salon-message.svg', 'message_image', '空き状況の告知は日付だけを大きくし、詳細は予約ボタンに集約した。', false, 3),
('44444444-4444-4444-8444-444444444444', '22222222-2222-4222-8222-222222222222', '/samples/restaurant-rich-menu.svg', 'rich_menu', '営業時間と地図を常時表示し、来店前の電話を減らす配置にした。', true, 1),
('44444444-4444-4444-8444-444444444445', '22222222-2222-4222-8222-222222222222', '/samples/restaurant-message.svg', 'message_image', '貸切の空き告知は日付と人数だけを載せ、詳細は店頭案内に戻した。', false, 2);

insert into public.career_entries (id, period, organization, title, description, sort_order, published) values
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', '2022年 — 現在', '個人事業', 'LINE公式アカウント構築・運用', '構築、配信代行、リッチメニュー制作、計測の改善を個人で受託。この経歴はサンプルです。', 1, true),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', '2019年 — 2022年', 'Web制作会社', 'ディレクター', '中小企業のサイト制作で、問い合わせ導線と計測の設計を担当。', 2, true),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3', '2016年 — 2019年', '小売', '店舗運営', '店頭の告知とリピート施策を担当。来店までの案内文を書く仕事が、いまの配信設計の基礎になっています。', 3, true);

insert into public.pricing_plans (id, name, price_text, unit, description, includes, recommended, sort_order, published) values
('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', '構築', '15万円〜', '一式', '開設または既存アカウントの導線を、リッチメニューと初期配信まで整えます。', array['ヒアリング', 'リッチメニュー', 'あいさつと初期ステップ', 'タグの初期設計'], false, 1, true),
('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', '運用代行', '月額 5万円〜', '月額', '配信計画、原稿、配信設定、月末の数値確認を継続して行います。', array['月4本までの配信', 'セグメント設定', '月末レポート', 'リッチメニューの軽微な差し替え'], true, 2, true),
('cccccccc-cccc-4ccc-8ccc-ccccccccccc3', 'スポット改善', '要相談', 'スポット', 'リッチメニューだけ、計測だけ、など範囲を切った改善です。', array['現状の確認', '改善箇所の実装', '確認用の数値の見方'], false, 3, true);
