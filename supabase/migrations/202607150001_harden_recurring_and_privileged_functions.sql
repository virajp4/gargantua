-- Keep the emergency production containment reproducible for new environments.
do $$
begin
  if exists (
    select 1 from cron.job where jobname = 'process-recurring-transactions'
  ) then
    perform cron.unschedule('process-recurring-transactions');
  end if;
end
$$;

revoke execute on function gargantua.process_recurring_transactions()
  from public, anon, authenticated;
revoke execute on function gargantua.user_has_access(uuid)
  from public, anon, authenticated;
revoke execute on function public.grant_project_access(uuid, text, text)
  from public, anon, authenticated;
revoke execute on function public.handle_new_user()
  from public, anon, authenticated;

alter function gargantua.process_recurring_transactions()
  set search_path = '';
alter function public.handle_updated_at()
  set search_path = public;
alter function gargantua.update_updated_at_column()
  set search_path = gargantua, public;
alter function gargantua.update_wishlist_updated_at()
  set search_path = gargantua, public;
