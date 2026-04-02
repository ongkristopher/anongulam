export interface Viand {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  ingredients: string[];       // e.g. ["1kg Pork Belly", "1/2 cup Soy Sauce", ...]
  quick_recipe: string | null; // short step-by-step text
  cook_time: string | null;    // e.g. "45 mins"
  category: string | null;     // e.g. "Main", "Sabaw", "Gulay"
  created_at: string;
}
