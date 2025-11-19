import { useState } from "preact/hooks";
import { Recipe } from "../types/Recipe";
import { RecipeCard } from "./RecipeCard";
import "./RecipeList.css";

interface RecipeListProps {
  recipes: Recipe[];
}

export const RecipeList = ({ recipes }: RecipeListProps) => {
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [animatingOut, setAnimatingOut] = useState(false);


  return (
    <div className="recipe-list-container">

      {!selected && <h1>Receptlista</h1>}

      {selected && (
        <button
          className="back-button"
          onClick={() => {
            setAnimatingOut(true);
            setSelected(null);  
            setTimeout(() => {
              setAnimatingOut(false);
            }, 400);
          }}

        >
          ← Vissza
        </button>
      )}





      <div className={selected ? "recipe-grid selected-active" : "recipe-grid"}>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => setSelected(recipe)}
            isSelected={selected?.id === recipe.id}
            isAnimatingOut={animatingOut}
          />

        ))}
      </div>
    </div>
  );
};
