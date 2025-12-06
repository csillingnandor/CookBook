import { Recipe } from "../types/Recipe";
import { RecipeForm } from "./RecipeForm";
import { CategoryForm } from "./CategoryForm";
import "./ModalOverlay.css";

export type ModalMode = "none" | "chooser" | "recipe" | "category";

interface ModalOverlayProps {
  mode: ModalMode;
  categories: string[];
  editingRecipe: Recipe | null;

  onClose: () => void;
  onChooseRecipe: () => void;
  onChooseCategory: () => void;

  onSaveRecipe: (
    data: Omit<Recipe, "id">,
    idToUpdate?: number | null
  ) => void;

  onSaveCategory: (name: string) => void;
}

export const ModalOverlay = ({
  mode,
  categories,
  editingRecipe,
  onClose,
  onChooseRecipe,
  onChooseCategory,
  onSaveRecipe,
  onSaveCategory,
}: ModalOverlayProps) => {
  if (mode === "none") return null;

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        {mode === "chooser" && (
          <div className="add-chooser">
            <h2>Mit szeretnél hozzáadni?</h2>
            <div className="add-chooser-buttons">
              <button type="button" onClick={onChooseRecipe}>
                Új recept
              </button>
              <button type="button" onClick={onChooseCategory}>
                Új kategória
              </button>
            </div>
          </div>
        )}

        {mode === "recipe" && (
          <RecipeForm
            initialRecipe={editingRecipe}
            onSave={onSaveRecipe}
            onClose={onClose}
            categories={categories}
          />
        )}

        {mode === "category" && (
          <CategoryForm
            onSave={(name) => {
              onSaveCategory(name);
            }}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};
