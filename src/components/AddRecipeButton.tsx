
import "./AddRecipeButton.css";

interface AddRecipeButtonProps {
  onClick: () => void;
}

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
