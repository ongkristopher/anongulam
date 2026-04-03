import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("viands")
    .select("id, name, category, cook_time, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dishes: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, image_url, ingredients, quick_recipe, cook_time, category, source_url } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("viands")
    .insert([
      {
        name: name.trim(),
        description: description?.trim() || null,
        image_url: image_url || null,
        ingredients: ingredients?.filter((i: string) => i.trim()) ?? [],
        quick_recipe: quick_recipe?.trim() || null,
        cook_time: cook_time?.trim() || null,
        category: category?.trim() || null,
        source_url: source_url?.trim() || null,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dish: data }, { status: 201 });
}
