// src/components/RecipeApp.tsx

import { useState, useEffect } from "preact/hooks";
import { Recipe } from "../types/Recipe";
import { Ingredient } from "../types/Ingredient";
import { RecipeList } from "./RecipeList";
import { RecipeDetails } from "./RecipeDetails";
import { RecipeForm } from "./RecipeForm";
import "./RecipeList.css";

interface RecipeAppProps {
    recipes: Recipe[];
}

const RECIPES_STORAGE_KEY = "receptkonyv_recipes";
const SELECTED_ID_KEY = "selectedRecipeId";

export const RecipeApp = ({ recipes }: RecipeAppProps) => {
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [selected, setSelected] = useState<Recipe | null>(null);
    const [shoppingItems, setShoppingItems] = useState<Ingredient[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    // 1) Receptek betöltése localStorage-ből vagy propból
    useEffect(() => {
        const stored = localStorage.getItem(RECIPES_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Recipe[];
                setAllRecipes(parsed);
                return;
            } catch (err) {
                console.error("Hibás recipes JSON a localStorage-ben:", err);
            }
        }

        setAllRecipes(recipes);
    }, [recipes]);

    // 2) Receptek mentése, ha változnak
    useEffect(() => {
        if (!allRecipes) return;
        localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(allRecipes));
    }, [allRecipes]);

    // 3) Kiválasztott recept visszatöltése ID alapján
    useEffect(() => {
        const storedId = localStorage.getItem(SELECTED_ID_KEY);
        if (!storedId) return;

        const id = Number(storedId);
        if (Number.isNaN(id)) return;

        const found = allRecipes.find((r) => r.id === id);
        if (found) {
            setSelected(found);
        }
    }, [allRecipes]);

    // 4) Kiválasztott recept ID mentése
    useEffect(() => {
        if (selected) {
            localStorage.setItem(SELECTED_ID_KEY, String(selected.id));
        } else {
            localStorage.removeItem(SELECTED_ID_KEY);
        }
    }, [selected]);

    const handleSelectRecipe = (recipe: Recipe) => {
        setSelected(recipe);
    };

    const handleBack = () => {
        setSelected(null);
    };

    const toggleIngredientInShoppingList = (ingredient: Ingredient) => {
        setShoppingItems((prev) => {
            const exists = prev.some(
                (ing) =>
                    ing.name === ingredient.name &&
                    ing.unit === ingredient.unit &&
                    ing.amount === ingredient.amount
            );

            if (exists) {
                return prev.filter(
                    (ing) =>
                        !(
                            ing.name === ingredient.name &&
                            ing.unit === ingredient.unit &&
                            ing.amount === ingredient.amount
                        )
                );
            } else {
                return [...prev, ingredient];
            }
        });
    };

    const openForm = () => setIsAdding(true);
    const closeForm = () => setIsAdding(false);

    // 5) Új recept hozzáadása
    const handleSaveRecipe = (data: Omit<Recipe, "id">) => {
        setAllRecipes((prev) => {
            const maxId = prev.reduce(
                (max, r) => (r.id > max ? r.id : max),
                0
            );
            const newRecipe: Recipe = {
                ...data,
                id: maxId + 1,
            };
            return [...prev, newRecipe];
        });

        setIsAdding(false);
    };

    return (
        <div className="recipe-app-root">
            {/* EZ a rész blur-ölődik, ha isAdding === true */}
            <div
                className={
                    isAdding
                        ? "recipe-app-blur-wrapper is-blurred"
                        : "recipe-app-blur-wrapper"
                }
            >
                <div className="recipe-list-container">
                    {!selected && <h1>Receptlista</h1>}

                    {selected && (
                        <button className="back-button" onClick={handleBack}>
                            ← Vissza
                        </button>
                    )}

                    {!selected && (
                        <RecipeList
                            recipes={allRecipes}
                            shoppingItems={shoppingItems}
                            onSelect={handleSelectRecipe}
                            onToggleIngredient={toggleIngredientInShoppingList}
                        />
                    )}

                    {selected && (
                        <RecipeDetails
                            recipe={selected}
                            shoppingItems={shoppingItems}
                            onToggleIngredient={toggleIngredientInShoppingList}
                        />
                    )}
                </div>
            </div>

            {/* + gomb már NEM a blur-wrapperben van, és modal közben el is tűnik */}
            {!selected && !isAdding && (
                <button
                    type="button"
                    className="add-recipe-button"
                    onClick={openForm}
                >
                    +
                </button>
            )}

            {/* Modal */}
            {isAdding && (
                <div className="modal-overlay">
                    <div className="modal-backdrop" onClick={closeForm} />
                    <div className="modal-content">
                        <RecipeForm onSave={handleSaveRecipe} onClose={closeForm} />
                    </div>
                </div>
            )}
        </div>
    );

};
