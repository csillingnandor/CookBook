import { useMemo } from "preact/hooks";
import { Recipe } from "../types/Recipe";

export const useIngredientSuggestions = (allRecipes: Recipe[]) => {
  return useMemo(() => {
    const names = new Set<string>();
    allRecipes.forEach((r) => {
      r.ingredients.forEach((ing) => {
        const trimmed = ing.name.trim();
        if (trimmed) names.add(trimmed);
      });
    });
    return Array.from(names).sort((a, b) =>
      a.localeCompare(b, "hu")
    );
  }, [allRecipes]);
};
