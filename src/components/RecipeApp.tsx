import { useState, useEffect } from "preact/hooks";
import { Recipe } from "../types/Recipe";
import { Ingredient } from "../types/Ingredient";
import { RecipeList } from "./RecipeList";
import { RecipeDetails } from "./RecipeDetails";
import { RecipeForm } from "./RecipeForm";
import "./RecipeList.css";


import img1 from "../assets/recipe_pictures/recipe_1.jpg";
import img2 from "../assets/recipe_pictures/recipe_2.jpg";
import img3 from "../assets/recipe_pictures/recipe_3.jpg";

const FALLBACK_IMAGES = [img1, img2, img3];

function getRandomFallbackImage(): string {
    const idx = Math.floor(Math.random() * FALLBACK_IMAGES.length);
    return FALLBACK_IMAGES[idx];
}


const RECIPES_STORAGE_KEY = "receptkonyv_recipes";
const SELECTED_ID_KEY = "selectedRecipeId";

export const RecipeApp = () => {
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [selected, setSelected] = useState<Recipe | null>(null);
    const [shoppingItems, setShoppingItems] = useState<Ingredient[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

    // receptek betöltése
    useEffect(() => {
        const stored = localStorage.getItem(RECIPES_STORAGE_KEY);

        if (stored) {
            setAllRecipes(JSON.parse(stored));
        } else {
            setAllRecipes([]); // üres lista induláskor
        }
    }, []);


    // receptek mentése
    useEffect(() => {
        localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(allRecipes));
    }, [allRecipes]);

    // kiválasztott recept visszatöltése
    useEffect(() => {
        const storedId = localStorage.getItem(SELECTED_ID_KEY);
        if (!storedId) return;

        const id = Number(storedId);
        if (Number.isNaN(id)) return;

        const found = allRecipes.find((r) => r.id === id);
        if (found) setSelected(found);
    }, [allRecipes]);

    // kiválasztott mentése
    useEffect(() => {
        if (selected) {
            localStorage.setItem(SELECTED_ID_KEY, String(selected.id));
        } else {
            localStorage.removeItem(SELECTED_ID_KEY);
        }
    }, [selected]);

    // detailre váltáskor scroll a tetejére
    useEffect(() => {
        if (selected) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [selected]);

    // body scroll tiltása formnál
    useEffect(() => {
        if (isFormOpen) {
            const original = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = original;
            };
        }
    }, [isFormOpen]);

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

    // ÚJ: form nyitása / zárása
    const openNewForm = () => {
        setEditingRecipe(null);
        setIsFormOpen(true);
    };

    const openEditForm = (recipe: Recipe) => {
        setEditingRecipe(recipe);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingRecipe(null);
    };

    // ÚJ: mentés – create vagy update
    const handleSaveRecipe = (
        data: Omit<Recipe, "id">,
        idToUpdate?: number | null
    ) => {
        if (idToUpdate != null) {
            // UPDATE
            setAllRecipes((prev) =>
                prev.map((r) => {
                    if (r.id !== idToUpdate) return r;

                    const finalImage =
                        data.image ?? r.image ?? getRandomFallbackImage();

                    return {
                        ...r,
                        ...data,
                        id: idToUpdate,
                        image: finalImage,
                    };
                })
            );

            setSelected((prev) => {
                if (!prev || prev.id !== idToUpdate) return prev;

                const finalImage =
                    data.image ?? prev.image ?? getRandomFallbackImage();

                return {
                    ...prev,
                    ...data,
                    id: idToUpdate,
                    image: finalImage,
                };
            });
        } else {
            // CREATE
            setAllRecipes((prev) => {
                const maxId = prev.reduce(
                    (max, r) => (r.id > max ? r.id : max),
                    0
                );

                const finalImage = data.image ?? getRandomFallbackImage();

                const newRecipe: Recipe = {
                    ...data,
                    id: maxId + 1,
                    image: finalImage,
                };

                return [...prev, newRecipe];
            });
        }

        setIsFormOpen(false);
        setEditingRecipe(null);
    };


    // ÚJ: törlés
    const handleDeleteRecipe = (id: number) => {
        setAllRecipes((prev) => prev.filter((r) => r.id !== id));
        if (selected?.id === id) {
            setSelected(null);
        }
    };

    return (
        <div className="recipe-app-root">
            <div
                className={
                    isFormOpen
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
                            onEdit={openEditForm}
                            onDelete={handleDeleteRecipe}
                        />
                    )}

                    {selected && (
                        <RecipeDetails
                            recipe={selected}
                            shoppingItems={shoppingItems}
                            onToggleIngredient={toggleIngredientInShoppingList}
                            onEditRecipe={openEditForm}
                            onDeleteRecipe={handleDeleteRecipe}
                        />
                    )}
                </div>
            </div>

            {/* + gomb csak ha nincs detail és nincs form */}
            {!selected && !isFormOpen && (
                <button
                    type="button"
                    className="add-recipe-button"
                    onClick={openNewForm}
                >
                    +
                </button>
            )}

            {isFormOpen && (
                <div className="modal-overlay">
                    <div className="modal-backdrop" onClick={closeForm} />
                    <div className="modal-content">
                        <RecipeForm
                            initialRecipe={editingRecipe}
                            onSave={handleSaveRecipe}
                            onClose={closeForm}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
