import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Get total count
  const { count, error: countError } = await supabase
    .from("viands")
    .select("*", { count: "exact", head: true });

  if (countError || !count) {
    return NextResponse.json({ error: "No dishes found" }, { status: 404 });
  }

  // Pick a random offset and fetch that single row
  const idx = Math.floor(Math.random() * count);
  const { data, error } = await supabase
    .from("viands")
    .select("*")
    .range(idx, idx)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to fetch dish" }, { status: 500 });
  }

  return NextResponse.json({ viand: data });
}
