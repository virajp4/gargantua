create or replace function gargantua.convert_wishlist_item_to_expense(
  p_wishlist_id uuid,
  p_category text,
  p_payment_method text,
  p_date date,
  p_description text default null,
  p_is_recurring boolean default false
)
returns gargantua.transactions
language plpgsql
security invoker
set search_path = gargantua, public
as $$
declare
  wishlist_item gargantua.wishlist%rowtype;
  expense gargantua.transactions%rowtype;
begin
  select *
  into wishlist_item
  from gargantua.wishlist
  where id = p_wishlist_id
    and user_id = (select auth.uid())
  for update;

  if not found then
    raise exception 'Wishlist item not found';
  end if;

  insert into gargantua.transactions (
    user_id,
    type,
    amount,
    category,
    payment_method,
    date,
    description,
    is_recurring,
    source
  )
  values (
    wishlist_item.user_id,
    'expense',
    wishlist_item.cost,
    p_category,
    p_payment_method,
    p_date,
    coalesce(nullif(btrim(p_description), ''), wishlist_item.item_name),
    p_is_recurring,
    null
  )
  returning * into expense;

  delete from gargantua.wishlist where id = wishlist_item.id;

  return expense;
end;
$$;

revoke execute on function gargantua.convert_wishlist_item_to_expense(uuid, text, text, date, text, boolean)
  from public, anon;
grant execute on function gargantua.convert_wishlist_item_to_expense(uuid, text, text, date, text, boolean)
  to authenticated;
