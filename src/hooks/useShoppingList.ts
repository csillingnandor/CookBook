// src/hooks/useShoppingList.ts
import { useState } from "preact/hooks";
import { Ingredient } from "../types/Ingredient";
import { toggleIngredient } from "../utils/shoppingListUtils";

export function useShoppingList() {
  const [shoppingItems, setShoppingItems] = useState<Ingredient[]>([]);

  const toggleIngredientInShoppingList = (ingredient: Ingredient) => {
    setShoppingItems((prev) => toggleIngredient(prev, ingredient));
  };

  return { shoppingItems, toggleIngredientInShoppingList };
}
