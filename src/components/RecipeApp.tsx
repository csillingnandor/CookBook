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


const CATEGORIES_STORAGE_KEY = "receptkonyv_categories";


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
                <div className="recipe-list-container">
                    <div className="recipe-main-layout">
                        {/* BAL OSZLOP – kategóriák */}
                        <CategoryList
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={handleSelectCategory}
                        />

                        {/* JOBB OSZLOP – lista / detail */}
                        <div className="recipe-main-content">
                            {!selected && <h1>Receptlista</h1>}

                            {selected && (
                                <button className="back-button" onClick={clearSelected}>
                                    ← Vissza
                                </button>
                            )}

                            {!selected && (
                                <RecipeList
                                    recipes={filteredRecipes}  // ⬅️ SZŰRT LISTA
                                    shoppingItems={shoppingItems}
                                    onSelect={selectRecipe}
                                    onToggleIngredient={toggleIngredientInShoppingList}
                                    onEdit={openEditForm}
                                    onDelete={deleteRecipe}
                                />
                            )}

                            {selected && (
                                <RecipeDetails
                                    recipe={selected}
                                    shoppingItems={shoppingItems}
                                    onToggleIngredient={toggleIngredientInShoppingList}
                                    onEditRecipe={openEditForm}
                                    onDeleteRecipe={deleteRecipe}
                                />
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Lebegő + gomb */}
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
