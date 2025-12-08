import { useState, useMemo, useCallback } from "preact/hooks";
import { Recipe } from "../types/Recipe";
import { filterRecipes } from "../utils/recipeFilter";
import type { RecipeFilterValues } from "../components/FilterRecipesPage";

/**
 * @remarks Testreszabott hook a receptek szűréséhez különböző kritériumok alapján.
 * @param allRecipes az összes recept
 * @param selectedCategory a kiválasztott kategória neve
 * @param ALL_CATEGORY_NAME az "Összes" kategória neve
 * @returns 
 */

export function useRecipeFilters(
  allRecipes: Recipe[],
  selectedCategory: string,
  ALL_CATEGORY_NAME: string
) {
  const [filters, setFilters] = useState<RecipeFilterValues>({
    category: "",
    ingredientQuery: "",
    difficulty: "",
    timeRange: "",
    priceLevel: "",
  });

  const filteredRecipes = useMemo(
    () =>
      filterRecipes(
        allRecipes,
        filters,
        selectedCategory,
        ALL_CATEGORY_NAME
      ),
    [allRecipes, filters, selectedCategory, ALL_CATEGORY_NAME]
  );

  const clearFilters = useCallback(() => {
    setFilters({
      category: "",
      ingredientQuery: "",
      difficulty: "",
      timeRange: "",
      priceLevel: "",
    });
  }, []);

  return {
    filters,
    setFilters,
    clearFilters,
    filteredRecipes,
  };
}
