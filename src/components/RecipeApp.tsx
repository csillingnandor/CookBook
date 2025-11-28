import { useState, useEffect } from "preact/hooks";
import { Ingredient } from "../types/Ingredient";
import { RecipeList } from "./RecipeList";
import { RecipeDetails } from "./RecipeDetails";
import { RecipeForm } from "./RecipeForm";
import { useRecipes } from "../hooks/useRecipes";
import { Recipe } from "../types/Recipe";
import { CategoryForm } from "./CategoryForm";
import { AddRecipeButton } from "./AddRecipeButton";
import { ModalOverlay, ModalMode } from "./ModalOverlay";


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

    const [shoppingItems, setShoppingItems] = useState<Ingredient[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [modalMode, setModalMode] = useState<ModalMode>("none");



    // kategóriák betöltése
    useEffect(() => {
        const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
        if (stored) {
            try {
                setCategories(JSON.parse(stored));
                return;
            } catch {
                // rossz JSON esetén üresre áll
            }
        }
        setCategories([]);
    }, []);

    // kategóriák mentése
    useEffect(() => {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    }, [categories]);


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

    const openNewForm = () => {
        setEditingRecipe(null);
        setIsFormOpen(true);
    };

    const openEditForm = (recipe: Recipe) => {
        setEditingRecipe(recipe);   // melyik receptet szerkesztjük
        setModalMode("recipe");     // közvetlenül a recept formot nyitjuk
    };


    const closeForm = () => {
        setIsFormOpen(false);
        setEditingRecipe(null);
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
        setCategories((prev) =>
            prev.includes(name) ? prev : [...prev, name]
        );
        setModalMode("none");
    };

    const handleSaveRecipe = (
        data: Omit<Recipe, "id">,
        idToUpdate?: number | null
    ) => {
        if (data.category) {
            setCategories((prev) =>
                prev.includes(data.category!) ? prev : [...prev, data.category!]
            );
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
                    {!selected && <h1>Receptlista</h1>}

                    {selected && (
                        <button className="back-button" onClick={clearSelected}>
                            ← Vissza
                        </button>
                    )}

                    {!selected && (
                        <RecipeList
                            recipes={allRecipes}
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
