import { useMemo } from "preact/hooks";
import { Recipe } from "../types/Recipe";

/**
 * @remarks Testreszabott hook a hozzávaló javaslatok lekéréséhez az összes recept alapján.
 * @param allRecipes Az összes recept tömbje
 * @returns 
 */

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
