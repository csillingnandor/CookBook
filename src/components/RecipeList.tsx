import { Recipe } from "../types/Recipe";
import { Ingredient } from "../types/Ingredient";
import { RecipeCard } from "./RecipeCard";
import "./RecipeList.css";

interface RecipeListProps {
  recipes: Recipe[];
  shoppingItems: Ingredient[];
  onSelect: (recipe: Recipe) => void;
  onToggleIngredient: (ingredient: Ingredient) => void;

  // ÚJ:
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: number) => void;
}

export const RecipeList = ({
  recipes,
  shoppingItems,
  onSelect,
  onToggleIngredient,
  onEdit,
  onDelete,
}: RecipeListProps) => {
  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => onSelect(recipe)}
          isSelected={false}
          shoppingItems={shoppingItems}
          onToggleIngredient={onToggleIngredient}
          onEdit={() => onEdit(recipe)}
          onDelete={() => onDelete(recipe.id)}
        />
      ))}
    </div>
  );
};
