// src/components/RecipeForm.tsx

import { useState } from "preact/hooks";
import { Recipe } from "../types/Recipe";
import { Ingredient } from "../types/Ingredient";
import "./RecipeForm.css";

interface RecipeFormProps {
  onSave: (data: Omit<Recipe, "id">) => void;
  onClose: () => void;
}

export const RecipeForm = ({ onSave, onClose }: RecipeFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const [ingredientName, setIngredientName] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState("");

  const resetIngredientFields = () => {
    setIngredientName("");
    setIngredientAmount("");
    setIngredientUnit("");
  };

  const handleAddIngredient = () => {
    const name = ingredientName.trim();
    const amountStr = ingredientAmount.trim();
    const unit = ingredientUnit.trim();

    if (!name) {
      alert("A hozzávaló neve kötelező.");
      return;
    }

    if (!amountStr) {
      alert("A mennyiség megadása kötelező.");
      return;
    }

    const amount = Number(amountStr);

    if (Number.isNaN(amount)) {
      alert("A mennyiségnek számnak kell lennie (pl. 200).");
      return;
    }

    const newIngredient: Ingredient = {
      name,
      amount,
      unit,
    };

    setIngredients((prev) => [...prev, newIngredient]);
    resetIngredientFields();
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("A recept címe kötelező.");
      return;
    }

    const recipeData: Omit<Recipe, "id"> = {
      title: title.trim(),
      description: description.trim(),
      ingredients,
      instructions: [],
    };

    onSave(recipeData);

    setTitle("");
    setDescription("");
    setIngredients([]);
    resetIngredientFields();
  };

  return (
    <form className="new-recipe-form" onSubmit={handleSubmit as any}>
      <h2>Új recept</h2>

      <div className="form-row">
        <label>
          Cím
          <input
            type="text"
            value={title}
            onInput={(e) =>
              setTitle((e.target as HTMLInputElement).value)
            }
            placeholder="pl. Rakott krumpli"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Rövid leírás
          <textarea
            value={description}
            onInput={(e) =>
              setDescription((e.target as HTMLTextAreaElement).value)
            }
            placeholder="Röviden a receptről…"
          />
        </label>
      </div>

      {/* HOZZÁVALÓK */}
      <div className="form-row">
        <label>Hozzávalók</label>

        <div className="ingredient-input-row">
          <input
            type="text"
            placeholder="Név (pl. Liszt)"
            value={ingredientName}
            onInput={(e) =>
              setIngredientName((e.target as HTMLInputElement).value)
            }
          />
          <input
            type="number"
            placeholder="Mennyiség (pl. 200)"
            value={ingredientAmount}
            onInput={(e) =>
              setIngredientAmount((e.target as HTMLInputElement).value)
            }
          />
          <input
            type="text"
            placeholder="Mértékegység (pl. g)"
            value={ingredientUnit}
            onInput={(e) =>
              setIngredientUnit((e.target as HTMLInputElement).value)
            }
          />

          <button
            type="button"
            className="ingredient-add-button"
            onClick={handleAddIngredient}
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
                  onClick={() => handleRemoveIngredient(idx)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="new-recipe-form-actions">
        <button type="button" onClick={onClose}>
          Mégse
        </button>
        <button type="submit">Recept hozzáadása</button>
      </div>
    </form>
  );
};
