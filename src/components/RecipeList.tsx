import { useState } from "preact/hooks";
import { Recipe } from "../types/Recipe";
import { RecipeCard } from "./RecipeCard";
import "./RecipeList.css";

interface RecipeListProps {
  recipes: Recipe[];
}

export const RecipeList = ({ recipes }: RecipeListProps) => {
  const [selected, setSelected] = useState<Recipe | null>(null);

  return (
    <div className="recipe-list-container">
      <h1>Receptlista</h1>

      <div className={selected ? "recipe-grid selected-active" : "recipe-grid"}>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => setSelected(recipe)}
            isSelected={selected?.id === recipe.id}
          />
        ))}
      </div>
    </div>
  );
};
