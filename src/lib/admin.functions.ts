import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const getSizeOverrides = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("product_size_overrides")
    .select("product_slug, sold_out_sizes");
  if (error) {
    console.error("getSizeOverrides failed", error);
    return { overrides: {} as Record<string, string[]> };
  }
  const overrides: Record<string, string[]> = {};
  for (const row of data ?? []) {
    overrides[row.product_slug] = row.sold_out_sizes ?? [];
  }
  return { overrides };
});

export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) {
      console.error("getMyRole failed", error);
      return { isAdmin: false };
    }
    return { isAdmin: Boolean(data) };
  });

export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("claim_first_admin");
    if (error) {
      console.error("claimFirstAdmin failed", error);
      throw new Error(error.message);
    }
    return { claimed: Boolean(data) };
  });

export const setSoldOutSizes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        slug: z.string().min(1).max(200),
        sizes: z.array(z.string().min(1).max(8)).max(50),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleErr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleErr || !isAdmin) throw new Error("Forbidden");

    const { error } = await context.supabase
      .from("product_size_overrides")
      .upsert(
        {
          product_slug: data.slug,
          sold_out_sizes: data.sizes,
          updated_by: context.userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "product_slug" },
      );
    if (error) throw new Error(error.message);
    return { ok: true, slug: data.slug, sizes: data.sizes };
  });
