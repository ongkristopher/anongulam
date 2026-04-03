import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import DeleteDishButton from "@/components/admin/DeleteDishButton";

export const dynamic = "force-dynamic";

async function getDishes() {
  const { data, error } = await supabaseAdmin
    .from("viands")
    .select("id, name, category, cook_time, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export default async function AdminDashboardPage() {
  const dishes = await getDishes();

  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{
          background: "var(--color-primary)",
          color: "var(--color-on-primary)",
        }}
      >
        <h1 className="font-bbt text-2xl tracking-wider">ADMIN DASHBOARD</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm px-3 py-1.5 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            ← View Site
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats */}
        <div
          className="rounded-2xl p-6 mb-8 flex items-center gap-4"
          style={{ background: "var(--color-secondary-container)" }}
        >
          <span
            className="material-symbols-outlined text-4xl"
            style={{ color: "var(--color-on-secondary-container)" }}
          >
            restaurant_menu
          </span>
          <div>
            <p className="text-3xl font-black" style={{ color: "var(--color-on-secondary-container)" }}>
              {dishes.length}
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--color-secondary)" }}>
              Total na Ulam
            </p>
          </div>
        </div>

        {/* Add New Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold" style={{ color: "var(--color-on-surface)" }}>
            Lahat ng Ulam
          </h2>
          <Link
            href="/admin/add-dish"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: "var(--color-primary)", color: "var(--color-on-primary)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Mag-add ng Ulam
          </Link>
        </div>

        {/* Dish List */}
        {dishes.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ background: "var(--color-surface-container-low)", color: "var(--color-on-surface-variant)" }}
          >
            <p className="text-lg font-semibold mb-2">Wala pang ulam!</p>
            <p className="text-sm">Mag-add na ng unang ulam.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className="flex items-center justify-between px-5 py-4 rounded-2xl"
                style={{
                  background: "var(--color-surface-container-low)",
                  border: "1px solid var(--color-outline-variant)",
                }}
              >
                <div>
                  <p className="font-bold" style={{ color: "var(--color-on-surface)" }}>
                    {dish.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {dish.category && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: "var(--color-secondary-container)", color: "var(--color-on-secondary-container)" }}
                      >
                        {dish.category}
                      </span>
                    )}
                    {dish.cook_time && (
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--color-on-surface-variant)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>timer</span>
                        {dish.cook_time}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/edit-dish/${dish.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-70"
                    style={{ background: "var(--color-secondary-container)", color: "var(--color-on-secondary-container)" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
                    I-edit
                  </Link>
                  <DeleteDishButton id={dish.id} name={dish.name} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
