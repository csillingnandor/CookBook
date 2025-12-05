// src/components/BasicDropDownField.tsx
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
