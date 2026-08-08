-- 破局手册：给 concept_content 表新增 second_case / self_task / further_reading 三列，并更新读取函数。
-- 在 Supabase 控制台 -> SQL Editor 里粘贴整个文件，点 Run 执行一次即可。
-- 不会影响已有的密钥、概念、测验数据。

alter table concept_content add column if not exists second_case jsonb not null default '{"title":"","body":""}'::jsonb;
alter table concept_content add column if not exists self_task text not null default '';
alter table concept_content add column if not exists further_reading jsonb not null default '{"title":"","type":"","note":""}'::jsonb;

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
                  'story', cc.story, 'explain', cc.explain, 'realCase', cc.real_case, 'secondCase', cc.second_case,
                  'apply', cc.apply, 'misconceptions', cc.misconceptions, 'pitfall', cc.pitfall,
                  'selfTask', cc.self_task, 'furtherReading', cc.further_reading, 'related', cc.related
                )), '{}'::jsonb) from concept_content cc),
    'quiz', (select coalesce(jsonb_agg(to_jsonb(q)), '[]'::jsonb) from quiz_questions q)
  ) into result;

  return result;
end;
$$;
