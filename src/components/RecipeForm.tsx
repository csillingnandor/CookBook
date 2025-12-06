import { useState, useEffect } from "preact/hooks";
import { Recipe } from "../types/Recipe";
import { Ingredient } from "../types/Ingredient";
import "./RecipeForm.css";
import { TimeRangeKey } from "../types/recipeMeta";
import { IngredientEditor } from "./IngredientEditor";
import { InstructionEditor } from "./InstructionEditor";
import { BasicDropDownField } from "./BasicDropDownField";
import { FormError } from "./FormError";

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

    const [errors, setErrors] = useState<{
        title?: string;
        ingredientName?: string;
        ingredientAmount?: string;
        instructionText?: string;
    }>({});



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
            setFieldError("ingredientName", "A hozzávaló neve kötelező.");
            return;
        }
        clearFieldError("ingredientName");


        if (!amountStr) {
            setFieldError("ingredientAmount", "A mennyiség megadása kötelező.");
            return;
        }
        clearFieldError("ingredientAmount");


        const amount = Number(amountStr);
        if (Number.isNaN(amount)) {
            setFieldError(
                "ingredientAmount",
                "A mennyiségnek számnak kell lennie (pl. 200)."
            );
            return;
        }
        clearFieldError("ingredientAmount");


        if (amount < 0) {
            setFieldError("ingredientAmount", "A mennyiség nem lehet negatív.");
            return;
        }


        const newIngredient: Ingredient = { name, amount, unit };
        setIngredients((prev) => [...prev, newIngredient]);
        resetIngredientFields();
    };

    const setFieldError = (field: keyof typeof errors, message: string) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    const clearFieldError = (field: keyof typeof errors) => {
        setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };



    const handleRemoveIngredient = (index: number) => {
        setIngredients((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddInstruction = () => {
        const trimmed = instructionText.trim();

        if (!trimmed) {
            setFieldError("instructionText", "A lépés szövege nem lehet üres.");
            return;
        }

        clearFieldError("instructionText");
        setInstructions((prev) => [...prev, trimmed]);
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

        let hasError = false;

        // Cím kötelező
        if (!title.trim()) {
            setFieldError("title", "A recept címe kötelező.");
            hasError = true;
        } else {
            clearFieldError("title");
        }

        // Legalább 1 hozzávaló
        if (ingredients.length === 0) {
            setFieldError(
                "ingredientName",
                "Adj meg legalább egy hozzávalót."
            );
            hasError = true;
        } else if (errors.ingredientName) {
            // ha korábban volt hiba, de most már van hozzávaló
            clearFieldError("ingredientName");
        }

        // Legalább 1 lépés
        if (instructions.length === 0) {
            setFieldError(
                "instructionText",
                "Adj meg legalább egy lépést az elkészítéshez."
            );
            hasError = true;
        } else if (errors.instructionText) {
            clearFieldError("instructionText");
        }

        if (hasError) {
            return; // ne mentsen, ha bármelyik hiba fennáll
        }

        // 🔽 timeRange → konkrét perc érték
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
                <FormError message={errors.title} />
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
                nameError={errors.ingredientName}
                amountError={errors.ingredientAmount}
            />


            {/* INSTRUKCIÓK LÉPÉSRŐL LÉPÉSRE */}
            <InstructionEditor
                instructions={instructions}
                textValue={instructionText}
                onChangeText={setInstructionText}
                onAdd={handleAddInstruction}
                onRemove={handleRemoveInstruction}
                error={errors.instructionText}
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
