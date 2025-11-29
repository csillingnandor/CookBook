import { useState, useEffect } from "preact/hooks";
import { Recipe } from "../types/Recipe";

import img1 from "../assets/recipe_pictures/recipe_1.jpg";
import img2 from "../assets/recipe_pictures/recipe_2.jpg";
import img3 from "../assets/recipe_pictures/recipe_3.jpg";
import img4 from "../assets/recipe_pictures/recipe_4.jpg";
import img5 from "../assets/recipe_pictures/recipe_5.jpg";
import img6 from "../assets/recipe_pictures/recipe_6.jpg";
import img7 from "../assets/recipe_pictures/recipe_7.jpg";

const FALLBACK_IMAGES = [img1, img2, img3, img4, img5, img6, img7];

const RECIPES_STORAGE_KEY = "receptkonyv_recipes";
const SELECTED_ID_KEY = "selectedRecipeId";


function getRandomFallbackImage(): string {
    const idx = Math.floor(Math.random() * FALLBACK_IMAGES.length);
    return FALLBACK_IMAGES[idx];
}

export function useRecipes() {
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [selected, setSelected] = useState<Recipe | null>(null);

    // receptek betöltése
    useEffect(() => {
        const stored = localStorage.getItem(RECIPES_STORAGE_KEY);
        if (stored) {
            try {
                setAllRecipes(JSON.parse(stored));
                return;
            } catch {
                // ha rossz, induljon üresen
            }
        }
        setAllRecipes([]);
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

    const selectRecipe = (recipe: Recipe) => setSelected(recipe);
    const clearSelected = () => setSelected(null);

    const saveRecipe = (data: Omit<Recipe, "id">, idToUpdate?: number | null) => {
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
    };

    const deleteRecipe = (id: number) => {
        setAllRecipes((prev) => prev.filter((r) => r.id !== id));
        setSelected((prev) => (prev?.id === id ? null : prev));
    };

    return {
        allRecipes,
        selected,
        selectRecipe,
        clearSelected,
        saveRecipe,
        deleteRecipe,
    };
}
