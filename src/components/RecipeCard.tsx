import "./RecipeCard.css";
import { Recipe } from "../types/Recipe";
import { Ingredient } from "../types/Ingredient";
import { IngredientsBox } from "./IngredientsBox";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  isSelected: boolean;
  shoppingItems: Ingredient[];
  onToggleIngredient: (ingredient: Ingredient) => void;
}

export const RecipeCard = ({
  recipe,
  onClick,
  isSelected,
  shoppingItems,
  onToggleIngredient,
}: RecipeCardProps) => {
  return (
    <div className="recipe-card" onClick={onClick}>
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      )}

      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>

      <IngredientsBox
        ingredients={recipe.ingredients}
        visible={isSelected}
        shoppingItems={shoppingItems}
        onToggleIngredient={onToggleIngredient}
      />
    </div>
  );
};
