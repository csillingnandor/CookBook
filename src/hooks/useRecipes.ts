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

function getRandomFallbackImage(): string {
  const idx = Math.floor(Math.random() * FALLBACK_IMAGES.length);
  return FALLBACK_IMAGES[idx];
}

export function useRecipes() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

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

  const saveRecipe = (
    data: Omit<Recipe, "id">,
    idToUpdate?: number | null
  ) => {
    if (idToUpdate != null) {
      // UPDATE
      setAllRecipes((prev) =>
        prev.map((r) => {
          if (r.id !== idToUpdate) return r;

          const finalImage = data.image ?? r.image ?? getRandomFallbackImage();

          return {
            ...r,
            ...data,
            id: idToUpdate,
            image: finalImage,
          };
        })
      );
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
  };

  const clearCategoryFromRecipes = (categoryName: string) => {
    setAllRecipes((prev) =>
      prev.map((r) =>
        r.category === categoryName ? { ...r, category: "" } : r
      )
    );
  };

  return {
    allRecipes,
    saveRecipe,
    deleteRecipe,
    clearCategoryFromRecipes, // ⬅ új
  };
}
