import { useState, useEffect } from "preact/hooks";
import { Ingredient } from "../types/Ingredient";
import { RecipeList } from "./RecipeList";
import { RecipeDetails } from "./RecipeDetails";
import { useRecipes } from "../hooks/useRecipes";
import { Recipe } from "../types/Recipe";
import { AddRecipeButton } from "./AddRecipeButton";
import { ModalOverlay, ModalMode } from "./ModalOverlay";
import { CategoryList } from "./CategoryList";
import { useCategories } from "../hooks/useCategories";

import "./CategoryList.css";
import "./RecipeList.css";
import "./CategoryForm.css";
import "./RecipeApp.css"


export const RecipeApp = () => {
    const {
        allRecipes,
        selected,
        selectRecipe,
        clearSelected,
        saveRecipe,
        deleteRecipe,
    } = useRecipes();

    const {
        categories,
        selectedCategory,
        addCategory,
        selectCategory,
        ALL_CATEGORY_NAME,
    } = useCategories();


    const [shoppingItems, setShoppingItems] = useState<Ingredient[]>([]);
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [modalMode, setModalMode] = useState<ModalMode>("none");




    // body scroll tiltása formnál
    useEffect(() => {
        if (modalMode !== "none") {
            const original = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = original;
            };
        }
    }, [modalMode]);

    const handleSelectCategory = (name: string) => {
        selectCategory(name);
        clearSelected(); // detail nézetből vissza listára
    };


    const filteredRecipes =
        selectedCategory === ALL_CATEGORY_NAME
            ? allRecipes
            : allRecipes.filter((r) => r.category === selectedCategory);


    const toggleIngredientInShoppingList = (ingredient: Ingredient) => {
        setShoppingItems((prev) => {
            const exists = prev.some(
                (ing) =>
                    ing.name === ingredient.name &&
                    ing.unit === ingredient.unit &&
                    ing.amount === ingredient.amount
            );
            return exists
                ? prev.filter(
                    (ing) =>
                        !(
                            ing.name === ingredient.name &&
                            ing.unit === ingredient.unit &&
                            ing.amount === ingredient.amount
                        )
                )
                : [...prev, ingredient];
        });
    };


    const openEditForm = (recipe: Recipe) => {
        setEditingRecipe(recipe);   // melyik receptet szerkesztjük
        setModalMode("recipe");     // közvetlenül a recept formot nyitjuk
    };


    const openChooserModal = () => {
        setModalMode("chooser");
    };

    const openRecipeModal = () => {
        setModalMode("recipe");
    };

    const openCategoryModal = () => {
        setModalMode("category");
    };

    const closeModal = () => {
        setModalMode("none");
        setEditingRecipe(null);
    };

    const handleSaveCategory = (name: string) => {
        addCategory(name);
        setModalMode("none");
    };



    const handleSaveRecipe = (
        data: Omit<Recipe, "id">,
        idToUpdate?: number | null
    ) => {
        if (data.category) {
            addCategory(data.category);
        }

        saveRecipe(data, idToUpdate);
        closeModal();
    };




    return (
        <div className="recipe-app-root">
            <div
                className={
                    modalMode !== "none"
                        ? "recipe-app-blur-wrapper is-blurred"
                        : "recipe-app-blur-wrapper"
                }
            >
                {/* LISTA NÉZET */}
                {!selected && (
                    <div className="recipe-list-container">
                        <div className="recipe-main-layout">
                            {/* BAL OLDAL – kategóriák */}
                            <CategoryList
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onSelectCategory={handleSelectCategory}
                            />

                            {/* JOBB OLDAL – recept kártyák */}
                            <div className="recipe-main-content">
                                <h1>Receptlista</h1>

                                <RecipeList
                                    recipes={filteredRecipes}
                                    shoppingItems={shoppingItems}
                                    onSelect={selectRecipe}
                                    onToggleIngredient={toggleIngredientInShoppingList}
                                    onEdit={openEditForm}
                                    onDelete={deleteRecipe}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* DETAIL NÉZET – TELJESEN KÜLÖN LAYOUT */}
                {selected && (
                    <div className="recipe-detail-container">
                        <button className="back-button" onClick={clearSelected}>
                            ← Vissza
                        </button>

                        {/* A RecipeDetails-ben legyen a .detail-layout grid */}
                        <RecipeDetails
                            recipe={selected}
                            shoppingItems={shoppingItems}
                            onToggleIngredient={toggleIngredientInShoppingList}
                            onEditRecipe={openEditForm}
                            onDeleteRecipe={deleteRecipe}
                        />
                    </div>
                )}
            </div>

            {/* Lebegő + gomb csak listanézetben, modal nélkül */}
            {!selected && modalMode === "none" && (
                <AddRecipeButton onClick={openChooserModal} />
            )}

            {/* Modal overlay */}
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
        </div>
    );


};
