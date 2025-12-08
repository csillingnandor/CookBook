import { Recipe } from "../types/Recipe";
import { Ingredient } from "../types/Ingredient";
import { RecipeCard } from "./RecipeCard";
import "./RecipeList.css";

interface RecipeListProps {
  recipes: Recipe[];
  shoppingItems: Ingredient[];
  onSelect: (recipe: Recipe) => void;
  onToggleIngredient: (ingredient: Ingredient) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: number) => void;
}

/**
 * @remarks Recept lista komponens, amely megjeleníti a recepteket egy rácsban, és kezeli a kiválasztást, szerkesztést és törlést.
 * @param recipes a megjelenítendő receptek listája
 * @param shoppingItems a bevásárlólista elemei
 * @param onSelect eseménykezelő egy recept kiválasztására
 * @param onToggleIngredient eseménykezelő egy hozzávaló hozzáadására vagy eltávolítására a bevásárlólistáról
 * @param onEdit eseménykezelő egy recept szerkesztésére
 * @param onDelete eseménykezelő egy recept törlésére
 * @returns 
 */

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
