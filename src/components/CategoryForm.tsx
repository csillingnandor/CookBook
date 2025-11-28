import { useState } from "preact/hooks";
import "./RecipeForm.css"; // hogy ugyanolyan stílusú legyen
import "./CategoryForm.css"

interface CategoryFormProps {
  onSave: (name: string) => void;
  onClose: () => void;
}

export const CategoryForm = ({ onSave, onClose }: CategoryFormProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      alert("Adj meg egy kategóriannevet.");
      return;
    }
    onSave(trimmed);
    setName("");
  };

  return (
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
