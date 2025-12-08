import { CategoryCard } from "./CategoryCard";
import "./CategoryList.css";

interface CategoryListProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
  onDeleteCategory?: (name: string) => void;  
}

export const CategoryList = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onDeleteCategory,
}: CategoryListProps) => {

  const allCategories = ["Összes", ...categories.filter((c) => c !== "Összes")];

  return (
    <aside className="category-list">
      {allCategories.map((cat) => (
        <CategoryCard
          key={cat}
          name={cat}
          isSelected={selectedCategory === cat}
          onClick={() => onSelectCategory(cat)}
          canDelete={cat !== "Összes"}
          onDelete={
            cat !== "Összes" && onDeleteCategory
              ? () => onDeleteCategory(cat)
              : undefined
          }
        />
      ))}
    </aside>
  );
};
