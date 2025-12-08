
import "./AddRecipeButton.css";

interface AddRecipeButtonProps {
  onClick: () => void;
}

/**
 * @remarks Egyszerű gomb komponens egy új recept hozzáadásához.
 * @param onClick A gombra kattintás eseménykezelője
 * @returns Egy gomb komponens, amely egy "+" jelet jelenít meg, és az onClick eseménykezelőt hívja meg kattintáskor.
 */

export const AddRecipeButton = ({ onClick }: AddRecipeButtonProps) => {
  return (
    <button
      type="button"
      className="add-recipe-button"
      onClick={onClick}
    >
      +
    </button>
  );
};
