import { useState, useEffect } from "preact/hooks";
import { Recipe } from "../types/Recipe";
import { Ingredient } from "../types/Ingredient";
import { RecipeCard } from "./RecipeCard";
import { InstructionList } from "./InstructionList";
import { ShoppingList } from "./ShoppingList";
import "./RecipeList.css";

interface RecipeListProps {
  recipes: Recipe[];
}

export const RecipeList = ({ recipes }: RecipeListProps) => {
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [shoppingItems, setShoppingItems] = useState<Ingredient[]>([]);

  // betöltéskor visszatöltjük a kiválasztott receptet
  useEffect(() => {
    const storedId = localStorage.getItem("selectedRecipeId");
    if (!storedId) return;

    const id = Number(storedId);
    if (Number.isNaN(id)) return;

    const found = recipes.find((r) => r.id === id);
    if (found) setSelected(found);
  }, [recipes]);

  // kiválasztott recept mentése / törlése
  useEffect(() => {
    if (selected) {
      localStorage.setItem("selectedRecipeId", String(selected.id));
    } else {
      localStorage.removeItem("selectedRecipeId");
    }
  }, [selected]);

  const handleCardClick = (recipe: Recipe) => {
    setSelected(recipe);
  };

  const handleBack = () => {
    setSelected(null);
  };

  const toggleIngredientInShoppingList = (ingredient: Ingredient) => {
    setShoppingItems((prev) => {
      const exists = prev.some(
        (ing) =>
          ing.name === ingredient.name &&
          ing.unit === ingredient.unit &&
          ing.amount === ingredient.amount
      );

      if (exists) {
        return prev.filter(
          (ing) =>
            !(
              ing.name === ingredient.name &&
              ing.unit === ingredient.unit &&
              ing.amount === ingredient.amount
            )
        );
      } else {
        return [...prev, ingredient];
      }
    });
  };

  return (
    <div className="recipe-list-container">
      {!selected && <h1>Receptlista</h1>}

      {selected && (
        <button className="back-button" onClick={handleBack}>
          ← Vissza
        </button>
      )}

      {/* LISTA nézet – csak ha nincs kiválasztott recept */}
      {!selected && (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => handleCardClick(recipe)}
              isSelected={false}
              shoppingItems={shoppingItems}
              onToggleIngredient={toggleIngredientInShoppingList}
            />
          ))}
        </div>
      )}

      {/* DETAIL nézet – csak ha van kiválasztott recept */}
      {selected && (
        <div className="detail-layout">
          <div className="detail-col detail-col--card">
            <RecipeCard
              recipe={selected}
              onClick={() => {}}
              isSelected={true}
              shoppingItems={shoppingItems}
              onToggleIngredient={toggleIngredientInShoppingList}
            />
          </div>

          <div className="detail-col detail-col--instructions">
            <InstructionList recipe={selected} />
          </div>

          <div className="detail-col detail-col--shopping">
            <ShoppingList items={shoppingItems} />
          </div>
        </div>
      )}
    </div>
  );
};
