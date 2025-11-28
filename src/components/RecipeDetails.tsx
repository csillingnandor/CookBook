// src/components/RecipeDetails.tsx

import { Recipe } from "../types/Recipe";
import { Ingredient } from "../types/Ingredient";
import { RecipeCard } from "./RecipeCard";
import { InstructionList } from "./InstructionList";
import { ShoppingList } from "./ShoppingList";

interface RecipeDetailsProps {
  recipe: Recipe | null;
  shoppingItems: Ingredient[];
  onToggleIngredient: (ingredient: Ingredient) => void;
}

export const RecipeDetails = ({
  recipe,
  shoppingItems,
  onToggleIngredient,
}: RecipeDetailsProps) => {
  if (!recipe) {
    return null;
  }

  return (
    <div className="detail-layout">
      <div className="detail-col detail-col--card">
        <RecipeCard
          recipe={recipe}
          onClick={() => {}}
          isSelected={true}
          shoppingItems={shoppingItems}
          onToggleIngredient={onToggleIngredient}
        />
      </div>

      <div className="detail-col detail-col--instructions">
        <InstructionList recipe={recipe} />
      </div>

      <div className="detail-col detail-col--shopping">
        <ShoppingList items={shoppingItems} />
      </div>
    </div>
  );
};
