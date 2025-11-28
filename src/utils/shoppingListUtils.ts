// src/utils/shoppingListUtils.ts
import { Ingredient } from "../types/Ingredient";

export function toggleIngredient(
  list: Ingredient[],
  ingredient: Ingredient
): Ingredient[] {
  const exists = list.some(
    (ing) =>
      ing.name === ingredient.name &&
      ing.unit === ingredient.unit &&
      ing.amount === ingredient.amount
  );

  if (exists) {
    return list.filter(
      (ing) =>
        !(
          ing.name === ingredient.name &&
          ing.unit === ingredient.unit &&
          ing.amount === ingredient.amount
        )
    );
  } else {
    return [...list, ingredient];
  }
}
