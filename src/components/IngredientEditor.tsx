// src/components/IngredientEditor.tsx
import { Ingredient } from "../types/Ingredient";
import "./RecipeForm.css";

interface IngredientEditorProps {
  ingredients: Ingredient[];

  nameValue: string;
  amountValue: string;
  unitValue: string;

  onChangeName: (value: string) => void;
  onChangeAmount: (value: string) => void;
  onChangeUnit: (value: string) => void;

  onAdd: () => void;
  onRemove: (index: number) => void;
}

export const IngredientEditor = ({
  ingredients,
  nameValue,
  amountValue,
  unitValue,
  onChangeName,
  onChangeAmount,
  onChangeUnit,
  onAdd,
  onRemove,
}: IngredientEditorProps) => {
  return (
    <div className="form-row">
      <label>Hozzávalók</label>

      <div className="ingredient-input-row">
        <input
          type="text"
          placeholder="Név (pl. Liszt)"
          value={nameValue}
          onInput={(e) =>
            onChangeName((e.currentTarget as HTMLInputElement).value)
          }
        />
        <input
          type="number"
          placeholder="Mennyiség (pl. 200)"
          value={amountValue}
          onInput={(e) =>
            onChangeAmount((e.currentTarget as HTMLInputElement).value)
          }
        />
        <input
          type="text"
          placeholder="Mértékegység (pl. g)"
          value={unitValue}
          onInput={(e) =>
            onChangeUnit((e.currentTarget as HTMLInputElement).value)
          }
        />

        <button
          type="button"
          className="ingredient-add-button"
          onClick={onAdd}
        >
          +
        </button>
      </div>

      {ingredients.length > 0 && (
        <ul className="ingredient-list-preview">
          {ingredients.map((ing, idx) => (
            <li key={idx} className="ingredient-list-item">
              <span>
                {ing.name} — {ing.amount} {ing.unit}
              </span>
              <button
                type="button"
                className="ingredient-remove-button"
                onClick={() => onRemove(idx)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
