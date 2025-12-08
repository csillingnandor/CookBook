// src/hooks/useShoppingList.ts
import { useState } from "preact/hooks";
import { Ingredient } from "../types/Ingredient";
import { toggleIngredient } from "../utils/shoppingListUtils";

/**
 * @remarks Testreszabott hook a bevásárlólista kezeléséhez, beleértve az alapanyagok hozzáadását és eltávolítását.
 * @returns 
 */

export function useShoppingList() {
  const [shoppingItems, setShoppingItems] = useState<Ingredient[]>([]);

  const toggleIngredientInShoppingList = (ingredient: Ingredient) => {
    setShoppingItems((prev) => toggleIngredient(prev, ingredient));
  };

  return { shoppingItems, toggleIngredientInShoppingList };
}
