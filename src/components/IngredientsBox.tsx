import { Ingredient } from "../types/Ingredient";
import "./IngredientsBox.css";

interface IngredientsBoxProps {
  ingredients: Ingredient[];
  visible: boolean;
}

export const IngredientsBox = ({ ingredients, visible }: IngredientsBoxProps) => {
  return (
    <div className={`ingredients-box ${visible ? "show" : ""}`}>
      <h4>Hozzávalók</h4>
      <ul>
        {ingredients.map((ing, idx) => (
          <li key={idx}>
            {ing.name} — {ing.amount} {ing.unit}
          </li>
        ))}
      </ul>
    </div>
  );
};
