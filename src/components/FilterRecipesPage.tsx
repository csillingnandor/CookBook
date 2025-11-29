import { useState, useEffect } from "preact/hooks";
import "./FilterRecipesPage.css";

export type DifficultyOption = "" | "könnyű" | "közepes" | "nehéz";
export type PriceLevelOption = "" | "olcsó" | "megfizethető" | "drága";
export type TimeRangeOption = "" | "0-10" | "10-30" | "30-60" | "60+";

export interface RecipeFilterValues {
    category: string;        // "" = minden
    ingredientQuery: string; // vesszővel elválasztott alapanyagok
    difficulty: DifficultyOption;
    timeRange: TimeRangeOption;
    priceLevel: PriceLevelOption;
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
        // kategória: ha nincs külön filter, marad a CategoryList választása
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

    // --- autocomplete-hez: aktuális tokenek ---
    const ingredientTokens = localFilters.ingredientQuery
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

    const search = ingredientTokens[ingredientTokens.length - 1] ?? "";
    const suggestions = ingredientSuggestions
        .filter((name) =>
            !search
                ? true
                : name.toLowerCase().includes(search.toLowerCase())
        )
        .filter(
            (name) =>
                !ingredientTokens.some(
                    (t) => t && name.toLowerCase() === t.toLowerCase()
                )
        )
        .slice(0, 6);

    const handleAddIngredientToken = (name: string) => {
        const current = localFilters.ingredientQuery;
        const tokens = current
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        if (
            tokens.some((t) => t.toLowerCase() === name.toLowerCase())
        ) {
            return;
        }

        const nextTokens = [...tokens, name];
        const next = nextTokens.join(", ");
        handleChange("ingredientQuery", next);
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

                    {/* Alapanyag + autocomplete + AND/OR mód */}
                    <div className="filter-field">
                        <label className="filter-label">
                            Alapanyagok (vesszővel elválasztva)
                        </label>
                        <input
                            type="text"
                            placeholder="pl. csirke, tészta…"
                            value={localFilters.ingredientQuery}
                            onInput={(e) =>
                                handleChange(
                                    "ingredientQuery",
                                    (e.target as HTMLInputElement).value
                                )
                            }
                        />

                        {suggestions.length > 0 && (
                            <div className="ingredient-suggestions">
                                {suggestions.map((name) => (
                                    <button
                                        key={name}
                                        type="button"
                                        className="ingredient-chip"
                                        onClick={() => handleAddIngredientToken(name)}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>


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
                                            .value as DifficultyOption
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
                                            .value as TimeRangeOption
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
                                            .value as PriceLevelOption
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
