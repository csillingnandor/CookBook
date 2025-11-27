import { Ingredient } from "../types/Ingredient";
import "./ShoppingList.css";

interface ShoppingListProps {
  items: Ingredient[];
}

export const ShoppingList = ({ items }: ShoppingListProps) => {
  if (!items.length) return null;

  return (
    <div className="shopping-list">
      <h2>Bevásárlólista</h2>
      <ul>
        {items.map((ing, idx) => (
          <li key={idx}>
            {ing.name} — {ing.amount} {ing.unit}
          </li>
        ))}
      </ul>
    </div>
  );
};
