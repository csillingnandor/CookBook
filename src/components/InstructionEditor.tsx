// src/components/InstructionEditor.tsx
import "./RecipeForm.css";

interface InstructionEditorProps {
  instructions: string[];
  textValue: string;

  onChangeText: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export const InstructionEditor = ({
  instructions,
  textValue,
  onChangeText,
  onAdd,
  onRemove,
}: InstructionEditorProps) => {
  return (
    <div className="form-row">
      <label>Elkészítés</label>

      <div className="instruction-input-row">
        <input
          type="text"
          placeholder="Új lépés…"
          value={textValue}
          onInput={(e) =>
            onChangeText((e.currentTarget as HTMLInputElement).value)
          }
        />

        <button
          type="button"
          className="instruction-add-button"
          onClick={onAdd}
        >
          +
        </button>
      </div>

      {instructions.length > 0 && (
        <ol className="instruction-list-preview">
          {instructions.map((step, idx) => (
            <li key={idx} className="instruction-list-item">
              <span className="instruction-list-text">{step}</span>
              <button
                type="button"
                className="instruction-remove-button"
                onClick={() => onRemove(idx)}
              >
                ✕
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
