import { Recipe } from "../types/Recipe";
import { Ingredient } from "../types/Ingredient";
import { RecipeCard } from "./RecipeCard";
import { InstructionList } from "./InstructionList";
import { ShoppingList } from "./ShoppingList";

import "./RecipeDetails.css"

interface RecipeDetailsProps {
  recipe: Recipe | null;
  shoppingItems: Ingredient[];
  onToggleIngredient: (ingredient: Ingredient) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: number) => void;
}

/**
 * @remarks Recept részletek komponens, amely megjeleníti a recept kártyáját, elkészítési lépéseit és a bevásárlólistát.
 * @param recipe a megjelenítendő recept
 * @param shoppingItems a bevásárlólista elemei
 * @param onToggleIngredient eseménykezelő egy hozzávaló hozzáadására vagy eltávolítására a bevásárlólistáról
 * @param onEditRecipe eseménykezelő a recept szerkesztésére
 * @param onDeleteRecipe eseménykezelő a recept törlésére 
 * @returns 
 */

export const RecipeDetails = ({
  recipe,
  shoppingItems,
  onToggleIngredient,
  onEditRecipe,
  onDeleteRecipe,
}: RecipeDetailsProps) => {
  if (!recipe) return null;

  return (
    <div className="detail-layout">
      <div className="detail-col detail-col--card">
        <RecipeCard
          recipe={recipe}
          className="recipe-card--detail"
          onClick={() => { }}
          isSelected={true}
          shoppingItems={shoppingItems}
          onToggleIngredient={onToggleIngredient}
          onEdit={() => onEditRecipe(recipe)}
          onDelete={() => onDeleteRecipe(recipe.id)}
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
