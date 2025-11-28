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

  // ÚJ:
  onEdit?: () => void;
  onDelete?: () => void;
}

export const RecipeCard = ({
  recipe,
  onClick,
  isSelected,
  shoppingItems,
  onToggleIngredient,
  onEdit,
  onDelete,
}: RecipeCardProps) => {
  const handleEditClick = (e: MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

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

      <div
        className="recipe-card__actions"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="recipe-card__icon-button recipe-card__icon-button--edit"
          onClick={handleEditClick as any}
        >
          ✎
        </button>
        <button
          type="button"
          className="recipe-card__icon-button recipe-card__icon-button--delete"
          onClick={handleDeleteClick as any}
        >
          🗑
        </button>
      </div>
    </div>
  );
};
