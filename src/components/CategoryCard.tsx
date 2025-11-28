import "./CategoryList.css";

interface CategoryCardProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

export const CategoryCard = ({ name, isSelected, onClick }: CategoryCardProps) => {
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
      {name}
    </button>
  );
};
