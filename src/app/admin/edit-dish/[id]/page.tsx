"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = ["Main", "Sabaw", "Gulay", "Prito", "Ihaw", "Dessert", "Snack", "Kakanin", "Merienda"];

export default function EditDishPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [quickRecipe, setQuickRecipe] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [category, setCategory] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/admin/dishes/${id}`)
      .then((r) => r.json())
      .then(({ dish, error: err }) => {
        if (err || !dish) { setNotFound(true); return; }
        setName(dish.name ?? "");
        setDescription(dish.description ?? "");
        setIngredients(dish.ingredients?.length ? dish.ingredients : [""]);
        setQuickRecipe(dish.quick_recipe ?? "");
        setCookTime(dish.cook_time ?? "");
        setCategory(dish.category ?? "");
        setSourceUrl(dish.source_url ?? "");
        setExistingImageUrl(dish.image_url ?? null);
        setImagePreview(dish.image_url ?? null);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function addIngredient() { setIngredients([...ingredients, ""]); }
  function removeIngredient(idx: number) { setIngredients(ingredients.filter((_, i) => i !== idx)); }
  function updateIngredient(idx: number, value: string) {
    const updated = [...ingredients];
    updated[idx] = value;
    setIngredients(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Kailangan ang pangalan ng ulam."); return; }

    setSubmitting(true);
    try {
      let image_url: string | null = existingImageUrl;

      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const uploadRes = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
        if (!uploadRes.ok) {
          const { error: uploadError } = await uploadRes.json();
          throw new Error(`Image upload failed: ${uploadError}`);
        }
        const { url } = await uploadRes.json();
        image_url = url;
      }

      const res = await fetch(`/api/admin/dishes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          image_url,
          ingredients: ingredients.filter((i) => i.trim()),
          quick_recipe: quickRecipe,
          cook_time: cookTime,
          category,
          source_url: sourceUrl,
        }),
      });

      if (!res.ok) {
        const { error: updateError } = await res.json();
        throw new Error(updateError);
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "May error na naganap.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors";
  const inputStyle = {
    background: "var(--color-surface-container)",
    color: "var(--color-on-surface)",
    border: "2px solid var(--color-outline-variant)",
  };
  const labelClass = "block text-xs font-bold uppercase tracking-wide mb-1.5";
  const labelStyle = { color: "var(--color-on-surface-variant)" };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-surface)" }}>
        <p style={{ color: "var(--color-on-surface-variant)" }}>Nilo-load...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--color-surface)" }}>
        <p className="text-lg font-bold" style={{ color: "var(--color-on-surface)" }}>Hindi nahanap ang ulam.</p>
        <Link href="/admin/dashboard" className="text-sm underline" style={{ color: "var(--color-primary)" }}>
          Bumalik sa Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>
      <header
        className="sticky top-0 z-10 px-6 py-4 flex items-center gap-4"
        style={{ background: "var(--color-primary)", color: "var(--color-on-primary)" }}
      >
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-1 text-sm opacity-80 hover:opacity-100 transition-opacity"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          Back
        </Link>
        <h1 className="font-bbt text-xl tracking-wider">I-EDIT ANG ULAM</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Image Upload */}
        <div>
          <label className={labelClass} style={labelStyle}>Larawan</label>
          <div
            className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center"
            style={{
              background: "var(--color-surface-container)",
              border: "2px dashed var(--color-outline-variant)",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2" style={{ color: "var(--color-on-surface-variant)" }}>
                <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
                <span className="text-sm">Mag-click para pumili ng larawan</span>
              </div>
            )}
            {imagePreview && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-semibold">Palitan ang larawan</span>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>

        {/* Name */}
        <div>
          <label className={labelClass} style={labelStyle}>
            Pangalan ng Ulam <span style={{ color: "var(--color-tertiary)" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="hal. Adobong Manok, Sinigang na Baboy..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass} style={labelStyle}>Paglalarawan</label>
          <textarea
            placeholder="Maikling paglalarawan ng ulam..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {/* Cook Time + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>Oras ng Pagluluto</label>
            <input
              type="text"
              placeholder="hal. 45 mins, 1.5 hrs"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Kategorya</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
              style={inputStyle}
            >
              <option value="">— Pumili —</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className={labelClass} style={labelStyle}>Mga Sangkap</label>
          <div className="flex flex-col gap-2">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Sangkap ${idx + 1}`}
                  value={ing}
                  onChange={(e) => updateIngredient(idx, e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70"
                    style={{ background: "var(--color-surface-container-high)", color: "var(--color-on-surface-variant)" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>remove</span>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold self-start transition-opacity hover:opacity-80"
              style={{ background: "var(--color-secondary-container)", color: "var(--color-on-secondary-container)" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              Magdagdag ng Sangkap
            </button>
          </div>
        </div>

        {/* Quick Recipe */}
        <div>
          <label className={labelClass} style={labelStyle}>Quick Recipe (Steps to Cook)</label>
          <p className="text-xs mb-2" style={{ color: "var(--color-on-surface-variant)" }}>
            Bawat linya = isang hakbang. Gagawing numbered steps sa app.
          </p>
          <textarea
            placeholder={"Maghanda ng lahat ng sangkap.\nLutuin ang sibuyas at bawang sa langis.\nIlagay ang karne at haluin ng 5 minuto."}
            value={quickRecipe}
            onChange={(e) => setQuickRecipe(e.target.value)}
            rows={6}
            className={inputClass}
            style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", lineHeight: 1.6 }}
          />
        </div>

        {/* Source URL */}
        <div>
          <label className={labelClass} style={labelStyle}>Source / Pinagkunan (URL)</label>
          <input
            type="url"
            placeholder="https://..."
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {error && (
          <p
            className="px-4 py-3 rounded-xl text-sm font-semibold"
            style={{ background: "#fde8e8", color: "var(--color-tertiary)" }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-2xl font-bbt text-xl tracking-widest transition-opacity disabled:opacity-50 hover:opacity-90"
          style={{ background: "var(--color-primary)", color: "var(--color-on-primary)" }}
        >
          {submitting ? "SINE-SAVE..." : "I-UPDATE ANG ULAM"}
        </button>
      </form>
    </div>
  );
}
