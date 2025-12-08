import "./FilterRecipesButton.css"

interface FilterRecipesButtonProps {
  onClick: () => void;
}
/**
 * @remarks Egyszerű gomb komponens a receptek szűréséhez.
 * @param onClick A gombra kattintás eseménykezelője 
 * @returns 
 */
export const FilterRecipesButton = ({ onClick }: FilterRecipesButtonProps) => {
  return (
    <button
      type="button"
      className="filter-recipe-button"
      onClick={onClick}
    >
      {/* szűrő ikon */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
    </button>
  );
};
