interface IngredientFilterFieldProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}

export const IngredientFilterField = ({
  value,
  onChange,
  suggestions,
}: IngredientFilterFieldProps) => {
  const ingredientTokens = value
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const search = ingredientTokens[ingredientTokens.length - 1] ?? "";
  const filteredSuggestions = suggestions
    .filter((name) =>
      !search
        ? true
        : name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (name) =>
        !ingredientTokens.some(
          (t) => t && name.toLowerCase() === t.toLowerCase()
        )
    )
    .slice(0, 6);

  const handleAddIngredientToken = (name: string) => {
    const tokens = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (
      tokens.some((t) => t.toLowerCase() === name.toLowerCase())
    ) {
      return;
    }

    const next = [...tokens, name].join(", ");
    onChange(next);
  };

  return (
    <div className="filter-field">
      <label className="filter-label">
        Alapanyagok (vesszővel elválasztva)
      </label>
      <input
        type="text"
        placeholder="pl. csirke, tészta…"
        value={value}
        onInput={(e) =>
          onChange((e.target as HTMLInputElement).value)
        }
      />

      {filteredSuggestions.length > 0 && (
        <div className="ingredient-suggestions">
          {filteredSuggestions.map((name) => (
            <button
              key={name}
              type="button"
              className="ingredient-chip"
              onClick={() => handleAddIngredientToken(name)}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
