
import "./CategoryCard.css"

interface CategoryCardProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: () => void;      
  canDelete?: boolean;        
}

/**
 * @remarks Kategória kártya komponens, amely megjeleníti a kategória nevét, és lehetőséget biztosít a kategória kiválasztására és törlésére.
 * @param name a kategória neve
 * @param onClick a kategória kiválasztásának eseménykezelője
 * @param onDelete a kategória törlésének eseménykezelője
 * @param canDelete ha true, megjelenik a törlés ikon, alapértelmezett érték: true
 * @param isSelected a kategória kiválasztott állapota
 * @returns 
 */

export const CategoryCard = ({
  name,
  isSelected,
  onClick,
  onDelete,
  canDelete = true,
}: CategoryCardProps) => {
  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation(); 
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
