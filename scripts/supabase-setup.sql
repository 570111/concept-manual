-- 破局手册：Supabase 数据库初始化脚本
-- 在 Supabase 控制台 -> SQL Editor 里粘贴整个文件，点 Run 执行一次即可。

create extension if not exists pgcrypto;

-- ---------- 内容表 ----------

create table if not exists concepts (
  id text primary key,
  icon text not null,
  title text not null,
  aka text not null,
  summary text not null,
  category text not null,
  sort_order int not null
);

create table if not exists concept_content (
  concept_id text primary key references concepts(id) on delete cascade,
  story text not null,
  explain text not null,
  apply jsonb not null,
  pitfall text not null,
  related jsonb not null
);

create table if not exists quiz_questions (
  id text primary key,
  concept_id text not null references concepts(id) on delete cascade,
  difficulty text not null,
  question text not null,
  options jsonb not null,
  correct_index int not null,
  explanation text not null
);

create table if not exists access_keys (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  hash text not null,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- 行级安全：默认全部拒绝，只能通过下面的函数访问 ----------

alter table concepts enable row level security;
alter table concept_content enable row level security;
alter table quiz_questions enable row level security;
alter table access_keys enable row level security;
-- 不创建任何 policy = anon/authenticated 角色对这些表没有任何直接读写权限

-- ---------- 校验密钥 + 返回全部内容（唯一对外开放的入口）----------

create or replace function verify_key_and_get_content(input_key text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  found_label text;
  result jsonb;
begin
  select label into found_label
  from access_keys
  where hash = crypt(input_key, hash) and not revoked
  limit 1;

  if found_label is null then
    return jsonb_build_object('ok', false);
  end if;

  select jsonb_build_object(
    'ok', true,
    'label', found_label,
    'concepts', (select coalesce(jsonb_agg(to_jsonb(c) order by c.sort_order), '[]'::jsonb) from concepts c),
    'content', (select coalesce(jsonb_object_agg(cc.concept_id, jsonb_build_object(
                  'story', cc.story, 'explain', cc.explain, 'apply', cc.apply,
                  'pitfall', cc.pitfall, 'related', cc.related
                )), '{}'::jsonb) from concept_content cc),
    'quiz', (select coalesce(jsonb_agg(to_jsonb(q)), '[]'::jsonb) from quiz_questions q)
  ) into result;

  return result;
end;
$$;

-- ---------- 管理函数：新增/吊销密钥，只给 service_role 用 ----------

create or replace function add_access_key(input_label text, plain_key text)
returns void
language sql
security definer
set search_path = public, extensions
as $$
  insert into access_keys (label, hash) values (input_label, crypt(plain_key, gen_salt('bf')));
$$;

create or replace function revoke_access_key(target_label text)
returns void
language sql
security definer
set search_path = public, extensions
as $$
  update access_keys set revoked = true where label = target_label;
$$;

-- ---------- 权限收紧：网站(anon)只能调用校验函数，管理函数只能用 service_role 调 ----------

revoke execute on function verify_key_and_get_content(text) from public;
grant execute on function verify_key_and_get_content(text) to anon, authenticated;

revoke execute on function add_access_key(text, text) from public, anon, authenticated;
revoke execute on function revoke_access_key(text) from public, anon, authenticated;
