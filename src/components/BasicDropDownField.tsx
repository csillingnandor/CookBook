import "./RecipeForm.css";

interface OptionItem {
  value: string;
  label: string;
}

interface BasicDropDownFieldProps {
  label: string;
  value: string;
  options: OptionItem[];
  onChange: (value: string) => void;
}

/**
 * @remarks Egyszerű legördülő mező komponens.
 * @param label A legördülő mező címkéje
 * @param value A kiválasztott érték
 * @param options Az elérhető opciók listája
 * @param onChange Eseménykezelő a kiválasztott érték változására
 * @returns 
 */

export const BasicDropDownField = ({
  label,
  value,
  options,
  onChange,
}: BasicDropDownFieldProps) => {
  return (
    <label className="form-field">
      {label}
      <select
        value={value}
        onChange={(e) => onChange((e.currentTarget as HTMLSelectElement).value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
};
