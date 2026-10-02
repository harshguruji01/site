# Supabase MCP Project Mapping Rule

When working in the **site** workspace (`c:\Users\harsh\OneDrive\Desktop\site`), always use the **HarshGuruJi / WebGuruJi** Supabase project for all MCP tool calls:

- **Project ID (ref):** `wumdbpyhpblvgjttsbpv`
- **Supabase URL:** `https://wumdbpyhpblvgjttsbpv.supabase.co`

## When calling Supabase MCP tools (e.g. `execute_sql`, `list_tables`, `apply_migration`, `get_advisors`, etc.):
- Always pass `project_id: "wumdbpyhpblvgjttsbpv"`
- **NEVER** use the chatbase project ID (`hzojuiccegnvanqowgmf`) when working in this folder

## Project Context
- This is the **WebGuruJi / HarshGuruJi** main website
- Domain: `www.webguruji.online`
- Built with: Vanilla HTML/CSS/JS + Supabase
- Tables include: site data, contacts, store products, contributors, user accounts, etc.
- Has SQL setup files: `supabase_chat_setup.sql`, `supabase_contact_setup.sql`, `supabase_store_setup.sql`, `supabase_contributors_setup.sql`
