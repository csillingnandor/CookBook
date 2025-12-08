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
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

/**
 * @remarks Recept kártya komponens, amely megjeleníti a recept alapvető adatait, és lehetőséget biztosít a szerkesztésre, törlésre, valamint a hozzávalók kezelésére.
 * @param recipe a megjelenítendő recept objektum
 * @param isSelected ha true, a hozzávalók doboza látható
 * @param shoppingItems a bevásárlólista elemei
 * @param onClick a kártya kattintás eseménykezelője
 * @param onToggleIngredient eseménykezelő egy hozzávaló hozzáadására vagy eltávolítására a bevásárlólistáról
 * @param onEdit eseménykezelő a recept szerkesztésére
 * @param onDelete eseménykezelő a recept törlésére
 * @param className opcionális további CSS osztályok a kártya számára
 * @returns 
 */

export const RecipeCard = ({
  recipe,
  onClick,
  isSelected,
  shoppingItems,
  onToggleIngredient,
  onEdit,
  onDelete,
  className,
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
  <div
    className={`recipe-card ${className ?? ""}`}
    onClick={onClick}
  >
    <div className="recipe-card__content">
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      )}

      <h3>{recipe.title}</h3>

      <p className="recipe-description">
        {recipe.description?.trim()
          ? recipe.description
          : "Nincs leírás"}
      </p>

      {(recipe.time || recipe.difficulty || recipe.priceLevel) && (
        <div className="recipe-meta">
          {recipe.time && (
            <span className="recipe-meta-item">⏱ {recipe.time} perc</span>
          )}
          {recipe.difficulty && (
            <span className="recipe-meta-item">📌 {recipe.difficulty}</span>
          )}
          {recipe.priceLevel && (
            <span className="recipe-meta-item">💰 {recipe.priceLevel}</span>
          )}
        </div>
      )}

      <IngredientsBox
        ingredients={recipe.ingredients}
        visible={isSelected}
        shoppingItems={shoppingItems}
        onToggleIngredient={onToggleIngredient}
      />
    </div>

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
