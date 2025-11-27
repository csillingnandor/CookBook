import { useState } from "preact/hooks";
import { Recipe } from "../types/Recipe";
import { RecipeCard } from "./RecipeCard";
import { InstructionList } from "./InstructionList";
import "./RecipeList.css";

interface RecipeListProps {
  recipes: Recipe[];
}

export const RecipeList = ({ recipes }: RecipeListProps) => {
  const [selected, setSelected] = useState<Recipe | null>(null);

  const handleCardClick = (recipe: Recipe) => {
    if (selected && selected.id === recipe.id) {
      setSelected(null);
    } else {
      setSelected(recipe);
    }
  };

  const handleBack = () => {
    setSelected(null);
  };

  return (
    <div className="recipe-list-container">
      {!selected && <h1>Receptlista</h1>}

      {selected && (
        <button className="back-button" onClick={handleBack}>
          ← Vissza
        </button>
      )}

      <div
        className={`recipe-grid ${selected ? "recipe-grid--has-selected" : ""
          }`}
      >
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => handleCardClick(recipe)}
            isSelected={selected?.id === recipe.id}
          />
        ))}
      </div>


      {/* Középen a kiválasztott recept mellett jelenik meg */}
      <InstructionList recipe={selected} />
    </div>
  );
};
