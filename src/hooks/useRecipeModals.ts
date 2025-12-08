import { useState } from "preact/hooks";
import type { Recipe } from "../types/Recipe";
import type { ModalMode } from "../components/ModalOverlay";

/**
 * @remarks Testreszabott hook a modal ablakok kezeléséhez a recept alkalmazásban.
 * @returns 
 */

export function useRecipeModals() {
  const [modalMode, setModalMode] = useState<ModalMode>("none");
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // --- Modal vezérlés ---

  const openEditForm = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setModalMode("recipe");
  };

  const openChooserModal = () => {
    setModalMode("chooser");
    setEditingRecipe(null);
  };

  const openRecipeModal = () => {
    setModalMode("recipe");
    setEditingRecipe(null);
  };

  const openCategoryModal = () => {
    setModalMode("category");
    setEditingRecipe(null);
  };

  const closeModal = () => {
    setModalMode("none");
    setEditingRecipe(null);
  };

  return {
    modalMode,
    editingRecipe,
    openEditForm,
    openChooserModal,
    openRecipeModal,
    openCategoryModal,
    closeModal,
  };
}
