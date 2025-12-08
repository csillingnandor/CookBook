import { useState, useEffect } from "preact/hooks";
import { Recipe } from "../types/Recipe";

import { RecipeList } from "./RecipeList";
import { RecipeDetails } from "./RecipeDetails";
import { AddRecipeButton } from "./AddRecipeButton";
import { ModalOverlay } from "./ModalOverlay";
import { CategoryList } from "./CategoryList";
import { FilterRecipesButton } from "./FilterRecipesButton";
import { FilterRecipesPage, RecipeFilterValues } from "./FilterRecipesPage";

import { useRecipes } from "../hooks/useRecipes";
import { useSelectedRecipe } from "../hooks/useSelectedRecipe";
import { useCategories } from "../hooks/useCategories";
import { useShoppingList } from "../hooks/useShoppingList";
import { useIngredientSuggestions } from "../hooks/useIngredientSuggestions";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useRecipeFilters } from "../hooks/useRecipeFilters";
import { useRecipeModals } from "../hooks/useRecipeModals";

import "./CategoryList.css";
import "./RecipeList.css";
import "./CategoryForm.css";
import "./RecipeApp.css";

export const RecipeApp = () => {
  // --- Adat hookok / domain state ---

  // Receptek (CRUD + localStorage)
  const { allRecipes, saveRecipe, deleteRecipe, clearCategoryFromRecipes } =
    useRecipes();

  // Kategóriák
  const {
    categories,
    selectedCategory,
    addCategory,
    selectCategory,
    deleteCategory,
    ALL_CATEGORY_NAME,
  } = useCategories();

  // Szűrők – receptlista szűréséhez
  const { filters, setFilters, clearFilters, filteredRecipes } =
    useRecipeFilters(allRecipes, selectedCategory, ALL_CATEGORY_NAME);

  // Bevásárlólista
  const { shoppingItems, toggleIngredientInShoppingList } = useShoppingList();

  // Kiválasztott recept (detail nézet)
  const { selected, select, clear } = useSelectedRecipe(allRecipes);

  // Alapanyag javaslatok a szűrőhöz
  const ingredientSuggestions = useIngredientSuggestions(allRecipes);

  // --- UI state (modálok, szűrő, blur) ---

  const {
    modalMode,
    editingRecipe,
    openEditForm,
    openChooserModal,
    openRecipeModal,
    openCategoryModal,
    closeModal,
  } = useRecipeModals();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isBlurred = modalMode !== "none" || isFilterOpen;

  // Scroll lock, ha modal vagy filter nyitva
  useBodyScrollLock(isBlurred);

  // --- Effektek ---

  // Detail nézetre váltáskor görgessünk fel
  useEffect(() => {
    if (selected) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selected]);

  // --- Kategória-kezelés ---

  const handleSelectCategory = (name: string) => {
    selectCategory(name);
    // kategória váltáskor lépjünk vissza listanézetre
    clear();
  };

  const handleSaveCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addCategory(trimmed);
    closeModal();
  };

  const handleDeleteCategory = (name: string) => {
    deleteCategory(name); // useCategories-ből
    clearCategoryFromRecipes(name); // useRecipes-ből
  };

  // --- Recept-kezelés ---

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
    clearFilters();
  };

  // --- Render ---

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
                <div className="recipe-list-header">
                  <h1>Receptlista</h1>
                  <p className="recipe-list-header-subtitle">
                    {filteredRecipes.length === 0
                      ? "Még nincs recept – kattints a jobb alsó + gombra, hogy felvegyél egyet."
                      : `${filteredRecipes.length} recept a gyűjteményedben.`}
                  </p>
                  <div className="recipe-list-header-divider" />
                </div>

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
