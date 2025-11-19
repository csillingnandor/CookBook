import "./RecipeCard.css";
import { Recipe } from "../types/Recipe";
import { IngredientsBox } from "./IngredientsBox";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  isSelected: boolean;
}

export const RecipeCard = ({ recipe, onClick, isSelected }: RecipeCardProps) => {
  return (
    <div
      className={`recipe-card ${isSelected ? "selected-card" : ""}`}
      onClick={onClick}
    >
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />

      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>

      
      <IngredientsBox
        ingredients={recipe.ingredients}
        visible={isSelected}
      />
    </div>
  );
};
