import { Ingredient } from "../types/Ingredient";
import "./IngredientsBox.css";

interface IngredientsBoxProps {
  ingredients: Ingredient[];
  visible: boolean;
  shoppingItems: Ingredient[];
  onToggleIngredient: (ingredient: Ingredient) => void;
}

export const IngredientsBox = ({
  ingredients,
  visible,
  shoppingItems,
  onToggleIngredient,
}: IngredientsBoxProps) => {
  const isInShoppingList = (ingredient: Ingredient) =>
    shoppingItems.some(
      (ing) =>
        ing.name === ingredient.name &&
        ing.unit === ingredient.unit &&
        ing.amount === ingredient.amount
    );

  return (
    <div
      className={`ingredients-box ${visible ? "show" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <h4>Hozzávalók</h4>
      <ul>
        {ingredients.map((ing, idx) => (
          <li key={idx}>
            <label className="ingredient-row">
              <input
                type="checkbox"
                checked={isInShoppingList(ing)}
                onChange={() => onToggleIngredient(ing)}
              />
              <span>
                {ing.name} — {ing.amount} {ing.unit}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
