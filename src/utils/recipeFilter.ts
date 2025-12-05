// recipeFilters.ts
import { Recipe } from "../types/Recipe";
import { RecipeFilterValues } from "../components/FilterRecipesPage";

export const filterRecipes = (
  allRecipes: Recipe[],
  filters: RecipeFilterValues,
  selectedCategory: string,
  ALL_CATEGORY_NAME: string
): Recipe[] => {
  const ingredientTerms = filters.ingredientQuery
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  return allRecipes
    .filter((r) => {
      const activeCategory = filters.category || selectedCategory;
      if (
        !activeCategory ||
        activeCategory === ALL_CATEGORY_NAME ||
        activeCategory === "Összes"
      ) {
        return true;
      }
      return r.category === activeCategory;
    })
    .filter((r) => {
      if (!ingredientTerms.length) return true;
      const names = r.ingredients.map((ing) =>
        ing.name.toLowerCase()
      );
      // AND
      return ingredientTerms.every((term) =>
        names.some((name) => name.includes(term))
      );
    })
    .filter((r) => {
      if (!filters.difficulty) return true;
      return r.difficulty === filters.difficulty;
    })
    .filter((r) => {
      if (!filters.priceLevel) return true;
      return r.priceLevel === filters.priceLevel;
    })
    .filter((r) => {
      if (!filters.timeRange) return true;
      if (typeof r.time !== "number") return false;

      const t = r.time;
      switch (filters.timeRange) {
        case "0-10":
          return t <= 10;
        case "10-30":
          return t > 10 && t <= 30;
        case "30-60":
          return t > 30 && t <= 60;
        case "60+":
          return t > 60;
        default:
          return true;
      }
    });
};
