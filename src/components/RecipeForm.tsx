import { useState, useEffect } from "preact/hooks";
import { Recipe } from "../types/Recipe";
import { Ingredient } from "../types/Ingredient";
import "./RecipeForm.css";
import { TimeRangeKey } from "../types/recipeMeta";
import { IngredientEditor } from "./IngredientEditor";
import { InstructionEditor } from "./InstructionEditor";
import { BasicDropDownField } from "./BasicDropDownField";

// ha bevezetted, ezeket érdemes importálni a típusokhoz:
// import type { Difficulty, PriceLevel } from "../types/Recipe";

interface RecipeFormProps {
    onSave: (data: Omit<Recipe, "id">, idToUpdate?: number | null) => void;
    onClose: () => void;
    initialRecipe?: Recipe | null;
    categories: string[];
}


export const RecipeForm = ({
    onSave,
    onClose,
    initialRecipe,
    categories,
}: RecipeFormProps) => {
    const isEditMode = !!initialRecipe;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<string>("");

    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [ingredientName, setIngredientName] = useState("");
    const [ingredientAmount, setIngredientAmount] = useState("");
    const [ingredientUnit, setIngredientUnit] = useState("");

    const [instructions, setInstructions] = useState<string[]>([]);
    const [instructionText, setInstructionText] = useState("");

    const [imagePreview, setImagePreview] = useState<string | undefined>();

    // 🔽 ÚJ: időintervallum, nehézség, ár
    const [timeRange, setTimeRange] = useState<TimeRangeKey | "">("");
    const [difficulty, setDifficulty] = useState<string>("");   // pl. "könnyű" | "közepes" | "nehéz"
    const [priceLevel, setPriceLevel] = useState<string>("");   // pl. "olcsó" | "megfizethető" | "drága"

    // EDIT mód: amikor kapunk initialRecipe-et, töltsük ki a mezőket
    useEffect(() => {
        if (!initialRecipe) {
            setTitle("");
            setDescription("");
            setIngredients([]);
            setInstructions([]);
            setImagePreview(undefined);
            setCategory("");
            setIngredientName("");
            setIngredientAmount("");
            setIngredientUnit("");
            setInstructionText("");

            // új mezők reset
            setTimeRange("");
            setDifficulty("");
            setPriceLevel("");

            return;
        }

        setTitle(initialRecipe.title);
        setDescription(initialRecipe.description);
        setIngredients(initialRecipe.ingredients ?? []);
        setInstructions(initialRecipe.instructions ?? []);
        setImagePreview(initialRecipe.image);
        setCategory(initialRecipe.category ?? "");
        setIngredientName("");
        setIngredientAmount("");
        setIngredientUnit("");
        setInstructionText("");

        // 🔽 initialRecipe.time → timeRange bucket
        if (typeof initialRecipe.time === "number") {
            const t = initialRecipe.time;
            let r: TimeRangeKey;
            if (t <= 10) r = "0-10";
            else if (t <= 30) r = "10-30";
            else if (t <= 60) r = "30-60";
            else r = "60+";
            setTimeRange(r);
        } else {
            setTimeRange("");
        }

        // 🔽 initialRecipe.difficulty / priceLevel
        setDifficulty((initialRecipe as any).difficulty ?? "");
        setPriceLevel((initialRecipe as any).priceLevel ?? "");
    }, [initialRecipe]);

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

        const newIngredient: Ingredient = { name, amount, unit };
        setIngredients((prev) => [...prev, newIngredient]);
        resetIngredientFields();
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddInstruction = () => {
        const text = instructionText.trim();
        if (!text) return;
        setInstructions((prev) => [...prev, text]);
        setInstructionText("");
    };

    const handleRemoveInstruction = (index: number) => {
        setInstructions((prev) => prev.filter((_, i) => i !== index));
    };

    const handleImageChange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string); // <-- data URL
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: Event) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("A recept címe kötelező.");
            return;
        }

        // 🔽 timeRange → konkrét perc érték (a range középtájára/határára lőve)
        let time: number | undefined;
        switch (timeRange) {
            case "0-10":
                time = 10;
                break;
            case "10-30":
                time = 30;
                break;
            case "30-60":
                time = 60;
                break;
            case "60+":
                time = 90;
                break;
            default:
                time = undefined;
        }

        const recipeData: Omit<Recipe, "id"> = {
            title: title.trim(),
            description: description.trim().slice(0, 300),
            ingredients,
            instructions,
            image: imagePreview ?? initialRecipe?.image,
            category: category || undefined,

            // 🔽 ÚJ mezők
            time,
            difficulty: (difficulty || undefined) as any,
            priceLevel: (priceLevel || undefined) as any,
        };

        onSave(recipeData, initialRecipe?.id ?? null);
    };

    return (
        <form className="new-recipe-form" onSubmit={handleSubmit as any}>
            <h2>{isEditMode ? "Recept szerkesztése" : "Új recept"}</h2>

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
                        maxLength={300}   // 🔽 max 300 karakter
                        onInput={(e) =>
                            setDescription((e.target as HTMLTextAreaElement).value)
                        }
                        placeholder="Röviden a receptről… (max. 300 karakter)"
                    />

                </label>
            </div>

            <div className="form-row">
                <label>
                    Kategória
                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory((e.target as HTMLSelectElement).value)
                        }
                    >
                        <option value="">Nincs kategória</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* 🔽 ÚJ BLOKK: idő, nehézség, ár */}

            <div className="form-row form-row--inline-3">
                <BasicDropDownField
                    label="Elkészítési idő"
                    value={timeRange}
                    onChange={(val) => setTimeRange(val as TimeRangeKey | "")}
                    options={[
                        { value: "", label: "Nincs megadva" },
                        { value: "0-10", label: "0–10 perc" },
                        { value: "10-30", label: "10–30 perc" },
                        { value: "30-60", label: "30–60 perc" },
                        { value: "60+", label: "60+ perc" },
                    ]}
                />

                <BasicDropDownField
                    label="Nehézség"
                    value={difficulty}
                    onChange={setDifficulty}
                    options={[
                        { value: "", label: "Nincs megadva" },
                        { value: "könnyű", label: "Könnyű" },
                        { value: "közepes", label: "Közepes" },
                        { value: "nehéz", label: "Nehéz" },
                    ]}
                />

                <BasicDropDownField
                    label="Ár"
                    value={priceLevel}
                    onChange={setPriceLevel}
                    options={[
                        { value: "", label: "Nincs megadva" },
                        { value: "olcsó", label: "Olcsó" },
                        { value: "megfizethető", label: "Megfizethető" },
                        { value: "drága", label: "Drága" },
                    ]}
                />
            </div>



            <div className="form-row">
                <label>Kép (opcionális)</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange as any}
                />
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Előnézet"
                        className="new-recipe-image-preview"
                    />
                )}
            </div>

            {/* HOZZÁVALÓK */}
            <IngredientEditor
                ingredients={ingredients}
                nameValue={ingredientName}
                amountValue={ingredientAmount}
                unitValue={ingredientUnit}
                onChangeName={setIngredientName}
                onChangeAmount={setIngredientAmount}
                onChangeUnit={setIngredientUnit}
                onAdd={handleAddIngredient}
                onRemove={handleRemoveIngredient}
            />


            {/* INSTRUKCIÓK LÉPÉSRŐL LÉPÉSRE */}
            <InstructionEditor
                instructions={instructions}
                textValue={instructionText}
                onChangeText={setInstructionText}
                onAdd={handleAddInstruction}
                onRemove={handleRemoveInstruction}
            />

            <div className="new-recipe-form-actions">
                <button type="button" onClick={onClose}>
                    Mégse
                </button>
                <button type="submit">
                    {isEditMode ? "Változtatások mentése" : "Recept hozzáadása"}
                </button>
            </div>
        </form>
    );
};
