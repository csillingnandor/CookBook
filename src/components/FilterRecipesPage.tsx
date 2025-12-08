import { useState, useEffect } from "preact/hooks";
import "./FilterRecipesPage.css";
import { IngredientFilterField } from "./IngredientFilterField";

import { TimeRangeKey, Difficulty, PriceLevel } from "../types/recipeMeta";

export interface RecipeFilterValues {
  category: string;         
  ingredientQuery: string;  
  difficulty: "" | Difficulty;
  timeRange: "" | TimeRangeKey;
  priceLevel: "" | PriceLevel;
}

interface FilterRecipesPageProps {
  categories: string[];
  selectedCategory: string;
  filters: RecipeFilterValues;
  ingredientSuggestions: string[];
  ALL_CATEGORY_NAME: string;

  onChangeCategory: (category: string) => void;
  onApplyFilters: (filters: RecipeFilterValues) => void;
  onClearFilters: () => void;
  onClose: () => void;
}

/**
 * @remarks Szűrő oldal komponens a receptek szűréséhez különböző kritériumok alapján.
 * @param categories a kategóriák listája
 * @param selectedCategory a kiválasztott kategória neve
 * @param filters a jelenlegi szűrőértékek
 * @param ingredientSuggestions az alapanyag javaslatok listája
 * @param ALL_CATEGORY_NAME az "Összes" kategória neve
 * @param onChangeCategory a kategória változásának eseménykezelője
 * @param onApplyFilters a szűrők alkalmazásának eseménykezelője
 * @param onClearFilters a szűrők törlésének eseménykezelője
 * @param onClose a szűrő oldal bezárásának eseménykezelője
 * @returns 
 */

export const FilterRecipesPage = ({
  categories,
  selectedCategory,
  filters,
  ingredientSuggestions,
  ALL_CATEGORY_NAME,
  onChangeCategory,
  onApplyFilters,
  onClearFilters,
  onClose,
}: FilterRecipesPageProps) => {
  const [localFilters, setLocalFilters] =
    useState<RecipeFilterValues>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = <K extends keyof RecipeFilterValues>(
    key: K,
    value: RecipeFilterValues[K]
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const effectiveCategory =
      localFilters.category || selectedCategory || ALL_CATEGORY_NAME;

    onChangeCategory(effectiveCategory);
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const cleared: RecipeFilterValues = {
      category: "",
      ingredientQuery: "",
      difficulty: "",
      timeRange: "",
      priceLevel: "",
    };

    setLocalFilters(cleared);
    onClearFilters();
  };

  return (
    <div className="filter-recipes-overlay">
      <div className="filter-recipes-window">
        <div className="filter-recipes-header">
          <h2>Receptek szűrése</h2>
          <button
            type="button"
            className="filter-close-button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="filter-recipes-body">
          {/* Kategória */}
          <div className="filter-field">
            <label className="filter-label">Kategória</label>
            <select
              value={localFilters.category || selectedCategory}
              onChange={(e) =>
                handleChange(
                  "category",
                  (e.target as HTMLSelectElement).value
                )
              }
            >
              <option value="">Összes</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Alapanyag + autocomplete */}
          <IngredientFilterField
            value={localFilters.ingredientQuery}
            onChange={(val) => handleChange("ingredientQuery", val)}
            suggestions={ingredientSuggestions}
          />

          {/* Nehézség + Idő + Ár egy sorban */}
          <div className="filter-row-inline">
            <div className="filter-field">
              <label className="filter-label">Nehézség</label>
              <select
                value={localFilters.difficulty}
                onChange={(e) =>
                  handleChange(
                    "difficulty",
                    (e.target as HTMLSelectElement)
                      .value as Difficulty | ""
                  )
                }
              >
                <option value="">Bármilyen</option>
                <option value="könnyű">Könnyű</option>
                <option value="közepes">Közepes</option>
                <option value="nehéz">Nehéz</option>
              </select>
            </div>

            <div className="filter-field">
              <label className="filter-label">Elkészítési idő</label>
              <select
                value={localFilters.timeRange}
                onChange={(e) =>
                  handleChange(
                    "timeRange",
                    (e.target as HTMLSelectElement)
                      .value as TimeRangeKey | ""
                  )
                }
              >
                <option value="">Bármennyi</option>
                <option value="0-10">0–10 perc</option>
                <option value="10-30">10–30 perc</option>
                <option value="30-60">30–60 perc</option>
                <option value="60+">60+ perc</option>
              </select>
            </div>

            <div className="filter-field">
              <label className="filter-label">Ár</label>
              <select
                value={localFilters.priceLevel}
                onChange={(e) =>
                  handleChange(
                    "priceLevel",
                    (e.target as HTMLSelectElement)
                      .value as PriceLevel | ""
                  )
                }
              >
                <option value="">Bármilyen</option>
                <option value="olcsó">Olcsó</option>
                <option value="megfizethető">Megfizethető</option>
                <option value="drága">Drága</option>
              </select>
            </div>
          </div>
        </div>

        <div className="filter-recipes-footer">
          <button
            type="button"
            className="filter-secondary-button"
            onClick={handleClear}
          >
            Szűrők törlése
          </button>
          <div className="filter-footer-spacer" />
          <button
            type="button"
            className="filter-primary-button"
            onClick={handleApply}
          >
            Szűrés alkalmazása
          </button>
        </div>
      </div>
    </div>
  );
};
