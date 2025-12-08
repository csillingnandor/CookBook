import { Ingredient } from "../types/Ingredient";
import { FormError } from "./FormError";
import "./IngredientEditor.css";

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

    nameError?: string;
    amountError?: string;
}

/**
 * @remarks Hozzávaló szerkesztő komponens, amely lehetővé teszi a felhasználó számára új hozzávalók hozzáadását és meglévők eltávolítását.
 * @param ingredients a hozzávalók listája
 * @param nameValue a hozzávaló név mező értéke
 * @param amountValue a hozzávaló mennyiség mező értéke
 * @param unitValue a hozzávaló mértékegység mező értéke
 * @param onChangeName eseménykezelő a név mező változására
 * @param onChangeAmount eseménykezelő a mennyiség mező változására
 * @param onChangeUnit eseménykezelő a mértékegység mező változására
 * @param onAdd eseménykezelő új hozzávaló hozzáadására
 * @param onRemove eseménykezelő hozzávaló eltávolítására
 * @param nameError opcionális hibaüzenet a név mezőhöz
 * @param amountError opcionális hibaüzenet a mennyiség mezőhöz
 * @returns 
 */

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
    nameError,
    amountError,
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
                    min="0"
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

            {(nameError || amountError) && (
                <div className="ingredient-error-row">
                    <FormError message={nameError || amountError} />
                </div>
            )}

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
