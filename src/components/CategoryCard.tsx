
import "./CategoryCard.css"

interface CategoryCardProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: () => void;      // opcionális törlés
  canDelete?: boolean;        // pl. "Összes" esetén false
}

export const CategoryCard = ({
  name,
  isSelected,
  onClick,
  onDelete,
  canDelete = true,
}: CategoryCardProps) => {
  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation(); // ne válassza ki a kategóriát is
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <button
      type="button"
      className={
        isSelected
          ? "category-card category-card--selected"
          : "category-card"
      }
      onClick={onClick}
    >
      <span className="category-card__label" title={name}>
        {name}
      </span>

      {canDelete && onDelete && (
        <span
          className="category-card__delete"
          onClick={handleDeleteClick}
          aria-label={`${name} kategória törlése`}
        >
          ✕
        </span>
      )}
    </button>
  );
};
