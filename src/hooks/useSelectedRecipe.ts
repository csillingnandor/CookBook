// src/hooks/useSelectedRecipe.ts
import { useEffect, useState } from "preact/hooks";
import { Recipe } from "../types/Recipe";

export function useSelectedRecipe(recipes: Recipe[]) {
  const [selected, setSelected] = useState<Recipe | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("selectedRecipeId");
    if (!storedId) return;

    const id = Number(storedId);
    if (Number.isNaN(id)) return;

    const found = recipes.find((r) => r.id === id);
    if (found) setSelected(found);
  }, [recipes]);

  useEffect(() => {
    if (selected) {
      localStorage.setItem("selectedRecipeId", String(selected.id));
    } else {
      localStorage.removeItem("selectedRecipeId");
    }
  }, [selected]);

  const select = (recipe: Recipe) => setSelected(recipe);
  const clear = () => setSelected(null);

  return { selected, select, clear };
}
