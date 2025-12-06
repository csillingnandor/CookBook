import { useState } from "preact/hooks";
import "./RecipeForm.css";   // ⬅ régi stílus, ugyanaz mint a recept form
import "./CategoryForm.css";
import { FormError } from "./FormError";

interface CategoryFormProps {
  onSave: (name: string) => void;
  onClose: () => void;
}

export const CategoryForm = ({ onSave, onClose }: CategoryFormProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError("A kategórianév kötelező.");
      return;
    }

    setError(undefined);
    onSave(trimmed);
    setName("");
  };

  return (
    // ⬅ VISSZA A RÉGI OSZTÁLY: new-recipe-form
    <form className="new-recipe-form" onSubmit={handleSubmit as any}>
      <h2>Új kategória</h2>

      <div className="form-row">
        <label>
          Kategórianév
          <input
            type="text"
            value={name}
            onInput={(e) =>
              setName((e.target as HTMLInputElement).value)
            }
            placeholder="pl. Levesek, Főételek…"
          />
        </label>
        <FormError message={error} />
      </div>

      <div className="new-recipe-form-actions">
        <button type="button" onClick={onClose}>
          Mégse
        </button>
        <button type="submit">Kategória mentése</button>
      </div>
    </form>
  );
};
