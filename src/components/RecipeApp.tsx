import { useState, useEffect, useMemo } from "preact/hooks";
import { Recipe } from "../types/Recipe";
import { Ingredient } from "../types/Ingredient";

import { RecipeList } from "./RecipeList";
import { RecipeDetails } from "./RecipeDetails";
import { AddRecipeButton } from "./AddRecipeButton";
import { ModalOverlay, ModalMode } from "./ModalOverlay";
import { CategoryList } from "./CategoryList";
import { FilterRecipesButton } from "./FilterRecipesButton";
import { FilterRecipesPage, RecipeFilterValues } from "./FilterRecipesPage";

import { useRecipes } from "../hooks/useRecipes";
import { useSelectedRecipe } from "../hooks/useSelectedRecipe";
import { useCategories } from "../hooks/useCategories";
import { useShoppingList } from "../hooks/useShoppingList";
import { useIngredientSuggestions } from "../hooks/useIngredientSuggestions";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

import { filterRecipes } from "../utils/recipeFilter";

import "./CategoryList.css";
import "./RecipeList.css";
import "./CategoryForm.css";
import "./RecipeApp.css";

export const RecipeApp = () => {
    // Receptek (CRUD + localStorage)
    const { allRecipes, saveRecipe, deleteRecipe, clearCategoryFromRecipes } = useRecipes();

    // Kiválasztott recept (localStorage)
    const { selected, select, clear } = useSelectedRecipe(allRecipes);

    // Detail nézetre váltáskor görgessünk fel
    useEffect(() => {
        if (selected) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [selected]);

    // Kategóriák
    const {
        categories,
        selectedCategory,
        addCategory,
        selectCategory,
        deleteCategory,   // ⬅ EZ HIÁNYZOTT
        ALL_CATEGORY_NAME,
    } = useCategories();


    // Szűrő értékek
    const [filters, setFilters] = useState<RecipeFilterValues>({
        category: "",
        ingredientQuery: "",
        difficulty: "",
        timeRange: "",
        priceLevel: "",
    });

    // Bevásárlólista
    const { shoppingItems, toggleIngredientInShoppingList } = useShoppingList();

    // Modal állapot
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [modalMode, setModalMode] = useState<ModalMode>("none");

    // Szűrő overlay állapota
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Scroll lock, ha modal vagy filter nyitva
    useBodyScrollLock(modalMode !== "none" || isFilterOpen);

    // Kategória választás – detail nézetből visszalépünk listára
    const handleSelectCategory = (name: string) => {
        selectCategory(name);
        clear();
    };

    // Alapanyag javaslatok a szűrőhöz
    const ingredientSuggestions = useIngredientSuggestions(allRecipes);

    // Szűrt receptek
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

    // --- Modal vezérlés ---

    const openEditForm = (recipe: Recipe) => {
        setEditingRecipe(recipe);
        setModalMode("recipe");
    };

    const openChooserModal = () => {
        setModalMode("chooser");
        setEditingRecipe(null);
    };

    const openRecipeModal = () => {
        setModalMode("recipe");
        setEditingRecipe(null);
    };

    const openCategoryModal = () => {
        setModalMode("category");
        setEditingRecipe(null);
    };

    const closeModal = () => {
        setModalMode("none");
        setEditingRecipe(null);
    };

    const handleSaveCategory = (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        addCategory(trimmed);
        closeModal();
    };

    const handleDeleteCategory = (name: string) => {
        deleteCategory(name);            // useCategories-ből
        clearCategoryFromRecipes(name);  // useRecipes-ből
    };


    const handleSaveRecipe = (
        data: Omit<Recipe, "id">,
        idToUpdate?: number | null
    ) => {
        // ha új kategória, vegyük fel
        if (data.category) {
            addCategory(data.category);
        }

        saveRecipe(data, idToUpdate ?? undefined);
        closeModal();
    };

    const handleDeleteRecipe = (id: number) => {
        deleteRecipe(id);

        // ha a törölt recept volt kiválasztva, lépjünk vissza listára
        if (selected && selected.id === id) {
            clear();
        }
    };

    // --- Szűrők ---

    const handleApplyFilters = (values: RecipeFilterValues) => {
        setFilters(values);
        setIsFilterOpen(false);
    };

    const handleClearFilterValues = () => {
        setFilters({
            category: "",
            ingredientQuery: "",
            difficulty: "",
            timeRange: "",
            priceLevel: "",
        });
    };

    const isBlurred = modalMode !== "none" || isFilterOpen;

    return (
        <div className="recipe-app-root">
            <div
                className={
                    isBlurred
                        ? "recipe-app-blur-wrapper is-blurred"
                        : "recipe-app-blur-wrapper"
                }
            >
                {/* LISTA NÉZET */}
                {!selected && (
                    <div className="recipe-list-container">
                        <div className="recipe-main-layout">
                            {/* Bal oldal – kategóriák */}
                            <CategoryList
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onSelectCategory={handleSelectCategory}
                                onDeleteCategory={handleDeleteCategory}
                            />

                            {/* Jobb oldal – recept kártyák */}
                            <div className="recipe-main-content">
                                <h1>Receptlista</h1>

                                <RecipeList
                                    recipes={filteredRecipes}
                                    shoppingItems={shoppingItems}
                                    onSelect={select}
                                    onToggleIngredient={toggleIngredientInShoppingList}
                                    onEdit={openEditForm}
                                    onDelete={handleDeleteRecipe}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* DETAIL NÉZET */}
                {selected && (
                    <div className="recipe-detail-container">
                        <button className="back-button" onClick={clear}>
                            ← Vissza
                        </button>

                        <RecipeDetails
                            recipe={selected}
                            shoppingItems={shoppingItems}
                            onToggleIngredient={toggleIngredientInShoppingList}
                            onEditRecipe={openEditForm}
                            onDeleteRecipe={handleDeleteRecipe}
                        />
                    </div>
                )}

                {/* Lebegő gombok csak listanézetben, modal/szűrő nélkül */}
                {!selected && modalMode === "none" && !isFilterOpen && (
                    <div className="floating-actions">
                        <FilterRecipesButton onClick={() => setIsFilterOpen(true)} />
                        <AddRecipeButton onClick={openChooserModal} />
                    </div>
                )}
            </div>

            {/* Fő modal (chooser / recipe / category) */}
            <ModalOverlay
                mode={modalMode}
                categories={categories}
                editingRecipe={editingRecipe}
                onClose={closeModal}
                onChooseRecipe={openRecipeModal}
                onChooseCategory={openCategoryModal}
                onSaveRecipe={handleSaveRecipe}
                onSaveCategory={handleSaveCategory}
            />

            {/* Szűrő overlay / oldal */}
            {isFilterOpen && (
                <FilterRecipesPage
                    categories={categories}
                    selectedCategory={selectedCategory}
                    filters={filters}
                    ingredientSuggestions={ingredientSuggestions}
                    ALL_CATEGORY_NAME={ALL_CATEGORY_NAME}
                    onChangeCategory={handleSelectCategory}
                    onApplyFilters={handleApplyFilters}
                    onClearFilters={handleClearFilterValues}
                    onClose={() => setIsFilterOpen(false)}
                />
            )}
        </div>
    );
};
