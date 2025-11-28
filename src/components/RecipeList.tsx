// src/components/RecipeList.tsx

import { Recipe } from "../types/Recipe";
import { Ingredient } from "../types/Ingredient";
import { RecipeCard } from "./RecipeCard";
import "./RecipeList.css";

interface RecipeListProps {
  recipes: Recipe[];
  shoppingItems: Ingredient[];
  onSelect: (recipe: Recipe) => void;
  onToggleIngredient: (ingredient: Ingredient) => void;
}

export const RecipeList = ({
  recipes,
  shoppingItems,
  onSelect,
  onToggleIngredient,
}: RecipeListProps) => {
  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => onSelect(recipe)}
          // A lista nézetben nem nyitjuk ki az összetevős dobozt,
          // ezért mindig false-t adunk át.
          isSelected={false}
          shoppingItems={shoppingItems}
          onToggleIngredient={onToggleIngredient}
        />
      ))}
    </div>
  );
};
