import { CategoryCard } from "./CategoryCard";
import "./CategoryList.css";

interface CategoryListProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}

export const CategoryList = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) => {
  // Összes + az összes egyedi kategória
  const allCategories = ["Összes", ...categories.filter((c) => c !== "Összes")];

  return (
    <aside className="category-list">
      {allCategories.map((cat) => (
        <CategoryCard
          key={cat}
          name={cat}
          isSelected={selectedCategory === cat}
          onClick={() => onSelectCategory(cat)}
        />
      ))}
    </aside>
  );
};
