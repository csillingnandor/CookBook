import { CategoryCard } from "./CategoryCard";
import "./CategoryList.css";

interface CategoryListProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
  onDeleteCategory?: (name: string) => void;  
}
/**
 * @remarks Kategória lista komponens, amely megjeleníti a kategóriákat és kezeli a kiválasztást és törlést.
 * @param categories a kategóriák listája
 * @param selectedCategory a kiválasztott kategória neve
 * @param onSelectCategory a kategória kiválasztásának eseménykezelője
 * @param onDeleteCategory a kategória törlésének eseménykezelője
 * @returns 
 */
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
